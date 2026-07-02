/**
 * CryptoVerse Academy — Market Engine
 * ======================================
 * A simulated live market engine using geometric Brownian motion with
 * mean reversion. Generates realistic price movements for 6 crypto assets
 * and cycles through bull/bear/sideways phases.
 *
 * Dependencies: window.Utils (helpers.js)
 *
 * Usage:
 *   MarketEngine.init();              // Initialize engine
 *   MarketEngine.start();             // Begin ticking every ~4s
 *   MarketEngine.tick();              // Manual single tick
 *   MarketEngine.getMarketSummary();  // Snapshot of all assets
 */
(function () {
  'use strict';

  /* ================================================================== */
  /*  ASSET DEFINITIONS                                                 */
  /* ================================================================== */

  /** @type {Object.<string, AssetState>} */
  var assets = {};

  /** Base configuration for each asset */
  var ASSET_CONFIGS = {
    btc:  { name: 'Bitcoin',   symbol: 'BTC',  basePrice: 68420.50, volatility: 0.003,  meanReversionSpeed: 0.002, reactionMultiplier: 0.7,  color: '#F7931A' },
    eth:  { name: 'Ethereum',  symbol: 'ETH',  basePrice: 3680.25,  volatility: 0.005,  meanReversionSpeed: 0.002, reactionMultiplier: 0.85, color: '#627EEA' },
    sol:  { name: 'Solana',    symbol: 'SOL',  basePrice: 172.80,   volatility: 0.008,  meanReversionSpeed: 0.003, reactionMultiplier: 1.2,  color: '#9945FF' },
    xrp:  { name: 'XRP',       symbol: 'XRP',  basePrice: 0.6234,   volatility: 0.006,  meanReversionSpeed: 0.003, reactionMultiplier: 1.0,  color: '#00AAE4' },
    doge: { name: 'Dogecoin',  symbol: 'DOGE', basePrice: 0.1247,   volatility: 0.012,  meanReversionSpeed: 0.005, reactionMultiplier: 1.6,  color: '#C2A633' },
    ada:  { name: 'Cardano',   symbol: 'ADA',  basePrice: 0.4512,   volatility: 0.007,  meanReversionSpeed: 0.003, reactionMultiplier: 1.1,  color: '#0033AD' }
  };

  /* ================================================================== */
  /*  MARKET PHASES                                                     */
  /* ================================================================== */

  var PHASES = [
    { name: 'Bull Market',     trendBias: 0.0003,  volatilityMultiplier: 0.8,  duration: [120, 300] },
    { name: 'Sideways',        trendBias: 0.0,     volatilityMultiplier: 0.5,  duration: [80, 200] },
    { name: 'Bear Market',     trendBias: -0.0002, volatilityMultiplier: 1.2,  duration: [100, 250] },
    { name: 'Recovery',        trendBias: 0.0001,  volatilityMultiplier: 0.7,  duration: [60, 150] },
    { name: 'High Volatility', trendBias: 0.0,     volatilityMultiplier: 2.0,  duration: [30, 80] }
  ];

  /* ================================================================== */
  /*  INTERNAL STATE                                                    */
  /* ================================================================== */

  var state = {
    initialized: false,
    tickInterval: null,
    tickCount: 0,
    currentPhase: null,
    phaseTickCount: 0,
    phaseDuration: 0,
    eventCooldown: 0,
    /** @type {Array<{time: Date, type: string, description: string}>} */
    events: []
  };

  /* ================================================================== */
  /*  BOX-MULLER GAUSSIAN RANDOM                                        */
  /* ================================================================== */

  var _spare = null;

  function gaussianRandom() {
    if (_spare !== null) {
      var s = _spare;
      _spare = null;
      return s;
    }
    var u1 = Math.random();
    var u2 = Math.random();
    var mag = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10)));
    _spare = mag * Math.cos(2 * Math.PI * u2);
    return mag * Math.sin(2 * Math.PI * u2);
  }

  /* ================================================================== */
  /*  PHASE MANAGEMENT                                                  */
  /* ================================================================== */

  /**
   * Pick a new market phase, avoiding the same one consecutively.
   */
  function rollNewPhase() {
    var available = PHASES.filter(function (p) {
      return !state.currentPhase || p.name !== state.currentPhase.name;
    });
    var pick = available[Math.floor(Math.random() * available.length)];
    state.currentPhase = {
      name: pick.name,
      trendBias: pick.trendBias,
      volatilityMultiplier: pick.volatilityMultiplier
    };
    // Random duration between min and max ticks
    state.phaseTickCount = 0;
    state.phaseDuration = pick.duration[0] + Math.floor(Math.random() * (pick.duration[1] - pick.duration[0]));

    state.events.unshift({
      time: new Date(),
      type: 'phase',
      description: 'Market entered "' + pick.name + '" phase'
    });
    // Keep last 50 events
    if (state.events.length > 50) state.events.length = 50;
  }

  /* ================================================================== */
  /*  PRICE TICK                                                        */
  /* ================================================================== */

  /**
   * Advance a single asset's price by one tick using geometric Brownian
   * motion with mean reversion and market-phase adjustments.
   *
   *   dS/S = (μ - θ(S - S₀)/S₀)·dt + σ·√dt·Z
   *
   * where:
   *   μ  = phase trend bias
   *   θ  = mean reversion speed
   *   S₀ = equilibrium price (slowly adapts)
   *   σ  = asset volatility × phase multiplier
   *   Z  ~ N(0,1)
   *   dt = 1 (per tick)
   */
  function tickAsset(asset) {
    var config = ASSET_CONFIGS[asset.id];
    var phase = state.currentPhase;

    var dt = 1;
    var sigma = config.volatility * phase.volatilityMultiplier;
    var mu = phase.trendBias;
    var theta = config.meanReversionSpeed;

    // Mean-reversion target slowly tracks the current price with lag
    var priceDiff = asset.equilibriumPrice - asset.price;
    var meanReversionForce = theta * (priceDiff / asset.price);

    // Geometric Brownian motion component
    var randomShock = gaussianRandom() * sigma * Math.sqrt(dt);

    // Combined return
    var totalReturn = (mu + meanReversionForce) * dt + randomShock;

    // Apply news impact decay
    if (asset.newsImpact !== 0) {
      totalReturn += asset.newsImpact;
      asset.newsImpact *= 0.7; // Decay impact by 30% each tick
      if (Math.abs(asset.newsImpact) < 0.00005) asset.newsImpact = 0;
    }

    // Clamp extreme moves to ±5% per tick (realistic circuit-breaker-like)
    totalReturn = Math.max(-0.05, Math.min(0.05, totalReturn));

    // Calculate new price
    var newPrice = asset.price * (1 + totalReturn);
    newPrice = Math.max(newPrice, asset.price * 0.5); // Floor at 50% (catastrophic protection)

    // Update open/high/low for current candle
    if (!asset._candleOpen) {
      asset._candleOpen = asset.price;
      asset._candleHigh = asset.price;
      asset._candleLow = asset.price;
      asset._candleVolume = 0;
    }

    asset._candleHigh = Math.max(asset._candleHigh, newPrice);
    asset._candleLow = Math.min(asset._candleLow, newPrice);

    // Volume: higher on bigger moves
    var moveSize = Math.abs(totalReturn);
    asset._candleVolume += asset.baseVolume * (1 + moveSize * 50 + Math.random() * 0.5);

    // Record price for 24h change tracking
    asset.priceHistory.push(newPrice);
    if (asset.priceHistory.length > 2880) { // 24h at 4s ticks = 21600, keep less for perf
      // Keep only enough for 24h change calculation (288 = 24h at 5-min intervals conceptually)
      // We'll keep the last 1440 entries for rolling 24h calc
      asset.priceHistory.shift();
    }

    // Previous price for flash tracking
    asset.prevPrice = asset.price;
    asset.price = newPrice;

    // Slowly adjust equilibrium price towards base (long-term anchor)
    asset.equilibriumPrice += (config.basePrice - asset.equilibriumPrice) * 0.001;

    return newPrice;
  }

  /* ================================================================== */
  /*  CANDLE MANAGEMENT                                                 */
  /* ================================================================== */

  var CANDLE_INTERVALS = {
    '1m':  15,    // every 15 ticks  (~1 min at 4s)
    '5m':  75,    // every 75 ticks  (~5 min)
    '15m': 225,   // every 225 ticks (~15 min)
    '1h':  900,   // every 900 ticks (~1 hour)
    '1d':  21600  // every 21600 ticks (~24 hours)
  };

  /**
   * Finalize the current candle for all assets if the interval has elapsed.
   * @param {number} intervalTicks — How many ticks per candle
   */
  function finalizeCandles(intervalTicks) {
    Object.keys(assets).forEach(function (id) {
      var asset = assets[id];

      if (!asset._candleOpen) return; // No open candle

      // Record completed candle
      var candle = {
        time: new Date(),
        open: asset._candleOpen,
        high: asset._candleHigh,
        low: asset._candleLow,
        close: asset.price,
        volume: Math.round(asset._candleVolume)
      };

      // Store in appropriate timeframe bucket
      if (!asset.candles) asset.candles = {};
      if (!asset.candles._1m) asset.candles._1m = [];
      asset.candles._1m.push(candle);

      // Keep max 500 candles per timeframe for memory
      if (asset.candles._1m.length > 500) asset.candles._1m.shift();

      // Reset candle state
      asset._candleOpen = null;
      asset._candleHigh = 0;
      asset._candleLow = Infinity;
      asset._candleVolume = 0;
    });
  }

  /**
   * Aggregate 1m candles into larger timeframes.
   * @param {Array} candles1m — Array of 1-minute candles
   * @param {string} targetTimeframe — '5m', '15m', '1h', '1d'
   * @returns {Array}
   */
  function aggregateCandles(candles1m, targetTimeframe) {
    var groupSizes = { '5m': 5, '15m': 15, '1h': 60, '1d': 1440 };
    var groupSize = groupSizes[targetTimeframe];
    if (!groupSize || !candles1m.length) return [];

    var aggregated = [];
    for (var i = 0; i < candles1m.length; i += groupSize) {
      var group = candles1m.slice(i, i + groupSize);
      if (!group.length) continue;
      aggregated.push({
        time: group[0].time,
        open: group[0].open,
        high: Math.max.apply(null, group.map(function (c) { return c.high; })),
        low: Math.min.apply(null, group.map(function (c) { return c.low; })),
        close: group[group.length - 1].close,
        volume: group.reduce(function (s, c) { return s + c.volume; }, 0)
      });
    }
    return aggregated;
  }

  /* ================================================================== */
  /*  MARKET EVENTS (SUDDEN SPIKES)                                     */
  /* ================================================================== */

  /**
   * Randomly trigger market events (volatility spikes, flash crashes, pumps).
   */
  function maybeTriggerEvent() {
    if (state.eventCooldown > 0) {
      state.eventCooldown--;
      return;
    }

    // ~2% chance per tick of a market event
    if (Math.random() > 0.02) return;

    var eventTypes = [
      { type: 'pump',         impact: 0.015,  description: 'Sudden buying pressure detected', assets: 'all' },
      { type: 'dump',         impact: -0.012, description: 'Large sell-off triggers cascade',   assets: 'all' },
      { type: 'flash_crash',  impact: -0.025, description: 'Flash crash — rapid liquidations',  assets: 'all' },
      { type: 'short_squeeze', impact: 0.02,  description: 'Short squeeze triggers rapid buying', assets: ['btc', 'eth', 'sol'] },
      { type: 'whale_move',   impact: 0.008,  description: 'Large whale transaction detected',   assets: 'random_one' },
      { type: 'stablecoin_fud', impact: -0.01, description: 'Stablecoin de-peg FUD spreads',     assets: ['doge', 'xrp', 'ada'] },
      { type: 'etf_rumor',    impact: 0.012,  description: 'ETF approval rumor circulates',      assets: ['btc', 'eth'] },
      { type: 'defi_hack',    impact: -0.015, description: 'DeFi protocol exploit reported',     assets: ['eth', 'sol', 'ada'] },
      { type: 'regulation',   impact: -0.008, description: 'New regulatory announcement',        assets: 'all' },
      { type: 'partnership',  impact: 0.01,   description: 'Major enterprise partnership announced', assets: ['eth', 'sol', 'ada', 'xrp'] }
    ];

    var event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    var affectedIds;

    if (event.assets === 'all') {
      affectedIds = Object.keys(assets);
    } else if (event.assets === 'random_one') {
      var allIds = Object.keys(assets);
      affectedIds = [allIds[Math.floor(Math.random() * allIds.length)]];
    } else {
      affectedIds = event.assets;
    }

    affectedIds.forEach(function (id) {
      if (assets[id]) {
        var config = ASSET_CONFIGS[id];
        // Each asset reacts differently based on reactionMultiplier
        assets[id].newsImpact += event.impact * config.reactionMultiplier;
      }
    });

    state.events.unshift({
      time: new Date(),
      type: event.type,
      description: event.description,
      affectedAssets: affectedIds
    });
    if (state.events.length > 50) state.events.length = 50;

    // Cooldown: don't trigger another event for 20-60 ticks
    state.eventCooldown = 20 + Math.floor(Math.random() * 40);

    // Dispatch custom event for UI to react to
    document.dispatchEvent(new CustomEvent('market: event', {
      detail: { event: state.events[0] }
    }));
  }

  /* ================================================================== */
  /*  PUBLIC API — MarketEngine                                         */
  /* ================================================================== */

  var MarketEngine = {};

  /**
   * Initialize the market engine with base prices and empty state.
   * Can optionally pass a saved state to restore.
   *
   * @param {Object} [savedState] — Previously serialized state from getState()
   */
  MarketEngine.init = function (savedState) {
    // Initialize each asset
    Object.keys(ASSET_CONFIGS).forEach(function (id) {
      var config = ASSET_CONFIGS[id];

      if (savedState && savedState.assets && savedState.assets[id]) {
        // Restore from saved state
        assets[id] = savedState.assets[id];
        // Re-init candle accumulators
        assets[id]._candleOpen = null;
        assets[id]._candleHigh = 0;
        assets[id]._candleLow = Infinity;
        assets[id]._candleVolume = 0;
      } else {
        // Fresh start — optionally seed from DataMarket historical data
        var startPrice = config.basePrice;
        if (window.DataMarket) {
          var dmAsset = window.DataMarket.getAsset(id);
          if (dmAsset && dmAsset.currentPrice) {
            startPrice = dmAsset.currentPrice;
          }
        }

        // Slightly randomize start price (±1%) so it's not exact
        startPrice *= (1 + (Math.random() - 0.5) * 0.02);

        // Base daily volume scaled by asset price tier
        var baseDailyVol;
        if (startPrice > 10000) baseDailyVol = 30e9 + Math.random() * 10e9;       // BTC-scale
        else if (startPrice > 100) baseDailyVol = 3e9 + Math.random() * 2e9;       // ETH/SOL-scale
        else baseDailyVol = 500e6 + Math.random() * 2e9;                            // Altcoin-scale

        // Per-tick volume (assuming ~5s ticks, ~17280 ticks/day)
        var perTickVol = baseDailyVol / 17280;

        // Seed price history with slight variation for 24h change calculation
        var priceHistory = [];
        var p = startPrice;
        for (var i = 0; i < 1440; i++) {
          p *= (1 + gaussianRandom() * config.volatility * 0.3);
          priceHistory.push(p);
        }

        assets[id] = {
          id: id,
          name: config.name,
          symbol: config.symbol,
          price: startPrice,
          prevPrice: startPrice,
          equilibriumPrice: startPrice * 1.02, // Slightly above current for mild bullish start
          volatility: config.volatility,
          baseVolume: perTickVol,
          color: config.color,
          priceHistory: priceHistory,
          candles: { _1m: [] },
          newsImpact: 0,
          // Candle accumulators
          _candleOpen: null,
          _candleHigh: 0,
          _candleLow: Infinity,
          _candleVolume: 0
        };
      }
    });

    // Initialize phase
    if (savedState && savedState.currentPhase) {
      state.currentPhase = savedState.currentPhase;
      state.phaseTickCount = savedState.phaseTickCount || 0;
      state.phaseDuration = savedState.phaseDuration || 200;
    } else {
      rollNewPhase();
    }

    state.tickCount = 0;
    state.eventCooldown = 10; // Grace period before first random event
    state.initialized = true;

    // Dispatch init event
    document.dispatchEvent(new CustomEvent('market:init'));
  };

  /**
   * Advance the market by one tick (called every 3-5 seconds).
   * Returns the updated prices for all assets.
   *
   * @returns {Object.<string, { price: number, prevPrice: number, change: number, symbol: string }>}
   */
  MarketEngine.tick = function () {
    if (!state.initialized) {
      console.warn('MarketEngine: Call init() before tick()');
      return {};
    }

    state.tickCount++;

    // Check phase transition
    state.phaseTickCount++;
    if (state.phaseTickCount >= state.phaseDuration) {
      rollNewPhase();
    }

    var result = {};

    // Tick each asset
    Object.keys(assets).forEach(function (id) {
      tickAsset(assets[id]);
      result[id] = {
        price: assets[id].price,
        prevPrice: assets[id].prevPrice,
        change: (assets[id].price - assets[id].prevPrice) / assets[id].prevPrice,
        symbol: assets[id].symbol
      };
    });

    // Finalize 1m candles every 15 ticks (~1 minute at 4s intervals)
    if (state.tickCount % 15 === 0) {
      finalizeCandles(15);
    }

    // Maybe trigger a random market event
    maybeTriggerEvent();

    // Dispatch tick event
    document.dispatchEvent(new CustomEvent('market:tick', {
      detail: { tickCount: state.tickCount, prices: result }
    }));

    return result;
  };

  /**
   * Apply a news event's impact to specific assets.
   *
   * @param {Object} newsEvent — News event object with:
   *   - {string[]} affectedAssets — Array of asset IDs (e.g. ['btc', 'eth'])
   *   - {string} sentiment — 'positive' or 'negative'
   *   - {number} impact — Impact score 1-10
   */
  MarketEngine.applyNewsImpact = function (newsEvent) {
    if (!state.initialized || !newsEvent) return;

    var sentiment = (newsEvent.sentiment || 'neutral').toLowerCase();
    var impactScore = newsEvent.impact || 5; // 1-10 scale
    var affected = newsEvent.affectedAssets || [];

    // Convert impact score to price movement basis (scaled down)
    // Positive news → price bump, Negative → price drop
    var baseImpact;
    if (sentiment === 'positive') {
      baseImpact = (impactScore / 10) * 0.008; // Up to 0.8% base
    } else if (sentiment === 'negative') {
      baseImpact = -(impactScore / 10) * 0.006; // Up to -0.6% base
    } else {
      return; // Neutral — no impact
    }

    // Apply to each affected asset with its own reaction multiplier
    affected.forEach(function (assetId) {
      var asset = assets[assetId];
      if (!asset) return;
      var config = ASSET_CONFIGS[assetId];
      // BTC and large caps react less, altcoins react more
      asset.newsImpact += baseImpact * config.reactionMultiplier;
    });

    state.events.unshift({
      time: new Date(),
      type: 'news',
      description: (sentiment === 'positive' ? '📈 ' : '📉 ') + (newsEvent.title || 'News impact'),
      sentiment: sentiment,
      impact: impactScore,
      affectedAssets: affected
    });
    if (state.events.length > 50) state.events.length = 50;
  };

  /**
   * Get current price for an asset.
   * @param {string} assetId — e.g. 'btc'
   * @returns {number} Current price or 0
   */
  MarketEngine.getPrice = function (assetId) {
    var asset = assets[assetId];
    return asset ? asset.price : 0;
  };

  /**
   * Get 24-hour percentage change for an asset.
   * Compares current price to price ~1440 ticks ago.
   * @param {string} assetId
   * @returns {number} e.g. 3.45
   */
  MarketEngine.get24hChange = function (assetId) {
    var asset = assets[assetId];
    if (!asset || asset.priceHistory.length < 2) return 0;

    // Use the oldest price in history as the "24h ago" price
    var oldPrice = asset.priceHistory[0];
    if (oldPrice === 0) return 0;
    return ((asset.price - oldPrice) / oldPrice) * 100;
  };

  /**
   * Get candle data for charting.
   *
   * @param {string} assetId — e.g. 'btc'
   * @param {string} [timeframe='5m'] — '1m', '5m', '15m', '1h', '1d'
   * @returns {Array<{time: Date, open: number, high: number, low: number, close: number, volume: number}>}
   */
  MarketEngine.getCandles = function (assetId, timeframe) {
    var asset = assets[assetId];
    if (!asset || !asset.candles) return [];

    timeframe = timeframe || '5m';

    if (timeframe === '1m') {
      return asset.candles._1m ? asset.candles._1m.slice() : [];
    }

    // Aggregate from 1m candles
    return aggregateCandles(asset.candles._1m || [], timeframe);
  };

  /**
   * Get a summary of all assets with current prices, changes, and metadata.
   * @returns {Array<Object>}
   */
  MarketEngine.getMarketSummary = function () {
    return Object.keys(assets).map(function (id) {
      var asset = assets[id];
      var change24h = MarketEngine.get24hChange(id);
      var tickChange = asset.prevPrice ? ((asset.price - asset.prevPrice) / asset.prevPrice * 100) : 0;

      return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        price: asset.price,
        change24h: change24h,
        tickChange: tickChange,
        color: asset.color,
        phase: state.currentPhase ? state.currentPhase.name : 'Unknown'
      };
    });
  };

  /**
   * Get full engine state for serialization / save.
   * @returns {Object}
   */
  MarketEngine.getState = function () {
    var assetState = {};
    Object.keys(assets).forEach(function (id) {
      var a = assets[id];
      assetState[id] = {
        id: a.id,
        name: a.name,
        symbol: a.symbol,
        price: a.price,
        prevPrice: a.prevPrice,
        equilibriumPrice: a.equilibriumPrice,
        volatility: a.volatility,
        baseVolume: a.baseVolume,
        color: a.color,
        priceHistory: a.priceHistory.slice(-200), // Keep last 200 for size
        candles: a.candles,
        newsImpact: a.newsImpact
      };
    });

    return {
      assets: assetState,
      tickCount: state.tickCount,
      currentPhase: state.currentPhase,
      phaseTickCount: state.phaseTickCount,
      phaseDuration: state.phaseDuration,
      events: state.events.slice(0, 20)
    };
  };

  /**
   * Get the current market phase info.
   * @returns {{ name: string, trendBias: number, volatilityMultiplier: number, progress: number }}
   */
  MarketEngine.getPhaseInfo = function () {
    if (!state.currentPhase) return { name: 'Initializing', trendBias: 0, volatilityMultiplier: 1, progress: 0 };
    return {
      name: state.currentPhase.name,
      trendBias: state.currentPhase.trendBias,
      volatilityMultiplier: state.currentPhase.volatilityMultiplier,
      progress: Math.min(state.phaseTickCount / state.phaseDuration, 1)
    };
  };

  /**
   * Get recent market events.
   * @param {number} [limit=10] — Number of events to return
   * @returns {Array<Object>}
   */
  MarketEngine.getRecentEvents = function (limit) {
    if (!limit) limit = 10;
    return state.events.slice(0, limit);
  };

  /**
   * Start the automatic tick loop.
   * @param {number} [intervalMs=4000] — Tick interval in milliseconds
   */
  MarketEngine.start = function (intervalMs) {
    if (!intervalMs) intervalMs = 4000;
    MarketEngine.stop();
    state.tickInterval = setInterval(function () {
      MarketEngine.tick();
    }, intervalMs);
    document.dispatchEvent(new CustomEvent('market:started', { detail: { interval: intervalMs } }));
  };

  /**
   * Stop the automatic tick loop.
   */
  MarketEngine.stop = function () {
    if (state.tickInterval) {
      clearInterval(state.tickInterval);
      state.tickInterval = null;
      document.dispatchEvent(new CustomEvent('market:stopped'));
    }
  };

  /**
   * Check if the engine is currently running.
   * @returns {boolean}
   */
  MarketEngine.isRunning = function () {
    return state.tickInterval !== null;
  };

  /**
   * Get asset config (static metadata).
   * @param {string} assetId
   * @returns {Object|null}
   */
  MarketEngine.getAssetConfig = function (assetId) {
    return ASSET_CONFIGS[assetId] || null;
  };

  /**
   * Get all supported asset IDs.
   * @returns {string[]}
   */
  MarketEngine.getAssetIds = function () {
    return Object.keys(ASSET_CONFIGS);
  };

  /**
   * Get the raw internal asset state (for advanced use).
   * @param {string} assetId
   * @returns {Object|null}
   */
  MarketEngine.getAssetState = function (assetId) {
    return assets[assetId] || null;
  };

  /* ================================================================== */
  /*  EXPOSE                                                            */
  /* ================================================================== */

  window.MarketEngine = MarketEngine;

})();