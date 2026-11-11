(function () {
  'use strict';

  // V5 兼容层：只做旧界面的「样式补偿」。
  // 预览、选中态、提交等交互全部由 脚本/开局设定按钮绑定脚本.js（V7）负责，
  // 本文件不再绑定 pointerup / click，也不再调用 showPreview，避免双控制器竞态。
  var ROOT_SELECTOR = '[data-jy-opening]';
  var GLOBAL_KEY = '__jiyangOpeningCompatV5';
  var observer = null;
  var timer = null;

  function stop() {
    if (observer) { try { observer.disconnect(); } catch (e) { /* noop */ } observer = null; }
    if (timer) { clearTimeout(timer); timer = null; }
  }

  try { if (window[GLOBAL_KEY] && typeof window[GLOBAL_KEY].stop === 'function') window[GLOBAL_KEY].stop(); } catch (e) { /* noop */ }

  function windowList() {
    var out = [];
    function add(w) { if (w && out.indexOf(w) === -1) out.push(w); }
    add(window);
    try { add(window.parent); } catch (e) { /* noop */ }
    try { add(window.top); } catch (e) { /* noop */ }
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

  function modeOf(root) {
    var mode = root.getAttribute('data-opening-mode');
    if (mode === 'preset' || mode === 'custom') return mode;
    var legacyActive = root.querySelector('[data-action="select-mode"].is-active');
    return legacyActive && legacyActive.getAttribute('data-mode') === 'custom' ? 'custom' : 'preset';
  }

  function greetingIndexOf(root) {
    var index = Number(root.getAttribute('data-greeting-index'));
    if (Number.isFinite(index) && index >= 1) return index;
    var legacyActive = root.querySelector('[data-action="select-greeting"].is-active');
    return legacyActive ? Number(legacyActive.getAttribute('data-greeting')) || 1 : 1;
  }

  // 仅当界面还是旧结构（没有 data-opening-state）时才补偿内联样式；
  // 新界面完全由 CSS 属性选择器控制，不需要也不应该再写内联样式。
  function syncLegacyStyles(root) {
    if (!root || root.getAttribute('data-opening-state')) return;
    var mode = modeOf(root);
    root.querySelectorAll('[data-action="select-mode"]').forEach(function (button) {
      var active = button.getAttribute('data-mode') === mode;
      button.style.background = active ? '#237b6c' : '#fff';
      button.style.color = active ? '#fff' : '#65736c';
    });
    root.querySelectorAll('[data-mode-panel]').forEach(function (panel) {
      panel.style.display = panel.getAttribute('data-mode-panel') === mode ? 'block' : 'none';
    });
    var index = greetingIndexOf(root);
    root.querySelectorAll('[data-action="select-greeting"]').forEach(function (button) {
      var active = Number(button.getAttribute('data-greeting')) === index;
      button.style.borderColor = active ? '#237b6c' : '#cbd8d1';
      button.style.background = active ? '#dceee7' : '#fff';
    });
    var preview = root.querySelector('[data-preview]');
    if (preview) {
      var open = preview.getAttribute('data-open') === 'true' || preview.classList.contains('is-open') || preview.getAttribute('aria-hidden') === 'false';
      preview.style.display = open ? 'grid' : 'none';
    }
  }

  function syncAll() {
    rootList().forEach(syncLegacyStyles);
  }

  function scheduleSync() {
    if (timer) return;
    timer = setTimeout(function () { timer = null; syncAll(); }, 120);
  }

  function start() {
    syncAll();
    documentList().forEach(function (doc) {
      try {
        if (!doc || !doc.documentElement || observer) return;
        observer = new MutationObserver(scheduleSync);
        observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-hidden', 'data-opening-mode', 'data-greeting-index', 'data-opening-state'] });
      } catch (e) { /* noop */ }
    });
    setTimeout(syncAll, 400);
    setTimeout(syncAll, 1400);
    console.info('[暨阳开局/V5] 兼容层已加载（仅样式补偿，交互由 V7 绑定脚本负责）。');
  }

  window[GLOBAL_KEY] = { stop: stop, sync: syncAll };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
