#!/usr/bin/env python3
"""学期数据只维护 数据/学期.json；同步只读前端与当前学期提示词。"""
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
periods = json.loads((ROOT / '数据/学期.json').read_text())
assert len({p['id'] for p in periods}) == len(periods)
compact = json.dumps(periods, ensure_ascii=False, separators=(',', ':'))
calendar = '''<%_ const _Y = Number(getvar('stat_data.世界.起始年份', { defaults: '2020' })) || 2020; _%>
校历:
  依据: 当前日期、星期与已公布通知优先；窗口不自动触发参与、转场、跳时或赴约。学校自定日期是故事安排，不代表真实学校通知。
  高二上: <%= _Y %>年9月开学周；10月国庆及体育周；11月期中与远足；12月艺术周；次年1月元旦与期末。具体活动沿用现有条目。
  假期与毕业: 寒假暂按1月下旬至2月20日前后、春季开学暂按2月21日起；正式通知可调整。春节按当年农历正月初一，不固定公历月日。起始年8月为报到前；毕业日以正式通知为准，未明确时7月起进入已毕业。
  活动边界: 高二活动不因同月到来在高三自动重演。错过活动仅保留公开结果和实际参与的经历；考试成绩、未来去向和玩家承诺不能按日期自动生成。
'''
for period in periods:
    if period['id'] in ('高二上', '已毕业'):
        continue
    start, end = period['start'], period['end']
    calendar += f"  {period['id']}: <%= _Y + {start[0]} %>/{start[1]} 至 <%= _Y + {end[0]} %>/{end[1]}；{period['window']}，{period['event']}。\n"
(ROOT/'世界书/时间线/校历.yaml').write_text(calendar)
# EJS uses current message variables. Only the current period body enters the prompt.
text='''<%_
const jyPeriods = '''+compact+''';
const jyY = Number(getvar('stat_data.世界.起始年份', { defaults: '2020' })) || 2020;
const jyDate = String(getvar('stat_data.世界.日期', { defaults: '' })).replaceAll('/', '-');
const jyAnchor = edge => `${jyY + edge[0]}-${edge[1]}`;
const jyAcademic = String(getvar('stat_data.剧情.学期', { defaults: '' }));
let jyPeriod = /^\\d{4}-\\d{2}-\\d{2}$/.test(jyDate) ? jyPeriods.find(p => jyDate >= jyAnchor(p.start) && jyDate <= jyAnchor(p.end)) : null;
if (jyAcademic === '已毕业') jyPeriod = jyPeriods.find(p => p.id === '已毕业');
if (jyPeriod && jyPeriod.id !== '高二上') {
_%>
当前生活阶段：<%= jyPeriod.id %>
本阶段唯一新增事件：<%= jyPeriod.event %>（<%= jyPeriod.window %>）
<%= jyPeriod.detail %>
窗口外只作筹备或实际发生后的余波；不要仅因条目加载就让活动开始。先回应玩家行动，无指定路线、同伴和必做事项。是否报名、提交、借阅、署名与赴约都由玩家明确决定。
<%_ } _%>
'''
(ROOT/'世界书/时间线/学期生活.txt').write_text(text)
p=ROOT/'正则/状态栏界面.html';html=p.read_text()
html,n=re.subn(r'// JY_PERIODS_BEGIN.*?// JY_PERIODS_END','// JY_PERIODS_BEGIN\n  const JY_PERIODS = '+compact+';\n  // JY_PERIODS_END',html,flags=re.S)
assert n==1,'学期数据标记必须恰好出现一次'
p.write_text(html)
