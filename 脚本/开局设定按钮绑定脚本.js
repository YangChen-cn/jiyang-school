(() => {
  const ROOT_SELECTOR = '[data-jy-opening]';
  const ENTRY_NAME = '玩家开局设定';
  const GLOBAL_KEY = '__jiyangOpeningSetupControllerV5';
  const cleanups = [];

  try { window[GLOBAL_KEY]?.stop?.(); } catch (_) {}
  window[GLOBAL_KEY] = {
    stop() {
      while (cleanups.length) {
        try { cleanups.pop()(); } catch (_) {}
      }
    }
  };

  function windows() {
    const windows = [];
    const add = win => { if (win && !windows.includes(win)) windows.push(win); };
    add(window);
    try { add(window.parent); } catch (_) {}
    try { add(window.top); } catch (_) {}
    windows.slice().forEach(win => {
      try { Array.from(win.document.querySelectorAll('iframe')).forEach(frame => add(frame.contentWindow)); } catch (_) {}
    });
    return windows;
  }

  function documents() {
    return windows().flatMap(win => {
      try { return win.document ? [win.document] : []; } catch (_) { return []; }
    });
  }

  function roots() {
    return documents().flatMap(doc => Array.from(doc.querySelectorAll(ROOT_SELECTOR)));
  }

  function fields(root) {
    return Array.from(root.querySelectorAll('[data-field]'));
  }

  function value(field) {
    return String(field.value || '').trim();
  }

  function toast(root, message, kind = 'success') {
    const node = root.querySelector('[data-toast]');
    if (node) {
      node.textContent = message;
      node.classList.add('is-visible');
      clearTimeout(root._openingToastTimer);
      root._openingToastTimer = setTimeout(() => node.classList.remove('is-visible'), 3200);
    }
    try {
      if (kind === 'error') toastr.error(message);
      else if (kind === 'info') toastr.info(message);
      else toastr.success(message);
    } catch (_) {}
  }

  function openingData(root) {
    return Object.fromEntries(fields(root).map(field => [field.dataset.field, value(field) || '未设定']));
  }

  function mode(root) { return root.dataset.openingMode || 'preset'; }
  function greetingIndex(root) { return Number(root.dataset.greetingIndex || 1); }

  const GREETING_NAMES = ['开局设定界面', '开学第一天', '慕佳芊', '苏晓樯', '温书语', '沈幼楚', '凌知夏', '陈芷汀', '虞淑婉'];

  function openingContent(data) {
    return [
      '<player_opening_profile>',
      '以下内容是本次对话中 <user> 的唯一玩家档案。以它为准，不要用角色卡默认设定覆盖它。',
      '',
      `姓名: ${data.姓名}`,
      `年龄: ${data.年龄}`,
      `性别或称谓: ${data.性别或称谓}`,
      `班级或身份: ${data.班级或身份}`,
      `外貌: ${data.外貌}`,
      `性格: ${data.性格}`,
      `擅长与学业: ${data.擅长与学业}`,
      `家庭背景: ${data.家庭背景}`,
      `重要物品: ${data.重要物品}`,
      `开局心事: ${data.开局心事}`,
      '',
      '互动规则:',
      '- 角色应通过具体互动逐渐认识 <user>，不要把未设定内容强加给 <user>。',
      '- 家庭背景、物品与开局心事可以成为剧情线索，但不能替 <user> 自动做决定。',
      '- 用档案中的姓名称呼 <user>；保留 <user> 对自身行动、表达和选择的完全控制。',
      '</player_opening_profile>'
    ].join('\n');
  }

  function worldbookEntry(content) {
    return {
      name: ENTRY_NAME,
      enabled: true,
      strategy: { type: 'constant', keys: [], keys_secondary: { logic: 'and_any', keys: [] }, scan_depth: 'same_as_global' },
      position: { type: 'before_character_definition', role: 'system', depth: 0, order: 85 },
      content,
      probability: 100,
      recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
      effect: { sticky: null, cooldown: null, delay: null }
    };
  }

  async function saveProfile(content) {
    const bookName = getCharWorldbookNames('current')?.primary;
    if (!bookName) throw new Error('未找到当前角色卡的主世界书。请确认角色卡已完整导入。');

    await updateWorldbookWith(bookName, entries => {
      const profile = worldbookEntry(content);
      const exists = entries.some(entry => entry.name === ENTRY_NAME);
      return exists
        ? entries.map(entry => entry.name === ENTRY_NAME ? { ...entry, ...profile } : entry)
        : [...entries, profile];
    }, { render: 'immediate' });

    return bookName;
  }

  function findInput() {
    const selectors = ['#send_textarea', 'textarea#send_textarea', 'textarea[placeholder*="输入"]', '[contenteditable="true"][role="textbox"]'];
    for (const doc of documents()) {
      for (const selector of selectors) {
        const node = doc.querySelector(selector);
        if (node && !node.disabled && !node.readOnly) return node;
      }
    }
    return null;
  }

  function writeInput(message) {
    const input = findInput();
    if (!input) return false;
    input.focus();
    if ('value' in input) input.value = message;
    else input.textContent = message;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function presetGreeting(character, displayIndex) {
    const alternateSources = [
      character?.alternate_greetings,
      character?.data?.alternate_greetings
    ];
    for (const source of alternateSources) {
      const greeting = source?.[displayIndex - 1];
      if (typeof greeting === 'string' && greeting.trim()) return greeting;
    }

    const legacySources = [
      character?.first_messages,
      character?.data?.first_messages
    ];
    for (const source of legacySources) {
      if (!Array.isArray(source)) continue;
      // Legacy payloads reserve first_messages[0] for the opening UI.
      const greeting = source[displayIndex];
      if (typeof greeting === 'string' && greeting.trim()) return greeting;
    }
    return '';
  }

  async function applyPresetGreeting(root) {
    const character = await getCharacter('current');
    const index = greetingIndex(root);
    const greeting = presetGreeting(character, index);
    if (!greeting) throw new Error(`未找到编号 ${index} 的开场白。请重新导入完整角色卡。`);
    const cleanGreeting = greeting.trim();
    await setChatMessages([{ message_id: 0, message: cleanGreeting }], { refresh: 'affected' });
  }

  function closePreview(root) {
    const preview = root.querySelector('[data-preview]');
    if (!preview) return;
    preview.classList.remove('is-open');
    preview.setAttribute('aria-hidden', 'true');
    root._previewGreeting = null;
  }

  async function previewGreeting(root, index) {
    try {
      const character = await getCharacter('current');
      const greeting = presetGreeting(character, index);
      if (!greeting) throw new Error(`未找到编号 ${index} 的开场白。请重新导入完整角色卡。`);
      const preview = root.querySelector('[data-preview]');
      root._previewGreeting = index;
      preview.querySelector('[data-preview-title]').textContent = `${index} · ${GREETING_NAMES[index]} · 开场白预览`;
      preview.querySelector('[data-preview-content]').textContent = greeting.trim();
      preview.classList.add('is-open');
      preview.setAttribute('aria-hidden', 'false');
    } catch (error) {
      console.error('[jiyang-opening]', error);
      toast(root, error.message || String(error), 'error');
    }
  }

  function sendOpening(message) {
    if (!writeInput(message)) throw new Error('档案已写入世界书，但未找到输入框。请手动发送任意开局行动。');
    const button = documents().map(doc => doc.querySelector('#send_but')).find(Boolean);
    if (button && !button.disabled) setTimeout(() => button.click(), 80);
  }

  async function submit(root) {
    const data = openingData(root);
    const action = String(root.querySelector('[data-opening-action]')?.value || '').trim();
    const customOpening = String(root.querySelector('[data-custom-opening]')?.value || '').trim();
    if (data.姓名 === '未设定') {
      toast(root, '请先填写姓名。', 'error');
      root.querySelector('[data-field="姓名"]')?.focus();
      return;
    }
    if (!action) {
      toast(root, '请写下你的开局动作。', 'error');
      root.querySelector('[data-opening-action]')?.focus();
      return;
    }
    if (mode(root) === 'custom' && !customOpening) {
      toast(root, '请写下自定义开局。', 'error');
      root.querySelector('[data-custom-opening]')?.focus();
      return;
    }

    try {
      toast(root, '正在写入本次开局档案…', 'info');
      const bookName = await saveProfile(openingContent(data));
      if (mode(root) === 'preset') await applyPresetGreeting(root);
      root.dataset.complete = 'true';
      const message = mode(root) === 'custom'
        ? `【自定义开局】\n${customOpening}\n\n【我的动作】\n${action}`
        : action;
      sendOpening(message);
      toast(root, `档案已写入「${bookName}」，故事开始。`);
    } catch (error) {
      console.error('[jiyang-opening]', error);
      toast(root, error.message || String(error), 'error');
    }
  }

  function clear(root) {
    fields(root).forEach(field => {
      field.value = field.dataset.field === '年龄' ? '17岁' : field.dataset.field === '班级或身份' ? '暨阳中学高二重点班学生' : '';
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
    root.querySelector('[data-opening-action]').value = '';
    root.querySelector('[data-custom-opening]').value = '';
    root.dataset.complete = 'false';
    toast(root, '已恢复为空白档案。');
  }

  async function handleClick(event) {
    const root = event.target.closest?.(ROOT_SELECTOR);
    if (!root) return;
    event.stopImmediatePropagation();
    if (event.target.matches?.('[data-preview]')) {
      closePreview(root);
      return;
    }
    const button = event.target.closest('[data-jy-opening] [data-action]');
    if (!button) return;
    event.preventDefault();
    if (button.dataset.action === 'clear') clear(root);
    if (button.dataset.action === 'confirm') submit(root);
    if (button.dataset.action === 'select-mode') {
      root.dataset.openingMode = button.dataset.mode;
      root.querySelectorAll('[data-action="select-mode"]').forEach(node => node.classList.toggle('is-active', node === button));
      root.querySelectorAll('[data-mode-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.modePanel === button.dataset.mode));
    }
    if (button.dataset.action === 'select-greeting') {
      root.dataset.greetingIndex = String(button.dataset.greeting);
      root.querySelectorAll('[data-action="select-greeting"]').forEach(node => node.classList.toggle('is-active', node === button));
      await previewGreeting(root, Number(button.dataset.greeting));
    }
    if (button.dataset.action === 'use-preview' && Number.isInteger(root._previewGreeting)) {
      root.dataset.greetingIndex = String(root._previewGreeting);
      const selected = root.querySelector(`[data-action="select-greeting"][data-greeting="${root.dataset.greetingIndex}"]`);
      root.querySelectorAll('[data-action="select-greeting"]').forEach(node => node.classList.toggle('is-active', node === selected));
      closePreview(root);
    }
    if (button.dataset.action === 'close-preview') {
      closePreview(root);
    }
  }

  function handleSubmit(event) {
    const root = event.target.closest?.(ROOT_SELECTOR);
    if (!root) return;
    event.stopImmediatePropagation();
    event.preventDefault();
    submit(root);
  }

  function bind() {
    windows().forEach(win => {
      if (win.__jiyangOpeningBoundV5) return;
      win.__jiyangOpeningBoundV5 = true;
      win.addEventListener('click', handleClick, true);
      win.addEventListener('submit', handleSubmit, true);
      cleanups.push(() => {
        win.removeEventListener('click', handleClick, true);
        win.removeEventListener('submit', handleSubmit, true);
        try { delete win.__jiyangOpeningBoundV5; } catch (_) { win.__jiyangOpeningBoundV5 = false; }
      });
    });
  }

  bind();
  setTimeout(bind, 400);
  setTimeout(bind, 1400);
  try {
    const observer = new MutationObserver(bind);
    documents().forEach(doc => observer.observe(doc.documentElement, { childList: true, subtree: true }));
    cleanups.push(() => observer.disconnect());
  } catch (_) {}
})();
