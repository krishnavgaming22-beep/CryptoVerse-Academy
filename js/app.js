/**
 * CryptoVerse Academy — Main Application Entry Point
 * ====================================================
 * Ties together Store, Router, MarketEngine, Charts, UI, Pages,
 * and all data modules into a living, interactive SPA.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Internal helpers                                                    */
  /* ------------------------------------------------------------------ */

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const app = () => $('#app');

  let marketInterval = null;       // market tick interval id
  let tickerInterval = null;       // landing‑page ticker interval id
  let pumpAutoInterval = null;     // pump & dump auto‑play interval id
  let chartThrottle = null;        // throttled chart re‑render timer

  /* ------------------------------------------------------------------ */
  /*  1. Initialization                                                   */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    // Initialise persisted state
    Store.init();

    // Seed the simulated market with asset definitions
    MarketEngine.init();

    // Register every route
    registerRoutes();

    // Global click delegation (single listener for the entire app)
    app().addEventListener('click', handleGlobalClick);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Navbar scroll effect
    window.addEventListener('scroll', Utils.throttle(handleNavScroll, 100), { passive: true });

    // Listen for route changes to start / stop market engine
    document.addEventListener('routeChanged', handleRouteChanged);

    // Subscribe to Store for toast notifications
    Store.subscribe(handleStoreChange);

    // Start the SPA router
    Router.start();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Route Registration                                               */
  /* ------------------------------------------------------------------ */

  function registerRoutes() {
    var createRenderer = function (pageFn) {
      return function (params) {
        try {
          var html = pageFn(params);
          var el = app();
          if (!el) return;
          el.innerHTML = html;
          initPageEvents();
          initPageAnimations();
        } catch (err) {
          console.error('Page render error:', err);
          app().innerHTML = renderErrorPage(err);
        }
      };
    };

    Router.register('/landing', createRenderer(Pages.landing));
    Router.register('/learn', createRenderer(Pages.learning));
    Router.register('/trading', createRenderer(Pages.trading));
    Router.register('/news', createRenderer(Pages.news));
    Router.register('/scams', createRenderer(Pages.scams));
    Router.register('/blockchain-apps', createRenderer(Pages['blockchain-apps']));
    Router.register('/academy', createRenderer(Pages.academy));
    Router.register('/achievements', createRenderer(Pages.achievements));
    Router.register('/leaderboard', createRenderer(Pages.leaderboard));
    Router.register('/profile', createRenderer(Pages.profile));
    Router.register('/challenge', createRenderer(Pages['final-challenge']));

    // Aliases
    Router.register('/', createRenderer(Pages.landing));

    // Default fallback
    Router.setDefaultRenderer(createRenderer(Pages.landing));
  }

  /* ------------------------------------------------------------------ */
  /*  3. Global Event Delegation — the single click handler              */
  /* ------------------------------------------------------------------ */

  function handleGlobalClick(e) {
    var target = e.target.closest('[data-action]');
    if (!target) return;

    var action = target.dataset.action;
    var page   = target.dataset.page;
    var param  = target.dataset.param;

    switch (action) {

      /* ---------- Navigation ---------- */
      case 'navigate':
        if (page) Router.navigate(page);
        break;

      case 'toggle-mobile-menu':
      case 'toggle-mobile-sidebar':
        toggleMobileSidebar();
        break;

      /* ---------- Landing ---------- */
      case 'toggle-accordion':
        var accItem = target.closest('.accordion-item');
        if (accItem) accItem.classList.toggle('open');
        break;

      case 'scroll-to':
        var scrollTarget = document.querySelector(target.dataset.target || target.getAttribute('href'));
        if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth' });
        break;

      /* ---------- Learning Hub ---------- */
      case 'switch-module-tab':
        switchModuleTab(target);
        break;

      case 'expand-milestone':
        var node = target.closest('.timeline-node');
        if (node) node.classList.toggle('active');
        break;

      case 'complete-milestone':
        completeMilestone(target);
        break;

      case 'create-transaction':
        simulateTransaction(target);
        break;

      case 'reset-chain':
        resetBlockchain(target);
        break;

      case 'mark-read':
        markRead(target);
        break;

      case 'quiz-answer':
        handleQuizAnswer(target);
        break;

      /* ---------- Trading ---------- */
      case 'select-asset':
        selectTradingAsset(target);
        break;

      case 'set-timeframe':
        setChartTimeframe(target);
        break;

      case 'toggle-indicator':
        toggleChartIndicator(target);
        break;

      case 'switch-chart-type':
        switchChartType(target);
        break;

      case 'switch-order-type':
        switchOrderType(target);
        break;

      case 'switch-order-tab':
        switchOrderTab(target);
        break;

      case 'set-quick-amount':
        setQuickAmount(target);
        break;

      case 'place-order':
        placeOrder(target);
        break;

      case 'toggle-watchlist':
        toggleWatchlistAction(target);
        break;

      case 'switch-bottom-tab':
        switchBottomTab(target);
        break;

      /* ---------- News ---------- */
      case 'filter-news':
        filterNews(target);
        break;

      case 'search-news':
        // Handled via input event separately; click clears
        break;

      case 'open-news':
        openNewsModal(target);
        break;

      case 'simulate-event':
        simulateNewsEvent(target);
        break;

      /* ---------- Scams ---------- */
      case 'switch-scam-tab':
        switchScamTab(target);
        break;

      case 'investigate':
        investigateRedFlag(target);
        break;

      case 'next-pump-stage':
        nextPumpStage(target);
        break;

      case 'auto-play-pump':
        autoPlayPump(target);
        break;

      case 'flip-myth':
        var card = target.closest('.myth-card');
        if (card) card.classList.toggle('flipped');
        break;

      /* ---------- Blockchain Apps ---------- */
      case 'explore-app':
        exploreBlockchainApp(target);
        break;

      /* ---------- Academy ---------- */
      case 'expand-lesson':
        var lesson = target.closest('.lesson-card');
        if (lesson) lesson.classList.toggle('expanded');
        break;

      case 'select-scenario':
        selectScenario(target);
        break;

      case 'check-scenario':
        checkScenario(target);
        break;

      case 'complete-lesson':
        completeLesson(target);
        break;

      /* ---------- Profile ---------- */
      case 'edit-name':
        editName(target);
        break;

      case 'save-name':
        saveName(target);
        break;

      case 'toggle-setting':
        toggleSetting(target);
        break;

      case 'reset-progress':
        resetProgress();
        break;

      /* ---------- Final Challenge ---------- */
      case 'start-challenge':
        startChallenge(target);
        break;

      case 'challenge-action':
        processChallengeAction(target);
        break;

      case 'next-challenge-day':
        nextChallengeDay(target);
        break;

      case 'retake-challenge':
        retakeChallenge(target);
        break;

      default:
        // No handler — ignore unknown actions silently
        break;
    }
  }

  /* ================================================================== */
  /*  4. Action Implementations                                          */
  /* ================================================================== */

  /* ---------- Navigation helpers ---------- */

  function toggleMobileSidebar() {
    var sidebar = document.querySelector('.sidebar, .mobile-nav');
    if (sidebar) sidebar.classList.toggle('open');
    var overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.toggle('visible');
  }

  /* ---------- Learning Hub ---------- */

  function switchModuleTab(tabBtn) {
    var container = tabBtn.closest('.module-tabs-container') || tabBtn.closest('[data-module-tabs]');
    if (!container) return;
    // Deactivate all tabs, hide all panels
    $$('.module-tab', container).forEach(function (t) { t.classList.remove('active'); });
    $$('.module-panel', container).forEach(function (p) { p.style.display = 'none'; });
    // Activate clicked tab and show corresponding panel
    tabBtn.classList.add('active');
    var panelId = tabBtn.dataset.panel;
    var panel = $('#' + panelId, container) || $('[data-panel-id="' + panelId + '"]', container);
    if (panel) panel.style.display = '';
  }

  function completeMilestone(target) {
    var milestoneId = target.dataset.milestoneId || target.closest('[data-milestone-id]')?.dataset.milestoneId;
    if (!milestoneId) return;
    Store.updateModuleProgress('history', milestoneId, 'completed');
    Store.addXp(10);
    target.classList.add('completed');
    target.disabled = true;
    UI.createToast('Milestone completed! +10 XP 🎉', 'success');
  }

  /**
   * Simulate a blockchain transaction with animated steps.
   * Reads from‑/to‑address and amount from the parent form,
   * animates through "Signed → Broadcast → Verified → Added to Block",
   * then appends a visual block to the chain.
   */
  function simulateTransaction(target) {
    var form = target.closest('form') || target.closest('.transaction-form');
    if (!form) return;
    var fromAddr  = ($('input[data-field="from"]', form) || $('input[name="from"]', form))?.value || '0x' + Utils.generateId().slice(0, 40);
    var toAddr    = ($('input[data-field="to"]', form) || $('input[name="to"]', form))?.value || '0x' + Utils.generateId().slice(0, 40);
    var amount    = ($('input[data-field="amount"]', form) || $('input[name="amount"]', form))?.value || '0.01';
    var statusEl  = $('.tx-status', form) || $('.tx-status-text', form);
    var chainEl   = document.querySelector('.blockchain-visual, .chain-container');

    var steps = ['Signing transaction...', 'Broadcasting to network...', 'Verifying by nodes...', 'Added to block!'];
    var stepIdx = 0;

    if (statusEl) statusEl.textContent = steps[0];

    var stepInterval = setInterval(function () {
      stepIdx++;
      if (stepIdx < steps.length) {
        if (statusEl) statusEl.textContent = steps[stepIdx];
      } else {
        clearInterval(stepInterval);
        // Append visual block
        if (chainEl) {
          var block = document.createElement('div');
          block.className = 'chain-block animate-fade-in-up';
          block.innerHTML =
            '<div class="block-header">Block #' + (chainEl.children.length + 1) + '</div>' +
            '<div class="block-field"><span>From:</span> ' + Utils.generateId().slice(0, 10) + '...</div>' +
            '<div class="block-field"><span>To:</span> ' + Utils.generateId().slice(0, 10) + '...</div>' +
            '<div class="block-field"><span>Amount:</span> ' + amount + ' BTC</div>' +
            '<div class="block-field"><span>Hash:</span> 0x' + Utils.generateId().slice(0, 16) + '...</div>';
          chainEl.appendChild(block);
        }
        if (statusEl) statusEl.textContent = 'Transaction complete!';
        UI.createToast('Transaction mined successfully! ⛏️', 'success');
      }
    }, 800);
  }

  function resetBlockchain(target) {
    var chainEl = document.querySelector('.blockchain-visual, .chain-container');
    if (!chainEl) return;
    // Reset to genesis block only
    chainEl.innerHTML =
      '<div class="chain-block genesis-block">' +
        '<div class="block-header">Genesis Block</div>' +
        '<div class="block-field"><span>Message:</span> The Times 03/Jan/2009 Chancellor on brink of second bailout</div>' +
      '</div>';
    UI.createToast('Blockchain reset to genesis', 'info');
  }

  function markRead(target) {
    var articleId = target.dataset.articleId || target.closest('[data-article-id]')?.dataset.articleId;
    if (!articleId) return;
    Store.updateModuleProgress('bitcoin', articleId, 'completed');
    Store.addXp(15);
    target.classList.add('read');
    target.textContent = '✓ Read';
    UI.createToast('Article marked as read! +15 XP 📖', 'success');
  }

  /**
   * Handle quiz answer selection.
   * Shows correct/incorrect feedback, awards XP, records attempt.
   */
  function handleQuizAnswer(target) {
    var questionEl = target.closest('.quiz-question') || target.closest('[data-question-id]');
    if (!questionEl) return;
    // Prevent double‑answer
    if (questionEl.classList.contains('answered')) return;
    questionEl.classList.add('answered');

    var questionId  = questionEl.dataset.questionId;
    var selectedIdx = parseInt(target.dataset.index, 10);
    var correctIdx  = parseInt(target.dataset.correct, 10);
    var isCorrect   = selectedIdx === correctIdx;

    // Visual feedback on all options
    var options = $$('.quiz-option', questionEl);
    options.forEach(function (opt, i) {
      opt.classList.remove('selected', 'correct', 'incorrect');
      if (i === correctIdx) opt.classList.add('correct');
      if (i === selectedIdx && !isCorrect) opt.classList.add('incorrect');
      if (i === selectedIdx) opt.classList.add('selected');
    });

    // Show explanation
    var explanation = $('.quiz-explanation', questionEl);
    if (explanation) explanation.style.display = '';

    // Award XP and record
    if (isCorrect) {
      Store.addXp(15);
      UI.createToast('Correct! +15 XP 🧠', 'success');
    } else {
      UI.createToast('Incorrect — review the material and try again!', 'error');
    }

    Store.recordQuizAttempt(questionId, isCorrect);
  }

  /* ---------- Trading ---------- */

  function selectTradingAsset(target) {
    var assetId = target.dataset.assetId;
    if (!assetId) return;
    Store.set('selectedAsset', assetId);
    refreshTradingView();
  }

  function setChartTimeframe(target) {
    var tf = target.dataset.timeframe;
    if (!tf) return;
    Store.set('chartTimeframe', tf);
    $$('.timeframe-btn').forEach(function (b) { b.classList.remove('active'); });
    target.classList.add('active');
    renderTradingChart();
  }

  function toggleChartIndicator(target) {
    var indicator = target.dataset.indicator;
    if (!indicator) return;
    var key = 'indicator_' + indicator;
    var current = Store.get(key);
    Store.set(key, !current);
    target.classList.toggle('active');
    renderTradingChart();
  }

  function switchChartType(target) {
    var current = Store.get('chartType') || 'candlestick';
    var next = current === 'candlestick' ? 'line' : 'candlestick';
    Store.set('chartType', next);
    $$('.chart-type-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.type === next); });
    renderTradingChart();
  }

  function switchOrderType(target) {
    var type = target.dataset.orderType;
    if (!type) return;
    Store.set('orderType', type);
    $$('.order-type-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.orderType === type); });
    var limitInput = $('.limit-price-input');
    if (limitInput) limitInput.style.display = type === 'limit' ? '' : 'none';
  }

  function switchOrderTab(target) {
    var tab = target.dataset.tab; // 'buy' or 'sell'
    if (!tab) return;
    $$('.order-tab').forEach(function (t) { t.classList.remove('active'); });
    target.classList.add('active');
    var panel = target.closest('.order-panel');
    if (panel) {
      $$('.order-content', panel).forEach(function (c) { c.style.display = 'none'; });
      var content = $('[data-order-content="' + tab + '"]', panel);
      if (content) content.style.display = '';
    }
  }

  function setQuickAmount(target) {
    var pct = parseFloat(target.dataset.percent);
    if (isNaN(pct)) return;
    var balance = tab === 'sell' ? getAssetHoldingValue() : Store.getBalance('usd');
    var amountInput = $('input[data-field="amount"]') || $('input[name="amount"]');
    if (amountInput) {
      amountInput.value = ((balance * pct) / 100).toFixed(6);
    }
  }

  function getAssetHoldingValue() {
    var assetId = Store.get('selectedAsset') || 'btc';
    var holdings = Store.getHoldings();
    var h = holdings.find(function (item) { return item.assetId === assetId; });
    if (!h) return 0;
    return h.quantity * MarketEngine.getPrice(assetId);
  }

  function placeOrder(target) {
    var form = target.closest('form') || target.closest('.order-form');
    if (!form) return;

    var amountInput  = $('input[data-field="amount"]', form) || $('input[name="amount"]', form);
    var limitInput   = $('input[data-field="limit-price"]', form) || $('input[name="limit-price"]', form);
    var orderType    = Store.get('orderType') || 'market';
    var activeTab    = $('.order-tab.active', form);
    var side         = activeTab ? activeTab.dataset.tab : 'buy';
    var assetId      = Store.get('selectedAsset') || 'btc';
    var amount       = parseFloat(amountInput?.value);
    var limitPrice   = parseFloat(limitInput?.value);

    // Validation
    if (isNaN(amount) || amount <= 0) {
      UI.createToast('Please enter a valid amount', 'error');
      return;
    }
    if (orderType === 'limit' && (isNaN(limitPrice) || limitPrice <= 0)) {
      UI.createToast('Please enter a valid limit price', 'error');
      return;
    }

    var price = orderType === 'limit' ? limitPrice : MarketEngine.getPrice(assetId);
    var total = amount * price;

    // Show confirmation modal
    UI.createConfirmDialog(
      'Confirm ' + side.charAt(0).toUpperCase() + side.slice(1) + ' Order',
      (side === 'buy' ? 'Buy' : 'Sell') + ' ' + amount + ' ' + assetId.toUpperCase() +
      ' at ' + Utils.formatCurrency(price) + ' = ' + Utils.formatCurrency(total),
      function () {
        // Execute trade
        if (side === 'buy') {
          Store.buyAsset(assetId, amount, price);
        } else {
          Store.sellAsset(assetId, amount, price);
        }
        UI.createToast(
          (side === 'buy' ? 'Bought' : 'Sold') + ' ' + amount + ' ' +
          assetId.toUpperCase() + ' for ' + Utils.formatCurrency(total),
          'success'
        );
        refreshTradingView();
      }
    );
  }

  function toggleWatchlistAction(target) {
    var assetId = target.dataset.assetId || target.closest('[data-asset-id]')?.dataset.assetId;
    if (!assetId) return;
    Store.toggleWatchlist(assetId);
    target.classList.toggle('watchlisted');
    var isWatched = Store.getWatchlist().includes(assetId);
    UI.createToast(
      assetId.toUpperCase() + (isWatched ? ' added to' : ' removed from') + ' watchlist ⭐',
      isWatched ? 'success' : 'info'
    );
  }

  function switchBottomTab(target) {
    var tabId = target.dataset.bottomTab;
    if (!tabId) return;
    var container = target.closest('.bottom-panel') || target.closest('[data-bottom-panel]');
    if (!container) return;
    $$('.bottom-tab', container).forEach(function (t) { t.classList.remove('active'); });
    target.classList.add('active');
    $$('.bottom-panel-content', container).forEach(function (c) { c.style.display = 'none'; });
    var content = $('[data-panel-id="' + tabId + '"]', container);
    if (content) content.style.display = '';
  }

  function refreshTradingView() {
    renderTradingChart();
    updateTradingPanel();
    updatePortfolioValues();
  }

  function renderTradingChart() {
    var canvas = document.querySelector('#trading-chart, .trading-chart canvas');
    if (!canvas) return;
    var assetId   = Store.get('selectedAsset') || 'btc';
    var timeframe = Store.get('chartTimeframe') || '1D';
    var chartType = Store.get('chartType') || 'candlestick';
    var candles   = MarketEngine.getCandles(assetId, timeframe);

    Charts.destroy(canvas);

    if (chartType === 'candlestick') {
      Charts.renderCandlestick(canvas, candles, {
        showMA:    Store.get('indicator_ma') || false,
        showRSI:   Store.get('indicator_rsi') || false,
        showMACD:  Store.get('indicator_macd') || false
      });
    } else {
      var closes = candles.map(function (c) { return c.close; });
      Charts.renderLineChart(canvas, closes);
    }
  }

  function updateTradingPanel() {
    var assetId = Store.get('selectedAsset') || 'btc';
    var state = MarketEngine.getAssetState(assetId);
    if (!state) return;

    var priceEl  = $('.current-price, [data-display="price"]');
    var changeEl = $('.price-change, [data-display="change"]');
    if (priceEl) priceEl.textContent = Utils.formatCurrency(state.price);
    if (changeEl) {
      changeEl.textContent = Utils.formatPercent(state.change24h);
      changeEl.className = 'price-change ' + (state.change24h >= 0 ? 'positive' : 'negative');
    }
  }

  function updatePortfolioValues() {
    var balanceEl  = $('[data-display="balance"]');
    var holdingsEl = $('[data-display="holdings-value"]');
    if (balanceEl) balanceEl.textContent = Utils.formatCurrency(Store.getBalance('usd'));
    if (holdingsEl) {
      var holdings = Store.getHoldings();
      var total = holdings.reduce(function (sum, h) {
        return sum + h.quantity * MarketEngine.getPrice(h.assetId);
      }, 0);
      holdingsEl.textContent = Utils.formatCurrency(total);
    }
  }

  /* ---------- News ---------- */

  function filterNews(target) {
    var category  = target.dataset.category;
    var sentiment = target.dataset.sentiment;
    Store.set('newsFilter', { category: category, sentiment: sentiment });

    $$('[data-filter-news]').forEach(function (btn) { btn.classList.remove('active'); });
    target.classList.add('active');

    // Hide/show news cards based on filter
    $$('.news-card').forEach(function (card) {
      var match = true;
      if (category && card.dataset.category !== category) match = false;
      if (sentiment && card.dataset.sentiment !== sentiment) match = false;
      card.style.display = match ? '' : 'none';
    });
  }

  function openNewsModal(target) {
    var newsId = target.dataset.newsId || target.closest('[data-news-id]')?.dataset.newsId;
    var article = (DataNews || []).find(function (n) { return n.id === newsId; });
    if (!article) return;

    var modalContent =
      '<div class="news-modal-content">' +
        '<h2>' + (article.title || 'News Article') + '</h2>' +
        '<div class="news-meta">' +
          '<span>' + (article.date || 'Recently') + '</span>' +
          '<span class="sentiment-badge ' + (article.sentiment || 'neutral') + '">' +
            (article.sentiment || 'neutral') +
          '</span>' +
        '</div>' +
        '<p>' + (article.content || article.summary || '') + '</p>' +
        (article.impact ? '<p class="impact-note"><strong>Market Impact:</strong> ' + article.impact + '</p>' : '') +
      '</div>';

    UI.createModal(article.title || 'News', modalContent);
  }

  function simulateNewsEvent(target) {
    // Pick a random news event and apply its impact
    var events = DataNews || [];
    if (events.length === 0) {
      UI.createToast('No news events available', 'error');
      return;
    }
    var event = events[Math.floor(Math.random() * events.length)];
    if (event.impactAsset && event.impactStrength) {
      MarketEngine.applyNewsImpact(event.impactAsset, parseFloat(event.impactStrength));
      UI.createToast('📰 ' + event.title + ' — Market impact applied!', 'info');
    } else {
      UI.createToast('📰 Simulating: ' + event.title, 'info');
    }
  }

  /* ---------- Scams ---------- */

  function switchScamTab(target) {
    var container = target.closest('.scam-tabs') || target.closest('[data-scam-tabs]');
    if (!container) return;
    $$('.scam-tab', container).forEach(function (t) { t.classList.remove('active'); });
    target.classList.add('active');
    var panelId = target.dataset.panel;
    $$('.scam-panel', container).forEach(function (p) { p.style.display = 'none'; });
    var panel = $('#' + panelId, container) || $('[data-panel-id="' + panelId + '"]', container);
    if (panel) panel.style.display = '';
  }

  function investigateRedFlag(target) {
    var flagEl = target.closest('.red-flag') || target.closest('[data-flag-id]');
    if (!flagEl || flagEl.classList.contains('revealed')) return;
    flagEl.classList.add('revealed');
    var explanation = flagEl.querySelector('.flag-explanation');
    if (explanation) explanation.style.display = '';

    // Track how many found
    var container = target.closest('.investigation-container') || target.closest('[data-investigation]');
    if (container) {
      var revealed = $$('.red-flag.revealed', container).length;
      var total    = $$('.red-flag', container).length;
      var counter  = $('.flags-found-counter', container);
      if (counter) counter.textContent = revealed + '/' + total;
      if (revealed === total) {
        Store.addXp(25);
        UI.createToast('All red flags found! +25 XP 🕵️', 'success');
      }
    }
  }

  function nextPumpStage(target) {
    var timeline = target.closest('.pump-timeline') || target.closest('[data-pump-timeline]');
    if (!timeline) return;
    var stages = $$('.pump-stage', timeline);
    var activeIdx = stages.findIndex(function (s) { return s.classList.contains('active'); });
    if (activeIdx >= 0) stages[activeIdx].classList.remove('active');
    var nextIdx = Math.min(activeIdx + 1, stages.length - 1);
    stages[nextIdx].classList.add('active');

    // Auto-scroll the active stage into view
    stages[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (nextIdx === stages.length - 1) {
      Store.addXp(10);
      UI.createToast('Pump & dump cycle complete! +10 XP 💸', 'info');
    }
  }

  function autoPlayPump(target) {
    if (pumpAutoInterval) {
      clearInterval(pumpAutoInterval);
      pumpAutoInterval = null;
      target.textContent = '▶ Auto Play';
      return;
    }
    target.textContent = '⏸ Pause';
    pumpAutoInterval = setInterval(function () {
      var btn = document.querySelector('[data-action="next-pump-stage"]');
      if (btn) btn.click();
      else {
        clearInterval(pumpAutoInterval);
        pumpAutoInterval = null;
      }
    }, 2000);
  }

  /* ---------- Blockchain Apps ---------- */

  function exploreBlockchainApp(target) {
    var appId = target.dataset.appId || target.closest('[data-app-id]')?.dataset.appId;
    // Find app definition from learning data or render a generic modal
    var apps = (DataLearning || {}).blockchainApps || [];
    var appData = apps.find(function (a) { return a.id === appId; });

    var title = appData ? appData.name : 'Blockchain Application';
    var content = appData ?
      '<div class="app-case-study">' +
        '<p>' + (appData.description || '') + '</p>' +
        (appData.useCases ? '<h3>Use Cases</h3><ul>' +
          appData.useCases.map(function (uc) { return '<li>' + uc + '</li>'; }).join('') +
          '</ul>' : '') +
        (appData.benefits ? '<h3>Benefits</h3><ul>' +
          appData.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
          '</ul>' : '') +
      '</div>' :
      '<p>Explore how this blockchain application works.</p>';

    UI.createModal(title, content);
  }

  /* ---------- Academy ---------- */

  function selectScenario(target) {
    var container = target.closest('.scenario-container') || target.closest('[data-scenario]');
    if (!container) return;
    $$('.scenario-option', container).forEach(function (o) { o.classList.remove('selected'); });
    target.classList.add('selected');
  }

  function checkScenario(target) {
    var container = target.closest('.scenario-container') || target.closest('[data-scenario]');
    if (!container) return;
    var selected = $('.scenario-option.selected', container);
    var feedback = $('.scenario-feedback', container);
    if (!selected || !feedback) return;

    var isCorrect = selected.dataset.correct === 'true';
    feedback.style.display = '';
    feedback.className = 'scenario-feedback ' + (isCorrect ? 'correct' : 'incorrect');
    feedback.textContent = isCorrect ?
      '✓ Great thinking! That\'s the right approach.' :
      '✗ Not quite — consider the risks and alternatives.';

    $$('.scenario-option', container).forEach(function (o) {
      if (o.dataset.correct === 'true') o.classList.add('correct');
    });
  }

  function completeLesson(target) {
    var lessonId = target.dataset.lessonId || target.closest('[data-lesson-id]')?.dataset.lessonId;
    if (!lessonId) return;
    Store.updateModuleProgress('academy', lessonId, 'completed');
    Store.addXp(20);
    target.classList.add('completed');
    target.disabled = true;
    UI.createToast('Lesson completed! +20 XP 🎓', 'success');
  }

  /* ---------- Profile ---------- */

  function editName(target) {
    var nameEl = $('.profile-name') || $('[data-display="username"]');
    if (!nameEl) return;
    var current = nameEl.textContent;
    nameEl.innerHTML = '<input type="text" class="name-edit-input" value="' + current + '" ' +
      'data-action="save-name" style="font-size:inherit;padding:4px 8px;">';
    nameEl.querySelector('input').focus();
  }

  function saveName(target) {
    var input = target.closest('input') || $('input.name-edit-input');
    if (!input) return;
    var newName = input.value.trim();
    if (newName.length < 2) {
      UI.createToast('Name must be at least 2 characters', 'error');
      return;
    }
    Store.set('username', newName);
    var container = input.closest('.profile-name-container') || input.parentElement;
    if (container) container.textContent = newName;
    UI.createToast('Name updated! ✏️', 'success');
  }

  function toggleSetting(target) {
    var setting = target.dataset.setting;
    if (!setting) return;
    var current = Store.get(setting);
    Store.set(setting, !current);
    target.classList.toggle('active', !current);
  }

  function resetProgress() {
    UI.createConfirmDialog(
      'Reset All Progress?',
      'This will clear your XP, trades, achievements, and learning progress. This action cannot be undone.',
      function () {
        Store.reset();
        UI.createToast('All progress has been reset', 'info');
        Router.navigate('/');
      }
    );
  }

  /* ---------- Final Challenge ---------- */

  function startChallenge(target) {
    var state = Store.get('challengeState');
    // Validate prerequisites
    var totalXp = Store.get('xp') || 0;
    if (totalXp < 200) {
      UI.createToast('You need at least 200 XP to start the challenge! (Current: ' + totalXp + ' XP)', 'error');
      return;
    }

    Store.set('challengeState', {
      day: 0,
      balance: 10000,
      portfolio: {},
      history: [],
      score: 0,
      active: true
    });
    UI.createToast('Challenge started! Make your first move 🚀', 'success');
    // Re-render to show challenge UI
    Router.navigate('/challenge');
  }

  function processChallengeAction(target) {
    var action = target.dataset.move; // 'buy', 'sell', 'hold'
    if (!action) return;

    var cs = Store.get('challengeState');
    if (!cs || !cs.active) return;

    var assetId = target.dataset.assetId || 'btc';
    var amount  = parseFloat(target.dataset.amount) || 1000;

    if (action === 'buy') {
      var price = MarketEngine.getPrice(assetId);
      var qty = amount / price;
      cs.portfolio[assetId] = (cs.portfolio[assetId] || 0) + qty;
      cs.balance -= amount;
      cs.history.push({ day: cs.day, action: 'buy', assetId: assetId, amount: amount, price: price });
    } else if (action === 'sell') {
      var heldQty = cs.portfolio[assetId] || 0;
      if (heldQty <= 0) {
        UI.createToast('No ' + assetId.toUpperCase() + ' held to sell', 'error');
        return;
      }
      var sellQty = Math.min(heldQty, amount / MarketEngine.getPrice(assetId));
      var sellPrice = MarketEngine.getPrice(assetId);
      cs.balance += sellQty * sellPrice;
      cs.portfolio[assetId] -= sellQty;
      cs.history.push({ day: cs.day, action: 'sell', assetId: assetId, qty: sellQty, price: sellPrice });
    }
    // 'hold' — do nothing, just record
    if (action === 'hold') {
      cs.history.push({ day: cs.day, action: 'hold' });
    }

    Store.set('challengeState', cs);
    UI.createToast('Day ' + cs.day + ': ' + action.toUpperCase() + ' executed', 'info');
  }

  function nextChallengeDay(target) {
    var cs = Store.get('challengeState');
    if (!cs || !cs.active) return;

    cs.day += 1;

    // Apply a random news impact for this day
    var events = DataNews || [];
    if (events.length > 0) {
      var event = events[Math.floor(Math.random() * events.length)];
      if (event.impactAsset && event.impactStrength) {
        MarketEngine.applyNewsImpact(event.impactAsset, parseFloat(event.impactStrength));
      }
    }

    // Calculate portfolio value
    var portfolioValue = 0;
    for (var asset in cs.portfolio) {
      portfolioValue += cs.portfolio[asset] * MarketEngine.getPrice(asset);
    }
    cs.totalValue = cs.balance + portfolioValue;
    cs.score = ((cs.totalValue - 10000) / 10000 * 100).toFixed(2);

    // Check if challenge ends (10 days)
    if (cs.day >= 10) {
      cs.active = false;
      var xpEarned = cs.totalValue > 10000 ? 50 : 10;
      Store.addXp(xpEarned);
      if (cs.totalValue > 10000) {
        Store.unlockAchievement('challenge_winner');
      }
      UI.createToast('Challenge complete! Return: ' + cs.score + '% — +' + xpEarned + ' XP 🏆', 'success');
    }

    Store.set('challengeState', cs);

    // Show day‑transition feedback
    var dayDisplay = $('[data-display="challenge-day"]');
    if (dayDisplay) dayDisplay.textContent = 'Day ' + cs.day + '/10';
  }

  function retakeChallenge(target) {
    Store.set('challengeState', null);
    UI.createToast('Challenge reset — ready for another attempt!', 'info');
    Router.navigate('/challenge');
  }

  /* ================================================================== */
  /*  5. Page Animation System                                           */
  /* ================================================================== */

  function initPageAnimations() {
    // Trigger CSS animation classes on elements as they enter the viewport
    var animEls = $$('.animate-fade-in, .animate-fade-in-up, .animate-fade-in-down, ' +
      '.animate-fade-in-left, .animate-fade-in-right, .animate-scale-in, .animate-slide-up');

    // Set up IntersectionObserver for scroll‑triggered animations
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      animEls.forEach(function (el) {
        el.classList.remove('animated');
        observer.observe(el);
      });
    } else {
      // Fallback: animate everything immediately
      animEls.forEach(function (el) { el.classList.add('animated'); });
    }

    // Animate count‑up numbers
    $$('[data-countup]').forEach(function (el) {
      var target = parseFloat(el.dataset.countup);
      if (isNaN(target)) return;
      var decimals = parseInt(el.dataset.decimals, 10) || 0;
      var prefix   = el.dataset.prefix || '';
      var suffix   = el.dataset.suffix || '';
      Utils.animateCounter(el, 0, target, 1200, { decimals: decimals, prefix: prefix, suffix: suffix });
    });

    // Init UI components
    UI.initAccordions();
    UI.initTabs();

    // Add ripple effect to all buttons
    $$('.btn, .btn-primary, .btn-secondary, .btn-outline').forEach(function (btn) {
      UI.addRippleEffect(btn);
    });
  }

  function initPageEvents() {
    // Search input handling for news page
    var searchInput = $('input[data-action="search-news"]');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function () {
        var query = searchInput.value.toLowerCase().trim();
        $$('.news-card').forEach(function (card) {
          var title = (card.dataset.title || card.textContent).toLowerCase();
          card.style.display = title.includes(query) ? '' : 'none';
        });
      }, 250));
    }

    // Chart Challenge button (on trading page)
    var chartChallengeBtn = $('[data-action="open-chart-challenge"]');
    if (chartChallengeBtn) {
      chartChallengeBtn.addEventListener('click', openChartChallenge);
    }

    // Initialise chart if on trading page
    if (getCurrentRouteName() === 'trading') {
      renderTradingChart();
      updateTradingPanel();
    }
  }

  /* ================================================================== */
  /*  6. Market Engine Integration                                       */
  /* ================================================================== */

  function handleRouteChanged(e) {
    var route = e.detail?.route || getCurrentRouteName();

    // Stop all intervals when leaving any page
    stopMarketInterval();
    stopTickerInterval();
    stopPumpInterval();

    // Start market engine when entering trading page
    if (route === 'trading' || route === '/trading') {
      startMarketInterval();
    }

    // Start ticker when on landing page
    if (route === 'landing' || route === '/' || route === '/landing') {
      startTickerInterval();
    }

    // Update navbar state after every route change
    updateNavbarState();
  }

  function startMarketInterval() {
    if (marketInterval) return;
    marketInterval = setInterval(function () {
      MarketEngine.tick();
      // Throttle chart re‑render to every ~6 seconds (every other tick)
      if (!chartThrottle) {
        chartThrottle = setTimeout(function () {
          chartThrottle = null;
          renderTradingChart();
          updateTradingPanel();
          updatePortfolioValues();
        }, 300);
      }
    }, 3000);
    MarketEngine.start();
  }

  function stopMarketInterval() {
    if (marketInterval) {
      clearInterval(marketInterval);
      marketInterval = null;
    }
    MarketEngine.stop();
    if (chartThrottle) {
      clearTimeout(chartThrottle);
      chartThrottle = null;
    }
  }

  function stopTickerInterval() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
  }

  function stopPumpInterval() {
    if (pumpAutoInterval) {
      clearInterval(pumpAutoInterval);
      pumpAutoInterval = null;
    }
  }

  /* ================================================================== */
  /*  7. Ticker Updates (Landing Page)                                   */
  /* ================================================================== */

  function startTickerInterval() {
    if (tickerInterval) return;
    updateTickerPrices(); // run immediately
    tickerInterval = setInterval(updateTickerPrices, 5000);
  }

  function updateTickerPrices() {
    var assets = MarketEngine.getAssetIds ? MarketEngine.getAssetIds() : (DataMarket || []).map(function (a) { return a.id; });
    assets.forEach(function (id) {
      var priceEl  = $('[data-ticker-price="' + id + '"]');
      var changeEl = $('[data-ticker-change="' + id + '"]');
      if (priceEl) priceEl.textContent = Utils.formatCurrency(MarketEngine.getPrice(id));
      if (changeEl) {
        var change = MarketEngine.get24hChange(id);
        changeEl.textContent = Utils.formatPercent(change);
        changeEl.className = (change >= 0 ? 'ticker-change positive' : 'ticker-change negative');
      }
    });
  }

  /* ================================================================== */
  /*  8. Navbar State                                                   */
  /* ================================================================== */

  function updateNavbarState() {
    // Set active nav link
    var currentRoute = getCurrentRouteName();
    $$('.nav-link, .sidebar-link').forEach(function (link) {
      var linkPage = link.dataset.page || link.getAttribute('href');
      if (!linkPage) return;
      // Normalize: strip leading #/ and compare
      var normalized = linkPage.replace(/^#\/?/, '');
      var isActive = (normalized === currentRoute) ||
                     (currentRoute === '/' && (normalized === '' || normalized === 'landing')) ||
                     (currentRoute === 'trading' && normalized.startsWith('trading'));
      link.classList.toggle('active', isActive);
    });

    // Update XP display in navbar
    var xpDisplay = $('[data-display="xp"], .xp-display, .nav-xp');
    if (xpDisplay) xpDisplay.textContent = (Store.get('xp') || 0) + ' XP';

    // Update avatar / username
    var username = Store.get('username') || 'Trader';
    var nameDisplay = $('[data-display="username"], .nav-username');
    if (nameDisplay) nameDisplay.textContent = username;
  }

  function handleNavScroll() {
    var navbar = document.querySelector('.navbar, .main-navbar');
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ================================================================== */
  /*  9. Chart Challenge Mini‑Game                                       */
  /* ================================================================== */

  function openChartChallenge() {
    var assetId = Store.get('selectedAsset') || 'btc';
    var candles = MarketEngine.getCandles(assetId, '1D');
    if (!candles || candles.length < 30) {
      UI.createToast('Not enough data for a challenge yet', 'error');
      return;
    }

    // Show a truncated chart (hide last 5 candles)
    var visibleCandles = candles.slice(0, -5);
    var hiddenCandles  = candles.slice(-5);

    // Create modal with chart canvas
    var modalId = 'chart-challenge-modal';
    var modalHTML =
      '<div class="chart-challenge">' +
        '<p class="challenge-prompt">Study the chart below. What is the most likely next movement?</p>' +
        '<canvas id="challenge-chart" width="600" height="300"></canvas>' +
        '<div class="challenge-choices">' +
          '<button class="btn btn-outline challenge-choice" data-choice="bullish">📈 Bullish</button>' +
          '<button class="btn btn-outline challenge-choice" data-choice="bearish">📉 Bearish</button>' +
          '<button class="btn btn-outline challenge-choice" data-choice="sideways">➡️ Sideways</button>' +
        '</div>' +
        '<div class="challenge-result" style="display:none;"></div>' +
      '</div>';

    UI.createModal('Chart Challenge 📊', modalHTML);

    // Render the chart after modal is in DOM (slight delay for DOM insertion)
    setTimeout(function () {
      var canvas = document.getElementById('challenge-chart');
      if (canvas) {
        Charts.renderCandlestick(canvas, visibleCandles, { showMA: true });
      }
    }, 100);

    // Handle choice clicks
    setTimeout(function () {
      $$('.challenge-choice').forEach(function (btn) {
        btn.addEventListener('click', function () {
          handleChartChoice(btn.dataset.choice, hiddenCandles, candles, assetId);
        });
      });
    }, 150);
  }

  function handleChartChoice(choice, hiddenCandles, allCandles, assetId) {
    var resultEl = $('.challenge-result');
    var choicesEl = $$('.challenge-choice');

    // Determine actual movement from hidden candles
    if (!hiddenCandles || hiddenCandles.length === 0) return;
    var firstClose  = hiddenCandles[0].open;
    var lastClose   = hiddenCandles[hiddenCandles.length - 1].close;
    var actualChange = ((lastClose - firstClose) / firstClose * 100).toFixed(2);

    var actualMovement = Math.abs(actualChange) < 1 ? 'sideways' :
                          actualChange > 0 ? 'bullish' : 'bearish';
    var isCorrect = choice === actualMovement;

    // Disable all choice buttons
    choicesEl.forEach(function (b) { b.disabled = true; });

    // Highlight correct/incorrect
    choicesEl.forEach(function (b) {
      if (b.dataset.choice === actualMovement) b.classList.add('correct');
      if (b.dataset.choice === choice && !isCorrect) b.classList.add('incorrect');
    });

    // Show the full chart with revealed candles
    var canvas = document.getElementById('challenge-chart');
    if (canvas) {
      Charts.renderCandlestick(canvas, allCandles, { showMA: true });
    }

    // Show result explanation
    if (resultEl) {
      resultEl.style.display = '';
      // Generate technical reasoning
      var rsi = Utils.calculateRSI(allCandles.map(function (c) { return c.close; }));
      var ma  = Utils.calculateMA(allCandles.map(function (c) { return c.close; }), 10);
      var lastPrice = allCandles[allCandles.length - 1].close;

      var reasoning = '';
      if (rsi > 70) reasoning += 'RSI was overbought (' + rsi.toFixed(1) + '), suggesting a pullback. ';
      else if (rsi < 30) reasoning += 'RSI was oversold (' + rsi.toFixed(1) + '), suggesting a bounce. ';
      if (lastPrice > ma) reasoning += 'Price was above the 10‑period MA, indicating bullish momentum. ';
      else reasoning += 'Price was below the 10‑period MA, indicating bearish pressure. ';

      resultEl.innerHTML =
        '<div class="result-badge ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
          (isCorrect ? '✓ Correct!' : '✗ Incorrect') +
        '</div>' +
        '<p>Actual movement: <strong>' + actualMovement + '</strong> (' + (actualChange > 0 ? '+' : '') + actualChange + '%)</p>' +
        '<p class="reasoning"><em>Analysis:</em> ' + reasoning + '</p>';

      if (isCorrect) {
        Store.addXp(20);
        resultEl.innerHTML += '<p class="xp-reward">+20 XP earned! 🧠</p>';
      } else {
        Store.addXp(5);
        resultEl.innerHTML += '<p class="xp-reward">+5 XP for trying 💪</p>';
      }
    }
  }

  /* ================================================================== */
  /*  10. Toast System (Store subscription)                              */
  /* ================================================================== */

  function handleStoreChange(change) {
    if (!change) return;

    // XP gained
    if (change.key === 'xp' && change.newValue > (change.oldValue || 0)) {
      var diff = change.newValue - (change.oldValue || 0);
      if (diff > 0 && diff < 500) {
        // Small XP gains — skip toasts for large resets
        UI.createToast('Earned +' + diff + ' XP! 🎉', 'success');
      }
    }

    // Achievement unlocked
    if (change.key === 'achievements' && change.newValue && change.oldValue) {
      var newIds = change.newValue.filter(function (a) {
        return !(change.oldValue || []).find(function (o) { return o.id === a.id; });
      });
      newIds.forEach(function (a) {
        UI.createToast('Achievement Unlocked: ' + (a.name || a.id) + '! 🏆', 'success');
      });
    }

    // Trade executed — detected by transactions array length change
    if (change.key === 'transactions' && change.newValue && change.oldValue &&
        change.newValue.length > (change.oldValue.length || 0)) {
      var latest = change.newValue[change.newValue.length - 1];
      if (latest) {
        var side = latest.type === 'buy' ? 'Bought' : 'Sold';
        UI.createToast(
          side + ' ' + (latest.quantity || 0).toFixed(4) + ' ' +
          (latest.assetId || '').toUpperCase() + ' for ' +
          Utils.formatCurrency(latest.total || latest.price * latest.quantity),
          'info'
        );
      }
    }

    // Update XP display in navbar on any XP change
    if (change.key === 'xp') {
      var xpDisplay = $('[data-display="xp"], .xp-display, .nav-xp');
      if (xpDisplay) xpDisplay.textContent = change.newValue + ' XP';
    }
  }

  /* ================================================================== */
  /*  11. Error Handling                                                 */
  /* ================================================================== */

  function renderErrorPage(err) {
    return (
      '<div class="error-page animate-fade-in" style="text-align:center;padding:80px 20px;">' +
        '<div class="error-icon" style="font-size:64px;margin-bottom:20px;">⚠️</div>' +
        '<h1 style="font-size:28px;margin-bottom:12px;">Something went wrong</h1>' +
        '<p style="color:var(--text-secondary);margin-bottom:8px;">' +
          (err && err.message ? err.message : 'An unexpected error occurred while loading this page.') +
        '</p>' +
        '<p style="color:var(--text-tertiary);font-size:14px;margin-bottom:32px;">' +
          'Please try again or navigate to a different page.' +
        '</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;">' +
          '<button class="btn btn-primary" data-action="navigate" data-page="/">Go Home</button>' +
          '<button class="btn btn-outline" onclick="location.reload()">Reload Page</button>' +
        '</div>' +
      '</div>'
    );
  }

  /* ================================================================== */
  /*  12. Keyboard Shortcuts                                             */
  /* ================================================================== */

  function handleKeyboard(e) {
    // Escape — close any open modal / sidebar
    if (e.key === 'Escape') {
      var modal = document.querySelector('.modal-overlay, .modal.active');
      if (modal) {
        modal.remove();
        return;
      }
      var sidebar = document.querySelector('.sidebar.open, .mobile-nav.open');
      if (sidebar) {
        sidebar.classList.remove('open');
        var overlay = document.querySelector('.sidebar-overlay.visible');
        if (overlay) overlay.classList.remove('visible');
        return;
      }
    }

    // Number keys 1‑6 — switch assets on trading page
    if (getCurrentRouteName() === 'trading') {
      var assetIds = MarketEngine.getAssetIds ? MarketEngine.getAssetIds() :
        (DataMarket || []).slice(0, 6).map(function (a) { return a.id; });
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= assetIds.length) {
        Store.set('selectedAsset', assetIds[num - 1]);
        refreshTradingView();
      }
    }
  }

  /* ================================================================== */
  /*  Utility: get current route name                                    */
  /* ================================================================== */

  function getCurrentRouteName() {
    var route = Router.getCurrentRoute ? Router.getCurrentRoute() : '';
    return route.replace(/^#\/?/, '').replace(/\/.*$/, '') || '/';
  }

})();