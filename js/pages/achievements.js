/**
 * CryptoVerse Academy — Achievement Dashboard
 * =============================================
 * Displays XP summary, 15 achievement cards with tier badges,
 * unlock/lock states, celebrate animation, and stats.
 *
 * Dependencies: window.Store, window.DataAchievements, window.UI
 */
window.Pages = window.Pages || {};

window.Pages.achievements = function () {
  'use strict';

  var achievements = (window.DataAchievements && window.DataAchievements.getAll)
    ? window.DataAchievements.getAll()
    : [
      { id:'first-trade',   name:'First Trade',         desc:'Execute your first trade',                  xp:20,  tier:'bronze',   category:'trading',     icon:'\uD83D\uDCC8', condition:'Execute your first simulated trade' },
      { id:'ten-trades',    name:'Trader',              desc:'Complete 10 trades',                         xp:50,  tier:'silver',   category:'trading',     icon:'\uD83D\uDCB0', condition:'Execute 10 trades in the simulator' },
      { id:'profit-50',     name:'In The Green',        desc:'Achieve 50%+ portfolio return',              xp:100, tier:'gold',     category:'trading',     icon:'\uD83C\uDF1F', condition:'Grow your portfolio by 50% or more' },
      { id:'diversified',   name:'Diversified',         desc:'Hold 4+ different assets',                   xp:30,  tier:'bronze',   category:'trading',     icon:'\uD83C\uDF0D', condition:'Own at least 4 different assets simultaneously' },
      { id:'risk-manager',  name:'Risk Manager',        desc:'Never risk more than 25% on one trade',      xp:75,  tier:'silver',   category:'trading',     icon:'\uD83D\uDEE1\uFE0F', condition:'Complete 10 trades without risking >25% on any single one' },
      { id:'history-done',  name:'History Buff',        desc:'Complete the History of Money module',       xp:30,  tier:'bronze',   category:'learning',    icon:'\uD83D\uDCDC', condition:'Complete all milestones in the History module' },
      { id:'blockchain-done',name:'Chain Explorer',     desc:'Complete the Blockchain Explained module',   xp:30,  tier:'bronze',   category:'learning',    icon:'\uD83D\uDD17', condition:'Complete all sections in the Blockchain module' },
      { id:'bitcoin-done',  name:'Satoshi Scholar',     desc:'Complete the How Bitcoin Works module',      xp:30,  tier:'bronze',   category:'learning',    icon:'BTC', condition:'Complete all topics in the Bitcoin module' },
      { id:'academy-grad',  name:'Academy Graduate',    desc:'Complete all 8 academy lessons',             xp:200, tier:'platinum', category:'learning',    icon:'\uD83C\uDF93', condition:'Complete all 8 lessons in the Teen Investor Academy' },
      { id:'quiz-ace',      name:'Quiz Ace',            desc:'Score 100% on any quiz',                     xp:50,  tier:'silver',   category:'learning',    icon:'\uD83C\uDFAF', condition:'Get a perfect score on any quiz module' },
      { id:'quiz-master',   name:'Quiz Master',         desc:'Complete all quizzes',                        xp:100, tier:'gold',     category:'learning',    icon:'\uD83C\uDFC6', condition:'Complete quizzes for all learning modules' },
      { id:'scam-detective',name:'Scam Detective',      desc:'Complete all scam scenarios',                xp:75,  tier:'silver',   category:'awareness',   icon:'\uD83D\uDD0E', condition:'Find all red flags in all 4 scam scenarios' },
      { id:'myth-buster',   name:'Myth Buster',         desc:'Debunk 15+ crypto myths',                    xp:50,  tier:'silver',   category:'awareness',   icon:'\uD83D\uDEA8', condition:'Flip 15 or more myth cards in Myth Busters' },
      { id:'challenge',     name:'Challenge Conqueror', desc:'Complete the Final Simulation Challenge',     xp:300, tier:'platinum', category:'challenge',   icon:'\uD83C\uDFC5', condition:'Complete all 30 days of the Final Challenge simulation' },
      { id:'explorer',      name:'Blockchain Explorer', desc:'Read all 8 blockchain application case studies', xp:40, tier:'bronze', category:'exploration', icon:'\uD83D\uDE80', condition:'Open and explore all 8 blockchain applications' }
    ];

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  var unlocked = [];
  var locked = [];
  var totalXpFromAch = 0;
  achievements.forEach(function (a) {
    var isUnlocked = window.Store && window.Store.isAchievementUnlocked && window.Store.isAchievementUnlocked(a.id);
    if (isUnlocked) { unlocked.push(a); totalXpFromAch += a.xp; }
    else { locked.push(a); }
  });

  var totalXp = (window.Store && window.Store.getXP) ? window.Store.getXP() : 0;
  var level = (window.Store && window.Store.getLevel) ? window.Store.getLevel() : 1;
  var xpForNext = level * 100;
  var currentLevelXp = totalXp - ((level - 1) * 100);
  var levelPct = Math.min(100, Math.round((currentLevelXp / xpForNext) * 100));

  function tierColors(tier) {
    switch (tier) {
      case 'platinum': return { bg:'rgba(168,162,158,.12)', border:'rgba(168,162,158,.4)', text:'#a8a29e', badge:'linear-gradient(135deg,#e2e8f0,#94a3b8)' };
      case 'gold':     return { bg:'rgba(234,179,8,.12)',   border:'rgba(234,179,8,.4)',   text:'#eab308', badge:'linear-gradient(135deg,#fbbf24,#f59e0b)' };
      case 'silver':   return { bg:'rgba(148,163,184,.12)', border:'rgba(148,163,184,.4)', text:'#94a3b8', badge:'linear-gradient(135deg,#cbd5e1,#94a3b8)' };
      default:         return { bg:'rgba(180,83,9,.12)',    border:'rgba(180,83,9,.4)',    text:'#b45309', badge:'linear-gradient(135deg,#d97706,#b45309)' };
    }
  }

  var html = '<style>' +
    '.ach-page{max-width:960px;margin:0 auto;padding:24px}' +
    '.ach-header{text-align:center;margin-bottom:24px}' +
    '.ach-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 6px}' +
    /* XP Summary */
    '.ach-xp-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:16px;padding:24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px}' +
    '.ach-xp-main{display:flex;align-items:center;gap:20px}' +
    '.ach-xp-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;flex-shrink:0}' +
    '.ach-xp-circle .lvl{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.8}' +
    '.ach-xp-circle .lvl-num{font-size:1.5rem;font-weight:900;line-height:1}' +
    '.ach-xp-info{flex:1;min-width:200px}' +
    '.ach-xp-info h3{font-size:1.1rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 4px}' +
    '.ach-xp-info p{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin:0 0 8px}' +
    '.ach-xp-bar{height:8px;background:rgba(148,163,184,.15);border-radius:4px;overflow:hidden;max-width:300px}' +
    '.ach-xp-bar-fill{height:100%;background:linear-gradient(90deg,#8b5cf6,#6366f1);border-radius:4px;transition:width .5s ease}' +
    '.ach-xp-stats{display:flex;gap:24px;flex-wrap:wrap}' +
    '.ach-xp-stat{text-align:center}' +
    '.ach-xp-stat .stat-val{font-size:1.25rem;font-weight:700;color:var(--accent,#8b5cf6)}' +
    '.ach-xp-stat .stat-label{font-size:.7rem;color:var(--text-muted,#64748b);text-transform:uppercase;letter-spacing:.05em}' +
    /* Achievement Grid */
    '.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}' +
    '.ach-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:14px;padding:18px;position:relative;transition:all .3s;overflow:hidden}' +
    '.ach-card.unlocked{box-shadow:0 0 20px rgba(139,92,246,.1)}' +
    '.ach-card.locked{filter:grayscale(1);opacity:.6}' +
    '.ach-card.locked:hover{filter:grayscale(.7);opacity:.8}' +
    '.ach-card-icon{font-size:1.6rem;margin-bottom:8px}' +
    '.ach-card h3{font-size:.95rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    '.ach-card p{font-size:.8rem;color:var(--text-secondary,#94a3b8);margin:0 0 10px;line-height:1.4}' +
    '.ach-card .ach-reward{font-size:.75rem;font-weight:600;color:var(--accent,#8b5cf6)}' +
    '.ach-tier-badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff}' +
    '.ach-unlocked-badge{position:absolute;top:12px;right:12px;background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}' +
    '.ach-lock-overlay{position:absolute;inset:0;background:rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;border-radius:14px}' +
    '.ach-lock-overlay span{font-size:1.5rem;opacity:.6}' +
    '.ach-card .ach-condition{font-size:.7rem;color:var(--text-muted,#64748b);font-style:italic;margin-top:6px}' +
    /* Confetti */
    '.ach-confetti-container{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden}' +
    '.ach-confetti{position:absolute;width:8px;height:8px;border-radius:2px;top:-10px;animation:confetti-fall 2.5s ease-out forwards}' +
    '@keyframes confetti-fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}' +
    '@keyframes ach-glow{0%,100%{box-shadow:0 0 15px rgba(139,92,246,.2)}50%{box-shadow:0 0 30px rgba(139,92,246,.4)}}' +
    '.ach-card.unlocked{animation:ach-glow 3s ease-in-out infinite}' +
  '</style>';

  html += '<div class="ach-page">';

  /* Header */
  html += '<div class="ach-header"><h1>\uD83C\uDFC6 Achievements</h1></div>';

  /* XP Summary Card */
  html += '<div class="ach-xp-card">' +
    '<div class="ach-xp-main">' +
      '<div class="ach-xp-circle"><span class="lvl">Level</span><span class="lvl-num">' + level + '</span></div>' +
      '<div class="ach-xp-info">' +
        '<h3>Total XP: ' + totalXp + '</h3>' +
        '<p>' + (xpForNext - currentLevelXp) + ' XP to Level ' + (level + 1) + '</p>' +
        '<div class="ach-xp-bar"><div class="ach-xp-bar-fill" style="width:' + levelPct + '%"></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="ach-xp-stats">' +
      '<div class="ach-xp-stat"><div class="stat-val">' + unlocked.length + '/15</div><div class="stat-label">Unlocked</div></div>' +
      '<div class="ach-xp-stat"><div class="stat-val">' + totalXpFromAch + '</div><div class="stat-label">XP from Achievements</div></div>' +
    '</div>' +
  '</div>';

  /* Achievement Grid */
  html += '<div class="ach-grid">';

  /* Unlocked first */
  unlocked.forEach(function (a) {
    var tc = tierColors(a.tier);
    html += '<div class="ach-card unlocked">' +
      '<span class="ach-unlocked-badge">Unlocked</span>' +
      '<div class="ach-card-icon">' + a.icon + '</div>' +
      '<h3>' + esc(a.name) + ' <span class="ach-tier-badge" style="background:' + tc.badge + '">' + a.tier + '</span></h3>' +
      '<p>' + esc(a.desc) + '</p>' +
      '<span class="ach-reward">+' + a.xp + ' XP</span>' +
    '</div>';
  });

  /* Locked */
  locked.forEach(function (a) {
    var tc = tierColors(a.tier);
    html += '<div class="ach-card locked">' +
      '<div class="ach-lock-overlay"><span>\uD83D\uDD12</span></div>' +
      '<div class="ach-card-icon">' + a.icon + '</div>' +
      '<h3>' + esc(a.name) + ' <span class="ach-tier-badge" style="background:' + tc.badge + '">' + a.tier + '</span></h3>' +
      '<p>' + esc(a.desc) + '</p>' +
      '<span class="ach-reward">+' + a.xp + ' XP</span>' +
      '<div class="ach-condition">' + esc(a.condition) + '</div>' +
    '</div>';
  });

  html += '</div>'; /* .ach-grid */
  html += '</div>'; /* .ach-page */

  /* Confetti container */
  html += '<div class="ach-confetti-container" id="ach-confetti"></div>';

  return html;
};