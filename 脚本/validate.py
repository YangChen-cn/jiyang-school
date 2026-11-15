#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
暨阳中学 卡构建一致性校验器（只读，不改仓库）。

用法: python3 脚本/validate.py [仓库根目录]
接入: recompile.sh 末尾会自动调用；也可以单独跑作为发布门禁。

覆盖:
  A 产物同源   : PNG chara/ccv3 解码 == 暨阳中学.json（深比较）
  B 清单一致   : state 叶子 uid/position/enabled ↔ card entries
  C 内容一致   : path 型 entry 与源文件逐字；contents 型按片段拼接归一化比较
  D 运行资源   : tavern_helper script_file / regex replace_file 与卡内内容逐字
  E 版本一致   : state/.cardrc/card name/world/book.name/character_version/文件名/状态栏标题
  F EJS 结构   : <%_/_%> 配对、_%} 误写、非白名单 @@ 装饰器
  G Zod 覆盖   : schema.ts 字段集合 vs initvar.yaml（报告 initvar-only 字段）
  H YAML 合法  : 变量系统结构化 YAML + 创作规划（只 warn）
  I 规则覆盖   : 变量更新规则 顶层 路径.字段 是否都在 schema 声明内
  J 开场白映射 : 开场白原文、顺序与 data.alternate_greetings 一致
  K 预算       : 正文字符/token 估算、always-on 条目
"""
import base64
import json
import os
import re
import struct
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

REPO = Path(sys.argv[1] if len(sys.argv) > 1 else os.getcwd()).resolve()
errors, warns, info = [], [], []


def err(m):
    errors.append(m)


def warn(m):
    warns.append(m)


def load(p):
    return json.loads(Path(p).read_text(encoding='utf-8'))


def read(p):
    return Path(p).read_text(encoding='utf-8')


# ---------- A. 找到产物并校验同源 ----------
png = None
try:
    rc = load(REPO / '.cardrc.json')
    artifact = rc['projects']['暨阳中学']['artifact']
    if artifact:
        png = REPO / artifact
except Exception:
    pass
if not png or not png.exists():
    cands = sorted(REPO.glob('暨阳中学v*.png'))
    png = cands[-1] if cands else None

card = None
if not png or not png.exists():
    err(f'A: PNG 不存在（.cardrc artifact 与 暨阳中学v*.png 均未找到）')
else:
    raw = png.read_bytes()
    chunks, i = {}, 8
    while i < len(raw):
        ln = struct.unpack('>I', raw[i:i + 4])[0]
        typ = raw[i + 4:i + 8].decode('latin1')
        if typ == 'tEXt':
            k, v = raw[i + 8:i + 8 + ln].split(b'\x00', 1)
            chunks[k.decode()] = base64.b64decode(v)
        i += 12 + ln
    if 'chara' not in chunks or 'ccv3' not in chunks:
        err('A: PNG 缺 chara/ccv3 chunk')
    if chunks.get('chara') != chunks.get('ccv3'):
        err('A: chara 与 ccv3 不一致')
    try:
        card = json.loads(chunks.get('chara', b'{}'))
    except Exception as ex:
        err(f'A: chara 解码失败: {ex}')
    jf = REPO / '暨阳中学.json'
    if card is not None and jf.exists():
        try:
            if json.loads(jf.read_text(encoding='utf-8')) != card:
                err('A: PNG chara 解码 != 暨阳中学.json（产物未同源，重跑 recompile）')
        except Exception as ex:
            err(f'A: 暨阳中学.json 读取失败: {ex}')

if card is None:
    print('== 校验结果 ==')
    for m in errors:
        print('FAIL ', m)
    print(f'\n{len(errors)} error(s), {len(warns)} warning(s)')
    sys.exit(1)

data = card.get('data', {})
card_entries = data.get('character_book', {}).get('entries', [])

# ---------- B. state ↔ card 清单 / 位置 / 内容 ----------
state = load(REPO / 'tavern-cards-state.json')
leaves = []


def walk(node):
    if isinstance(node, dict):
        if 'uid' in node and ('path' in node or 'contents' in node):
            leaves.append(node)
        else:
            for v in node.values():
                walk(v)
    elif isinstance(node, list):
        for v in node:
            walk(v)


walk(state.get('entryManifest', {}))
by_uid = {e.get('id'): e for e in card_entries}
s_uid = {l.get('uid') for l in leaves}
c_uid = set(by_uid)
for u in sorted(s_uid - c_uid, key=str):
    err(f'B: state 有卡无 uid={u}')
for u in sorted(c_uid - s_uid, key=str):
    err(f'B: 卡有 state 无 id={u}')

pos_num = {'before_character_definition': 0, 'after_character_definition': 1, 'at_depth': 4}
for leaf in leaves:
    entry = by_uid.get(leaf.get('uid'))
    if not entry:
        continue
    st_pos = pos_num.get((leaf.get('position') or {}).get('type'))
    cd_pos = (entry.get('extensions') or {}).get('position')
    if st_pos is not None and st_pos != cd_pos:
        err(f'B: uid={leaf.get("uid")} 位置不一致 state.type={leaf["position"].get("type")} card.ext.position={cd_pos}')
    if entry.get('enabled') != leaf.get('enabled', True):
        err(f'B: uid={leaf.get("uid")} enabled 不一致 state={leaf.get("enabled")} card={entry.get("enabled")}')
    src = leaf.get('path')
    if src:
        p = REPO / src
        if not p.exists():
            err(f'C: 源文件不存在 {src}')
        elif entry.get('content') != p.read_text(encoding='utf-8'):
            err(f'C: path 型 content 与源文件不一致 {src}')
    elif isinstance(leaf.get('contents'), list):
        parts, ok = [], True
        for frag in leaf['contents']:
            if 'file' in frag:
                p = REPO / frag['file']
                if not p.exists():
                    err(f'C: 片段文件不存在 {frag["file"]}')
                    ok = False
                    continue
                parts.append(p.read_text(encoding='utf-8'))
            else:
                parts.append(frag.get('content', ''))
        if ok:
            joined = '\n'.join(parts)
            norm = lambda s: re.sub(r'\s+', '', s)
            if norm(joined) != norm(entry.get('content', '')):
                err(f'C: contents 型拼接与卡内容实质不一致 uid={leaf.get("uid")}')

# ---------- D. 脚本/正则运行资源 ----------
th = data.get('extensions', {}).get('tavern_helper')
scripts = {}
if isinstance(th, list):
    for pair in th:
        if isinstance(pair, list) and len(pair) == 2 and pair[0] == 'scripts':
            scripts = {s.get('name'): s for s in pair[1]}
st_scripts = state.get('extensions', {}).get('tavern_helper', {}).get('scripts', {})
for name, spec in st_scripts.items():
    sf = spec.get('script_file')
    if not sf:
        continue
    if name not in scripts:
        err(f'D: 卡内缺脚本 {name}')
        continue
    if scripts[name].get('content') != read(REPO / sf):
        err(f'D: 脚本 {name} 卡内 content != {sf}')

st_reg = state.get('regex_scripts', {})
card_reg = {r.get('scriptName'): r for r in data.get('extensions', {}).get('regex_scripts', [])}


def normalize_fence(content):
    fence = chr(96) * 3
    s = content.strip()
    if s.startswith(fence) and s.endswith(fence):
        return content[len(content) - len(content.lstrip()):]
    return content


for name, spec in st_reg.items():
    rf = spec.get('replace_file')
    cr = card_reg.get(name)
    if not cr:
        err(f'D: 卡内缺 regex {name}')
        continue
    if rf:
        source = read(REPO / rf)
        actual = cr.get('replaceString', '')
        if name == '状态栏界面':
            # recompile 会给状态栏包 ``` 围栏；两种形态都接受
            fence = chr(96) * 3
            stripped = source.strip()
            acceptable = {source, fence + '\n' + source + '\n' + fence,
                          fence + '\n' + stripped + '\n' + fence}
        else:
            acceptable = {source}
        if actual not in acceptable:
            err(f'D: regex {name} replaceString != {rf}')

# ---------- E. 版本一致 ----------
try:
    rc = load(REPO / '.cardrc.json')['projects']['暨阳中学']
except Exception:
    rc = {}
vers = {
    'state.projectName': state.get('projectName'),
    'state.version': state.get('version'),
    'state.avatar': state.get('avatar'),
    '.cardrc.artifact': rc.get('artifact'),
    'card.name': card.get('name'),
    'data.name': data.get('name'),
    'data.character_version': data.get('character_version'),
    'book.name': data.get('character_book', {}).get('name'),
    'world': data.get('extensions', {}).get('world'),
}


def norm(v):
    v = str(v or '')
    v = re.sub(r'\.(png|json)$', '', v)
    v = re.sub(r'^暨阳中学', '', v)
    return v[1:] if re.match(r'^v[0-9]', v) else v


tags = {norm(v) for v in vers.values()}
if len(tags) > 1:
    err(f'E: 版本号不一致: {vers}')
if rc.get('artifact') and not (REPO / str(rc.get('artifact'))).exists():
    err(f'E: artifact 文件不存在 {rc.get("artifact")}')
hp = REPO / '正则/状态栏界面.html'
if hp.exists():
    m = re.search(r'暨阳中学 v([0-9.]+) · 当前坐标', hp.read_text(encoding='utf-8'))
    if not m:
        warn('E: 状态栏标题缺版本标记（release-version.sh 正则可能静默失败）')

# ---------- F. EJS ----------
for entry in card_entries:
    c = entry.get('content', '')
    if c.count('<%_') != c.count('_%>'):
        err(f'F: EJS 不配对 {entry.get("comment")}')
    if '_%}' in c:
        err(f'F: 发现 _%}} 误写 {entry.get("comment")}')
    for m in re.finditer(r'^@@(\w+)', c, re.M):
        if m.group(1) not in {
            'activate', 'dont_activate', 'message_formatting', 'generate_before',
            'generate_after', 'render_before', 'render_after', 'dont_preload',
            'preload', 'only_preload', 'initial_variables', 'always_enabled',
            'private', 'if', 'iframe', 'preprocessing',
        }:
            err(f'F: 未知 @@{m.group(1)} 装饰器 {entry.get("comment")}')

# ---------- G. Zod ↔ initvar ----------
containers = {}
optional_fields = {}
if yaml:
    init = yaml.safe_load((REPO / '世界书/变量/initvar.yaml').read_text(encoding='utf-8')) or {}
    src = (REPO / 'schema.ts').read_text(encoding='utf-8')
    cur = None
    for line in src.split('\n'):
        m = re.match(r'^  (\S+): z\.object\(\{', line)
        if m:
            cur = m.group(1)
            containers[cur] = []
            optional_fields[cur] = set()
        elif cur and re.match(r'^  \}\),?$', line):
            cur = None
        else:
            m2 = re.match(r'^    (\S+): z\.', line)
            if cur and m2:
                containers[cur].append(m2.group(1))
                if line.rstrip(',').endswith('.optional()'):
                    optional_fields[cur].add(m2.group(1))
    for c, fields in containers.items():
        extra = sorted(set((init.get(c) or {}).keys()) - set(fields))
        if extra:
            err(f'G: initvar 有而 schema 无 {c}: {extra} → 会被 mvu_zod strip')
        miss = sorted(set(fields) - set((init.get(c) or {}).keys()) - optional_fields[c])
        if miss:
            warn(f'G: schema 有而 initvar 无 {c}: {miss}')

# ---------- H. YAML 合法性 ----------
if yaml:
    for p in [REPO / '世界书/变量/initvar.yaml', REPO / '世界书/变量/变量更新规则.yaml']:
        if p.exists():
            try:
                yaml.safe_load(p.read_text(encoding='utf-8'))
            except Exception as ex:
                err(f'H: 结构化 YAML 解析失败 {p.relative_to(REPO)}: {str(ex).splitlines()[0]}')
    p = REPO / '创作规划.yaml'
    if p.exists():
        try:
            yaml.safe_load(p.read_text(encoding='utf-8'))
        except Exception as ex:
            warn(f'H: {p.name} 解析失败(当前不参与构建，仅文档债): {str(ex).splitlines()[0]}')

    # ---------- I. 规则路径覆盖 ----------
    try:
        rules = yaml.safe_load((REPO / '世界书/变量/变量更新规则.yaml').read_text(encoding='utf-8'))['变量更新规则']
        known = set(containers)
        covered = {}
        for k, v in rules.items():
            if '.' not in k or '|' in k or '{' in k:
                continue
            cont, field = k.split('.', 1)
            if cont not in known:
                err(f'I: 规则路径顶层容器不存在: {k}')
            elif field not in containers[cont]:
                err(f'I: 规则字段不在 schema: {k} → 写入会被 strip/新建垃圾键')
            if isinstance(v, dict):
                for kk in v:
                    if '.' in str(kk):
                        err(f'I: 疑似缩进错误: "{kk}" 被嵌套进 "{k}" 子树')
            if field == 'NSFW' and isinstance(v, dict) and v.get('type') != 'boolean':
                err(f'I: NSFW 规则类型应为 boolean: {k}.type={v.get("type")}')
        for k in rules:
            m = re.match(r'^\$\{(.+?)\}\.(.+)$', k)
            if m:
                for c in m.group(1).split('|'):
                    covered.setdefault(m.group(2), set()).add(c)
        for c, fields in containers.items():
            if c in ('世界', '剧情', '主角') or '好感度' not in fields:
                continue
            if c not in covered.get('好感度', set()) and f'{c}.好感度' not in rules:
                err(f'I: 缺好感度规则: {c}.好感度')
    except Exception as ex:
        err(f'I: 变量更新规则解析失败: {ex}')

# ---------- J. 开场白映射 ----------
gdir = REPO / '开场白'
if gdir.exists():
    files = sorted([f for f in gdir.glob('*.txt') if re.match(r'^\d', f.name) and f.name != '0.txt'])
    alt = data.get('alternate_greetings', [])
    if len(files) != len(alt):
        err(f'J: alternate_greetings 数量不一致 files={len(files)} card={len(alt)}')
    for source, greeting in zip(files, alt):
        if source.read_text(encoding='utf-8') != greeting:
            err(f'J: alternate_greetings 正文或顺序不一致 {source.name}')

# ---------- L. 常驻预算豁免 ----------
# ST 只认 extensions.ignore_budget（snake_case）；at_depth(position=4) 的状态条目必须设置，
# 否则长对话里变量列表/规则会被 token budget 裁掉。
for e in card_entries:
    if (e.get('extensions') or {}).get('position') == 4 and not (e.get('extensions') or {}).get('ignore_budget'):
        err(f'L: at_depth 条目未设置 extensions.ignore_budget: {e.get("comment")}')

# ---------- K. 预算 ----------
def est(s):
    cjk = sum(1 for ch in s if '\u4e00' <= ch <= '\u9fff' or '\u3000' <= ch <= '\u303f' or '\uff00' <= ch <= '\uffef')
    return round(cjk + (len(s) - cjk) / 3.6)


tot_c = sum(len(e.get('content', '')) for e in card_entries)
tot_t = sum(est(e.get('content', '')) for e in card_entries)
always = [e for e in card_entries if e.get('constant') or (e.get('extensions') or {}).get('position') == 4]
info.append(f'K: {len(card_entries)} 条正文 {tot_c} chars ≈ {tot_t} tokens(启发式)')
info.append(f'K: always-on {len(always)} 条 {sum(len(e.get("content", "")) for e in always)} chars')
top = sorted(card_entries, key=lambda e: -est(e.get('content', '')))[:5]
info.append('K: top5 ' + ', '.join(f'{e.get("comment")}={est(e.get("content", ""))}t' for e in top))

print('== 校验结果 ==')
for m in info:
    print('INFO ', m)
for m in warns:
    print('WARN ', m)
for m in errors:
    print('FAIL ', m)
print(f'\n{len(errors)} error(s), {len(warns)} warning(s)')
sys.exit(1 if errors else 0)
