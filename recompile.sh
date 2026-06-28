#!/bin/bash
# 一键重新编译暨阳中学角色卡
# 输出：读取 .cardrc.json 的 artifact（PNG角色卡，含嵌入式JSON + alternate greetings）

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FORGE="$HOME/.codex/skills/tavern-cards/scripts/tavern-cards-forge.mjs"
if [ ! -f "$FORGE" ]; then
  FORGE="$HOME/.claude/skills/tavern-cards/scripts/tavern-cards-forge.mjs"
fi
PROJECT="暨阳中学"

eval "$(
SCRIPT_DIR_ENV="$SCRIPT_DIR" PROJECT_ENV="$PROJECT" python3 - <<'PY'
import json, os, shlex
script_dir = os.environ['SCRIPT_DIR_ENV']
project = os.environ['PROJECT_ENV']
with open(os.path.join(script_dir, 'tavern-cards-state.json'), 'r') as fh:
    state = json.load(fh)
artifact = None
cardrc_path = os.path.join(script_dir, '.cardrc.json')
if os.path.exists(cardrc_path):
    with open(cardrc_path, 'r') as fh:
        cardrc = json.load(fh)
    artifact = cardrc.get('projects', {}).get(project, {}).get('artifact')
output_png = os.path.basename(artifact or state.get('avatar') or f"{state.get('projectName', project)}.png")
display_name = state.get('projectName') or project
card_version = state.get('version') or ''
print('OUTPUT_PNG=' + shlex.quote(output_png))
print('DISPLAY_NAME=' + shlex.quote(display_name))
print('CARD_VERSION=' + shlex.quote(card_version))
PY
)"

cd "$SCRIPT_DIR"

echo "=== 重新编译 $DISPLAY_NAME ==="

# Step 1: forge pack
node "$FORGE" pack "$PROJECT"
echo "  -> forge pack 完成"

# Step 1.5: extract JSON from PNG (forge outputs PNG directly when avatar exists)
python3 -c "
import json, struct, base64
with open('$OUTPUT_PNG', 'rb') as f:
    png = f.read()
pos = 8
while pos < len(png):
    length = struct.unpack('>I', png[pos:pos+4])[0]
    chunk_type = png[pos+4:pos+8]
    chunk_data = png[pos+8:pos+8+length]
    if chunk_type == b'tEXt':
        null_pos = chunk_data.find(b'\x00')
        if null_pos > 0 and chunk_data[:null_pos] == b'chara':
            b64 = chunk_data[null_pos+1:]
            j = json.loads(base64.b64decode(b64).decode('utf-8'))
            with open('暨阳中学.json', 'w') as fw:
                json.dump(j, fw, ensure_ascii=False, indent=2)
            break
    pos += 12 + length
"
echo "  -> JSON 提取完成"

# Step 2: inject the current JSON card data and alternate greetings into PNG
python3 -c "
import json, struct, base64, zlib, os

# Use the JSON artifact as the source of truth for metadata. This preserves
# regex replaceString details that forge may normalize differently in PNG.
with open('暨阳中学.json', 'r') as fh:
    json_card = json.load(fh)

with open('tavern-cards-state.json', 'r') as fh:
    state = json.load(fh)

avatar = state.get('avatar')
if avatar:
    json_card['avatar'] = avatar
    json_card.setdefault('data', {})['avatar'] = avatar

display_name = '$DISPLAY_NAME'
json_card['name'] = display_name
json_card.setdefault('data', {})['name'] = display_name
json_card.setdefault('data', {})['character_version'] = '$CARD_VERSION'
json_card.setdefault('data', {}).setdefault('character_book', {})['name'] = display_name

entry_sources = {}

def collect_entries(node):
    if isinstance(node, dict):
        if 'path' in node and 'uid' in node:
            entry_sources[node['uid']] = node['path']
        for value in node.values():
            collect_entries(value)
    elif isinstance(node, list):
        for value in node:
            collect_entries(value)

collect_entries(state.get('entryManifest', {}))

entries = json_card.get('data', {}).get('character_book', {}).get('entries', [])
for entry in entries:
    uid = entry.get('uid', entry.get('id'))
    source_path = entry_sources.get(uid)
    if source_path and os.path.exists(source_path):
        with open(source_path, 'r') as fh:
            entry['content'] = fh.read()

# Inject missing manifest entries that forge pack didn't include
# Match by comment name (more reliable than uid which forge may differ on)
existing_comments = {e.get('comment', '') for e in entries}
pos_map = {'before_character_definition': 1, 'after_character_definition': 2, 'at_depth': 3}
role_map = {'system': 0, 'user': 1, 'assistant': 2}
for type_entries in state.get('entryManifest', {}).values():
    for entry_name, leaf in type_entries.items():
        if entry_name in existing_comments or not leaf.get('enabled', True):
            continue
        source_path = leaf.get('path')
        if not source_path or not os.path.exists(source_path):
            continue
        strategy = leaf.get('strategy', {})
        position = leaf.get('position', {})
        pos_type = position.get('type', 'after_character_definition')
        entries.append({
            'uid': leaf.get('uid'),
            'key': strategy.get('keys', []) if isinstance(strategy.get('keys'), list) else [],
            'keysecondary': [],
            'comment': entry_name,
            'content': open(source_path, 'r').read(),
            'constant': strategy.get('type') == 'constant',
            'selective': strategy.get('type') == 'selective',
            'selectiveLogic': 0,
            'addMemo': False,
            'order': position.get('order', 0),
            'position': pos_map.get(pos_type, 1),
            'disable': False,
            'ignoreBudget': False,
            'excludeRecursion': True,
            'preventRecursion': True,
            'delayUntilRecursion': False,
            'probability': 100,
            'useProbability': True,
            'depth': position.get('depth', 0),
            'outletName': '',
            'role': role_map.get(position.get('role', 'system'), 0),
            'group': '',
            'groupOverride': False,
            'groupWeight': 100,
            'scanDepth': None,
            'caseSensitive': None,
            'matchWholeWords': None,
            'useGroupScoring': False,
            'automationId': '',
            'displayIndex': leaf.get('uid', 0),
            'sticky': None,
            'cooldown': None,
            'delay': None,
        })
        print(f'  -> 补充缺失条目: {entry_name}')

tavern_helper = json_card.get('data', {}).get('extensions', {}).get('tavern_helper')
if isinstance(tavern_helper, list):
    script_files = state.get('extensions', {}).get('tavern_helper', {}).get('scripts', {})
    source_by_name = {
        name: spec.get('script_file')
        for name, spec in script_files.items()
        if isinstance(spec, dict) and spec.get('script_file')
    }
    for section in tavern_helper:
        if not isinstance(section, list) or len(section) < 2 or section[0] != 'scripts':
            continue
        for script in section[1]:
            name = script.get('name')
            source_path = source_by_name.get(name)
            if source_path and os.path.exists(source_path):
                with open(source_path, 'r') as fh:
                    script['content'] = fh.read()

regex_sources = state.get('regex_scripts', {})
if isinstance(regex_sources, dict):
    source_spec_by_name = {
        name: spec
        for name, spec in regex_sources.items()
        if isinstance(spec, dict)
    }
    source_by_id = {
        spec.get('id'): spec.get('replace_file')
        for spec in regex_sources.values()
        if isinstance(spec, dict) and spec.get('id') and spec.get('replace_file')
    }
    source_by_name = {
        name: spec.get('replace_file')
        for name, spec in regex_sources.items()
        if isinstance(spec, dict) and spec.get('replace_file')
    }
    for script in json_card.get('data', {}).get('extensions', {}).get('regex_scripts', []):
        name = script.get('scriptName') or script.get('name')
        source_spec = source_spec_by_name.get(name)
        if source_spec:
            for key in (
                'findRegex', 'trimStrings', 'placement', 'disabled',
                'markdownOnly', 'promptOnly', 'runOnEdit', 'substituteRegex',
                'minDepth', 'maxDepth',
            ):
                if key in source_spec:
                    script[key] = source_spec[key]
        source_path = source_by_id.get(script.get('id')) or source_by_name.get(name)
        if source_path and os.path.exists(source_path):
            with open(source_path, 'r') as fh:
                content = fh.read()
            if name == '状态栏界面':
                fence = chr(96) * 3
                stripped = content.strip()
                if stripped.startswith(fence) and stripped.endswith(fence):
                    script['replaceString'] = content
                else:
                    script['replaceString'] = fence + '\\n' + content + '\\n' + fence
            else:
                script['replaceString'] = content

    regex_scripts = json_card.get('data', {}).get('extensions', {}).get('regex_scripts', [])
    order = {name: index for index, name in enumerate(regex_sources.keys())}
    regex_scripts.sort(key=lambda script: order.get(script.get('scriptName') or script.get('name'), len(order)))
# Read alternate greeting files
greetings = []
for fn in sorted(f for f in os.listdir('开场白') if f.endswith('.txt') and f != '0.txt'):
    with open(f'开场白/{fn}', 'r') as fh:
        greetings.append(fh.read())

if greetings:
    json_card['data']['alternate_greetings'] = greetings

with open('暨阳中学.json', 'w') as fh:
    json.dump(json_card, fh, ensure_ascii=False, indent=2)

# Read PNG
with open('$OUTPUT_PNG', 'rb') as f:
    png_data = f.read()

# Parse and modify
chunks = []
pos = 8
while pos < len(png_data):
    length = struct.unpack('>I', png_data[pos:pos+4])[0]
    chunk_type = png_data[pos+4:pos+8]
    chunk_data = png_data[pos+8:pos+8+length]
    crc = png_data[pos+8+length:pos+12+length]
    chunks.append((chunk_type, chunk_data, length))
    pos += 12 + length

new_chunks = []
for chunk_type, chunk_data, length in chunks:
    if chunk_type == b'tEXt' and length > 0:
        null_pos = chunk_data.find(b'\x00')
        if null_pos > 0:
            keyword = chunk_data[:null_pos].decode('ascii', errors='ignore')
            if keyword in ('chara', 'ccv3'):
                new_json = json.dumps(json_card, ensure_ascii=False, separators=(',', ':'))
                new_b64 = base64.b64encode(new_json.encode('utf-8'))
                new_data = keyword.encode('ascii') + b'\x00' + new_b64
                new_chunks.append((chunk_type, new_data, len(new_data)))
                continue
    new_chunks.append((chunk_type, chunk_data, length))

def png_crc(ct, d):
    return struct.pack('>I', zlib.crc32(ct + d) & 0xffffffff)

with open('$OUTPUT_PNG', 'wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n')
    for ct, cd, cl in new_chunks:
        f.write(struct.pack('>I', cl))
        f.write(ct)
        f.write(cd)
        f.write(png_crc(ct, cd))

print(f'  -> 写入 JSON 元数据并注入 {len(greetings)} 篇 alternate greetings')
"

echo "=== 完成 ==="
