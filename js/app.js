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
        var node = target.closest('.timeline-node, .tl-milestone');
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
      case 'switch-order-side':
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
      case 'switch-tab':
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
      case 'scam-tab':
        switchScamTab(target);
        break;

      case 'investigate':
      case 'investigate-rug':
        investigateRedFlag(target);
        break;

      case 'investigate-giveaway':
        investigateGiveawayRedFlag(target);
        break;

      case 'next-pump-stage':
      case 'pd-next':
        nextPumpStage(target);
        break;

      case 'pd-prev':
        // Handled by timeline - go back one stage
        var pdTimeline = target.closest('.pump-timeline') || target.closest('[data-pump-timeline]');
        if (pdTimeline) {
          var pdStages = $$('.pump-stage', pdTimeline);
          var pdActive = pdStages.findIndex(function (s) { return s.classList.contains('active'); });
          if (pdActive > 0) {
            pdStages[pdActive].classList.remove('active');
            pdStages[pdActive - 1].classList.add('active');
            pdStages[pdActive - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;

      case 'auto-play-pump':
      case 'pd-autoplay':
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
    var milestoneId = target.dataset.milestoneId || target.dataset.id || (target.closest('[data-milestone-id]') || target.closest('[data-id]'))?.dataset?.milestoneId || (target.closest('[data-milestone-id]') || target.closest('[data-id]'))?.dataset?.id;
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
    var form = target.closest('form') || target.closest('.transaction-form') || target.closest('.sim-form');
    if (!form) return;

    var senderEl = $('#sim-sender', form) || $('select[data-field="from"]', form) || $('select[name="from"]', form);
    var receiverEl = $('#sim-receiver', form) || $('select[data-field="to"]', form) || $('select[name="to"]', form);
    var amountEl = $('#sim-amount', form) || $('input[data-field="amount"]', form) || $('input[name="amount"]', form);

    var fromAddr = senderEl ? senderEl.value : 'Alice';
    var toAddr   = receiverEl ? receiverEl.value : 'Bob';
    var amount   = amountEl ? amountEl.value : '0.5';

    // Find sim-step elements
    var stepsGrid = document.querySelector('#sim-steps-grid, .sim-steps-grid');
    var stepEls   = stepsGrid ? $$('.sim-step', stepsGrid) : [];
    var chainEl   = document.querySelector('#blockchain-chain, .blockchain-chain, .blockchain-visual, .chain-container');
    var detailEl  = document.querySelector('#sim-detail, .sim-detail');

    // Reset all steps
    stepEls.forEach(function (s) {
      s.classList.remove('sim-active', 'sim-done');
    });
    if (detailEl) detailEl.style.display = 'none';

    var stepIdx = 0;

    if (stepEls.length > 0) {
      // Activate first step immediately
      stepEls[0].classList.add('sim-active');

      var stepInterval = setInterval(function () {
        stepIdx++;
        if (stepIdx < stepEls.length) {
          // Deactivate previous, activate current
          stepEls[stepIdx - 1].classList.remove('sim-active');
          stepEls[stepIdx - 1].classList.add('sim-done');
          stepEls[stepIdx].classList.add('sim-active');

          // Show detail for current step
          if (detailEl) {
            var detailContent = detailEl.querySelector('#sim-detail-content') || detailEl;
            var stepTitles = ['Transaction Created', 'Broadcast to Network', 'Block Formation',
              'Network Validation', 'Consensus Reached', 'Block Added to Chain', 'Transaction Confirmed'];
            detailContent.innerHTML = '<p style="margin:0;color:var(--text-primary);font-weight:600;">Step ' + (stepIdx + 1) + ': ' + (stepTitles[stepIdx] || 'Processing...') + '</p>';
            detailEl.style.display = '';
          }
        } else {
          clearInterval(stepInterval);
          // Mark all steps as done
          stepEls[stepIdx - 1].classList.remove('sim-active');
          stepEls.forEach(function (s) { s.classList.add('sim-done'); });

          // Hide detail, show completion
          if (detailEl) {
            var detailContent = detailEl.querySelector('#sim-detail-content') || detailEl;
            detailContent.innerHTML = '<p style="margin:0;color:#10b981;font-weight:700;">✅ Transaction Complete!</p>';
            detailEl.style.display = '';
          }

          // Append visual block to chain
          if (chainEl) {
            var blockNum = chainEl.querySelectorAll('.chain-block').length + 1;
            var block = document.createElement('div');
            block.className = 'chain-block animate-fade-in-up';
            block.innerHTML =
              '<div class="chain-block-label">Block #' + blockNum + '</div>' +
              '<div class="chain-block-row"><span>From:</span><span>' + Utils.generateId().slice(0, 10) + '...</span></div>' +
              '<div class="chain-block-row"><span>To:</span><span>' + Utils.generateId().slice(0, 10) + '...</span></div>' +
              '<div class="chain-block-row"><span>Amount:</span><span>' + amount + ' BTC</span></div>' +
              '<div class="chain-block-row"><span>Hash:</span><span>0x' + Utils.generateId().slice(0, 16) + '...</span></div>';
            chainEl.appendChild(block);
            // Scroll chain to end
            chainEl.scrollLeft = chainEl.scrollWidth;

            // Update chain stats
            var statsEl = document.querySelector('#chain-stats');
            if (statsEl) statsEl.textContent = 'Chain height: ' + blockNum + ' blocks';
          }

          Store.addXp(5);
          UI.createToast('Transaction mined successfully! +5 XP ⛏️', 'success');
        }
      }, 800);
    }
  }

  function resetBlockchain(target) {
    var chainEl = document.querySelector('#blockchain-chain, .blockchain-chain, .blockchain-visual, .chain-container');
    if (!chainEl) return;
    // Reset to genesis block only
    chainEl.innerHTML =
      '<div class="chain-block genesis-block">' +
        '<div class="chain-block-label">Genesis Block</div>' +
        '<div class="chain-block-row"><span>Message:</span><span>The Times 03/Jan/2009 Chancellor on brink of second bailout</span></div>' +
      '</div>';
    // Reset sim steps
    $$('.sim-step').forEach(function (s) { s.classList.remove('sim-active', 'sim-done'); });
    var detailEl = document.querySelector('#sim-detail, .sim-detail');
    if (detailEl) detailEl.style.display = 'none';
    var statsEl = document.querySelector('#chain-stats');
    if (statsEl) statsEl.textContent = 'Chain height: 1 block';
    UI.createToast('Blockchain reset to genesis', 'info');
  }

  function markRead(target) {
    var articleId = target.dataset.articleId || target.dataset.id || (target.closest('[data-article-id]') || target.closest('[data-id]'))?.dataset?.articleId || (target.closest('[data-article-id]') || target.closest('[data-id]'))?.dataset?.id;
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
    var questionEl = target.closest('.quiz-question, .quiz-q') || target.closest('[data-question-id]') || target.closest('[data-question]');
    if (!questionEl) return;
    // Prevent double‑answer
    if (questionEl.classList.contains('answered')) return;
    questionEl.classList.add('answered');

    var questionId  = questionEl.dataset.questionId || questionEl.dataset.question;
    var selectedIdx = parseInt(target.dataset.index, 10);
    var correctAttr = target.dataset.correct;
    var isCorrect   = correctAttr === 'true' || correctAttr === true;

    // If no explicit index, derive from option position
    if (isNaN(selectedIdx)) {
      var allOptions = $$('.quiz-option', questionEl);
      selectedIdx = allOptions.indexOf(target);
    }

    // Visual feedback on all options
    var options = $$('.quiz-option', questionEl);
    options.forEach(function (opt, i) {
      opt.classList.remove('selected', 'correct', 'incorrect');
      if (opt.dataset.correct === 'true') opt.classList.add('correct');
      if (opt === target && !isCorrect) opt.classList.add('incorrect');
      if (opt === target) opt.classList.add('selected');
    });

    // Show explanation
    var explanation = $('.quiz-explanation, .quiz-feedback', questionEl);
    if (explanation) explanation.style.display = '';

    // Award XP and record
    if (isCorrect) {
      Store.addXp(15);
      UI.createToast('Correct! +15 XP 🧠', 'success');
    } else {
      UI.createToast('Incorrect — review the material and try again!', 'error');
    }

    if (questionId) Store.recordQuizAttempt(questionId, isCorrect);
  }

  /* ---------- Trading ---------- */

  function selectTradingAsset(target) {
    var assetId = target.dataset.assetId || target.dataset.id;
    if (!assetId) return;
    Store.set('selectedAsset', assetId);
    refreshTradingView();
  }

  function setChartTimeframe(target) {
    var tf = target.dataset.timeframe || target.dataset.value;
    if (!tf) return;
    Store.set('chartTimeframe', tf);
    $$('.timeframe-btn').forEach(function (b) { b.classList.remove('active'); });
    target.classList.add('active');
    renderTradingChart();
  }

  function toggleChartIndicator(target) {
    var indicator = target.dataset.indicator || target.dataset.value;
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
    $$('.chart-type-btn').forEach(function (b) { b.classList.toggle('active', (b.dataset.type || b.dataset.value) === next); });
    renderTradingChart();
  }

  function switchOrderType(target) {
    var type = target.dataset.orderType || target.dataset.value;
    if (!type) return;
    Store.set('orderType', type);
    $$('.order-type-btn').forEach(function (b) { b.classList.toggle('active', (b.dataset.orderType || b.dataset.value) === type); });
    var limitInput = $('#limit-price-input, .limit-price-input');
    if (limitInput) limitInput.style.display = type === 'limit' ? '' : 'none';
  }

  function switchOrderTab(target) {
    var tab = target.dataset.tab || target.dataset.value;
    if (!tab) return;
    $$('.order-tab').forEach(function (t) { t.classList.remove('active'); });
    target.classList.add('active');
    var panel = target.closest('.order-panel');
    if (panel) {
      $$('.order-content', panel).forEach(function (c) { c.style.display = 'none'; });
      var content = $('[data-order-content="' + tab + '"]', panel);
      if (content) content.style.display = '';
    }
    // Update submit button text
    var submitBtn = $('#order-submit-btn');
    if (submitBtn) submitBtn.textContent = (tab === 'sell' ? 'Sell ' : 'Buy ') + (Store.get('selectedAsset') || 'BTC').toUpperCase();
  }

  function setQuickAmount(target) {
    var pct = parseFloat(target.dataset.value || target.dataset.percent);
    if (isNaN(pct)) return;
    var activeTab = document.querySelector('.order-tab.active');
    var side = activeTab ? (activeTab.dataset.value || activeTab.dataset.tab) : 'buy';
    var balance = side === 'sell' ? getAssetHoldingValue() : Store.getBalance('usd');
    var amountInput = $('#order-amount-input, input[data-field="amount"]') || $('input[name="amount"]');
    if (amountInput) {
      amountInput.value = ((balance * pct) / 100).toFixed(6);
      // Trigger input event so any order summary updates
      amountInput.dispatchEvent(new Event('input', { bubbles: true }));
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
    var assetId = target.dataset.assetId || target.dataset.id || (target.closest('[data-asset-id]') || target.closest('[data-id]'))?.dataset?.assetId || (target.closest('[data-asset-id]') || target.closest('[data-id]'))?.dataset?.id;
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
    var tabId = target.dataset.bottomTab || target.dataset.tab;
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
    // Guard: if there's no trading chart canvas, we're not on the trading page
    if (!document.querySelector('#trading-chart, .trading-chart canvas')) return;
    renderTradingChart();
    updateTradingPanel();
    updatePortfolioValues();
  }

  function renderTradingChart() {
    try {
      var canvas = document.querySelector('#trading-chart, .trading-chart canvas');
      if (!canvas) return;
      var assetId   = Store.get('selectedAsset') || 'btc';
      var timeframe = Store.get('chartTimeframe') || '1D';
      var chartType = Store.get('chartType') || 'candlestick';
      var candles   = MarketEngine.getCandles(assetId, timeframe);

      if (!candles || candles.length === 0) return;

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
    } catch (err) {
      // Silently skip chart rendering errors
      console.warn('Chart render error:', err);
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
    var tabId = target.dataset.tab || target.dataset.panel;
    if (!tabId) return;
    $$('.scam-tab', container).forEach(function (t) { t.classList.remove('active'); });
    target.classList.add('active');
    // Panels use IDs like "scam-panel-rugpull"
    $$('.scam-panel', container).forEach(function (p) { p.classList.remove('active'); p.style.display = 'none'; });
    var panel = document.querySelector('#scam-panel-' + tabId) ||
                $('#' + tabId, container) ||
                $('[data-panel-id="' + tabId + '"]', container);
    if (panel) { panel.style.display = ''; panel.classList.add('active'); }
  }

  function investigateRedFlag(target) {
    var flagEl = target.closest('.rug-cell') || target.closest('[data-flag]');
    if (!flagEl || flagEl.classList.contains('found')) return;
    flagEl.classList.add('found');
    var explanation = flagEl.querySelector('.rug-reveal') || flagEl.querySelector('.flag-explanation');
    if (explanation) explanation.style.display = '';

    // Track how many found
    var container = target.closest('.rug-grid') || target.closest('[data-investigation]');
    if (container) {
      var revealed = $$('.rug-cell.found', container).length;
      var total    = $$('.rug-cell', container).length;
      var counter  = $('.flags-found-counter', container);
      if (counter) counter.textContent = revealed + '/' + total;
      if (revealed === total) {
        Store.addXp(25);
        UI.createToast('All red flags found! +25 XP 🕵️', 'success');
      }
    }
  }

  function investigateGiveawayRedFlag(target) {
    var itemEl = target.closest('.giveaway-sus-item');
    if (!itemEl || itemEl.classList.contains('found')) return;
    itemEl.classList.add('found');
    var explanation = itemEl.querySelector('.sus-explain');
    if (explanation) explanation.style.display = '';

    // Track how many found for this giveaway
    var container = itemEl.closest('.giveaway-investigation') || itemEl.closest('.scam-panel');
    if (container) {
      var revealed = $$('.giveaway-sus-item.found', container).length;
      var total    = $$('.giveaway-sus-item', container).length;
      var counter  = $('.flags-found-counter', container);
      if (counter) counter.textContent = revealed + '/' + total;
      if (revealed === total) {
        Store.addXp(25);
        UI.createToast('All suspicious items found! +25 XP 🕵️', 'success');
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

      // Also observe .scroll-animate elements — add animate-fade-in-up when they enter
      var scrollEls = $$('.scroll-animate');
      scrollEls.forEach(function (el) {
        var scrollObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up', 'animated');
              scrollObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        scrollObs.observe(el);
      });
    } else {
      // Fallback: animate everything immediately
      animEls.forEach(function (el) { el.classList.add('animated'); });
      $$('.scroll-animate').forEach(function (el) { el.classList.add('animate-fade-in-up', 'animated'); });
    }

    // Animate count‑up numbers
    $$('[data-countup]').forEach(function (el) {
      var raw = el.dataset.countup || el.textContent;
      // Strip non-numeric chars except decimal point (handles "14,782" and "$10,000")
      var numStr = raw.replace(/[^0-9.]/g, '');
      var target = parseFloat(numStr);
      if (isNaN(target)) return;
      var decimals = parseInt(el.dataset.decimals, 10);
      if (isNaN(decimals)) {
        // Auto-detect: if original had no decimal in number portion, use 0
        var decimalPart = numStr.split('.')[1];
        decimals = decimalPart ? decimalPart.length : 0;
      }
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      Utils.animateCounter(el, 0, target, 1200, prefix, suffix, decimals);
    });

    // Init UI components
    if (UI.initAccordions) UI.initAccordions();
    if (UI.initTabs) UI.initTabs();

    // Accordion initialization — click .accordion-header to toggle .open
    $$('.accordion-item').forEach(function (item) {
      var header = item.querySelector('.accordion-header');
      if (header && !header.dataset.accordionBound) {
        header.dataset.accordionBound = '1';
        header.addEventListener('click', function () {
          item.classList.toggle('open');
        });
      }
    });

    // Tab initialization for [data-tab-group] containers
    $$('[data-tab-group]').forEach(function (container) {
      var tabBtns = $$('[data-tab]', container);
      tabBtns.forEach(function (btn) {
        if (!btn.dataset.tabBound) {
          btn.dataset.tabBound = '1';
          btn.addEventListener('click', function () {
            var tabId = btn.dataset.tab;
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            $$('[data-tab-content]', container).forEach(function (panel) {
              panel.style.display = panel.dataset.tabContent === tabId ? '' : 'none';
            });
          });
        }
      });
    });

    // Add ripple effect to all buttons via mousedown
    $$('.btn, .btn-primary, .btn-secondary, .btn-outline, .neon-btn-primary, .neon-btn-outline, .neon-trade-btn, .neon-sidebar-btn').forEach(function (btn) {
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = '1';
      btn.addEventListener('mousedown', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    // Also call UI.addRippleEffect if available
    if (UI.addRippleEffect) {
      $$('.btn, .btn-primary, .btn-secondary, .btn-outline').forEach(function (btn) {
        UI.addRippleEffect(btn);
      });
    }
  }

  function initPageEvents() {
    // Global input event delegation
    app().addEventListener('input', handleGlobalInput);

    // Search input handling for news page
    var searchInput = $('input[data-action="search-news"]');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(function () {
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

  function handleGlobalInput(e) {
    var target = e.target;

    // Trading amount/price inputs — update order summary in real-time
    if (target.id === 'order-amount-input' || target.id === 'limit-price-input' ||
        (target.dataset && (target.dataset.field === 'amount' || target.dataset.field === 'limit-price' || target.dataset.field === 'price'))) {
      updateOrderSummary();
    }

    // News search input — filter news cards
    if (target.dataset && target.dataset.action === 'search-news') {
      var query = target.value.toLowerCase().trim();
      $$('.news-card').forEach(function (card) {
        var title = (card.dataset.title || card.textContent).toLowerCase();
        card.style.display = title.includes(query) ? '' : 'none';
      });
    }
  }

  function updateOrderSummary() {
    var amountInput = $('#order-amount-input') || $('input[data-field="amount"]') || $('input[name="amount"]');
    var limitInput = $('#limit-price-input') || $('input[data-field="limit-price"]') || $('input[name="limit-price"]');
    var summaryEl = $('[data-display="order-total"], .order-summary, .order-total');
    if (!summaryEl || !amountInput) return;

    var assetId = Store.get('selectedAsset') || 'btc';
    var amount = parseFloat(amountInput.value) || 0;
    var price = (limitInput && parseFloat(limitInput.value)) || MarketEngine.getPrice(assetId);
    var total = amount * price;

    if (summaryEl) summaryEl.textContent = Utils.formatCurrency(total);
  }

  /* ================================================================== */
  /*  6. Market Engine Integration                                       */
  /* ================================================================== */

  function handleRouteChanged(e) {
    var route = (e.detail && e.detail.route) || getCurrentRouteName();
    var routeStr = typeof route === 'string' ? route : '';

    // Stop all intervals when leaving any page
    stopMarketInterval();
    stopTickerInterval();
    stopPumpInterval();

    // Destroy any existing trading charts
    var chartCanvas = document.querySelector('#trading-chart, .trading-chart canvas');
    if (chartCanvas) Charts.destroy(chartCanvas);

    // Start market engine when entering trading page
    if (routeStr.indexOf('trading') !== -1) {
      startMarketInterval();
      // Initialise chart on first visit or re-render after route change
      setTimeout(function () {
        renderTradingChart();
        updateTradingPanel();
        updatePortfolioValues();
      }, 50);
    }

    // Start ticker when on landing page
    if (routeStr === '' || routeStr === '/' || routeStr === 'landing' || routeStr === '/landing') {
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
    var assetIds = MarketEngine.getAssetIds ? MarketEngine.getAssetIds() : (DataMarket || []).map(function (a) { return a.id; });
    assetIds.forEach(function (id) {
      // Support both data-attribute based and class-based ticker items
      var priceEl  = $('[data-ticker-price="' + id + '"]');
      var changeEl = $('[data-ticker-change="' + id + '"]');

      // If no data-attribute elements found, look for neon-ticker items by symbol
      if (!priceEl) {
        var tickerItems = $$('.neon-ticker-item');
        tickerItems.forEach(function (item) {
          var symEl = item.querySelector('.neon-ticker-symbol');
          if (symEl && symEl.textContent.trim().toUpperCase() === id.toUpperCase()) {
            if (!priceEl) priceEl = item.querySelector('.neon-ticker-price');
            if (!changeEl) changeEl = item.querySelector('.neon-ticker-change');
          }
        });
      }

      if (priceEl) priceEl.textContent = Utils.formatCurrency(MarketEngine.getPrice(id));
      if (changeEl) {
        var change = MarketEngine.get24hChange ? MarketEngine.get24hChange(id) : 0;
        changeEl.textContent = Utils.formatPercent(change);
        changeEl.className = changeEl.className.replace(/neon-ticker-(up|down)/g, '').trim();
        changeEl.classList.add(change >= 0 ? 'neon-ticker-up' : 'neon-ticker-down');
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
    var navbar = document.querySelector('.navbar, .main-navbar, .neon-nav');
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
    var route = Router.getCurrentRoute ? Router.getCurrentRoute() : null;
    if (!route) return '';
    var path = route.path || route.hash || '';
    if (typeof path !== 'string') return '';
    return path.replace(/^#\/?/, '').replace(/\/.*$/, '') || '/';
  }

})();