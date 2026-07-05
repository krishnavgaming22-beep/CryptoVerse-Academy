/**
 * CryptoVerse Academy — User Profile & Progress
 * ===============================================
 * Profile header with editable name, stats grid,
 * learning progress bars, activity feed, settings,
 * and downloadable text report.
 *
 * Dependencies: window.Store, window.Utils, window.UI
 */
window.Pages = window.Pages || {};

window.Pages.profile = function () {
  'use strict';

  var userName = (window.Store && window.Store.getUserName) ? window.Store.getUserName() : 'CryptoLearner';
  var totalXp = (window.Store && window.Store.getXP) ? window.Store.getXP() : 0;
  var level = (window.Store && window.Store.getLevel) ? window.Store.getLevel() : 1;
  var joinDate = (window.Store && window.Store.getJoinDate) ? window.Store.getJoinDate() : 'January 2024';
  var quizAccuracy = (window.Store && window.Store.getQuizAccuracy) ? window.Store.getQuizAccuracy() : 0;
  var tradesMade = (window.Store && window.Store.getTradesCount) ? window.Store.getTradesCount() : 0;
  var portfolioReturn = (window.Store && window.Store.getPortfolioReturn) ? window.Store.getPortfolioReturn() : 0;
  var modulesCompleted = (window.Store && window.Store.getModulesCompleted) ? window.Store.getModulesCompleted() : 0;

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  var modules = [
    { id: 'history',   name: 'History of Money',           pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('history') || 0) : 0 },
    { id: 'blockchain',name: 'Blockchain Explained',       pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('blockchain') || 0) : 0 },
    { id: 'bitcoin',   name: 'How Bitcoin Works',          pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('bitcoin') || 0) : 0 },
    { id: 'academy',   name: 'Teen Investor Academy',      pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('academy') || 0) : 0 },
    { id: 'scams',     name: 'Scam Awareness',             pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('scams') || 0) : 0 },
    { id: 'challenge', name: 'Final Challenge',            pct: (window.Store && window.Store.getModuleProgress) ? (window.Store.getModuleProgress('challenge') || 0) : 0 }
  ];

  /* Recent activity placeholder */
  var activities = (window.Store && window.Store.getRecentActivity) ? window.Store.getRecentActivity() : [
    { type: 'lesson',  text: 'Completed "Risk vs Reward" lesson',      time: '2 hours ago' },
    { type: 'quiz',    text: 'Scored 85% on Blockchain quiz',          time: '3 hours ago' },
    { type: 'trade',   text: 'Bought 0.05 BTC at $67,200',            time: '5 hours ago' },
    { type: 'achieve', text: 'Unlocked "First Trade" achievement',    time: '5 hours ago' },
    { type: 'lesson',  text: 'Completed "Diversification" lesson',     time: '1 day ago' },
    { type: 'trade',   text: 'Sold 2 ETH at $3,450',                   time: '1 day ago' },
    { type: 'lesson',  text: 'Explored "Healthcare" blockchain app',   time: '2 days ago' },
    { type: 'quiz',    text: 'Scored 100% on History of Money quiz',   time: '2 days ago' },
    { type: 'achieve', text: 'Unlocked "History Buff" achievement',    time: '2 days ago' },
    { type: 'trade',   text: 'Bought 10 SOL at $145',                  time: '3 days ago' }
  ];

  var activityIcons = { lesson: '\uD83D\uDCDA', quiz: '\uD83C\uDFAF', trade: '\uD83D\uDCC8', achieve: '\uD83C\uDFC6' };

  var html = '<style>' +
    '.prof-page{max-width:860px;margin:0 auto;padding:24px}' +
    /* Profile Header */
    '.prof-header{display:flex;align-items:center;gap:20px;margin-bottom:28px;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:16px;padding:24px;flex-wrap:wrap}' +
    '.prof-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 4px 20px rgba(139,92,246,.3)}' +
    '.prof-info{flex:1;min-width:200px}' +
    '.prof-name-row{display:flex;align-items:center;gap:10px;margin-bottom:4px}' +
    '.prof-name{font-size:1.35rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0}' +
    '.prof-edit-name{background:transparent;border:none;color:var(--accent,#8b5cf6);cursor:pointer;font-size:.8rem;padding:2px 8px;border-radius:4px;transition:background .2s}' +
    '.prof-edit-name:hover{background:rgba(139,92,246,.1)}' +
    '.prof-name-input{background:var(--bg-surface,#0f172a);border:1px solid var(--accent,#8b5cf6);color:var(--text-primary,#e2e8f0);padding:4px 10px;border-radius:6px;font-size:1rem;font-weight:600;outline:none;display:none}' +
    '.prof-name-input.active{display:inline-block}' +
    '.prof-meta{font-size:.8rem;color:var(--text-muted,#64748b);margin:0}' +
    '.prof-level-badge{display:inline-block;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;padding:3px 12px;border-radius:20px;font-size:.75rem;font-weight:700;margin-left:8px}' +
    /* Stats Grid */
    '.prof-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px}' +
    '.prof-stat{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:16px;text-align:center}' +
    '.prof-stat .stat-val{font-size:1.4rem;font-weight:700;color:var(--accent,#8b5cf6);line-height:1.2}' +
    '.prof-stat .stat-label{font-size:.7rem;color:var(--text-muted,#64748b);text-transform:uppercase;letter-spacing:.05em;margin-top:4px;display:block}' +
    /* Learning Progress */
    '.prof-section{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:14px;padding:20px;margin-bottom:20px}' +
    '.prof-section h2{font-size:1rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 16px;display:flex;align-items:center;gap:8px}' +
    '.prof-module{display:flex;align-items:center;gap:12px;margin-bottom:10px}' +
    '.prof-module:last-child{margin-bottom:0}' +
    '.prof-module-name{font-size:.85rem;color:var(--text-secondary,#94a3b8);width:200px;flex-shrink:0}' +
    '.prof-module-bar{flex:1;height:8px;background:rgba(148,163,184,.15);border-radius:4px;overflow:hidden}' +
    '.prof-module-fill{height:100%;border-radius:4px;transition:width .5s ease}' +
    '.prof-module-pct{font-size:.75rem;font-weight:600;color:var(--text-muted,#64748b);width:40px;text-align:right;flex-shrink:0}' +
    /* Activity Feed */
    '.prof-activity-list{display:flex;flex-direction:column;gap:8px}' +
    '.prof-activity{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(148,163,184,.08)}' +
    '.prof-activity:last-child{border-bottom:none}' +
    '.prof-activity-icon{font-size:1.1rem;flex-shrink:0;width:28px;text-align:center}' +
    '.prof-activity-text{font-size:.85rem;color:var(--text-secondary,#94a3b8);flex:1}' +
    '.prof-activity-time{font-size:.7rem;color:var(--text-muted,#64748b);flex-shrink:0}' +
    /* Settings */
    '.prof-settings{display:flex;flex-direction:column;gap:12px}' +
    '.prof-setting-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(148,163,184,.08)}' +
    '.prof-setting-label{font-size:.875rem;color:var(--text-secondary,#94a3b8)}' +
    '.prof-toggle{position:relative;width:44px;height:24px;cursor:pointer}' +
    '.prof-toggle input{opacity:0;width:0;height:0}' +
    '.prof-toggle-slider{position:absolute;inset:0;background:rgba(148,163,184,.3);border-radius:12px;transition:background .2s}' +
    '.prof-toggle-slider::before{content:"";position:absolute;left:2px;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}' +
    '.prof-toggle input:checked+.prof-toggle-slider{background:var(--accent,#8b5cf6)}' +
    '.prof-toggle input:checked+.prof-toggle-slider::before{transform:translateX(20px)}' +
    '.prof-btn{background:var(--bg-surface,#0f172a);border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-secondary,#94a3b8);padding:10px 20px;border-radius:8px;cursor:pointer;font-size:.85rem;font-weight:600;transition:all .2s;text-align:center}' +
    '.prof-btn:hover{border-color:var(--accent,#8b5cf6);color:var(--text-primary,#e2e8f0)}' +
    '.prof-btn.danger{border-color:rgba(239,68,68,.3);color:#ef4444}' +
    '.prof-btn.danger:hover{background:rgba(239,68,68,.1);border-color:#ef4444}' +
    '.prof-btn.primary{background:var(--accent,#8b5cf6);border-color:var(--accent,#8b5cf6);color:#fff}' +
    '.prof-btn.primary:hover{opacity:.9}' +
    '.prof-btn-row{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap}' +
    '.prof-name-input-row{display:none;align-items:center;gap:8px}' +
    '.prof-name-input-row.active{display:flex}' +
    '@media(max-width:600px){.prof-stats{grid-template-columns:repeat(2,1fr)}.prof-module-name{width:140px;font-size:.8rem}.prof-header{flex-direction:column;text-align:center}}' +
  '</style>';

  html += '<div class="prof-page">';

  /* ── Profile Header ── */
  html += '<div class="prof-header">' +
    '<div class="prof-avatar">' + esc(userName.charAt(0).toUpperCase()) + '</div>' +
    '<div class="prof-info">' +
      '<div class="prof-name-row">' +
        '<span class="prof-name" id="prof-name-display">' + esc(userName) + '</span>' +
        '<span class="prof-level-badge">Level ' + level + '</span>' +
        '<button class="prof-edit-name" data-action="edit-profile-name" id="prof-edit-btn">\u270F\uFE0F Edit</button>' +
      '</div>' +
      '<div class="prof-name-input-row" id="prof-name-input-row">' +
        '<input type="text" class="prof-name-input active" id="prof-name-input" value="' + esc(userName) + '" maxlength="20" />' +
        '<button class="prof-btn" data-action="save-profile-name" style="padding:6px 14px;font-size:.8rem">Save</button>' +
        '<button class="prof-btn" data-action="cancel-edit-name" style="padding:6px 14px;font-size:.8rem">Cancel</button>' +
      '</div>' +
      '<p class="prof-meta">Joined ' + esc(joinDate) + '</p>' +
    '</div>' +
  '</div>';

  /* ── Stats Grid ── */
  html += '<div class="prof-stats">' +
    '<div class="prof-stat"><div class="stat-val">' + totalXp + '</div><span class="stat-label">Total XP</span></div>' +
    '<div class="prof-stat"><div class="stat-val">' + level + '</div><span class="stat-label">Level</span></div>' +
    '<div class="prof-stat"><div class="stat-val">' + modulesCompleted + '</div><span class="stat-label">Modules Done</span></div>' +
    '<div class="prof-stat"><div class="stat-val">' + quizAccuracy + '%</div><span class="stat-label">Quiz Accuracy</span></div>' +
    '<div class="prof-stat"><div class="stat-val">' + tradesMade + '</div><span class="stat-label">Trades Made</span></div>' +
    '<div class="prof-stat"><div class="stat-val">' + (portfolioReturn >= 0 ? '+' : '') + portfolioReturn + '%</div><span class="stat-label">Portfolio Return</span></div>' +
  '</div>';

  /* ── Learning Progress ── */
  html += '<div class="prof-section">' +
    '<h2>\uD83D\uDCDA Learning Progress</h2>';
  modules.forEach(function (m) {
    var color = m.pct >= 100 ? '#22c55e' : (m.pct >= 50 ? '#f59e0b' : '#64748b');
    html += '<div class="prof-module">' +
      '<span class="prof-module-name">' + esc(m.name) + '</span>' +
      '<div class="prof-module-bar"><div class="prof-module-fill" style="width:' + Math.min(100, m.pct) + '%;background:' + color + '"></div></div>' +
      '<span class="prof-module-pct">' + m.pct + '%</span>' +
    '</div>';
  });
  html += '</div>';

  /* ── Recent Activity ── */
  html += '<div class="prof-section">' +
    '<h2>\u23F0 Recent Activity</h2>' +
    '<div class="prof-activity-list">';
  activities.slice(0, 10).forEach(function (a) {
    html += '<div class="prof-activity">' +
      '<span class="prof-activity-icon">' + (activityIcons[a.type] || '\uD83D\uDCCB') + '</span>' +
      '<span class="prof-activity-text">' + esc(a.text) + '</span>' +
      '<span class="prof-activity-time">' + esc(a.time) + '</span>' +
    '</div>';
  });
  html += '</div></div>';

  /* ── Settings ── */
  html += '<div class="prof-section">' +
    '<h2>\u2699\uFE0F Settings</h2>' +
    '<div class="prof-settings">' +
      '<div class="prof-setting-row">' +
        '<span class="prof-setting-label">Animations</span>' +
        '<label class="prof-toggle"><input type="checkbox" data-action="toggle-animations" ' + ((window.Store && window.Store.getSetting && window.Store.getSetting('animations') !== false) ? 'checked' : '') + ' /><span class="prof-toggle-slider"></span></label>' +
      '</div>' +
      '<div class="prof-setting-row">' +
        '<span class="prof-setting-label">Sound Effects</span>' +
        '<label class="prof-toggle"><input type="checkbox" data-action="toggle-sound" ' + ((window.Store && window.Store.getSetting && window.Store.getSetting('sound') === true) ? 'checked' : '') + ' /><span class="prof-toggle-slider"></span></label>' +
      '</div>' +
      '<div class="prof-btn-row">' +
        '<button class="prof-btn primary" data-action="download-report">\uD83D\uDCE4 Download Report</button>' +
        '<button class="prof-btn danger" data-action="reset-progress">\uD83D\uDDD1\uFE0F Reset Progress</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  html += '</div>'; /* .prof-page */
  return html;
};