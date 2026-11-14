#!/usr/bin/env python3
"""正文与地点册共享地点别名和图床地址。"""
import html
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
status = (root / '正则/状态栏界面.html').read_text()
photos = {
    key: json.loads(pair)
    for key, pair in re.findall(r'^    (\w+): (\["[^"\n]+", "https://cdn\.jsdelivr\.net/gh/YangChen-cn/jiyang-school-assets@[^"\n]+"\]),?$', status, re.M)
}
places = []
for name, aliases, key in re.findall(r'<details class="jy-place" data-place="([^"]+)" data-aliases="([^"]*)" data-scene="([^"]+)">', status):
    places.append([html.unescape(name), html.unescape(aliases).split('|'), key])
    if key not in photos:
        raise ValueError(f'地点没有可用图片：{name}')
expected = {path.stem for path in (root / '世界书/地理/地点').glob('*.yaml')}
covered = {place[0] for place in places}
if expected != covered:
    raise ValueError(f'地点配图与世界书不一致：{sorted(expected ^ covered)}')
script = root / '脚本/正文对白.js'
data = json.dumps({'places': places, 'photos': photos}, ensure_ascii=False, separators=(',', ':'))
updated, count = re.subn(
    r'  // JY_SCENES_BEGIN\n.*?  // JY_SCENES_END',
    lambda _: f'  // JY_SCENES_BEGIN\n  const scenes = {data};\n  // JY_SCENES_END',
    script.read_text(), flags=re.S,
)
if count != 1:
    raise ValueError('正文场景生成标记数量必须为一')
script.write_text(updated)
