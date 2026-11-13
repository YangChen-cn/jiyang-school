(function () {
  'use strict';

  var ROOT_SELECTOR = '[data-jy-opening]';
  var GLOBAL_KEY = '__jiyangOpeningSetupControllerV7';
  var LEGACY_ENTRY_NAME = '玩家开局设定';
  var WRITE_LEGACY_WORLDBOOK = false; // 旧版把档案写进世界书；新版改为写 MVU 变量，保留代码路径但默认关闭
  var GREETING_NAMES = ['开局设定界面', '开学第一天', '慕佳芊', '苏晓樯', '温书语', '沈幼楚', '凌知夏', '陈芷汀', '虞淑婉'];
  var CHARACTER_NAMES = ['苏晓樯', '温书语', '沈幼楚', '凌知夏', '慕佳芊', '陈芷汀', '虞淑婉'];
  var DEFAULT_FIELDS = {
    '年龄': '17岁',
    '班级或身份': '暨阳中学高二重点班学生'
  };
  var PLACEHOLDER = '<OpeningSetupUI/>';
  var cleanups = [];
  var timers = [];
  var observer = null;
  var activeRoot = null;
  var submitting = false;

  // 八条预写开场对应的场景补丁（按各自开场白正文事实填写，不统一套 9/1 早自习）。
  var GREETING_SCENES = {
    1: {
      date: '2020/09/01', week: '星期二', time: '早自习', weather: '晴', location: '暨阳中学 教学楼四楼 高二（8）班教室',
      area: '校园', privacy: '公开', pace: '日常铺垫', semester: '高二上', focus: '群体', schoolEvent: '无',
      present: {
        '苏晓樯': { pos: '教室后排靠窗座位', top: '白色短袖校服衬衫', bottom: '深色校服百褶裙', action: '把零食塞进抽屉，回头打量新同学', mood: '好奇里带一点审视', inner: '新来的会坐哪儿？' },
        '温书语': { pos: '窗边第二排', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '低头看一本卷了边的课外书', mood: '安静，不愿被打扰', inner: '希望今天不要有人来搭话。' },
        '凌知夏': { pos: '前排正中', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '把竞赛题集摊开，笔尖压在第一题上', mood: '专注里藏着好胜', inner: '这一题还有更快的解法。' },
        '沈幼楚': { pos: '最后一排靠墙角落', top: '洗得发白的校服短袖', bottom: '洗得发白的校服长裤', action: '把自己缩进墙角，低头避开视线', mood: '紧张，想消失', inner: '不要看我。' },
        '慕佳芊': { pos: '讲台上', top: '浅色衬衫', bottom: '及膝浅色半裙', action: '转身写板书，粉笔声清脆', mood: '从容而克制', inner: '这一届会比上一届更难带吗。' }
      }
    },
    2: {
      date: '2020/09/03', week: '星期四', time: '下午课', weather: '晴', location: '市人民医院 急诊候诊区',
      area: '城区', privacy: '半私密', pace: '事件触发', semester: '高二上', focus: '慕佳芊', schoolEvent: '无',
      present: {
        '慕佳芊': { pos: '急诊候诊区外', top: '浅色风衣（内搭浅色衬衫）', bottom: '及膝半裙', action: '低头看手机，又抬头看向内科门口', mood: '克制的担心', inner: '烧怎么还没退。' }
      }
    },
    3: {
      date: '2020/08/29', week: '星期六', time: '下午', weather: '晴热', location: '城区 浣江路巷口',
      area: '城区', privacy: '公开', pace: '事件触发', semester: '高二上', focus: '苏晓樯', schoolEvent: '无',
      present: {
        '苏晓樯': { pos: '黑色奔驰车旁', top: '白色 T 恤', bottom: '深蓝色牛仔短裤', action: '拎着奶茶站在车门边，抬了抬下巴', mood: '心虚又好奇', inner: '这人怎么偏偏在这儿。' }
      }
    },
    4: {
      date: '2020/09/04', week: '星期五', time: '午休', weather: '晴', location: '学校图书馆 B 区第三排',
      area: '校园', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '温书语', schoolEvent: '无',
      present: {
        '温书语': { pos: '书架旁', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '把一本旧版《边城》放回书架', mood: '安静而专注', inner: '他会不会真的来。' }
      }
    },
    5: {
      date: '2020/09/07', week: '星期一', time: '夜间', weather: '晴', location: '老城窄巷（学校东南侧）',
      area: '城区', privacy: '半私密', pace: '事件触发', semester: '高二上', focus: '沈幼楚', schoolEvent: '无',
      present: {
        '沈幼楚': { pos: '青砖墙边', top: '洗得发白的校服短袖', bottom: '洗得发白的校服长裤', action: '背贴着墙，攥紧书包带发抖', mood: '恐惧到极点', inner: '谁来……谁都好。' }
      }
    },
    6: {
      date: '2020/09/02', week: '星期三', time: '放学', weather: '晴', location: '实验楼三楼 竞赛自习室',
      area: '校园', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '凌知夏', schoolEvent: '无',
      present: {
        '凌知夏': { pos: '自习室长桌另一侧', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '低头批改竞赛题，红笔停在半空', mood: '遇到对手时的专注', inner: '这道题他居然做对了。' }
      }
    },
    7: {
      date: '2020/09/12', week: '星期六', time: '下午', weather: '多云', location: '青悦城四楼 无招牌咖啡馆',
      area: '周边', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '陈芷汀', schoolEvent: '无',
      present: {
        '陈芷汀': { pos: '靠窗卡座', top: '黑色无袖连衣裙', bottom: '（连衣裙）', action: '托着腮看向门口，指尖轻轻敲杯壁', mood: '打量与试探的兴致', inner: '照片和本人差多少呢。' }
      }
    },
    8: {
      date: '2020/09/02', week: '星期三', time: '上午课', weather: '晴', location: '行政楼 校长办公室门口',
      area: '校园', privacy: '半私密', pace: '事件触发', semester: '高二上', focus: '虞淑婉', schoolEvent: '无',
      present: {
        '虞淑婉': { pos: '办公室门内', top: '米白色真丝衬衫', bottom: '黑色直筒西裤', action: '低头俯视跌坐在地的人', mood: '被打断的愠怒与警觉', inner: '他看到了多少。' }
      }
    }
  };

  function stop() {
    cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
    cleanups = [];
    timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    timers = [];
    if (observer) { try { observer.disconnect(); } catch (e) { /* noop */ } observer = null; }
    activeRoot = null;
  }

  try { if (window[GLOBAL_KEY] && typeof window[GLOBAL_KEY].stop === 'function') window[GLOBAL_KEY].stop(); } catch (e) { /* noop */ }

  // ---------- DOM 访问 ----------
  function windowList() {
    var out = [];
    function add(w) { if (w && out.indexOf(w) === -1) out.push(w); }
    add(window);
    try { add(window.parent); } catch (e) { /* noop */ }
    try { add(window.top); } catch (e) { /* noop */ }
    out.slice().forEach(function (w) {
      try { (w.document ? w.document.querySelectorAll('iframe') : []).forEach(function (frame) { try { add(frame.contentWindow); } catch (e) { /* noop */ } }); } catch (e) { /* noop */ }
    });
    return out;
  }

  function documentList() {
    var docs = [];
    windowList().forEach(function (w) {
      try { if (w.document && docs.indexOf(w.document) === -1) docs.push(w.document); } catch (e) { /* noop */ }
    });
    return docs;
  }

  function rootList() {
    var roots = [];
    documentList().forEach(function (doc) {
      try { doc.querySelectorAll(ROOT_SELECTOR).forEach(function (root) { if (roots.indexOf(root) === -1) roots.push(root); }); } catch (e) { /* noop */ }
    });
    return roots;
  }

  function fieldElements(root) { return Array.prototype.slice.call(root.querySelectorAll('[data-field]')); }

  function elementValue(el) {
    if (!el) return '';
    return String(('value' in el) ? el.value : (el.textContent || '')).trim();
  }

  function readField(root, name) {
    var el = root.querySelector('[data-field="' + name + '"]');
    return elementValue(el);
  }

  function readForm(root) {
    var data = {};
    fieldElements(root).forEach(function (el) {
      var key = el.getAttribute('data-field');
      if (!key) return;
      data[key] = elementValue(el) || '未设定';
    });
    return data;
  }

  function fillForm(root, data) {
    fieldElements(root).forEach(function (el) {
      var key = el.getAttribute('data-field');
      var value = data && data[key];
      if (typeof value !== 'string') return;
      var next = value === '未设定' ? '' : value;
      if ('value' in el) el.value = next; else el.textContent = next;
    });
  }

  function readText(root, selector) {
    var el = root.querySelector(selector);
    return el ? String(('value' in el) ? el.value : el.textContent || '').trim() : '';
  }

  function getMode(root) { return root.getAttribute('data-opening-mode') === 'custom' ? 'custom' : 'preset'; }

  function setMode(root, mode) {
    root.setAttribute('data-opening-mode', mode === 'custom' ? 'custom' : 'preset');
    root.querySelectorAll('[data-action="select-mode"]').forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
  }

  function getGreetingIndex(root) {
    var n = Number(root.getAttribute('data-greeting-index'));
    return (Number.isFinite(n) && n >= 1 && n <= 8) ? Math.floor(n) : 1;
  }

  function setGreetingIndex(root, index) {
    root.setAttribute('data-greeting-index', String(index));
    root.querySelectorAll('[data-action="select-greeting"]').forEach(function (btn) {
      var selected = Number(btn.getAttribute('data-greeting')) === index;
      btn.setAttribute('data-selected', selected ? 'true' : 'false');
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  function setState(root, state) {
    root.setAttribute('data-opening-state', state);
    var confirmBtn = root.querySelector('[data-action="confirm"]');
    if (confirmBtn) confirmBtn.disabled = (state === 'submitting');
  }

  // ---------- 提示 ----------
  function parentToastr() {
    try { if (window.parent && window.parent.toastr) return window.parent.toastr; } catch (e) { /* noop */ }
    try { if (window.top && window.top.toastr) return window.top.toastr; } catch (e) { /* noop */ }
    try { if (typeof toastr !== 'undefined') return toastr; } catch (e) { /* noop */ }
    return null;
  }

  function toastrCall(level, message) {
    var t = parentToastr();
    if (t && typeof t[level] === 'function') { try { t[level](message); } catch (e) { /* noop */ } }
  }

  function toast(root, message, type) {
    var node = root && root.querySelector('[data-toast]');
    if (node) {
      node.textContent = message || '';
      node.setAttribute('data-show', message ? 'true' : 'false');
      node.setAttribute('data-type', type || 'info');
      if (message) {
        var timer = setTimeout(function () {
          if (node.getAttribute('data-toast') === message) node.setAttribute('data-show', 'false');
        }, 4200);
        timers.push(timer);
      }
    }
    if (type === 'error') toastrCall('error', message); else toastrCall('info', message);
  }

  // ---------- 酒馆助手 API ----------
  function th(name) {
    try { if (typeof window[name] === 'function') return window[name]; } catch (e) { /* noop */ }
    try { if (window.parent && typeof window.parent[name] === 'function') return window.parent[name]; } catch (e) { /* noop */ }
    try { if (window.top && typeof window.top[name] === 'function') return window.top[name]; } catch (e) { /* noop */ }
    return null;
  }

  function getMessages(range) {
    var fn = th('getChatMessages');
    if (!fn) return [];
    try {
      var result = fn(range);
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.warn('[暨阳开局] getChatMessages 失败', range, e);
      return [];
    }
  }

  function messageText(message) {
    if (!message) return '';
    return String(message.message != null ? message.message : (message.mes != null ? message.mes : ''));
  }

  function messageIsUser(message) {
    if (!message) return false;
    return message.is_user === true || message.isUser === true || message.role === 'user';
  }

  function normalizeText(text) {
    return String(text || '').replace(/<OpeningSetupUI\s*\/>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function currentCharacter() {
    var fn = th('getCharacter');
    if (!fn) return null;
    try { return fn('current'); } catch (e) { console.warn('[暨阳开局] getCharacter 失败', e); return null; }
  }

  function greetingTextAt(index) {
    var character = currentCharacter();
    if (!character) return '';
    var alternates = null;
    if (character.data && Array.isArray(character.data.alternate_greetings)) alternates = character.data.alternate_greetings;
    if (!alternates && Array.isArray(character.alternate_greetings)) alternates = character.alternate_greetings;
    if (alternates && typeof alternates[index - 1] === 'string') return alternates[index - 1];
    var legacy = Array.isArray(character.first_messages) ? character.first_messages : null;
    if (legacy && typeof legacy[index] === 'string') return legacy[index];
    return '';
  }

  function inferGreetingIndex(messageZeroText) {
    var normalized = normalizeText(messageZeroText);
    if (!normalized) return 0;
    for (var i = 1; i <= 8; i += 1) {
      var greeting = normalizeText(greetingTextAt(i));
      if (!greeting) continue;
      var head = greeting.slice(0, 80);
      if (head && normalized.indexOf(head) !== -1) return i;
    }
    return 0;
  }

  function findLetterMessage(messages) {
    for (var i = 0; i < messages.length; i += 1) {
      var text = messageText(messages[i]);
      if (messageIsUser(messages[i]) && text.indexOf('<letter>') !== -1 && text.indexOf('<initial_setup>') !== -1) return messages[i];
    }
    return null;
  }

  function chatLetter() {
    return findLetterMessage(getMessages('0-'));
  }

  function parseLetter(text) {
    var data = {};
    var labels = ['姓名', '年龄', '性别或称谓', '班级或身份', '外貌', '性格', '擅长与学业', '家庭背景', '重要物品', '开局心事', '当前开场', '自定义开局', '开局行动'];
    var stop = labels.concat(['连续性优先级']).join('|');
    var source = String(text || '');
    labels.forEach(function (label) {
      var re = new RegExp('(?:^|\\n)' + label + '[:：]\\s*([\\s\\S]*?)(?=\\r?\\n(?:' + stop + ')[:：]|\\r?\\n<\\/initial_setup>|$)');
      var match = source.match(re);
      if (match) data[label] = match[1].replace(/\s+$/, '').trim();
    });
    return data;
  }

  function setChatMessagesSafe(messages) {
    var fn = th('setChatMessages');
    if (!fn) throw new Error('未检测到 setChatMessages 接口，请确认酒馆助手已正确加载。');
    fn(messages, { refresh: 'affected' });
  }

  function checkPrimaryWorldbook() {
    var getNames = th('getWorldbookNames');
    var getCharNames = th('getCharWorldbookNames');
    if (!getNames || !getCharNames) {
      throw new Error('未检测到酒馆助手世界书接口，请确认酒馆助手已正确加载后再试。');
    }
    var primary = '';
    try { primary = ((getCharNames('current') || {}).primary) || ''; } catch (e) { /* noop */ }
    var names = [];
    try { names = getNames() || []; } catch (e) { /* noop */ }
    if (!primary || names.indexOf(primary) === -1) {
      throw new Error('角色卡的内嵌世界书「' + (primary || '暨阳中学v1.6') + '」尚未导入。请在角色管理中打开该角色，选择 Import Card Lore（导入卡内世界书）后重新确认。');
    }
    return primary;
  }

  // ---------- MVU ----------
  function mvuApi() {
    var candidates = [function () { return window.top && window.top.Mvu; }, function () { return window.parent && window.parent.Mvu; }, function () { return window.Mvu; }];
    for (var i = 0; i < candidates.length; i += 1) {
      try { var api = candidates[i](); if (api) return api; } catch (e) { /* noop */ }
    }
    return null;
  }

  function parseOpeningItems(text) {
    var raw = String(text || '').trim();
    if (!raw || raw === '未设定') return [];
    var items = [];
    var current = null;
    raw.split(/\r?\n/).forEach(function (line) {
      var value = line.trim();
      if (!value) return;
      var nameMatch = value.match(/^(?:名称|物品)[:：]\s*(.+)$/);
      var descMatch = value.match(/^描述[:：]\s*(.+)$/);
      if (nameMatch) {
        current = { 名称: nameMatch[1].trim(), 描述: '' };
        items.push(current);
      } else if (descMatch && current) {
        current.描述 = current.描述 ? current.描述 + ' ' + descMatch[1].trim() : descMatch[1].trim();
      } else if (!current) {
        current = { 名称: value, 描述: '' };
        items.push(current);
      } else if (!current.描述) {
        current.描述 = value;
      } else {
        current.描述 = current.描述 + ' ' + value;
      }
    });
    return items.filter(function (item) { return item.名称; });
  }

  function buildMvuPatches(formData, mode, scene) {
    var patches = [];
    if (mode === 'preset' && scene) {
      patches.push(['世界.日期', scene.date]);
      patches.push(['世界.星期', scene.week]);
      patches.push(['世界.时间段', scene.time]);
      patches.push(['世界.天气', scene.weather]);
      patches.push(['世界.当前位置', scene.location]);
      patches.push(['世界.所在区域', scene.area]);
      patches.push(['世界.私密程度', scene.privacy]);
      patches.push(['剧情.推进节奏', scene.pace]);
      patches.push(['剧情.当前事件', '']);
      patches.push(['剧情.校园活动', scene.schoolEvent || '无']);
      patches.push(['剧情.学期', scene.semester]);
      patches.push(['剧情.上次焦点角色', scene.focus]);
      patches.push(['主角.当前位置', scene.location]);
    }
    patches.push(['剧情.当前nsfw', false]);
    patches.push(['剧情.事件冷却', 0]);
    if (mode !== 'preset' || !scene) patches.push(['剧情.学期', '高二上']);

    patches.push(['主角.姓名', formData['姓名'] === '未设定' ? '' : formData['姓名']]);
    patches.push(['主角.年龄', formData['年龄'] === '未设定' ? '' : formData['年龄']]);
    patches.push(['主角.性别', formData['性别或称谓'] === '未设定' ? '' : formData['性别或称谓']]);
    patches.push(['主角.班级', formData['班级或身份'] === '未设定' ? '' : formData['班级或身份']]);
    patches.push(['主角.外貌', formData['外貌'] === '未设定' ? '' : formData['外貌']]);
    patches.push(['主角.性格', formData['性格'] === '未设定' ? '' : formData['性格']]);
    patches.push(['主角.擅长与学业', formData['擅长与学业'] === '未设定' ? '' : formData['擅长与学业']]);
    patches.push(['主角.家庭背景', formData['家庭背景'] === '未设定' ? '' : formData['家庭背景']]);
    patches.push(['主角.重要物品', parseOpeningItems(formData['重要物品'])]);

    if (mode === 'preset' && scene) {
      CHARACTER_NAMES.forEach(function (name) {
        var present = scene.present ? scene.present[name] : null;
        patches.push([name + '.是否在场', !!present]);
        patches.push([name + '.好感度', 0]);
        patches.push([name + '.关系阶段', '']);
        patches.push([name + '.NSFW', false]);
        patches.push([name + '.当前上装', present ? present.top : '']);
        patches.push([name + '.当前下装', present ? present.bottom : '']);
        patches.push([name + '.所在位置', present ? present.pos : '']);
        patches.push([name + '.动作', present ? present.action : '']);
        patches.push([name + '.心情', present ? present.mood : '']);
        patches.push([name + '.内心独白', present ? present.inner : '']);
        if (name === '沈幼楚') {
          patches.push(['沈幼楚.信任度', 0]);
          patches.push(['沈幼楚.触发家庭话题', false]);
        }
      });
    }
    return patches;
  }

  async function writeMvuOpening(formData, mode, scene) {
    var api = mvuApi();
    if (!api || typeof api.getCurrentMvuData !== 'function' || typeof api.setMvuVariable !== 'function') {
      toastrCall('error', '未检测到 MVU 变量接口，已跳过变量写入；请确认 MVU 已加载后再点确认。');
      return false;
    }
    var mvuData = null;
    try { mvuData = api.getCurrentMvuData(); } catch (e) { console.warn('[暨阳开局] getCurrentMvuData 失败', e); }
    if (!mvuData || !mvuData.stat_data) {
      try { mvuData = api.getMvuData({ type: 'message', message_id: 'latest' }); } catch (e) { /* noop */ }
    }
    if (!mvuData || !mvuData.stat_data) mvuData = { stat_data: {}, display_data: {}, delta_data: {} };
    var patches = buildMvuPatches(formData, mode, scene);
    for (var i = 0; i < patches.length; i += 1) {
      var pair = patches[i];
      try { await api.setMvuVariable(mvuData, pair[0], pair[1], { reason: '玩家开局设定' }); } catch (e) { console.warn('[暨阳开局] setMvuVariable 失败', pair[0], e); }
    }
    try {
      if (typeof api.replaceCurrentMvuData === 'function') await api.replaceCurrentMvuData(mvuData);
      else if (typeof api.replaceMvuData === 'function') await api.replaceMvuData(mvuData, { type: 'message', message_id: '0' });
      else throw new Error('MVU 接口缺少写入方法');
      return true;
    } catch (e) {
      toastrCall('error', '变量写入失败：' + (e && e.message ? e.message : e));
      return false;
    }
  }

  // ---------- 输入框 ----------
  function findInput() {
    var selectors = ['#send_textarea', 'textarea#send_textarea', 'textarea[placeholder*="输入"]', '[contenteditable="true"][role="textbox"]'];
    var docs = documentList();
    for (var d = 0; d < docs.length; d += 1) {
      for (var s = 0; s < selectors.length; s += 1) {
        try { var el = docs[d].querySelector(selectors[s]); if (el) return el; } catch (e) { /* noop */ }
      }
    }
    return null;
  }

  function findSendButton() {
    var docs = documentList();
    for (var d = 0; d < docs.length; d += 1) {
      try { var btn = docs[d].querySelector('#send_but'); if (btn) return btn; } catch (e) { /* noop */ }
    }
    return null;
  }

  function sendButtonUsable(btn) {
    if (!btn) return false;
    if (btn.disabled) return false;
    if (btn.classList && btn.classList.contains('displayNone')) return false;
    try { if (btn.offsetParent === null) return false; } catch (e) { /* noop */ }
    return true;
  }

  function writeInput(input, text) {
    input.focus();
    if ('value' in input) {
      var proto = Object.getPrototypeOf(input);
      var descriptor = proto && Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor && descriptor.set) descriptor.set.call(input, text); else input.value = text;
    } else { input.textContent = text; }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function snapshotDraft(input) {
    return {
      value: ('value' in input) ? input.value : input.textContent,
      start: input.selectionStart,
      end: input.selectionEnd
    };
  }

  function restoreDraft(input, draft) {
    if (!input || !draft) return;
    try {
      if ('value' in input) input.value = draft.value; else input.textContent = draft.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof draft.start === 'number' && typeof input.setSelectionRange === 'function') {
        input.setSelectionRange(draft.start, draft.end);
      }
    } catch (e) { console.warn('[暨阳开局] 恢复输入框草稿失败', e); }
  }

  function waitForLetter(timeout) {
    return new Promise(function (resolve) {
      var start = Date.now();
      function tick() {
        if (chatLetter()) { resolve(true); return; }
        if (Date.now() - start >= (timeout || 2800)) { resolve(false); return; }
        setTimeout(tick, 150);
      }
      setTimeout(tick, 120);
    });
  }

  // ---------- 开场消息 / 世界书（旧路径保留，默认关闭） ----------
  function worldbookProfile(data) {
    return [
      '<player_profile>',
      '以下内容是本次对话中 <user> 的唯一玩家档案。以它为准，不要用角色卡默认设定覆盖它。',
      '姓名: ' + data['姓名'],
      '年龄: ' + data['年龄'],
      '性别或称谓: ' + data['性别或称谓'],
      '班级或身份: ' + data['班级或身份'],
      '外貌: ' + data['外貌'],
      '性格: ' + data['性格'],
      '擅长与学业: ' + data['擅长与学业'],
      '家庭背景: ' + data['家庭背景'],
      '重要物品: ' + data['重要物品'],
      '',
      '互动规则:',
      '- 角色应通过具体互动逐渐认识 <user>，不要把未设定内容强加给 <user>。',
      '- 家庭背景与重要物品可以成为剧情线索，但不能替 <user> 自动做决定。',
      '- 用档案中的姓名称呼 <user>；保留 <user> 对自身行动、表达和选择的完全控制。',
      '</player_profile>'
    ].join('\n');
  }

  function legacySaveWorldbook(content) {
    var getCharNames = th('getCharWorldbookNames');
    var updateWorldbookWith = th('updateWorldbookWith');
    if (!getCharNames || !updateWorldbookWith) throw new Error('未检测到世界书接口，无法写入旧版档案。');
    var bookName = (getCharNames('current') || {}).primary;
    if (!bookName) throw new Error('未找到当前角色卡的主世界书。请确认角色卡已完整导入。');
    var entry = {
      name: LEGACY_ENTRY_NAME, enabled: true,
      strategy: { type: 'constant', keys: [], keys_secondary: { logic: 'and_any', keys: [] }, scan_depth: 'same_as_global' },
      position: { type: 'before_character_definition', role: 'system', depth: 0, order: 85 },
      content: content, probability: 100,
      recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
      effect: { sticky: null, cooldown: null, delay: null }
    };
    return updateWorldbookWith(bookName, function (entries) {
      return entries.filter(function (item) { return item.name !== LEGACY_ENTRY_NAME; }).concat([entry]);
    }, { render: 'immediate' }).then(function () { return bookName; });
  }

  function openingMessage(data, action, customOpening, selectedGreeting) {
    var lines = ['<initial_setup>', '以下是本次新角色的完整初始设定。请在本次开局中接住它，不要遗漏或替 <user> 自动补全未设定内容。', ''];
    lines.push('姓名: ' + data['姓名']);
    lines.push('年龄: ' + data['年龄']);
    lines.push('性别或称谓: ' + data['性别或称谓']);
    lines.push('班级或身份: ' + data['班级或身份']);
    lines.push('外貌: ' + data['外貌']);
    lines.push('性格: ' + data['性格']);
    lines.push('擅长与学业: ' + data['擅长与学业']);
    lines.push('家庭背景: ' + data['家庭背景']);
    lines.push('重要物品: ' + data['重要物品']);
    lines.push('开局心事: ' + data['开局心事']);
    lines.push('');
    lines.push('当前开场: ' + selectedGreeting);
    if (customOpening) lines.push('自定义开局: ' + customOpening);
    lines.push('开局行动: ' + action);
    lines.push('');
    lines.push('连续性优先级:');
    lines.push('- 如果初始变量中的日期、时间、地点、在场人物、衣着、关系或事件进度与所选开场白冲突，一律以开场白的描写为当前起点。');
    lines.push('- 在开场白之后承接本条消息，不要回退或重写已经发生的场景。');
    lines.push('</initial_setup>');
    return ['<letter>', lines.join('\n'), '</letter>'].join('\n');
  }

  // ---------- 预览 / 摘要 ----------
  function openPreview(root, index, text) {
    var preview = root.querySelector('[data-preview]');
    if (!preview) return;
    var title = preview.querySelector('[data-preview-title]');
    var content = preview.querySelector('[data-preview-content]');
    if (title) title.textContent = index + ' · ' + GREETING_NAMES[index] + ' · 开场白预览';
    if (content) content.textContent = text;
    preview.setAttribute('data-open', 'true');
    preview.setAttribute('aria-hidden', 'false');
  }

  function closePreview(root) {
    var preview = root.querySelector('[data-preview]');
    if (!preview) return;
    preview.setAttribute('data-open', 'false');
    preview.setAttribute('aria-hidden', 'true');
  }

  function summaryText(data, mode, index, action) {
    if (mode === 'custom') {
      return '姓名：' + data['姓名'] + '\n开局方式：自定义开局\n开局行动：' + action;
    }
    var scene = GREETING_SCENES[index];
    return '姓名：' + data['姓名'] + '\n开局：' + GREETING_NAMES[index] + '（' + (scene ? scene.location : '') + '）\n开局行动：' + action;
  }

  function renderSummary(root, data, mode, index, action) {
    var node = root.querySelector('[data-opening-summary-text]');
    if (node) node.textContent = summaryText(data, mode, index, action);
  }

  // ---------- 同步状态 ----------
  function syncRoot(root) {
    if (submitting || root.getAttribute('data-opening-state') === 'submitting') return;
    if (root.__jyUserEditing === true) return;
    var messages = getMessages('0-3');
    var messageZero = messages.length ? messageText(messages[0]) : '';
    var index = inferGreetingIndex(messageZero);
    if (index) setGreetingIndex(root, index);
    var letter = findLetterMessage(messages);
    if (letter) {
      var parsed = parseLetter(messageText(letter));
      fillForm(root, parsed);
      if (index) setMode(root, 'preset');
      else if (normalizeText(messageZero)) {
        setMode(root, 'custom');
        var customBox = root.querySelector('[data-custom-opening]');
        if (customBox) customBox.value = normalizeText(messageZero);
      }
      if (parsed['开局行动']) {
        var actionBox = root.querySelector('[data-opening-action]');
        if (actionBox) actionBox.value = parsed['开局行动'];
      }
      root.setAttribute('data-opening-state', 'complete');
      renderSummary(root, parsed, getMode(root), getGreetingIndex(root), parsed['开局行动'] || '（未记录）');
      var confirmBtn = root.querySelector('[data-action="confirm"]');
      if (confirmBtn) confirmBtn.disabled = false;
      closePreview(root);
    } else if (root.getAttribute('data-opening-state') !== 'editing') {
      root.setAttribute('data-opening-state', 'editing');
    }
  }

  function resetToEditing(root) {
    var messages = getMessages('0-3');
    var letter = findLetterMessage(messages);
    if (letter) fillForm(root, parseLetter(messageText(letter)));
    root.setAttribute('data-opening-state', 'editing');
    root.__jyUserEditing = true;
    closePreview(root);
    toast(root, '可以重新填写档案，再次确认只更新当前版本，不会重复发送开局消息。', 'info');
  }

  // ---------- 提交 ----------
  async function submitOpening(root) {
    if (submitting || root.getAttribute('data-opening-state') === 'submitting') return;
    if (root.getAttribute('data-opening-state') === 'complete') { root.setAttribute('data-opening-state', 'editing'); }

    var formData = readForm(root);
    var mode = getMode(root);
    var index = getGreetingIndex(root);
    var action = readText(root, '[data-opening-action]');
    var custom = mode === 'custom' ? readText(root, '[data-custom-opening]') : '';

    function fail(message) {
      submitting = false;
      setState(root, 'editing');
      root.__jyUserEditing = true;
      toast(root, message, 'error');
    }

    if (!formData['姓名'] || formData['姓名'] === '未设定') return fail('请先填写姓名。');
    if (!action) return fail('请先填写「你的开局动作」。');
    if (mode === 'custom' && !custom) return fail('选择自定义开局时，请填写开场正文。');

    var bookName = '';
    try { bookName = checkPrimaryWorldbook(); } catch (error) { return fail(error.message); }

    var greeting = '';
    if (mode === 'preset') {
      try { greeting = greetingTextAt(index).trim(); } catch (error) { /* noop */ }
      if (!greeting) return fail('未找到编号 ' + index + ' 的开场白，请重新导入完整角色卡后再试。');
    }
    var seedText = (mode === 'custom' ? custom : greeting) + '\n\n' + PLACEHOLDER;

    var input = findInput();
    var sendButton = findSendButton();
    if (!input) return fail('未找到酒馆输入框，请确认聊天界面已加载后重试。');
    if (!sendButtonUsable(sendButton)) return fail('酒馆发送按钮当前不可用（可能尚未连接模型后端），请连接后重试。');

    var messages = getMessages('0-3');
    var originalMessageZero = messages.length ? messageText(messages[0]) : PLACEHOLDER;
    var alreadySubmitted = !!findLetterMessage(messages);
    var draft = snapshotDraft(input);

    submitting = true;
    setState(root, 'submitting');
    toast(root, '正在写入开局设定…', 'info');

    try {
      await writeMvuOpening(formData, mode, mode === 'preset' ? GREETING_SCENES[index] : null);

      // 先把开场写进首楼，保证模型生成第一回应时能看到开场场景
      setChatMessagesSafe([{ message_id: 0, message: seedText }]);

      if (!alreadySubmitted) {
        var letter = openingMessage(formData, action, custom, mode === 'custom' ? '自定义开局' : GREETING_NAMES[index]);
        writeInput(input, letter);
        sendButton.click();
        var sent = await waitForLetter(2800);
        if (!sent) {
          try { setChatMessagesSafe([{ message_id: 0, message: originalMessageZero || PLACEHOLDER }]); } catch (e) { /* noop */ }
          restoreDraft(input, draft);
          throw new Error('开局消息没有发送成功，请检查酒馆是否已连接模型后端后重试。');
        }
      }

      if (WRITE_LEGACY_WORLDBOOK) {
        try { await legacySaveWorldbook(worldbookProfile(formData)); } catch (error) { console.warn('[暨阳开局] 旧版世界书写入失败', error); }
      }

      root.__jyUserEditing = false;
      root.setAttribute('data-opening-state', 'complete');
      renderSummary(root, formData, mode, index, action);
      toast(root, '档案已写入' + (bookName ? '「' + bookName + '」' : '') + '，故事开始。', 'info');
    } catch (error) {
      setState(root, 'editing');
      root.__jyUserEditing = true;
      restoreDraft(input, draft);
      toast(root, (error && error.message) ? error.message : '开局提交失败，请重试。', 'error');
    } finally {
      submitting = false;
    }
  }

  // ---------- 事件 ----------
  function handleClick(root, event) {
    var target = event.target && event.target.closest ? event.target.closest('[data-action]') : null;
    if (!target || !root.contains(target)) return;
    var action = target.getAttribute('data-action');
    if (action === 'select-mode') {
      event.preventDefault();
      root.__jyUserEditing = true;
      setMode(root, target.getAttribute('data-mode'));
    } else if (action === 'select-greeting') {
      event.preventDefault();
      root.__jyUserEditing = true;
      var index = Number(target.getAttribute('data-greeting')) || 1;
      setGreetingIndex(root, index);
      var text = greetingTextAt(index);
      if (text) openPreview(root, index, text);
      else toast(root, '未找到该开场白文本，请重新导入完整角色卡。', 'error');
    } else if (action === 'clear') {
      event.preventDefault();
      root.__jyUserEditing = true;
      fieldElements(root).forEach(function (el) {
        var key = el.getAttribute('data-field');
        var next = DEFAULT_FIELDS[key] || '';
        if ('value' in el) el.value = next; else el.textContent = next;
      });
      var customBox = root.querySelector('[data-custom-opening]');
      if (customBox) customBox.value = '';
      var actionBox = root.querySelector('[data-opening-action]');
      if (actionBox) actionBox.value = '';
      toast(root, '已清空表单，可重新填写。', 'info');
    } else if (action === 'close-preview' || action === 'use-preview') {
      event.preventDefault();
      closePreview(root);
    } else if (action === 'reset-opening') {
      event.preventDefault();
      resetToEditing(root);
    }
  }

  function handleSubmit(root, event) {
    if (!event.target || !root.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    submitOpening(root);
  }

  function bindRoot(root) {
    if (root.__jyOpeningBoundV7) return;
    root.__jyOpeningBoundV7 = true;
    activeRoot = root;
    var onClick = function (event) { handleClick(root, event); };
    var onSubmit = function (event) { handleSubmit(root, event); };
    root.addEventListener('click', onClick);
    root.addEventListener('submit', onSubmit);
    cleanups.push(function () { root.removeEventListener('click', onClick); root.removeEventListener('submit', onSubmit); root.__jyOpeningBoundV7 = false; });
    syncRoot(root);
  }

  function bindAll() {
    rootList().forEach(function (root) {
      if (!root.__jyOpeningBoundV7) bindRoot(root);
      else syncRoot(root);
    });
  }

  function scheduleBind() {
    timers.push(setTimeout(bindAll, 120));
  }

  function start() {
    var roots = rootList();
    if (roots.length) bindAll();
    // 聊天/消息异步渲染：定时补绑 + DOM 观察
    timers.push(setTimeout(function () { bindAll(); }, 400));
    timers.push(setTimeout(function () { bindAll(); }, 1400));
    documentList().forEach(function (doc) {
      try {
        if (!doc || !doc.documentElement) return;
        var mo = new MutationObserver(scheduleBind);
        mo.observe(doc.documentElement, { childList: true, subtree: true });
        cleanups.push(function () { mo.disconnect(); });
      } catch (e) { /* noop */ }
    });
    try {
      if (window.parent && window.parent !== window) {
        window.parent.addEventListener('pagehide', stop, { once: true });
        cleanups.push(function () { window.parent.removeEventListener('pagehide', stop); });
      }
    } catch (e) { /* noop */ }
    console.info('[暨阳开局/V7] 已加载：MVU 变量写入 + 防重复提交 + 完成态摘要。');
  }

  window[GLOBAL_KEY] = { stop: stop, bind: bindAll };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
