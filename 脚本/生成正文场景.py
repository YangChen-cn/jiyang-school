#!/usr/bin/env python3
"""正文与地点册共享地点别名和图床地址。"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
engine = (root / '脚本/状态栏渲染引擎.js').read_text(encoding='utf-8')

scenes_match = re.search(
    r'// JY_MAP_SCENES_BEGIN\s*const MAP_SCENES = (\{.*?\});\s*// JY_MAP_SCENES_END',
    engine,
    flags=re.S,
)
if not scenes_match:
    raise ValueError('状态栏渲染引擎.js 中未找到 JY_MAP_SCENES_BEGIN/END')
photos = json.loads(scenes_match.group(1))

places_match = re.search(
    r'// JY_MAP_PLACES_BEGIN\s*const MAP_PLACES = (\[.*?\]);\s*// JY_MAP_PLACES_END',
    engine,
    flags=re.S,
)
if not places_match:
    raise ValueError('状态栏渲染引擎.js 中未找到 JY_MAP_PLACES_BEGIN/END')
groups = json.loads(places_match.group(1))

places = []
for group in groups:
    for item in group.get('items', []):
        name = item['place']
        aliases = item.get('aliases', [])
        key = item['scene']
        places.append([name, aliases, key])
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
    script.read_text(encoding='utf-8'),
    flags=re.S,
)
if count != 1:
    raise ValueError('正文场景生成标记数量必须为一')
script.write_text(updated, encoding='utf-8')
