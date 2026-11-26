// 暨阳状态栏渲染引擎：集中注入样式、日历/论坛数据处理与顶层单例弹窗，消除每楼层重复静态 HTML 与脚本开销。
(() => {
  'use strict';

  const ENGINE_KEY = '__jyStatusEngineV1';
  const STORAGE_PREFIX = 'jy-avatar:';
  const ALBUM_STORAGE_PREFIX = 'jy-album:';
  const THEME_KEY = 'jy-status-theme';
  const AVATAR_EVENT = 'jy-avatar-changed';
  const THEME_EVENT = 'jy-status-theme-changed';
  const DLC_EVENT = 'jy-aura-dlc-changed';
  const READY_EVENT = 'jy-status-engine-ready';
  const ASSET_BASE = 'https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/albums/v1';
  const ASSET_BASE_CDN = 'https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/albums/v1';
  const ASSET_BASE_FALLBACK = 'https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/main/albums/v1';

  let hostWin = window;
  try { if (window.top && window.top.document) hostWin = window.top; } catch (_) {}
  const hostDoc = hostWin.document;

  if (hostWin[ENGINE_KEY] && typeof hostWin[ENGINE_KEY].destroy === 'function') {
    try { hostWin[ENGINE_KEY].destroy(); } catch (_) {}
  }

  // JY_PERIODS_BEGIN
  const JY_PERIODS = [{"id":"高二上","start":[0,"08-01"],"end":[1,"02-20"],"activities":[{"id":"opening","name":"开学周","start":[0,"09-01"],"end":[0,"09-07"],"window":"9月1至7日","places":"教学楼","source":"世界书/事件/开学周.yaml"},{"id":"national","name":"国庆假期","start":[0,"10-01"],"end":[0,"10-07"],"window":"10月1至7日","places":"暨阳站、老城生活圈","source":"世界书/事件/国庆假期.yaml"},{"id":"sports","name":"体育周","start":[0,"10-11"],"end":[0,"10-31"],"window":"10月中下旬","places":"操场、操场器材室","source":"世界书/事件/体育周.yaml"},{"id":"midterm","name":"期中考试","start":[0,"11-01"],"end":[0,"11-10"],"window":"11月上旬","places":"教学楼、图书馆","source":"世界书/事件/期中考试.yaml"},{"id":"hike","name":"远足","start":[0,"11-11"],"end":[0,"11-30"],"window":"11月中下旬","places":"老鹰山","source":"世界书/事件/远足.yaml"},{"id":"new-year","name":"元旦","start":[1,"01-01"],"end":[1,"01-01"],"window":"1月1日前后","places":"教学楼","source":"世界书/事件/元旦.yaml"},{"id":"winter","name":"寒假","start":[1,"01-21"],"end":[1,"02-20"],"window":"1月下旬至2月20日前后","places":"城区与家庭","source":"世界书/事件/寒假.yaml"},{"id":"spring-festival","name":"春节","start":null,"end":null,"window":"农历正月初一","places":"城区与家庭","source":"世界书/事件/寒假.yaml"}],"notice":"报到、日常课业与班级分工逐渐稳定。开学前以返校准备与学校公开安排为主。"},{"id":"高二下","start":[1,"02-21"],"end":[1,"06-30"],"activities":[{"id":"arts","name":"艺术周","start":[1,"04-01"],"end":[1,"04-30"],"window":"4月","places":"音乐教室、礼堂后台","source":"世界书/事件/艺术周.yaml"},{"id":"study-trip","name":"高校研学实践","start":[1,"05-10"],"end":[1,"05-20"],"window":"5月中旬","places":"暨阳站、高铁车厢、浙江大学校园","source":"世界书/事件/高校研学实践.yaml"}],"notice":"春季返校后恢复课业。排练、训练和校外集体活动都按各自的通知与报名安排。"},{"id":"暑假","start":[1,"07-01"],"end":[1,"08-31"],"activities":[{"id":"summer-practice","name":"暑期工读与家教实践","start":[1,"07-01"],"end":[1,"08-15"],"window":"7月至8月中旬","places":"遇见奶茶店、御江湾别墅区、老城居民楼、老鹰山、浣江步道","source":"世界书/事件/暑期工读与家教实践.yaml"}],"notice":"学校按假期开放，查看值班与借阅通知。城内家庭、补课、店铺排班各有安排。"},{"id":"高三上","start":[1,"09-01"],"end":[2,"02-20"],"activities":[{"id":"coming-of-age","name":"高三成人礼与首考誓师","start":[1,"10-20"],"end":[1,"11-10"],"window":"10月下旬至11月上旬，以学校正式通知为准","places":"操场（成人门）、大礼堂、高三教室","source":"世界书/事件/高三成人礼与首考誓师.yaml"}],"notice":"年级可能换教室并公布备考安排。社团与班务的交接由实际负责人确认。"},{"id":"高三下","start":[2,"02-21"],"end":[2,"06-30"],"activities":[{"id":"graduation-night","name":"最后一课与毕业散伙狂欢夜","start":[2,"06-01"],"end":[2,"06-20"],"window":"6月上旬至中旬，高考后按班级组织","places":"高三教室、青悦城大酒楼宴会厅、KTV、浣江步道","source":"世界书/事件/最后一课与毕业散伙狂欢夜.yaml"}],"notice":"复习、报考与毕业手续并行。聚会、录取和去向分别等公开通知或本人确认。"},{"id":"已毕业","start":[2,"07-01"],"end":[99,"12-31"],"notice":"返校需要按访客安排登记。同学各有去向，熟悉的地点也会继续日常营业。","activities":[]}];
  // JY_PERIODS_END

  // JY_CAMPUS_BEGIN
  // Shared by the prompt, calendar and MVU. Dates are in the story's local calendar.
  function campusDate(value) {
    const date = typeof value === 'string' ? value.replaceAll('/', '-') : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    const parsed = new Date(date + 'T12:00:00Z');
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
  }

  function campusYear(value) {
    const year = Number(value);
    return Number.isInteger(year) && year >= 1000 && year <= 9900 ? year : 2020;
  }

  function campusAnchor(edge, year) {
    return edge ? `${year + edge[0]}-${edge[1]}` : '';
  }

  function campusPeriod(periods, date, year, academic) {
    if (academic === '已毕业') return periods.find(period => period.id === '已毕业');
    date = campusDate(date);
    if (!date) return null;
    return periods.find(period => date >= campusAnchor(period.start, year) && date <= campusAnchor(period.end, year)) || null;
  }

  function campusAgeAt(birthday, date) {
    const birth = campusDate(birthday);
    const now = campusDate(date);
    if (!birth || !now || birth > now) return null;
    return Number(now.slice(0, 4)) - Number(birth.slice(0, 4)) - Number(now.slice(5) < birth.slice(5));
  }

  function campusPlayerClass(identity, academic) {
    // Keep custom identities, transfers and class changes from the story.
    if (identity !== '暨阳中学高二重点班学生' && identity !== '暨阳中学高三重点班学生') return identity;
    if (academic === '已毕业') return '暨阳中学毕业生';
    if (academic === '高三上' || academic === '高三下') return '暨阳中学高三重点班学生';
    return identity;
  }

  // Shared by the message writeback and the read-only preview of old snapshots.
  function normalizeCampus(value, today, activityIds) {
    const now = campusDate(today);
    const list = posts => Array.isArray(posts) ? posts.filter(post =>
      post && typeof post.标识 === 'string' && post.标识 && typeof post.标题 === 'string' && typeof post.摘要 === 'string'
    ) : [];
    const isNotice = post => post.渠道 === '公告' || (post.渠道 === '班群' &&
      /老师|班主任|班长|班委|吴臻臻|慕佳芊|教务|教导处|年级组|体育组|校方|学生会|团委|学校|组织者|负责人/.test(post.来源 || ''));
    const knownActivity = post => isNotice(post) && activityIds.includes(post.活动标识);
    const dates = post => [campusDate(post.确认开始), campusDate(post.确认结束)];
    const scheduleRecord = (status, start, end) => {
      if (start && end && start <= end) return {状态: status, 开始: start, 结束: end};
      if (status === '已撤销' || status === '已结束') return {状态: status};
      return null;
    };
    const schedule = {};
    for (const id of activityIds) {
      const record = value?.日程?.[id];
      if (!['已确认', '已结束', '已撤销'].includes(record?.状态)) continue;
      const normalized = scheduleRecord(record.状态, campusDate(record.开始), campusDate(record.结束));
      if (normalized) {
        if (normalized.状态 === '已确认' && now && normalized.结束 < now) normalized.状态 = '已结束';
        schedule[id] = normalized;
      }
    }

    const legacy = list(value?.消息);
    // Only dated official notices, or explicit withdrawals of those notices,
    // may be promoted from the old mixed array.
    const legacyNotice = post => {
      const [start, end] = dates(post);
      return knownActivity(post) && (scheduleRecord('已确认', start, end) ||
        post.状态 === '已撤销' || (post.渠道 === '公告' && post.状态 === '已结束'));
    };
    const datedLegacy = legacy.filter(legacyNotice);
    const proposed = list(value?.有效公告);
    const notices = [...datedLegacy, ...proposed.filter(isNotice)];
    const seenPosts = new Set();
    const seenActivities = new Set();
    const active = [];
    const soon = now ? Date.parse(now) + 7 * 86400000 : 0;
    for (let i = notices.length - 1; i >= 0; i--) {
      const post = notices[i];
      const id = knownActivity(post) ? post.活动标识 : null;
      if (seenPosts.has(post.标识) || (id && seenActivities.has(id))) continue;
      seenPosts.add(post.标识);
      if (id) seenActivities.add(id);
      const [start, end] = dates(post);
      const dated = start && end && start <= end;
      const existing = id ? schedule[id] : null;
      const result = post.状态 === '已撤销' ? '已撤销'
        : post.状态 === '已结束' || (dated && now && end < now) ? '已结束' : '已确认';
      if (result === '已确认' && !dated && ['已撤销', '已结束'].includes(existing?.状态)) continue;
      if (id) {
        const record = scheduleRecord(result, dated ? start : existing?.开始, dated ? end : existing?.结束);
        if (record) schedule[id] = record;
      }
      if (result === '已确认') active.push({post, i, near: Boolean(id && now && dated && Date.parse(start) <= soon)});
    }
    const announcements = active.sort((a, b) => Number(b.near) - Number(a.near) || b.i - a.i)
      .slice(0, 3).sort((a, b) => a.i - b.i).map(({post}) => post);
    const seenDynamics = new Set();
    const feed = [...legacy.filter(post => !legacyNotice(post)), ...proposed.filter(post => !isNotice(post)), ...list(value?.动态流)]
      .reverse().filter(post => {
        if (seenDynamics.has(post.标识) || seenPosts.has(post.标识)) return false;
        seenDynamics.add(post.标识);
        return true;
      }).slice(0, 6).reverse().map(post => {
        const {活动标识, 确认开始, 确认结束, ...dynamic} = post;
        return dynamic;
      });
    return {有效公告: announcements, 动态流: feed, 日程: schedule};
  }
  // JY_CAMPUS_END

  // JY_MAP_SCENES_BEGIN
  const MAP_SCENES = {
    "office": ["高二教师办公室（英语组）的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/office.webp"],
    "canteen": ["食堂的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/canteen.webp"],
    "music": ["音乐教室的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/music.webp"],
    "qing": ["青悦城的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/qing.webp"],
    "mall": ["雄风老商场的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mall.webp"],
    "tea": ["遇见奶茶店的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/tea.webp"],
    "heritage": ["西施故里与御江湾的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/heritage.webp"],
    "admin": ["行政楼的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/admin.webp"],
    "oldtown": ["老城生活圈的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/oldtown.webp"],
    "river": ["浣江步道的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/river.webp"],
    "station": ["暨阳站的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/station.webp"],
    "equipment": ["操场器材室的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/equipment.webp"],
    "garden": ["小花园的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/garden.webp"],
    "lab": ["实验楼的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/lab.webp"],
    "roof": ["天台的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/roof.webp"],
    "east": ["城东万风新天地的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/east.webp"],
    "wanda": ["万达宝龙商圈的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/wanda.webp"],
    "kfc": ["KFC与正新鸡排的场景照", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/kfc.webp"],
    "copyshop": ["暑假午后的晨光文具复印店", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/copyshop.webp"],
    "arts": ["艺术周彩排前从侧幕望向舞台", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/arts.webp"],
    "sports": ["体育周开赛前的篮球场", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/sports.webp"],
    "mountain": ["雨后老鹰山的听风亭与步道", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mountain.webp"],
    "corridor": ["雨后湿润的教学楼连廊", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/corridor.webp"],
    "library": ["图书馆靠窗长桌，旧书上放着一张还书单", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/library.webp"],
    "bus": ["傍晚亮起灯的校门公交站", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/bus.webp"],
    "guiyuan": ["老鹰山归元眼的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/guiyuan.webp"],
    "zju": ["浙江大学紫金港校区的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/zju.webp"],
    "qtxie": ["钱塘谢氏剑庐的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/qtxie.webp"],
    "xixige": ["西溪葛氏丹霞的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/xixige.webp"],
    "nanping": ["南屏法华禅院的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/nanping.webp"],
    "shsufu": ["魔都苏氏水府的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/shsufu.webp"],
    "shzhong": ["申城天星钟氏的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/shzhong.webp"],
    "penglai": ["崇明归墟海坛的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/penglai.webp"],
    "siming": ["四明赤水剑宗的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/siming.webp"],
    "tiantai": ["天台赤城洞天的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/tiantai.webp"],
    "tianmu": ["天目灵虚宫的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/tianmu.webp"],
    "maoshan": ["茅山上清宗的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/maoshan.webp"],
    "longhu": ["龙虎山天师府的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/longhu.webp"],
    "wudang": ["武当山紫霄宫的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/wudang.webp"],
    "zhongnan": ["终南山楼观台的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/zhongnan.webp"],
    "qingcheng": ["青城山丈人洞天的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/qingcheng.webp"],
    "kunlun": ["西域昆仑祖脉的场景插图", "https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/kunlun.webp"]
  };
  // JY_MAP_SCENES_END

  // JY_MAP_PLACES_BEGIN
  const MAP_PLACES = [
    {
      "group": "校园",
      "items": [
        { "place": "高二重点班教室", "aliases": ["八班", "高二（8）班", "高二(8)班", "高三八班", "高三教室", "教学楼", "教室"], "scene": "corridor", "notes": ["四楼东侧，楼梯通往英语办公室，出楼可去食堂。", "上课以本班师生为主；课间看布告栏和当天值日，放学后可能只剩值日生。"] },
        { "place": "高二教师办公室（英语组）", "aliases": ["英语办公室", "英语组", "教师办公室"], "scene": "office", "notes": ["教学楼三楼西侧，从八班下楼。", "课间可敲门询问，开会、上课或下班时桌前可能没人。"] },
        { "place": "操场", "aliases": ["篮球场", "跑道"], "scene": "sports", "notes": ["教学区外侧，从食堂与教学楼之间可绕过去。", "晨跑、体育课和放学训练共用场地；午休可能有人占球场。"] },
        { "place": "操场器材室", "aliases": ["操场器材室"], "scene": "equipment", "notes": ["从操场按标识到达。体育课与班赛按体育组值班开放，登记领还球、背心与记分牌。平时归还后锁门。"] },
        { "place": "音乐教室", "aliases": ["音乐教室"], "scene": "music", "notes": ["从教学楼按标识到达。上课优先，课外排练需预约并经值班老师同意。平时用于音乐课、练琴和合唱。"] },
        { "place": "礼堂后台", "aliases": ["礼堂后台"], "scene": "arts", "notes": ["从礼堂观众入口附近按标识到达。节目工作人员与获准演出者从侧门通行。演出后清点道具、断电锁门，平时不开放。"] },
        { "place": "图书馆", "aliases": ["借还台", "文学社长桌", "旧书库"], "scene": "library", "notes": ["校园东南角，从教学楼沿连廊过去。", "午休可查当天开放安排；二楼借还，三楼旧书库有门禁，闭馆后借还暂停。"] },
        { "place": "天台", "aliases": ["楼顶", "天台铁门"], "scene": "roof", "notes": ["教学楼楼梯尽头。", "铁门通常锁着；是否开放以现场为准。"] },
        { "place": "食堂", "aliases": ["小炒窗口", "食堂后门"], "scene": "canteen", "notes": ["教学楼与实验楼之间，后侧连廊可往实验楼。", "饭点开窗口，午餐最挤；过时只剩清理或个别窗口。"] },
        { "place": "小花园", "aliases": ["鹅卵石路", "花园长椅"], "scene": "garden", "notes": ["教学楼与实验楼之间的小路。", "可在课间或傍晚路过；雨后长椅潮湿，值班时可能有人巡视。"] },
        { "place": "实验楼", "aliases": ["竞赛自习室", "竞赛教室", "物理实验室"], "scene": "lab", "notes": ["食堂后侧连廊可到，三楼有竞赛自习室。", "实验室按教师安排开放；放学有训练时才容易见到竞赛组。"] },
        { "place": "行政楼", "aliases": ["年级组会议室", "家长接待室", "校长室", "校长办公室", "教务处"], "scene": "admin", "notes": ["从教学区往行政楼入口，校长室在一楼。", "办公室和会议室按公务开放，先敲门或问值班人员。"] }
      ]
    },
    {
      "group": "校门周边",
      "items": [
        { "place": "暨阳路校门口", "aliases": ["校门口", "校门公交站", "公交站", "暨阳路"], "scene": "bus", "notes": ["出门接暨阳路，沿临街店铺可走到老雄风或青悦城方向。", "上下学接送人多；校内进出看门卫安排，公交以站牌与当班车辆为准。"] },
        { "place": "雄风老商场", "aliases": ["雄风商场", "老雄风", "雄风"], "scene": "mall", "notes": ["从校门沿街可步行到达，街侧有快餐店。", "白天可逛；晚间按各铺营业情况，放学时学生更多在外街停留。"] },
        { "place": "KFC与正新鸡排", "aliases": ["肯德基", "KFC", "正新鸡排"], "scene": "kfc", "notes": ["雄风外侧临街，回校门沿同一条街走。", "放学高峰排队，打烊时间看门店；校服人群多时也可能碰不到熟人。"] },
        { "place": "青悦城", "aliases": ["无招牌咖啡馆", "青悦城四楼"], "scene": "qing", "notes": ["由校门沿主路步行可达，继续向城区可换乘。", "各楼层各自营业，周末午后人多；四楼咖啡馆可按约碰面。"] },
        { "place": "遇见奶茶店", "aliases": ["遇见奶茶", "遇见店"], "scene": "tea", "notes": ["在放学步行圈内，从校门沿临街铺面找。", "放学时常排队。沈若微平日只排晚自习前短班，考试周暂停，周末或假期可排长班。到店可向店员确认当班。"] },
        { "place": "晨光文具复印店", "aliases": ["晨光文具", "复印店", "文印店"], "scene": "copyshop", "notes": ["校门对面临街店铺之一。", "上课前及放学有学生买文具、打资料；晚间按店门公告。"] }
      ]
    },
    {
      "group": "城区",
      "items": [
        { "place": "浣江步道", "aliases": ["浣江边", "浦阳江", "浦阳江边", "河边步道", "浣江路"], "scene": "river", "notes": ["从老城临江街口下到步道，沿江可往西施故里方向。", "傍晚常有散步的人；降雨或水位变化时低处可能封闭。"] },
        { "place": "老城生活圈", "aliases": ["老城窄巷", "老城", "艮塔公园", "次坞打面"], "scene": "oldtown", "notes": ["由暨阳路往旧街和临江巷口走。", "早晚各有营业的食店，窄巷多住户；熟客知道街坊公开消息。"] },
        { "place": "西施故里与御江湾", "aliases": ["西施故里", "御江湾"], "scene": "heritage", "notes": ["从临江步道接景区入口；住宅区有独立门岗。", "景区按公告开放，住宅区访客需住户同意。"] },
        { "place": "城东万风新天地", "aliases": ["万风新天地", "万风"], "scene": "east", "notes": ["由老城向东，可坐公交或由接送车辆前往。", "周末午后餐饮和影院人多，各店分别打烊。"] },
        { "place": "万达宝龙商圈", "aliases": ["万达广场", "宝龙广场", "万达", "宝龙"], "scene": "wanda", "notes": ["两处在不同商业板块，查清目的地再换乘。", "电影、购物和吃饭各有时段；出发前确认是哪个商场。"] },
        { "place": "老鹰山", "aliases": ["老鹰山步道", "老鹰山山脚", "听风亭", "老鹰山观景台"], "scene": "mountain", "notes": ["路线：城区 → 山脚入口 → 主步道 → 听风亭 → 观景台；可原路返回。", "白天按公告开放，雨后侧路湿滑，雷雨或封山时另约。春季新叶、夏季阵雨、秋季远足和冬季短日照会改变现场。", "从城区先到山脚入口，再沿步道上山。", "周末天气好时有散步和登山的人；雨后或天黑后按现场管制。"] },
        { "place": "暨阳站", "aliases": ["高铁站", "暨阳火车站"], "scene": "station", "notes": ["在城西，从校门或老城坐公交或打车。", "按票面车次和站内公告通行，接送人可在站外公共区域等。"] }
      ]
    },
    { "group": "暨阳 · 灵脉", "dlc": true, "items": [
      {"place": "老鹰山归元眼", "aliases": ["归元眼", "太微云岫宗遗殿", "太微云岫宗山门", "听风归元窍", "荒径枯井"], "scene": "guiyuan", "notes": ["老鹰山荒径深处的封门与地下灵泉，山门随实际线索显露。"]}
    ] },
    { "group": "杭城", "dlc": true, "items": [
      {"place": "浙江大学紫金港校区", "aliases": ["浙大紫金港", "紫金港校区", "浙大管理学院"], "scene": "zju", "notes": ["现代大学校园，管理学院与图书馆是谢昭宁日常出入的地点。"]},
      {"place": "钱塘谢氏剑庐", "aliases": ["钱塘剑庐", "谢氏剑庐", "六和塔镇江古眼", "镇江古眼", "钱塘潮汐秘市", "钱塘秘市"], "scene": "qtxie", "notes": ["钱塘潮畔的藏书门庭，六和塔下古眼与潮汐秘市另有通路。"]},
      {"place": "西溪葛氏丹霞", "aliases": ["西溪葛氏", "抱朴丹霞小洞天", "葛氏丹霞", "古方药庄"], "scene": "xixige", "notes": ["西溪水巷深处的药庄与丹霞洞天。"]},
      {"place": "南屏法华禅院", "aliases": ["南屏古刹", "法华禅院", "南屏古寺"], "scene": "nanping", "notes": ["西湖南屏古刹后的止观禅院，内院与前山香火分开。"]}
    ] },
    { "group": "魔都与东海", "dlc": true, "items": [
      {"place": "魔都苏氏水府", "aliases": ["沧溟水府", "苏氏水府", "魔都苏氏", "东海苏家"], "scene": "shsufu", "notes": ["东海近海孤屿与浦江海底灵窍相通的隐世水府。"]},
      {"place": "申城天星钟氏", "aliases": ["静安古钟阁", "天星钟氏", "申城钟氏"], "scene": "shzhong", "notes": ["静安老洋房内的私人古钟阁，暗藏星算与测绘阵具。"]},
      {"place": "崇明归墟海坛", "aliases": ["崇明归墟", "崇明东滩海坛", "东海蓬莱", "蓬莱仙岛", "方丈仙岛", "瀛洲仙岛"], "scene": "penglai", "notes": ["崇明东滩落潮方露的海坛，是通往东海三仙岛的门户。"]}
    ] },
    { "group": "江浙山门", "dlc": true, "items": [
      {"place": "四明赤水剑宗", "aliases": ["四明山", "赤水剑宗", "四明山赤水剑宗"], "scene": "siming", "notes": ["四明山绝壁云瀑后的浙东古剑宗。"]},
      {"place": "天台赤城洞天", "aliases": ["天台山", "天台赤城", "赤城洞天"], "scene": "tiantai", "notes": ["与国清寺同山的赤城洞天，沿丹霞石阶可抵山门。"]},
      {"place": "天目灵虚宫", "aliases": ["天目山", "西天目山", "灵虚宫"], "scene": "tianmu", "notes": ["浙西天目山古杉间的道门净明宗。"]},
      {"place": "茅山上清宗", "aliases": ["茅山", "上清洞天", "茅山山门", "上清宗"], "scene": "maoshan", "notes": ["江南三茅峰上的上清祖庭。"]}
    ] },
    { "group": "华夏名山", "dlc": true, "items": [
      {"place": "龙虎山天师府", "aliases": ["龙虎山", "龙虎山张氏", "天师府"], "scene": "longhu", "notes": ["泸溪河与丹霞群峰之间的正一祖庭。"]},
      {"place": "武当山紫霄宫", "aliases": ["武当山", "武当", "紫霄宫"], "scene": "wudang", "notes": ["武当七十二峰中沿石阶展开的真武道场。"]},
      {"place": "终南山楼观台", "aliases": ["终南山", "楼观台", "终南隐修地"], "scene": "zhongnan", "notes": ["秦岭松林深处的全真清修地。"]},
      {"place": "青城山丈人洞天", "aliases": ["青城山", "青城丈人峰", "丈人洞天"], "scene": "qingcheng", "notes": ["川西青城山隐雾中的药岭与洞天入口。"]},
      {"place": "西域昆仑祖脉", "aliases": ["昆仑祖脉", "昆仑山", "西域昆仑"], "scene": "kunlun", "notes": ["西域雪岭深处的神州龙脉总枢。"]}
    ] }
  ];
  // JY_MAP_PLACES_END

  const MAP_ATLASES = {
    before: {
      title: '暨阳地图 · 灵气复苏前',
      file: 'jiyang-before.webp',
      pins: [['暨阳中学', 27, 35], ['万风新天地', 76, 33], ['旧城', 46, 50], ['浦阳江', 45, 68], ['老鹰山', 86, 76]]
    },
    after: {
      title: '华夏灵脉图 · 灵气复苏后',
      file: 'huaxia-after.webp',
      pins: [['昆仑祖脉', 19, 35], ['青城山', 39, 54], ['终南山', 50, 44], ['武当山', 59, 53], ['龙虎山', 63, 69], ['江浙山门', 69, 48], ['魔都', 78, 55], ['杭城', 73, 65], ['暨阳', 74, 76], ['东海', 87, 63]]
    }
  };

  const ALBUMS = {
    '许念安': [['nianan/campus.webp', '课间还作业'], ['nianan/library.webp', '图书馆的雨天'], ['nianan/home-diary.webp', '午后居家'], ['nianan/rainy-bookshop.webp', '雨天书店']],
    '苏晚棠': [
      ['su/campus.png', '校园走廊'], ['su/outdoor.png', '天台咖啡'],
      ['su/weekend-breakfast.webp', '周末的草莓吐司'], ['su/ps4-night.webp', '最后一个弯 · PS4 游戏夜'],
      ['su/pic-2.png', '书店闲逛'], ['su/pic-3.png', '雨夜街边'], ['su/pic-4.png', '街角午后']
    ],
    '温书语': [['wen/campus.png', '午后教室'], ['wen/outdoor.png', '旧书店']],
    '沈若微': [['shen/campus.png', '安静课间'], ['shen/outdoor.png', '奶茶店']],
    '慕佳芊': [
      ['mu/campus.png', '办公室'], ['mu/outdoor.png', '旧街散步'],
      ['mu/pic-1.png', '校外照片 01'], ['mu/pic-2.png', '校外照片 02'],
      ['mu/pic-3.png', '校外照片 03'], ['mu/pic-4.png', '校外照片 04'], ['mu/pic-5.png', '校外照片 05']
    ],
    '陈芷汀': [
      ['chen/campus.png', '校园门口'], ['chen/outdoor.png', '城市午后'],
      ['chen/pic-1.png', '校外照片 01'], ['chen/pic-2.png', '校外照片 02'], ['chen/pic-3.png', '校外照片 03'],
      ['chen/pic-4.png', '校外照片 04'], ['chen/pic-5.png', '校外照片 05'], ['chen/pic-6.png', '校外照片 06']
    ],
    '虞淑婉': [
      ['yu/campus.png', '校长室'], ['yu/outdoor.png', '书店傍晚'],
      ['yu/pic-2.png', '生活照片 02'], ['yu/pic-3.png', '生活照片 03'], ['yu/pic-4.png', '生活照片 04'], ['yu/pic-6.jpg', '生活照片 06']
    ],
    '云清晏': [['yunqingyan/campus.webp', '校服 · 初入暨阳'], ['yunqingyan/teahouse.webp', '便装 · 雨后茶铺'], ['yunqingyan/mountain.webp', '宗门服 · 老鹰山']],
    '谢昭宁': [
      ['xiezhaoning/campus.webp', '学院装 · 紫金港'], ['xiezhaoning/sword.webp', '剑庐装 · 钱塘潮'],
      ['xiezhaoning/market.webp', '夜行装 · 潮汐秘市'], ['xiezhaoning/spring.webp', '春日装 · 湖边桂糕'],
      ['xiezhaoning/city.webp', '城市装 · 暮色天台']
    ]
  };

  const CHAR_THRESHOLDS = {
    '苏晚棠': [20, 50, 80, 90],
    '温书语': [20, 50, 80, 90],
    '沈若微': [20, 50, 80, 90],
    '许念安': [20, 50, 80, 90],
    '慕佳芊': [20, 50, 80, 90],
    '陈芷汀': [40, 60, 80, 90],
    '虞淑婉': [25, 55, 80, 90],
    '云清晏': [20, 50, 80, 90],
    '谢昭宁': [20, 50, 80, 90]
  };

  const PROFILES = {
    '许念安': { name: '念安', initial: '念', bg: '#4f688a' },
    '苏晚棠': { name: 'Margot.', initial: 'M', bg: '#c95b42' },
    '温书语': { name: '兰舟.', initial: '舟', bg: '#3c7399' },
    '沈若微': { name: '小微', initial: '微', bg: '#8a6d52' },
    '陈芷汀': { name: '汀汀不听话✨', initial: '汀', bg: '#b4456c' },
    '慕佳芊': { name: 'Mumu慕老师', initial: '芊', bg: '#c9882c' },
    '虞淑婉': { name: '虞淑婉', initial: '婉', bg: '#2e5950' },
    '云清晏': { name: '云清晏', initial: '云', bg: '#1d6b61' },
    '谢昭宁': { name: '谢昭宁', initial: '谢', bg: '#2b5f75' },
    '吴臻臻': { name: 'Zhen_23⚡', initial: 'Z', bg: '#1c1c1e' },
    'Zhen': { name: 'Zhen_23⚡', initial: 'Z', bg: '#1c1c1e' }
  };

  const IGNORED_MAP_ALIASES = new Set(['公交站', '高铁站', '复印店', '文印店', '教师办公室']);

  const SHARED_CSS = `
    .jy-status {
      position: relative;
      --c-ink: #1e2a27;
      --c-muted: #5d6e68;
      --c-soft: #85948e;
      --c-paper: #faf7f0;
      --c-panel: #ffffff;
      --c-wash: #f2ede1;
      --c-line: rgba(30, 86, 76, 0.16);
      --c-primary: #1e564c;
      --c-accent: #c97b36;
      --c-warm: #d8a657;
      --c-cool: #3c7399;
      --c-crimson: #b83c4c;
      --rose-ink: #95385f;
      --rose-wash: #f9e2eb;
      --rose-line: #e8bdd0;
      --shadow-panel: 0 12px 28px rgba(24, 42, 37, 0.1), 0 2px 6px rgba(24, 42, 37, 0.05);
      box-sizing: border-box;
      width: min(740px, calc(100% - 12px));
      margin: 10px auto;
      color: var(--c-ink);
      font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
      font-size: 12.5px;
      line-height: 1.48;
      color-scheme: light;
    }
    .jy-status *, .jy-status *::before, .jy-status *::after { box-sizing: border-box; }
    .jy-status [hidden] { display: none !important; }

    .jy-shell {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--c-line);
      border-radius: 14px;
      background:
        radial-gradient(circle at 100% 0%, rgba(201, 123, 54, 0.09), transparent 38%),
        radial-gradient(circle at 0% 0%, rgba(30, 86, 76, 0.09), transparent 34%),
        var(--c-paper);
      box-shadow: var(--shadow-panel);
    }
    .jy-shell::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(30, 86, 76, 0.035) 1px, transparent 1px) 0 0 / 20px 20px,
        linear-gradient(rgba(30, 86, 76, 0.03) 1px, transparent 1px) 0 0 / 20px 20px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 48%);
    }

    /* Header */
    .jy-head {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px 12px;
      padding: 12px 14px 10px;
      border-bottom: 1px solid var(--c-line);
      background: linear-gradient(120deg, rgba(235, 243, 238, 0.9), rgba(250, 245, 235, 0.94));
    }
    .jy-badge {
      position: relative;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      background: linear-gradient(145deg, #1e564c, #2f7d72);
      color: #fdfaf2;
      font-family: ui-serif, "Noto Serif SC", "Songti SC", serif;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.08;
      letter-spacing: 0.06em;
      box-shadow: 0 4px 10px rgba(30, 86, 76, 0.24), inset 0 0 0 2px rgba(216, 166, 87, 0.35);
    }
    .jy-title { flex: 1 1 180px; min-width: 0; }
    .jy-kicker-row { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
    .jy-kicker { color: var(--c-muted); font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; }
    .jy-loc-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(30, 86, 76, 0.1);
      color: var(--c-primary);
      font-size: 10px;
      font-weight: 750;
    }
    .jy-loc-pill[data-empty="true"] { display: none; }
    .jy-location {
      margin-top: 2px;
      color: var(--c-ink);
      font-family: ui-serif, "Noto Serif SC", "Songti SC", serif;
      font-size: clamp(16px, 2.8vw, 20px);
      font-weight: 850;
      line-height: 1.24;
      overflow-wrap: anywhere;
    }
    .jy-time {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      padding: 5px 10px;
      border: 1px solid var(--c-line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
      font-variant-numeric: tabular-nums;
    }
    .jy-date { color: var(--c-accent); font-size: 12px; font-weight: 800; }
    .jy-weekday { color: var(--c-ink); font-size: 11px; font-weight: 700; }
    .jy-period {
      padding: 1px 6px;
      border-radius: 5px;
      background: rgba(30, 86, 76, 0.09);
      color: var(--c-primary);
      font-size: 10.5px;
      font-weight: 700;
    }

    .jy-scene-tools { display: flex; align-items: center; gap: 6px; }
    .jy-theme-button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 58px; height: 34px; padding: 2px; border: 0; border-radius: 999px; background: transparent; cursor: pointer;
    }
    .jy-theme-track {
      position: relative; display: flex; align-items: center; justify-content: space-between;
      width: 52px; height: 28px; padding: 0 5px;
      border: 1px solid rgba(30, 86, 76, 0.22); border-radius: 999px;
      background: #e6eadf; color: #5c7067;
    }
    .jy-theme-track::before {
      content: ""; position: absolute; z-index: 0; top: 3px; left: 3px;
      width: 20px; height: 20px; border-radius: 50%; background: #fffcf5;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); transition: transform .2s ease;
    }
    .jy-theme-icon { position: relative; z-index: 1; display: grid; place-items: center; width: 14px; height: 14px; }
    .jy-theme-icon svg { display: block; width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
    .jy-theme-sun { color: #c58432; }
    .jy-theme-moon { color: #5f7167; }
    .jy-status[data-theme="dark"] .jy-theme-track { border-color: #5b7268; background: #1a2822; color: #b7d3c2; }
    .jy-status[data-theme="dark"] .jy-theme-track::before { transform: translateX(24px); background: #d6e6d8; }

    .jy-map-button, .jy-inventory-button {
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
      min-height: 34px; border: 1px solid rgba(30, 86, 76, 0.22); border-radius: 8px;
      background: rgba(255, 255, 255, 0.86); color: var(--c-primary);
      cursor: pointer; font: inherit; font-size: 12px; font-weight: 750;
      transition: transform .14s ease, background .14s ease, border-color .14s ease;
    }
    .jy-map-button { padding: 0 10px; }
    .jy-map-button svg, .jy-inventory-button svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
    .jy-inventory-button { position: relative; width: 34px; padding: 0; color: var(--c-accent); border-color: rgba(201, 123, 54, 0.28); }
    .jy-map-button:hover, .jy-inventory-button:hover { transform: translateY(-1px); background: #fff; }
    .jy-inventory-count {
      position: absolute; right: -5px; bottom: -5px; display: grid; place-items: center;
      min-width: 16px; height: 16px; padding: 0 3px; border: 1px solid #fff; border-radius: 999px;
      background: var(--c-accent); color: #fff; font-size: 9.5px; font-weight: 800; line-height: 1;
    }

    /* Scene Strip */
    .jy-scene-now {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      padding: 7px 14px;
      border-bottom: 1px solid var(--c-line);
      background: var(--c-wash);
      font-size: 11.5px;
    }
    .jy-scene-now b { color: var(--c-primary); font-weight: 750; margin-right: 3px; }
    .jy-stage-chip {
      display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px;
      border-radius: 999px; background: rgba(30, 86, 76, 0.11); color: var(--c-primary); font-weight: 750;
    }
    .jy-aura-chip {
      display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px;
      border: 1px solid rgba(201, 146, 56, 0.42); border-radius: 999px;
      background: linear-gradient(120deg, rgba(29, 107, 97, 0.14), rgba(201, 146, 56, 0.12));
      color: var(--c-primary); font-weight: 750;
    }
    .jy-aura-chip b { color: var(--c-accent); }
    .jy-intimate-note { display: none; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 999px; background: var(--rose-wash); color: var(--rose-ink); font-weight: 800; }
    .jy-status[data-intimate-scene="true" i] .jy-intimate-note { display: inline-flex; }

    /* Bento Tabs */
    .jy-tabs {
      position: relative;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 5px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--c-line);
      background: rgba(255, 255, 255, 0.45);
    }
    .jy-tab-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-width: 0;
      min-height: 34px;
      padding: 4px 6px;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: var(--c-muted);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      font-weight: 750;
      white-space: nowrap;
      transition: background .15s ease, color .15s ease, border-color .15s ease, box-shadow .15s ease;
    }
    .jy-tab-btn:hover { background: rgba(30, 86, 76, 0.06); color: var(--c-ink); }
    .jy-tab-btn[aria-selected="true"] {
      border-color: var(--c-line);
      background: var(--c-panel);
      color: var(--c-primary);
      box-shadow: 0 2px 8px rgba(24, 42, 37, 0.08);
    }
    .jy-tab-count {
      display: inline-grid;
      place-items: center;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      border-radius: 999px;
      background: rgba(30, 86, 76, 0.12);
      color: var(--c-primary);
      font-size: 10px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    /* Tab Panels */
    .jy-panels { position: relative; padding: 10px 12px 12px; }
    .jy-tab-panel { display: none; animation: jyFadeIn .16s ease; }
    .jy-tab-panel[data-active="true"] { display: block; }
    @keyframes jyFadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

    .jy-people-bar {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 8px; margin-bottom: 9px;
    }
    .jy-people-hint { color: var(--c-muted); font-size: 11px; }
    .jy-filter-pills { display: inline-flex; padding: 2px; border: 1px solid var(--c-line); border-radius: 8px; background: var(--c-wash); }
    .jy-filter-pill {
      border: 0; border-radius: 6px; padding: 4px 10px; background: transparent;
      color: var(--c-muted); cursor: pointer; font: inherit; font-size: 11px; font-weight: 750;
    }
    .jy-filter-pill[aria-pressed="true"] { background: var(--c-panel); color: var(--c-primary); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

    /* People Cards */
    .jy-people { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .jy-people[data-view="all"] { grid-template-columns: repeat(auto-fill, minmax(195px, 1fr)); }
    .jy-person {
      --tone: var(--c-primary);
      min-width: 0;
      padding: 10px 11px;
      border: 1px solid var(--c-line);
      border-left: 3.5px solid var(--tone);
      border-radius: 10px;
      background: var(--c-panel);
      box-shadow: 0 3px 12px rgba(24, 42, 37, 0.05);
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .jy-person[data-tone="warm"] { --tone: #c95b42; }
    .jy-person[data-tone="quiet"] { --tone: #3c7399; }
    .jy-person[data-tone="guard"] { --tone: #8a6d52; }
    .jy-person[data-tone="perfect"] { --tone: #4f688a; }
    .jy-person[data-tone="bright"] { --tone: #c9882c; }
    .jy-person[data-tone="silk"] { --tone: #b4456c; }
    .jy-person[data-tone="principal"] { --tone: #2e5950; }
    .jy-person[data-tone="immortal"] { --tone: #1d6b61; border-top-color: rgba(201, 146, 56, 0.36); }
    .jy-person[data-tone="azure-sword"] { --tone: #2b5f75; border-top-color: rgba(91, 164, 194, 0.38); }
    .jy-immortal-pill {
      padding: 0 5px; border: 1px solid rgba(201, 146, 56, 0.45); border-radius: 4px;
      background: linear-gradient(120deg, rgba(29, 107, 97, 0.14), rgba(201, 146, 56, 0.14));
      color: #1d6b61; font-size: 9.5px; font-weight: 750;
    }
    .jy-status[data-theme="dark"] .jy-immortal-pill { color: #8ad3be; border-color: rgba(226, 184, 98, 0.42); }
    .jy-cultivation-panel {
      grid-column: 1 / -1;
      margin-top: 8px; padding: 10px 12px;
      border: 1px solid rgba(180, 122, 46, 0.34);
      border-radius: 9px;
      background: linear-gradient(140deg, rgba(26, 84, 73, 0.08), rgba(180, 122, 46, 0.08));
      box-shadow: inset 0 0 0 1px rgba(180, 122, 46, 0.12);
    }
    .jy-cultivation-head {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 10px;
      margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--c-line);
    }
    .jy-cultivation-title {
      font-family: ui-serif, "Noto Serif SC", "Songti SC", serif;
      font-size: 12px; font-weight: 850; letter-spacing: 0.04em; color: var(--c-primary);
    }
    .jy-cultivation-title::before { content: "❖ "; color: var(--c-accent); }
    .jy-cultivation-stage-pill {
      padding: 1px 8px; border: 1px solid rgba(180, 122, 46, 0.4); border-radius: 999px;
      background: rgba(180, 122, 46, 0.12); color: var(--c-accent); font-size: 10.5px; font-weight: 800;
    }
    .jy-cultivation-metrics {
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin-bottom: 7px;
    }
    .jy-cult-tile {
      min-width: 0; padding: 6px 8px; border: 1px solid var(--c-line); border-radius: 7px;
      background: color-mix(in srgb, var(--c-panel) 84%, transparent);
      display: flex; flex-direction: column; gap: 2px;
    }
    .jy-cult-tile b { color: var(--c-muted); font-size: 10px; font-weight: 750; letter-spacing: 0.03em; }
    .jy-cult-tile span { color: var(--c-ink); font-size: 11.5px; font-weight: 800; overflow-wrap: anywhere; }
    .jy-cult-tile-realm span { color: var(--c-primary); font-family: ui-serif, "Noto Serif SC", "Songti SC", serif; }
    .jy-cult-state-val[data-state-alert="true"] { color: var(--c-crimson); }
    .jy-cult-qi-row { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }
    .jy-cult-qi-bar {
      position: relative; height: 5px; margin-top: 3px; border-radius: 999px;
      background: rgba(112, 86, 46, 0.14); overflow: hidden;
    }
    .jy-cult-qi-fill {
      display: block; height: 100%; width: calc(clamp(0, var(--qi, 0), 100) * 1%);
      border-radius: inherit;
      background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
      transition: width .3s ease;
    }
    .jy-cultivation-lists { display: grid; gap: 5px; font-size: 11px; }
    .jy-cult-list-row {
      display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 6px; align-items: baseline;
      padding: 4px 7px; border-radius: 6px; background: color-mix(in srgb, var(--c-wash) 72%, transparent);
    }
    .jy-cult-list-row b { color: var(--c-primary); font-size: 10.5px; }
    .jy-cult-list-row span { color: var(--c-ink); overflow-wrap: anywhere; }
    .jy-person[data-present="false"],
    .jy-person[data-present="False"],
    .jy-person[data-present="0"],
    .jy-person[data-present="否"],
    .jy-person[data-present="不在场"] { display: none; }
    .jy-people[data-view="all"] .jy-person[data-present="false"],
    .jy-people[data-view="all"] .jy-person[data-present="False"],
    .jy-people[data-view="all"] .jy-person[data-present="0"],
    .jy-people[data-view="all"] .jy-person[data-present="否"],
    .jy-people[data-view="all"] .jy-person[data-present="不在场"] {
      display: block;
      opacity: 0.72;
    }
    .jy-people[data-view="all"] .jy-detail-grid,
    .jy-people[data-view="all"] .jy-thought { display: none; }
    .jy-person-offsite-loc { display: none; margin-top: 5px; color: var(--c-muted); font-size: 10.5px; overflow-wrap: anywhere; }
    .jy-people[data-view="all"] .jy-person-offsite-loc { display: block; }
    .jy-people-empty {
      grid-column: 1 / -1;
      padding: 22px 14px;
      border: 1px dashed var(--c-line);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.48);
      color: var(--c-muted);
      text-align: center;
      font-size: 12px;
    }

    .jy-person-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .jy-avatar {
      flex: 0 0 auto; width: 44px; height: 44px;
      border: 2px solid var(--tone); border-radius: 50%;
      object-fit: cover; object-position: center top;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      cursor: zoom-in; transition: transform .16s ease;
    }
    .jy-avatar:hover { transform: scale(1.06); }
    .jy-name-wrap { flex: 1 1 auto; min-width: 0; }
    .jy-name-line { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 5px; }
    .jy-name { font-size: 13.5px; font-weight: 800; color: var(--c-ink); overflow-wrap: anywhere; }
    .jy-presence-dot {
      display: none; padding: 0 5px; border-radius: 4px;
      background: rgba(30, 86, 76, 0.12); color: var(--c-primary); font-size: 9.5px; font-weight: 750;
    }
    .jy-people[data-view="all"] .jy-person:not([data-present="false"]):not([data-present="False"]):not([data-present="0"]) .jy-presence-dot { display: inline-block; }
    .jy-unlock-heart {
      display: none; place-items: center; width: 18px; height: 18px;
      border: 1px solid var(--rose-line); border-radius: 50%;
      background: var(--rose-wash); color: var(--rose-ink); font-size: 11px; line-height: 1;
    }
    .jy-person[data-intimacy-unlocked="true" i] .jy-unlock-heart { display: inline-grid; }
    .jy-meta-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 2px; }
    .jy-stage {
      padding: 1px 6px; border-radius: 5px;
      background: color-mix(in srgb, var(--tone) 12%, transparent);
      color: var(--tone); font-size: 10px; font-weight: 750;
    }
    .jy-mood {
      max-width: 100%; padding: 1px 7px; border-radius: 999px;
      background: rgba(216, 166, 87, 0.2); color: #865e14;
      font-size: 10px; font-weight: 700; overflow-wrap: anywhere;
    }
    .jy-lock-pill {
      padding: 0 5px; border-radius: 4px;
      background: rgba(138, 109, 82, 0.15); color: #7a5c3d;
      font-size: 9.5px; font-weight: 750;
    }
    .jy-control-pill {
      padding: 0 5px; border-radius: 4px;
      background: rgba(184, 60, 76, 0.14); color: var(--c-crimson);
      font-size: 9.5px; font-weight: 800;
    }
    .jy-album-button {
      display: inline-grid; place-items: center; flex: 0 0 auto;
      width: 28px; height: 28px; border: 1px solid var(--c-line); border-radius: 7px;
      background: var(--c-wash); color: var(--tone); cursor: pointer; font-size: 0;
    }
    .jy-album-button::before {
      content: ""; width: 14px; height: 11px; border: 1.8px solid currentColor; border-radius: 2.5px;
      background: radial-gradient(circle at 72% 30%, currentColor 0 1.4px, transparent 1.6px),
        linear-gradient(142deg, transparent 48%, currentColor 49% 53%, transparent 54%) 0 100% / 100% 65% no-repeat;
    }
    .jy-album-button:hover { background: var(--c-panel); border-color: var(--tone); }

    /* Progress Bars with Threshold Ticks */
    .jy-bar-row { margin-top: 7px; }
    .jy-bar-top { display: flex; justify-content: space-between; align-items: center; gap: 6px; color: var(--c-muted); font-size: 10.5px; }
    .jy-num { color: var(--tone); font-weight: 800; font-variant-numeric: tabular-nums; }
    .jy-bar {
      position: relative; height: 6px; margin-top: 3px; overflow: hidden;
      border-radius: 999px; background: rgba(30, 42, 39, 0.1);
    }
    .jy-fill {
      --v: 0;
      display: block; width: clamp(0%, calc(var(--v) * 1%), 100%); height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, color-mix(in srgb, var(--tone) 68%, #fff), var(--tone));
      transition: width .25s ease;
    }
    .jy-bar[data-metric="control"][data-level="high"] .jy-fill,
    .jy-bar[data-metric="control"][data-level="critical"] .jy-fill {
      background: linear-gradient(90deg, #d8707c, #b83c4c);
    }
    .jy-tick {
      position: absolute; top: 0; bottom: 0; width: 1.5px;
      background: rgba(255, 255, 255, 0.72); pointer-events: none;
    }

    .jy-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px 8px; margin-top: 7px; }
    .jy-detail { display: flex; gap: 4px; align-items: baseline; min-width: 0; }
    .jy-detail-wide { grid-column: 1 / -1; }
    .jy-detail b { flex: 0 0 auto; color: var(--c-muted); font-size: 10px; font-weight: 700; }
    .jy-detail span { min-width: 0; color: var(--c-ink); font-size: 11px; overflow-wrap: anywhere; white-space: normal; }
    .jy-thought {
      margin-top: 7px; padding: 5px 8px;
      border-left: 2px solid color-mix(in srgb, var(--tone) 55%, transparent);
      border-radius: 0 7px 7px 0;
      background: color-mix(in srgb, var(--tone) 6%, var(--c-paper));
      color: var(--c-muted); font-size: 11px; line-height: 1.5; overflow-wrap: anywhere;
    }
    .jy-thought::before { content: "「"; color: var(--tone); opacity: 0.7; }
    .jy-thought::after { content: "」"; color: var(--tone); opacity: 0.7; }

    /* Student ID Pass */
    .jy-student-card {
      position: relative;
      padding: 13px 14px;
      border: 1.5px solid var(--c-primary);
      border-radius: 12px;
      background:
        radial-gradient(circle at 96% 10%, rgba(201, 123, 54, 0.1), transparent 36%),
        linear-gradient(135deg, var(--c-panel) 0%, var(--c-wash) 100%);
      box-shadow: 0 6px 18px rgba(30, 86, 76, 0.1);
      overflow: hidden;
    }
    .jy-card-top-decor {
      display: flex; justify-content: space-between; align-items: center; gap: 10px;
      padding-bottom: 7px; margin-bottom: 10px; border-bottom: 2px solid var(--c-primary);
    }
    .jy-card-school-cn { font-family: ui-serif, "Noto Serif SC", "Songti SC", serif; font-size: 14px; font-weight: 900; color: var(--c-primary); }
    .jy-card-school-en { font-size: 8px; font-weight: 750; color: var(--c-muted); letter-spacing: 0.08em; }
    .jy-card-barcode {
      width: 58px; height: 20px; border-radius: 2px; opacity: 0.55;
      background: repeating-linear-gradient(90deg, var(--c-primary) 0 2px, transparent 2px 4px, var(--c-primary) 4px 5px, transparent 5px 8px, var(--c-primary) 8px 11px, transparent 11px 13px);
    }
    .jy-card-body { display: grid; grid-template-columns: 78px minmax(0, 1fr); gap: 12px; align-items: start; }
    .jy-card-photo-frame {
      position: relative; width: 76px; height: 96px; border: 2px solid var(--c-primary); border-radius: 6px;
      overflow: hidden; background: #213e38;
    }
    .jy-card-photo-frame .jy-avatar.jy-me-avatar { width: 100%; height: 100%; border: 0; border-radius: 0; }
    .jy-card-photo-stamp {
      position: absolute; bottom: 2px; right: 2px; padding: 1px 4px; border-radius: 3px;
      background: rgba(30, 86, 76, 0.9); color: #fff; font-size: 8px; pointer-events: none;
    }
    .jy-card-info-table { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .jy-card-name-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-bottom: 2px; }
    .jy-card-name-val { font-size: 16px; font-weight: 900; color: var(--c-ink); }
    .jy-me-tag { padding: 1px 7px; border-radius: 999px; background: rgba(60, 115, 153, 0.14); color: var(--c-cool); font-size: 10px; font-weight: 700; }
    .jy-card-row { display: grid; grid-template-columns: 44px minmax(0, 1fr); font-size: 11.5px; line-height: 1.42; }
    .jy-card-row b { color: var(--c-primary); font-size: 10.5px; }
    .jy-card-id-num { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 750; color: var(--c-ink); }
    .jy-me-dot { margin: 0 4px; color: var(--c-soft); }
    .jy-me-look { margin-top: 3px; color: var(--c-muted); font-size: 10.5px; overflow-wrap: anywhere; }
    .jy-card-dossier { grid-column: 1 / -1; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--c-line); position: relative; }
    .jy-card-dossier summary {
      list-style: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 6px; background: rgba(30, 86, 76, 0.09);
      color: var(--c-primary); font-size: 11px; font-weight: 750;
    }
    .jy-card-dossier summary::-webkit-details-marker { display: none; }
    .jy-card-dossier-grid { display: grid; gap: 5px; margin-top: 7px; padding-right: 72px; font-size: 11px; }
    .jy-card-dossier-grid div { display: grid; grid-template-columns: 60px minmax(0, 1fr); gap: 6px; }
    .jy-card-dossier-grid b { color: var(--c-primary); font-size: 10.5px; }
    .jy-card-seal {
      position: absolute; bottom: 2px; right: 4px; width: 62px; height: 62px;
      border: 2px dashed rgba(184, 60, 76, 0.68); border-radius: 50%; transform: rotate(-12deg);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: rgba(184, 60, 76, 0.85); font-size: 6.5px; font-weight: 800; text-align: center; line-height: 1.1; pointer-events: none;
    }
    .jy-card-seal-star { font-size: 11px; margin: 1px 0; }
    .jy-id-actions { margin-top: 8px; display: flex; justify-content: flex-end; }

    /* Campus Forum & Calendar */
    .jy-readout { border: 0; margin: 0; background: transparent; }
    .jy-readout > summary.jy-bento-hidden-summary { display: none; }
    .jy-calendar-body { color: var(--c-ink); }
    .jy-page-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 9px; }
    .jy-page-toolbar label { display: inline-flex; align-items: center; gap: 6px; font-weight: 750; font-size: 12px; }
    .jy-calendar-body select { min-height: 32px; padding: 3px 8px; border: 1px solid var(--c-line); border-radius: 7px; background: var(--c-panel); color: var(--c-ink); font: inherit; }
    .jy-page-note { margin: 0; color: var(--c-muted); font-size: 11.5px; }
    .jy-calendar-foot { margin-top: 9px; }
    [data-schedule] { margin: 0 0 10px; padding: 6px 10px; border-left: 3px solid var(--c-primary); border-radius: 0 6px 6px 0; background: var(--c-wash); color: var(--c-muted); font-size: 11.5px; line-height: 1.55; }
    [data-calendar-events] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
    .jy-calendar-entry {
      display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 7px 9px; border: 1px solid var(--c-line); border-radius: 8px; background: var(--c-panel); overflow-wrap: anywhere;
    }
    .jy-calendar-entry[data-near] { border-color: var(--c-primary); background: color-mix(in srgb, var(--c-primary) 7%, var(--c-panel)); }
    .jy-month-stamp { padding: 4px 2px; border-radius: 6px; background: var(--c-wash); color: var(--c-accent); text-align: center; font-size: 10.5px; font-weight: 800; }
    .jy-event-window { color: var(--c-muted); font-size: 10.5px; margin-top: 1px; }
    .jy-event-state { padding: 2px 6px; border-radius: 999px; background: var(--c-wash); color: var(--c-muted); font-size: 10px; font-weight: 700; white-space: nowrap; }
    .jy-calendar-entry[data-near] .jy-event-state { background: rgba(30, 86, 76, 0.14); color: var(--c-primary); }

    .jy-forum-announcements { padding-bottom: 9px; margin-bottom: 9px; border-bottom: 1px dashed var(--c-line); }
    .jy-forum-edition { display: inline-flex; align-items: center; gap: 6px; margin: 0 0 6px; color: var(--c-primary); font-size: 12.5px; font-weight: 800; }
    .jy-forum-edition span { width: 7px; height: 7px; border-radius: 50%; background: var(--c-accent); }
    .jy-feed { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
    .jy-feed li {
      display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 9px;
      padding: 9px 11px; border: 1px solid var(--c-line); border-radius: 10px; background: var(--c-panel); overflow-wrap: anywhere;
    }
    .jy-moment-avatar { width: 36px; height: 36px; border-radius: 8px; display: grid; place-items: center; color: #fff; font-size: 14px; font-weight: 800; overflow: hidden; }
    .jy-moment-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .jy-moment-box { min-width: 0; }
    .jy-feed-top { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-bottom: 2px; }
    .jy-moment-user { font-size: 12.5px; font-weight: 800; color: var(--c-cool); }
    .jy-feed-tag { padding: 1px 6px; border-radius: 4px; background: var(--c-wash); color: var(--c-muted); font-size: 9.5px; font-weight: 750; }
    .jy-feed-tag[data-channel="公告"] { background: #e3f2fd; color: #1565c0; }
    .jy-feed-tag[data-channel="班群"] { background: #e8f5e9; color: #2e7d32; }
    .jy-feed-tag[data-channel="朋友圈"] { background: #fce4ec; color: #c2185b; }
    .jy-feed-tag[data-channel="八卦"] { background: #fff3e0; color: #e65100; }
    .jy-feed-tag[data-channel="来信"] { background: #f3e5f5; color: #7b1fa2; }
    .jy-feed-tag[data-channel="趣事"] { background: #e0f7fa; color: #00838f; }
    .jy-feed-tag[data-channel="修士风闻"] { background: #e9e8f3; color: #554478; }
    .jy-feed-tag[data-channel="余波"] { background: #ffebee; color: #c62828; }
    .jy-feed-source { font-size: 10.5px; color: var(--c-muted); }
    .jy-moment-title { display: block; margin: 2px 0; font-size: 13px; font-weight: 800; color: var(--c-ink); }
    .jy-moment-body { margin: 0 0 4px; font-size: 12px; color: var(--c-ink); line-height: 1.5; }
    .jy-moment-footer small { color: var(--c-muted); font-size: 10.5px; }
    .jy-moment-interactions { margin-top: 5px; padding: 6px 8px; border-radius: 7px; background: var(--c-wash); border: 1px solid var(--c-line); font-size: 11px; display: grid; gap: 3px; }
    .jy-moment-likes { color: var(--c-cool); font-weight: 650; }
    .jy-moment-likes::before { content: "♡ "; color: #d9534f; font-weight: 800; }
    .jy-comment-user { font-weight: 800; color: var(--c-cool); margin-right: 4px; }

    .jy-foot {
      display: flex; justify-content: space-between; gap: 10px;
      padding: 8px 14px 10px; border-top: 1px solid var(--c-line);
      color: var(--c-muted); font-size: 10.5px;
    }

    /* Dark Mode */
    .jy-status[data-theme="dark"] {
      --c-ink: #e2ebe5;
      --c-muted: #9eb3aa;
      --c-soft: #758a81;
      --c-paper: #161e1c;
      --c-panel: #1e2926;
      --c-wash: #25332f;
      --c-line: rgba(158, 208, 188, 0.17);
      --c-primary: #8bcbb5;
      --c-accent: #e5a365;
      --c-cool: #88b9e6;
      --rose-ink: #ffb9d4;
      --rose-wash: #512e42;
      --rose-line: #80526b;
      color: var(--c-ink);
      color-scheme: dark;
    }
    .jy-status[data-theme="dark"] .jy-head { background: linear-gradient(120deg, #1b2824, #222c27); }
    .jy-status[data-theme="dark"] .jy-time,
    .jy-status[data-theme="dark"] .jy-map-button,
    .jy-status[data-theme="dark"] .jy-inventory-button { background: #263530; border-color: var(--c-line); }
    .jy-status[data-theme="dark"] .jy-tabs { background: rgba(18, 25, 23, 0.55); }
    .jy-status[data-theme="dark"] .jy-mood { background: rgba(226, 165, 94, 0.16); color: #f1c482; }
    .jy-status[data-theme="dark"] .jy-bar { background: rgba(255, 255, 255, 0.1); }
    .jy-status[data-theme="dark"] .jy-tick { background: rgba(22, 30, 28, 0.8); }
    .jy-status[data-theme="dark"] .jy-card-barcode { opacity: 0.4; }
    .jy-status[data-theme="dark"] .jy-student-card { background: linear-gradient(135deg, #1e2a26 0%, #24322d 100%); }

    /* Intimate Scene Theme (preserves --scene-paper tokens) */
    .jy-status[data-intimate-scene="true" i] {
      --c-ink: #4b2b3a;
      --c-muted: #745565;
      --c-primary: var(--rose-ink);
      --scene-paper: #fff5f8;
      --scene-panel: #fffbfc;
      --scene-head: linear-gradient(115deg, #f6d7e4, #ffefee);
      --scene-shadow: 0 4px 0 -1px #f5d8e3, 0 9px 22px #6f2a4b21;
    }
    .jy-status[data-theme="dark"][data-intimate-scene="true" i] {
      --c-ink: #f8e5ee;
      --c-muted: #d1adbf;
      --scene-paper: #281c27;
      --scene-panel: #322330;
      --scene-head: linear-gradient(115deg, #49263c, #322436);
      --scene-shadow: 0 0 0 1px #d886ad1f, 0 9px 22px #120b1599;
    }
    .jy-status[data-intimate-scene="true" i] .jy-shell { background: var(--scene-paper); border-color: var(--rose-line); box-shadow: var(--scene-shadow); }
    .jy-status[data-intimate-scene="true" i] .jy-head { background: var(--scene-head); border-color: var(--rose-line); }
    .jy-status[data-intimate-scene="true" i] .jy-badge { background: #8a3c62; border-color: #a6577d; }
    .jy-status[data-intimate-scene="true" i] :is(.jy-time, .jy-person, .jy-student-card, .jy-calendar-entry, .jy-feed li) { background: var(--scene-panel); border-color: var(--rose-line); }
    .jy-status[data-intimate-scene="true" i] .jy-person { border-left-color: var(--tone); }
    .jy-status[data-intimate-scene="true" i] .jy-scene-now { background: var(--rose-wash); border-color: var(--rose-line); }

    /* Ancient-Ink Cultivation Skin (DLC Active · Day / Night / NSFW) */
    .jy-status[data-dlc-active="true"] {
      --c-ink: #1b1814;
      --c-muted: #5b5244;
      --c-soft: #857a69;
      --c-paper: #f3ecdc;
      --c-panel: #faf5e9;
      --c-wash: #e8dec7;
      --c-line: rgba(122, 92, 48, 0.24);
      --c-primary: #195348;
      --c-accent: #b37426;
      --c-cool: #34627d;
      --c-crimson: #9f2f3c;
      --shadow-panel: 0 14px 32px rgba(34, 24, 12, 0.14), inset 0 0 0 1px rgba(179, 116, 38, 0.18);
    }
    .jy-status[data-dlc-active="true"] .jy-shell {
      border-radius: 10px;
      border-color: rgba(122, 92, 48, 0.34);
      background:
        radial-gradient(circle at 96% 4%, rgba(179, 116, 38, 0.11), transparent 36%),
        radial-gradient(circle at 4% 0%, rgba(25, 83, 72, 0.09), transparent 34%),
        var(--c-paper);
      box-shadow: var(--shadow-panel);
    }
    .jy-status[data-dlc-active="true"] .jy-shell::before {
      background:
        linear-gradient(90deg, rgba(122, 92, 48, 0.05) 1px, transparent 1px) 0 0 / 26px 26px,
        linear-gradient(rgba(122, 92, 48, 0.045) 1px, transparent 1px) 0 0 / 26px 26px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent 55%);
    }
    .jy-status[data-dlc-active="true"] .jy-head {
      background: linear-gradient(125deg, #e9dfc6 0%, #f5eedb 55%, #e6dcc2 100%);
      border-bottom: 1.5px solid var(--c-line);
    }
    .jy-status[data-dlc-active="true"] .jy-badge {
      border-radius: 7px;
      background: linear-gradient(155deg, #271e19, #151412);
      color: #f6e7c4;
      border: 1px solid rgba(214, 166, 86, 0.52);
      box-shadow: 0 4px 12px rgba(24, 18, 12, 0.28), inset 0 0 0 2px rgba(214, 166, 86, 0.34);
    }
    .jy-status[data-dlc-active="true"] :is(.jy-name, .jy-card-name-val, .jy-moment-title, .jy-map-title) {
      font-family: ui-serif, "Noto Serif SC", "Songti SC", serif;
    }
    .jy-status[data-dlc-active="true"] .jy-scene-now {
      background: color-mix(in srgb, var(--c-wash) 88%, var(--c-paper));
    }
    .jy-status[data-dlc-active="true"] .jy-aura-chip {
      border-color: rgba(179, 116, 38, 0.45);
      background: linear-gradient(120deg, rgba(25, 83, 72, 0.13), rgba(179, 116, 38, 0.14));
    }
    .jy-status[data-dlc-active="true"] .jy-tabs {
      background: color-mix(in srgb, var(--c-wash) 55%, transparent);
    }
    .jy-status[data-dlc-active="true"] .jy-tab-btn[aria-selected="true"] {
      border-color: var(--c-line);
      border-bottom: 2px solid var(--c-accent);
      box-shadow: 0 2px 8px rgba(34, 24, 12, 0.08);
    }
    .jy-status[data-dlc-active="true"] .jy-person {
      border-radius: 8px;
      border-top-color: rgba(179, 116, 38, 0.24);
      box-shadow: 0 3px 12px rgba(34, 24, 12, 0.06);
    }
    .jy-status[data-dlc-active="true"] .jy-fill {
      background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] {
      --c-ink: #ece4d3;
      --c-muted: #a99e8a;
      --c-soft: #787061;
      --c-paper: #12110f;
      --c-panel: #1b1915;
      --c-wash: #23201a;
      --c-line: rgba(214, 173, 102, 0.22);
      --c-primary: #7dc9b6;
      --c-accent: #dfa252;
      --c-cool: #8db9d8;
      --c-crimson: #ef838f;
      --shadow-panel: 0 14px 34px rgba(0, 0, 0, 0.46), inset 0 0 0 1px rgba(223, 162, 82, 0.16);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] .jy-head {
      background: linear-gradient(125deg, #1b1813 0%, #151917 60%, #1d1a14 100%);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] .jy-badge {
      background: linear-gradient(155deg, #1d1a15, #100f0d);
      color: #f4deb0;
      border-color: rgba(223, 162, 82, 0.5);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] :is(.jy-time, .jy-map-button, .jy-inventory-button) {
      background: #23201a; border-color: var(--c-line);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] .jy-student-card {
      background: linear-gradient(135deg, #1a1915 0%, #221f19 100%);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"] .jy-cultivation-panel {
      border-color: rgba(223, 162, 82, 0.34);
      background: linear-gradient(140deg, rgba(125, 201, 182, 0.08), rgba(223, 162, 82, 0.08));
    }
    .jy-status[data-dlc-active="true"][data-intimate-scene="true" i] {
      --c-ink: #381b24;
      --c-muted: #764a58;
      --c-primary: #992e49;
      --c-accent: #b86c36;
      --rose-ink: #992e49;
      --rose-wash: #f4dcdf;
      --rose-line: rgba(153, 46, 73, 0.3);
      --scene-paper: #faf0ee;
      --scene-panel: #fff8f6;
      --scene-head: linear-gradient(125deg, #efd2d4, #f7e6de);
      --scene-shadow: 0 12px 28px rgba(96, 30, 48, 0.14), inset 0 0 0 1px rgba(184, 108, 54, 0.22);
    }
    .jy-status[data-dlc-active="true"][data-intimate-scene="true" i] .jy-badge {
      background: linear-gradient(155deg, #7c2236, #561625);
      border-color: rgba(230, 179, 106, 0.52);
      color: #f9e8cb;
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"][data-intimate-scene="true" i] {
      --c-ink: #f7e6ea;
      --c-muted: #cba6b2;
      --c-primary: #ee94ad;
      --c-accent: #e5aa66;
      --rose-ink: #ee94ad;
      --rose-wash: #381d29;
      --rose-line: rgba(238, 148, 173, 0.28);
      --scene-paper: #191014;
      --scene-panel: #24161c;
      --scene-head: linear-gradient(125deg, #341824, #1f141a);
      --scene-shadow: 0 14px 32px rgba(10, 4, 8, 0.6), inset 0 0 0 1px rgba(229, 170, 102, 0.18);
    }
    .jy-status[data-dlc-active="true"][data-theme="dark"][data-intimate-scene="true" i] .jy-cultivation-panel {
      border-color: rgba(238, 148, 173, 0.32);
      background: linear-gradient(140deg, rgba(153, 46, 73, 0.16), rgba(229, 170, 102, 0.08));
    }

    .jy-status :is(button, input, select, summary):focus-visible { outline: 2px solid var(--c-accent); outline-offset: 2px; }

    @media (max-width: 640px) {
      .jy-status { width: min(100%, calc(100% - 8px)); margin: 8px auto; }
      .jy-people, [data-calendar-events], .jy-cultivation-metrics { grid-template-columns: 1fr; }
      .jy-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 420px) {
      .jy-head { padding: 10px 10px 9px; gap: 8px; }
      .jy-scene-tools { margin-left: auto; }
      .jy-panels { padding: 8px 9px 10px; }
      .jy-card-body { grid-template-columns: 1fr; }
      .jy-card-dossier-grid { padding-right: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .jy-theme-track::before, .jy-tab-panel, .jy-fill, .jy-cult-qi-fill, .jy-avatar { transition: none; animation: none; }
    }
  `;

  const OVERLAY_CSS = `
    #jy-status-overlay-root {
      --c-ink: #1e2a27;
      --c-muted: #5d6e68;
      --c-paper: #faf7f0;
      --c-panel: #ffffff;
      --c-wash: #f2ede1;
      --c-line: rgba(30, 86, 76, 0.16);
      --c-primary: #1e564c;
      --c-accent: #c97b36;
      font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: var(--c-ink);
    }
    #jy-status-overlay-root[data-theme="dark"] {
      --c-ink: #e2ebe5;
      --c-muted: #9eb3aa;
      --c-paper: #161e1c;
      --c-panel: #1e2926;
      --c-wash: #25332f;
      --c-line: rgba(158, 208, 188, 0.18);
      --c-primary: #8bcbb5;
      --c-accent: #e5a365;
    }
    #jy-status-overlay-root[data-dlc-active="true"] {
      --c-ink: #1b1814;
      --c-muted: #5b5244;
      --c-paper: #f3ecdc;
      --c-panel: #faf5e9;
      --c-wash: #e8dec7;
      --c-line: rgba(122, 92, 48, 0.24);
      --c-primary: #195348;
      --c-accent: #b37426;
    }
    #jy-status-overlay-root[data-dlc-active="true"][data-theme="dark"] {
      --c-ink: #ece4d3;
      --c-muted: #a99e8a;
      --c-paper: #12110f;
      --c-panel: #1b1915;
      --c-wash: #23201a;
      --c-line: rgba(214, 173, 102, 0.22);
      --c-primary: #7dc9b6;
      --c-accent: #dfa252;
    }
    #jy-status-overlay-root[data-dlc-active="true"][data-intimate-scene="true" i] {
      --c-ink: #381b24;
      --c-muted: #764a58;
      --c-paper: #faf0ee;
      --c-panel: #fff8f6;
      --c-wash: #f4dcdf;
      --c-line: rgba(153, 46, 73, 0.28);
      --c-primary: #992e49;
      --c-accent: #b86c36;
    }
    #jy-status-overlay-root[data-dlc-active="true"][data-theme="dark"][data-intimate-scene="true" i] {
      --c-ink: #f7e6ea;
      --c-muted: #cba6b2;
      --c-paper: #191014;
      --c-panel: #24161c;
      --c-wash: #381d29;
      --c-line: rgba(238, 148, 173, 0.26);
      --c-primary: #ee94ad;
      --c-accent: #e5aa66;
    }
    #jy-status-overlay-root *, #jy-status-overlay-root *::before, #jy-status-overlay-root *::after { box-sizing: border-box; }
    #jy-status-overlay-root [hidden] { display: none !important; }
    .jy-ov-modal {
      position: fixed;
      inset: 0;
      z-index: 2147482000;
      display: none;
      place-items: center;
      padding: 16px;
      background: rgba(18, 26, 24, 0.64);
      backdrop-filter: blur(6px);
    }
    .jy-ov-modal[data-open="true"] { display: grid; }
    .jy-photo-viewer { z-index: 2147482200; background: rgba(12, 18, 16, 0.82); }
    .jy-avatar-modal { z-index: 2147482150; }
    .jy-album-modal { z-index: 2147482100; }
    .jy-ov-card {
      width: min(860px, 100%);
      max-height: min(86dvh, 780px);
      overflow: auto;
      overscroll-behavior: contain;
      border: 1px solid var(--c-line);
      border-radius: 14px;
      background: var(--c-paper);
      color: var(--c-ink);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);
      padding: 14px;
    }
    .jy-inventory-card { width: min(540px, 100%); }
    .jy-avatar-card { width: min(460px, 100%); }
    .jy-map-head, .jy-album-head {
      position: sticky; top: -14px; z-index: 2;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      margin: -14px -14px 12px; padding: 12px 14px;
      border-bottom: 1px solid var(--c-line); background: var(--c-paper);
    }
    .jy-map-title, .jy-album-title { flex: 1 1 auto; min-width: 0; font-size: 15px; font-weight: 850; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .jy-avatar-button, .jy-album-action {
      min-height: 32px; padding: 6px 10px; border: 1px solid var(--c-line); border-radius: 7px;
      background: var(--c-panel); color: var(--c-ink); cursor: pointer; font: inherit; font-size: 12px; font-weight: 700;
    }
    .jy-avatar-button:hover, .jy-album-action:hover { border-color: var(--c-primary); color: var(--c-primary); }
    .jy-avatar-input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none; }
    .jy-avatar-big { display: block; width: 100%; aspect-ratio: 1 / 1; border-radius: 10px; object-fit: cover; object-position: center top; background: var(--c-wash); }
    .jy-avatar-toolbar { display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; gap: 6px; align-items: center; margin-top: 10px; }
    .jy-avatar-title { font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .jy-avatar-notice { grid-column: 1 / -1; margin: 2px 0 0; color: var(--c-muted); font-size: 11.5px; }
    .jy-map-picture { margin: 0 0 10px; border: 1px solid var(--c-line); border-radius: 9px; padding: 6px 10px; background: var(--c-panel); }
    .jy-map-picture summary { cursor: pointer; font-weight: 750; color: var(--c-primary); }
    .jy-map-world { position: relative; width: min(100%, 82vh); margin: 8px auto 0; }
    .jy-map-image { display: block; width: 100%; height: auto; border-radius: 8px; }
    .jy-map-pins { display: none; pointer-events: none; }
    .jy-map-world[data-ready="true"] .jy-map-pins { display: block; }
    .jy-map-pin {
      position: absolute; transform: translate(-50%, -50%); white-space: nowrap;
      border: 1px solid #e1c990; border-radius: 5px; padding: 1px 4px;
      background: #193b35; color: #fff5d8; font-size: clamp(9px, 1.7vw, 13px); line-height: 1.3;
    }
    .jy-map-card[data-img-missing="true"] .jy-map-pins { display: none; }
    .jy-map-unavailable { display: none; padding: 14px; text-align: center; color: var(--c-muted); }
    .jy-map-card[data-img-missing="true"] .jy-map-unavailable { display: block; }
    .jy-place-directory label { display: block; font-weight: 750; margin-bottom: 5px; }
    .jy-place-directory input[type="search"] {
      width: 100%; min-height: 38px; padding: 6px 10px; margin-bottom: 10px;
      border: 1px solid var(--c-line); border-radius: 8px; background: var(--c-panel); color: var(--c-ink); font: inherit;
    }
    .jy-place-group h3 { margin: 12px 0 4px; color: var(--c-primary); font-size: 13px; font-weight: 800; }
    .jy-place { border-bottom: 1px solid var(--c-line); padding: 2px 0; }
    .jy-place summary { min-height: 38px; display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 700; }
    .jy-place p { margin: 4px 0 7px; color: var(--c-muted); font-size: 12px; }
    .jy-place-current { padding: 1px 6px; border-radius: 999px; background: rgba(30, 86, 76, 0.14); color: var(--c-primary); font-size: 10.5px; font-weight: 750; }
    .jy-map-scene-image { display: block; width: 100%; aspect-ratio: 16 / 7; object-fit: cover; border-radius: 8px; margin: 4px 0 8px; }
    .jy-map-scene-image:not([src]) { display: none; }
    .jy-inventory-list { display: grid; gap: 8px; }
    .jy-inventory-item { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 10px; padding: 10px; border-left: 3px solid var(--c-accent); border-radius: 8px; background: var(--c-panel); border: 1px solid var(--c-line); border-left-width: 3px; border-left-color: var(--c-accent); }
    .jy-inventory-mark { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 7px; background: var(--c-wash); color: var(--c-accent); font-size: 11px; font-weight: 800; }
    .jy-inventory-name { font-weight: 800; }
    .jy-inventory-description { color: var(--c-muted); font-size: 12px; margin-top: 2px; overflow-wrap: anywhere; }
    .jy-inventory-empty, .jy-album-empty { padding: 20px; border: 1px dashed var(--c-line); border-radius: 9px; text-align: center; color: var(--c-muted); }
    .jy-album-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .jy-album-item { border: 1px solid var(--c-line); border-radius: 9px; overflow: hidden; background: var(--c-panel); }
    .jy-album-photo { display: block; width: 100%; height: auto; max-height: 46vh; object-fit: contain; background: var(--c-wash); cursor: zoom-in; }
    .jy-album-caption { padding: 6px 8px 2px; color: var(--c-muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .jy-album-actions { display: flex; gap: 5px; padding: 5px 7px 8px; }
    .jy-album-action { flex: 1 1 auto; padding: 5px; font-size: 11px; }
    .jy-album-action[data-kind="remove"] { color: #b83c4c; }
    .jy-photo-viewer-card { position: relative; width: min(820px, 100%); max-height: 90vh; padding: 10px; border-radius: 14px; background: var(--c-paper); border: 1px solid var(--c-line); }
    .jy-photo-viewer-card > .jy-avatar-button { position: absolute; top: 16px; right: 16px; z-index: 2; }
    .jy-photo-viewer-image { display: block; width: 100%; max-height: calc(90vh - 64px); border-radius: 8px; object-fit: contain; }
    .jy-photo-viewer-caption { padding-top: 7px; text-align: center; font-size: 12px; font-weight: 700; }
    @media (max-width: 520px) {
      .jy-ov-modal { padding: 8px; }
      .jy-album-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .jy-avatar-toolbar { grid-template-columns: 1fr 1fr; }
      .jy-avatar-title { grid-column: 1 / -1; }
    }
  `;

  function escapeXml(value) {
    return String(value || '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function fallbackAvatarUri(label) {
    const text = escapeXml(String(label || '?').trim().slice(0, 1) || '?');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#e6eee9"/><text x="64" y="82" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif" font-size="54" font-weight="600" fill="#1e564c">${text}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function cdnAlternatives(url) {
    if (!url || typeof url !== 'string') return [];
    const list = [];
    if (url.includes('testingcf.jsdelivr.net/gh/')) {
      list.push(url);
      list.push(url.replace('https://testingcf.jsdelivr.net/gh/', 'https://cdn.jsdelivr.net/gh/'));
      list.push(url.replace(/^https:\/\/testingcf\.jsdelivr\.net\/gh\/([^/]+\/[^/@]+)@([^/]+)\//, 'https://raw.githubusercontent.com/$1/$2/'));
    } else if (url.includes('cdn.jsdelivr.net/gh/')) {
      list.push(url.replace('https://cdn.jsdelivr.net/gh/', 'https://testingcf.jsdelivr.net/gh/'));
      list.push(url);
      list.push(url.replace(/^https:\/\/cdn\.jsdelivr\.net\/gh\/([^/]+\/[^/@]+)@([^/]+)\//, 'https://raw.githubusercontent.com/$1/$2/'));
    } else {
      list.push(url);
    }
    return [...new Set(list)];
  }

  function guardImage(image) {
    if (!image || image.dataset.jyGuard === '1' || image.classList.contains('jy-map-scene-image')) return;
    image.dataset.jyGuard = '1';
    image.addEventListener('error', () => {
      const queue = (image.dataset.fallbackQueue || image.dataset.fallbackSrc || '').split('|').filter(Boolean);
      const current = image.getAttribute('src') || '';
      const next = queue.find(u => u && u !== current && !(image.dataset.triedUrls || '').split('|').includes(u));
      if (next) {
        image.dataset.triedUrls = (image.dataset.triedUrls ? image.dataset.triedUrls + '|' : '') + current;
        image.setAttribute('src', next);
        return;
      }
      if (image.dataset.jyFallbackDone === '1') return;
      image.dataset.jyFallbackDone = '1';
      if (image.classList.contains('jy-map-image')) {
        image.style.display = 'none';
        const card = image.closest('.jy-map-card');
        if (card) card.dataset.imgMissing = 'true';
        return;
      }
      if (image.classList.contains('jy-photo-viewer-image')) return;
      const label = image.getAttribute('alt') || image.dataset.avatarKey || image.dataset.albumKey || '?';
      image.src = fallbackAvatarUri(label);
    });
  }

  function readTheme() {
    try { return hostWin.localStorage.getItem(THEME_KEY) || 'light'; } catch (_) { return 'light'; }
  }

  function getStoredAvatar(name) {
    try { return hostWin.localStorage.getItem(STORAGE_PREFIX + name); } catch (_) { return null; }
  }

  function setStoredAvatar(name, dataUrl) {
    try {
      hostWin.localStorage.setItem(STORAGE_PREFIX + name, dataUrl);
      hostWin.dispatchEvent(new hostWin.CustomEvent(AVATAR_EVENT));
      return true;
    } catch (_) { return false; }
  }

  function removeStoredAvatar(name) {
    try {
      hostWin.localStorage.removeItem(STORAGE_PREFIX + name);
      hostWin.dispatchEvent(new hostWin.CustomEvent(AVATAR_EVENT));
      return true;
    } catch (_) { return false; }
  }

  function getStoredAlbum(name) {
    try {
      const parsed = JSON.parse(hostWin.localStorage.getItem(ALBUM_STORAGE_PREFIX + name) || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.src === 'string') : [];
    } catch (_) { return []; }
  }

  function setStoredAlbum(name, items) {
    try {
      hostWin.localStorage.setItem(ALBUM_STORAGE_PREFIX + name, JSON.stringify(items.slice(-6)));
      return true;
    } catch (_) { return false; }
  }

  function compactImage(dataUrl, done, maxSize = 1536, quality = 0.95) {
    const image = new hostWin.Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = hostDoc.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL('image/jpeg', quality));
    };
    image.onerror = () => done(dataUrl);
    image.src = dataUrl;
  }

  function sceneValue(element) {
    const value = element?.textContent.trim() || '';
    const bracePair = String.fromCharCode(123, 123);
    return (value.startsWith(bracePair) || /^(?:undefined$|null$|待确定$)/i.test(value)) ? '' : value;
  }

  function parseInventory(raw) {
    if (!raw || raw === '[]' || raw === '{}') return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    const items = [];
    let current = null;
    raw.split(/\r?\n/).forEach(line => {
      const name = line.match(/^\s*-?\s*名称\s*:\s*(.+)\s*$/);
      const description = line.match(/^\s*描述\s*:\s*(.+)\s*$/);
      if (name) {
        current = { 名称: name[1].trim().replace(/^['"]|['"]$/g, ''), 描述: '' };
        items.push(current);
      } else if (description && current) {
        current.描述 = description[1].trim().replace(/^['"]|['"]$/g, '');
      }
    });
    return items;
  }

  // ---------- 顶层单例弹窗宿主机 ----------
  let overlayRoot = null;
  let activeReturnFocus = null;
  let activeAvatarEl = null;
  let activeAlbumKey = '';
  let avatarImportId = 0;

  function ensureOverlayStyle() {
    if (hostDoc.getElementById('jy-status-overlay-style')) return;
    const style = hostDoc.createElement('style');
    style.id = 'jy-status-overlay-style';
    style.textContent = OVERLAY_CSS;
    hostDoc.head.append(style);
  }

  function syncOverlayTheme(sourceRoot) {
    if (!overlayRoot) return;
    overlayRoot.dataset.theme = readTheme() === 'dark' ? 'dark' : 'light';
    if (sourceRoot && sourceRoot.dataset) {
      overlayRoot.dataset.dlcActive = sourceRoot.dataset.dlcActive === 'true' ? 'true' : 'false';
      overlayRoot.dataset.intimateScene = String(sourceRoot.dataset.intimateScene || 'false').toLowerCase() === 'true' ? 'true' : 'false';
    }
  }

  function buildPlaceDetails(placeItem) {
    const details = hostDoc.createElement('details');
    details.className = 'jy-place';
    details.dataset.place = placeItem.place;
    details.dataset.aliases = placeItem.aliases.join('|');
    details.dataset.scene = placeItem.scene;
    const summary = hostDoc.createElement('summary');
    summary.textContent = placeItem.place + ' ';
    const curr = hostDoc.createElement('span');
    curr.className = 'jy-place-current';
    curr.hidden = true;
    curr.textContent = '当前位置';
    summary.append(curr);
    details.append(summary);
    for (const note of placeItem.notes) {
      const p = hostDoc.createElement('p');
      p.textContent = note;
      details.append(p);
    }
    const img = hostDoc.createElement('img');
    img.className = 'jy-map-scene-image';
    img.alt = '';
    img.decoding = 'async';
    details.append(img);
    details.addEventListener('toggle', () => {
      const scene = MAP_SCENES[details.dataset.scene];
      if (details.open && scene && !img.hasAttribute('src')) {
        const [alt, src] = scene;
        img.alt = alt;
        const alts = cdnAlternatives(src);
        let idx = 0;
        img.addEventListener('error', () => {
          idx += 1;
          if (idx < alts.length) img.src = alts[idx];
          else img.hidden = true;
        });
        img.src = alts[0] || src;
      }
    });
    return details;
  }

  function ensureOverlayRoot() {
    ensureOverlayStyle();
    if (overlayRoot && overlayRoot.isConnected) {
      syncOverlayTheme();
      return overlayRoot;
    }
    hostDoc.getElementById('jy-status-overlay-root')?.remove();
    overlayRoot = hostDoc.createElement('div');
    overlayRoot.id = 'jy-status-overlay-root';
    syncOverlayTheme();
    overlayRoot.innerHTML = `
      <div class="jy-ov-modal jy-avatar-modal" data-open="false" aria-hidden="true">
        <div class="jy-ov-card jy-avatar-card" role="dialog" aria-modal="true" aria-label="人物头像">
          <img class="jy-avatar-big" alt="">
          <div class="jy-avatar-toolbar">
            <span class="jy-avatar-title"></span>
            <label class="jy-avatar-button">换头像<input class="jy-avatar-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="从本机导入头像"></label>
            <button class="jy-avatar-button" type="button" data-action="reset-avatar">还原</button>
            <button class="jy-avatar-button" type="button" data-action="close-avatar">关闭</button>
            <p class="jy-avatar-notice" role="status" aria-live="polite">图片仅保存在此浏览器，刷新后自动读取。</p>
          </div>
        </div>
      </div>
      <div class="jy-ov-modal jy-map-modal" data-open="false" aria-hidden="true">
        <div class="jy-ov-card jy-map-card" role="dialog" aria-modal="true" aria-label="暨阳地点册">
          <div class="jy-map-head">
            <span class="jy-map-title">暨阳地点册</span>
            <button class="jy-avatar-button" type="button" data-action="close-map">关闭</button>
          </div>
          <details class="jy-map-picture"><summary></summary>
            <div class="jy-map-world"></div>
            <p class="jy-map-unavailable" role="status">地图暂时无法加载。</p>
          </details>
          <p data-map-location></p>
          <div class="jy-place-directory">
            <label for="jy-place-search">查找地点</label>
            <input id="jy-place-search" type="search" placeholder="输入地点名或别名（如：奶茶店、听风亭、万风）" autocomplete="off">
            <p data-place-empty hidden>没有匹配的地点。</p>
            <div data-place-groups></div>
          </div>
        </div>
      </div>
      <div class="jy-ov-modal jy-inventory-modal" data-open="false" aria-hidden="true">
        <div class="jy-ov-card jy-inventory-card" role="dialog" aria-modal="true" aria-label="重要物品栏">
          <div class="jy-map-head">
            <div class="jy-map-title" data-inventory-title>重要物品栏</div>
            <button class="jy-avatar-button" type="button" data-action="close-inventory">关闭</button>
          </div>
          <div class="jy-inventory-list" data-inventory-list></div>
        </div>
      </div>
      <div class="jy-ov-modal jy-album-modal" data-open="false" aria-hidden="true">
        <div class="jy-ov-card jy-album-card" role="dialog" aria-modal="true" aria-label="角色相册">
          <div class="jy-album-head">
            <div class="jy-album-title" data-album-title>角色相册</div>
            <label class="jy-avatar-button">添加照片<input class="jy-avatar-input" data-album-input type="file" accept="image/*"></label>
            <button class="jy-avatar-button" type="button" data-action="close-album">关闭</button>
          </div>
          <div class="jy-album-grid" data-album-grid></div>
        </div>
      </div>
      <div class="jy-ov-modal jy-photo-viewer" data-open="false" aria-hidden="true">
        <div class="jy-photo-viewer-card" role="dialog" aria-modal="true" aria-label="照片放大查看">
          <button class="jy-avatar-button" type="button" data-action="close-photo-viewer">关闭</button>
          <img class="jy-photo-viewer-image" alt="">
          <div class="jy-photo-viewer-caption"></div>
        </div>
      </div>
    `;
    const groupsHost = overlayRoot.querySelector('[data-place-groups]');
    for (const group of MAP_PLACES) {
      const section = hostDoc.createElement('section');
      section.className = 'jy-place-group';
      section.dataset.dlcOnly = String(group.dlc === true);
      section.setAttribute('aria-label', group.group);
      const h3 = hostDoc.createElement('h3');
      h3.textContent = group.group;
      section.append(h3);
      for (const item of group.items) section.append(buildPlaceDetails(item));
      groupsHost.append(section);
    }
    overlayRoot.querySelectorAll('img').forEach(guardImage);

    const ov = overlayRoot;
    ov.querySelector('#jy-place-search').addEventListener('input', () => filterMapPlaces(ov));
    const mapDetails = ov.querySelector('.jy-map-picture');
    mapDetails.addEventListener('toggle', () => {
      if (mapDetails.open) loadMapImage(mapDetails);
    });
    syncMapPhase(ov, false);

    bindOverlayEvents(overlayRoot);
    hostDoc.body.append(overlayRoot);
    return overlayRoot;
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden', 'true');
    if (modal.classList.contains('jy-avatar-modal')) {
      const inp = modal.querySelector('.jy-avatar-input');
      if (inp) inp.value = '';
      avatarImportId += 1;
    }
    if (modal.classList.contains('jy-album-modal')) {
      const inp = modal.querySelector('[data-album-input]');
      if (inp) inp.value = '';
    }
    try { activeReturnFocus?.focus?.({ preventScroll: true }); } catch (_) {}
  }

  function openModal(modal, opener, focusSelector) {
    if (!modal) return;
    activeReturnFocus = opener || null;
    syncOverlayTheme();
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden', 'false');
    const target = focusSelector ? modal.querySelector(focusSelector) : modal.querySelector('button, input');
    try { target?.focus?.({ preventScroll: true }); } catch (_) {}
  }

  function renderAlbumOverlay(name) {
    const ov = ensureOverlayRoot();
    const grid = ov.querySelector('[data-album-grid]');
    const title = ov.querySelector('[data-album-title]');
    activeAlbumKey = name;
    if (title) title.textContent = `${name}的相册`;
    const remote = (ALBUMS[name] || []).map(([path, label]) => ({
      src: `${ASSET_BASE}/${path}`,
      fallbackQueue: `${ASSET_BASE_CDN}/${path}|${ASSET_BASE_FALLBACK}/${path}`,
      label
    }));
    const local = getStoredAlbum(name);
    grid.replaceChildren();
    if (!remote.length && !local.length) {
      const empty = hostDoc.createElement('div');
      empty.className = 'jy-album-empty';
      empty.textContent = '这本相册暂时没有照片。';
      grid.append(empty);
      return;
    }
    const appendCard = (item, isLocal) => {
      const card = hostDoc.createElement('article');
      card.className = 'jy-album-item';
      const image = hostDoc.createElement('img');
      image.className = 'jy-album-photo';
      image.src = item.src;
      image.alt = item.label;
      image.loading = 'lazy';
      image.dataset.fallbackQueue = item.fallbackQueue || '';
      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.dataset.action = 'open-album-photo';
      image.dataset.photoSrc = item.src;
      image.dataset.photoLabel = item.label;
      guardImage(image);
      const caption = hostDoc.createElement('div');
      caption.className = 'jy-album-caption';
      caption.textContent = item.label;
      const actions = hostDoc.createElement('div');
      actions.className = 'jy-album-actions';
      const use = hostDoc.createElement('button');
      use.className = 'jy-album-action';
      use.type = 'button';
      use.textContent = '设为头像';
      use.dataset.action = 'set-album-avatar';
      use.dataset.albumSrc = item.src;
      actions.append(use);
      if (isLocal) {
        const remove = hostDoc.createElement('button');
        remove.className = 'jy-album-action';
        remove.type = 'button';
        remove.textContent = '删除';
        remove.dataset.kind = 'remove';
        remove.dataset.action = 'remove-album-photo';
        remove.dataset.albumId = item.id;
        actions.append(remove);
      }
      card.append(image, caption, actions);
      grid.append(card);
    };
    remote.forEach(item => appendCard(item, false));
    local.forEach(item => appendCard(item, true));
  }

  function filterMapPlaces(ov) {
    const query = ov.querySelector('#jy-place-search').value.trim().toLowerCase();
    const active = ov.dataset.mapPhase === 'after';
    let hasPlace = false;
    for (const group of ov.querySelectorAll('.jy-place-group')) {
      const permitted = group.dataset.dlcOnly !== 'true' || active;
      const groupName = group.getAttribute('aria-label').toLowerCase();
      for (const place of group.querySelectorAll('.jy-place')) {
        const names = [place.dataset.place, ...place.dataset.aliases.split('|'), groupName];
        place.hidden = !permitted || !names.some(name => name.toLowerCase().includes(query));
      }
      group.hidden = !group.querySelector('.jy-place:not([hidden])');
      if (!group.hidden) hasPlace = true;
    }
    ov.querySelector('[data-place-empty]').hidden = hasPlace;
  }

  function loadMapImage(details) {
    const img = details.querySelector('.jy-map-image');
    if (img && !img.hasAttribute('src')) img.src = img.dataset.initialSrc;
  }

  function syncMapPhase(ov, active) {
    const phase = active ? 'after' : 'before';
    if (phase === ov.dataset.mapPhase) return;
    ov.dataset.mapPhase = phase;
    const atlas = MAP_ATLASES[phase];
    const details = ov.querySelector('.jy-map-picture');
    const world = details.querySelector('.jy-map-world');
    const mapCard = ov.querySelector('.jy-map-card');
    delete mapCard.dataset.imgMissing;
    delete world.dataset.ready;
    ov.querySelector('#jy-place-search').value = '';
    details.querySelector('summary').textContent = atlas.title;
    const img = hostDoc.createElement('img');
    img.className = 'jy-map-image';
    img.alt = atlas.title;
    img.decoding = 'async';
    const src = 'https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/maps/v1/' + atlas.file;
    img.dataset.initialSrc = src;
    img.dataset.fallbackQueue = cdnAlternatives(src).slice(1).join('|');
    img.addEventListener('load', () => {
      if (world.contains(img)) world.dataset.ready = 'true';
    });
    guardImage(img);
    const pins = hostDoc.createElement('div');
    pins.className = 'jy-map-pins';
    pins.setAttribute('aria-hidden', 'true');
    for (const [label, x, y] of atlas.pins) {
      const pin = hostDoc.createElement('span');
      pin.className = 'jy-map-pin';
      pin.textContent = label;
      pin.style.left = x + '%';
      pin.style.top = y + '%';
      pins.append(pin);
    }
    world.replaceChildren(img, pins);
    if (details.open) loadMapImage(details);
    filterMapPlaces(ov);
  }

  function syncMapLocation(locationText) {
    const ov = ensureOverlayRoot();
    ov.querySelector('[data-map-location]').textContent = '当前位置：' + (locationText || '待确定');
    const locLower = String(locationText || '').toLowerCase();
    const places = [...ov.querySelectorAll('.jy-place')];
    let matched = null;
    let maxLen = 0;
    places.forEach(place => {
      place.querySelector('.jy-place-current').hidden = true;
      if (ov.dataset.mapPhase !== 'after' && place.closest('.jy-place-group').dataset.dlcOnly === 'true') return;
      const aliases = [place.dataset.place, ...place.dataset.aliases.split('|')].map(s => s.toLowerCase());
      aliases.forEach(alias => {
        if (alias.length > maxLen && (locLower === alias || (locLower.includes(alias) && alias.length >= 3 && !IGNORED_MAP_ALIASES.has(alias)))) {
          matched = place;
          maxLen = alias.length;
        }
      });
    });
    if (matched) matched.querySelector('.jy-place-current').hidden = false;
  }

  function bindOverlayEvents(ov) {
    if (ov.dataset.bound === '1') return;
    ov.dataset.bound = '1';
    const avatarModal = ov.querySelector('.jy-avatar-modal');
    const big = ov.querySelector('.jy-avatar-big');
    const avatarTitle = ov.querySelector('.jy-avatar-title');
    const avatarNotice = ov.querySelector('.jy-avatar-notice');
    const avatarInput = ov.querySelector('.jy-avatar-input');
    const mapModal = ov.querySelector('.jy-map-modal');
    const inventoryModal = ov.querySelector('.jy-inventory-modal');
    const albumModal = ov.querySelector('.jy-album-modal');
    const albumInput = ov.querySelector('[data-album-input]');
    const photoViewer = ov.querySelector('.jy-photo-viewer');
    const photoImg = ov.querySelector('.jy-photo-viewer-image');
    const photoCap = ov.querySelector('.jy-photo-viewer-caption');
    const showNotice = msg => { if (avatarNotice) avatarNotice.textContent = msg; };

    ov.addEventListener('click', event => {
      const albumPhoto = event.target.closest('[data-action="open-album-photo"]');
      if (albumPhoto && activeAlbumKey) {
        photoImg.src = albumPhoto.dataset.photoSrc || '';
        photoImg.alt = albumPhoto.dataset.photoLabel || '相册照片';
        photoCap.textContent = albumPhoto.dataset.photoLabel || '相册照片';
        openModal(photoViewer, albumPhoto, '[data-action="close-photo-viewer"]');
        return;
      }
      const setAv = event.target.closest('[data-action="set-album-avatar"]');
      if (setAv && activeAlbumKey) {
        const src = setAv.dataset.albumSrc || '';
        if (src && !setStoredAvatar(activeAlbumKey, src)) {
          showNotice('头像未保存：浏览器缓存不可用或空间不足。请换一张较小的图片。');
        }
        return;
      }
      const rmPhoto = event.target.closest('[data-action="remove-album-photo"]');
      if (rmPhoto && activeAlbumKey) {
        const remaining = getStoredAlbum(activeAlbumKey).filter(item => item.id !== rmPhoto.dataset.albumId);
        setStoredAlbum(activeAlbumKey, remaining);
        renderAlbumOverlay(activeAlbumKey);
        return;
      }
      if (event.target.closest('[data-action="reset-avatar"]') && activeAvatarEl) {
        const key = activeAvatarEl.dataset.avatarKey || activeAvatarEl.dataset.avatarName || activeAvatarEl.getAttribute('alt') || '头像';
        avatarImportId += 1;
        if (removeStoredAvatar(key)) {
          big.src = activeAvatarEl.dataset.defaultSrc || activeAvatarEl.src;
          showNotice('已还原默认头像并清除自选缓存。');
        } else showNotice('还原失败：浏览器缓存不可用。');
        return;
      }
      if (event.target === avatarModal || event.target.closest('[data-action="close-avatar"]')) return closeModal(avatarModal);
      if (event.target === mapModal || event.target.closest('[data-action="close-map"]')) return closeModal(mapModal);
      if (event.target === inventoryModal || event.target.closest('[data-action="close-inventory"]')) return closeModal(inventoryModal);
      if (event.target === albumModal || event.target.closest('[data-action="close-album"]')) return closeModal(albumModal);
      if (event.target === photoViewer || event.target.closest('[data-action="close-photo-viewer"]')) return closeModal(photoViewer);
    });

    ov.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-action="open-album-photo"]')) {
        event.preventDefault();
        photoImg.src = event.target.dataset.photoSrc || '';
        photoImg.alt = event.target.dataset.photoLabel || '相册照片';
        photoCap.textContent = event.target.dataset.photoLabel || '相册照片';
        openModal(photoViewer, event.target, '[data-action="close-photo-viewer"]');
        return;
      }
      if (event.key === 'Escape') {
        if (photoViewer.dataset.open === 'true') closeModal(photoViewer);
        else if (avatarModal.dataset.open === 'true') closeModal(avatarModal);
        else if (albumModal.dataset.open === 'true') closeModal(albumModal);
        else if (inventoryModal.dataset.open === 'true') closeModal(inventoryModal);
        else if (mapModal.dataset.open === 'true') closeModal(mapModal);
      }
    });

    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files && avatarInput.files[0];
      avatarInput.value = '';
      if (!file || !activeAvatarEl) return;
      if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
        showNotice('请选择不超过 10 MB 的 PNG、JPEG、WebP 或 GIF 图片。');
        return;
      }
      const key = activeAvatarEl.dataset.avatarKey || activeAvatarEl.getAttribute('alt') || '头像';
      const requestId = ++avatarImportId;
      showNotice('正在读取图片…');
      const reader = new hostWin.FileReader();
      const fail = () => { if (requestId === avatarImportId) showNotice('图片读取失败，原头像已保留，请换一张图片。'); };
      reader.onerror = fail;
      reader.onload = () => {
        const image = new hostWin.Image();
        image.onerror = fail;
        image.onload = () => {
          if (requestId !== avatarImportId) return;
          try {
            const scale = Math.min(1, 512 / Math.max(image.width, image.height));
            const canvas = hostDoc.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            const compactUrl = canvas.toDataURL('image/png');
            if (!setStoredAvatar(key, compactUrl)) {
              showNotice('头像未保存：浏览器缓存不可用或空间不足，原头像已保留。');
              return;
            }
            big.src = compactUrl;
            showNotice('已保存到本机缓存，状态栏和正文头像已同步。');
          } catch (_) { fail(); }
        };
        image.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });

    albumInput.addEventListener('change', () => {
      const file = albumInput.files && albumInput.files[0];
      if (!file || !activeAlbumKey || !file.type.startsWith('image/')) return;
      const reader = new hostWin.FileReader();
      reader.onload = () => {
        compactImage(String(reader.result || ''), compactUrl => {
          const items = getStoredAlbum(activeAlbumKey);
          items.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, src: compactUrl, label: '自定义照片' });
          if (setStoredAlbum(activeAlbumKey, items)) renderAlbumOverlay(activeAlbumKey);
          albumInput.value = '';
        }, 960, 0.88);
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------- 单个消息楼层状态栏挂载 ----------
  const mountedFrames = new Set();

  function injectFrameStyles(frameDoc) {
    if (!frameDoc || !frameDoc.head) return;
    let style = frameDoc.getElementById('jy-status-shared-style');
    if (!style) {
      style = frameDoc.createElement('style');
      style.id = 'jy-status-shared-style';
      frameDoc.head.append(style);
    }
    if (style.textContent !== SHARED_CSS) style.textContent = SHARED_CSS;
  }

  function syncThemeInFrame(root) {
    const dark = readTheme() === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    const button = root.querySelector('[data-action="toggle-theme"]');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? '切换日间模式' : '切换夜间模式';
    }
  }

  function applyStoredAvatarsInFrame(root) {
    root.querySelectorAll('.jy-avatar').forEach(avatar => {
      const name = avatar.dataset.avatarName || avatar.getAttribute('alt') || '头像';
      const key = avatar.dataset.avatarKey || name;
      if (!avatar.dataset.defaultSrc) avatar.dataset.defaultSrc = avatar.getAttribute('src') || fallbackAvatarUri(key === '主角' ? '我' : name);
      if (!avatar.dataset.fallbackQueue && avatar.dataset.fallbackSrc) {
        avatar.dataset.fallbackQueue = cdnAlternatives(avatar.getAttribute('src') || '').concat(avatar.dataset.fallbackSrc).join('|');
      }
      avatar.dataset.avatarName = name;
      avatar.dataset.avatarKey = key;
      avatar.setAttribute('role', 'button');
      avatar.setAttribute('tabindex', '0');
      avatar.setAttribute('title', name + '头像');
      guardImage(avatar);
      const saved = getStoredAvatar(key);
      if (saved && avatar.getAttribute('src') !== saved) {
        delete avatar.dataset.jyFallbackDone;
        avatar.src = saved;
      } else if (!saved && avatar.dataset.defaultSrc && avatar.getAttribute('src') !== avatar.dataset.defaultSrc && !avatar.dataset.jyFallbackDone) {
        avatar.src = avatar.dataset.defaultSrc;
      }
    });
  }

  function parseJsonVar(node) {
    const raw = String(node?.textContent || '').trim();
    if (!raw || raw.startsWith('{{') || raw === 'null' || raw === 'undefined') return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function dlcDayProgress(originRaw, currentRaw) {
    const parseMs = s => {
      const m = String(s || '').trim().match(/^(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
      if (!m) return null;
      const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
      return (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) ? Date.UTC(y, mo - 1, d) : null;
    };
    const ori = parseMs(originRaw);
    const cur = parseMs(currentRaw) ?? ori;
    const elapsed = (ori !== null && cur !== null) ? Math.max(0, Math.floor((cur - ori) / 86400000)) : 0;
    const dayNumber = elapsed + 1;
    const stage = dayNumber <= 10 ? '微兆潜龙期' : dayNumber <= 25 ? '灵潮初涌期' : dayNumber <= 45 ? '龙眼破禁期' : dayNumber <= 90 ? '潜龙秘序期' : '百宗出山期';
    return { dayNumber, stage };
  }

  function statusFloorId(win) {
    try {
      return win?.getCurrentMessageId?.() ?? hostWin.getCurrentMessageId?.();
    } catch (_) {}
  }

  function readStatusFloor(win, id) {
    const read = win?.getVariables || win?.parent?.TavernHelper?.getVariables || hostWin.TavernHelper?.getVariables;
    if (!Number.isInteger(id) || id < 0 || typeof read !== 'function') throw new Error('message unavailable');
    return read({ type: 'message', message_id: id });
  }

  function syncDlcUiInFrame(root, stat) {
    const doc = root.ownerDocument;
    const dlc = stat ? stat.剧情?.灵气复苏 : parseJsonVar(root.querySelector('[data-dlc-source]'));
    const cult = stat ? stat.主角?.修行 : parseJsonVar(root.querySelector('[data-cultivation-source]'));
    const active = dlc?.已开启 === true;
    root.dataset.dlcActive = String(active);

    const curDate = stat?.世界?.日期 || sceneValue(root.querySelector('.jy-date'));
    const { dayNumber: dayNum, stage: stageText } = dlcDayProgress(dlc?.开启日期, curDate);
    const realmText = cult?.境界 && !String(cult.境界).startsWith('{{') ? String(cult.境界) : '未引气（凡躯）';
    const qiVal = cult && cult.灵气感应 !== undefined ? String(cult.灵气感应) : '0';
    const rootText = cult?.灵根资质 && !String(cult.灵根资质).startsWith('{{') ? String(cult.灵根资质) : '未测';
    const stateText = cult?.修行状态 && !String(cult.修行状态).startsWith('{{') ? String(cult.修行状态) : '平顺';
    const artsList = Array.isArray(cult?.功法与秘术) && cult.功法与秘术.length ? cult.功法与秘术.join('、') : '暂无';
    const artifactsList = Array.isArray(cult?.法器与灵物) && cult.法器与灵物.length ? cult.法器与灵物.join('、') : '暂无';

    const badge = root.querySelector('[data-aura-badge]');
    const badgeText = root.querySelector('[data-aura-badge-text]');
    if (badge) badge.hidden = !active;
    if (badgeText) badgeText.textContent = `第${dayNum}日 · ${stageText}${realmText && realmText !== '未引气（凡躯）' ? ' · ' + realmText : ''}`;

    const allBtn = root.querySelector('[data-people-all-btn]');
    if (allBtn) allBtn.textContent = active ? '全部角色 (9)' : '全部角色 (7)';

    const dlcRealmDefaults = { '云清晏': '炼气大圆满·重修', '谢昭宁': '筑基中期' };
    root.querySelectorAll('.jy-person[data-dlc-heroine]').forEach(card => {
      card.hidden = !active;
      const roleName = card.dataset.dlcHeroine || '';
      const roleStat = roleName ? stat?.[roleName] : null;
      const realmPill = card.querySelector('[data-yun-realm], [data-dlc-realm]');
      if (realmPill) {
        const liveRealm = roleStat?.当前境界;
        const txt = liveRealm || sceneValue(realmPill) || dlcRealmDefaults[roleName] || '修行中';
        realmPill.textContent = txt;
      }
      if (roleStat && typeof roleStat.是否在场 === 'boolean') {
        card.dataset.present = String(roleStat.是否在场);
      } else if (active && !/^(?:true|false|1|0|是|否|在场|不在场)$/i.test((card.dataset.present || '').trim())) {
        card.dataset.present = 'false';
      }
    });

    const cultPanel = root.querySelector('[data-cultivation-panel]');
    if (cultPanel) {
      cultPanel.hidden = !active;
      const stEl = cultPanel.querySelector('[data-cultivation-stage]');
      const rlEl = cultPanel.querySelector('[data-cultivation-realm]');
      const qiEl = cultPanel.querySelector('[data-cultivation-qi]');
      const qiFillEl = cultPanel.querySelector('[data-cultivation-qi-fill]');
      const rtEl = cultPanel.querySelector('[data-cultivation-root]');
      const csEl = cultPanel.querySelector('[data-cultivation-state]');
      const arEl = cultPanel.querySelector('[data-cultivation-arts]');
      const afEl = cultPanel.querySelector('[data-cultivation-artifacts]');
      if (stEl) stEl.textContent = active ? `第${dayNum}日 · ${stageText}` : '未启封';
      if (rlEl) rlEl.textContent = realmText;
      if (qiEl) qiEl.textContent = qiVal;
      if (qiFillEl) {
        const qiNum = Math.max(0, Math.min(100, Number(qiVal) || 0));
        qiFillEl.style.setProperty('--qi', String(qiNum));
      }
      if (rtEl) rtEl.textContent = rootText;
      if (csEl) {
        csEl.textContent = stateText;
        csEl.dataset.stateAlert = String(stateText !== '平顺' && !stateText.startsWith('平顺（'));
      }
      if (arEl) arEl.textContent = artsList;
      if (afEl) afEl.textContent = artifactsList;
    }
    if (overlayRoot && overlayRoot.isConnected && overlayRoot.querySelector('.jy-ov-modal[data-open="true"]')) {
      syncOverlayTheme(root);
    }

    enhanceCharacters(root, doc);
  }

  function enhanceCharacters(root, doc) {
    const people = [...root.querySelectorAll('.jy-person')].filter(person => !person.hidden);
    const present = people.filter(person => /^(?:true|1|是|在场)$/i.test((person.dataset.present || '').trim()));
    const knownPresence = Boolean(sceneValue(root.querySelector('.jy-location'))) &&
      people.some(person => /^(?:true|false|1|0|是|否|在场|不在场)$/i.test((person.dataset.present || '').trim()));

    const countBadge = root.querySelector('[data-present-count]');
    if (countBadge) countBadge.textContent = String(present.length);
    const presentNames = root.querySelector('[data-present-names]');
    if (presentNames) {
      presentNames.textContent = present.map(p => p.querySelector('.jy-name')?.textContent || '').filter(Boolean).join('、')
        || (knownPresence ? '暂无主要角色在场' : '待确定');
    }

    const emptyNotice = root.querySelector('[data-people-empty]');
    if (emptyNotice) {
      const view = root.querySelector('.jy-people')?.dataset.view || 'present';
      emptyNotice.hidden = !(view === 'present' && present.length === 0);
    }

    people.forEach(person => {
      const name = person.querySelector('.jy-name')?.textContent.trim() || '';
      const thresholds = CHAR_THRESHOLDS[name] || [20, 50, 80, 90];
      person.querySelectorAll('.jy-bar').forEach(bar => {
        if (bar.querySelector('.jy-tick')) return;
        const metric = bar.dataset.metric || 'affection';
        if (metric === 'affection') {
          thresholds.forEach(mark => {
            const tick = doc.createElement('i');
            tick.className = 'jy-tick';
            tick.style.left = mark + '%';
            tick.title = `阶段门槛 ${mark}`;
            bar.append(tick);
          });
        } else if (metric === 'control') {
          [40, 70, 85].forEach(mark => {
            const tick = doc.createElement('i');
            tick.className = 'jy-tick';
            tick.style.left = mark + '%';
            bar.append(tick);
          });
        }
      });

      // 沈若微信任锁与许念安控制警示徽标
      if (name === '沈若微') {
        const trustNum = Number(sceneValue(person.querySelector('[data-metric-val="trust"]')));
        const lockPill = person.querySelector('[data-trust-lock]');
        if (lockPill) lockPill.hidden = !(Number.isFinite(trustNum) && trustNum < 30 && person.dataset.present === 'true');
      }
      if (name === '许念安') {
        const ctrlNum = Number(sceneValue(person.querySelector('[data-metric-val="control"]')));
        const ctrlBar = person.querySelector('.jy-bar[data-metric="control"]');
        const ctrlPill = person.querySelector('[data-control-warn]');
        const level = Number.isFinite(ctrlNum) ? (ctrlNum >= 85 ? 'critical' : ctrlNum >= 70 ? 'high' : ctrlNum >= 40 ? 'mid' : 'low') : 'low';
        if (ctrlBar) ctrlBar.dataset.level = level;
        if (ctrlPill) {
          ctrlPill.hidden = !(level === 'high' || level === 'critical');
          ctrlPill.textContent = level === 'critical' ? '高压共生' : '紧绷警戒';
        }
      }
    });
  }

  function renderInventoryCount(root) {
    const source = root.querySelector('[data-inventory-source]');
    const countNode = root.querySelector('[data-inventory-count]');
    const items = parseInventory(String(source?.textContent || '').trim()).filter(i => i && i.名称);
    if (countNode) countNode.textContent = String(items.length);
    return items;
  }

  function openInventoryFor(root, opener) {
    const ov = ensureOverlayRoot();
    syncOverlayTheme(root);
    const items = renderInventoryCount(root);
    const list = ov.querySelector('[data-inventory-list]');
    const title = ov.querySelector('[data-inventory-title]');
    if (title) title.textContent = items.length ? `重要物品栏 · ${items.length}` : '重要物品栏';
    list.replaceChildren();
    if (!items.length) {
      const empty = hostDoc.createElement('div');
      empty.className = 'jy-inventory-empty';
      empty.textContent = '暂无会影响后续剧情的重要物品。';
      list.append(empty);
    } else {
      items.forEach((item, index) => {
        const row = hostDoc.createElement('div');
        row.className = 'jy-inventory-item';
        const mark = hostDoc.createElement('div');
        mark.className = 'jy-inventory-mark';
        mark.textContent = String(index + 1).padStart(2, '0');
        const copy = hostDoc.createElement('div');
        const name = hostDoc.createElement('div');
        name.className = 'jy-inventory-name';
        name.textContent = String(item.名称);
        const desc = hostDoc.createElement('div');
        desc.className = 'jy-inventory-description';
        desc.textContent = String(item.描述 || '暂无说明');
        copy.append(name, desc);
        row.append(mark, copy);
        list.append(row);
      });
    }
    openModal(ov.querySelector('.jy-inventory-modal'), opener, '[data-action="close-inventory"]');
  }

  function mount(root, frameWin) {
    if (!root) return;
    const doc = root.ownerDocument;
    const win = frameWin || doc.defaultView || window;
    injectFrameStyles(doc);
    mountedFrames.add(root);
    syncThemeInFrame(root);
    ensureOverlayRoot();

    if (root.dataset.jyEngineBound === '1') {
      applyStoredAvatarsInFrame(root);
      return;
    }
    root.dataset.jyEngineBound = '1';

    // 清理占位或空字段
    root.querySelectorAll('[data-scene-value], .jy-stage, .jy-num, .jy-detail span').forEach(field => {
      if (!sceneValue(field)) field.textContent = '待确定';
    });
    root.querySelectorAll('.jy-loc-pill').forEach(pill => {
      pill.dataset.empty = sceneValue(pill) ? 'false' : 'true';
    });
    root.querySelectorAll('.jy-mood, .jy-thought, .jy-me-look').forEach(field => {
      if (!sceneValue(field)) field.hidden = true;
    });
    const eventNode = root.querySelector('[data-event-name]');
    const eventName = sceneValue(eventNode);
    if (eventNode?.parentElement) eventNode.parentElement.hidden = !eventName || eventName === '无';

    applyStoredAvatarsInFrame(root);
    syncDlcUiInFrame(root);
    renderInventoryCount(root);

    // 地点映射
    const currentLocation = sceneValue(root.querySelector('.jy-location'));
    if (overlayRoot?.querySelector('.jy-map-modal')?.dataset.open !== 'true') syncMapLocation(currentLocation);

    // 校历、学籍、论坛数据
    const date = sceneValue(root.querySelector('.jy-date')).replaceAll('/', '-');
    const year = campusYear(sceneValue(root.querySelector('[data-start-year]')));
    const currentPeriod = campusPeriod(JY_PERIODS, date, year, sceneValue(root.querySelector('[data-academic]')));
    const stageDisplay = root.querySelector('[data-stage-display]');
    if (stageDisplay) stageDisplay.textContent = currentPeriod?.id || '待确定';

    const identity = root.querySelector('[data-player-class]');
    if (identity) identity.textContent = campusPlayerClass(sceneValue(identity), currentPeriod?.id) || '待确定';
    const ageNode = root.querySelector('[data-player-age]');
    const currentAge = campusAgeAt(sceneValue(root.querySelector('[data-player-birthday]')), date);
    if (ageNode && currentAge !== null) ageNode.textContent = currentAge + '岁';
    else if (ageNode && sceneValue(ageNode)) ageNode.title = '档案年龄，仅在生日或新年龄得到确认时更新';

    const select = root.querySelector('[data-period-select]');
    if (select && !select.options.length) {
      for (const period of JY_PERIODS) {
        const option = doc.createElement('option');
        option.value = period.id;
        option.textContent = period.id;
        select.append(option);
      }
    }
    if (select) select.value = currentPeriod?.id || '高二上';

    const activityIds = JY_PERIODS.flatMap(period => (period.activities || []).map(a => a.id));
    let campus = normalizeCampus(null, date, activityIds);

    const renderCalendar = () => {
      if (!select) return;
      const period = JY_PERIODS.find(p => p.id === select.value);
      if (!period) return;
      const ctx = root.querySelector('[data-calendar-context]');
      if (ctx) ctx.textContent = currentPeriod ? '当前学期 · ' + currentPeriod.id : '当前学期未定';
      const list = root.querySelector('[data-calendar-events]');
      if (!list) return;
      list.replaceChildren();
      for (const activity of period.activities || []) {
        const schedule = campus.日程[activity.id];
        const confirmed = Boolean(schedule?.开始);
        const start = schedule?.开始 || campusAnchor(activity.start, year);
        const end = schedule?.结束 || campusAnchor(activity.end, year);
        const days = start && campusDate(date) ? Math.round((Date.parse(start) - Date.parse(date)) / 86400000) : null;
        const cancelled = schedule?.状态 === '已撤销';
        const ended = schedule?.状态 === '已结束';
        const state = cancelled ? '已撤销' : ended ? '已过' : days === null ? '日期待确认' : date > end ? '已过' : days > 7 ? '尚未到期' : days > 0 ? '临近' : '窗口内';
        const windowText = cancelled ? '正式通知已撤销' : confirmed ? (start === end ? start : start + ' 至 ' + end) + '（正式通知）' : activity.window;
        const li = doc.createElement('li');
        li.className = 'jy-calendar-entry';
        if (!cancelled && !ended && days !== null && date <= end && days <= 7) li.dataset.near = '';
        const stamp = doc.createElement('span');
        stamp.className = 'jy-month-stamp';
        stamp.textContent = start ? Number(start.slice(5, 7)) + '月' : '农历';
        const info = doc.createElement('div');
        const title = doc.createElement('strong');
        title.textContent = activity.name;
        const when = doc.createElement('div');
        when.className = 'jy-event-window';
        when.textContent = windowText;
        info.append(title, when);
        const badge = doc.createElement('span');
        badge.className = 'jy-event-state';
        badge.textContent = state;
        li.append(stamp, info, badge);
        list.append(li);
      }
      if (!list.childElementCount) list.textContent = '本阶段暂无校历活动。';
    };
    select?.addEventListener('change', renderCalendar);
    renderCalendar();

    if (currentPeriod) {
      const day = new Date(date + 'T12:00:00Z').getUTCDay();
      const md = date.slice(5);
      const holiday = currentPeriod.id === '暑假' || (md >= '01-21' && md <= '02-20') || (md >= '10-01' && md <= '10-07');
      const schedNode = root.querySelector('[data-schedule]');
      if (schedNode) {
        if (currentPeriod.id === '已毕业') schedNode.textContent = '已毕业。返校先确认访客登记与开放安排。';
        else if (holiday || day === 0 || day === 6) schedNode.textContent = '周末或预计假期窗口；是否补课、值班和开放，以已公布通知为准。';
      }
    }

    // 校园论坛渲染
    const panel = root.querySelector('[data-campus-messages]');
    const channel = panel?.querySelector('[data-campus-channel]');
    const cultivationChannel = channel?.querySelector('[data-cultivation-channel]');
    const messageList = panel?.querySelector('[data-campus-list]');
    const messageStatus = panel?.querySelector('[data-campus-status]');
    const announcementList = panel?.querySelector('[data-campus-announcements]');
    const announcementStatus = panel?.querySelector('[data-campus-announcement-status]');
    let readState = '正在读取本层消息…';

    const getAuthorProfile = item => {
      const source = String(item.来源 || '');
      if (item.渠道 === '修士风闻') return { name: '暨阳风闻', initial: '闻', bg: '#554478' };
      if (source.trim() === '俞嘉豪' || source.trim() === '嘉豪') {
        return { name: '俞嘉豪', initial: '俞', bg: '#535d6e', portrait: 'yujiahao.webp' };
      }
      for (const [key, prof] of Object.entries(PROFILES)) {
        if (source.includes(key)) return prof;
      }
      if (item.渠道 === '公告') return { name: '暨中教务处公告', initial: '校', bg: '#1e564c' };
      if (item.渠道 === '班群') return { name: '班级群', initial: '班', bg: '#2e7d32' };
      if (item.渠道 === '八卦') return { name: source ? `${source}情报员` : '暨中校园树洞', initial: '洞', bg: '#b45309' };
      if (item.渠道 === '趣事') return { name: source || '暨阳市井见闻', initial: '趣', bg: '#0891b2' };
      if (item.渠道 === '余波') return { name: source ? `${source}反响` : '全校课后热议', initial: '波', bg: '#b83c4c' };
      if (item.渠道 === '来信') return { name: source || '匿名便签', initial: '信', bg: '#7c3aed' };
      if (item.渠道 === '朋友圈') return { name: source || '同级好友', initial: '友', bg: '#3c7399' };
      return { name: source || '暨阳校园简讯', initial: '讯', bg: '#475569' };
    };

    const renderMessages = () => {
      if (!panel) return;
      const dlcActive = root.dataset.dlcActive === 'true';
      if (cultivationChannel) {
        cultivationChannel.hidden = cultivationChannel.disabled = !dlcActive;
        if (!dlcActive && channel.value === cultivationChannel.value) channel.value = '全部';
      }
      messageList.replaceChildren();
      announcementList.replaceChildren();
      const announcements = campus.有效公告.slice().reverse();
      const visible = campus.动态流.slice().reverse().filter(item => (
        (dlcActive || item.渠道 !== '修士风闻') && (channel.value === '全部' || item.渠道 === channel.value)
      ));
      announcementStatus.textContent = readState || (announcements.length ? '' : '暂无有效公告。');
      announcementStatus.hidden = !announcementStatus.textContent;
      messageStatus.textContent = readState || (visible.length ? '' : '这个分类暂时没有动态。');
      messageStatus.hidden = !messageStatus.textContent;

      const renderPost = (item, target) => {
        const li = doc.createElement('li');
        const profile = getAuthorProfile(item);
        const avatar = doc.createElement('div');
        avatar.className = 'jy-moment-avatar';
        avatar.style.background = profile.bg;
        avatar.textContent = profile.initial;
        avatar.setAttribute('aria-hidden', 'true');
        if (profile.portrait) {
          const image = doc.createElement('img');
          image.alt = profile.name;
          image.loading = 'lazy';
          image.dataset.fallbackQueue =
            `https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/v2/avatars/${profile.portrait}|https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/main/statusbar/v2/avatars/${profile.portrait}`;
          guardImage(image);
          image.src = `https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/v2/avatars/${profile.portrait}`;
          avatar.replaceChildren(image);
        }
        const box = doc.createElement('div');
        box.className = 'jy-moment-box';
        const header = doc.createElement('div');
        header.className = 'jy-feed-top';
        const user = doc.createElement('span');
        user.className = 'jy-moment-user';
        user.textContent = profile.name;
        const tag = doc.createElement('span');
        tag.className = 'jy-feed-tag';
        tag.dataset.channel = item.渠道 || '';
        tag.textContent = item.渠道 || '动态';
        const srcSpan = doc.createElement('span');
        srcSpan.className = 'jy-feed-source';
        srcSpan.textContent = typeof item.来源 === 'string' ? item.来源 : '';
        header.append(user, tag, srcSpan);
        const title = doc.createElement('strong');
        title.className = 'jy-moment-title';
        title.textContent = item.标题;
        const body = doc.createElement('p');
        body.className = 'jy-moment-body';
        body.textContent = item.摘要;
        const footer = doc.createElement('div');
        footer.className = 'jy-moment-footer';
        const meta = doc.createElement('small');
        meta.textContent = [item.日期, item.状态 !== '有效' ? item.状态 : ''].filter(Boolean).join(' · ');
        footer.append(meta);
        box.append(header, title, body, footer);

        const rawLikes = Array.isArray(item.点赞) ? [...new Set(item.点赞.filter(v => typeof v === 'string').map(v => v.trim()).filter(Boolean))].slice(-6) : [];
        const rawComments = Array.isArray(item.互动) ? item.互动.filter(c => c && typeof c === 'object' && (c.用户 || c.角色) && (c.内容 || c.评论)).slice(-3) : [];
        if (rawLikes.length || rawComments.length) {
          const inter = doc.createElement('div');
          inter.className = 'jy-moment-interactions';
          if (rawLikes.length) {
            const likesRow = doc.createElement('div');
            likesRow.className = 'jy-moment-likes';
            likesRow.textContent = rawLikes.join(', ');
            inter.append(likesRow);
          }
          for (const c of rawComments) {
            const cRow = doc.createElement('div');
            cRow.className = 'jy-moment-comment';
            const cU = doc.createElement('span');
            cU.className = 'jy-comment-user';
            cU.textContent = String(c.用户 || c.角色) + ': ';
            const cT = doc.createElement('span');
            cT.className = 'jy-comment-text';
            cT.textContent = Array.from(String(c.内容 || c.评论)).slice(0, 40).join('');
            cRow.append(cU, cT);
            inter.append(cRow);
          }
          box.append(inter);
        }
        li.append(avatar, box);
        target.append(li);
      };

      announcements.forEach(item => renderPost(item, announcementList));
      visible.forEach(item => renderPost(item, messageList));
    };

    channel?.addEventListener('change', renderMessages);
    renderMessages();

    let campusRead = 0;
    const readCampus = async () => {
      const sequence = ++campusRead;
      try {
        const data = await readStatusFloor(win, statusFloorId(win));
        if (sequence !== campusRead) return;
        if (!data?.stat_data) throw new Error('invalid snapshot');
        campus = normalizeCampus(data.stat_data.校园, date, activityIds);
        syncDlcUiInFrame(root, data.stat_data);
        readState = '';
      } catch (_) {
        if (sequence !== campusRead) return;
        campus = normalizeCampus(null, date, activityIds);
        readState = '暂时无法读取本页动态。';
      }
      renderCalendar();
      renderMessages();
    };
    readCampus();
    panel?.addEventListener('toggle', () => { if (panel.open) readCampus(); });

    // Tab 切换与人物过滤
    const switchTab = tabKey => {
      root.querySelectorAll('[data-tab-target]').forEach(btn => {
        btn.setAttribute('aria-selected', btn.dataset.tabTarget === tabKey ? 'true' : 'false');
      });
      root.querySelectorAll('[data-tab-panel]').forEach(p => {
        const active = p.dataset.tabPanel === tabKey;
        p.dataset.active = active ? 'true' : 'false';
        if (p.tagName === 'DETAILS') p.open = active;
      });
      if (tabKey === 'forum') readCampus();
    };

    const switchPeopleView = view => {
      const grid = root.querySelector('.jy-people');
      if (grid) grid.dataset.view = view;
      root.querySelectorAll('[data-people-filter]').forEach(btn => {
        btn.setAttribute('aria-pressed', btn.dataset.peopleFilter === view ? 'true' : 'false');
      });
      const emptyNotice = root.querySelector('[data-people-empty]');
      if (emptyNotice) {
        const hasPresent = [...root.querySelectorAll('.jy-person')].some(p => !p.hidden && /^(?:true|1|是|在场)$/i.test((p.dataset.present || '').trim()));
        emptyNotice.hidden = !(view === 'present' && !hasPresent);
      }
    };

    root.addEventListener('click', event => {
      const tabBtn = event.target.closest('[data-tab-target]');
      if (tabBtn) return switchTab(tabBtn.dataset.tabTarget);

      const filterBtn = event.target.closest('[data-people-filter]');
      if (filterBtn) return switchPeopleView(filterBtn.dataset.peopleFilter);

      if (event.target.closest('[data-action="toggle-theme"]')) {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { hostWin.localStorage.setItem(THEME_KEY, next); } catch (_) {}
        mountedFrames.forEach(r => { if (r.isConnected) syncThemeInFrame(r); });
        syncOverlayTheme();
        try { hostWin.dispatchEvent(new hostWin.CustomEvent(THEME_EVENT)); } catch (_) {}
        return;
      }
      const mapBtn = event.target.closest('[data-action="open-map"]');
      if (mapBtn) {
        const ov = ensureOverlayRoot();
        syncOverlayTheme(root);
        syncMapPhase(ov, root.dataset.dlcActive === 'true');
        syncMapLocation(sceneValue(root.querySelector('.jy-location')));
        openModal(ov.querySelector('.jy-map-modal'), mapBtn, '[data-action="close-map"]');
        return;
      }
      const invBtn = event.target.closest('[data-action="open-inventory"]');
      if (invBtn) return openInventoryFor(root, invBtn);

      const albumBtn = event.target.closest('[data-action="open-album"]');
      if (albumBtn) {
        const key = albumBtn.dataset.albumKey || '';
        if (key) {
          const ov = ensureOverlayRoot();
          syncOverlayTheme(root);
          renderAlbumOverlay(key);
          openModal(ov.querySelector('.jy-album-modal'), albumBtn, '[data-action="close-album"]');
        }
        return;
      }
      const av = event.target.closest('.jy-avatar');
      if (av && root.contains(av)) {
        const ov = ensureOverlayRoot();
        syncOverlayTheme(root);
        activeAvatarEl = av;
        const name = av.dataset.avatarName || av.getAttribute('alt') || '头像';
        ov.querySelector('.jy-avatar-big').src = av.src;
        ov.querySelector('.jy-avatar-big').alt = name;
        ov.querySelector('.jy-avatar-title').textContent = name;
        ov.querySelector('.jy-avatar-notice').textContent = '图片仅保存在此浏览器，刷新后自动读取。';
        openModal(ov.querySelector('.jy-avatar-modal'), av, '[data-action="close-avatar"]');
      }
    });

    root.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('jy-avatar')) {
        event.preventDefault();
        event.target.click();
      }
    });

    const eventOnFn = win.eventOn || hostWin.eventOn;
    if (typeof eventOnFn === 'function') {
      eventOnFn('mag_variable_update_ended', () => {
        win.setTimeout(readCampus, 250);
      });
    }
  }

  function scanHostIframes() {
    mountedFrames.forEach(r => { if (!r.isConnected) mountedFrames.delete(r); });
    hostDoc.querySelectorAll('.jy-status').forEach(root => mount(root, hostWin));
    hostDoc.querySelectorAll('iframe').forEach(frame => {
      try {
        const fWin = frame.contentWindow;
        const fDoc = frame.contentDocument || fWin?.document;
        if (fDoc) fDoc.querySelectorAll('.jy-status').forEach(root => mount(root, fWin));
      } catch (_) {}
    });
  }

  const onAvatarChanged = () => {
    mountedFrames.forEach(root => { if (root.isConnected) applyStoredAvatarsInFrame(root); });
  };
  const getChatId = () => hostWin.SillyTavern?.getContext?.()?.getCurrentChatId?.();
  const onDlcChanged = event => {
    const { chatId, messageId } = event.detail || {};
    if (!Number.isInteger(messageId) || chatId !== getChatId()) return;
    mountedFrames.forEach(async root => {
      const win = root.ownerDocument.defaultView;
      if (!root.isConnected || statusFloorId(win) !== messageId) return;
      try {
        const data = await readStatusFloor(win, messageId);
        if (data?.stat_data && root.isConnected && chatId === getChatId() && statusFloorId(win) === messageId) {
          syncDlcUiInFrame(root, data.stat_data);
          if (overlayRoot?.querySelector('.jy-map-modal')?.dataset.open === 'true' && root.contains(activeReturnFocus)) {
            syncMapPhase(overlayRoot, root.dataset.dlcActive === 'true');
            syncMapLocation(sceneValue(root.querySelector('.jy-location')));
          }
          root.querySelector('[data-campus-channel]')?.dispatchEvent(new win.Event('change'));
        }
      } catch (_) {}
    });
  };
  const onThemeStorage = () => {
    mountedFrames.forEach(root => { if (root.isConnected) syncThemeInFrame(root); });
    syncOverlayTheme();
  };

  hostWin.addEventListener(AVATAR_EVENT, onAvatarChanged);
  hostWin.addEventListener(DLC_EVENT, onDlcChanged);
  hostWin.addEventListener('storage', event => {
    if (event.key === null || event.key?.startsWith(STORAGE_PREFIX)) onAvatarChanged();
    if (event.key === null || event.key === THEME_KEY) onThemeStorage();
  });

  function destroy() {
    hostWin.removeEventListener(AVATAR_EVENT, onAvatarChanged);
    hostWin.removeEventListener(DLC_EVENT, onDlcChanged);
    mountedFrames.clear();
    overlayRoot?.remove();
    overlayRoot = null;
    hostDoc.getElementById('jy-status-overlay-style')?.remove();
    if (hostWin[ENGINE_KEY]?.destroy === destroy) delete hostWin[ENGINE_KEY];
  }

  hostWin[ENGINE_KEY] = { mount, scan: scanHostIframes, destroy, version: 1 };
  try { hostWin.dispatchEvent(new hostWin.CustomEvent(READY_EVENT)); } catch (_) {}
  scanHostIframes();
})();
