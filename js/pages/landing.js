window.Pages = window.Pages || {};

window.Pages.landing = function () {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67542.30, change: 2.34 },
    { symbol: 'ETH', name: 'Ethereum', price: 3521.18, change: -1.12 },
    { symbol: 'SOL', name: 'Solana', price: 178.45, change: 5.67 },
    { symbol: 'ADA', name: 'Cardano', price: 0.62, change: -0.45 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.154, change: 3.21 },
    { symbol: 'DOT', name: 'Polkadot', price: 8.92, change: -2.08 },
  ];

  const tickerItems = cryptos.map(c => {
    const isUp = c.change >= 0;
    const priceStr = c.price >= 1
      ? '$' + c.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '$' + c.price.toFixed(4);
    return `
      <span class="ticker-item">
        <strong>${c.symbol}</strong>
        <span class="ticker-price">${priceStr}</span>
        <span class="ticker-change ${isUp ? 'badge-green' : 'badge-red'}">
          ${isUp ? '&#9650;' : '&#9660;'} ${Math.abs(c.change).toFixed(2)}%
        </span>
      </span>`;
  }).join('');

  return `
  <!-- ═══════════════════════════════════════════════════════════
       NAVBAR
       ═══════════════════════════════════════════════════════════ -->
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="#/" class="navbar-logo" data-page="landing">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
          <line x1="12" y1="22" x2="12" y2="15.5"/>
          <polyline points="22,8.5 12,15.5 2,8.5"/>
          <polyline points="2,15.5 12,8.5 22,15.5"/>
          <line x1="12" y1="2" x2="12" y2="8.5"/>
        </svg>
        <span>CryptoVerse Academy</span>
      </a>

      <div class="navbar-links">
        <a href="#/learn" class="navbar-link" data-page="learn">Learn</a>
        <a href="#/trading" class="navbar-link" data-page="trading">Trading Simulator</a>
        <a href="#/news" class="navbar-link" data-page="news">Market News</a>
        <a href="#/achievements" class="navbar-link" data-page="achievements">Achievements</a>
        <a href="#/leaderboard" class="navbar-link" data-page="leaderboard">Leaderboard</a>
      </div>

      <div class="navbar-actions">
        <div class="navbar-xp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
          <span>0 XP</span>
        </div>
        <div class="navbar-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <button class="mobile-menu-btn" data-action="toggle-mobile-menu" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- ═══════════════════════════════════════════════════════════
       TICKER BAR
       ═══════════════════════════════════════════════════════════ -->
  <div class="ticker-bar">
    <div class="ticker-content">
      ${tickerItems}
      ${tickerItems}
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════
       HERO SECTION
       ═══════════════════════════════════════════════════════════ -->
  <section class="hero" style="position:relative; min-height:100vh; display:flex; align-items:center;
         justify-content:center; overflow:hidden; padding:6rem 1.5rem 4rem;">
    <!-- Animated gradient orbs -->
    <div style="position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none;">
      <div style="position:absolute; width:600px; height:600px; border-radius:50%;
                  background:radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
                  top:-10%; left:-5%; filter:blur(80px);
                  animation:floatOrb1 18s ease-in-out infinite;"></div>
      <div style="position:absolute; width:500px; height:500px; border-radius:50%;
                  background:radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
                  bottom:-5%; right:-5%; filter:blur(90px);
                  animation:floatOrb2 22s ease-in-out infinite;"></div>
      <div style="position:absolute; width:400px; height:400px; border-radius:50%;
                  background:radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
                  top:40%; left:50%; transform:translate(-50%,-50%); filter:blur(70px);
                  animation:floatOrb3 15s ease-in-out infinite;"></div>
      <div style="position:absolute; width:300px; height:300px; border-radius:50%;
                  background:radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
                  top:20%; right:20%; filter:blur(60px);
                  animation:floatOrb4 20s ease-in-out infinite;"></div>
    </div>

    <div style="position:relative; z-index:1; text-align:center; max-width:900px; margin:0 auto;">
      <h1 class="animate-fade-in-up stagger-1"
          style="font-size:clamp(2.5rem,6vw,4.5rem); font-weight:800; line-height:1.1;
                 margin-bottom:1.5rem;
                 background:var(--gradient-hero, linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan)));
                 -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                 background-clip:text;">
        Learn Crypto Without Risk
      </h1>
      <p class="animate-fade-in-up stagger-2"
         style="font-size:clamp(1rem,2vw,1.35rem); color:var(--text-secondary);
                max-width:680px; margin:0 auto 2.5rem; line-height:1.7;">
        Master blockchain, investing, market analysis, and crypto safety through
        realistic interactive simulations.
      </p>
      <div class="animate-fade-in-up stagger-3" style="display:flex; gap:1rem;
           justify-content:center; flex-wrap:wrap; margin-bottom:4rem;">
        <a href="#/learn" class="btn btn-primary btn-lg" data-page="learn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Start Learning
        </a>
        <a href="#/trading" class="btn btn-secondary btn-lg" data-page="trading">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Enter Trading Simulator
        </a>
      </div>

      <!-- Floating stats -->
      <div class="animate-fade-in-up stagger-4"
           style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr));
                  gap:1.5rem; max-width:700px; margin:0 auto;">
        <div class="stat-card">
          <div class="stat-value">10,000+</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">50+</div>
          <div class="stat-label">Lessons</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">100+</div>
          <div class="stat-label">Quiz Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">6</div>
          <div class="stat-label">Crypto Assets</div>
        </div>
      </div>
    </div>
  </section>

  <style>
    @keyframes floatOrb1 {
      0%,100% { transform:translate(0,0) scale(1); }
      33% { transform:translate(60px,40px) scale(1.08); }
      66% { transform:translate(-30px,70px) scale(0.95); }
    }
    @keyframes floatOrb2 {
      0%,100% { transform:translate(0,0) scale(1); }
      33% { transform:translate(-50px,-60px) scale(1.1); }
      66% { transform:translate(40px,-30px) scale(0.92); }
    }
    @keyframes floatOrb3 {
      0%,100% { transform:translate(-50%,-50%) scale(1); }
      50% { transform:translate(-45%,-55%) scale(1.12); }
    }
    @keyframes floatOrb4 {
      0%,100% { transform:translate(0,0) scale(1); }
      40% { transform:translate(-70px,50px) scale(1.05); }
      80% { transform:translate(30px,-40px) scale(0.97); }
    }
  </style>

  <!-- ═══════════════════════════════════════════════════════════
       FEATURES OVERVIEW
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:6rem 1.5rem; max-width:1200px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:4rem;">
      <span class="badge badge-purple" style="margin-bottom:1rem; display:inline-block;">Features</span>
      <h2 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; color:var(--text-primary);
                 margin-bottom:1rem;">Everything You Need to Learn Crypto</h2>
      <p style="color:var(--text-secondary); max-width:600px; margin:0 auto; line-height:1.7;">
        A complete education platform built for beginners and aspiring crypto enthusiasts.
      </p>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px,1fr)); gap:1.5rem;">
      <!-- Feature 1: Interactive Learning Modules -->
      <div class="card card-glass card-glow stagger-1 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(59,130,246,0.12); color:var(--accent-blue);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Interactive Learning Modules
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Bite-sized lessons on blockchain, wallets, DeFi, and more. Progress at your own pace
          with quizzes that reinforce every concept.
        </p>
      </div>

      <!-- Feature 2: Real-Time Trading Simulator -->
      <div class="card card-glass card-glow stagger-2 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(16,185,129,0.12); color:var(--accent-emerald);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Real-Time Trading Simulator
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Practice buying, selling, and holding with $10,000 in virtual currency.
          Experience market volatility without risking a single cent.
        </p>
      </div>

      <!-- Feature 3: AI Market Analysis -->
      <div class="card card-glass card-glow stagger-3 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(139,92,246,0.12); color:var(--accent-purple);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.5V20h6v-2.5c2.9-1.2 5-4.1 5-7.5a8 8 0 0 0-8-8z"/>
            <line x1="9" y1="22" x2="15" y2="22"/>
            <path d="M9 12h.01M15 12h.01M9.5 16h5"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          AI Market Analysis
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Get simplified market insights and learn to read charts, trends, and indicators.
          Understand why markets move the way they do.
        </p>
      </div>

      <!-- Feature 4: Scam Detection Training -->
      <div class="card card-glass card-glow stagger-4 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(245,158,11,0.12); color:var(--accent-amber);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Scam Detection Training
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Learn to identify phishing, rug pulls, and Ponzi schemes through interactive
          scenarios. Protect yourself and others in the crypto space.
        </p>
      </div>

      <!-- Feature 5: Achievement System -->
      <div class="card card-glass card-glow stagger-5 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(6,182,212,0.12); color:var(--accent-cyan);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Achievement System
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Earn badges, unlock titles, and track milestones as you progress.
          Stay motivated with 15 unique achievements across all activities.
        </p>
      </div>

      <!-- Feature 6: Portfolio Competitions -->
      <div class="card card-glass card-glow stagger-6 animate-fade-in-up">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center;
                    justify-content:center; margin-bottom:1.25rem;
                    background:rgba(239,68,68,0.12); color:#ef4444;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3 style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Portfolio Competitions
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Compete with other learners on the leaderboard. See who builds the best
          virtual portfolio and climb the global rankings.
        </p>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       STATISTICS SECTION
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:4rem 1.5rem 6rem; max-width:1200px; margin:0 auto;">
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:1.5rem;">
      <div class="stat-card animate-fade-in-up stagger-1">
        <div class="stat-value" data-countup="50">0</div>
        <div class="stat-label">Learning Modules</div>
        <span class="badge badge-blue" style="margin-top:0.5rem;">Growing monthly</span>
      </div>
      <div class="stat-card animate-fade-in-up stagger-2">
        <div class="stat-value" data-countup="6">0</div>
        <div class="stat-label">Tradeable Assets</div>
        <span class="badge badge-green" style="margin-top:0.5rem;">Live prices</span>
      </div>
      <div class="stat-card animate-fade-in-up stagger-3">
        <div class="stat-value" data-countup="100">0</div>
        <div class="stat-label">Quiz Questions</div>
        <span class="badge badge-purple" style="margin-top:0.5rem;">Skill-building</span>
      </div>
      <div class="stat-card animate-fade-in-up stagger-4">
        <div class="stat-value" data-countup="15">0</div>
        <div class="stat-label">Achievements</div>
        <span class="badge badge-amber" style="margin-top:0.5rem;">Unlock them all</span>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       HOW IT WORKS
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:6rem 1.5rem; max-width:1000px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:4rem;">
      <span class="badge badge-cyan" style="margin-bottom:1rem; display:inline-block;">How It Works</span>
      <h2 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; color:var(--text-primary);
                 margin-bottom:1rem;">Three Steps to Crypto Literacy</h2>
      <p style="color:var(--text-secondary); max-width:550px; margin:0 auto; line-height:1.7;">
        A simple path from curious beginner to confident crypto learner.
      </p>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px,1fr)); gap:2rem;
                position:relative;">
      <!-- Connecting line (desktop) -->
      <div style="position:absolute; top:40px; left:calc(16.67% + 20px); right:calc(16.67% + 20px);
                  height:2px; background:linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan));
                  opacity:0.3; pointer-events:none; display:none;"
           class="connecting-line"></div>

      <!-- Step 1 -->
      <div class="animate-fade-in-up stagger-1" style="text-align:center;">
        <div style="width:80px; height:80px; border-radius:50%; margin:0 auto 1.5rem;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(59,130,246,0.1); border:2px solid rgba(59,130,246,0.3);
                    color:var(--accent-blue); position:relative; z-index:1;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span style="position:absolute; top:-8px; right:-8px; width:28px; height:28px;
                       border-radius:50%; background:var(--accent-blue); color:#fff;
                       font-size:0.8rem; font-weight:700; display:flex; align-items:center;
                       justify-content:center;">1</span>
        </div>
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Learn
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Work through bite-sized modules covering blockchain basics, wallets, trading
          strategies, and how to spot scams in the crypto world.
        </p>
      </div>

      <!-- Step 2 -->
      <div class="animate-fade-in-up stagger-3" style="text-align:center;">
        <div style="width:80px; height:80px; border-radius:50%; margin:0 auto 1.5rem;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(139,92,246,0.1); border:2px solid rgba(139,92,246,0.3);
                    color:var(--accent-purple); position:relative; z-index:1;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span style="position:absolute; top:-8px; right:-8px; width:28px; height:28px;
                       border-radius:50%; background:var(--accent-purple); color:#fff;
                       font-size:0.8rem; font-weight:700; display:flex; align-items:center;
                       justify-content:center;">2</span>
        </div>
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Practice
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Put your knowledge to the test with the trading simulator. Buy and sell virtual
          crypto, track your portfolio, and learn from your trades risk-free.
        </p>
      </div>

      <!-- Step 3 -->
      <div class="animate-fade-in-up stagger-5" style="text-align:center;">
        <div style="width:80px; height:80px; border-radius:50%; margin:0 auto 1.5rem;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(6,182,212,0.1); border:2px solid rgba(6,182,212,0.3);
                    color:var(--accent-cyan); position:relative; z-index:1;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
          <span style="position:absolute; top:-8px; right:-8px; width:28px; height:28px;
                       border-radius:50%; background:var(--accent-cyan); color:#fff;
                       font-size:0.8rem; font-weight:700; display:flex; align-items:center;
                       justify-content:center;">3</span>
        </div>
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary); margin-bottom:0.75rem;">
          Master
        </h3>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">
          Earn achievements, climb the leaderboard, and gain real confidence in your
          understanding of cryptocurrency and blockchain technology.
        </p>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       TESTIMONIALS
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:6rem 1.5rem; max-width:1200px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:4rem;">
      <span class="badge badge-emerald" style="margin-bottom:1rem; display:inline-block;">Testimonials</span>
      <h2 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; color:var(--text-primary);
                 margin-bottom:1rem;">Loved by Students Worldwide</h2>
      <p style="color:var(--text-secondary); max-width:550px; margin:0 auto; line-height:1.7;">
        Hear from learners who leveled up their crypto knowledge with CryptoVerse Academy.
      </p>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px,1fr)); gap:1.5rem;">
      <!-- Testimonial 1 -->
      <div class="card card-glass animate-fade-in-up stagger-1">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;">
          <div style="width:48px; height:48px; border-radius:50%;
                      background:linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
                      display:flex; align-items:center; justify-content:center;
                      font-weight:700; font-size:1rem; color:#fff; flex-shrink:0;">A</div>
          <div>
            <div style="font-weight:600; color:var(--text-primary);">Alex, 16</div>
            <div style="color:var(--accent-amber); font-size:0.85rem;">
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
          </div>
        </div>
        <p style="color:var(--text-secondary); line-height:1.7; font-style:italic;">
          "The trading simulator taught me more about markets in a week than months of reading
          articles online. Being able to practice with fake money while seeing real price
          movements was a game changer for me."
        </p>
      </div>

      <!-- Testimonial 2 -->
      <div class="card card-glass animate-fade-in-up stagger-3">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;">
          <div style="width:48px; height:48px; border-radius:50%;
                      background:linear-gradient(135deg, var(--accent-purple), var(--accent-amber));
                      display:flex; align-items:center; justify-content:center;
                      font-weight:700; font-size:1rem; color:#fff; flex-shrink:0;">P</div>
          <div>
            <div style="font-weight:600; color:var(--text-primary);">Priya, 15</div>
            <div style="color:var(--accent-amber); font-size:0.85rem;">
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
          </div>
        </div>
        <p style="color:var(--text-secondary); line-height:1.7; font-style:italic;">
          "I love how the platform explains blockchain visually. Building blocks step by step
          made complex concepts actually click for me. The quiz system keeps me coming back
          to improve my scores."
        </p>
      </div>

      <!-- Testimonial 3 -->
      <div class="card card-glass animate-fade-in-up stagger-5">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;">
          <div style="width:48px; height:48px; border-radius:50%;
                      background:linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan));
                      display:flex; align-items:center; justify-content:center;
                      font-weight:700; font-size:1rem; color:#fff; flex-shrink:0;">M</div>
          <div>
            <div style="font-weight:600; color:var(--text-primary);">Marcus, 17</div>
            <div style="color:var(--accent-amber); font-size:0.85rem;">
              &#9733;&#9733;&#9733;&#9733;&#9734;
            </div>
          </div>
        </div>
        <p style="color:var(--text-secondary); line-height:1.7; font-style:italic;">
          "The scam awareness section opened my eyes. I can now spot red flags that I would
          have completely missed before. Every teenager should go through this training
          before touching any crypto app."
        </p>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       FAQ SECTION
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:6rem 1.5rem; max-width:800px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:4rem;">
      <span class="badge badge-amber" style="margin-bottom:1rem; display:inline-block;">FAQ</span>
      <h2 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; color:var(--text-primary);
                 margin-bottom:1rem;">Frequently Asked Questions</h2>
      <p style="color:var(--text-secondary); max-width:500px; margin:0 auto; line-height:1.7;">
        Got questions? We've got answers.
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>Is this platform free?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            Yes, CryptoVerse Academy is completely free. All learning modules, the trading
            simulator, quizzes, and achievement tracking are available at no cost. We believe
            crypto education should be accessible to everyone.
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>Do I need real money?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            No. All trading is done with virtual currency. You start with $10,000 in
            simulated funds. No real money is involved at any point, so there is zero
            financial risk.
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>Is my data safe?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            All your progress is stored locally in your browser using localStorage. We don't
            collect personal data, require accounts, or send information to external servers.
            Your learning journey stays private.
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>What will I learn?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            You'll learn about blockchain technology, Bitcoin and other cryptocurrencies,
            how wallets and exchanges work, trading strategies, market analysis, and crucially
            how to identify and avoid crypto scams.
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>How does the trading simulator work?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            You start with $10,000 in virtual money and can trade 6 different
            cryptocurrencies. Prices update in real-time to simulate live market conditions.
            You can buy, sell, and track your portfolio performance over time.
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <button class="accordion-header" data-action="toggle-accordion" aria-expanded="false">
          <span>Is this financial advice?</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="accordion-body">
          <div class="accordion-content">
            No. This platform is for educational purposes only. Nothing on CryptoVerse Academy
            should be considered financial advice. Always do your own research and consult a
            qualified financial advisor before making any real investments.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       CTA SECTION
       ═══════════════════════════════════════════════════════════ -->
  <section class="animate-fade-in" style="padding:6rem 1.5rem; margin:0 auto;">
    <div style="max-width:800px; margin:0 auto; text-align:center; padding:5rem 2rem;
                border-radius:24px; position:relative; overflow:hidden;
                background:var(--gradient-primary, linear-gradient(135deg, rgba(59,130,246,0.15),
                rgba(139,92,246,0.15), rgba(6,182,212,0.15)));
                border:1px solid rgba(255,255,255,0.06);">
      <!-- Subtle inner glow -->
      <div style="position:absolute; inset:0; pointer-events:none;
                  background:radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%);"></div>
      <div style="position:relative; z-index:1;">
        <h2 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; color:var(--text-primary);
                   margin-bottom:1rem;">
          Ready to Start Your Crypto Journey?
        </h2>
        <p style="color:var(--text-secondary); max-width:500px; margin:0 auto 2.5rem; line-height:1.7;">
          Join thousands of learners mastering cryptocurrency the safe way.
          It's free, interactive, and risk-free.
        </p>
        <a href="#/learn" class="btn btn-primary btn-lg" data-page="learn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
          Start Learning Now
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════
       FOOTER
       ═══════════════════════════════════════════════════════════ -->
  <footer style="border-top:1px solid rgba(255,255,255,0.06); padding:4rem 1.5rem 0;
                 margin-top:2rem;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr));
                  gap:3rem; padding-bottom:3rem;">
        <!-- Brand column -->
        <div>
          <a href="#/" class="navbar-logo" data-page="landing"
             style="display:inline-flex; align-items:center; gap:0.5rem; margin-bottom:1rem;
                    color:var(--text-primary); text-decoration:none; font-weight:700; font-size:1.1rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
              <line x1="12" y1="22" x2="12" y2="15.5"/>
              <polyline points="22,8.5 12,15.5 2,8.5"/>
              <polyline points="2,15.5 12,8.5 22,15.5"/>
              <line x1="12" y1="2" x2="12" y2="8.5"/>
            </svg>
            CryptoVerse Academy
          </a>
          <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; max-width:260px;">
            The free, interactive platform that teaches cryptocurrency concepts
            through hands-on learning and simulation.
          </p>
        </div>

        <!-- Platform links -->
        <div>
          <h4 style="font-size:0.85rem; font-weight:600; color:var(--text-primary);
                     text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1.25rem;">
            Platform
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;
                      transition:color 0.2s;">Learning Modules</a>
            <a href="#/trading" class="navbar-link" data-page="trading"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;
                      transition:color 0.2s;">Trading Simulator</a>
            <a href="#/news" class="navbar-link" data-page="news"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;
                      transition:color 0.2s;">Market News</a>
            <a href="#/achievements" class="navbar-link" data-page="achievements"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;
                      transition:color 0.2s;">Achievements</a>
            <a href="#/leaderboard" class="navbar-link" data-page="leaderboard"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;
                      transition:color 0.2s;">Leaderboard</a>
          </div>
        </div>

        <!-- Learning links -->
        <div>
          <h4 style="font-size:0.85rem; font-weight:600; color:var(--text-primary);
                     text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1.25rem;">
            Learning
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Blockchain Basics</a>
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Trading Strategies</a>
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Scam Detection</a>
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Wallets & Security</a>
            <a href="#/learn" class="navbar-link" data-page="learn"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">DeFi Essentials</a>
          </div>
        </div>

        <!-- Community & Legal -->
        <div>
          <h4 style="font-size:0.85rem; font-weight:600; color:var(--text-primary);
                     text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1.25rem;">
            Community
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:2rem;">
            <a href="#/leaderboard" class="navbar-link" data-page="leaderboard"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Leaderboard</a>
            <a href="#/achievements" class="navbar-link" data-page="achievements"
               style="color:var(--text-secondary); text-decoration:none; font-size:0.9rem;">Achievements</a>
          </div>
          <h4 style="font-size:0.85rem; font-weight:600; color:var(--text-primary);
                     text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1.25rem;">
            Legal
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <span style="color:var(--text-secondary); font-size:0.9rem;">Privacy Policy</span>
            <span style="color:var(--text-secondary); font-size:0.9rem;">Terms of Service</span>
            <span style="color:var(--text-secondary); font-size:0.9rem;">Disclaimer</span>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div style="border-top:1px solid rgba(255,255,255,0.06); padding:1.5rem 0;
                  display:flex; justify-content:space-between; align-items:center;
                  flex-wrap:wrap; gap:1rem;">
        <p style="color:var(--text-muted); font-size:0.8rem;">
          &copy; 2024 CryptoVerse Academy. Educational purposes only. Not financial advice.
        </p>
        <div style="display:flex; gap:1rem;">
          <!-- Twitter / X -->
          <a href="#" aria-label="Twitter" style="color:var(--text-muted); transition:color 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M13.232 10.768L20 4"/>
            </svg>
          </a>
          <!-- GitHub -->
          <a href="#" aria-label="GitHub" style="color:var(--text-muted); transition:color 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
          <!-- Discord -->
          <a href="#" aria-label="Discord" style="color:var(--text-muted); transition:color 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13a6 6 0 0 0-3-5.5 6 6 0 0 0-6 0A6 6 0 0 0 6 13c0 3.5 2.5 6.5 6 7 3.5-.5 6-3.5 6-7z"/>
              <circle cx="9" cy="13" r="1"/>
              <circle cx="15" cy="13" r="1"/>
            </svg>
          </a>
          <!-- YouTube -->
          <a href="#" aria-label="YouTube" style="color:var(--text-muted); transition:color 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>`;
};