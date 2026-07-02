/**
 * CryptoVerse Academy — Leaderboards
 * ====================================
 * Ranked user tables with filter tabs, top-3 podium,
 * current user highlight, and "Your Rank" card.
 *
 * Dependencies: window.Store, window.DataUsers, window.Utils
 */
window.Pages = window.Pages || {};

window.Pages.leaderboard = function () {
  'use strict';

  var filters = ['Overall', 'Portfolio Growth', 'Learning', 'Quiz Accuracy', 'Consistency'];
  var filterKeys = ['overall', 'portfolio', 'learning', 'quizAccuracy', 'consistency'];

  /* Generate fictional users if DataUsers not available */
  var users = [];
  if (window.DataUsers && window.DataUsers.getAll) {
    users = window.DataUsers.getAll();
  }
  if (!users || users.length === 0) {
    var names = [
      'CryptoKing99','DiamondHands','BlockBuilder','SatoshiJr','HodlHero',
      'TokenTrader','ChainGuru','DeFiQueen','NodeRunner','MiningMax',
      'Web3Wizard','HashHunter','KeyKeeper','ProofOfSkill','LedgerLion',
      'WalletWhiz','SmartContractor','GasSaver','ApeWatcher','MoonBound',
      'AltcoinAce','ForkMaster','MempoolMike','NonceHunter','RpcRunner',
      'VaultGuard','SeedPhraseSam','Bip39Bob','ColdStorage','HotWallet'
    ];
    names.forEach(function (name, i) {
      users.push({
        id: 'user-' + i,
        name: name,
        avatar: name.charAt(0).toUpperCase(),
        xp: 2800 - (i * 70) + Math.floor(Math.random() * 50),
        portfolioReturn: 85 - (i * 2.2) + Math.floor(Math.random() * 10),
        learningPct: 100 - (i * 2.5) + Math.floor(Math.random() * 10),
        quizAccuracy: 98 - (i * 2) + Math.floor(Math.random() * 8),
        consistency: 95 - (i * 2.3) + Math.floor(Math.random() * 10),
        badges: []
      });
      /* Give top users some badges */
      if (i < 5) users[users.length - 1].badges.push('Top Trader');
      if (i < 3) users[users.length - 1].badges.push('Scholar');
      if (i < 8) users[users.length - 1].badges.push('Explorer');
    });
    /* Clamp values */
    users.forEach(function (u) {
      u.portfolioReturn = Math.max(1, Math.min(120, u.portfolioReturn));
      u.learningPct = Math.max(10, Math.min(100, u.learningPct));
      u.quizAccuracy = Math.max(30, Math.min(100, u.quizAccuracy));
      u.consistency = Math.max(20, Math.min(100, u.consistency));
    });
  }

  /* Insert current user */
  var currentUser = {
    id: 'current-user',
    name: (window.Store && window.Store.getUserName) ? window.Store.getUserName() : 'You',
    avatar: (window.Store && window.Store.getUserName) ? window.Store.getUserName().charAt(0).toUpperCase() : 'Y',
    xp: (window.Store && window.Store.getXP) ? window.Store.getXP() : 500,
    portfolioReturn: (window.Store && window.Store.getPortfolioReturn) ? window.Store.getPortfolioReturn() : 15,
    learningPct: (window.Store && window.Store.getLearningPct) ? window.Store.getLearningPct() : 30,
    quizAccuracy: (window.Store && window.Store.getQuizAccuracy) ? window.Store.getQuizAccuracy() : 60,
    consistency: 70,
    badges: ['Explorer'],
    isCurrentUser: true
  };

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function sortAndRank(filterKey) {
    var all = users.concat([currentUser]);
    all.sort(function (a, b) {
      var va = a[filterKey] || 0;
      var vb = b[filterKey] || 0;
      return vb - va;
    });
    all.forEach(function (u, i) { u._rank = i + 1; });
    return all;
  }

  function fmtStat(key, val) {
    switch (key) {
      case 'overall': return val + ' XP';
      case 'portfolio': return '+' + val + '%';
      case 'learning': return val + '%';
      case 'quizAccuracy': return val + '%';
      case 'consistency': return val + '%';
      default: return val;
    }
  }

  var avatarColors = ['#8b5cf6','#f59e0b','#22c55e','#ef4444','#3b82f6','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16'];

  var html = '<style>' +
    '.lb-page{max-width:860px;margin:0 auto;padding:24px}' +
    '.lb-header{text-align:center;margin-bottom:24px}' +
    '.lb-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 6px}' +
    /* Tabs */
    '.lb-tabs{display:flex;gap:4px;margin-bottom:24px;background:var(--bg-card,rgba(30,41,59,.6));padding:4px;border-radius:12px;overflow-x:auto}' +
    '.lb-tab{flex:1;min-width:120px;padding:10px 12px;background:transparent;border:none;color:var(--text-secondary,#94a3b8);font-size:.8rem;font-weight:600;border-radius:8px;cursor:pointer;transition:all .2s;white-space:nowrap;text-align:center}' +
    '.lb-tab:hover{color:var(--text-primary,#e2e8f0)}' +
    '.lb-tab.active{background:var(--accent,#8b5cf6);color:#fff}' +
    /* Podium */
    '.lb-podium{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin-bottom:32px;padding:0 20px}' +
    '.lb-podium-slot{display:flex;flex-direction:column;align-items:center;text-align:center;transition:all .5s}' +
    '.lb-podium-slot .podium-medal{font-size:1.5rem;margin-bottom:4px}' +
    '.lb-podium-slot .podium-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff;margin-bottom:4px;border:2px solid rgba(255,255,255,.2)}' +
    '.lb-podium-slot .podium-name{font-size:.8rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin-bottom:2px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.lb-podium-slot .podium-stat{font-size:.75rem;font-weight:700;color:var(--accent,#8b5cf6)}' +
    '.lb-podium-bar{width:100px;border-radius:8px 8px 0 0;margin-top:6px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:rgba(255,255,255,.8);transition:height .5s ease}' +
    '.lb-podium-slot.p1 .lb-podium-bar{height:120px;background:linear-gradient(180deg,#fbbf24,#f59e0b)}' +
    '.lb-podium-slot.p2 .lb-podium-bar{height:90px;background:linear-gradient(180deg,#cbd5e1,#94a3b8)}' +
    '.lb-podium-slot.p3 .lb-podium-bar{height:65px;background:linear-gradient(180deg,#d97706,#b45309)}' +
    '.lb-podium-slot.p1 .podium-avatar{border-color:#fbbf24;box-shadow:0 0 16px rgba(251,191,36,.4)}' +
    '.lb-podium-slot.p2 .podium-avatar{border-color:#cbd5e1;box-shadow:0 0 12px rgba(203,213,225,.3)}' +
    '.lb-podium-slot.p3 .podium-avatar{border-color:#d97706;box-shadow:0 0 12px rgba(217,119,6,.3)}' +
    /* Table */
    '.lb-table{width:100%;border-collapse:collapse}' +
    '.lb-table th{text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted,#64748b);padding:8px 12px;border-bottom:1px solid var(--border-color,rgba(148,163,184,.15))}' +
    '.lb-table td{padding:10px 12px;border-bottom:1px solid rgba(148,163,184,.08);font-size:.85rem;color:var(--text-secondary,#94a3b8)}' +
    '.lb-table tr{transition:background .2s}' +
    '.lb-table tr:hover{background:rgba(99,102,241,.04)}' +
    '.lb-table tr.current-user{background:rgba(139,92,246,.08);border-left:3px solid var(--accent,#8b5cf6)}' +
    '.lb-table tr.current-user td{color:var(--text-primary,#e2e8f0);font-weight:600}' +
    '.lb-rank{font-weight:700;color:var(--text-muted,#64748b);width:40px}' +
    '.lb-table-row-avatar{width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:.75rem;color:#fff;margin-right:8px;vertical-align:middle;flex-shrink:0}' +
    '.lb-name-cell{display:flex;align-items:center}' +
    '.lb-badges-cell{display:flex;gap:4px;flex-wrap:wrap}' +
    '.lb-badge{background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.2);color:var(--text-muted,#64748b);padding:2px 8px;border-radius:12px;font-size:.65rem;font-weight:500}' +
    '.lb-stat-val{font-weight:700;color:var(--accent,#8b5cf6)}' +
    /* Your Rank Card */
    '.lb-your-rank{margin-top:20px;background:var(--bg-card,rgba(30,41,59,.8));border:2px solid var(--accent,#8b5cf6);border-radius:14px;padding:20px;text-align:center}' +
    '.lb-your-rank h3{font-size:1.1rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 8px}' +
    '.lb-your-rank .rank-big{font-size:2.5rem;font-weight:900;color:var(--accent,#8b5cf6);line-height:1;margin-bottom:4px}' +
    '.lb-your-rank p{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin:0}' +
  '</style>';

  html += '<div class="lb-page">';

  /* Header */
  html += '<div class="lb-header"><h1>\uD83C\uDFC6 Leaderboards</h1></div>';

  /* Tabs */
  html += '<div class="lb-tabs">';
  filters.forEach(function (f, i) {
    html += '<button class="lb-tab' + (i === 0 ? ' active' : '') + '" data-action="lb-filter" data-filter="' + filterKeys[i] + '">' + f + '</button>';
  });
  html += '</div>';

  /* Podium (rendered with initial overall data) */
  var initialRanking = sortAndRank('overall');
  var top3 = initialRanking.slice(0, 3);
  var podiumOrder = [top3[1], top3[0], top3[2]]; /* 2nd, 1st, 3rd */

  html += '<div class="lb-podium" id="lb-podium">';
  var podiumClasses = ['p2', 'p1', 'p3'];
  var medals = ['\uD83E\uDD48', '\uD83E\uDD47', '\uD83E\uDD49'];
  podiumOrder.forEach(function (u, i) {
    if (!u) return;
    var color = avatarColors[i === 1 ? 0 : (i === 0 ? 1 : 2)];
    var isMe = u.isCurrentUser;
    html += '<div class="lb-podium-slot ' + podiumClasses[i] + '">' +
      '<span class="podium-medal">' + medals[i] + '</span>' +
      '<div class="podium-avatar" style="background:' + (isMe ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : color) + '">' + esc(u.avatar) + '</div>' +
      '<span class="podium-name">' + esc(u.name) + (isMe ? ' (You)' : '') + '</span>' +
      '<span class="podium-stat" data-lb-stat>' + fmtStat('overall', u.overall || u.xp) + '</span>' +
      '<div class="lb-podium-bar">#' + u._rank + '</div>' +
    '</div>';
  });
  html += '</div>';

  /* Table */
  html += '<table class="lb-table" id="lb-table"><thead><tr>' +
    '<th>Rank</th><th>Name</th><th>Badges</th><th id="lb-stat-header">Overall</th>' +
    '</tr></thead><tbody id="lb-table-body">';

  initialRanking.slice(3).forEach(function (u) {
    var isMe = u.isCurrentUser;
    var color = avatarColors[u._rank % avatarColors.length];
    html += '<tr class="' + (isMe ? 'current-user' : '') + '" data-lb-user>' +
      '<td class="lb-rank">#' + u._rank + '</td>' +
      '<td><span class="lb-name-cell"><span class="lb-table-row-avatar" style="background:' + (isMe ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : color) + '">' + esc(u.avatar) + '</span>' + esc(u.name) + (isMe ? ' (You)' : '') + '</span></td>' +
      '<td><div class="lb-badges-cell">' + (u.badges || []).map(function (b) { return '<span class="lb-badge">' + esc(b) + '</span>'; }).join('') + '</div></td>' +
      '<td class="lb-stat-val" data-lb-stat>' + fmtStat('overall', u.overall || u.xp) + '</td>' +
    '</tr>';
  });
  html += '</tbody></table>';

  /* Your Rank Card (if not in top 10) */
  var myRank = initialRanking.findIndex(function (u) { return u.isCurrentUser; }) + 1;
  if (myRank > 10) {
    html += '<div class="lb-your-rank" id="lb-your-rank">' +
      '<h3>Your Rank</h3>' +
      '<div class="rank-big">#' + myRank + '</div>' +
      '<p>Keep learning and trading to climb the leaderboard!</p>' +
    '</div>';
  }

  html += '</div>'; /* .lb-page */
  return html;
};