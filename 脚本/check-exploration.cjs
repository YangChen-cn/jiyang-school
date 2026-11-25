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
const cardEntries = JSON.parse(read('暨阳中学.json')).data.character_book.entries;
for (const entry of cardEntries) {
  if (!entry.enabled || !entry.content.includes('<%')) continue;
  assert.doesNotThrow(() => ejs.compile(entry.content, { async: true }), `EJS 编译失败：${entry.comment}`);
}
const cases = [['2020-08-31','高二上'],['2021-02-20','高二上'],['2021-02-21','高二下'],['2021-06-30','高二下'],['2021-07-01','暑假'],['2021-08-31','暑假'],['2021-09-01','高三上'],['2022-02-20','高三上'],['2022-02-21','高三下'],['2022-06-30','高三下'],['2022-07-01','已毕业']];
const engineSrc = read('脚本/状态栏渲染引擎.js');
const pure = engineSrc.slice(engineSrc.indexOf('  // JY_PERIODS_BEGIN'), engineSrc.indexOf('  // JY_CAMPUS_END'));
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
 const greetingNames=['开学第一天','慕佳芊','苏晓樯','温书语','沈幼楚','许念安','陈芷汀','虞淑婉'];
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
 assert.match(scenes[2].location,/高二教师办公室/);
 assert.match(scenes[6].location,/高二（8）班教室/);
 assert.match(scenes[7].location,/咖啡馆/);
 assert.match(scenes[8].location,/校长办公室/);
 const custom = Object.fromEntries(patches({
   '开始年份':'2023', '开场日期':'2024-09-01', '开场地点':'桥下旧书摊', '开场时段':'傍晚',
   '班级或身份':'暨阳中学高二重点班学生'
 }, 'custom'));
 assert.equal(custom['世界.当前位置'], '桥下旧书摊');
 assert.equal(custom['主角.当前位置'], '桥下旧书摊');
 assert.equal(custom['世界.日期'], '2024/09/01');
 assert.equal(custom['世界.星期'], '星期日');
 assert.equal(custom['剧情.学期'], '高三上');
 assert.equal(custom['主角.班级'], '暨阳中学高三重点班学生');
 assert.equal(custom['温书语.是否在场'], false);
 const free = Object.fromEntries(patches({'开始年份':'2020'}, 'custom'));
 assert.equal(free['世界.当前位置'], '');
 assert.equal(free['剧情.学期'], '');
 const first = Object.fromEntries(patches({'开始年份':'2020'}, 'preset', scenes[1]));
 const other = Object.fromEntries(patches({'开始年份':'2020'}, 'preset', scenes[2]));
 assert.equal(first['许念安.是否在场'],true);
 assert.equal(first['许念安.控制欲'],0);
 assert.equal(first['许念安.关系阶段'],'表面');
 assert.equal(other['许念安.是否在场'],false);
}

async function checkOpeningArchives() {
 const openingHtml = read('正则/开局设定界面.html');
 const dom = new JSDOM('<main>' + openingHtml + '</main><textarea id="send_textarea">原有聊天草稿</textarea>', {
   runScripts:'outside-only', url:'http://localhost:8000'
 });
 const w = dom.window;
 const d = w.document;
 try {
   if (d.readyState === 'loading') await new Promise(resolve => d.addEventListener('DOMContentLoaded', resolve, {once:true}));
   const messages = [{message:'<OpeningSetupUI/>'}];
   w.getChatMessages = () => messages;
   let writes = 0;
   w.setChatMessages = () => { writes++; };
   w.eval(read('脚本/开局设定按钮绑定脚本.js'));
   const get = selector => d.querySelector(selector);
   const click = action => get('[data-action="' + action + '"]').click();
   const field = name => get('[data-field="' + name + '"]');
   click('show-archives');
   assert.equal(get('[data-opening-archives]').open, true);
   assert.equal(get('[data-opening-archives] summary').textContent, '学籍档案');
   field('姓名').value = '陈默';
   field('开场日期').value = '2020-11-06';
   field('开场地点').value = '桥下旧书摊';
   field('性格').value = '说话直\n喜欢旧书';
   field('年龄').value = '';
   get('[data-mode="custom"]').click();
   get('[data-custom-opening]').value = ' 雨停了。\n有人把书摞到木箱上。';
   get('[data-opening-action]').value = '把伞收起来。';
   click('save-archive');
   const first = get('[data-archive-select]').value;
   assert.ok(first);
   get('[data-archive-name]').value = '<b>另一个开局</b>';
   field('姓名').value = '陈小桥';
   click('save-archive');
   const second = get('[data-archive-select]').value;
   assert.notEqual(second, first);
   assert.match(get('[data-archive-select] option:checked').textContent, /<b>另一个开局<\/b>/);
   click('clear');
   assert.equal(w.localStorage.length, 2);

   // Remount the actual opening in a new chat. The archive belongs to the site, independent of either form.
   get('main').innerHTML = openingHtml;
   w.__jiyangOpeningSetupControllerV7.bind();
   const panel = get('[data-opening-archives]');
   panel.open = true;
   panel.dispatchEvent(new w.Event('toggle'));
   assert.equal(get('[data-archive-select]').options.length, 2);
   get('[data-archive-select]').value = first;
   click('load-archive');
   assert.equal(field('姓名').value, '陈默');
   assert.equal(field('年龄').value, '');
   assert.equal(field('性格').value, '说话直\n喜欢旧书');
   assert.equal(field('开场日期').value, '2020-11-06');
   assert.equal(field('开场地点').value, '桥下旧书摊');
   assert.equal(get('[data-jy-opening]').dataset.openingMode, 'custom');
   assert.equal(get('[data-custom-opening]').value, ' 雨停了。\n有人把书摞到木箱上。');
   assert.equal(get('[data-opening-action]').value, '把伞收起来。');
   assert.equal(get('#send_textarea').value, '原有聊天草稿');
   assert.equal(writes, 0);
   assert.equal(get('[data-id-preview-name]').textContent, '陈默');
   get('[data-action="apply-template"][data-template="hardware"]').click();
   assert.equal(field('开场地点').value, '暨阳路校门口');
   assert.equal(field('开场日期').value, '2020-09-01');
   assert.equal(get('[data-id-preview-class]').textContent, '暨阳中学高二重点班插班生');
   get('[data-action="apply-template"][data-template="gaokao"]').click();
   assert.equal(field('开场日期').value, '2022-02-26');
   assert.equal(get('[data-opening-action]').value.length > 0, true);

   w.confirm = () => false;
   click('delete-archive');
   assert.ok(w.localStorage.getItem(first));
   w.confirm = () => true;
   click('delete-archive');
   assert.equal(w.localStorage.getItem(first), null);
   assert.ok(w.localStorage.getItem(second));
 } finally {
   w.__jiyangOpeningSetupControllerV7?.stop();
   w.close();
 }
}

function checkRetiredCharacter(write) {
 const history={世界:{日期:'2020-09-03'},剧情:{当日关系增量:{日期:'2020-09-03',已用:{'凌知夏.好感度':3}}},主角:{重要物品:[{名称:'竞赛笔记',描述:'借来查解法'}]},凌知夏:{好感度:97,关系阶段:'熟悉'},苏晓樯:{好感度:12}};
 history.剧情.重大情感申请=[{事件:'旧申请'}];
 history.剧情.已结算重大情感事件=[{事件:'旧记录'}];
 history.剧情.推进节奏 = '日常铺垫';
 history.剧情.事件冷却 = 2;
 history.剧情.上次焦点角色 = '苏晓樯';
 const exact=JSON.stringify(history);
 const checked=schemaBox.schema.parse(history);
 assert.equal(checked.凌知夏,undefined);
 assert.equal(checked.苏晓樯.好感度,12);
 const snapshot=ejs.render(read('世界书/变量/变量列表.txt'),{getvar:()=>history});
 assert.doesNotMatch(snapshot,/凌知夏|当日关系增量|重大情感申请|已结算重大情感事件|推进节奏|事件冷却|上次焦点角色/);
 assert.match(snapshot,/竞赛笔记/);
 const continued=structuredClone(history);
 write({variables:{stat_data:continued}});
 assert.equal(continued.凌知夏,undefined);
 assert.equal(continued.剧情.当日关系增量,undefined);
 assert.equal(continued.剧情.重大情感申请,undefined);
 assert.equal(continued.剧情.已结算重大情感事件,undefined);
 assert.equal(continued.剧情.推进节奏,undefined);
 assert.equal(continued.剧情.事件冷却,undefined);
 assert.equal(continued.剧情.上次焦点角色,undefined);
 assert.equal(continued.苏晓樯.好感度,12);
 assert.equal(continued.主角.重要物品[0].名称,'竞赛笔记');
 assert.equal(JSON.stringify(history),exact);
 assert.doesNotMatch(html,/stat_data\.凌知夏|avatars\/zhixia/);
 assert.doesNotMatch(read('脚本/正文对白.js'),/avatars\/zhixia/);
}
for (const alias of ['老鹰山','听风亭','旧值守屋','周伯','山路旧照']) assert.ok(manifest.entryManifest.事件.老鹰山仙人.strategy.keys.includes(alias));
assert.ok(!manifest.entryManifest.事件.远足.strategy.keys.includes('老鹰山'));
const eventEntries = Object.values(manifest.entryManifest.事件);
assert.equal(eventEntries.length, 18);
for (const side of ['万风地库', '珍珠局']) {
  const entry = manifest.entryManifest.事件[side];
  assert.ok(entry && entry.enabled && entry.strategy.scan_depth === 2);
  assert.ok(read(entry.path).length > 0);
}
assert.ok(manifest.entryManifest.事件.万风地库.strategy.keys.includes('万风地库'));
assert.ok(manifest.entryManifest.事件.珍珠局.strategy.keys.includes('澹珠记'));
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
  const ceremonyName = '高三成人礼与首考誓师';
  for (const focus of [ceremonyName, '十八岁成人礼与首考誓师', 'coming-of-age']) {
    const ceremony = stateFor('2021-10-24');
    ceremony.剧情.校园活动 = focus;
    assert.deepEqual((await renderRoutes(ceremony)).activations, [ceremonyName]);
  }
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
 // Positive gains are capped per character and date. Penalties don't refund the budget.
 for(let i=0;i<10;i++) updateState(s=>{s.苏晓樯.好感度+=2;});
 assert.equal(state.苏晓樯.好感度,12);
 assert.equal(state.苏晓樯.关系阶段,'初识'); // 阶段解耦：不随好感度达标自动晋级（方案一）
 assert.equal(state.温书语.好感度,0);

 updateState(s=>{s.苏晓樯.好感度-=2;});
 updateState(s=>{s.世界.日期='2020/09/01'; s.苏晓樯.好感度+=5;});
 assert.equal(state.苏晓樯.好感度,10);

 // Trust stays independent. A new date restores only the new day's affection budget.
 updateState(s=>{s.沈幼楚.信任度+=35; s.沈幼楚.好感度+=30;});
 assert.equal(state.沈幼楚.信任度,35);
 assert.equal(state.沈幼楚.好感度,12);
 assert.equal(state.沈幼楚.关系阶段,'戒备'); // 阶段保持，直至剧情中明确突破
 updateState(s=>{s.世界.日期='2020-09-02';s.苏晓樯.好感度+=6;s.沈幼楚.好感度+=20;});
 updateState(s=>{s.世界.日期='';s.苏晓樯.好感度+=9;});
 assert.equal(state.苏晓樯.好感度,22);
 assert.equal(state.沈幼楚.好感度,24);
 assert.equal(schemaBox.schema.parse(state).剧情.当日好感增量.已用.苏晓樯,12);
 const currentSnapshot = ejs.render(read('世界书/变量/变量列表.txt'),{getvar:()=>state});
 assert.doesNotMatch(currentSnapshot,/当日好感增量/);

 state=start();
 state.世界.日期='';
 updateState(s=>{s.许念安={好感度:8};});
 const branchPoint=structuredClone(state);
 updateState(s=>{s.世界.日期='2020-09-01';s.许念安.好感度+=9;});
 assert.equal(state.许念安.好感度,12);
 state=structuredClone(branchPoint);
 updateState(s=>{s.许念安.好感度+=1;});
 assert.equal(state.许念安.好感度,9);
 assert.equal(branchPoint.剧情.当日好感增量.已用.许念安,8);

 // Old saves keep existing scores. Only the points that fit before 100 are counted.
 state=start();
 state.苏晓樯.好感度=98;
 updateState(s=>{s.苏晓樯.好感度=150; s.沈幼楚.信任度=-20;});
 assert.equal(state.苏晓樯.好感度,100);
 assert.equal(state.剧情.当日好感增量.已用.苏晓樯,2);
 assert.equal(state.沈幼楚.信任度,0);

 // 4. 旧版双轨制遗留字段在运行时被静默清理
 state.剧情.当日关系增量 = {日期: '2020-09-01', 已用: {'苏晓樯.好感度': 3}};
 state.剧情.重大情感申请 = [{事件: '测试', 角色: '苏晓樯', 指标: '好感度'}];
 state.剧情.已结算重大情感事件 = [{事件: '测试', 角色: '苏晓樯', 指标: '好感度'}];
 state.剧情.推进节奏 = '日常铺垫';
 state.剧情.事件冷却 = 1;
 state.剧情.上次焦点角色 = '温书语';
 updateState(()=>{});
 assert.equal(state.剧情.当日关系增量, undefined);
 assert.equal(state.剧情.重大情感申请, undefined);
 assert.equal(state.剧情.已结算重大情感事件, undefined);
 assert.equal(state.剧情.推进节奏, undefined);
 assert.equal(state.剧情.事件冷却, undefined);
 assert.equal(state.剧情.上次焦点角色, undefined);

 state.陈芷汀={好感度:92,关系阶段:'交付'};
 updateState(()=>{});
 assert.equal(state.陈芷汀.好感度,92);
 assert.equal(state.陈芷汀.关系阶段,'交付');

 for(const person of people){
   const source=read(`世界书/角色/${person}/性格调色盘.yaml`);
   assert.doesNotThrow(()=>ejs.compile(source));
   if(person==='沈幼楚') {
     const render=score=>ejs.render(source,{getvar:key=>key.endsWith('关系阶段')?'戒备':key.endsWith('好感度')||key.endsWith('信任度')?score:false});
     assert.equal(render(100),render(0));
     continue;
   }
   const start=source.indexOf('<%_ {');
   const end=source.indexOf('_%>',start)+3;
   const scoreFor=stage=>Number(ejs.render(source.slice(start,end)+'<%= relationshipScore %><%_ } _%>',{
     getvar: key=>key.endsWith('关系阶段')?stage:95,
   }));
   assert.ok(scoreFor('')<40);
   const nextStageCaps={苏晓樯:['熟悉',49],温书语:['熟悉',49],陈芷汀:['松动',59],慕佳芊:['熟悉',49],虞淑婉:['留意',54]};
   const [stage,cap]=nextStageCaps[person];
   assert.equal(scoreFor(stage),cap); // 高分也只加载已确认阶段的表现。
   if(person==='苏晓樯') assert.equal(scoreFor('亲密恋人'),95);
 }
 for(const h of ['苏晓樯','温书语','沈幼楚','许念安','慕佳芊','陈芷汀','虞淑婉']) {
   const pal=read(`世界书/角色/${h}/性格调色盘.yaml`);
   assert.doesNotThrow(()=>ejs.compile(pal));
   const off=ejs.render(pal,{getvar:k=>k.endsWith('关系阶段')?'':(k.endsWith('是否在场')?false:95)}).trim();
   const on=ejs.render(pal,{getvar:k=>k.endsWith('关系阶段')?'':(k.endsWith('是否在场')?true:95)}).trim();
   assert.match(off,/^\[不在场｜当前阶段：/);
   assert.ok(on.includes('底色：'));
   const nsfw=read(`世界书/角色/${h}/NSFW指导.yaml`);
   assert.doesNotThrow(()=>ejs.compile(nsfw));
   assert.equal(ejs.render(nsfw,{getvar:k=>k.endsWith('是否在场')?false:(k.endsWith('好感度')?95:true)}).trim(),'');
   assert.ok(ejs.render(nsfw,{getvar:k=>k.endsWith('好感度')?95:true}).trim().length>50);
 }
 const tri=read('世界书/角色/沈幼楚/三面性.yaml');
 assert.doesNotThrow(()=>ejs.compile(tri));
 assert.equal(ejs.render(tri,{getvar:k=>k.endsWith('是否在场')?false:''}).trim(),'');
 assert.ok(ejs.render(tri,{getvar:k=>k.endsWith('是否在场')?true:'校园'}).trim().includes('第一面'));

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
const neutral = html.replace(/^```\w*\s*|\s*```$/g,'').replaceAll('{{format_message_variable::stat_data.世界.日期}}','2021/07/03').replaceAll('{{format_message_variable::stat_data.世界.起始年份}}','2020').replaceAll('{{format_message_variable::stat_data.世界.当前位置}}','我找到的小巷').replaceAll('{{format_message_variable::stat_data.主角.出生日期}}','2000/07/03').replaceAll('{{format_message_variable::stat_data.主角.班级}}','返乡实习生').replaceAll('{{format_message_variable::stat_data.许念安.是否在场}}','true').replaceAll('{{format_message_variable::stat_data.许念安.当前上装}}','蓝白色校服外套和柔软的浅色针织衫');
(async () => {
 await checkOpeningMappings();
 await checkOpeningArchives();
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
 const callbackBox={z,_,registerMvuSchema:()=>{},waitGlobalInitialized:async()=>{},getChatMessages:()=>[{role:'assistant',message:callbackBox.pace?.message||''}],Mvu:{events:{BEFORE_MESSAGE_UPDATE:'before',VARIABLE_UPDATE_ENDED:'ended',VARIABLE_UPDATE_STARTED:'started'}},eventOn(name,callback){if(name==='before')callbackBox.write=callback;else if(name==='ended')callbackBox.pace=callback;else if(name==='started')callbackBox.start=callback;},$:(fn)=>fn()};
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
 assert.equal(migrated.许念安.好感度,12);
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
 const engineCode=read('脚本/状态栏渲染引擎.js');
 w.eval(engineCode);
 await new Promise(r=>w.setTimeout(r,220));
 const themeButton=d.querySelector('[data-action="toggle-theme"]');
 const status=d.querySelector('.jy-status');
 const intimateNote=status.querySelector('.jy-intimate-note');
 const unlocked=status.querySelector('.jy-person[data-tone="perfect"]');
 const heart=unlocked.querySelector('.jy-unlock-heart');
 const unconfirmedHeart=status.querySelector('.jy-person[data-tone="quiet"] .jy-unlock-heart');
 assert.match(status.dataset.intimateScene,/stat_data\.剧情\.当前nsfw/);
 assert.match(unlocked.dataset.intimacyUnlocked,/stat_data\.许念安\.NSFW/);
 assert.equal(w.getComputedStyle(intimateNote).display,'none');
 assert.equal(w.getComputedStyle(heart).display,'none');
 status.dataset.intimateScene='true';
 unlocked.dataset.intimacyUnlocked='true';
 assert.equal(w.getComputedStyle(intimateNote).display,'inline-flex');
 assert.equal(w.getComputedStyle(heart).display,'inline-grid');
 assert.equal(w.getComputedStyle(unconfirmedHeart).display,'none');
 assert.equal(w.getComputedStyle(status).getPropertyValue('--scene-paper').trim(),'#fff5f8');
 assert.equal(themeButton.getAttribute('aria-label'),'夜间模式');
 assert.equal(themeButton.querySelectorAll('svg').length,2);
 assert.equal(themeButton.getAttribute('aria-pressed'),'false');
 themeButton.click();
 assert.equal(d.querySelector('.jy-status').dataset.theme,'dark');
 assert.equal(w.getComputedStyle(status).getPropertyValue('--scene-paper').trim(),'#281c27');
 assert.equal(w.getComputedStyle(intimateNote).display,'inline-flex');
 assert.equal(w.getComputedStyle(heart).display,'inline-grid');
 assert.equal(themeButton.getAttribute('aria-pressed'),'true');
 assert.equal(themeButton.title,'切换日间模式');
 assert.equal(themeButton.querySelectorAll('svg').length,2);
 assert.equal(w.localStorage.getItem('jy-status-theme'),'dark');
 themeButton.click();
 assert.equal(d.querySelector('.jy-status').dataset.theme,'light');
 status.dataset.intimateScene='false';
 assert.equal(w.getComputedStyle(intimateNote).display,'none');
 assert.equal(w.getComputedStyle(heart).display,'inline-grid');
 unlocked.dataset.intimacyUnlocked='false';
 assert.equal(w.getComputedStyle(heart).display,'none');
 assert.equal(themeButton.title,'切换夜间模式');
 assert.equal(themeButton.querySelectorAll('svg').length,2);
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
   assert.match(photo.getAttribute('src'),/^https:\/\/(?:testingcf|cdn)\.jsdelivr\.net\/gh\/YangChen-cn\/jiyang-school-assets@/);
   assert.ok(photo.alt.trim());
 }
 d.querySelector('[data-action="close-map"]').click();
 assert.equal(d.querySelector('.jy-map-modal').dataset.open,'false');
 const nianan=d.querySelector('.jy-person[data-tone="perfect"]');
 const outfit=nianan.querySelector('.jy-detail span');
 assert.equal(outfit.textContent,'蓝白色校服外套和柔软的浅色针织衫');
 assert.equal(w.getComputedStyle(outfit).whiteSpace,'normal');
 assert.equal(w.getComputedStyle(outfit).overflowWrap,'anywhere');
 nianan.querySelector('[data-action="open-album"]').click();
 const album=d.querySelector('.jy-album-modal');
 assert.equal(album.dataset.open,'true');
 const pictures=[...album.querySelectorAll('.jy-album-photo')];
 assert.equal(pictures.length,4);
 assert.ok(pictures.every(photo=>w.getComputedStyle(photo).objectFit==='contain'));
 const home=pictures.find(photo=>photo.alt==='午后居家');
 home.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal(d.querySelector('.jy-photo-viewer').dataset.open,'true');
 assert.equal(d.querySelector('.jy-photo-viewer-image').src,home.src);
 d.querySelector('[data-action="close-photo-viewer"]').click();
 home.closest('.jy-album-item').querySelector('[data-action="set-album-avatar"]').click();
 assert.equal(w.localStorage.getItem('jy-avatar:许念安'),home.src);
 assert.equal(nianan.querySelector('.jy-avatar').src,home.src);
 d.querySelector('[data-action="close-album"]').click();
 assert.equal(album.dataset.open,'false');
 assert.equal(d.querySelector('[data-memory-list]'),null);
 assert.ok(reads.length);assert.ok(reads.every(v=>v.message_id===7&&v.type==='message'));
 assert.equal(JSON.stringify(stored),snapshot);
 assert.equal(d.querySelector('#send_textarea').value,'尚未发送的草稿');
 assert.equal(d.querySelectorAll('[data-period-select] option').length,periods.length);

 // Bento tabs, view toggle & singleton overlay
 assert.equal(d.querySelectorAll('#jy-status-overlay-root').length,1);
 assert.equal(d.querySelector('#jy-status-overlay-root').parentElement,d.body);
 d.querySelector('[data-tab-target="idcard"]').click();
 assert.equal(d.querySelector('[data-tab-panel="idcard"]').dataset.active,'true');
 assert.equal(d.querySelector('[data-tab-panel="people"]').dataset.active,'false');
 d.querySelector('[data-tab-target="forum"]').click();
 assert.equal(d.querySelector('[data-campus-messages]').open,true);
 d.querySelector('[data-tab-target="people"]').click();
 d.querySelector('[data-people-filter="all"]').click();
 assert.equal(d.querySelector('.jy-people').dataset.view,'all');
 d.querySelector('[data-people-filter="present"]').click();
 assert.equal(d.querySelector('.jy-people').dataset.view,'present');

 assert.deepEqual(errors,[]);
 dom.window.close();

 // Verify dual-axis status alerts (沈幼楚 trust lock <= 30, 许念安 control >= 85) & singleton overlay across mounts
 const axisHtml=neutral
   .replaceAll('{{format_message_variable::stat_data.沈幼楚.是否在场}}','true')
   .replaceAll('{{format_message_variable::stat_data.沈幼楚.信任度}}','25')
   .replaceAll('{{format_message_variable::stat_data.许念安.控制欲}}','86');
 const axisDom=new JSDOM(axisHtml+axisHtml,{runScripts:'dangerously',url:'http://localhost:18969',pretendToBeVisual:true});
 const aw=axisDom.window,ad=aw.document;
 aw.eval(engineCode);
 await new Promise(r=>aw.setTimeout(r,80));
 assert.equal(ad.querySelectorAll('#jy-status-overlay-root').length,1);
 assert.equal(ad.querySelector('[data-trust-lock]').hidden,false);
 const ctrlWarn=ad.querySelector('[data-control-warn]');
 assert.equal(ctrlWarn.hidden,false);
 assert.equal(ctrlWarn.textContent,'高压共生');
 aw.close();

 const dialogue=new JSDOM('<div id="chat"><div class="mes" is_user="false" mesid="1"><div class="mes_text"><p>{苏晓樯}「今天真热闹。」</p><p>{杨辰}「走吧。」</p></div></div></div><textarea id="send_textarea">未发送</textarea>',{runScripts:'dangerously',url:'http://localhost:18968',pretendToBeVisual:true});
 const dw=dialogue.window;
 dw.getVariables=()=>({stat_data:{主角:{姓名:'杨辰'}}});
 dw.localStorage.setItem('jy-avatar:苏晓樯','data:image/png;base64,YWJj');
 dw.eval(read('脚本/正文对白.js'));
 const rows=dw.document.querySelectorAll('[data-jy-dialogue-row]');
 assert.equal(rows.length,2);
 assert.equal(rows[0].dataset.speakerCanon,'苏晓樯');
 assert.equal(rows[1].dataset.player,'true');
 const avatar=rows[0].querySelector('[data-jy-dialogue-avatar]');
 assert.equal(dw.getComputedStyle(avatar).width,'88px');
 assert.equal(dw.getComputedStyle(avatar).borderRadius,'10px');
 assert.equal(dw.getComputedStyle(avatar).height,'auto');
 assert.equal(dw.getComputedStyle(avatar.querySelector('img')).height,'auto');
 assert.equal(dw.getComputedStyle(avatar.querySelector('img')).width,'100%');
 assert.equal(avatar.querySelector('[data-jy-dialogue-fallback]').textContent,'苏');
 assert.equal(dw.getComputedStyle(avatar.querySelector('[data-jy-dialogue-fallback]')).display,'none');
 const playerAvatar=rows[1].querySelector('[data-jy-dialogue-avatar]');
 assert.equal(playerAvatar.querySelector('img'),null);
 assert.notEqual(dw.getComputedStyle(playerAvatar.querySelector('[data-jy-dialogue-fallback]')).display,'none');
 assert.equal(avatar.querySelector('img').getAttribute('src'),'data:image/png;base64,YWJj');
 assert.equal(dw.document.querySelector('#send_textarea').value,'未发送');
 dw.__jyDialogue.destroy();
 assert.equal(dw.document.querySelector('[data-jy-dialogue-row]'),null);
 assert.match(dw.document.querySelector('.mes_text').textContent,/\{苏晓樯\}「今天真热闹。」/);
 dw.close();

 // Verify the restored master entry, per-chat gating, and the one-time classroom introduction.
 const dlcNames=[
   '[DLC]灵气复苏总纲与异象日程',
   '[DLC]老鹰山灵脉与古宗秘藏',
   '云清晏_基础信息',
   '云清晏_性格调色盘',
   '云清晏_NSFW指导',
   '[DLC]境界描述',
   '[DLC]破境判定',
 ];
 const retiredDlcNames=['[DLC]修行阶梯与仙凡抉择','[DLC]灵潮异象与隐秘特调'];
 assert.ok(!cardEntries.some(entry=>retiredDlcNames.includes(entry.comment)));
 const dlcEntries=new Map(dlcNames.map(name=>[name,cardEntries.find(entry=>entry.comment===name)]));
 const render=(template,vars={},floors=[])=>ejs.render(template,{
   lastMessageId:floors.length-1,
   getvar:(key,options)=> {
     if (options?.scope==='message') return floors[options.withMsg.id]?.[key]??options.defaults;
     return vars[key]??options?.defaults;
   },
 });
 const enabled={'stat_data.剧情.灵气复苏.已开启':true};
 for (const [name,entry] of dlcEntries) {
   assert.ok(entry, '卡内缺 DLC 条目 ' + name);
   assert.equal(entry.enabled,false);
   assert.equal(render(entry.content).trim(),'',name + ' 在无 DLC 的聊天应为空');
   assert.equal(render(entry.content,{'stat_data.剧情.灵气复苏.已开启':false}).trim(),'',name + ' 在封缄的聊天应为空');
 }
 for (const [name,key] of [[dlcNames[1],'老鹰山'],['[DLC]境界描述','暗劲'],['[DLC]破境判定','冲关']]) {
   const entry=dlcEntries.get(name);
   assert.equal(entry.constant,false);
   assert.ok(entry.keys.includes(key));
   assert.equal(entry.extensions.scan_depth,2);
   assert.equal(entry.extensions.exclude_recursion,true);
   assert.equal(entry.extensions.prevent_recursion,true);
   assert.ok(render(entry.content,enabled).trim());
 }
 assert.ok(!cardEntries.some(e=>e.comment.includes('古武与隐秘异闻') || e.comment==='[mvu_update]修仙变量契约' || e.comment==='[DLC]红尘灵根与渡凡引途'));
 const initRaw=read('世界书/变量/initvar.yaml');
 assert.doesNotMatch(initRaw,/云清晏|灵气复苏|修行/);

 const updateRulesTpl=read('世界书/变量/变量更新规则.yaml');
 const rulesOff=render(updateRulesTpl);
 const rulesOn=render(updateRulesTpl,enabled);
 assert.doesNotMatch(rulesOff,/云清晏|灵气复苏|主角\.修行|观澜|道侣/);
 assert.match(rulesOn,/云清晏\.好感度[\s\S]*观澜[\s\S]*问道[\s\S]*动念[\s\S]*同参[\s\S]*道侣/);
 assert.doesNotMatch(rulesOn,/已入班/);

 const plainParsed=schemaBox.schema.parse({世界:{日期:'2020-09-01'},苏晓樯:{好感度:5}});
 assert.equal(plainParsed.云清晏,undefined);
 assert.equal(plainParsed.主角.修行,undefined);
 assert.equal(plainParsed.剧情.灵气复苏,undefined);
 const dlcSave={世界:{日期:'2020-09-13'},剧情:{灵气复苏:{已开启:true,开启日期:'2020-09-03',阶段:'旧值'}},主角:{修行:{境界:'筑基初期',灵气感应:35,功法与秘术:['太微引气篇']}},云清晏:{已入班:true,是否在场:true,好感度:22,关系阶段:'问道',当前境界:'金丹跌境'}};
 const dlcParsed=schemaBox.schema.parse(dlcSave);
 assert.equal(dlcParsed.云清晏.好感度,22);
 assert.equal(dlcParsed.云清晏.已入班,undefined);
 assert.equal(dlcParsed.主角.修行.境界,'筑基初期');
 await callbackBox.write({variables:{stat_data:dlcSave}});
 assert.equal(dlcSave.剧情.灵气复苏.阶段,'古武抬头期');
 assert.equal(dlcSave.云清晏.已入班,undefined,'旧版字段从新楼层清理');
 const dlcPrior=structuredClone(dlcSave);
 dlcSave.云清晏.好感度+=30;
 callbackBox.pace({stat_data:dlcSave},{stat_data:dlcPrior});
 assert.equal(dlcSave.云清晏.好感度,34);

 const dlcMaster=dlcEntries.get(dlcNames[0]).content;
 const origin={'stat_data.剧情.灵气复苏.开启日期':'2020-09-03'};
 const timeline=(date)=>render(dlcMaster,{...enabled,...origin,'stat_data.世界.日期':date});
 for (const [date,day,stage] of [
   ['2020-09-03',1,'微兆潜龙期'], ['2020/09/12',10,'微兆潜龙期'],
   ['2020-09-13',11,'古武抬头期'], ['2020-09-27',25,'古武抬头期'],
   ['2020-09-28',26,'龙眼破禁期'], ['2020-10-17',45,'龙眼破禁期'],
   ['2020-10-18',46,'潜龙秘序期'],
 ]) {
   assert.ok(timeline(date).includes('第 '+day+' 日（'+stage+'）'));
 }
 assert.equal(dlcEntries.get(dlcNames[0]).constant,true);
 assert.match(timeline('2020-09-04'),/华夏龙脉与暨阳暗局[\s\S]*修行契约与无上限阶梯[\s\S]*红尘、长生[\s\S]*旧调频收音机/);
 assert.match(timeline('2020-09-13'),/脱敏归档/);
 assert.match(timeline('2020-09-28'),/特种气象与非典型样本调查组/);
 assert.match(timeline('2020-10-18'),/外地散修与隐门/);
 assert.doesNotMatch(timeline('2020-09-04'),/今日抵达|初次入班/);
 assert.match(timeline('2020-09-04'),/公开所见与私下所知[\s\S]*证据不足时只说观察与推测/);
 const plot=cardEntries.find(entry=>entry.comment==='[mvu_plot]剧情推动器').content;
 assert.doesNotMatch(render(plot),/修仙暗线/);
 assert.match(render(plot,enabled),/当前校园事件或余波先收束/);
 const realm=dlcEntries.get('[DLC]境界描述');
 assert.match(render(realm.content,enabled),/炼气[\s\S]*筑基[\s\S]*金丹[\s\S]*元婴[\s\S]*化神[\s\S]*古武/);
 const breakthrough=dlcEntries.get('[DLC]破境判定');
 assert.match(render(breakthrough.content,enabled),/实际冲关[\s\S]*暂稳[\s\S]*失败保留原境/);

 const [yunBase,yunPalette,yunNsfw]=dlcNames.slice(2,5).map(name=>dlcEntries.get(name).content);
 const scene={...enabled,...origin,'stat_data.世界.日期':'2020-09-04','stat_data.世界.当前位置':'高二重点班教室','stat_data.世界.时间段':'上午','stat_data.剧情.学期':'高二上','stat_data.主角.班级':'高二(8)班'};
 const yun=(tpl,overrides={},floors=[])=>render(tpl,{...scene,...overrides},floors).trim();
 assert.match(yun(yunBase),/初次入班[\s\S]*高二\(8\)班/);
 assert.match(yun(yunBase,{'stat_data.世界.日期':'2020-09-10'}),/初次入班/);
 for (const overrides of [
   {'stat_data.世界.日期':'2020-09-03'}, {'stat_data.世界.当前位置':'奶茶店'},
   {'stat_data.世界.当前位置':'音乐教室'}, {'stat_data.剧情.学期':'暑假'},
   {'stat_data.剧情.学期':'寒假'}, {'stat_data.剧情.学期':'已毕业'},
   {'stat_data.世界.时间段':'深夜'},
 ]) assert.equal(yun(yunBase,overrides),'');
 const present={'stat_data.云清晏.是否在场':true};
 const absent={'stat_data.云清晏.是否在场':false};
 assert.equal(yun(yunBase,absent,[{},present,absent,{}]),'','离场后仍用过往在场记录关闭入班');
 assert.match(yun(yunBase,absent,[{},absent,{}]),/初次入班/);
 assert.match(yun(yunBase,present),/金丹巅峰[\s\S]*元婴大劫[\s\S]*仙凡两隔/);
 assert.doesNotMatch(yun(yunBase,present),/初次入班|今日刚刚/);
 assert.equal(yun(yunPalette),'');
 assert.match(yun(yunPalette,{...present,'stat_data.云清晏.好感度':45,'stat_data.云清晏.关系阶段':'观澜'}),/观澜·尘外冷眸/);
 assert.match(yun(yunPalette,{...present,'stat_data.云清晏.好感度':95,'stat_data.云清晏.关系阶段':'道侣'}),/仙凡重量/);
 assert.equal(yun(yunNsfw,{...present,'stat_data.剧情.当前nsfw':true}),'');
 assert.match(yun(yunNsfw,{...present,'stat_data.云清晏.NSFW':true,'stat_data.剧情.当前nsfw':true}),/NSFW实战指导：云清晏/);

 // JSDOM End-to-End: Multi-function floating console + worldbook injection + antique seal overlay + Status Bar 7->8 transition
 const musicDom=new JSDOM('<!doctype html><body><div id="mount"></div></body>',{runScripts:'dangerously',url:'http://localhost:18970',pretendToBeVisual:true});
 const mw=musicDom.window,md=mw.document;
 try {
 let mockBook=[{name:'世界设定',enabled:true,content:'base'},{name:dlcNames[0],uid:100,enabled:false,content:'旧版总纲'}];
 const mockChats={
   A:{stat_data:{世界:{日期:'2021/07/03',起始年份:'2020'},剧情:{},主角:{姓名:'测试生'}}},
   B:{stat_data:{世界:{日期:'2021/08/09',起始年份:'2020'},剧情:{},主角:{姓名:'测试生'}}},
 };
 const oldFloor={stat_data:{世界:{日期:'2021/07/02'},剧情:{},主角:{}}};
 let chatId='A';
 let onChatChanged;
 let bookWrites=0;
 mw.SillyTavern={getContext:()=>({getCurrentChatId:()=>chatId})};
 mw.tavern_events={CHAT_CHANGED:'chat_changed'};
 mw.eventOn=(name,fn)=>{if(name==='chat_changed') onChatChanged=fn;return {stop(){}};};
 mw.getLastMessageId=()=>4;
 mw.getCurrentMessageId=()=>3;
 mw.getCharWorldbookNames=()=>({primary:'暨阳测试书'});
 mw.getWorldbookNames=()=>['暨阳测试书'];
 mw.getWorldbook=async()=>mockBook;
 mw.updateWorldbookWith=async(name,fn)=>{assert.equal(name,'暨阳测试书');mockBook=fn(mockBook);bookWrites++;return mockBook;};
 mw.getVariables=({message_id}={})=>structuredClone(message_id===3 ? mockChats[chatId] : message_id===2 ? oldFloor : {});
 mw.updateVariablesWith=async(fn,options)=>{
   assert.equal(options.type,'message');
   assert.equal(options.message_id,3,'最新用户楼层无 MVU 时应写最近有状态的楼层');
   mockChats[chatId]=fn(structuredClone(mockChats[chatId]));
   return mockChats[chatId];
 };
 const statusWrap=md.getElementById('mount');
 statusWrap.innerHTML=neutral;
 const history=md.createElement('iframe');
 md.body.append(history);
 history.contentDocument.body.innerHTML=neutral;
 history.contentWindow.getCurrentMessageId=()=>2;
 history.contentWindow.getVariables=mw.getVariables;
 history.contentDocument.querySelector('.jy-date').textContent='2021/07/02';
 mw.eval(engineCode);
 mw.eval(read('脚本/多功能悬浮球.js'));
 const settle=()=>new Promise(r=>mw.setTimeout(r,60));
 const dismissSeal=()=>md.getElementById('jy-aura-seal-overlay')?.click();
 await settle();

 const mp=md.getElementById('jy-floating-music-player');
 assert.ok(mp);
 assert.equal(mp.dataset.theme,'light');
 mw.localStorage.setItem('jy-status-theme','dark');
 mw.dispatchEvent(new mw.CustomEvent('jy-status-theme-changed'));
 assert.equal(mp.dataset.theme,'dark');
 const savedMusic=JSON.parse(mw.localStorage.getItem('jy-music-player:暨阳中学:v2'));
 assert.equal(savedMusic.defaultTracksVersion,5);
 assert.match(savedMusic.playlist[0].sources[0],/^https:\/\/testingcf\.jsdelivr\.net\//);
 assert.equal(bookWrites,0);
 assert.equal(md.querySelector('[data-aura-badge]').hidden,true);
 assert.equal(md.querySelector('[data-dlc-heroine="云清晏"]').hidden,true);

 mp.querySelector('[data-console-tab="codex"]').click();
 assert.equal(mp.querySelector('[data-panel="codex"]').hidden,false);
 mp.querySelector('[data-console-tab="dlc"]').click();
 const toggle=()=>mp.querySelector('[data-action="dlc-toggle"]').click();
 toggle();
 await settle();
 assert.equal(mp.dataset.dlcActive,'true');
 assert.equal(mockBook.length,dlcNames.length+1);
 assert.equal(mockBook.find(entry=>entry.name===dlcNames[0]).uid,100);
 assert.equal(mockChats.A.stat_data.剧情.灵气复苏.开启日期,'2021-07-03');
 assert.equal(mockChats.A.stat_data.云清晏.是否在场,false);
 assert.equal(mockChats.A.stat_data.云清晏.已入班,undefined);
 assert.match(md.getElementById('jy-aura-seal-overlay').textContent,/太虚启封[\s\S]*2021-07-03/);
 dismissSeal();
 assert.equal(md.querySelector('[data-aura-badge]').hidden,false);
 assert.match(md.querySelector('[data-aura-badge-text]').textContent,/第1日 · 微兆潜龙期/);
 assert.equal(history.contentDocument.querySelector('[data-aura-badge]').hidden,true,'历史楼层不接受当前启封');
 assert.equal(md.querySelector('[data-people-all-btn]').textContent,'全部角色 (8)');
 assert.equal(md.querySelector('[data-cultivation-panel]').hidden,false);
 assert.match(md.querySelector('[data-dlc-heroine="云清晏"] .jy-avatar').src,/^data:image\/svg\+xml/);

 chatId='B';
 await onChatChanged();
 assert.equal(mp.dataset.dlcActive,'false');
 assert.equal(mockChats.B.stat_data.剧情.灵气复苏,undefined);
 assert.equal(mockBook.filter(e=>dlcNames.includes(e.name)).every(e=>e.enabled),true);
 for (const entry of mockBook.filter(e=>dlcNames.includes(e.name))) assert.equal(render(entry.content).trim(),'');
 toggle();
 await settle();
 dismissSeal();
 assert.equal(mockChats.B.stat_data.剧情.灵气复苏.开启日期,'2021-08-09');
 assert.equal(bookWrites,1,'第二个聊天复用已同步的条目');
 assert.equal(mockChats.A.stat_data.剧情.灵气复苏.开启日期,'2021-07-03');

 chatId='A';
 await onChatChanged();
 mockChats.A.stat_data.主角.修行.境界='筑基';
 toggle();
 await settle();
 dismissSeal();
 assert.equal(mockChats.A.stat_data.剧情.灵气复苏.已开启,false);
 assert.equal(mockChats.B.stat_data.剧情.灵气复苏.已开启,true);
 assert.equal(bookWrites,1,'封缄只写当前聊天 MVU');
 assert.equal(md.querySelector('[data-people-all-btn]').textContent,'全部角色 (7)');
 mockChats.A.stat_data.世界.日期='2021/07/22';
 toggle();
 await settle();
 dismissSeal();
 assert.equal(mockChats.A.stat_data.剧情.灵气复苏.开启日期,'2021-07-03');
 assert.equal(mockChats.A.stat_data.主角.修行.境界,'筑基');
 assert.match(md.querySelector('[data-aura-badge-text]').textContent,/第20日 · 古武抬头期 · 筑基/);
 assert.equal(history.contentDocument.querySelector('[data-aura-badge]').hidden,true);

 // An already-enabled worldbook from the previous build must be gated even when the open chat is off.
 mockBook.find(entry=>entry.name===dlcNames[0]).content='旧版未门控正文';
 mockBook.push(...retiredDlcNames.map(name=>({name,enabled:true,content:'上一版拆出的条目'})));
 mockChats.B.stat_data.剧情.灵气复苏.已开启=false;
 chatId='B';
 await onChatChanged();
 assert.equal(bookWrites,2);
 assert.ok(mockBook.every(entry=>!retiredDlcNames.includes(entry.name)));
 assert.equal(render(mockBook.find(entry=>entry.name===dlcNames[0]).content).trim(),'');
 assert.equal(mockChats.A.stat_data.剧情.灵气复苏.已开启,true);
 assert.equal(mockChats.B.stat_data.剧情.灵气复苏.已开启,false);

 mw.__jiyangFloatingMusicPlayerV2.destroy();
 mw.__jyStatusEngineV1.destroy();
 assert.equal(md.getElementById('jy-floating-music-player'),null);
 } finally {
   mw.__jiyangFloatingMusicPlayerV2?.destroy?.();
   mw.__jyStatusEngineV1?.destroy?.();
   mw.close();
 }

 console.log('PASS: 学期边界/自定义年份、EJS分期输出、旧存档缺字段、别名配置、只读DOM交互、Bento面板、多功能灵枢控制台/古风特效/世界书注入与云清晏DLC联动全部通过。');
})().catch(e=>{console.error(e);process.exitCode=1;});
