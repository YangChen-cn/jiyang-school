(() => {
  const ROOT_SELECTOR = '[data-jy-opening]';
  const KEY = '__jiyangOpeningCompatV4';
  const cleanups = [];
  const names = ['开学第一天', '慕佳芊', '苏晓樯', '温书语', '沈幼楚', '凌知夏', '陈芷汀', '虞淑婉'];

  try { window[KEY]?.stop?.(); } catch (_) {}
  window[KEY] = {
    stop() {
      while (cleanups.length) {
        try { cleanups.pop()(); } catch (_) {}
      }
    }
  };

  function windows() {
    const result = [];
    const add = win => { if (win && !result.includes(win)) result.push(win); };
    add(window);
    try { add(window.parent); } catch (_) {}
    try { add(window.top); } catch (_) {}
    return result;
  }

  function sync(root) {
    const activeMode = root.dataset.openingMode
      || root.querySelector('[data-action="select-mode"].is-active')?.dataset.mode
      || 'preset';

    root.querySelectorAll('[data-action="select-mode"]').forEach(button => {
      const active = button.dataset.mode === activeMode;
      button.classList.toggle('is-active', active);
      button.style.setProperty('background', active ? '#237b6c' : '#ffffff', 'important');
      button.style.setProperty('color', active ? '#ffffff' : '#65736c', 'important');
    });

    root.querySelectorAll('[data-mode-panel]').forEach(panel => {
      const active = panel.dataset.modePanel === activeMode;
      panel.classList.toggle('is-active', active);
      panel.style.setProperty('display', active ? 'block' : 'none', 'important');
    });

    const selectedGreeting = String(root.dataset.greetingIndex || '0');
    root.querySelectorAll('[data-action="select-greeting"]').forEach(button => {
      const active = button.dataset.greeting === selectedGreeting;
      button.classList.toggle('is-active', active);
      button.style.setProperty('background', active ? '#237b6c' : '#ffffff', 'important');
      button.style.setProperty('border-color', active ? '#237b6c' : '#cbd8d1', 'important');
      button.querySelectorAll('.jy-opening-scene-number, .jy-opening-scene-name, .jy-opening-scene-note').forEach(node => {
        node.style.setProperty('color', active ? '#ffffff' : '', active ? 'important' : '');
      });
    });

    const preview = root.querySelector('[data-preview]');
    if (preview) {
      const open = preview.classList.contains('is-open') || preview.getAttribute('aria-hidden') === 'false';
      preview.style.setProperty('display', open ? 'grid' : 'none', 'important');
    }
  }

  function roots(win) {
    try { return Array.from(win.document.querySelectorAll(ROOT_SELECTOR)); } catch (_) { return []; }
  }

  function syncAll() {
    windows().forEach(win => roots(win).forEach(sync));
  }

  async function showPreview(root, index) {
    const preview = root.querySelector('[data-preview]');
    if (!preview) return;
    const title = preview.querySelector('[data-preview-title]');
    const content = preview.querySelector('[data-preview-content]');

    try {
      if (typeof getCharacter !== 'function') throw new Error('酒馆助手未提供 getCharacter，无法读取预写开场白。');
      const character = await getCharacter('current');
      const greeting = character?.first_messages?.[index + 1];
      if (!greeting) throw new Error(`未找到编号 ${index} 的开场白。请重新导入完整角色卡。`);
      root._previewGreeting = index;
      if (title) title.textContent = `${index} · ${names[index]} · 开场白预览`;
      if (content) content.textContent = greeting.trim();
    } catch (error) {
      console.error('[暨阳开局/V4]', error);
      if (title) title.textContent = '开场白预览暂不可用';
      if (content) content.textContent = error.message || String(error);
    }

    preview.classList.add('is-open');
    preview.setAttribute('aria-hidden', 'false');
    sync(root);
  }

  function bind(win) {
    if (win.__jiyangOpeningCompatBoundV4) return;
    win.__jiyangOpeningCompatBoundV4 = true;

    const onPointerUp = event => {
      const root = event.target.closest?.(ROOT_SELECTOR);
      const button = event.target.closest?.('[data-jy-opening] [data-action="select-greeting"]');
      if (root && button) {
        root.dataset.greetingIndex = String(button.dataset.greeting);
        sync(root);
        showPreview(root, Number(button.dataset.greeting));
      }
    };
    win.addEventListener('pointerup', onPointerUp, true);
    cleanups.push(() => {
      win.removeEventListener('pointerup', onPointerUp, true);
      try { delete win.__jiyangOpeningCompatBoundV4; } catch (_) { win.__jiyangOpeningCompatBoundV4 = false; }
    });

    try {
      const observer = new win.MutationObserver(syncAll);
      observer.observe(win.document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['class', 'aria-hidden', 'data-opening-mode']
      });
      cleanups.push(() => observer.disconnect());
    } catch (_) {}
  }

  windows().forEach(bind);
  syncAll();
  setTimeout(() => { windows().forEach(bind); syncAll(); }, 400);
  setTimeout(() => { windows().forEach(bind); syncAll(); }, 1400);
  console.info('[暨阳开局/V4] 旧界面兼容层已加载');
})();
