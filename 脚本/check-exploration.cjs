// NODE_PATH=/tmp/jy-expansion-check/node_modules node 脚本/check-exploration.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('jsdom');
const ejs = require('ejs');
const { z } = require('zod');
const _ = require('lodash');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('正则/状态栏界面.html');
const periods = JSON.parse(read('数据/学期.json'));
const template = read('世界书/时间线/学期生活.txt');
const cases = [['2020-08-31','高二上'],['2021-02-20','高二上'],['2021-02-21','高二下'],['2021-06-30','高二下'],['2021-07-01','暑假'],['2021-08-31','暑假'],['2021-09-01','高三上'],['2022-02-20','高三上'],['2022-02-21','高三下'],['2022-06-30','高三下'],['2022-07-01','已毕业']];
const pure = html.slice(html.indexOf('  // JY_PERIODS_BEGIN'), html.indexOf('  async function renderMemories'));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(pure + '\nthis.pick = jyPeriodFor;', sandbox);
for (const [date, id] of cases) {
  assert.equal(sandbox.pick(date, 2020)?.id, id);
  const rendered = ejs.render(template, {getvar: key => key.endsWith('起始年份') ? '2020' : key.endsWith('日期') ? date.replaceAll('-','/') : ''});
  if (id === '高二上') assert.equal(rendered.trim(), '');
  else {
    assert.ok(rendered.includes('当前生活阶段：' + id));
    for (const p of periods.filter(p => p.id !== id && p.id !== '高二上')) assert.ok(!rendered.includes('本阶段唯一新增事件：' + p.event));
  }
}
assert.equal(sandbox.pick('2031-07-04',2030).id, '暑假');
assert.equal(sandbox.pick('2021-02-30',2020),null);
assert.equal(sandbox.pick('',2020),null);
const schemaBox = {z,_}; vm.createContext(schemaBox);
vm.runInContext(read('schema.ts').replace('export const Schema','const Schema').replace(/^export type .*$/gm,'')+'\nthis.schema = Schema;', schemaBox);
const old = schemaBox.schema.parse({世界:{当前位置:'我找到的小巷'},主角:{姓名:'测试同学',重要物品:[{名称:'借书',描述:'已借未还'}]},苏晓樯:{好感度:17}});
assert.equal(old.世界.当前位置,'我找到的小巷');assert.equal(old.苏晓樯.好感度,17);assert.equal(old.主角.重要物品.length,1);assert.equal(old.探索.记录.length,0);
assert.equal(old.校园.消息.length,0);
const manifest = JSON.parse(read('tavern-cards-state.json'));
for (const alias of ['老鹰山','听风亭','旧值守屋','周伯','山路旧照']) assert.ok(manifest.entryManifest.事件.老鹰山仙人.strategy.keys.includes(alias));
assert.ok(!manifest.entryManifest.事件.远足.strategy.keys.includes('老鹰山'));
const eventEntries = Object.values(manifest.entryManifest.事件);
for (const period of periods) {
  for (const activity of period.activities || []) {
    assert.ok(read(activity.source).length > 0);
    if (period.id === '高二上') assert.ok(eventEntries.some(entry => entry.path === activity.source && entry.enabled));
  }
}
for (const [match, miss] of [['班级篮球对抗赛','路过篮球场'],['国庆返校','暑假返校'],['十佳歌手','在音乐教室上课']]) {
  const entries = input => eventEntries.filter(entry => entry.strategy?.keys?.some(key => input.includes(key)));
  assert.equal(entries(match).length,1);
  assert.equal(entries(miss).length,0);
}
const neutral = html.replace(/^```\w*\s*|\s*```$/g,'').replaceAll('{{format_message_variable::stat_data.世界.日期}}','2021/07/03').replaceAll('{{format_message_variable::stat_data.世界.起始年份}}','2020').replaceAll('{{format_message_variable::stat_data.世界.当前位置}}','我找到的小巷');
(async () => {
 const errors=[]; const vc = new VirtualConsole(); vc.on('jsdomError',e=>errors.push(e.message));
 const reads=[];
 const stored={stat_data:{探索:{记录:[{日期:'2021/07/02',类别:'线索',内容:'<img src=x onerror="attack()">只是口述',来源:'周伯告知',状态:'待核实'}]}}};
 stored.stat_data.校园={消息:[
   {标识:'sports-1',日期:'2020-10-15',渠道:'公告',标题:'原赛程',摘要:'旧安排',状态:'有效'},
   {标识:'sports-1',日期:'2020-10-16',渠道:'公告',标题:'更新赛程',摘要:'<img src=x>只是文本',状态:'已更正',活动标识:'sports',确认开始:'2020-10-20',确认结束:'2020-10-20'},
   {标识:'letter-1',日期:'2020-10-17',渠道:'来信',标题:'借书归还',摘要:'可稍后归还',状态:'有效'}
 ]};
 const snapshot=JSON.stringify(stored);
 const dom=new JSDOM('<textarea id="send_textarea">尚未发送的草稿</textarea>'+neutral,{runScripts:'dangerously',url:'http://localhost:18967',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.getCurrentMessageId=()=>7;w.getVariables=opts=>{reads.push(opts);return stored;};}});
 const w=dom.window,d=w.document;
 await new Promise(r=>w.setTimeout(r,220));
 assert.equal(d.querySelector('[data-period-select]').value,'暑假');
 const select=d.querySelector('[data-period-select]'); select.value='高三下';select.dispatchEvent(new w.Event('change'));
 assert.ok(d.querySelector('[data-calendar-events]').textContent.includes('毕业册的最后一页'));
 select.value='高二上';select.dispatchEvent(new w.Event('change'));
 assert.equal(d.querySelectorAll('[data-calendar-events] li').length,9);
 assert.match(d.querySelector('[data-calendar-events]').textContent,/体育周 · 2020-10-20（正式通知）/);
 assert.match(d.querySelector('[data-calendar-events]').textContent,/春节 · 农历正月初一 · 日期待确认/);
 const campus=d.querySelector('[data-campus-messages]');
 assert.equal(campus.open,false);
 campus.open=true;
 const channel=campus.querySelector('select');
 channel.value='公告';channel.dispatchEvent(new w.Event('change'));
 assert.equal(campus.querySelectorAll('li').length,1);
 assert.match(campus.textContent,/更新赛程/);
 assert.doesNotMatch(campus.textContent,/原赛程|借书归还/);
 assert.equal(campus.querySelector('img'),null);
 campus.open=false;
 assert.equal(d.querySelector('[data-map-location]').textContent,'当前位置：我找到的小巷');
 d.querySelector('[data-action="open-map"]').click();
 const search=d.querySelector('#jy-place-search');search.value='听风亭';search.dispatchEvent(new w.Event('input'));
 assert.equal([...d.querySelectorAll('.jy-place')].filter(p=>!p.hidden).length,1);
 assert.equal(d.querySelector('.jy-place:not([hidden])').dataset.place,'老鹰山');
 d.querySelector('.jy-map-image').dispatchEvent(new w.Event('error'));
 d.querySelector('[data-action="close-map"]').click();
 assert.equal(d.querySelector('.jy-map-modal').dataset.open,'false');
 const panel=d.querySelector('.jy-memories');panel.open=true;panel.dispatchEvent(new w.Event('toggle'));
 await new Promise(r=>w.setTimeout(r,20));
 assert.equal(d.querySelectorAll('[data-memory-list] li').length,1);
 assert.ok(reads.length);assert.ok(reads.every(v=>v.message_id===7&&v.type==='message'));
 assert.equal(d.querySelector('[data-memory-list] img'),null);
 assert.ok(d.querySelector('[data-memory-list]').textContent.includes('<img'));
 assert.equal(JSON.stringify(stored),snapshot);
 assert.equal(d.querySelector('#send_textarea').value,'尚未发送的草稿');
 assert.equal(d.querySelectorAll('[data-period-select] option').length,periods.length);
 assert.deepEqual(errors,[]);
 dom.window.close();
 console.log('PASS: 学期边界/自定义年份、EJS分期输出、旧存档缺字段、别名配置、只读DOM交互、消息层隔离、安全文本与草稿保留。');
})().catch(e=>{console.error(e);process.exitCode=1;});
