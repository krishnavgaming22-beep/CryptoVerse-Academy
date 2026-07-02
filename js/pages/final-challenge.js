/**
 * CryptoVerse Academy — Final Simulation Challenge
 * ===================================================
 * 30-day virtual market simulation with news events,
 * buy/sell/hold decisions, and a comprehensive
 * Investor Report Card graded A-F.
 *
 * Dependencies: window.Store, window.MarketEngine, window.UI, window.Utils
 */
window.Pages = window.Pages || {};

window.Pages['final-challenge'] = function () {
  'use strict';

  var TOTAL_DAYS = 30;
  var ASSETS = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA'];
  var ASSET_COLORS = { BTC:'#F7931A', ETH:'#627EEA', SOL:'#9945FF', XRP:'#00AAE4', DOGE:'#C2A633', ADA:'#0033AD' };
  var STARTING_CASH = 10000;

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  /* ── News event templates for simulation ── */
  var newsTemplates = [
    { title:'SEC Approves Spot Bitcoin ETF', sentiment:'positive', effects:{BTC:8,ETH:5,SOL:4,ADA:3}, text:'The SEC has officially approved multiple spot Bitcoin ETFs, opening the floodgates for institutional investment.' },
    { title:'Major Exchange Hacked — $200M Lost', sentiment:'negative', effects:{BTC:-6,ETH:-8,SOL:-5,ADA:-4,DOGE:-3}, text:'A leading cryptocurrency exchange suffered a massive security breach, resulting in the loss of $200 million in user funds.' },
    { title:'Ethereum Network Upgrade Successful', sentiment:'positive', effects:{ETH:12,SOL:3,ADA:2}, text:'Ethereum completed its latest network upgrade, significantly reducing gas fees and increasing transaction throughput.' },
    { title:'Federal Reserve Raises Interest Rates', sentiment:'negative', effects:{BTC:-4,ETH:-5,SOL:-6,XRP:-3,DOGE:-7,ADA:-4}, text:'The Fed announced a 0.5% interest rate hike, triggering a broad risk-off move in financial markets.' },
    { title:'El Salvador Adopts Bitcoin as Legal Tender', sentiment:'positive', effects:{BTC:10,DOGE:2}, text:'El Salvador has officially made Bitcoin legal tender, becoming the first country to do so.' },
    { title:'China Bans All Crypto Transactions', sentiment:'negative', effects:{BTC:-12,ETH:-10,SOL:-15,ADA:-8,XRP:-6,DOGE:-9}, text:'China has announced a complete ban on all cryptocurrency transactions and mining operations.' },
    { title:'Major Bank Launches Crypto Custody Service', sentiment:'positive', effects:{BTC:5,ETH:4,SOL:3,XRP:2,ADA:2}, text:'JPMorgan has launched a full-service crypto custody solution for institutional clients.' },
    { title:'Solana Network Experiences Outage', sentiment:'negative', effects:{SOL:-15,ETH:1}, text:'The Solana blockchain suffered its third major outage of the year, with the network down for 18 hours.' },
    { title:'MicroStrategy Buys Another $500M in Bitcoin', sentiment:'positive', effects:{BTC:6,ETH:2}, text:'MicroStrategy announced the purchase of an additional $500 million worth of Bitcoin, bringing their total holdings to over 130,000 BTC.' },
    { title:'DeFi Protocol Exploited for $100M', sentiment:'negative', effects:{ETH:-7,SOL:-8,ADA:-5}, text:'A popular DeFi lending protocol was exploited through a flash loan attack, resulting in $100 million in losses.' },
    { title:'New Country Announces Bitcoin Reserve', sentiment:'positive', effects:{BTC:7,ETH:3,SOL:2}, text:'Brazil\'s central bank has announced plans to add Bitcoin to its national reserves.' },
    { title:'Global Inflation Hits 8%', sentiment:'positive', effects:{BTC:5,ETH:4,SOL:3,XRP:1,DOGE:1,ADA:2}, text:'Global inflation reaches 8%, driving increased interest in Bitcoin as a hedge against currency devaluation.' },
    { title:'Whale Moves 50,000 BTC to Exchange', sentiment:'negative', effects:{BTC:-4,ETH:-2}, text:'On-chain analysts detected a massive transfer of 50,000 BTC from a dormant whale wallet to a major exchange, suggesting an impending sell-off.' },
    { title:'NFT Market Hits New All-Time High', sentiment:'positive', effects:{ETH:6,SOL:4}, text:'Monthly NFT trading volume has surpassed $5 billion for the first time, driving demand for ETH and SOL.' },
    { title:'Tesla Sells 75% of Bitcoin Holdings', sentiment:'negative', effects:{BTC:-8,ETH:-3,DOGE:-5}, text:'Tesla revealed in its quarterly earnings that it has sold 75% of its Bitcoin holdings, citing liquidity needs.' },
    { title:'Crypto Regulation Bill Passes Senate', sentiment:'positive', effects:{BTC:4,ETH:3,SOL:3,XRP:5,ADA:3}, text:'The U.S. Senate has passed a comprehensive cryptocurrency regulation bill, providing much-needed regulatory clarity.' },
    { title:'Terra-Style Stablecoin Collapse', sentiment:'negative', effects:{BTC:-10,ETH:-8,SOL:-12,ADA:-7,XRP:-5,DOGE:-8}, text:'A major algorithmic stablecoin has lost its peg, triggering a cascade of liquidations across DeFi markets.' },
    { title:'BlackRock Files for Ethereum ETF', sentiment:'positive', effects:{ETH:10,SOL:4,ADA:3}, text:'BlackRock, the world\'s largest asset manager, has filed an application for a spot Ethereum ETF.' },
    { title:'DogeCoin Twitter Integration', sentiment:'positive', effects:{DOGE:25,BTC:1}, text:'Twitter (now X) has announced integration of DogeCoin as a payment option for premium subscriptions.' },
    { title:'Major Tech Company Accepts Crypto Payments', sentiment:'positive', effects:{BTC:4,ETH:3,SOL:2,XRP:2,ADA:2,DOGE:2}, text:'Amazon has begun accepting cryptocurrency payments across its platform, marking a major milestone for mainstream adoption.' },
    { title:'Regulatory Crackdown on DeFi', sentiment:'negative', effects:{ETH:-5,SOL:-7,ADA:-6}, text:'U.S. regulators have announced a crackdown on decentralized finance protocols, demanding compliance with securities laws.' },
    { title:'Bitcoin Mining Difficulty All-Time High', sentiment:'positive', effects:{BTC:3}, text:'Bitcoin mining difficulty has reached an all-time high, indicating unprecedented network security and miner confidence.' },
    { title:'Rug Pull on Popular Meme Coin', sentiment:'negative', effects:{DOGE:-20,SOL:-3}, text:'A popular meme coin with a $2 billion market cap has been confirmed as a rug pull, with developers draining liquidity pools.' },
    { title:'Cardano Smart Contracts Milestone', sentiment:'positive', effects:{ADA:15,ETH:-1}, text:'Cardano has reached a major milestone with over 1,000 smart contracts now deployed on its network.' },
    { title:'Banking Crisis Drives Crypto Influx', sentiment:'positive', effects:{BTC:9,ETH:7,SOL:6,XRP:4,DOGE:3,ADA:5}, text:'Multiple bank failures have driven a massive influx of capital into cryptocurrency as investors seek alternatives.' },
    { title:'Crypto Tax Reporting Requirements', sentiment:'negative', effects:{BTC:-3,ETH:-3,SOL:-4,XRP:-2,DOGE:-2,ADA:-3}, text:'New tax regulations require detailed reporting of all crypto transactions above $600, creating uncertainty.' },
    { title:'Layer 2 Scaling Breakthrough', sentiment:'positive', effects:{ETH:8,SOL:2}, text:'A new Ethereum Layer 2 solution has achieved 100,000 transactions per second in testing, far exceeding current capabilities.' },
    { title:'XRP Wins Court Case', sentiment:'positive', effects:{XRP:30,ETH:2,BTC:1}, text:'Ripple has won its landmark court case against the SEC, with the judge ruling that XRP is not a security.' },
    { title:'Market Flash Crash — 30% in 1 Hour', sentiment:'negative', effects:{BTC:-20,ETH:-25,SOL:-30,XRP:-22,DOGE:-35,ADA:-28}, text:'A sudden flash crash wiped out 30% of the crypto market in just one hour, triggered by a cascade of liquidations.' },
    { title:'Recovery Rally — Market Bounces Back', sentiment:'positive', effects:{BTC:15,ETH:18,SOL:20,XRP:12,DOGE:14,ADA:16}, text:'Following the flash crash, a massive recovery rally has brought most major cryptocurrencies back to pre-crash levels.' }
  ];

  /* Check if user meets requirements */
  var learningPct = (window.Store && window.Store.getLearningPct) ? window.Store.getLearningPct() : 0;
  var canStart = learningPct >= 50;

  var html = '<style>' +
    '.fc-page{max-width:960px;margin:0 auto;padding:24px}' +
    '.fc-header{text-align:center;margin-bottom:28px}' +
    '.fc-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 8px}' +
    '.fc-header p{color:var(--text-secondary,#94a3b8);font-size:.95rem;max-width:600px;margin:0 auto;line-height:1.6}' +
    /* Landing */
    '.fc-landing{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:16px;padding:40px;text-align:center;max-width:640px;margin:0 auto}' +
    '.fc-landing h2{font-size:1.5rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 12px}' +
    '.fc-landing p{color:var(--text-secondary,#94a3b8);font-size:.9rem;line-height:1.6;margin:0 0 20px}' +
    '.fc-req{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;font-size:.85rem}' +
    '.fc-req.met{color:#22c55e}' +
    '.fc-req.unmet{color:#ef4444}' +
    '.fc-start-btn{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;border:none;padding:14px 36px;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s}' +
    '.fc-start-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.4)}' +
    '.fc-start-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}' +
    /* Simulation */
    '.fc-sim{display:none}' +
    '.fc-sim.active{display:block}' +
    '.fc-day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}' +
    '.fc-day-badge{background:var(--accent,#8b5cf6);color:#fff;padding:6px 16px;border-radius:20px;font-weight:700;font-size:.85rem}' +
    '.fc-cash-display{font-size:1rem;font-weight:600;color:var(--text-primary,#e2e8f0)}' +
    '.fc-cash-display span{color:#22c55e}' +
    '.fc-news-event{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:12px;padding:16px;margin-bottom:16px}' +
    '.fc-news-event h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent,#8b5cf6);margin:0 0 6px}' +
    '.fc-news-event h3{font-size:1rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 4px}' +
    '.fc-news-event p{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin:0;line-height:1.5}' +
    '.fc-portfolio{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:16px;margin-bottom:16px}' +
    '.fc-portfolio h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted,#64748b);margin:0 0 12px}' +
    '.fc-asset-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(148,163,184,.08);font-size:.85rem}' +
    '.fc-asset-row:last-child{border-bottom:none}' +
    '.fc-asset-name{font-weight:600;color:var(--text-primary,#e2e8f0);min-width:60px}' +
    '.fc-asset-price{color:var(--text-secondary,#94a3b8);min-width:90px;text-align:right}' +
    '.fc-asset-change{min-width:70px;text-align:right;font-weight:600;font-size:.8rem}' +
    '.fc-asset-change.up{color:#22c55e}' +
    '.fc-asset-change.down{color:#ef4444}' +
    '.fc-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.fc-action-btn{padding:10px 28px;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;border:1px solid var(--border-color,rgba(148,163,184,.2));transition:all .2s;background:var(--bg-card,rgba(30,41,59,.8));color:var(--text-primary,#e2e8f0)}' +
    '.fc-action-btn:hover{border-color:var(--accent,#8b5cf6)}' +
    '.fc-action-btn.buy{background:rgba(34,197,94,.12);border-color:rgba(34,197,94,.3);color:#22c55e}' +
    '.fc-action-btn.buy:hover{background:rgba(34,197,94,.2)}' +
    '.fc-action-btn.sell{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.3);color:#ef4444}' +
    '.fc-action-btn.sell:hover{background:rgba(239,68,68,.2)}' +
    '.fc-action-btn.hold{background:rgba(148,163,184,.08);color:var(--text-secondary,#94a3b8)}' +
    /* Buy/Sell Modal */
    '.fc-trade-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;align-items:center;justify-content:center;padding:20px}' +
    '.fc-trade-modal.open{display:flex}' +
    '.fc-trade-panel{background:var(--bg-surface,#1e293b);border:1px solid var(--border-color,rgba(148,163,184,.2));border-radius:16px;padding:24px;max-width:400px;width:100%}' +
    '.fc-trade-panel h3{margin:0 0 16px;color:var(--text-primary,#e2e8f0)}' +
    '.fc-trade-asset{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}' +
    '.fc-trade-asset-btn{padding:6px 14px;border-radius:6px;font-size:.8rem;font-weight:600;cursor:pointer;border:1px solid var(--border-color,rgba(148,163,184,.2));background:transparent;color:var(--text-secondary,#94a3b8);transition:all .2s}' +
    '.fc-trade-asset-btn.selected{border-color:var(--accent,#8b5cf6);color:var(--accent,#8b5cf6);background:rgba(139,92,246,.1)}' +
    '.fc-trade-input-row{display:flex;align-items:center;gap:10px;margin-bottom:16px}' +
    '.fc-trade-input{flex:1;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-primary,#e2e8f0);padding:10px 14px;border-radius:8px;font-size:.9rem;outline:none}' +
    '.fc-trade-input:focus{border-color:var(--accent,#8b5cf6)}' +
    '.fc-trade-btns{display:flex;gap:10px}' +
    '.fc-trade-btns button{flex:1;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;border:none;font-size:.85rem;transition:all .2s}' +
    '.fc-trade-cancel{background:rgba(148,163,184,.1);color:var(--text-secondary,#94a3b8)}' +
    '.fc-trade-cancel:hover{background:rgba(148,163,184,.2)}' +
    /* Report Card */
    '.fc-report{display:none;animation:fadeUp .5s ease}' +
    '.fc-report.active{display:block}' +
    '@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
    '.fc-cert{background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(99,102,241,.05));border:2px solid var(--accent,#8b5cf6);border-radius:20px;padding:40px;text-align:center;max-width:700px;margin:0 auto;position:relative;overflow:hidden}' +
    '.fc-cert::before{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(139,92,246,.05) 0%,transparent 70%);pointer-events:none}' +
    '.fc-cert h2{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--text-muted,#64748b);margin:0 0 4px}' +
    '.fc-cert h3{font-size:1.5rem;font-weight:900;color:var(--text-primary,#e2e8f0);margin:0 0 24px}' +
    '.fc-grade-circle{width:100px;height:100px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:900;color:#fff}' +
    '.fc-grade-A{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 0 30px rgba(34,197,94,.3)}' +
    '.fc-grade-B{background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 0 30px rgba(59,130,246,.3)}' +
    '.fc-grade-C{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 0 30px rgba(245,158,11,.3)}' +
    '.fc-grade-D{background:linear-gradient(135deg,#f97316,#ea580c);box-shadow:0 0 30px rgba(249,115,22,.3)}' +
    '.fc-grade-F{background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 0 30px rgba(239,68,68,.3)}' +
    '.fc-scores{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:24px 0;text-align:left}' +
    '.fc-score-item{background:rgba(255,255,255,.03);border-radius:10px;padding:14px}' +
    '.fc-score-item .label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted,#64748b);margin-bottom:4px}' +
    '.fc-score-item .value{font-size:1.1rem;font-weight:700;color:var(--text-primary,#e2e8f0)}' +
    '.fc-score-bar{height:6px;background:rgba(148,163,184,.15);border-radius:3px;margin-top:6px;overflow:hidden}' +
    '.fc-score-bar-fill{height:100%;border-radius:3px;transition:width 1s ease}' +
    '.fc-list-section{margin:20px 0;text-align:left}' +
    '.fc-list-section h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}' +
    '.fc-list-section.strengths h4{color:#22c55e}' +
    '.fc-list-section.improve h4{color:#f59e0b}' +
    '.fc-list-section.recs h4{color:var(--accent,#8b5cf6)}' +
    '.fc-list-section ul{margin:0;padding:0 0 0 18px;color:var(--text-secondary,#94a3b8);font-size:.875rem;line-height:1.7}' +
    '.fc-back-btn{margin-top:24px;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-primary,#e2e8f0);padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;transition:all .2s}' +
    '.fc-back-btn:hover{border-color:var(--accent,#8b5cf6)}' +
    '.fc-landing{display:block}' +
    '.fc-landing.hidden{display:none}' +
  '</style>';

  html += '<div class="fc-page">';

  /* ── Header ── */
  html += '<div class="fc-header">' +
    '<h1>\uD83C\uDFC5 Final Simulation Challenge</h1>' +
    '<p>Put everything you\'ve learned to the test. Navigate 30 days of virtual market events and prove your skills as a crypto investor.</p>' +
  '</div>';

  /* ── Landing View ── */
  html += '<div class="fc-landing" id="fc-landing">' +
    '<h2>Ready for the Ultimate Test?</h2>' +
    '<p>You\'ll face 30 days of virtual market conditions with real news events affecting prices. Make smart buy, sell, and hold decisions to maximize your portfolio. At the end, you\'ll receive a comprehensive Investor Report Card.</p>' +
    '<div class="fc-req ' + (canStart ? 'met' : 'unmet') + '" id="fc-requirement">' +
      (canStart ? '\u2705' : '\u274C') + ' Complete at least 50% of learning modules (Current: ' + learningPct + '%)' +
    '</div>' +
    '<button class="fc-start-btn" data-action="start-final-challenge"' + (canStart ? '' : ' disabled') + '>' +
      (canStart ? '\uD83C\uDFAF Start Challenge' : '\uD83D\uDD12 Complete More Learning to Unlock') +
    '</button>' +
  '</div>';

  /* ── Simulation View ── */
  html += '<div class="fc-sim" id="fc-sim">' +
    '<div class="fc-day-header">' +
      '<span class="fc-day-badge" id="fc-day-badge">Day 1 / 30</span>' +
      '<span class="fc-cash-display">Cash: $<span id="fc-cash">' + STARTING_CASH.toFixed(2) + '</span></span>' +
    '</div>' +
    '<div class="fc-news-event" id="fc-news-event"></div>' +
    '<div class="fc-portfolio" id="fc-portfolio"><h4>Portfolio</h4><div id="fc-portfolio-body"></div></div>' +
    '<div class="fc-actions" id="fc-actions">' +
      '<button class="fc-action-btn buy" data-action="fc-buy">\uD83D\uDCB0 Buy</button>' +
      '<button class="fc-action-btn sell" data-action="fc-sell">\uD83D\uDCB8 Sell</button>' +
      '<button class="fc-action-btn hold" data-action="fc-hold">\u23F8\uFE0F Hold &amp; Next Day</button>' +
    '</div>' +
  '</div>';

  /* ── Trade Modal ── */
  html += '<div class="fc-trade-modal" id="fc-trade-modal">' +
    '<div class="fc-trade-panel">' +
      '<h3 id="fc-trade-title">Buy Asset</h3>' +
      '<div class="fc-trade-asset" id="fc-trade-assets"></div>' +
      '<div class="fc-trade-input-row">' +
        '<input type="number" class="fc-trade-input" id="fc-trade-amount" placeholder="Amount in $" min="1" step="100" />' +
        '<span style="color:var(--text-muted,#64748b);font-size:.8rem" id="fc-trade-max">Max: $' + STARTING_CASH.toFixed(0) + '</span>' +
      '</div>' +
      '<div class="fc-trade-btns">' +
        '<button class="fc-trade-cancel" data-action="fc-trade-cancel">Cancel</button>' +
        '<button class="fc-start-btn" style="padding:10px 24px;font-size:.85rem" data-action="fc-trade-confirm">Confirm</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  /* ── Report Card View ── */
  html += '<div class="fc-report" id="fc-report">' +
    '<div class="fc-cert">' +
      '<h2>Investor Report Card</h2>' +
      '<h3>CryptoVerse Academy \u2014 Final Challenge</h3>' +
      '<div class="fc-grade-circle fc-grade-A" id="fc-grade-circle">A</div>' +
      '<div class="fc-scores" id="fc-scores"></div>' +
      '<div id="fc-report-lists"></div>' +
      '<button class="fc-back-btn" data-action="fc-back-to-home">\u2190 Back to Academy</button>' +
    '</div>' +
  '</div>';

  html += '</div>'; /* .fc-page */
  return html;
};