(function (global) {
  'use strict';

  // CPU行動通知Toast: 盤面を邪魔しない小型フローティング通知。
  // Battle Logとは独立した一時表示のみを担う（履歴は Battle Log 側に残す）。

  var HIDE_DELAY = 1000; // 表示保持時間 (ms) — フェードアウトは CSS transition

  var timer = null;

  function show(el, msg) {
    if (!el) return;
    el.textContent = msg;
    if (typeof el.style !== 'undefined' && el.style) { el.style.display = ''; }
    if (el.classList) { el.classList.add('is-visible'); }
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(function () {
      timer = null;
      if (el.classList) { el.classList.remove('is-visible'); }
    }, HIDE_DELAY);
  }

  function hide(el) {
    if (!el) return;
    if (el.classList) { el.classList.remove('is-visible'); }
    if (timer) { clearTimeout(timer); }
    timer = null;
  }

  global.CpuToast = { show: show, hide: hide, HIDE_DELAY: HIDE_DELAY };
})(typeof window !== 'undefined' ? window : globalThis);