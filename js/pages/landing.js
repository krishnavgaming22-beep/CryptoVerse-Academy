window.Pages = window.Pages || {};

window.Pages.landing = function () {
  return `
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .neon-landing-page {
    background: #0a0a0f;
    color: #ffffff;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Navbar ────────────────────────────────────────── */
  .neon-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 80px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .neon-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #00ffff44 30%, #9d00ff44 70%, transparent 100%);
  }
  .neon-nav-logo {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, #00ffff, #9d00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    cursor: pointer;
    text-decoration: none;
    letter-spacing: -0.3px;
  }
  .neon-nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    align-items: center;
  }
  .neon-nav-links a {
    color: #ffffff;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.25s ease;
    cursor: pointer;
    position: relative;
    padding: 4px 0;
  }
  .neon-nav-links a:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.2);
  }
  .neon-nav-links a:hover::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px;
    background: #00ffff;
    box-shadow: 0 0 8px rgba(0,255,255,0.6);
    border-radius: 1px;
  }
  .neon-trade-btn {
    height: 40px;
    padding: 0 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    background: linear-gradient(135deg, #00ffff, #9d00ff);
    box-shadow: 0 0 15px rgba(0,255,255,0.25), 0 0 30px rgba(0,255,255,0.08);
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .neon-trade-btn:hover {
    box-shadow: 0 0 25px rgba(0,255,255,0.45), 0 0 50px rgba(0,255,255,0.15);
    transform: translateY(-1px);
  }

  /* ── Ticker Bar ────────────────────────────────────── */
  .neon-ticker {
    position: fixed;
    top: 80px; left: 0; right: 0;
    height: 40px;
    background: rgba(10,10,15,0.8);
    z-index: 99;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid rgba(0,255,255,0.06);
  }
  .neon-ticker-track {
    display: flex;
    align-items: center;
    gap: 40px;
    white-space: nowrap;
    animation: tickerScroll 30s linear infinite;
    padding-left: 20px;
  }
  @keyframes tickerScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .neon-ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #cccccc;
  }
  .neon-ticker-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .neon-ticker-symbol {
    font-weight: 600;
    color: #ffffff;
  }
  .neon-ticker-price {
    color: #cccccc;
  }
  .neon-ticker-change {
    font-weight: 600;
    font-size: 12px;
  }
  .neon-ticker-up { color: #00ff88; }
  .neon-ticker-down { color: #ff3366; }

  /* ── Warning Banner ────────────────────────────────── */
  .neon-warning {
    margin: 0 auto;
    max-width: 600px;
    padding: 10px 24px;
    border-radius: 50px;
    border: 1px solid rgba(0,255,136,0.2);
    background: rgba(0,255,136,0.03);
    text-align: center;
    font-size: 13px;
    color: #cccccc;
  }
  .neon-warning .vw-green {
    color: #00ff88;
    font-weight: 600;
  }
  .neon-warning .vw-cyan {
    color: #00ffff;
    font-weight: 500;
  }

  /* ── Hero Section ──────────────────────────────────── */
  .neon-hero {
    min-height: calc(100vh - 40px);
    padding-top: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background-image:
      linear-gradient(rgba(0,255,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.06) 1px, transparent 1px);
    background-size: 60px 60px;
    overflow: hidden;
  }
  /* Floating crypto symbols */
  .neon-float-symbol {
    position: absolute;
    font-size: 80px;
    color: #00ffff;
    opacity: 0.1;
    pointer-events: none;
    user-select: none;
    animation: floatSymbol 8s ease-in-out infinite;
  }
  .neon-float-symbol:nth-child(1) { top: 12%; left: 8%;  animation-delay: 0s; font-size: 72px; }
  .neon-float-symbol:nth-child(2) { top: 18%; right: 10%; animation-delay: 2s; font-size: 90px; }
  .neon-float-symbol:nth-child(3) { bottom: 25%; left: 12%; animation-delay: 4s; font-size: 60px; }
  .neon-float-symbol:nth-child(4) { bottom: 30%; right: 8%; animation-delay: 1s; font-size: 80px; }
  .neon-float-symbol:nth-child(5) { top: 45%; left: 3%;  animation-delay: 3s; font-size: 55px; }
  .neon-float-symbol:nth-child(6) { top: 35%; right: 4%;  animation-delay: 5s; font-size: 65px; }

  @keyframes floatSymbol {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-20px) rotate(5deg); }
  }

  .neon-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 24px;
  }
  .neon-hero-h1-line1 {
    font-size: 72px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 4px;
  }
  .neon-hero-h1-line2 {
    font-size: 72px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #00ffff, #9d00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
  }
  .neon-hero-sub {
    font-size: 20px;
    font-weight: 300;
    color: #cccccc;
    line-height: 1.6;
    max-width: 560px;
    margin-bottom: 40px;
  }
  .neon-hero-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .neon-btn-primary {
    height: auto;
    padding: 16px 32px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    cursor: pointer;
    background: linear-gradient(135deg, #00ffff, #9d00ff);
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .neon-btn-primary:hover {
    box-shadow: 0 0 35px rgba(0,255,255,0.55), 0 0 70px rgba(0,255,255,0.15);
    transform: translateY(-2px);
  }
  .neon-btn-outline {
    height: auto;
    padding: 16px 32px;
    border: 1px solid rgba(0,255,255,0.4);
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    cursor: pointer;
    background: transparent;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .neon-btn-outline:hover {
    background: rgba(0,255,255,0.1);
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.2);
    color: #ffffff;
  }

  /* ── Stats Section ─────────────────────────────────── */
  .neon-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 48px 24px 60px;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }
  .neon-stat-item {
    text-align: center;
  }
  .neon-stat-number {
    font-size: 36px;
    font-weight: 700;
    color: #00ffff;
    line-height: 1.2;
    text-shadow: 0 0 10px rgba(0,255,255,0.3);
  }
  .neon-stat-label {
    font-size: 14px;
    color: #cccccc;
    margin-top: 6px;
  }

  /* ── XP Progress Bar ───────────────────────────────── */
  .neon-xp-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 30px;
    background: #0a0a0f;
    border-top: 1px solid rgba(0,255,255,0.1);
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
  }
  .neon-xp-label {
    font-size: 13px;
    color: #00ffff;
    white-space: nowrap;
    font-weight: 600;
  }
  .neon-xp-track {
    flex: 1;
    height: 10px;
    background: #1a1a24;
    border-radius: 5px;
    overflow: hidden;
  }
  .neon-xp-fill {
    height: 100%;
    width: 84.2%;
    background: linear-gradient(90deg, #00ffff, #9d00ff);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,255,255,0.3);
    transition: width 1s ease;
  }
  .neon-xp-value {
    font-size: 13px;
    color: #00ffff;
    white-space: nowrap;
    font-weight: 500;
  }

  /* ── Floating Sidebar ──────────────────────────────── */
  .neon-sidebar {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 90;
  }
  .neon-sidebar-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #121218;
    border: 1px solid rgba(0,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  .neon-sidebar-btn:hover {
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0,255,255,0.3), 0 0 30px rgba(0,255,255,0.1);
    background: rgba(0,255,255,0.05);
  }
  .neon-sidebar-btn svg {
    width: 20px;
    height: 20px;
    stroke: #888888;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.3s ease;
  }
  .neon-sidebar-btn:hover svg {
    stroke: #00ffff;
  }

  /* ── Responsive ────────────────────────────────────── */
  @media (max-width: 768px) {
    .neon-hero-h1-line1, .neon-hero-h1-line2 {
      font-size: 44px;
      letter-spacing: -1px;
    }
    .neon-hero-sub { font-size: 16px; }
    .neon-stats { gap: 24px; }
    .neon-stat-number { font-size: 28px; }
    .neon-nav-links { display: none; }
    .neon-sidebar { display: none; }
    .neon-hero-buttons { flex-direction: column; align-items: center; }
  }
</style>

<div class="neon-landing-page">

  <!-- ═══ Navigation Bar ═══ -->
  <nav class="neon-nav">
    <a href="#/" class="neon-nav-logo" data-action="navigate" data-page="#/">CryptoVerse Academy</a>
    <ul class="neon-nav-links">
      <li><a data-action="navigate" data-page="#/learn">Learn</a></li>
      <li><a data-action="navigate" data-page="#/trading">Simulator</a></li>
      <li><a data-action="navigate" data-page="#/scam-centre">Scam Centre</a></li>
      <li><a data-action="navigate" data-page="#/blockchain">Blockchain</a></li>
      <li><a data-action="navigate" data-page="#/achievements">Achievements</a></li>
    </ul>
    <a href="#/trading" class="neon-trade-btn" data-action="navigate" data-page="#/trading">Trade</a>
  </nav>

  <!-- ═══ Crypto Ticker Bar ═══ -->
  <div class="neon-ticker">
    <div class="neon-ticker-track">
      <!-- Set 1 -->
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#f7931a"></span>
        <span class="neon-ticker-symbol">BTC</span>
        <span class="neon-ticker-price">$67,234.50</span>
        <span class="neon-ticker-change neon-ticker-up">+2.4%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#627eea"></span>
        <span class="neon-ticker-symbol">ETH</span>
        <span class="neon-ticker-price">$3,456.78</span>
        <span class="neon-ticker-change neon-ticker-up">+1.8%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#9945ff"></span>
        <span class="neon-ticker-symbol">SOL</span>
        <span class="neon-ticker-price">$178.32</span>
        <span class="neon-ticker-change neon-ticker-down">-0.5%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#23292f"></span>
        <span class="neon-ticker-symbol">XRP</span>
        <span class="neon-ticker-price">$0.6234</span>
        <span class="neon-ticker-change neon-ticker-up">+0.3%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#c2a633"></span>
        <span class="neon-ticker-symbol">DOGE</span>
        <span class="neon-ticker-price">$0.1234</span>
        <span class="neon-ticker-change neon-ticker-down">-1.2%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#0033ad"></span>
        <span class="neon-ticker-symbol">ADA</span>
        <span class="neon-ticker-price">$0.4567</span>
        <span class="neon-ticker-change neon-ticker-up">+0.8%</span>
      </span>
      <!-- Set 2 (duplicate for seamless loop) -->
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#f7931a"></span>
        <span class="neon-ticker-symbol">BTC</span>
        <span class="neon-ticker-price">$67,234.50</span>
        <span class="neon-ticker-change neon-ticker-up">+2.4%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#627eea"></span>
        <span class="neon-ticker-symbol">ETH</span>
        <span class="neon-ticker-price">$3,456.78</span>
        <span class="neon-ticker-change neon-ticker-up">+1.8%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#9945ff"></span>
        <span class="neon-ticker-symbol">SOL</span>
        <span class="neon-ticker-price">$178.32</span>
        <span class="neon-ticker-change neon-ticker-down">-0.5%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#23292f"></span>
        <span class="neon-ticker-symbol">XRP</span>
        <span class="neon-ticker-price">$0.6234</span>
        <span class="neon-ticker-change neon-ticker-up">+0.3%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#c2a633"></span>
        <span class="neon-ticker-symbol">DOGE</span>
        <span class="neon-ticker-price">$0.1234</span>
        <span class="neon-ticker-change neon-ticker-down">-1.2%</span>
      </span>
      <span class="neon-ticker-item">
        <span class="neon-ticker-dot" style="background:#0033ad"></span>
        <span class="neon-ticker-symbol">ADA</span>
        <span class="neon-ticker-price">$0.4567</span>
        <span class="neon-ticker-change neon-ticker-up">+0.8%</span>
      </span>
    </div>
  </div>

  <!-- ═══ Hero Section ═══ -->
  <section class="neon-hero">
    <!-- Floating crypto symbols -->
    <span class="neon-float-symbol">₿</span>
    <span class="neon-float-symbol">◎</span>
    <span class="neon-float-symbol">◎</span>
    <span class="neon-float-symbol">₿</span>
    <span class="neon-float-symbol">◎</span>
    <span class="neon-float-symbol">₿</span>

    <div class="neon-hero-content">
      <!-- Warning Banner -->
      <div class="neon-warning" style="margin-bottom: 40px;">
        <span class="vw-green">⚡ VIRTUAL ONLY</span> • No real money involved • <span class="vw-cyan">Education first</span>
      </div>

      <!-- Headline -->
      <div class="neon-hero-h1-line1">Learn Crypto</div>
      <div class="neon-hero-h1-line2">Without Risk</div>

      <!-- Subheadline -->
      <p class="neon-hero-sub">
        Master blockchain, investing, market analysis, and crypto safety<br>
        through realistic interactive simulations.
      </p>

      <!-- CTA Buttons -->
      <div class="neon-hero-buttons">
        <a href="#/learn" class="neon-btn-primary" data-action="navigate" data-page="#/learn">Start Learning</a>
        <a href="#/trading" class="neon-btn-outline" data-action="navigate" data-page="#/trading">Enter Trading Simulator</a>
      </div>
    </div>

    <!-- Stats -->
    <div class="neon-stats">
      <div class="neon-stat-item">
        <div class="neon-stat-number" data-countup="14782">14,782</div>
        <div class="neon-stat-label">Students Learning</div>
      </div>
      <div class="neon-stat-item">
        <div class="neon-stat-number" data-countup="10000" data-prefix="$">$10,000</div>
        <div class="neon-stat-label">Virtual Starting Fund</div>
      </div>
      <div class="neon-stat-item">
        <div class="neon-stat-number" data-countup="6">6</div>
        <div class="neon-stat-label">Learning Modules</div>
      </div>
      <div class="neon-stat-item">
        <div class="neon-stat-number" data-countup="47286">47,286</div>
        <div class="neon-stat-label">Scams Detected</div>
      </div>
    </div>
  </section>

  <!-- ═══ XP Progress Bar ═══ -->
  <div class="neon-xp-bar">
    <span class="neon-xp-label">XP Level 2</span>
    <div class="neon-xp-track">
      <div class="neon-xp-fill"></div>
    </div>
    <span class="neon-xp-value">1010 / 1200 XP</span>
  </div>

  <!-- ═══ Floating Sidebar ═══ -->
  <div class="neon-sidebar">
    <!-- Chat icon -->
    <a class="neon-sidebar-btn" title="Chat">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </a>
    <!-- Settings icon -->
    <a class="neon-sidebar-btn" title="Settings">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </a>
    <!-- User icon -->
    <a class="neon-sidebar-btn" title="Profile">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </a>
  </div>

</div>
`;
};