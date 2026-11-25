#!/usr/bin/env python3
"""同步学期数据、世界书与只读校历。"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
periods = json.loads((ROOT / '数据/学期.json').read_text())
assert len({p['id'] for p in periods}) == len(periods)
manifest = json.loads((ROOT / 'tavern-cards-state.json').read_text())['entryManifest']['事件']
entry_for = {
    entry['path']: name for name, entry in manifest.items()
    if entry['enabled'] and entry['strategy']['type'] == 'selective'
}
activities = [event for period in periods for event in period.get('activities', [])]
assert len({event['id'] for event in activities}) == len(activities)
for event in activities:
    event['entry'] = entry_for[event['source']]


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def js_source(*files):
    return '\n\n'.join((ROOT / '脚本' / name).read_text().rstrip() for name in files)


def period_data(exclude):
    return [
        dict(period, activities=[
            {k: v for k, v in event.items() if k not in exclude}
            for event in period.get('activities', [])
        ]) for period in periods
    ]


timeline = js_source('校园时间.js', '校园消息.js')
routes = js_source('活动路由.js')
prompt_periods = compact(period_data({'source', 'window', 'places'}))
ui_data = compact(period_data({'entry', 'routePlaces', 'aliases'}))
calendar = '''<%_ const _Y = Number(getvar('stat_data.世界.起始年份', { defaults: '2020' })) || 2020; _%>
校历:
  依据: 校园.日程中正式确认、撤销与结束的记录优先；以下为预计窗口，不据此自动参与、转场、跳时或赴约。
  假期与毕业: 寒假暂按1月下旬至2月20日前后、春季开学暂按2月21日起；正式通知可调整。春节按当年农历正月初一，不固定公历月日。起始年8月为报到前；毕业日以正式通知为准，未明确时7月起进入已毕业。
  活动边界: 高二活动不因同月到来在高三自动重演。错过活动仅保留公开结果和实际参与的经历；考试成绩、未来去向和玩家承诺不能按日期自动生成。
'''
for period in periods:
    for event in period.get('activities', []):
        start, end = event['start'], event['end']
        window = event['window']
        if start and end:
            window = f"<%= _Y + {start[0]} %>/{start[1]} 至 <%= _Y + {end[0]} %>/{end[1]}（{window}）"
        calendar += f"  {event['name']}（{event['id']}）: {period['id']}，{window}；{event['places']}。\n"
(ROOT / '世界书/时间线/校历.yaml').write_text(calendar)

# Native keys still match speech. This hook supplies a fresh date gate and
# supplements activation if the current scene has already established the activity.
text = '''@@generate_before
@@always_enabled
<%_
if (typeof charLoreBook === 'string' && charLoreBook === world_info.world) {
'''+timeline+'\n\n'+routes+'''

const jyPeriods = '''+prompt_periods+''';
const jyState = getvar('stat_data', { defaults: {} }) || {};
const jyRoute = campusRoutes(jyPeriods, jyState);
define('jyCampusEvents', jyRoute.phases);
if (jyRoute.activate) await activewi(charLoreBook, jyRoute.activate, true);
if (jyRoute.period) {
_%>
当前生活阶段：<%= jyRoute.period.id %>。<%= jyRoute.period.notice %>
人物档案中的年龄、年级和教职是开局资料。后续称谓按实际年级、升学、教职变动和毕业经历；生日未知时沿用已确认年龄或使用阶段称呼。亲友到场和年龄均不能从成年仪式本身推定。
个人邀约、家长是否到场、信件、陪同与去向，以各自实际安排、已发生的事和双方选择为准。校园动态涉及既有剧情时，只引用已经公开的事实；角色可通过朋友圈、班群或传闻自然了解公开动态与校园八卦，私密独处未公开的经历严禁无端知晓。
<%_ } } _%>
'''
(ROOT / '世界书/时间线/学期生活.txt').write_text(text)

p = ROOT / '脚本/状态栏渲染引擎.js'


def replace_block(text, key, body):
    content = '\n'.join('  ' + line if line else '' for line in body.splitlines())
    text, count = re.subn(
        f'// JY_{key}_BEGIN.*?// JY_{key}_END',
        lambda _: f'// JY_{key}_BEGIN\n{content}\n  // JY_{key}_END',
        text, flags=re.S,
    )
    assert count == 1, f'JY_{key} 标记必须恰好出现一次'
    return text


html = replace_block(p.read_text(), 'PERIODS', 'const JY_PERIODS = ' + ui_data + ';')
html = replace_block(html, 'CAMPUS', timeline)
p.write_text(html)

# 开局只需要各学期的日期范围，不携带事件正文。
p = ROOT / '脚本/开局设定按钮绑定脚本.js'
bounds = [{key: period[key] for key in ('id', 'start', 'end')} for period in periods]
script = replace_block(p.read_text(), 'OPENING_CALENDAR', 'const openingPeriods = ' + compact(bounds) + ';\n' + js_source('校园时间.js'))
p.write_text(script)
