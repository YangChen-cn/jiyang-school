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
const pure = html.slice(html.indexOf('  // JY_PERIODS_BEGIN'), html.indexOf('  function bindSceneReadouts'));
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
assert.equal(old.世界.当前位置,'我找到的小巷');assert.equal(old.苏晓樯.好感度,17);assert.equal(old.主角.重要物品.length,1);
assert.equal(old.校园.有效公告.length,0);
assert.equal(old.校园.动态流.length,0);
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
   {标识:'letter-1',日期:'2020-10-17',渠道:'来信',标题:'借书归还',摘要:'可稍后归还',状态:'有效'},
   {标识:'campus-1',日期:'2020-10-18',渠道:'八卦',来源:'操场闲聊',标题:'有人说比赛改期',摘要:'消息待核实',状态:'有效',活动标识:'sports',确认开始:'2020-11-20',确认结束:'2020-11-20'}
 ]};
 stored.stat_data.校园.消息.unshift(...Array.from({length:7},(_,i)=>({
   标识:'old-'+i, 日期:'2020-10-10', 渠道:'趣事', 标题:'旧帖'+i, 摘要:'课间随记', 状态:'有效'
 })));
 const summerNotice={标识:'summer-1',渠道:'班群',来源:'老师',标题:'夏季值班',摘要:'<img src=x>只是一条通知',活动标识:'summer-practice',确认开始:'2021-07-01',确认结束:'2021-08-15',状态:'有效'};
 stored.stat_data.校园.消息.push(summerNotice);
 const activityIds=periods.flatMap(p=>(p.activities || []).map(a=>a.id));
 const callbackBox={z,_,registerMvuSchema:()=>{},waitGlobalInitialized:async()=>{},Mvu:{events:{BEFORE_MESSAGE_UPDATE:'before'}},eventOn(name,callback){if(name==='before')callbackBox.write=callback;},$:(fn)=>fn()};
 vm.createContext(callbackBox);
 await vm.runInContext(read('脚本/Zod.txt').replace(/^import .*$/m,'').replace('export const Schema','const Schema'),callbackBox);
 const state={世界:{日期:'2021/07/03'},校园:structuredClone(stored.stat_data.校园)};
 const update=()=>callbackBox.write({variables:{stat_data:state}});
 update();
 assert.equal(state.校园.消息,undefined);
 assert.equal(state.校园.有效公告.length,1);
 assert.equal(state.校园.日程.sports.开始,'2020-10-20');
 assert.equal(state.校园.日程.sports.状态,'已结束');
 const schoolNotice=(id,start)=>({...summerNotice,标识:id,活动标识:id,确认开始:start,确认结束:start});
 state.校园.有效公告.push(schoolNotice('arts','2021-07-08'),schoolNotice('midterm','2021-07-09'),schoolNotice('national','2022-01-01'));
 update();
 assert.equal(state.校园.有效公告.length,3);
 for(let i=0;i<24;i++) {
   state.校园.动态流.push({...summerNotice,标识:'post-'+i,渠道:'八卦'});
   update();
 }
 assert.equal(JSON.stringify(state.校园.有效公告.map(post=>post.标识)),JSON.stringify(['summer-1','arts','midterm']));
 assert.equal(state.校园.动态流.length,6);
 assert.equal(state.校园.动态流[0].标识,'post-18');
 assert.equal(state.校园.动态流[0].确认开始,undefined);
 assert.equal(state.校园.日程.national.开始,'2022-01-01');
 state.校园.有效公告.push({...summerNotice,标识:'summer-2',确认开始:'2021-07-05',点赞:['甲','甲','乙'],互动:[{用户:'甲',内容:'收到'}]});
 update();
 assert.equal(state.校园.有效公告.filter(post=>post.活动标识==='summer-practice').length,1);
 assert.equal(state.校园.日程['summer-practice'].开始,'2021-07-05');
 const edited=state.校园.有效公告.find(post=>post.标识==='summer-2');
 assert.equal(edited.点赞.length,2);
 assert.equal(edited.互动.length,1);
 state.校园.有效公告.push({...edited,状态:'已撤销',确认开始:'',确认结束:''});
 update();
 assert.equal(state.校园.日程['summer-practice'].状态,'已撤销');
 assert.ok(!state.校园.有效公告.some(post=>post.活动标识==='summer-practice'));
 state.世界.日期='2021/07/09';
 update();
 assert.equal(state.校园.日程.arts.状态,'已结束');
 assert.deepEqual(Array.from(state.校园.有效公告, post=>post.标识),['midterm']);
 const snapshot=JSON.stringify(stored);
 const dom=new JSDOM('<textarea id="send_textarea">尚未发送的草稿</textarea>'+neutral,{runScripts:'dangerously',url:'http://localhost:18967',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.getCurrentMessageId=()=>7;w.getVariables=opts=>{reads.push(opts);return stored;};}});
 const w=dom.window,d=w.document;
 await new Promise(r=>w.setTimeout(r,220));
 assert.equal(d.querySelector('[data-period-select]').value,'暑假');
 const select=d.querySelector('[data-period-select]'); select.value='高三下';select.dispatchEvent(new w.Event('change'));
 assert.ok(d.querySelector('[data-calendar-events]').textContent.includes('最后一课与毕业散伙狂欢夜'));
 select.value='高二上';select.dispatchEvent(new w.Event('change'));
 assert.equal(d.querySelectorAll('[data-calendar-events] li').length,8);
 assert.doesNotMatch(d.querySelector('[data-calendar-events]').textContent,/艺术周/);
 select.value='高二下';select.dispatchEvent(new w.Event('change'));
 assert.ok([...d.querySelectorAll('.jy-calendar-entry')].some(row => row.querySelector('strong').textContent === '艺术周' && row.querySelector('.jy-event-window').textContent === '4月'));
 select.value='高二上';select.dispatchEvent(new w.Event('change'));
 assert.ok([...d.querySelectorAll('.jy-calendar-entry')].some(row => row.querySelector('strong').textContent === '体育周' && row.querySelector('.jy-event-window').textContent === '2020-10-20（正式通知）'));
 assert.ok([...d.querySelectorAll('.jy-calendar-entry')].some(row => row.querySelector('strong').textContent === '春节' && row.querySelector('.jy-event-state').textContent === '日期待确认'));
 const campus=d.querySelector('[data-campus-messages]');
 const feed=campus.querySelector('[data-campus-list]');
 const announcements=campus.querySelector('[data-campus-announcements]');
 assert.equal(campus.open,false);
 assert.equal(feed.querySelectorAll('li').length,6);
 assert.match(feed.querySelector('li').textContent,/有人说比赛改期/);
 assert.doesNotMatch(campus.textContent,/旧帖0|旧帖1/);
 assert.equal(announcements.querySelectorAll('li').length,1);
 assert.match(announcements.textContent,/夏季值班/);

 campus.open=true;
 const channel=campus.querySelector('select');
 channel.value='公告';channel.dispatchEvent(new w.Event('change'));
 assert.equal(feed.querySelectorAll('li').length,0);
 assert.match(announcements.textContent,/夏季值班/);
 assert.equal(campus.querySelector('img'),null);
 channel.value='八卦';channel.dispatchEvent(new w.Event('change'));
 assert.equal(feed.querySelectorAll('li').length,1);
 assert.match(feed.textContent,/有人说比赛改期/);
 campus.open=false;
 assert.equal(d.querySelector('[data-map-location]').textContent,'当前位置：我找到的小巷');
 d.querySelector('[data-action="open-map"]').click();
 const search=d.querySelector('#jy-place-search');search.value='听风亭';search.dispatchEvent(new w.Event('input'));
 assert.equal([...d.querySelectorAll('.jy-place')].filter(p=>!p.hidden).length,1);
 assert.equal(d.querySelector('.jy-place:not([hidden])').dataset.place,'老鹰山');
 d.querySelector('.jy-map-image').dispatchEvent(new w.Event('error'));
 for (const key of ['mountain','sports','arts','copyshop']) {
   const place=d.querySelector(`[data-scene="${key}"]`);
   const photo=place.querySelector('img');
   assert.equal(photo.hasAttribute('src'),false);
   place.open=true;
   place.dispatchEvent(new w.Event('toggle'));
   assert.match(photo.getAttribute('src'),/^https:\/\/cdn\.jsdelivr\.net\/gh\/YangChen-cn\/jiyang-school-assets@/);
   assert.ok(photo.alt.trim());
 }
 d.querySelector('[data-action="close-map"]').click();
 assert.equal(d.querySelector('.jy-map-modal').dataset.open,'false');
 assert.equal(d.querySelector('[data-memory-list]'),null);
 assert.ok(reads.length);assert.ok(reads.every(v=>v.message_id===7&&v.type==='message'));
 assert.equal(JSON.stringify(stored),snapshot);
 assert.equal(d.querySelector('#send_textarea').value,'尚未发送的草稿');
 assert.equal(d.querySelectorAll('[data-period-select] option').length,periods.length);
 assert.deepEqual(errors,[]);
 dom.window.close();
 console.log('PASS: 学期边界/自定义年份、EJS分期输出、旧存档缺字段、别名配置、只读DOM交互、消息层隔离、安全文本与草稿保留。');
})().catch(e=>{console.error(e);process.exitCode=1;});
