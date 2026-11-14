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

# 学期配置同步到世界书和前端（不改版本号）
python3 "$SCRIPT_DIR/脚本/生成学期.py"
python3 "$SCRIPT_DIR/脚本/生成正文场景.py"

# Step 0: 从根目录 schema.ts 生成 脚本/Zod.txt（卡内运行时 schema 的唯一事实源是 schema.ts）
node "$SCRIPT_DIR/脚本/生成Zod.mjs"
echo "  -> Zod.txt 生成完成"

# Step 1: forge pack
node "$FORGE" pack "$PROJECT"
echo "  -> forge pack 完成"

# Step 1.5: extract JSON from PNG (forge outputs PNG directly when avatar exists)
python3 -c "
import json, struct, base64, sys, os
with open('$OUTPUT_PNG', 'rb') as f:
    png = f.read()
pos = 8
found = False
while pos < len(png):
    length = struct.unpack('>I', png[pos:pos+4])[0]
    chunk_type = png[pos+4:pos+8]
    chunk_data = png[pos+8:pos+8+length]
    if chunk_type == b'tEXt':
        null_pos = chunk_data.find(b'\x00')
        if null_pos > 0 and chunk_data[:null_pos] == b'chara':
            b64 = chunk_data[null_pos+1:]
            j = json.loads(base64.b64decode(b64).decode('utf-8'))
            tmp = '暨阳中学.json.tmp'
            with open(tmp, 'w') as fw:
                json.dump(j, fw, ensure_ascii=False, indent=2)
            os.replace(tmp, '暨阳中学.json')
            found = True
            break
    pos += 12 + length
if not found:
    print('  !! PNG 中未找到 chara chunk（forge 打包失败）', file=sys.stderr)
    sys.exit(1)
"
echo "  -> JSON 提取完成"

# Step 2: inject the current JSON card data and alternate greetings into PNG
python3 -c "
import json, struct, base64, zlib, os, sys

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
# V2 兼容：character_book 必须存在 extensions 键（即使为空对象）
json_card['data']['character_book'].setdefault('extensions', {})

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

# MVU 的状态注入条目（at_depth，extensions.position == 4）必须常驻，不参与预算裁剪，
# 否则长对话里变量列表/规则可能被 ST 的 token budget 截断，导致状态系统失灵。
# 注意：ST 卡导入只认 extensions.ignore_budget（snake_case），顶层 ignoreBudget 会被忽略。
for entry in entries:
    if (entry.get('extensions') or {}).get('position') == 4:
        entry.setdefault('extensions', {})['ignore_budget'] = True

# forge pack 必须把 state 中所有 enabled 条目全部打进卡里。
# 旧版这里有一套"补注入"逻辑，但它写的是旧式 position 数值(1/2/3)且不带 extensions，
# 与 ST 的 0/1/4 + extensions.position 语义不一致，属于潜伏错位——已废弃，改为 fail-fast。
existing_comments = {e.get('comment', '') for e in entries}
missing_entries = []
for type_entries in state.get('entryManifest', {}).values():
    for entry_name, leaf in type_entries.items():
        if entry_name in existing_comments or not leaf.get('enabled', True):
            continue
        missing_entries.append(entry_name)

if missing_entries:
    print('  !! forge pack 缺条目: ' + '、'.join(missing_entries), file=sys.stderr)
    raise SystemExit('构建失败：请修复 tavern-cards-state.json 与 forge pack 的条目同步（补注入旧通道已废弃）')

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
for fn in sorted(f for f in os.listdir('开场白') if f.endswith('.txt') and f[:1].isdigit() and f != '0.txt'):
    with open(f'开场白/{fn}', 'r') as fh:
        greetings.append(fh.read())

if greetings:
    json_card['data']['alternate_greetings'] = greetings

json_tmp = '暨阳中学.json.tmp'
with open(json_tmp, 'w') as fh:
    json.dump(json_card, fh, ensure_ascii=False, indent=2)
os.replace(json_tmp, '暨阳中学.json')

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

out_png = '$OUTPUT_PNG'
# 备份上一版可用产物，再写临时文件
if os.path.exists(out_png):
    import shutil
    shutil.copyfile(out_png, out_png + '.bak')
tmp_png = out_png + '.tmp'
with open(tmp_png, 'wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n')
    for ct, cd, cl in new_chunks:
        f.write(struct.pack('>I', cl))
        f.write(ct)
        f.write(cd)
        f.write(png_crc(ct, cd))

# 回读验证：chara（以及存在时的 ccv3）必须与内存中的 JSON 深比较一致
def read_card_chunks(path):
    with open(path, 'rb') as fh:
        raw = fh.read()
    result = {}
    i = 8
    while i < len(raw):
        ln = struct.unpack('>I', raw[i:i+4])[0]
        typ = raw[i+4:i+8].decode('latin1')
        if typ == 'tEXt':
            k, v = raw[i+8:i+8+ln].split(b'\x00', 1)
            result[k.decode()] = v
        i += 12 + ln
    return result

saved = read_card_chunks(tmp_png)
def matches(key):
    if key not in saved:
        return False
    return json.loads(base64.b64decode(saved[key])) == json_card

if not matches('chara'):
    raise SystemExit('构建失败：回读 PNG 的 chara 与内存 JSON 不一致')
if 'ccv3' in saved and not matches('ccv3'):
    raise SystemExit('构建失败：回读 PNG 的 ccv3 与内存 JSON 不一致')
os.replace(tmp_png, out_png)

print(f'  -> 写入 JSON 元数据并注入 {len(greetings)} 篇 alternate greetings，产物已校验')
"

echo "=== 构建校验 ==="
python3 脚本/validate.py

echo "=== 完成 ==="
