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
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(pure + '\nthis.pick = (date, year) => campusPeriod(JY_PERIODS, date, year);', sandbox);
for (const [date, id] of cases) {
  assert.equal(sandbox.pick(date, 2020)?.id, id);
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
const npc = manifest.entryManifest.NPC.凌知夏_基础信息;
assert.equal(npc.uid,12);
assert.ok(npc.strategy.keys.includes('凌知夏'));
assert.ok(!Object.keys(manifest.entryManifest.角色).some(key=>key.startsWith('凌知夏')));
assert.ok(!Object.keys(manifest.entryManifest.NSFW指导).some(key=>key.startsWith('凌知夏')));

async function checkOpeningMappings() {
 const greetingNames=['开学第一天','慕佳芊','苏晓樯','温书语','沈幼楚','陈芷汀','虞淑婉'];
 const files=fs.readdirSync(path.join(root,'开场白')).filter(name=>/^\d-.*\.txt$/.test(name)).sort();
 assert.equal(files.length,greetingNames.length);
 const greetings=files.map(file=>read('开场白/'+file));
 const exported=read('脚本/开局设定按钮绑定脚本.js').replace('  function stop() {',
   '  globalThis.openings = {names: GREETING_NAMES, scenes: GREETING_SCENES, patches: buildMvuPatches, preview: greetingTextAt, infer: inferGreetingIndex}; return;\n  function stop() {');
 const context={window:{getCharacter:()=>({first_messages:['<OpeningSetupUI/>',...greetings]})}};
 vm.runInNewContext(exported,context);
 const {names,scenes,patches,preview,infer}=context.openings;
 assert.deepEqual(Array.from(names).slice(1),greetingNames);
 const menu=read('正则/开局设定界面.html');
 const buttons=Array.from(menu.matchAll(/data-greeting="(\d+)"[^>]*>.*?class="jy-opening-scene-name">([^<]+)</g));
 assert.deepEqual(buttons.map(match=>match[2]),greetingNames);
 for(const [index,name] of greetingNames.entries()){
   assert.equal(Number(buttons[index][1]),index+1);
   assert.ok(files[index].includes(name));
   assert.equal(await preview(index+1),greetings[index].replace(/<OpeningSetupUI\s*\/>/gi,'').trim());
   assert.equal(await infer(greetings[index]),index+1);
   const state=Object.fromEntries(patches({'开始年份':'2020','重要物品':''},'preset',scenes[index+1]));
   assert.ok(state['世界.当前位置']);
   assert.ok(!Object.keys(state).some(key=>key.startsWith('凌知夏.')));
   if(index>0) assert.equal(state[name+'.是否在场'],true);
 }
 assert.match(scenes[6].location,/咖啡馆/);
 assert.match(scenes[7].location,/校长办公室/);
 const first = Object.fromEntries(patches({'开始年份':'2020'}, 'preset', scenes[1]));
 const other = Object.fromEntries(patches({'开始年份':'2020'}, 'preset', scenes[2]));
 assert.equal(first['许念安.是否在场'],true);
 assert.equal(first['许念安.控制欲'],0);
 assert.equal(first['许念安.关系阶段'],'表面');
 assert.equal(other['许念安.是否在场'],false);
}

function checkRetiredCharacter(write) {
 const history={世界:{日期:'2020-09-03'},剧情:{当日关系增量:{日期:'2020-09-03',已用:{'凌知夏.好感度':3}}},主角:{重要物品:[{名称:'竞赛笔记',描述:'借来查解法'}]},凌知夏:{好感度:97,关系阶段:'熟悉'},苏晓樯:{好感度:12}};
 const exact=JSON.stringify(history);
 const checked=schemaBox.schema.parse(history);
 assert.equal(checked.凌知夏,undefined);
 assert.equal(checked.苏晓樯.好感度,12);
 const snapshot=ejs.render(read('世界书/变量/变量列表.txt'),{getvar:()=>history});
 assert.doesNotMatch(snapshot,/凌知夏|当日关系增量/);
 assert.match(snapshot,/竞赛笔记/);
 const continued=structuredClone(history);
 write({variables:{stat_data:continued}});
 assert.equal(continued.凌知夏,undefined);
 assert.equal(continued.剧情.当日关系增量.已用['凌知夏.好感度'],undefined);
 assert.equal(continued.苏晓樯.好感度,12);
 assert.equal(continued.主角.重要物品[0].名称,'竞赛笔记');
 assert.equal(JSON.stringify(history),exact);
 assert.doesNotMatch(html,/stat_data\.凌知夏|avatars\/zhixia/);
 assert.doesNotMatch(read('脚本/正文对白.js'),/avatars\/zhixia/);
}
for (const alias of ['老鹰山','听风亭','旧值守屋','周伯','山路旧照']) assert.ok(manifest.entryManifest.事件.老鹰山仙人.strategy.keys.includes(alias));
assert.ok(!manifest.entryManifest.事件.远足.strategy.keys.includes('老鹰山'));
const eventEntries = Object.values(manifest.entryManifest.事件);
assert.equal(eventEntries.length, 15);
for (const period of periods) {
  for (const activity of period.activities || []) {
    assert.ok(read(activity.source).length > 0);
    assert.ok(eventEntries.some(entry => entry.path === activity.source && entry.enabled && entry.strategy.scan_depth === 2));
  }
}
for (const [match, miss] of [['班级篮球对抗赛','路过篮球场'],['国庆返校','暑假返校'],['十佳歌手','在音乐教室上课']]) {
  const entries = input => eventEntries.filter(entry => entry.strategy?.keys?.some(key => input.includes(key)));
  assert.equal(entries(match).length,1);
  assert.equal(entries(miss).length,0);
}
async function renderRoutes(state) {
  const table = {};
  const activations = [];
  const text = await ejs.render(template.replace(/^@@generate_before\n@@always_enabled\n/, ''), {
    charLoreBook: '暨阳测试', world_info: {world: '暨阳测试'}, getvar: () => state,
    define: (key, value) => {table[key] = value;}, activewi: async (book, entry) => {activations.push(entry);},
  }, {async:true});
  return {table, text, activations};
}
const examples = {
  opening: ['2020-09-01','领课本','去教学楼'], national: ['2020-10-01','十一假期','去暨阳站'],
  sports: ['2020-10-18','班级篮球赛','路过篮球场'], midterm: ['2020-11-03','期中复习','借复习资料'],
  hike: ['2020-11-17','学校远足','周末我独自去老鹰山'], 'new-year': ['2021-01-01','新年联欢','写今天日期'],
  winter: ['2021-02-01','寒假去哪','去城区'], 'spring-festival': ['2021-02-11','除夕放假','今晚吃饭'],
  arts: ['2021-04-14','十佳歌手','在音乐教室上课'], 'study-trip': ['2021-05-14','去浙大参观','到紫金港办事'],
  'summer-practice': ['2021-07-03','去奶茶店打工','点一杯奶茶'],
  'coming-of-age': ['2021-10-24','首考动员','走过操场'], 'graduation-night': ['2022-06-09','毕业聚餐','在酒楼吃饭'],
};
async function runRoutes() {
  const stateFor = (date, year = 2020) => ({世界:{日期:date,起始年份:String(year)},剧情:{学期:''}});
  for (const [date, id] of cases) {
    const result = await renderRoutes(stateFor(date));
    assert.match(result.text, new RegExp('当前生活阶段：' + id));
    assert.ok(!result.text.includes('本阶段唯一新增事件'));
  }
  const renderActivity = (entry, result, input, checkKeyword=true) => {
    if (checkKeyword && !entry.strategy.keys.some(key=> input.includes(key))) return '';
    const [gate, ...content] = read(entry.path).split('\n');
    assert.match(gate, /^@@if /);
    const allowed = vm.runInNewContext(gate.slice(5), result.table);
    return allowed ? ejs.render(content.join('\n'), {...result.table,lastUserMessage:input,getvar:()=>''}).trim() : '';
  };
  for (const activity of periods.flatMap(p => p.activities || [])) {
    const [date, hit, miss] = examples[activity.id];
    const entry = eventEntries.find(e => e.path === activity.source);
    const result = await renderRoutes(stateFor(date));
    assert.match(renderActivity(entry, result, hit), /现场素材/);
    assert.equal(renderActivity(entry, result, miss), '');
    assert.equal(renderActivity(entry, await renderRoutes(stateFor('2022-07-01')), hit), '');
    assert.equal(renderActivity(entry, await renderRoutes(stateFor('2021-02-30')), hit), '');
  }
  const open = await renderRoutes({});
  assert.match(renderActivity(manifest.entryManifest.事件.事件_开学周, open, '领课本'), /现场素材/);
  const summer = manifest.entryManifest.事件.暑期工读与家教实践;
  for (const year of [2020,2025]) {
    for (const day of ['07-01','08-15','08-31']) {
      const seed = stateFor((year+1)+'-'+day,year); seed.剧情.学期='高二下';
      const routed = await renderRoutes(seed);
      assert.match(routed.text,/当前生活阶段：暑假/);
      const content = renderActivity(summer,routed,'暑假找家教');
      if (day==='08-31') {
        assert.match(content,/收尾与重访/);
        assert.doesNotMatch(content,/现场素材|筹备:/);
      } else assert.match(content,/现场素材/);
    }
  }
  const sports = manifest.entryManifest.事件.体育周;
  const preview = renderActivity(sports,await renderRoutes(stateFor('2020-10-02')),'篮球赛程');
  assert.match(preview,/尚未开始|筹备/);
  assert.doesNotMatch(preview,/现场素材/);
  const site = stateFor('2020-10-18'); site.世界.当前位置='操场';
  assert.deepEqual((await renderRoutes(site)).activations,[]);
  site.校园={日程:{sports:{状态:'已确认',开始:'2020-10-18',结束:'2020-10-19'}}};
  assert.deepEqual((await renderRoutes(site)).activations,['体育周']);
  site.校园.日程.sports.开始='2020-10-21';site.校园.日程.sports.结束='2020-10-21';
  assert.deepEqual((await renderRoutes(site)).activations,[]);
  site.校园.日程.sports.状态='已撤销';site.剧情.校园活动='体育周';
  const cancelled=await renderRoutes(site);
  assert.deepEqual(cancelled.activations,[]);
  assert.match(renderActivity(sports,cancelled,'体育周'),/正式通知已撤销/);
  assert.doesNotMatch(renderActivity(sports,cancelled,'体育周'),/现场素材|筹备:/);
  const hiking = stateFor('2020-11-18'); hiking.世界.当前位置='老鹰山';
  hiking.校园={日程:{hike:{状态:'已确认',开始:'2020-11-18',结束:'2020-11-18'}}};
  assert.deepEqual((await renderRoutes(hiking)).activations,[]);
  hiking.世界.当前位置='老鹰山远足集合点';
  assert.deepEqual((await renderRoutes(hiking)).activations,['远足']);
  const graduate = stateFor('2022-06-10'); graduate.剧情.学期='已毕业';
  const graduation = await renderRoutes(graduate);
  assert.match(graduation.text,/当前生活阶段：已毕业/);
  assert.match(renderActivity(manifest.entryManifest.事件.最后一课与毕业散伙狂欢夜,graduation,'毕业聚餐'),/实际订位/);
  assert.equal(renderActivity(sports,graduation,'体育周'), '');
}

function checkRelationshipPace(update) {
 const people=['苏晓樯','温书语','沈幼楚','陈芷汀','慕佳芊','虞淑婉'];
 const start=()=>({世界:{日期:'2020-09-01'},剧情:{},...Object.fromEntries(people.map(name=>[name,{好感度:0,关系阶段:name==='沈幼楚'?'戒备':name==='慕佳芊'||name==='虞淑婉'?'师生':'初识'}]))});
 let state=start();
 state.沈幼楚.信任度=0;
 const updateState=fn=>{
   const prior=structuredClone(state);
   fn(state);
   update({stat_data:state},{stat_data:prior});
 };
 for(let i=0;i<24;i++) updateState(s=>{s.苏晓樯.好感度+=2;});
 assert.equal(state.苏晓樯.好感度,4);
 assert.equal(state.苏晓樯.关系阶段,'初识');
 assert.equal(state.温书语.好感度,0);
 updateState(s=>{s.苏晓樯.好感度-=2;});
 updateState(s=>{s.苏晓樯.好感度+=2;});
 assert.equal(state.苏晓樯.好感度,2);
 updateState(s=>{s.世界.日期='2020-09-02';s.苏晓樯.好感度+=5;s.沈幼楚.信任度+=4;});
 assert.equal(state.苏晓樯.好感度,5);
 assert.equal(state.沈幼楚.好感度,0);
 assert.equal(state.沈幼楚.信任度,3);
 state.陈芷汀={好感度:92,关系阶段:'交付'};
 updateState(()=>{});
 assert.equal(state.陈芷汀.好感度,92);
 assert.equal(state.陈芷汀.关系阶段,'交付');

 for(const person of people){
   const source=read(`世界书/角色/${person}/性格调色盘.yaml`);
   assert.doesNotThrow(()=>ejs.compile(source));
   if(person==='沈幼楚') continue;
   const start=source.indexOf('<%_ {');
   const end=source.indexOf('_%>',start)+3;
   const scoreFor=stage=>Number(ejs.render(source.slice(start,end)+'<%= relationshipScore %><%_ } _%>',{
     getvar: key=>key.endsWith('关系阶段')?stage:95,
   }));
   assert.ok(scoreFor('')<40);
   if(person==='苏晓樯') assert.equal(scoreFor('亲密恋人'),95);
 }

 // Keep the story dates and selected participants fixed when simulating the old
 // routine bonuses and the new policy. No model output is assumed by this fixture.
 const legacy=start(); state=start();
 const rows=[];
 for(let floor=1;floor<=300;floor++) {
   const day=Math.floor((floor-1)/5);
   const beat=(floor-1)%5;
   const date=new Date(Date.UTC(2020,8,1+day)).toISOString().slice(0,10);
   const group=[people[day%people.length],people[(day+2)%people.length]];
   const focus=group[0];
   const event=day%7===0&&beat===2?'协作完成一项任务':day%5===0&&beat===1?'首次承担分工':'例行交流';
   legacy.世界.日期=date;
   for(const name of group) legacy[name].好感度=Math.min(100,legacy[name].好感度+2);
   updateState(s=>{
     s.世界.日期=date;
     if(event==='协作完成一项任务') s[focus].好感度+=3;
     else if(event==='首次承担分工') s[focus].好感度+=1;
   });
   if(floor%100===0) rows.push({floor,date,legacy:people.map(name=>legacy[name].好感度),current:people.map(name=>state[name].好感度),stages:people.map(name=>state[name].关系阶段)});
 }
 assert.equal(rows.length,3);
 assert.ok(rows.at(-1).legacy.filter(score=>score>=80).length>=5);
 assert.ok(rows.at(-1).current.every(score=>score<50));
 assert.ok(rows.at(-1).stages.every(stage=>['初识','戒备','师生'].includes(stage)));
 console.log('PASS: 关系节奏模拟（角色顺序 '+people.join('、')+'）',JSON.stringify(rows));

 state=start();
 for(let day=0;day<20;day++) updateState(s=>{
   s.世界.日期=new Date(Date.UTC(2020,8,1+day)).toISOString().slice(0,10);
   s.苏晓樯.好感度+=3;
   if(day===8) s.苏晓樯.关系阶段='熟悉'; // A stage change supplied by the story.
 });
 assert.equal(state.苏晓樯.好感度,60);
 assert.equal(state.苏晓樯.关系阶段,'熟悉');
 for(const other of people.slice(1)) assert.equal(state[other].好感度,0);
}
const neutral = html.replace(/^```\w*\s*|\s*```$/g,'').replaceAll('{{format_message_variable::stat_data.世界.日期}}','2021/07/03').replaceAll('{{format_message_variable::stat_data.世界.起始年份}}','2020').replaceAll('{{format_message_variable::stat_data.世界.当前位置}}','我找到的小巷').replaceAll('{{format_message_variable::stat_data.主角.出生日期}}','2000/07/03').replaceAll('{{format_message_variable::stat_data.主角.班级}}','返乡实习生');
(async () => {
 await checkOpeningMappings();
 await runRoutes();
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
 const callbackBox={z,_,registerMvuSchema:()=>{},waitGlobalInitialized:async()=>{},Mvu:{events:{BEFORE_MESSAGE_UPDATE:'before',VARIABLE_UPDATE_ENDED:'ended',VARIABLE_UPDATE_STARTED:'started'}},eventOn(name,callback){if(name==='before')callbackBox.write=callback;else if(name==='ended')callbackBox.pace=callback;else if(name==='started')callbackBox.start=callback;},$:(fn)=>fn()};
 vm.createContext(callbackBox);
 await vm.runInContext(read('脚本/Zod.txt').replace(/^import .*$/m,'').replace('export const Schema','const Schema'),callbackBox);
 checkRetiredCharacter(callbackBox.write);
 checkRelationshipPace(callbackBox.pace);
 const palette=read('世界书/角色/许念安/性格调色盘.yaml');
 const header=palette.slice(0,palette.indexOf('_%>')+3);
 for(const [stage,affection,control,mode] of [['表面',99,90,'表面'],['观察',20,0,'观察'],['观察',0,40,'观察'],['依恋',99,90,'依恋'],['紧绷',50,70,'紧绷'],['共生',80,85,'共生'],['松绑',90,20,'松绑'],['松绑',95,90,'紧绷']]){
   const values={关系阶段:stage,好感度:affection,控制欲:control};
   assert.equal(ejs.render(header+'<%= mode %><%_ } _%>',{getvar:key=>values[key.split('.').at(-1)]}).trim().split('\n').at(-1),mode);
 }
 const legacy={剧情:{},世界:{日期:'2020/09/02'}};
 const migrated=structuredClone(legacy);
 callbackBox.start({stat_data:migrated});
 assert.equal(migrated.许念安.控制欲,0);
 migrated.许念安.好感度=40;
 migrated.许念安.控制欲=160;
 callbackBox.pace({stat_data:migrated},{stat_data:legacy});
 callbackBox.write({variables:{stat_data:migrated}});
 assert.equal(migrated.许念安.好感度,2);
 assert.equal(migrated.许念安.控制欲,100);
 assert.equal(legacy.许念安,undefined);
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
 state.校园.有效公告.push({...schoolNotice('sports','2021-07-10'),渠道:'班群',来源:'同学闲聊'});
 update();
 assert.equal(state.校园.日程.sports.开始,'2020-10-20');
 assert.ok(!state.校园.有效公告.some(post=>post.活动标识==='sports'));
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
 const pupil={世界:{起始年份:'2030',日期:'2031/02/20'},剧情:{学期:'高二下'},主角:{年龄:'21岁',班级:'暨阳中学高二重点班学生',重要物品:[{名称:'借书',描述:'已借未还'}]},苏晓樯:{好感度:96}};
 const pupilTurn=(date,period)=>{
   pupil.世界.日期=date;
   callbackBox.write({variables:{stat_data:pupil}});
   assert.equal(pupil.剧情.学期,period);
   assert.equal(pupil.苏晓樯.好感度,96);
   assert.equal(pupil.主角.重要物品[0].名称,'借书');
 };
 pupilTurn('2031/02/20','高二上');
 pupilTurn('2031/02/21','高二下');
 pupilTurn('2031/08/31','暑假');
 assert.equal(pupil.主角.年龄,'21岁');
 pupilTurn('2031/09/01','高三上');
 assert.equal(pupil.主角.班级,'暨阳中学高三重点班学生');
 pupil.主角.出生日期='2010-11-02';
 pupilTurn('2031/11/01','高三上');
 assert.equal(pupil.主角.年龄,'20岁');
 pupilTurn('2031/11/02','高三上');
 assert.equal(pupil.主角.年龄,'21岁');
 pupilTurn('2032/02/21','高三下');
 pupilTurn('2032/07/01','已毕业');
 assert.equal(pupil.主角.班级,'暨阳中学毕业生');
 pupil.主角.班级='返乡实习生';
 pupilTurn('2032/07/05','已毕业');
 assert.equal(pupil.主角.班级,'返乡实习生');
 const snapshot=JSON.stringify(stored);
 const dom=new JSDOM('<textarea id="send_textarea">尚未发送的草稿</textarea>'+neutral,{runScripts:'dangerously',url:'http://localhost:18967',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.getCurrentMessageId=()=>7;w.getVariables=opts=>{reads.push(opts);return stored;};}});
 const w=dom.window,d=w.document;
 await new Promise(r=>w.setTimeout(r,220));
 assert.equal(d.querySelector('[data-period-select]').value,'暑假');
 assert.equal(d.querySelector('[data-player-age]').textContent,'21岁');
 assert.equal(d.querySelector('[data-player-class]').textContent,'返乡实习生');
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
