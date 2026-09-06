(function (global) {
  'use strict';

  var SUMMARY_COUNT = 3;

  function BattleLogUI(containerSelector) {
    this.container = document.querySelector(containerSelector || '#battle-log');
    this.rendered = 0;
    this.expanded = false;
    this._build();
  }

  BattleLogUI.prototype._build = function () {
    if (!this.container) return;
    this.container.innerHTML = '';

    this.summaryEl = document.createElement('span');
    this.summaryEl.className = 'log-summary';

    this.toggleBtn = document.createElement('button');
    this.toggleBtn.type = 'button';
    this.toggleBtn.className = 'log-toggle';
    this.toggleBtn.textContent = 'ログ';

    this.fullEl = document.createElement('div');
    this.fullEl.className = 'log-full';
    this.fullEl.style.display = 'none';

    this.container.appendChild(this.summaryEl);
    this.container.appendChild(this.toggleBtn);
    this.container.appendChild(this.fullEl);

    var self = this;
    this.toggleBtn.addEventListener('click', function () {
      self.expanded = !self.expanded;
      self.fullEl.style.display = self.expanded ? 'block' : 'none';
      self.toggleBtn.textContent = self.expanded ? '閉じる' : 'ログ';
      self.summaryEl.style.display = self.expanded ? 'none' : '';
      self._updateSummary();
      if (self.expanded) {
        self.fullEl.scrollTop = self.fullEl.scrollHeight;
      }
    });
  };

  BattleLogUI.prototype._createEntry = function (entry) {
    var row = document.createElement('div');
    row.className = 'log-entry';
    var turnTag = document.createElement('span');
    turnTag.className = 'log-turn';
    turnTag.textContent = 'T' + entry.turnNumber;
    var text = document.createElement('span');
    text.className = 'log-text';
    text.textContent = entry.text;
    row.appendChild(turnTag);
    row.appendChild(text);
    return row;
  };

  BattleLogUI.prototype._updateSummary = function () {
    if (this.expanded) {
      this.summaryEl.style.display = 'none';
      return;
    }
    this.summaryEl.style.display = '';
    var log = this._fullLog || [];
    this.summaryEl.innerHTML = '';
    var start = Math.max(0, log.length - SUMMARY_COUNT);
    for (var i = start; i < log.length; i++) {
      this.summaryEl.appendChild(this._createEntry(log[i]));
    }
  };

  BattleLogUI.prototype.render = function (state) {
    if (!this.container) { return; }
    var log = state.battleLog;
    if (log.length === this.rendered) { return; }

    if (!this._fullLog) this._fullLog = [];

    for (var i = this.rendered; i < log.length; i++) {
      var entry = log[i];
      this._fullLog.push(entry);
      this.fullEl.appendChild(this._createEntry(entry));
    }
    this.rendered = log.length;

    this._updateSummary();
    if (this.expanded) {
      this.fullEl.scrollTop = this.fullEl.scrollHeight;
    }
  };

  BattleLogUI.prototype.clear = function () {
    this._fullLog = [];
    if (this.container) {
      this.summaryEl.innerHTML = '';
      this.fullEl.innerHTML = '';
    }
    this.rendered = 0;
    this.expanded = false;
    if (this.fullEl) this.fullEl.style.display = 'none';
    if (this.toggleBtn) this.toggleBtn.textContent = 'ログ';
  };

  global.BattleLogUI = BattleLogUI;
})(typeof window !== 'undefined' ? window : globalThis);
