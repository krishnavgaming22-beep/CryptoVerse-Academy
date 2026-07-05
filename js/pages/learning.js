/**
 * CryptoVerse Academy — Learning Hub Page
 *
 * Three interactive modules accessible via tabs:
 *   1. History of Money  — horizontal scrollable timeline
 *   2. Blockchain Explained — transaction simulator + chain visual
 *   3. How Bitcoin Works — topic cards with interactive visuals
 *
 * All interactive elements use data-action attributes for
 * event delegation. XP rewards are communicated via toast.
 */
window.Pages = window.Pages || {};

window.Pages.learning = function () {
  var p1 = window.Store ? (window.Store.getModuleProgress('history') || 0) : 0;
  var p2 = window.Store ? (window.Store.getModuleProgress('blockchain') || 0) : 0;
  var p3 = window.Store ? (window.Store.getModuleProgress('bitcoin') || 0) : 0;
  var overall = Math.round((p1 + p2 + p3) / 3);

  /* ═══════════════════════════════════════════════════════════
     MODULE 1 DATA — History of Money (7 milestones)
     ═══════════════════════════════════════════════════════════ */
  var milestones = [
    { id:'barter',  year:'~10,000 BC', title:'Barter',           desc:'People traded goods and services directly with no common medium. A farmer might exchange wheat for tools, but both parties had to want what the other offered \u2014 known as the "double coincidence of wants."', fact:'Pacific island cultures used 4-ton Rai stones as money \u2014 so heavy they rarely moved!' },
    { id:'gold',    year:'~3,000 BC',  title:'Gold & Metals',    desc:'Precious metals became the first universal medium of exchange. Gold was valued across civilizations for its rarity, durability, and beauty, making it an ideal store of value.', fact:'All the gold ever mined in history would fit into a cube of only about 21 meters on each side!' },
    { id:'coins',   year:'~600 BC',    title:'Coins',            desc:'The ancient Lydians minted the first standardized coins from electrum, a gold-silver alloy. Rulers stamped coins with their seal to guarantee weight and purity.', fact:'The word "salary" comes from "salarium" \u2014 the salt allowance Roman soldiers received as pay!' },
    { id:'paper',   year:'~1000 AD',   title:'Paper Currency',   desc:'China\u2019s Tang Dynasty introduced paper money called "jiaozi." Merchants deposited heavy coins and received lighter paper receipts \u2014 a concept that didn\u2019t reach Europe until the 1600s.', fact:'Sweden issued Europe\u2019s first paper banknotes in 1661 \u2014 the same country that is now nearly cashless!' },
    { id:'banking', year:'~1400s',     title:'Banking',          desc:'The Medici family pioneered modern banking in Italy, establishing branches across Europe. They created letters of credit and double-entry bookkeeping \u2014 systems still used today.', fact:'The word "bank" comes from the Italian "banco" \u2014 the wooden benches money-changers sat on in markets!' },
    { id:'digital', year:'1950s',      title:'Digital Payments', desc:'Credit cards (Diners Club, 1950), ATMs (1967), wire transfers, and online banking turned money into numbers on screens. PayPal launched in 1998, paving the way for internet commerce.', fact:'In 2023, over 80% of all money in existence existed purely as records in bank databases!' },
    { id:'crypto',  year:'2009',       title:'Cryptocurrency',   desc:'On January 3, 2009, Satoshi Nakamoto mined Bitcoin\u2019s genesis block, creating the first decentralized digital currency. Blockchain technology solved the double-spending problem without any central authority.', fact:'The genesis block contained a hidden newspaper headline about bank bailouts \u2014 a deliberate political statement!' }
  ];

  var simSteps = [
    { id:'sim-s1', title:'Transaction Created',  icon:'\u{1F4CB}' },
    { id:'sim-s2', title:'Broadcast to Network',  icon:'\u{1F4E1}' },
    { id:'sim-s3', title:'Block Formation',       icon:'\u{1F4E6}' },
    { id:'sim-s4', title:'Network Validation',    icon:'\u2705' },
    { id:'sim-s5', title:'Consensus Reached',     icon:'\u{1F91D}' },
    { id:'sim-s6', title:'Block Added to Chain',  icon:'\u{1F517}' },
    { id:'sim-s7', title:'Transaction Confirmed',  icon:'\u2728' }
  ];

  var topics = [
    { id:'bt-mining', title:'Mining', key:'mining', content:['Bitcoin mining is the process of adding new transactions to the blockchain and releasing new Bitcoin into circulation. Miners compete to solve complex mathematical puzzles using specialized hardware.','When a miner solves the puzzle first, they broadcast the solution to the network. Other nodes verify the answer, and if consensus is reached, the miner earns a block reward plus transaction fees.'], points:['Requires specialized ASIC hardware','Consumes significant electricity','Block reward started at 50 BTC','Secures the network against attacks','Difficulty adjusts every 2,016 blocks'] },
    { id:'bt-hashing', title:'Hashing', key:'hashing', content:['Bitcoin uses SHA-256 (Secure Hash Algorithm 256-bit) to create a unique digital fingerprint for every block. Even a tiny change in input data produces a completely different hash output.','This one-way function makes it virtually impossible to reverse-engineer the original data from its hash, which is fundamental to blockchain security and immutability.'], points:['SHA-256 produces a 64-character hex string','Deterministic \u2014 same input always yields same output','Avalanche effect \u2014 tiny change = totally different hash','One-way function \u2014 cannot be reversed','Used for mining proof-of-work'] },
    { id:'bt-difficulty', title:'Difficulty Adjustment', key:'difficulty', content:['Bitcoin\u2019s mining difficulty adjusts automatically every 2,016 blocks (roughly every two weeks). If blocks are being mined too quickly, difficulty increases; if too slowly, it decreases.','This self-regulating mechanism ensures that new blocks are found approximately every 10 minutes on average, regardless of how many miners join or leave the network.'], points:['Recalibrates every 2,016 blocks (~2 weeks)','Targets 10-minute average block time','Increases when hashrate rises','Prevents inflation rate from fluctuating','Key to Bitcoin\u2019s predictable monetary policy'] },
    { id:'bt-halving', title:'Halving', key:'halving', content:['Every 210,000 blocks (about 4 years), the block reward given to miners is cut in half. This event is called a "halving" and is hardcoded into Bitcoin\u2019s protocol.','Halvings reduce the rate of new Bitcoin supply, creating a deflationary pressure. Historically, halvings have been followed by significant price increases in subsequent months.'], points:['Occurs every 210,000 blocks (~4 years)','2024 halving: reward dropped to 3.125 BTC','Controls Bitcoin\u2019s inflation schedule','Supply will approach 21 million asymptotically','Final halving expected around year 2140'] },
    { id:'bt-supply', title:'Supply Cap', key:'supply', content:['Bitcoin has a hard-coded maximum supply of 21 million coins. Unlike fiat currencies that central banks can print in unlimited quantities, no one can create additional Bitcoin beyond this cap.','This scarcity is a fundamental economic design choice. As of 2024, over 19.5 million BTC have been mined, leaving roughly 1.5 million to be released over the coming decades.'], points:['Hard cap of exactly 21,000,000 BTC','Over 92% already mined','Last new Bitcoin expected around 2140','Deflationary by design','Contrasts with unlimited fiat printing'] },
    { id:'bt-decentralization', title:'Decentralization', key:'decentralization', content:['Bitcoin operates on a peer-to-peer network of thousands of nodes worldwide. No single entity, government, or corporation controls the network \u2014 every participant follows the same consensus rules.','This decentralization makes Bitcoin censorship-resistant. No one can freeze your wallet, block a transaction, or change the rules without broad network agreement.'], points:['Over 15,000 reachable full nodes','No central authority or single point of failure','Open-source \u2014 anyone can verify the code','Censorship-resistant transactions','Geographically distributed mining'] },
    { id:'bt-consensus', title:'Consensus', key:'consensus', content:['Bitcoin uses Proof-of-Work (PoW) consensus. Miners expend computational energy to prove they\u2019ve done real work, and the longest valid chain is accepted as truth by all nodes.','This elegant mechanism solves the Byzantine Generals Problem in a trustless environment, ensuring all honest participants agree on the state of the ledger without needing to trust each other.'], points:['Proof-of-Work is the consensus mechanism','Longest chain rule resolves conflicts','51% attack theoretically possible but impractical','Nakamoto Consensus combines PoW + longest chain','Energy cost makes attacks economically irrational'] }
  ];

  var svgIcons = {
    mining:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    hashing:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    difficulty:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    halving:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    supply:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
    decentralization:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="9.5" y1="10.5" x2="5.5" y2="7"/><line x1="14.5" y1="10.5" x2="18.5" y2="7"/><line x1="9.5" y1="13.5" x2="5.5" y2="17"/><line x1="14.5" y1="13.5" x2="18.5" y2="17"/></svg>',
    consensus:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'
  };

  function tlHTML() {
    return milestones.map(function(m, i) {
      return '<div class="tl-milestone" data-action="expand-milestone" data-id="' + m.id + '">' +
        '<div class="tl-dot' + (i === 0 ? ' tl-dot-active' : '') + '"><span class="tl-dot-inner"></span></div>' +
        '<div class="tl-year">' + m.year + '</div>' +
        '<div class="tl-label">' + m.title + '</div>' +
        '<div class="tl-expand" id="tl-expand-' + m.id + '" style="display:none;">' +
          '<div class="card card-glass tl-detail-card animate-fade-in">' +
            '<h4>' + m.title + ' <span class="badge badge-blue">' + m.year + '</span></h4>' +
            '<p>' + m.desc + '</p>' +
            '<div class="tl-fun-fact">\u{1F4A1} <strong>Fun Fact:</strong> ' + m.fact + '</div>' +
            '<button class="btn btn-success btn-sm" data-action="complete-milestone" data-id="' + m.id + '" data-module="history" data-xp="10">Mark Complete +10 XP</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function stepsHTML() {
    return simSteps.map(function(s, i) {
      return '<div class="sim-step card card-glass" id="' + s.id + '" data-step="' + i + '">' +
        '<div class="sim-step-icon">' + s.icon + '</div>' +
        '<div class="sim-step-title">' + s.title + '</div>' +
      '</div>';
    }).join('');
  }

  function interactiveHTML(key) {
    switch (key) {
      case 'mining':
        return '<div class="interactive-visual mining-visual">' +
          '<div class="mining-pickaxe">\u26CF\uFE0F</div>' +
          '<div class="mining-blocks"><span class="mine-block mb-1">\u{1F48E}</span><span class="mine-block mb-2">\u{1FA99}</span><span class="mine-block mb-3">\u{1F4B0}</span></div>' +
          '<div class="mining-hash">a3f2...8c1d</div></div>';
      case 'hashing':
        return '<div class="interactive-visual hashing-visual">' +
          '<div class="form-group" style="display:flex;gap:8px;align-items:flex-end;">' +
            '<input type="text" class="form-input" id="hash-input" placeholder="Type anything to hash..." style="flex:1;" />' +
            '<button class="btn btn-primary btn-sm" data-action="compute-hash">Hash It</button>' +
          '</div>' +
          '<div class="hash-output" id="hash-output">Enter text above to see its SHA-256 hash</div></div>';
      case 'difficulty':
        return '<div class="interactive-visual difficulty-visual">' +
          '<label>Mining Difficulty</label>' +
          '<input type="range" min="1" max="10" value="3" id="difficulty-slider" data-action="adjust-difficulty" />' +
          '<div class="difficulty-target"><span>Target:</span>' +
            '<div class="difficulty-bar"><div class="difficulty-fill" id="difficulty-fill" style="width:30%"></div></div>' +
            '<span id="difficulty-label">Easy</span></div>' +
          '<div class="difficulty-info" id="difficulty-info">Difficulty 3 \u2014 moderate mining effort</div></div>';
      case 'halving':
        return '<div class="interactive-visual halving-visual"><div class="halving-timeline">' +
          '<div class="hv-item"><span class="hv-year">2012</span><span class="hv-reward">25 BTC</span></div>' +
          '<div class="hv-arrow">\u2192</div>' +
          '<div class="hv-item"><span class="hv-year">2016</span><span class="hv-reward">12.5 BTC</span></div>' +
          '<div class="hv-arrow">\u2192</div>' +
          '<div class="hv-item hv-current"><span class="hv-year">2024</span><span class="hv-reward">3.125 BTC</span></div>' +
          '<div class="hv-arrow">\u2192</div>' +
          '<div class="hv-item hv-future"><span class="hv-year">~2028</span><span class="hv-reward">~1.56 BTC</span></div></div></div>';
      case 'supply':
        return '<div class="interactive-visual supply-visual">' +
          '<div class="supply-counter" id="supply-counter">19,600,000</div>' +
          '<div class="supply-label">of 21,000,000 BTC mined</div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:93.3%"></div></div>' +
          '<button class="btn btn-primary btn-sm" data-action="animate-supply">Watch Supply Grow</button></div>';
      case 'decentralization':
        return '<div class="interactive-visual decent-visual"><div class="node-network">' +
          '<div class="node-dot" style="top:10%;left:20%"></div><div class="node-dot" style="top:25%;left:70%"></div>' +
          '<div class="node-dot" style="top:60%;left:15%"></div><div class="node-dot" style="top:50%;left:55%"></div>' +
          '<div class="node-dot" style="top:80%;left:40%"></div><div class="node-dot" style="top:75%;left:80%"></div>' +
          '<div class="node-dot" style="top:40%;left:40%"></div>' +
          '<svg class="node-lines" viewBox="0 0 100 100" preserveAspectRatio="none">' +
            '<line x1="20" y1="10" x2="70" y2="25"/><line x1="70" y1="25" x2="55" y2="50"/>' +
            '<line x1="20" y1="10" x2="40" y2="40"/><line x1="40" y1="40" x2="15" y2="60"/>' +
            '<line x1="40" y1="40" x2="55" y2="50"/><line x1="55" y1="50" x2="40" y2="80"/>' +
            '<line x1="55" y1="50" x2="80" y2="75"/><line x1="15" y1="60" x2="40" y2="80"/>' +
            '<line x1="40" y1="80" x2="80" y2="75"/>' +
          '</svg></div></div>';
      case 'consensus':
        return '<div class="interactive-visual consensus-visual">' +
          '<div class="consensus-votes"><div class="vote-group">' +
            '<span class="vote-yes">\u{1F44D}</span><span class="vote-yes">\u{1F44D}</span><span class="vote-yes">\u{1F44D}</span>' +
            '<span class="vote-yes">\u{1F44D}</span><span class="vote-yes">\u{1F44D}</span><span class="vote-no">\u{1F44E}</span>' +
            '<span class="vote-yes">\u{1F44D}</span></div></div>' +
          '<div class="consensus-result">Consensus: <strong style="color:#4ade80">Approved (6/7)</strong></div></div>';
      default: return '';
    }
  }

  function topicCardsHTML() {
    return topics.map(function(t, i) {
      var icon = svgIcons[t.key] || '';
      var paras = t.content.map(function(p) { return '<p>' + p + '</p>'; }).join('');
      var bullets = t.points.map(function(b) { return '<li>' + b + '</li>'; }).join('');
      return '<div class="topic-card card card-glass animate-fade-in-up stagger-' + ((i % 6) + 1) + '">' +
        '<div class="topic-card-header"><span class="topic-icon">' + icon + '</span><h3>' + t.title + '</h3></div>' +
        '<div class="topic-card-body">' + paras + '</div>' +
        '<ul class="topic-bullets">' + bullets + '</ul>' +
        '<div class="topic-interactive">' + interactiveHTML(t.key) + '</div>' +
        '<button class="btn btn-success btn-sm" data-action="mark-read" data-id="' + t.id + '" data-module="bitcoin" data-xp="15">Mark as Read +15 XP</button>' +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════════
     RETURN COMPLETE HTML
     Inline <style> for timeline, blockchain, and topic-specific
     components that aren't covered by the global stylesheet.
     ═══════════════════════════════════════════════════════════ */
  return '<style>' +
    /* ═══ Timeline ═══ */
    '.tl-container{position:relative;padding:40px 20px 20px;overflow-x:auto;-webkit-overflow-scrolling:touch}' +
    '.tl-track{display:flex;align-items:flex-start;min-width:max-content;position:relative;padding:0 40px}' +
    '.tl-track::before{content:"";position:absolute;top:18px;left:40px;right:40px;height:4px;' +
      'background:linear-gradient(90deg,#f59e0b,#6366f1,#10b981,#6366f1,#f59e0b);border-radius:2px;z-index:0}' +
    '.tl-milestone{display:flex;flex-direction:column;align-items:center;min-width:140px;position:relative;z-index:1;cursor:pointer}' +
    '.tl-dot{width:40px;height:40px;border-radius:50%;background:var(--bg-secondary,#1a1a2e);' +
      'border:3px solid var(--border-color,#2a2a4a);display:flex;align-items:center;justify-content:center;transition:all .3s}' +
    '.tl-dot-inner{width:12px;height:12px;border-radius:50%;background:var(--text-secondary,#888);transition:all .3s}' +
    '.tl-dot-active .tl-dot-inner,.tl-milestone:hover .tl-dot-inner{background:#6366f1;box-shadow:0 0 12px rgba(99,102,241,.6)}' +
    '.tl-dot-completed{border-color:#10b981!important}' +
    '.tl-dot-completed .tl-dot-inner{background:#10b981!important;box-shadow:0 0 12px rgba(16,185,129,.6)!important}' +
    '.tl-milestone:hover .tl-dot{border-color:#6366f1;transform:scale(1.15)}' +
    '.tl-year{margin-top:10px;font-size:.75rem;color:var(--text-secondary,#888);font-weight:600;white-space:nowrap}' +
    '.tl-label{font-size:.85rem;font-weight:600;color:var(--text-primary,#e2e8f0);white-space:nowrap;margin-top:2px}' +
    '.tl-expand{position:absolute;top:70px;left:50%;transform:translateX(-50%);width:320px;z-index:10}' +
    '.tl-detail-card{padding:16px;text-align:left}' +
    '.tl-detail-card h4{margin:0 0 8px;font-size:1rem;color:var(--text-primary,#e2e8f0)}' +
    '.tl-detail-card p{margin:0 0 10px;font-size:.85rem;color:var(--text-secondary,#94a3b8);line-height:1.5}' +
    '.tl-fun-fact{background:rgba(99,102,241,.1);border-left:3px solid #6366f1;padding:8px 12px;' +
      'border-radius:0 6px 6px 0;font-size:.8rem;color:var(--text-secondary,#94a3b8);margin-bottom:12px}' +

    /* ═══ Simulator ═══ */
    '.sim-form{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:24px}' +
    '.sim-form .form-group{flex:1;min-width:120px;margin-bottom:0}' +
    '.sim-steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px}' +
    '.sim-step{padding:16px 12px;text-align:center;opacity:.4;transition:all .5s;border:2px solid transparent}' +
    '.sim-step.sim-active{opacity:1;border-color:#6366f1;background:rgba(99,102,241,.1);transform:translateY(-4px)}' +
    '.sim-step.sim-done{opacity:.8;border-color:#10b981;background:rgba(16,185,129,.05)}' +
    '.sim-step-icon{font-size:1.8rem;margin-bottom:6px}' +
    '.sim-step-title{font-size:.78rem;font-weight:600;color:var(--text-primary,#e2e8f0)}' +

    /* ═══ Blockchain Chain ═══ */
    '.blockchain-chain{display:flex;gap:0;overflow-x:auto;padding:20px 0;align-items:stretch}' +
    '.chain-block{min-width:180px;background:var(--bg-tertiary,#16162a);border:2px solid var(--border-color,#2a2a4a);' +
      'border-radius:8px;padding:12px;font-size:.72rem;animation:blockDrop .6s cubic-bezier(.34,1.56,.64,1);flex-shrink:0}' +
    '@keyframes blockDrop{0%{opacity:0;transform:translateY(-30px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}' +
    '.chain-link{display:flex;align-items:center;font-size:1.4rem;color:var(--text-secondary,#555);flex-shrink:0;padding:0 4px}' +
    '.chain-block-label{font-weight:700;color:#6366f1;margin-bottom:6px;font-size:.8rem}' +
    '.chain-block-row{display:flex;justify-content:space-between;margin-bottom:3px;color:var(--text-secondary,#94a3b8)}' +
    '.chain-block-row span:last-child{color:var(--text-primary,#e2e8f0);font-family:monospace;font-size:.68rem}' +
    '.genesis-block{border-color:#f59e0b}' +
    '.genesis-block .chain-block-label{color:#f59e0b}' +

    /* ═══ Topic Cards ═══ */
    '.topics-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px}' +
    '.topic-card{padding:0;overflow:hidden}' +
    '.topic-card-header{display:flex;align-items:center;gap:10px;padding:16px 20px 8px}' +
    '.topic-icon{display:flex;align-items:center;justify-content:center;width:44px;height:44px;' +
      'border-radius:10px;background:rgba(99,102,241,.15);color:#818cf8;flex-shrink:0}' +
    '.topic-card-header h3{margin:0;font-size:1.1rem;color:var(--text-primary,#e2e8f0)}' +
    '.topic-card-body{padding:8px 20px;font-size:.85rem;color:var(--text-secondary,#94a3b8);line-height:1.6}' +
    '.topic-card-body p{margin:0 0 8px}' +
    '.topic-bullets{padding:4px 20px 8px 36px;font-size:.8rem;color:var(--text-secondary,#94a3b8);line-height:1.7}' +
    '.topic-interactive{padding:12px 20px;margin:4px 12px;background:rgba(0,0,0,.2);border-radius:8px}' +
    '.topic-card>.btn{margin:12px 20px 16px}' +

    /* ═══ Interactive Visuals ═══ */
    '.mining-visual{text-align:center}' +
    '.mining-pickaxe{font-size:2rem;animation:mineSwing 1s ease-in-out infinite;display:inline-block}' +
    '@keyframes mineSwing{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}' +
    '.mining-blocks{display:flex;gap:10px;justify-content:center;margin:8px 0}' +
    '.mine-block{font-size:1.5rem;animation:blockPulse 1.5s ease-in-out infinite}' +
    '.mb-1{animation-delay:0s}.mb-2{animation-delay:.3s}.mb-3{animation-delay:.6s}' +
    '@keyframes blockPulse{0%,100%{opacity:.4;transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}}' +
    '.mining-hash{font-family:monospace;font-size:.8rem;color:#4ade80;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:4px}' +
    '.hash-output{font-family:monospace;font-size:.78rem;color:#4ade80;background:rgba(0,0,0,.4);' +
      'padding:10px 14px;border-radius:6px;word-break:break-all;margin-top:8px;min-height:38px}' +
    '.difficulty-visual label{font-size:.8rem;color:var(--text-secondary);display:block;margin-bottom:4px}' +
    '.difficulty-visual input[type="range"]{width:100%;accent-color:#6366f1}' +
    '.difficulty-target{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:.8rem}' +
    '.difficulty-bar{flex:1;height:10px;background:rgba(0,0,0,.3);border-radius:5px;overflow:hidden}' +
    '.difficulty-fill{height:100%;background:linear-gradient(90deg,#10b981,#f59e0b,#ef4444);transition:width .3s;border-radius:5px}' +
    '.difficulty-info{font-size:.75rem;color:var(--text-secondary);margin-top:6px}' +
    '.halving-timeline{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center}' +
    '.hv-item{text-align:center;padding:8px 10px;border-radius:8px;background:rgba(99,102,241,.1);min-width:70px}' +
    '.hv-item.hv-current{background:rgba(99,102,241,.25);border:1px solid #6366f1}' +
    '.hv-item.hv-future{opacity:.5}' +
    '.hv-year{display:block;font-weight:700;font-size:.8rem;color:var(--text-primary)}' +
    '.hv-reward{display:block;font-size:.72rem;color:#f59e0b;margin-top:2px}' +
    '.hv-arrow{color:var(--text-secondary);font-size:1.2rem}' +
    '.supply-counter{font-size:2rem;font-weight:800;color:#f59e0b;text-align:center;font-variant-numeric:tabular-nums}' +
    '.supply-label{text-align:center;font-size:.8rem;color:var(--text-secondary);margin-bottom:8px}' +
    '.node-network{position:relative;height:120px;background:rgba(0,0,0,.2);border-radius:8px;overflow:hidden}' +
    '.node-dot{position:absolute;width:12px;height:12px;border-radius:50%;background:#6366f1;' +
      'box-shadow:0 0 8px rgba(99,102,241,.6);animation:nodePulse 2s ease-in-out infinite}' +
    '.node-dot:nth-child(odd){animation-delay:.5s}.node-dot:nth-child(3n){animation-delay:1s}' +
    '@keyframes nodePulse{0%,100%{box-shadow:0 0 4px rgba(99,102,241,.4)}50%{box-shadow:0 0 14px rgba(99,102,241,.9)}}' +
    '.node-lines{position:absolute;inset:0;width:100%;height:100%}' +
    '.node-lines line{stroke:#6366f1;stroke-width:.5;opacity:.3}' +
    '.consensus-votes{text-align:center;margin-bottom:8px}' +
    '.vote-group{display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center}' +
    '.vote-yes,.vote-no{font-size:1.4rem;animation:voteIn .3s ease-out backwards}' +
    '.vote-yes:nth-child(1){animation-delay:.1s}.vote-yes:nth-child(2){animation-delay:.2s}' +
    '.vote-yes:nth-child(3){animation-delay:.3s}.vote-yes:nth-child(4){animation-delay:.4s}' +
    '.vote-yes:nth-child(5){animation-delay:.5s}.vote-no:nth-child(6){animation-delay:.6s}' +
    '.vote-yes:nth-child(7){animation-delay:.7s}' +
    '@keyframes voteIn{0%{opacity:0;transform:scale(0) rotate(-30deg)}100%{opacity:1;transform:scale(1) rotate(0)}}' +
    '.consensus-result{text-align:center;font-size:.85rem;color:var(--text-secondary)}' +

    /* ═══ Quiz ═══ */
    '.learning-quiz{padding:24px;margin-top:24px}' +
    '.learning-quiz h3{margin:0 0 16px;font-size:1.1rem}' +
    '.quiz-question{font-size:.95rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin-bottom:12px}' +
    '.quiz-options{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}' +
    '.quiz-option{flex:1 1 200px}' +
    '.quiz-option.quiz-correct{background:#10b981!important;color:#fff!important;border-color:#10b981!important;pointer-events:none}' +
    '.quiz-option.quiz-wrong{background:#ef4444!important;color:#fff!important;border-color:#ef4444!important;pointer-events:none}' +
    '.quiz-option:disabled{opacity:.5;pointer-events:none}' +
    '.quiz-feedback{padding:10px 14px;border-radius:6px;font-size:.85rem;margin-top:4px}' +
    '.quiz-feedback.correct{background:rgba(16,185,129,.15);color:#4ade80;border-left:3px solid #10b981}' +
    '.quiz-feedback.wrong{background:rgba(239,68,68,.15);color:#f87171;border-left:3px solid #ef4444}' +
    '.quiz-q+.quiz-q{margin-top:20px;padding-top:20px;border-top:1px solid var(--border-color,#2a2a4a)}' +
    '.module-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;' +
      'padding-top:20px;border-top:1px solid var(--border-color,#2a2a4a);flex-wrap:wrap;gap:8px}' +
    '.module-progress-text{font-size:.85rem;color:var(--text-secondary,#94a3b8)}' +

    /* ═══ Responsive ═══ */
    '@media(max-width:640px){' +
      '.tl-expand{width:260px;left:50%;transform:translateX(-50)}' +
      '.topics-grid{grid-template-columns:1fr}' +
      '.sim-form{flex-direction:column}.sim-form .form-group{min-width:100%}' +
      '.quiz-options{flex-direction:column}.quiz-option{flex:auto}' +
      '.halving-timeline{flex-direction:column}.hv-arrow{transform:rotate(90deg)}' +
    '}' +
  '</style>' +

  /* ═══════════════════════════════════════════════════════════
     PAGE CONTAINER
     ═══════════════════════════════════════════════════════════ */
  '<div class="page-container animate-fade-in">' +

    /* ── Page Header with overall progress ── */
    '<div class="page-header">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">' +
        '<div>' +
          '<h1 style="margin:0 0 6px;">Learning Hub</h1>' +
          '<p style="margin:0;color:var(--text-secondary,#94a3b8);font-size:.95rem;">Master cryptocurrency and blockchain fundamentals through interactive lessons</p>' +
        '</div>' +
        '<div style="text-align:right;min-width:200px;">' +
          '<div style="font-size:.8rem;color:var(--text-secondary);margin-bottom:4px;">Overall Progress</div>' +
          '<div class="progress-bar" style="height:14px;">' +
            '<div class="progress-fill" id="learning-overall-progress" style="width:' + overall + '%"></div>' +
          '</div>' +
          '<div style="font-size:.75rem;color:var(--text-secondary);margin-top:4px;" id="learning-overall-label">' + overall + '% Complete</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* ── Tab Navigation ── */
    '<div class="tabs" style="margin-bottom:24px;">' +
      '<button class="tab tab-active" data-action="switch-module-tab" data-tab="module-history">History of Money</button>' +
      '<button class="tab" data-action="switch-module-tab" data-tab="module-blockchain">Blockchain Explained</button>' +
      '<button class="tab" data-action="switch-module-tab" data-tab="module-bitcoin">How Bitcoin Works</button>' +
    '</div>' +

    /* ══════════════════════════════════════════════════════════
       MODULE 1: HISTORY OF MONEY
       Horizontal scrollable timeline with 7 clickable milestones.
       ══════════════════════════════════════════════════════════ */
    '<div class="module-panel" id="module-history">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">' +
      '<div>' +
        '<h2 style="margin:0 0 4px;">History of Money</h2>' +
        '<p style="margin:0;font-size:.85rem;color:var(--text-secondary);">From Barter to Bitcoin \u2014 Understanding How Money Evolved</p>' +
      '</div>' +
      '<span class="badge badge-blue" id="mod1-progress-badge">' + p1 + '% Complete</span>' +
    '</div>' +
    '<div class="progress-bar" style="margin-bottom:24px;height:8px;">' +
      '<div class="progress-fill" id="mod1-progress-bar" style="width:' + p1 + '%"></div>' +
    '</div>' +
    '<div class="card card-glass" style="padding:20px 0;">' +
      '<div class="tl-container"><div class="tl-track" id="timeline-track">' + tlHTML() + '</div></div>' +
    '</div>' +

    /* Module 1 Quiz */
    '<div class="card card-glass learning-quiz animate-fade-in" id="quiz-module1">' +
      '<h3>\u{1F9E0} Quick Check</h3>' +
      '<div class="quiz-q" id="quiz-h-q1">' +
        '<p class="quiz-question">Which form of money came first?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q1" data-correct="false">Gold coins</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q1" data-correct="false">Paper currency</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q1" data-correct="true">Barter system</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q1" data-correct="false">Cryptocurrency</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-h-q1-history" style="display:none;"></div>' +
      '</div>' +
      '<div class="quiz-q" id="quiz-h-q2">' +
        '<p class="quiz-question">Where was the first paper money invented?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q2" data-correct="true">China</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q2" data-correct="false">Italy</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q2" data-correct="false">Sweden</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q2" data-correct="false">England</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-h-q2-history" style="display:none;"></div>' +
      '</div>' +
      '<div class="quiz-q" id="quiz-h-q3">' +
        '<p class="quiz-question">What does the Latin word "salarium" (origin of "salary") refer to?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q3" data-correct="true">Salt</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q3" data-correct="false">Silver</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q3" data-correct="false">Sand</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="history" data-question="h-q3" data-correct="false">Silk</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-h-q3-history" style="display:none;"></div>' +
      '</div>' +
    '</div>' +

    '<div class="module-nav">' +
      '<span class="module-progress-text">Module 1 of 3</span>' +
      '<button class="btn btn-primary" data-action="switch-module-tab" data-tab="module-blockchain">Next: Blockchain Explained \u2192</button>' +
    '</div>' +
  '</div>' +

  /* ══════════════════════════════════════════════════════════
       MODULE 2: BLOCKCHAIN EXPLAINED
       Transaction simulator with animated step cards and
       a growing blockchain visualization.
       ══════════════════════════════════════════════════════════ */
    '<div class="module-panel" id="module-blockchain" style="display:none;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">' +
      '<div>' +
        '<h2 style="margin:0 0 4px;">Blockchain Explained</h2>' +
        '<p style="margin:0;font-size:.85rem;color:var(--text-secondary);">How Transactions Work on a Decentralized Network</p>' +
      '</div>' +
      '<span class="badge badge-purple" id="mod2-progress-badge">' + p2 + '% Complete</span>' +
    '</div>' +
    '<div class="progress-bar" style="margin-bottom:24px;height:8px;">' +
      '<div class="progress-fill" id="mod2-progress-bar" style="width:' + p2 + '%"></div>' +
    '</div>' +

    '<div class="card card-glass" style="padding:20px;margin-bottom:20px;">' +
      '<h3 style="margin:0 0 16px;">Transaction Simulator</h3>' +
      '<div class="sim-form">' +
        '<div class="form-group"><label>Sender</label><select class="form-select" id="sim-sender"><option value="Alice">Alice</option><option value="Bob">Bob</option><option value="Carol">Carol</option><option value="Dave">Dave</option></select></div>' +
        '<div class="form-group"><label>Receiver</label><select class="form-select" id="sim-receiver"><option value="Bob">Bob</option><option value="Alice">Alice</option><option value="Carol">Carol</option><option value="Dave">Dave</option></select></div>' +
        '<div class="form-group"><label>Amount (BTC)</label><input type="number" class="form-input" id="sim-amount" value="0.5" min="0.001" step="0.001" /></div>' +
        '<div class="form-group" style="flex:0 0 auto;"><label>&nbsp;</label><button class="btn btn-primary" data-action="create-transaction">Create Transaction</button></div>' +
      '</div>' +
      '<div class="sim-steps-grid" id="sim-steps-grid">' + stepsHTML() + '</div>' +
      '<div class="card" id="sim-detail" style="display:none;padding:16px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);"><div id="sim-detail-content"></div></div>' +
    '</div>' +

    '<div class="card card-glass" style="padding:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<h3 style="margin:0;">Blockchain</h3>' +
        '<button class="btn btn-secondary btn-sm" data-action="reset-chain">Reset Chain</button>' +
      '</div>' +
      '<div class="blockchain-chain" id="blockchain-chain">' +
        '<div class="chain-block genesis-block">' +
          '<div class="chain-block-label">Genesis Block</div>' +
          '<div class="chain-block-row"><span>Hash:</span><span>000000000019...</span></div>' +
          '<div class="chain-block-row"><span>Prev:</span><span>000000000000...</span></div>' +
          '<div class="chain-block-row"><span>Time:</span><span>2009-01-03</span></div>' +
          '<div class="chain-block-row"><span>Txns:</span><span>1</span></div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:.8rem;color:var(--text-secondary);margin-top:8px;" id="chain-stats">Chain height: 1 block</div>' +
    '</div>' +

    '<div class="module-nav">' +
      '<button class="btn btn-secondary" data-action="switch-module-tab" data-tab="module-history">\u2190 History of Money</button>' +
      '<span class="module-progress-text">Module 2 of 3</span>' +
      '<button class="btn btn-primary" data-action="switch-module-tab" data-tab="module-bitcoin">Next: How Bitcoin Works \u2192</button>' +
    '</div>' +
  '</div>' +

  /* ══════════════════════════════════════════════════════════
       MODULE 3: HOW BITCOIN WORKS
       Seven topic cards with inline SVG icons, key points,
       interactive CSS visuals, and a mini quiz.
       ══════════════════════════════════════════════════════════ */
    '<div class="module-panel" id="module-bitcoin" style="display:none;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">' +
      '<div>' +
        '<h2 style="margin:0 0 4px;">How Bitcoin Works</h2>' +
        '<p style="margin:0;font-size:.85rem;color:var(--text-secondary);">The Technical and Economic Design of the World\u2019s First Cryptocurrency</p>' +
      '</div>' +
      '<span class="badge badge-green" id="mod3-progress-badge">' + p3 + '% Complete</span>' +
    '</div>' +
    '<div class="progress-bar" style="margin-bottom:24px;height:8px;">' +
      '<div class="progress-fill" id="mod3-progress-bar" style="width:' + p3 + '%"></div>' +
    '</div>' +

    '<div class="topics-grid" id="topics-grid">' + topicCardsHTML() + '</div>' +

    /* Module 3 Quiz */
    '<div class="card card-glass learning-quiz animate-fade-in" id="quiz-module3">' +
      '<h3>\u{1F9E0} Module 3 Quiz</h3>' +
      '<div class="quiz-q" id="quiz-bt-q1">' +
        '<p class="quiz-question">What does SHA-256 stand for?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q1" data-correct="false">Super Hashing Algorithm 256</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q1" data-correct="false">System Hash Architecture v256</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q1" data-correct="true">Secure Hash Algorithm 256-bit</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q1" data-correct="false">Simple Hash Address 256</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-bt-q1-bitcoin" style="display:none;"></div>' +
      '</div>' +
      '<div class="quiz-q" id="quiz-bt-q2">' +
        '<p class="quiz-question">What happens to the block reward during a halving?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q2" data-correct="true">It is cut in half</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q2" data-correct="false">It doubles</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q2" data-correct="false">It stays the same</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q2" data-correct="false">It resets to 50 BTC</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-bt-q2-bitcoin" style="display:none;"></div>' +
      '</div>' +
      '<div class="quiz-q" id="quiz-bt-q3">' +
        '<p class="quiz-question">What is Bitcoin\u2019s maximum supply?</p>' +
        '<div class="quiz-options">' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q3" data-correct="false">100 million</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q3" data-correct="false">Unlimited</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q3" data-correct="true">21 million</button>' +
          '<button class="btn btn-secondary quiz-option" data-action="quiz-answer" data-module="bitcoin" data-question="bt-q3" data-correct="false">1 billion</button>' +
        '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback-bt-q3-bitcoin" style="display:none;"></div>' +
      '</div>' +
    '</div>' +

    '<div class="module-nav">' +
      '<button class="btn btn-secondary" data-action="switch-module-tab" data-tab="module-blockchain">\u2190 Blockchain Explained</button>' +
      '<span class="module-progress-text">Module 3 of 3</span>' +
    '</div>' +
  '</div>' +

'</div>';
};