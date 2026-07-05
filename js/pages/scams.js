/**
 * CryptoVerse Academy — Scam Awareness Centre
 * =============================================
 * Four interactive scenario tabs teaching scam recognition:
 *   1. Rug Pull  – spot red flags in a fake project
 *   2. Pump & Dump – animated 5-stage timeline
 *   3. Fake Giveaway – identify phishing elements
 *   4. Myth Busters – 20+ flip cards debunking crypto myths
 *
 * Dependencies: window.Store, window.UI
 */
window.Pages = window.Pages || {};

window.Pages.scams = function () {
  'use strict';

  /* ── Rug Pull Red Flags ─────────────────────────────── */
  var rugFlags = [
    { id: 'rf-team', target: '.rug-team', label: 'Anonymous Team', hint: 'Click the team section', text: 'No real names, no LinkedIn profiles, only cartoon avatars. Legitimate projects have verifiable, doxxed team members with track records.' },
    { id: 'rf-github', target: '.rug-code', label: 'No GitHub / Audit', hint: 'Check the code link', text: 'The "View Code" link leads nowhere. Real projects publish open-source code on GitHub and get third-party smart contract audits.' },
    { id: 'rf-tokenomics', target: '.rug-tokenomics', label: 'Suspicious Tokenomics', hint: 'Examine the token distribution', text: 'Team holds 60% of tokens with no vesting schedule. This means they can dump on investors at any time. Legit projects lock team tokens.' },
    { id: 'rf-promises', target: '.rug-promises', label: 'Unrealistic Promises', hint: 'Read the guarantees', text: '"100x guaranteed returns" and "risk-free investment" are classic manipulation. All investment carries risk. Promises of guaranteed returns are always scams.' },
    { id: 'rf-community', target: '.rug-community', label: 'Fake Social Proof', hint: 'Check the community stats', text: '"50,000 holders" with zero actual engagement. The Telegram has 3 members. Scammers fabricate social proof to create false legitimacy.' }
  ];

  /* ── Pump & Dump Stages ────────────────────────────── */
  var pdStages = [
    { title: 'Stage 1: Artificial Hype', desc: 'Coordinators create dozens of fake social media accounts to post about a "hidden gem" token. Paid influencers shill it with code words. Memes and FOMO content flood Twitter and Telegram.', icon: '\uD83D\uDCE3', color: '#f59e0b' },
    { title: 'Stage 2: Rapid Buying', desc: 'The hype attracts retail investors who start buying. The price begins rising as early buyers pile in, thinking they found a great opportunity. Volume increases steadily.', icon: '\uD83D\uDCB0', color: '#22c55e' },
    { title: 'Stage 3: Price Spike', desc: 'The price rockets upward as more people FOMO in. Charts look incredible. The coordinators post screenshots of gains to attract even more buyers. This is the peak.', icon: '\uD83D\uDCC8', color: '#10b981' },
    { title: 'Stage 4: Whale Selling', desc: 'The organizers and early whales begin silently selling their large positions. Big sell orders appear on the order book. The price starts to slip but most holders are still optimistic.', icon: '\uD83D\uDCA0', color: '#f97316' },
    { title: 'Stage 5: Market Collapse', desc: 'Selling accelerates into a cascade. The price crashes 80-99% in minutes. The chat fills with confusion. The coordinators delete their accounts and disappear with millions.', icon: '\uD83D\uDCA9', color: '#ef4444' }
  ];

  /* ── Fake Giveaway Scenarios ───────────────────────── */
  var giveaways = [
    {
      id: 'g1', title: 'Elon Musk Bitcoin Giveaway',
      image: 'logo-placeholder',
      suspicious: [
        { label: 'Verified Badge', text: 'That blue checkmark is a screenshot, not a real verification. Elon Musk never does crypto giveaways. Official accounts have millions of followers, not a few hundred.' },
        { label: 'Send 0.1 BTC', text: 'Any scheme asking you to SEND crypto to RECEIVE more is a scam. Blockchain transactions are irreversible — once you send, your money is gone forever.' },
        { label: 'Limited Time Offer', text: 'Urgency is a classic manipulation tactic. Real giveaways don\'t need countdown timers. They\'re designed to make you act before thinking critically.' }
      ]
    },
    {
      id: 'g2', title: 'Free NFT Airdrop',
      image: 'nft-placeholder',
      suspicious: [
        { label: 'Connect Wallet Button', text: 'Clicking this would open a malicious smart contract that drains your wallet. Never connect your wallet to unverified sites. Check the URL carefully for typos.' },
        { label: 'Too Good to Be True', text: 'Free NFTs worth "$500 each" for just "connecting your wallet"? The economics don\'t make sense. If they\'re that valuable, why give them away?' },
        { label: 'No Official Link', text: 'This isn\'t linked from any official project website. Scammers create convincing copies of real project pages. Always verify through official channels.' }
      ]
    },
    {
      id: 'g3', title: 'Exchange Verification Phishing',
      image: 'exchange-placeholder',
      suspicious: [
        { label: 'Login Form', text: 'This fake login page captures your email and password. Real exchanges will never ask you to log in through a link in an email or DM. Always go directly to the exchange website.' },
        { label: 'KYC Upload Request', text: 'They\'re asking for your ID and selfie — this is identity theft. Legitimate exchanges handle KYC through their official app/website with encrypted uploads.' },
        { label: 'Threatening Message', text: '"Your account will be suspended" is a fear tactic. Real compliance notices come through official channels, not random emails with suspicious links.' }
      ]
    }
  ];

  /* ── Myth Busters ──────────────────────────────────── */
  var myths = [
    { myth: 'Bitcoin is completely anonymous', fact: 'Bitcoin is pseudonymous, not anonymous. Every transaction is recorded permanently on a public ledger. Law enforcement has successfully traced many criminal transactions using blockchain analysis tools.' },
    { myth: 'Crypto is only used for crime', fact: 'Less than 1% of cryptocurrency transactions are linked to illicit activity according to Chainalysis. The vast majority is used for legitimate trading, investment, payments, and DeFi applications.' },
    { myth: 'You can\'t lose money with DCA', fact: 'Dollar Cost Averaging reduces risk but doesn\'t eliminate it. If you DCA into an asset that eventually goes to zero, you still lose everything. DCA is a strategy, not a guarantee.' },
    { myth: 'Cryptocurrency has no intrinsic value', fact: 'Like fiat currency, crypto\'s value comes from utility and collective belief. Bitcoin has value as a censorship-resistant store of value and medium of exchange. ETH has value from powering smart contracts.' },
    { myth: 'Mining is bad for the environment', fact: 'While Bitcoin mining does consume energy, an increasing percentage comes from renewable sources. Mining also incentivizes the development of excess renewable energy infrastructure in remote locations.' },
    { myth: 'Crypto is a bubble that will crash to zero', fact: 'Cryptocurrency has survived multiple 80%+ crashes since 2011 and recovered to new highs each time. While individual coins can fail, the technology and major networks have shown resilience over 15+ years.' },
    { myth: 'You need to be a tech expert to use crypto', fact: 'Modern crypto wallets and exchanges are designed for beginners. Buying, holding, and sending crypto is now as easy as using a banking app. You don\'t need to understand the underlying technology to benefit from it.' },
    { myth: 'The government can easily ban crypto', fact: 'Bitcoin is decentralized — there\'s no central server to shut down. While governments can regulate exchanges, they cannot stop peer-to-peer transactions on the blockchain network itself.' },
    { myth: 'All altcoins are scams', fact: 'While many altcoins fail, some solve real problems. Ethereum enabled smart contracts, Solana offers fast transactions, Chainlink provides oracle services. Due diligence matters — not all projects are equal.' },
    { myth: 'If you lose your private key, someone can hack it', fact: 'Your private key is mathematically virtually impossible to guess (2^256 possibilities). The risk is losing access to YOUR OWN funds. Store backups securely — this is your responsibility in self-custody.' },
    { myth: 'Crypto transactions are instant and free', fact: 'Transaction speed and cost vary by network. Bitcoin takes ~10 minutes and has variable fees. Some networks (Solana, Polygon) are fast and cheap, but "instant and free" is oversimplified.' },
    { myth: 'You should invest all your savings in crypto', fact: 'Financial advisors recommend limiting crypto to 1-5% of your portfolio. Never invest more than you can afford to lose entirely. Diversification across asset classes is fundamental risk management.' },
    { myth: 'Blockchain is just a database', fact: 'Blockchain is a specific type of distributed ledger with immutable records, consensus mechanisms, and cryptographic security. Unlike traditional databases, no single entity controls or can alter the data.' },
    { myth: 'Crypto will replace all banks', fact: 'Cryptocurrency and traditional banking will likely coexist. DeFi complements rather than replaces banking services. Many banks are actually adopting blockchain technology themselves for settlements and compliance.' },
    { myth: 'The early adopter advantage is gone', fact: 'Crypto is still in early adoption. Only about 4-5% of the global population owns cryptocurrency. As institutions, governments, and more individuals adopt it, the ecosystem continues to grow.' },
    { myth: 'Staking is the same as mining', fact: 'Mining (PoW) uses computational power to validate transactions. Staking (PoS) locks coins as collateral to participate in consensus. They achieve the same goal through completely different mechanisms.' },
    { myth: 'A hardware wallet makes you 100% safe', fact: 'Hardware wallets protect against remote hacking but not against physical theft, phishing scams that trick you into signing malicious transactions, or forgetting your seed phrase. Security requires vigilance at every level.' },
    { myth: 'The crypto market is manipulated', fact: 'While manipulation exists (as in all financial markets), crypto is becoming more regulated and transparent. Major exchanges now have surveillance tools, and wash trading penalties are increasing.' },
    { myth: 'You need a lot of money to start investing', fact: 'You can start with as little as $1 on most exchanges. Many cryptocurrencies cost fractions of a cent. The barrier to entry is extremely low compared to traditional investing.' },
    { myth: 'Crypto is a get-rich-quick scheme', fact: 'Successful crypto investing requires research, patience, and risk management. Most people who treat it as a get-rich-quick scheme end up losing money. Long-term holders tend to do better than traders.' },
    { myth: 'DeFi is too risky for beginners', fact: 'While DeFi has risks (smart contract bugs, impermanent loss), basic activities like providing liquidity to blue-chip pools or lending stablecoins can be done with manageable risk. Start small and learn gradually.' }
  ];

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div'); d.textContent = s; return d.innerHTML;
  }

  /* ══════════════════════════════════════════════════════════
     BUILD HTML
     ══════════════════════════════════════════════════════════ */
  var html = '<style>' +
    /* Base */
    '.scam-page{max-width:1000px;margin:0 auto;padding:24px}' +
    '.scam-header{text-align:center;margin-bottom:28px}' +
    '.scam-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 6px}' +
    '.scam-header p{color:var(--text-secondary,#94a3b8);font-size:.95rem;margin:0}' +
    /* Tabs */
    '.scam-tabs{display:flex;gap:4px;margin-bottom:24px;background:var(--bg-card,rgba(30,41,59,.6));padding:4px;border-radius:12px;overflow-x:auto}' +
    '.scam-tab{flex:1;min-width:140px;padding:10px 16px;background:transparent;border:none;color:var(--text-secondary,#94a3b8);font-size:.85rem;font-weight:600;border-radius:8px;cursor:pointer;transition:all .2s;white-space:nowrap;text-align:center}' +
    '.scam-tab:hover{color:var(--text-primary,#e2e8f0)}' +
    '.scam-tab.active{background:var(--accent,#8b5cf6);color:#fff}' +
    '.scam-panel{display:none}' +
    '.scam-panel.active{display:block}' +
    /* Score */
    '.scam-score{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}' +
    '.scam-score-label{font-size:.85rem;color:var(--text-secondary,#94a3b8)}' +
    '.scam-score-value{font-size:1.25rem;font-weight:700;color:var(--accent,#8b5cf6)}' +
    '.scam-xp-badge{background:rgba(34,197,94,.15);color:#22c55e;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600}' +
    /* ── Rug Pull ── */
    '.rug-fake-site{background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #e94560;border-radius:16px;padding:24px;position:relative;overflow:hidden}' +
    '.rug-fake-site::before{content:"\u26A0\uFE0F INVESTIGATION MODE \u2014 Find 5 Red Flags";position:absolute;top:12px;right:12px;background:rgba(233,69,96,.2);color:#e94560;padding:4px 12px;border-radius:6px;font-size:.7rem;font-weight:700;letter-spacing:.05em}' +
    '.rug-fake-logo{font-size:2rem;font-weight:900;text-align:center;margin-bottom:4px;background:linear-gradient(90deg,#e94560,#f59e0b,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}' +
    '.rug-fake-tagline{text-align:center;color:#f59e0b;font-size:.85rem;margin-bottom:16px}' +
    '.rug-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}' +
    '.rug-cell{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:14px;cursor:pointer;transition:all .25s;position:relative}' +
    '.rug-cell:hover{border-color:#e94560;background:rgba(233,69,96,.05)}' +
    '.rug-cell.found{border-color:#e94560;background:rgba(233,69,96,.1)}' +
    '.rug-cell.found::after{content:"\u26D4 RED FLAG";position:absolute;top:6px;right:6px;background:#e94560;color:#fff;padding:2px 8px;border-radius:4px;font-size:.6rem;font-weight:700}' +
    '.rug-cell h4{font-size:.85rem;color:var(--text-primary,#e2e8f0);margin:0 0 4px}' +
    '.rug-cell p{font-size:.75rem;color:var(--text-secondary,#94a3b8);margin:0}' +
    '.rug-cell .rug-reveal{display:none;margin-top:8px;padding:8px;background:rgba(233,69,96,.1);border-left:3px solid #e94560;border-radius:0 6px 6px 0;font-size:.75rem;color:#fca5a5;line-height:1.5}' +
    '.rug-cell.found .rug-reveal{display:block}' +
    '.rug-cell.investigate-btn{display:flex;align-items:center;justify-content:center;min-height:80px;border-style:dashed}' +
    '.rug-progress{text-align:center;padding:16px;background:rgba(99,102,241,.08);border-radius:10px;margin-bottom:16px}' +
    '.rug-progress-text{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin-bottom:6px}' +
    '.rug-progress-bar{height:8px;background:rgba(148,163,184,.2);border-radius:4px;overflow:hidden}' +
    '.rug-progress-fill{height:100%;background:linear-gradient(90deg,#e94560,#f59e0b);border-radius:4px;transition:width .4s ease}' +
    '.rug-complete{text-align:center;padding:20px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;display:none}' +
    '.rug-complete h3{color:#22c55e;margin:0 0 8px}' +
    '.rug-complete p{color:var(--text-secondary,#94a3b8);font-size:.9rem;margin:0}' +
    /* ── Pump & Dump ── */
    '.pd-timeline{position:relative;padding-left:40px}' +
    '.pd-timeline::before{content:"";position:absolute;left:18px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#f59e0b,#22c55e,#ef4444);border-radius:2px}' +
    '.pd-stage{position:relative;margin-bottom:24px;opacity:.4;transition:opacity .5s}' +
    '.pd-stage.active,.pd-stage.completed{opacity:1}' +
    '.pd-stage-dot{position:absolute;left:-32px;top:4px;width:14px;height:14px;border-radius:50%;background:var(--bg-surface,#1e293b);border:3px solid #64748b;transition:all .3s;z-index:1}' +
    '.pd-stage.active .pd-stage-dot{border-color:#22c55e;background:#22c55e;box-shadow:0 0 12px rgba(34,197,94,.5)}' +
    '.pd-stage.completed .pd-stage-dot{border-color:#64748b;background:#64748b}' +
    '.pd-stage-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:18px;transition:all .3s}' +
    '.pd-stage.active .pd-stage-card{border-color:#22c55e;box-shadow:0 4px 20px rgba(34,197,94,.15)}' +
    '.pd-stage h3{font-size:1rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 4px;display:flex;align-items:center;gap:8px}' +
    '.pd-stage p{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin:0;line-height:1.5}' +
    '.pd-stage .pd-stage-icon{font-size:1.2rem}' +
    '.pd-controls{display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap}' +
    '.pd-btn{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-primary,#e2e8f0);padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.875rem;transition:all .2s}' +
    '.pd-btn:hover{background:var(--accent,#8b5cf6);border-color:var(--accent,#8b5cf6)}' +
    '.pd-btn.primary{background:var(--accent,#8b5cf6);border-color:var(--accent,#8b5cf6)}' +
    '.pd-btn:disabled{opacity:.4;cursor:not-allowed}' +
    /* ── Fake Giveaway ── */
    '.giveaway-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}' +
    '.giveaway-card{background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(233,69,96,.3);border-radius:14px;padding:20px;position:relative}' +
    '.giveaway-card h3{font-size:1rem;font-weight:600;color:#f59e0b;margin:0 0 4px;text-align:center}' +
    '.giveaway-card .giveaway-mock{background:rgba(0,0,0,.3);border-radius:10px;padding:16px;margin:12px 0;min-height:120px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px}' +
    '.giveaway-card .giveaway-mock .fake-logo{font-size:1.8rem;font-weight:900;color:#fff}' +
    '.giveaway-card .giveaway-mock .fake-text{font-size:.75rem;color:#94a3b8;text-align:center}' +
    '.giveaway-sus-item{background:rgba(233,69,96,.08);border:1px dashed rgba(233,69,96,.4);border-radius:8px;padding:10px 12px;margin-bottom:8px;cursor:pointer;transition:all .2s}' +
    '.giveaway-sus-item:hover{background:rgba(233,69,96,.15);border-color:#e94560}' +
    '.giveaway-sus-item.found{background:rgba(233,69,96,.15);border-style:solid;border-color:#e94560}' +
    '.giveaway-sus-item .sus-label{font-size:.8rem;font-weight:600;color:#fca5a5;margin-bottom:0}' +
    '.giveaway-sus-item .sus-explain{display:none;font-size:.75rem;color:#fca5a5;margin-top:6px;line-height:1.4;padding-top:6px;border-top:1px solid rgba(233,69,96,.2)}' +
    '.giveaway-sus-item.found .sus-explain{display:block}' +
    /* ── Myth Busters ── */
    '.myth-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}' +
    '.myth-card{perspective:800px;height:180px;cursor:pointer}' +
    '.myth-card-inner{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d}' +
    '.myth-card.flipped .myth-card-inner{transform:rotateY(180deg)}' +
    '.myth-card-front,.myth-card-back{position:absolute;inset:0;backface-visibility:hidden;border-radius:12px;padding:18px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}' +
    '.myth-card-front{background:linear-gradient(135deg,rgba(239,68,68,.15),rgba(249,115,22,.1));border:1px solid rgba(239,68,68,.25)}' +
    '.myth-card-front .myth-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#ef4444;margin-bottom:6px}' +
    '.myth-card-front .myth-text{font-size:.85rem;font-weight:600;color:var(--text-primary,#e2e8f0);line-height:1.4}' +
    '.myth-card-front .myth-hint{font-size:.7rem;color:var(--text-muted,#64748b);margin-top:8px}' +
    '.myth-card-back{background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08));border:1px solid rgba(34,197,94,.25);transform:rotateY(180deg)}' +
    '.myth-card-back .fact-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#22c55e;margin-bottom:6px}' +
    '.myth-card-back .fact-text{font-size:.8rem;color:var(--text-secondary,#94a3b8);line-height:1.5;overflow-y:auto;max-height:120px}' +
    '.myth-counter{text-align:center;margin-bottom:16px;font-size:.85rem;color:var(--text-secondary,#94a3b8)}' +
    '.myth-counter span{color:var(--accent,#8b5cf6);font-weight:700}' +
  '</style>';

  html += '<div class="scam-page">';

  /* ── Header ── */
  html += '<div class="scam-header">' +
    '<h1>\uD83D\uDD0D Scam Awareness Centre</h1>' +
    '<p>Learn to identify and avoid crypto scams through interactive scenarios</p>' +
  '</div>';

  /* ── Tabs ── */
  html += '<div class="scam-tabs">' +
    '<button class="scam-tab active" data-action="scam-tab" data-tab="rugpull">Rug Pull</button>' +
    '<button class="scam-tab" data-action="scam-tab" data-tab="pumpdump">Pump &amp; Dump</button>' +
    '<button class="scam-tab" data-action="scam-tab" data-tab="giveaway">Fake Giveaway</button>' +
    '<button class="scam-tab" data-action="scam-tab" data-tab="myths">Myth Busters</button>' +
  '</div>';

  /* ═══════ PANEL 1: RUG PULL ═══════ */
  html += '<div class="scam-panel active" id="scam-panel-rugpull">';

  html += '<div class="rug-progress" id="rug-progress">' +
    '<div class="rug-progress-text">Red Flags Found: <strong id="rug-count">0</strong> / 5</div>' +
    '<div class="rug-progress-bar"><div class="rug-progress-fill" id="rug-fill" style="width:0%"></div></div>' +
  '</div>';

  html += '<div class="rug-fake-site">' +
    '<div class="rug-fake-logo">\uD83D\uDE80 MoonRocket</div>' +
    '<div class="rug-fake-tagline">The next 1000x gem \u2022 Presale LIVE \u2022 Audit pending</div>' +
    '<div class="rug-grid">';

  /* Suspicious Team */
  html += '<div class="rug-cell rug-team" data-action="investigate-rug" data-flag="rf-team">' +
    '<h4>\uD83D\uDC65 Team</h4>' +
    '<p>CryptoKing99, BlockchainWhiz, DiamondHands_Dev</p>' +
    '<div class="rug-reveal">' + esc(rugFlags[0].text) + '</div>' +
  '</div>';

  /* Suspicious Code */
  html += '<div class="rug-cell rug-code" data-action="investigate-rug" data-flag="rf-github">' +
    '<h4>\uD83D\uDCBB Code &amp; Audit</h4>' +
    '<p>Code coming soon! Audit by "TopAudit" (pending)</p>' +
    '<div class="rug-reveal">' + esc(rugFlags[1].text) + '</div>' +
  '</div>';

  /* Suspicious Tokenomics */
  html += '<div class="rug-cell rug-tokenomics" data-action="investigate-rug" data-flag="rf-tokenomics">' +
    '<h4>\uD83D\uDCCA Tokenomics</h4>' +
    '<p>Team: 60% | Community: 25% | Liquidity: 10% | Marketing: 5%</p>' +
    '<div class="rug-reveal">' + esc(rugFlags[2].text) + '</div>' +
  '</div>';

  /* Suspicious Promises */
  html += '<div class="rug-cell rug-promises" data-action="investigate-rug" data-flag="rf-promises">' +
    '<h4>\uD83C\uDF1F Guarantees</h4>' +
    '<p>"100x guaranteed!" "Risk-free investment!" "You WILL retire early!"</p>' +
    '<div class="rug-reveal">' + esc(rugFlags[3].text) + '</div>' +
  '</div>';

  /* Suspicious Community */
  html += '<div class="rug-cell rug-community" data-action="investigate-rug" data-flag="rf-community" style="grid-column:1/-1">' +
    '<h4>\uD83C\uDF10 Community</h4>' +
    '<p>"50,000 holders" \u2022 Twitter: 1.2M followers \u2022 Telegram: 3 members \u2022 No GitHub stars</p>' +
    '<div class="rug-reveal">' + esc(rugFlags[4].text) + '</div>' +
  '</div>';

  html += '</div></div>'; /* .rug-grid .rug-fake-site */

  html += '<div class="rug-complete" id="rug-complete">' +
    '<h3>\u2705 Investigation Complete!</h3>' +
    '<p>You found all 5 red flags! You\'re getting good at spotting scams. <span class="scam-xp-badge">+25 XP</span></p>' +
  '</div>';

  html += '</div>'; /* #scam-panel-rugpull */

  /* ═══════ PANEL 2: PUMP & DUMP ═══════ */
  html += '<div class="scam-panel" id="scam-panel-pumpdump">';

  html += '<div class="scam-score">' +
    '<span class="scam-score-label">Stage Progress</span>' +
    '<span class="scam-score-value" id="pd-stage-label">0 / 5</span>' +
  '</div>';

  html += '<div class="pd-timeline">';
  pdStages.forEach(function (stage, i) {
    html += '<div class="pd-stage' + (i === 0 ? ' active' : '') + '" id="pd-stage-' + i + '">' +
      '<div class="pd-stage-dot"></div>' +
      '<div class="pd-stage-card">' +
        '<h3><span class="pd-stage-icon">' + stage.icon + '</span> ' + esc(stage.title) + '</h3>' +
        '<p>' + esc(stage.desc) + '</p>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';

  html += '<div class="pd-controls">' +
    '<button class="pd-btn" data-action="pd-prev" id="pd-prev" disabled>\u2190 Previous</button>' +
    '<button class="pd-btn" data-action="pd-autoplay" id="pd-autoplay">\u25B6 Auto-Play</button>' +
    '<button class="pd-btn primary" data-action="pd-next" id="pd-next">Next \u2192</button>' +
  '</div>';

  html += '<div class="rug-complete" id="pd-complete" style="margin-top:20px">' +
    '<h3>\u2705 Simulation Complete!</h3>' +
    '<p>Now you understand how pump &amp; dump schemes work. Always be skeptical of sudden hype! <span class="scam-xp-badge">+25 XP</span></p>' +
  '</div>';

  html += '</div>'; /* #scam-panel-pumpdump */

  /* ═══════ PANEL 3: FAKE GIVEAWAY ═══════ */
  html += '<div class="scam-panel" id="scam-panel-giveaway">';

  html += '<div class="scam-score">' +
    '<span class="scam-score-label">Suspicious Elements Found</span>' +
    '<span class="scam-score-value" id="giveaway-count">0</span>' +
    ' / 9' +
    '<span class="scam-xp-badge" style="margin-left:12px" id="giveaway-xp">+25 XP</span>' +
  '</div>';

  html += '<div class="giveaway-grid">';
  giveaways.forEach(function (g) {
    html += '<div class="giveaway-card">' +
      '<h3>' + esc(g.title) + '</h3>' +
      '<div class="giveaway-mock">' +
        '<div class="fake-logo">' + (g.id === 'g1' ? '\uD83D\uDE80' : g.id === 'g2' ? '\uD83C\uDFA8' : '\uD83C\uDFE6') + '</div>' +
        '<div class="fake-text">' + (g.id === 'g1' ? 'Send 0.1 BTC, get 1 BTC back!' : g.id === 'g2' ? 'Connect wallet to claim $500 NFTs!' : 'Verify your account or lose access!') + '</div>' +
      '</div>';
    g.suspicious.forEach(function (s, si) {
      html += '<div class="giveaway-sus-item" data-action="investigate-giveaway" data-giveaway="' + g.id + '" data-sus="' + si + '">' +
        '<div class="sus-label">\uD83D\uDD0D ' + esc(s.label) + '</div>' +
        '<div class="sus-explain">' + esc(s.text) + '</div>' +
      '</div>';
    });
    html += '</div>';
  });
  html += '</div>'; /* .giveaway-grid */

  html += '<div class="rug-complete" id="giveaway-complete" style="margin-top:20px">' +
    '<h3>\u2705 All Scams Identified!</h3>' +
    '<p>You can now recognize common crypto giveaway scams! <span class="scam-xp-badge">+25 XP</span></p>' +
  '</div>';

  html += '</div>'; /* #scam-panel-giveaway */

  /* ═══════ PANEL 4: MYTH BUSTERS ═══════ */
  html += '<div class="scam-panel" id="scam-panel-myths">';

  html += '<div class="myth-counter">Myths Debunked: <span id="myth-count">0</span> / ' + myths.length + '</div>';

  html += '<div class="myth-grid">';
  myths.forEach(function (m, i) {
    html += '<div class="myth-card" data-action="flip-myth" data-index="' + i + '">' +
      '<div class="myth-card-inner">' +
        '<div class="myth-card-front">' +
          '<div class="myth-label">\uD83D\uDEA8 Myth</div>' +
          '<div class="myth-text">' + esc(m.myth) + '</div>' +
          '<div class="myth-hint">Click to reveal the truth</div>' +
        '</div>' +
        '<div class="myth-card-back">' +
          '<div class="fact-label">\u2705 Reality</div>' +
          '<div class="fact-text">' + esc(m.fact) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  html += '</div>'; /* .myth-grid */

  html += '</div>'; /* #scam-panel-myths */

  html += '</div>'; /* .scam-page */

  return html;
};