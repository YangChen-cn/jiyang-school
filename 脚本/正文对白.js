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
  const scenes = {"places":[["高二重点班教室",["八班","高二（8）班","高二(8)班","高三八班","高三教室","教学楼","教室"],"corridor"],["高二教师办公室（英语组）",["英语办公室","英语组","教师办公室"],"office"],["操场",["篮球场","跑道"],"sports"],["操场器材室",["操场器材室"],"equipment"],["音乐教室",["音乐教室"],"music"],["礼堂后台",["礼堂后台"],"arts"],["图书馆",["借还台","文学社长桌","旧书库"],"library"],["天台",["楼顶","天台铁门"],"roof"],["食堂",["小炒窗口","食堂后门"],"canteen"],["小花园",["鹅卵石路","花园长椅"],"garden"],["实验楼",["竞赛自习室","竞赛教室","物理实验室"],"lab"],["行政楼",["年级组会议室","家长接待室","校长室","校长办公室","教务处"],"admin"],["暨阳路校门口",["校门口","校门公交站","公交站","暨阳路"],"bus"],["雄风老商场",["雄风商场","老雄风","雄风"],"mall"],["KFC与正新鸡排",["肯德基","KFC","正新鸡排"],"kfc"],["青悦城",["无招牌咖啡馆","青悦城四楼"],"qing"],["遇见奶茶店",["遇见奶茶","遇见店"],"tea"],["晨光文具复印店",["晨光文具","复印店","文印店"],"copyshop"],["浣江步道",["浣江边","浦阳江","浦阳江边","河边步道","浣江路"],"river"],["老城生活圈",["老城窄巷","老城","艮塔公园","次坞打面"],"oldtown"],["西施故里与御江湾",["西施故里","御江湾"],"heritage"],["城东万风新天地",["万风新天地","万风"],"east"],["万达宝龙商圈",["万达广场","宝龙广场","万达","宝龙"],"wanda"],["老鹰山",["老鹰山步道","老鹰山山脚","听风亭","老鹰山观景台"],"mountain"],["暨阳站",["高铁站","暨阳火车站"],"station"]],"photos":{"office":["高二教师办公室（英语组）的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/office.webp"],"canteen":["食堂的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/canteen.webp"],"music":["音乐教室的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/music.webp"],"qing":["青悦城的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/qing.webp"],"mall":["雄风老商场的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mall.webp"],"tea":["遇见奶茶店的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/tea.webp"],"heritage":["西施故里与御江湾的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/heritage.webp"],"admin":["行政楼的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/admin.webp"],"oldtown":["老城生活圈的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/oldtown.webp"],"river":["浣江步道的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/river.webp"],"station":["暨阳站的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/station.webp"],"equipment":["操场器材室的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/equipment.webp"],"garden":["小花园的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/garden.webp"],"lab":["实验楼的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/lab.webp"],"roof":["天台的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/roof.webp"],"east":["城东万风新天地的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/east.webp"],"wanda":["万达宝龙商圈的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/wanda.webp"],"kfc":["KFC与正新鸡排的场景照","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/kfc.webp"],"copyshop":["暑假午后的晨光文具复印店","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/copyshop.webp"],"arts":["艺术周彩排前从侧幕望向舞台","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/arts.webp"],"sports":["体育周开赛前的篮球场","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/sports.webp"],"mountain":["雨后老鹰山的听风亭与步道","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/mountain.webp"],"corridor":["雨后湿润的教学楼连廊","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/corridor.webp"],"library":["图书馆靠窗长桌，旧书上放着一张还书单","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/library.webp"],"bus":["傍晚亮起灯的校门公交站","https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@e450d24017cd3fed4bb069b3699ec8f589f32382/statusbar/scenes/bus.webp"]}};
  // JY_SCENES_END
  const normalizePlace = value => value.normalize('NFKC').replace(/\s+/gu, '').toLowerCase();
  const placeAliases = scenes.places.flatMap(([name, aliases, key]) =>
    [name, ...aliases].filter(Boolean).map(alias => [normalizePlace(alias), key])
  ).sort((a, b) => b[0].length - a[0].length);
  const scenery = new Set();
  const failedScenes = new WeakMap();
  const subscriptions = [];
  const defaults = {
    '苏晓樯': 'v2/avatars/xiaoqiang.png',
    '温书语': 'v2/avatars/shuyu.png',
    '沈幼楚': 'v2/avatars/youchu.png',
    '凌知夏': 'v2/avatars/zhixia.png',
    '慕佳芊': 'v2/avatars/jiaqian.png',
    '陈芷汀': 'v2/avatars/zhiting.png',
    '虞淑婉': 'v1/avatars/shuwan.png',
  };
  const reserved = new Set(['旁白', '系统', '状态', '状态栏', '选项', '规则', '内心独白']);
  // 模型偶尔会用称呼写标签，映射回标准角色名，才能命中同名头像缓存。
  const nameAliases = {
    '小天女': '苏晓樯', '书语': '温书语', '幼楚': '沈幼楚', '知夏': '凌知夏',
    '佳芊': '慕佳芊', '慕老师': '慕佳芊', '英语老师': '慕佳芊',
    '芷汀': '陈芷汀', '虞校长': '虞淑婉', '校长': '虞淑婉', '淑婉': '虞淑婉',
  };
  const PLAYER_ALIASES = new Set(['主角', '玩家', 'user', '我', '你']);
  function canonicalName(name) {
    return Object.hasOwn(defaults, name) ? name : (nameAliases[name] || name);
  }
  const mounted = new Map();
  let timer = null;
  let stopped = false;
  const style = doc.createElement('style');
  style.dataset.jyDialogueStyle = '';
  style.textContent = `
    [data-jy-scene] { position:relative; display:block; overflow:hidden; isolation:isolate; margin:0 0 14px; height:clamp(92px, 18vw, 158px); border-radius:10px; background:#334945; }
    [data-jy-scene] img { display:block; width:100%; height:100%; object-fit:cover; margin:0; border:0; }
    [data-jy-scene] figcaption { position:absolute; inset:auto 0 0; padding:18px 12px 8px; color:#fff; background:linear-gradient(transparent,#172522d9); text-align:left; text-indent:0; font-size:.8em; }
    [data-jy-dialogue-source] { display:none!important; }
    [data-jy-dialogue-render] { display:block; }
    [data-jy-dialogue-row] { --jy-ink:#244c45; --jy-edge:#c7dcd4; display:flex; align-items:flex-start; gap:12px; margin:18px 0; max-width:100%; min-width:0; text-indent:0; text-align:left; line-height:1.8; }
    [data-jy-dialogue-row] * { box-sizing:border-box; }
    [data-jy-dialogue-row][data-player=true] { flex-direction:row-reverse; --jy-ink:#795137; --jy-edge:#e5cdb9; }
    [data-jy-dialogue-avatar] { flex:0 0 46px; width:46px; height:46px; position:relative; display:grid; place-items:center; overflow:hidden; border:1px solid var(--jy-edge); border-radius:50%; background:#e9f1ec; color:var(--jy-ink); font-size:19px; }
    [data-jy-dialogue-avatar] img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; margin:0; border:0; border-radius:inherit; }
    [data-jy-dialogue-avatar] img[hidden] { display:none; }
    [data-jy-dialogue-bubble] { display:block; min-width:0; max-width:min(680px, calc(100% - 58px)); padding:11px 16px 13px; background:#f7faf7; border:1px solid var(--jy-edge); border-radius:4px 16px 16px; color:#263e38; overflow-wrap:anywhere; white-space:pre-wrap; font-size:1em; box-shadow:0 3px 10px #163f2910; }
    [data-player=true] [data-jy-dialogue-bubble] { background:#fff8f0; border-radius:16px 4px 16px 16px; }
    [data-jy-dialogue-name] { display:block; color:var(--jy-ink); font-size:.82em; font-weight:650; margin-bottom:3px; }
    [data-jy-dialogue-body] { display:block; }
    @media(max-width:480px) {
      [data-jy-dialogue-row] { gap:8px; margin:14px 0; }
      [data-jy-dialogue-avatar] { flex-basis:34px; width:34px; height:34px; font-size:16px; }
      [data-jy-dialogue-bubble] { max-width:calc(100% - 42px); padding:9px 11px; }
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
      sources.push('https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/statusbar/' + defaults[name]);
      sources.push('https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/main/statusbar/' + defaults[name]);
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

  function decorateScene(body, state) {
    const location = state?.世界?.当前位置;
    const label = typeof location === 'string' ? location.trim() : '';
    const value = normalizePlace(label);
    const match = placeAliases.find(([alias]) => value === alias)
      || placeAliases.find(([alias]) => alias.length >= 3 && value.includes(alias));
    const photo = match && scenes.photos[match[1]];
    const current = body.querySelector(':scope > [data-jy-scene]');
    if (current && photo && current.dataset.jyScene === match[1] && current.lastElementChild?.textContent === label) return;
    if (current) {
      current.remove();
      scenery.delete(current);
    }
    if (!photo || failedScenes.get(body) === match[1]) return;
    const figure = doc.createElement('figure');
    figure.dataset.jyScene = match[1];
    figure.contentEditable = 'false';
    const image = doc.createElement('img');
    image.alt = photo[0];
    image.loading = 'lazy';
    image.decoding = 'async';
    const fallback = photo[1].replace('https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@', 'https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/');
    image.addEventListener('error', () => {
      if (image.src !== fallback && figure.isConnected) {
        image.src = fallback;
        return;
      }
      failedScenes.set(body, match[1]);
      scenery.delete(figure);
      figure.remove();
    });
    image.src = photo[1];
    const caption = doc.createElement('figcaption');
    caption.textContent = label;
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
    img.loading = 'lazy';
    img.hidden = true;
    let index = 0;
    img.onload = () => { img.hidden = false; };
    img.onerror = () => {
      img.hidden = true;
      if (++index < sources.length) img.src = sources[index];
    };
    img.src = sources[0];
    avatar.append(img);
  }

  function makeRow(dialogue, names) {
    const row = doc.createElement('span');
    row.dataset.jyDialogueRow = '';
    row.dataset.speaker = dialogue.name;
    const avatar = doc.createElement('span');
    avatar.dataset.jyDialogueAvatar = '';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = Array.from(dialogue.name)[0];
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
    row.dataset.player = String(isPlayer);
    paintAvatar(row.querySelector('[data-jy-dialogue-avatar]'), isPlayer ? '主角' : canonicalName(name));
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
      return { speaker: row.dataset.speaker, player: row.dataset.player, signature: (avatar?.dataset.signature || '').slice(0, 48), src: (image?.src || '').slice(0, 40), loaded: image ? !image.hidden && image.naturalWidth > 0 : false };
    });
    return { top: host === host.top, keys, rows };
  }
  host[KEY] = { destroy, debug };
  scan();
})();
