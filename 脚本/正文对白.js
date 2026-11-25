// 暨阳正文：装饰已渲染的对白和对应楼层的场景，不改聊天原文、草稿或 MVU。
// API依据：SillyTavern 1.19.0 st-context.js；Tavern Helper 4.12.0 variables.d.ts。
(() => {
  'use strict';
  let host = window;
  try { if (window.top.document) host = window.top; } catch (_) {}
  const doc = host.document;
  const KEY = '__jyDialogue';
  const AVATAR_EVENT = 'jy-avatar-changed';
  host[KEY]?.destroy();
  // JY_SCENES_BEGIN
  const scenes = {"places":[["高二重点班教室",["八班","高二（8）班","高二(8)班","高三八班","高三教室","教学楼","教室"],"corridor",false],["高二教师办公室（英语组）",["英语办公室","英语组","教师办公室"],"office",false],["操场",["篮球场","跑道"],"sports",false],["操场器材室",["操场器材室"],"equipment",false],["音乐教室",["音乐教室"],"music",false],["礼堂后台",["礼堂后台"],"arts",false],["图书馆",["借还台","文学社长桌","旧书库"],"library",false],["天台",["楼顶","天台铁门"],"roof",false],["食堂",["小炒窗口","食堂后门"],"canteen",false],["小花园",["鹅卵石路","花园长椅"],"garden",false],["实验楼",["竞赛自习室","竞赛教室","物理实验室"],"lab",false],["行政楼",["年级组会议室","家长接待室","校长室","校长办公室","教务处"],"admin",false],["暨阳路校门口",["校门口","校门公交站","公交站","暨阳路"],"bus",false],["雄风老商场",["雄风商场","老雄风","雄风"],"mall",false],["KFC与正新鸡排",["肯德基","KFC","正新鸡排"],"kfc",false],["青悦城",["无招牌咖啡馆","青悦城四楼"],"qing",false],["遇见奶茶店",["遇见奶茶","遇见店"],"tea",false],["晨光文具复印店",["晨光文具","复印店","文印店"],"copyshop",false],["浣江步道",["浣江边","浦阳江","浦阳江边","河边步道","浣江路"],"river",false],["老城生活圈",["老城窄巷","老城","艮塔公园","次坞打面"],"oldtown",false],["西施故里与御江湾",["西施故里","御江湾"],"heritage",false],["城东万风新天地",["万风新天地","万风"],"east",false],["万达宝龙商圈",["万达广场","宝龙广场","万达","宝龙"],"wanda",false],["老鹰山",["老鹰山步道","老鹰山山脚","听风亭","老鹰山观景台"],"mountain",false],["暨阳站",["高铁站","暨阳火车站"],"station",false],["老鹰山归元眼",["归元眼","太微云岫宗遗殿","太微云岫宗山门","听风归元窍","荒径枯井"],"guiyuan",true],["浙江大学紫金港校区",["浙大紫金港","紫金港校区","浙大管理学院"],"zju",true],["钱塘谢氏剑庐",["钱塘剑庐","谢氏剑庐","六和塔镇江古眼","镇江古眼","钱塘潮汐秘市","钱塘秘市"],"qtxie",true],["西溪葛氏丹霞",["西溪葛氏","抱朴丹霞小洞天","葛氏丹霞","古方药庄"],"xixige",true],["南屏法华禅院",["南屏古刹","法华禅院","南屏古寺"],"nanping",true],["魔都苏氏水府",["沧溟水府","苏氏水府","魔都苏氏","东海苏家"],"shsufu",true],["申城天星钟氏",["静安古钟阁","天星钟氏","申城钟氏"],"shzhong",true],["崇明归墟海坛",["崇明归墟","崇明东滩海坛","东海蓬莱","蓬莱仙岛","方丈仙岛","瀛洲仙岛"],"penglai",true],["四明赤水剑宗",["四明山","赤水剑宗","四明山赤水剑宗"],"siming",true],["天台赤城洞天",["天台山","天台赤城","赤城洞天"],"tiantai",true],["天目灵虚宫",["天目山","西天目山","灵虚宫"],"tianmu",true],["茅山上清宗",["茅山","上清洞天","茅山山门","上清宗"],"maoshan",true],["龙虎山天师府",["龙虎山","龙虎山张氏","天师府"],"longhu",true],["武当山紫霄宫",["武当山","武当","紫霄宫"],"wudang",true],["终南山楼观台",["终南山","楼观台","终南隐修地"],"zhongnan",true],["青城山丈人洞天",["青城山","青城丈人峰","丈人洞天"],"qingcheng",true],["西域昆仑祖脉",["昆仑祖脉","昆仑山","西域昆仑"],"kunlun",true]],"photos":{"office":["高二教师办公室（英语组）的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/office.webp"],"canteen":["食堂的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/canteen.webp"],"music":["音乐教室的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/music.webp"],"qing":["青悦城的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/qing.webp"],"mall":["雄风老商场的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mall.webp"],"tea":["遇见奶茶店的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/tea.webp"],"heritage":["西施故里与御江湾的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/heritage.webp"],"admin":["行政楼的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/admin.webp"],"oldtown":["老城生活圈的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/oldtown.webp"],"river":["浣江步道的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/river.webp"],"station":["暨阳站的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/station.webp"],"equipment":["操场器材室的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/equipment.webp"],"garden":["小花园的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/garden.webp"],"lab":["实验楼的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/lab.webp"],"roof":["天台的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/roof.webp"],"east":["城东万风新天地的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/east.webp"],"wanda":["万达宝龙商圈的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/wanda.webp"],"kfc":["KFC与正新鸡排的场景照","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/kfc.webp"],"copyshop":["暑假午后的晨光文具复印店","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/copyshop.webp"],"arts":["艺术周彩排前从侧幕望向舞台","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/arts.webp"],"sports":["体育周开赛前的篮球场","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/sports.webp"],"mountain":["雨后老鹰山的听风亭与步道","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mountain.webp"],"corridor":["雨后湿润的教学楼连廊","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/corridor.webp"],"library":["图书馆靠窗长桌，旧书上放着一张还书单","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/library.webp"],"bus":["傍晚亮起灯的校门公交站","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/bus.webp"],"guiyuan":["老鹰山归元眼的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/guiyuan.webp"],"zju":["浙江大学紫金港校区的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/zju.webp"],"qtxie":["钱塘谢氏剑庐的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/qtxie.webp"],"xixige":["西溪葛氏丹霞的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/xixige.webp"],"nanping":["南屏法华禅院的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/nanping.webp"],"shsufu":["魔都苏氏水府的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/shsufu.webp"],"shzhong":["申城天星钟氏的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/shzhong.webp"],"penglai":["崇明归墟海坛的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/penglai.webp"],"siming":["四明赤水剑宗的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/siming.webp"],"tiantai":["天台赤城洞天的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/tiantai.webp"],"tianmu":["天目灵虚宫的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/tianmu.webp"],"maoshan":["茅山上清宗的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/maoshan.webp"],"longhu":["龙虎山天师府的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/longhu.webp"],"wudang":["武当山紫霄宫的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/wudang.webp"],"zhongnan":["终南山楼观台的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/zhongnan.webp"],"qingcheng":["青城山丈人洞天的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/qingcheng.webp"],"kunlun":["西域昆仑祖脉的场景插图","https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/scenes/cultivation/kunlun.webp"]}};
  // JY_SCENES_END
  const normalizePlace = value => value.normalize('NFKC').replace(/\s+/gu, '').toLowerCase();
  const placeAliases = scenes.places.flatMap(([name, aliases, key, dlc]) =>
    [name, ...aliases].filter(Boolean).map(alias => [normalizePlace(alias), key, dlc])
  ).sort((a, b) => b[0].length - a[0].length);
  const scenery = new Set();
  const failedScenes = new WeakMap();
  const subscriptions = [];
  const defaults = {
    '苏晚棠': 'statusbar/v2/avatars/xiaoqiang.png',
    '温书语': 'statusbar/v2/avatars/shuyu.png',
    '沈若微': 'statusbar/v2/avatars/youchu.png',
    '许念安': 'statusbar/v2/avatars/nianan.png',
    '慕佳芊': 'statusbar/v2/avatars/jiaqian.png',
    '陈芷汀': 'statusbar/v2/avatars/zhiting.png',
    '虞淑婉': 'statusbar/v1/avatars/shuwan.png',
    '云清晏': 'albums/v1/yunqingyan/campus.webp',
    '谢昭宁': 'albums/v1/xiezhaoning/campus.webp',
    '吴臻臻': 'statusbar/v2/avatars/wuzhenzhen.webp',
    '俞嘉豪': 'statusbar/v2/avatars/yujiahao.webp',
  };
  const reserved = new Set(['旁白', '系统', '状态', '状态栏', '选项', '规则', '内心独白']);
  // 模型偶尔会用称呼写标签，映射回标准角色名，才能命中同名头像缓存。
  const nameAliases = {
    '小天女': '苏晚棠', '书语': '温书语', '若微': '沈若微',
    '念安': '许念安', '安安': '许念安', '学习委员': '许念安',
    '吴班长': '吴臻臻', '嘉豪': '俞嘉豪',
    '佳芊': '慕佳芊', '慕老师': '慕佳芊', '英语老师': '慕佳芊',
    '芷汀': '陈芷汀', '虞校长': '虞淑婉', '校长': '虞淑婉', '淑婉': '虞淑婉',
    '清晏': '云清晏', '圣女': '云清晏', '云圣女': '云清晏', '云师姐': '云清晏',
    '昭宁': '谢昭宁', '谢大小姐': '谢昭宁', '剑庐小公主': '谢昭宁',
  };
  const PLAYER_ALIASES = new Set(['主角', '玩家', 'user', '我', '你']);
  const CHARACTER_TONES = {
    '苏晚棠': { ink: '#c95b42', edge: '#e9c1b7', bg: '#fff8f6' },
    '温书语': { ink: '#3c7399', edge: '#bdd6e6', bg: '#f6fafd' },
    '沈若微': { ink: '#8a6d52', edge: '#dfcfb9', bg: '#fcf9f4' },
    '许念安': { ink: '#4f688a', edge: '#c3cfe0', bg: '#f7f9fc' },
    '慕佳芊': { ink: '#b3741e', edge: '#ead2ad', bg: '#fdf9f2' },
    '陈芷汀': { ink: '#b4456c', edge: '#e8becd', bg: '#fdf6f9' },
    '虞淑婉': { ink: '#2e5950', edge: '#bfd5cf', bg: '#f6faf8' },
    '云清晏': { ink: '#1d6b61', edge: '#b5d8cf', bg: '#f4fbf9' },
    '谢昭宁': { ink: '#2b5f75', edge: '#b8d3de', bg: '#f4f9fc' },
    '吴臻臻': { ink: '#3b4b5c', edge: '#c3cdd6', bg: '#f6f8fa' },
    '俞嘉豪': { ink: '#6f6653', edge: '#dbd3c3', bg: '#faf8f4' },
  };
  function canonicalName(name) {
    return Object.hasOwn(defaults, name) ? name : (nameAliases[name] || name);
  }
  const mounted = new Map();
  let timer = null;
  let stopped = false;
  const style = doc.createElement('style');
  style.dataset.jyDialogueStyle = '';
  style.textContent = `
    [data-jy-scene] { position:relative; display:block; overflow:hidden; isolation:isolate; margin:0 0 14px; height:clamp(92px, 18vw, 158px); border:1px solid rgba(30,86,76,.18); border-radius:12px; background:#243832; box-shadow:0 6px 18px rgba(24,42,37,.1); }
    [data-jy-scene] img { display:block; width:100%; height:100%; object-fit:cover; margin:0; border:0; }
    [data-jy-scene] figcaption { position:absolute; inset:auto 0 0; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:22px 13px 9px; color:#fff; background:linear-gradient(transparent,#152420e0); text-align:left; text-indent:0; font-size:.82em; font-weight:700; }
    [data-jy-scene] .jy-scene-meta { padding:2px 8px; border-radius:999px; background:rgba(255,255,255,.16); font-size:.88em; font-weight:600; white-space:nowrap; }
    [data-jy-dialogue-source] { display:none!important; }
    [data-jy-dialogue-render] { display:block; }
    [data-jy-dialogue-row] { --jy-ink:#1e564c; --jy-edge:#c3d6cf; --jy-bg:#faf7f0; display:flex; align-items:flex-start; gap:12px; margin:18px 0; max-width:100%; min-width:0; text-indent:0; text-align:left; line-height:1.8; }
    [data-jy-dialogue-row] * { box-sizing:border-box; }
    [data-jy-dialogue-row][data-player=true] { flex-direction:row-reverse; --jy-ink:#8a562d; --jy-edge:#e3c9b0; --jy-bg:#fff8ef; }
    [data-jy-dialogue-avatar] { flex:0 0 88px; width:88px; height:auto; position:relative; display:grid; place-items:center; overflow:hidden; border:1.5px solid var(--jy-edge); border-radius:10px; background:color-mix(in srgb, var(--jy-ink) 10%, #ffffff); color:var(--jy-ink); font-family:ui-serif,"Noto Serif SC","Songti SC",serif; font-size:24px; font-weight:800; box-shadow:0 4px 12px rgba(24,42,37,.09); }
    [data-jy-dialogue-avatar]:not(:has(img)) { aspect-ratio:1; }
    [data-jy-dialogue-avatar]:has(img) [data-jy-dialogue-fallback] { display:none; }
    #chat [data-jy-dialogue-avatar] img { display:block; width:100%; height:auto; max-height:none; margin:0; border:0; border-radius:10px; }
    [data-jy-dialogue-bubble] { display:block; min-width:0; max-width:min(680px, calc(100% - 100px)); padding:11px 16px 13px; background:var(--jy-bg); border:1px solid var(--jy-edge); border-radius:4px 14px 14px 14px; color:#1e2a27; overflow-wrap:anywhere; white-space:pre-wrap; font-size:1em; box-shadow:0 3px 10px rgba(24,42,37,.06); }
    [data-player=true] [data-jy-dialogue-bubble] { background:#fff8ef; border-radius:14px 4px 14px 14px; }
    [data-jy-dialogue-name] { display:block; color:var(--jy-ink); font-size:.82em; font-weight:750; margin-bottom:3px; }
    [data-jy-dialogue-body] { display:block; }
    @media(max-width:480px) {
      [data-jy-dialogue-row] { gap:8px; margin:14px 0; }
      [data-jy-dialogue-avatar] { flex-basis:68px; width:68px; font-size:20px; }
      [data-jy-dialogue-bubble] { max-width:calc(100% - 76px); padding:9px 11px; }
    }
  `;
  doc.head.append(style);

  function parseLine(raw) {
    const match = raw.trim().match(/^\{([^{}\n<>]{1,40})\}\s*「([^「」\n]+)」$/u);
    if (!match || reserved.has(match[1].trim())) return null;
    return { name: match[1].trim(), body: match[2] };
  }

  function safeSource(src) {
    return typeof src === 'string' && (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(src) || /^https?:\/\//i.test(src));
  }

  function avatarSources(name) {
    const sources = [];
    try {
      const cached = host.localStorage.getItem('jy-avatar:' + name);
      if (safeSource(cached)) sources.push(cached);
    } catch (_) {}
    if (Object.hasOwn(defaults, name)) {
      sources.push('https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/' + defaults[name]);
      sources.push('https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/' + defaults[name]);
      sources.push('https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/main/' + defaults[name]);
    }
    return sources;
  }

  function messageState(message) {
    try {
      const id = message?.getAttribute('mesid');
      const read = window.getVariables || host.TavernHelper?.getVariables;
      if (!id || !/^\d+$/.test(id) || typeof read !== 'function') return undefined;
      return read({ type: 'message', message_id: Number(id) })?.stat_data;
    } catch (_) { return undefined; }
  }

  function sceneFallbacks(url) {
    const base = 'https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@';
    const cdn = 'https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@';
    const raw = 'https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/';
    const normalized = String(url || '');
    const list = [
      normalized.startsWith(cdn) ? normalized.replace(cdn, base) : normalized,
      normalized.startsWith(base) ? normalized.replace(base, cdn) : (normalized.startsWith(cdn) ? normalized : normalized),
      normalized.replace(/^https:\/\/(?:testingcf|cdn)\.jsdelivr\.net\/gh\/YangChen-cn\/jiyang-school-assets@/, raw)
    ];
    return [...new Set(list.filter(Boolean))];
  }

  function decorateScene(body, state) {
    const location = state?.世界?.当前位置;
    const label = typeof location === 'string' ? location.trim() : '';
    const value = normalizePlace(label);
    const active = state?.剧情?.灵气复苏?.已开启 === true;
    const match = placeAliases.find(([alias, , dlc]) => (!dlc || active) && value === alias)
      || placeAliases.find(([alias, , dlc]) => (!dlc || active) && alias.length >= 3 && value.includes(alias));
    const photo = match && scenes.photos[match[1]];
    const metaText = [state?.世界?.时段, state?.世界?.天气]
      .map(v => (typeof v === 'string' ? v.trim() : ''))
      .filter(Boolean)
      .join(' · ');
    const current = body.querySelector(':scope > [data-jy-scene]');
    if (current && photo && current.dataset.jyScene === match[1] && current.dataset.jySceneLabel === label && current.dataset.jySceneMeta === metaText) return;
    if (current) {
      current.remove();
      scenery.delete(current);
    }
    if (!photo || failedScenes.get(body) === match[1]) return;
    const figure = doc.createElement('figure');
    figure.dataset.jyScene = match[1];
    figure.dataset.jySceneLabel = label;
    figure.dataset.jySceneMeta = metaText;
    figure.contentEditable = 'false';
    const image = doc.createElement('img');
    image.alt = photo[0];
    image.loading = 'lazy';
    image.decoding = 'async';
    const sources = sceneFallbacks(photo[1]);
    let srcIndex = 0;
    image.addEventListener('error', () => {
      if (++srcIndex < sources.length && figure.isConnected) {
        image.src = sources[srcIndex];
        return;
      }
      failedScenes.set(body, match[1]);
      scenery.delete(figure);
      figure.remove();
    });
    image.src = sources[0];
    const caption = doc.createElement('figcaption');
    const locSpan = doc.createElement('span');
    locSpan.textContent = label;
    caption.append(locSpan);
    if (metaText) {
      const metaSpan = doc.createElement('span');
      metaSpan.className = 'jy-scene-meta';
      metaSpan.textContent = metaText;
      caption.append(metaSpan);
    }
    figure.append(image, caption);
    body.prepend(figure);
    scenery.add(figure);
  }

  function playerNames(state) {
    const names = new Set(PLAYER_ALIASES);
    const name = state?.主角?.姓名;
    if (typeof name === 'string' && name.trim()) names.add(name.trim());
    try {
      const name = host.SillyTavern?.getContext()?.name1;
      if (typeof name === 'string' && name.trim()) names.add(name.trim());
    } catch (_) {}
    return names;
  }

  function paintAvatar(avatar, key) {
    const sources = avatarSources(key);
    // Keep failed-image fallbacks stable instead of retrying on every DOM change.
    const signature = JSON.stringify(sources);
    if (avatar.dataset.signature === signature) return;
    avatar.dataset.signature = signature;
    avatar.querySelector('img')?.remove();
    if (!sources.length) return;
    const img = doc.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    // Let the browser paint decoded images even if the host copied the node
    // during rendering and its load handler did not carry over.
    let index = 0;
    img.onerror = () => {
      if (++index < sources.length) img.src = sources[index];
      else img.remove();
    };
    avatar.append(img);
    img.src = sources[0];
  }

  function makeRow(dialogue, names) {
    const row = doc.createElement('span');
    row.dataset.jyDialogueRow = '';
    row.dataset.speaker = dialogue.name;
    const avatar = doc.createElement('span');
    avatar.dataset.jyDialogueAvatar = '';
    avatar.setAttribute('aria-hidden', 'true');
    const fallback = doc.createElement('span');
    fallback.dataset.jyDialogueFallback = '';
    fallback.textContent = Array.from(dialogue.name)[0];
    avatar.append(fallback);
    const bubble = doc.createElement('span');
    bubble.dataset.jyDialogueBubble = '';
    const label = doc.createElement('span');
    label.dataset.jyDialogueName = '';
    label.textContent = dialogue.name;
    const body = doc.createElement('span');
    body.dataset.jyDialogueBody = '';
    body.textContent = '「' + dialogue.body + '」';
    bubble.append(label, body);
    row.append(avatar, bubble);
    refreshRow(row, names);
    return row;
  }

  function refreshRow(row, names) {
    const name = row.dataset.speaker;
    // A named NPC wins over a coincidentally identical persona name.
    const isPlayer = (!Object.hasOwn(defaults, name) || PLAYER_ALIASES.has(name)) && names.has(name);
    const canon = isPlayer ? '主角' : canonicalName(name);
    row.dataset.player = String(isPlayer);
    row.dataset.speakerCanon = canon;
    const tone = !isPlayer && CHARACTER_TONES[canon];
    if (tone) {
      row.style.setProperty('--jy-ink', tone.ink);
      row.style.setProperty('--jy-edge', tone.edge);
      row.style.setProperty('--jy-bg', tone.bg);
    } else {
      row.style.removeProperty('--jy-ink');
      row.style.removeProperty('--jy-edge');
      row.style.removeProperty('--jy-bg');
    }
    paintAvatar(row.querySelector('[data-jy-dialogue-avatar]'), canon);
  }

  function decorate(p, names) {
    if (p.hasAttribute('data-jy-dialogue-mounted')) return;
    // Do not parse code, links, options, thought panels, status UI or arbitrary HTML.
    if (p.closest('details,pre,code,blockquote,table,li,[data-jy-dialogue-source]')) return;
    if ([...p.querySelectorAll('*')].some(n => !['BR', 'Q', 'EM', 'STRONG'].includes(n.tagName))) return;
    const lines = [];
    let line = [];
    function flush() { lines.push(line); line = []; }
    for (const node of p.childNodes) {
      if (node.nodeName === 'BR') flush();
      else if (node.nodeType === 3 && node.textContent.includes('\n')) {
        node.textContent.split('\n').forEach((part, i) => { if (i) flush(); line.push(doc.createTextNode(part)); });
      } else line.push(node.cloneNode(true));
    }
    flush();
    const dialogues = lines.map(nodes => parseLine(nodes.map(n => n.textContent).join('')));
    if (!dialogues.some(Boolean)) return;
    const source = doc.createElement('span');
    source.dataset.jyDialogueSource = '';
    source.hidden = true;
    const render = doc.createElement('span');
    render.dataset.jyDialogueRender = '';
    lines.forEach((nodes, i) => {
      if (dialogues[i]) render.append(makeRow(dialogues[i], names));
      else {
        const plain = doc.createElement('span');
        plain.append(...nodes);
        render.append(plain, doc.createElement('br'));
      }
    });
    source.append(...p.childNodes);
    p.append(source, render);
    p.dataset.jyDialogueMounted = '';
    mounted.set(p, source);
  }

  const observer = new host.MutationObserver(schedule);
  function scan() {
    if (stopped) return;
    observer.disconnect();
    try {
      for (const [p, source] of mounted) {
        if (!p.isConnected || source.parentNode !== p) {
          mounted.delete(p);
          p.removeAttribute('data-jy-dialogue-mounted');
        }
      }
      for (const figure of scenery) if (!figure.isConnected) scenery.delete(figure);
      doc.querySelectorAll('#chat .mes[is_user="false"] .mes_text').forEach(body => {
        const state = messageState(body.closest('.mes'));
        decorateScene(body, state);
        const names = playerNames(state);
        // Only ordinary prose paragraphs; no descent into another extension's panel.
        body.querySelectorAll(':scope > p, :scope > content > p, :scope > main > p').forEach(p => decorate(p, names));
        body.querySelectorAll('[data-jy-dialogue-row]').forEach(row => refreshRow(row, names));
      });
    } finally {
      if (!stopped) observer.observe(doc.querySelector('#chat') || doc.body, { childList: true, subtree: true, characterData: true });
    }
  }
  function schedule() {
    if (!stopped && timer === null) timer = host.setTimeout(() => { timer = null; scan(); }, 80);
  }
  function storageChanged(event) {
    if (event.key === null || event.key?.startsWith('jy-avatar:')) schedule();
  }
  function destroy() {
    if (stopped) return;
    stopped = true;
    observer.disconnect();
    host.clearTimeout(timer);
    host.removeEventListener(AVATAR_EVENT, schedule);
    host.removeEventListener('storage', storageChanged);
    window.removeEventListener('pagehide', destroy);
    for (const [p, source] of mounted) {
      if (source.parentNode === p) p.replaceChildren(...source.childNodes);
      p.removeAttribute('data-jy-dialogue-mounted');
    }
    mounted.clear();
    for (const sub of subscriptions) sub?.stop?.();
    for (const figure of scenery) figure.remove();
    scenery.clear();
    style.remove();
    if (host[KEY]?.destroy === destroy) delete host[KEY];
  }
  if (typeof eventOn === 'function') {
    for (const event of ['message_received', 'message_updated', 'message_swiped', 'chat_id_changed', 'mag_variable_update_ended']) {
      subscriptions.push(eventOn(event, schedule));
    }
  }
  host.addEventListener(AVATAR_EVENT, schedule);
  host.addEventListener('storage', storageChanged);
  window.addEventListener('pagehide', destroy, { once: true });
  function debug() {
    let keys = [];
    try {
      keys = Object.keys(host.localStorage).filter((key) => key.startsWith('jy-avatar:')).map((key) => ({ key, length: String(host.localStorage.getItem(key) || '').length }));
    } catch (_) {}
    const rows = [...doc.querySelectorAll('[data-jy-dialogue-row]')].map((row) => {
      const avatar = row.querySelector('[data-jy-dialogue-avatar]');
      const image = avatar?.querySelector('img');
      return { speaker: row.dataset.speaker, player: row.dataset.player, signature: (avatar?.dataset.signature || '').slice(0, 48), src: (image?.src || '').slice(0, 40), loaded: image ? image.complete && image.naturalWidth > 0 : false };
    });
    return { top: host === host.top, keys, rows };
  }
  host[KEY] = { destroy, debug };
  scan();
})();
