/**
 * CryptoVerse Academy — State Management Store
 * =============================================
 * A singleton state store with localStorage persistence and pub/sub
 * change notification. All state mutations flow through `set()` which
 * auto-persists and notifies subscribers.
 *
 * Usage:
 *   Store.init();                         // load / create default state
 *   Store.get('user.xp');                 // read nested value
 *   Store.set('user.xp', 250);            // write + persist + notify
 *   Store.subscribe('user', callback);    // listen for changes
 *   Store.reset();                        // clear everything
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Constants                                                          */
  /* ------------------------------------------------------------------ */
  const STORAGE_KEY = 'cryptoverse_academy_state';
  const CHANGE_EVENT = 'store:changed';

  /* ------------------------------------------------------------------ */
  /*  Default state factory                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Creates a fresh default state object. Used on first visit and `reset()`.
   */
  function createDefaultState() {
    return {
      /* --- User profile --- */
      user: {
        name: 'CryptoLearner',
        avatarColor: '#6C5CE7', // vibrant purple
        xp: 0,
        get level() {
          // Level is derived: every 100 XP = 1 level, minimum level 1
          return Math.floor(this.xp / 100) + 1;
        },
      },

      /* --- Learning progress --- */
      learning: {
        // Each module is keyed by its id. Value is 0-100 (% complete).
        modules: {
          'blockchain-basics': 0,
          'crypto-fundamentals': 0,
          'wallets-security': 0,
          'trading-basics': 0,
          'defi-exploration': 0,
          'nfts-digital-assets': 0,
        },
        // Quiz attempts keyed by module id → array of score objects
        quizAttempts: {},
        // Tracks which lesson pages the user has visited per module
        completedLessons: {},
        // Overall badge / milestone timestamps
        milestones: [],
      },

      /* --- Portfolio (simulated) --- */
      portfolio: {
        balance: 10_000, // starting USD balance
        holdings: {},    // { 'BTC': { amount: 0.5, avgBuyPrice: 42000 }, ... }
        transactions: [], // chronological ledger of buys/sells
        watchlist: [],    // list of asset ids the user is watching
        totalInvested: 0,
        totalReturn: 0,
      },

      /* --- Achievements --- */
      achievements: {
        unlocked: [],   // list of achievement ids
        // Definition metadata (populated once from config)
        definitions: [
          { id: 'first-login',   title: 'Welcome!',          description: 'Logged in for the first time',       icon: '🚀' },
          { id: 'first-quiz',    title: 'Quiz Rookie',       description: 'Completed your first quiz',          icon: '📝' },
          { id: 'perfect-score', title: 'Perfectionist',     description: 'Scored 100% on any quiz',            icon: '💯' },
          { id: 'first-trade',   title: 'First Trade',       description: 'Made your first simulated trade',    icon: '📈' },
          { id: 'module-complete', title: 'Module Master',   description: 'Completed an entire learning module', icon: '🎓' },
          { id: 'level-5',       title: 'Rising Star',       description: 'Reached level 5',                    icon: '⭐' },
          { id: 'level-10',      title: 'Crypto Veteran',    description: 'Reached level 10',                   icon: '🏆' },
          { id: 'watchlist-5',   title: 'Market Watcher',    description: 'Added 5 assets to your watchlist',   icon: '👁️' },
          { id: 'all-modules',   title: 'Completionist',     description: 'Completed every learning module',    icon: '🌟' },
        ],
      },

      /* --- Market data cache (fetched from API, stored locally) --- */
      marketData: {
        assets: [],           // array of asset objects from API
        lastUpdated: null,    // ISO timestamp of last fetch
        trending: [],         // cached trending list
      },

      /* --- Leaderboard --- */
      leaderboard: {
        entries: [],          // sorted list of { name, xp, level, avatarColor }
        lastUpdated: null,
      },

      /* --- Final challenge state --- */
      challenge: {
        unlocked: false,
        currentStep: 0,
        totalSteps: 5,
        // Step results keyed by step index
        results: {},
        completed: false,
        score: null,
        startedAt: null,
        completedAt: null,
      },

      /* --- App settings --- */
      settings: {
        soundEnabled: true,
        animationsEnabled: true,
        theme: 'dark',        // 'dark' | 'light'
        language: 'en',
      },
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Deep-clone helper (structured clone with fallback)                 */
  /* ------------------------------------------------------------------ */
  function deepClone(obj) {
    try {
      // Modern browsers support structuredClone
      if (typeof structuredClone === 'function') {
        return structuredClone(obj);
      }
    } catch (_) {
      // Fall through to JSON round-trip
    }
    return JSON.parse(JSON.stringify(obj));
  }

  /* ------------------------------------------------------------------ */
  /*  Pub/Sub system                                                     */
  /* ------------------------------------------------------------------ */

  /** @type {Map<string, Set<Function>>} */
  const listeners = new Map();

  /**
   * Subscribe to changes on a specific state namespace (e.g. 'user', 'portfolio').
   * Pass '*' to listen to ALL changes.
   *
   * @param {string}   namespace - Dot-namespace prefix or '*'
   * @param {Function} callback  - Called with { key, newValue, oldValue, namespace }
   * @returns {Function} Unsubscribe function
   */
  function subscribe(namespace, callback) {
    if (!listeners.has(namespace)) {
      listeners.set(namespace, new Set());
    }
    listeners.get(namespace).add(callback);

    // Return an unsubscribe handle
    return function unsubscribe() {
      const set = listeners.get(namespace);
      if (set) {
        set.delete(callback);
        if (set.size === 0) listeners.delete(namespace);
      }
    };
  }

  /**
   * Notify all relevant subscribers about a state change.
   *
   * @param {string} fullKey   - e.g. 'user.xp'
   * @param {*}      newValue
   * @param {*}      oldValue
   */
  function publish(fullKey, newValue, oldValue) {
    const namespace = fullKey.split('.')[0]; // top-level namespace

    const payload = { key: fullKey, newValue, oldValue, namespace };

    // Notify namespace-specific listeners
    if (listeners.has(namespace)) {
      listeners.get(namespace).forEach(function (fn) {
        try { fn(payload); } catch (e) { console.error('[Store] listener error:', e); }
      });
    }

    // Notify wildcard listeners
    if (listeners.has('*')) {
      listeners.get('*').forEach(function (fn) {
        try { fn(payload); } catch (e) { console.error('[Store] listener error:', e); }
      });
    }

    // Also dispatch a DOM event for framework-agnostic integration
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: payload }));
  }

  /* ------------------------------------------------------------------ */
  /*  Persistence                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Serialize the current state to localStorage.
   * The `user.level` getter is NOT serialized — it's derived at read time.
   */
  function persist() {
    try {
      // Convert to plain object so getters aren't serialized
      const serializable = JSON.parse(JSON.stringify(_state));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error('[Store] Failed to persist state:', e);
    }
  }

  /**
   * Load state from localStorage. Returns null if nothing stored.
   * @returns {Object|null}
   */
  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Re-attach the level getter on the user object
      if (parsed.user && typeof parsed.user.xp === 'number') {
        Object.defineProperty(parsed.user, 'level', {
          get() { return Math.floor(this.xp / 100) + 1; },
          enumerable: true,
          configurable: true,
        });
      }
      return parsed;
    } catch (e) {
      console.error('[Store] Failed to load persisted state:', e);
      return null;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Internal state reference                                           */
  /* ------------------------------------------------------------------ */

  /** @type {Object} The live state tree */
  let _state = null;

  /* ------------------------------------------------------------------ */
  /*  Internal helpers                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Resolve a dot-notated key path into the parent object and final key.
   *
   * @param  {string} keyPath - e.g. 'user.xp' or 'portfolio.holdings.BTC'
   * @returns {{ parent: Object, key: string } | null}
   */
  function resolvePath(keyPath) {
    if (!keyPath || typeof keyPath !== 'string') return null;

    const parts = keyPath.split('.');
    if (parts.length === 0) return null;

    let current = _state;

    // Walk all segments except the last
    for (let i = 0; i < parts.length - 1; i++) {
      if (current === null || typeof current !== 'object') return null;
      if (!(parts[i] in current)) return null;
      current = current[parts[i]];
    }

    return { parent: current, key: parts[parts.length - 1] };
  }

  /**
   * Read a value by dot-notated key.
   *
   * @param  {string} keyPath
   * @return {*} The value, or `undefined` if not found.
   */
  function getValue(keyPath) {
    const resolved = resolvePath(keyPath);
    if (!resolved) return undefined;
    return resolved.parent[resolved.key];
  }

  /**
   * Write a value by dot-notated key, auto-persisting and notifying.
   *
   * @param  {string} keyPath
   * @param  {*}      value
   * @return {boolean} true if the set succeeded
   */
  function setValue(keyPath, value) {
    const resolved = resolvePath(keyPath);
    if (!resolved) {
      console.warn('[Store] Cannot set invalid path:', keyPath);
      return false;
    }

    const oldValue = resolved.parent[resolved.key];
    // Avoid redundant writes (shallow compare)
    if (oldValue === value) return true;

    resolved.parent[resolved.key] = value;
    persist();
    publish(keyPath, value, oldValue);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: achievement helpers                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Unlock an achievement by id (idempotent).
   * @param {string} id
   * @returns {boolean} true if newly unlocked
   */
  function unlockAchievement(id) {
    const list = _state.achievements.unlocked;
    if (list.includes(id)) return false;
    list.push(id);
    persist();
    publish('achievements.unlocked', list, [...list].slice(0, -1));
    return true;
  }

  /**
   * Check whether an achievement is unlocked.
   * @param {string} id
   * @returns {boolean}
   */
  function hasAchievement(id) {
    return _state.achievements.unlocked.includes(id);
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: learning helpers                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Update a module's progress percentage (clamped 0–100).
   * @param {string} moduleId
   * @param {number} percent  0-100
   */
  function updateModuleProgress(moduleId, percent) {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    _state.learning.modules[moduleId] = clamped;
    persist();
    publish('learning.modules.' + moduleId, clamped, clamped);

    // Auto-unlock 'module-complete' achievement at 100%
    if (clamped === 100) {
      unlockAchievement('module-complete');

      // Check if ALL modules are complete
      const allDone = Object.values(_state.learning.modules).every(function (v) { return v === 100; });
      if (allDone) unlockAchievement('all-modules');
    }
  }

  /**
   * Record a quiz attempt.
   * @param {string} moduleId
   * @param {number} score    0-100
   * @param {number} [timeMs] time taken in ms
   */
  function recordQuizAttempt(moduleId, score, timeMs) {
    if (!_state.learning.quizAttempts[moduleId]) {
      _state.learning.quizAttempts[moduleId] = [];
    }
    const attempt = {
      score: Math.max(0, Math.min(100, Math.round(score))),
      date: new Date().toISOString(),
      timeMs: timeMs || null,
    };
    _state.learning.quizAttempts[moduleId].push(attempt);

    // Award XP: 10 XP per quiz attempt + bonus for high scores
    const xpGain = 10 + Math.round(attempt.score / 10);
    _state.user.xp += xpGain;

    persist();
    publish('learning.quizAttempts.' + moduleId, attempt, null);
    publish('user.xp', _state.user.xp, _state.user.xp - xpGain);

    // Achievement checks
    unlockAchievement('first-quiz');
    if (attempt.score === 100) unlockAchievement('perfect-score');

    // Level achievements
    if (_state.user.level >= 5)  unlockAchievement('level-5');
    if (_state.user.level >= 10) unlockAchievement('level-10');
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: portfolio helpers                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Execute a simulated buy.
   * @param {string} assetId  e.g. 'BTC'
   * @param {number} amount   quantity to buy
   * @param {number} price    price per unit at time of buy
   * @returns {boolean}
   */
  function buyAsset(assetId, amount, price) {
    const cost = amount * price;
    if (cost > _state.portfolio.balance) {
      console.warn('[Store] Insufficient balance for purchase');
      return false;
    }

    _state.portfolio.balance -= cost;
    _state.portfolio.totalInvested += cost;

    if (!_state.portfolio.holdings[assetId]) {
      _state.portfolio.holdings[assetId] = { amount: 0, avgBuyPrice: 0 };
    }

    const holding = _state.portfolio.holdings[assetId];
    // Recalculate weighted-average buy price
    const prevTotal = holding.amount * holding.avgBuyPrice;
    holding.avgBuyPrice = (prevTotal + cost) / (holding.amount + amount);
    holding.amount += amount;

    // Record transaction
    _state.portfolio.transactions.push({
      type: 'buy',
      assetId: assetId,
      amount: amount,
      price: price,
      total: cost,
      date: new Date().toISOString(),
    });

    persist();
    publish('portfolio', deepClone(_state.portfolio), null);
    unlockAchievement('first-trade');
    return true;
  }

  /**
   * Execute a simulated sell.
   * @param {string} assetId
   * @param {number} amount
   * @param {number} price    price per unit at time of sell
   * @returns {boolean}
   */
  function sellAsset(assetId, amount, price) {
    const holding = _state.portfolio.holdings[assetId];
    if (!holding || holding.amount < amount) {
      console.warn('[Store] Insufficient holdings to sell');
      return false;
    }

    const revenue = amount * price;
    _state.portfolio.balance += revenue;
    _state.portfolio.totalReturn += (revenue - amount * holding.avgBuyPrice);
    holding.amount -= amount;

    // Remove holding if fully sold
    if (holding.amount <= 0) {
      delete _state.portfolio.holdings[assetId];
    }

    _state.portfolio.transactions.push({
      type: 'sell',
      assetId: assetId,
      amount: amount,
      price: price,
      total: revenue,
      date: new Date().toISOString(),
    });

    persist();
    publish('portfolio', deepClone(_state.portfolio), null);
    return true;
  }

  /**
   * Toggle an asset on/off the watchlist.
   * @param {string} assetId
   * @returns {boolean} true if added, false if removed
   */
  function toggleWatchlist(assetId) {
    const idx = _state.portfolio.watchlist.indexOf(assetId);
    let added;
    if (idx === -1) {
      _state.portfolio.watchlist.push(assetId);
      added = true;
    } else {
      _state.portfolio.watchlist.splice(idx, 1);
      added = false;
    }

    if (_state.portfolio.watchlist.length >= 5) {
      unlockAchievement('watchlist-5');
    }

    persist();
    publish('portfolio.watchlist', [..._state.portfolio.watchlist], null);
    return added;
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: market data helpers                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Cache market data from an API response.
   * @param {Array}  assets  Array of asset objects
   * @param {Array}  [trending] Optional trending list
   */
  function cacheMarketData(assets, trending) {
    _state.marketData.assets = assets;
    _state.marketData.lastUpdated = new Date().toISOString();
    if (Array.isArray(trending)) {
      _state.marketData.trending = trending;
    }
    persist();
    publish('marketData', deepClone(_state.marketData), null);
  }

  /**
   * Returns true if cached market data is stale (> 5 minutes old).
   * @returns {boolean}
   */
  function isMarketDataStale() {
    if (!_state.marketData.lastUpdated) return true;
    const age = Date.now() - new Date(_state.marketData.lastUpdated).getTime();
    return age > 5 * 60 * 1000; // 5 minutes
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: leaderboard helper                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Set leaderboard entries.
   * @param {Array} entries
   */
  function setLeaderboard(entries) {
    _state.leaderboard.entries = entries;
    _state.leaderboard.lastUpdated = new Date().toISOString();
    persist();
    publish('leaderboard', deepClone(_state.leaderboard), null);
  }

  /* ------------------------------------------------------------------ */
  /*  Convenience: challenge helpers                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Unlock the final challenge.
   */
  function unlockChallenge() {
    _state.challenge.unlocked = true;
    _state.challenge.startedAt = new Date().toISOString();
    _state.challenge.currentStep = 0;
    _state.challenge.results = {};
    _state.challenge.completed = false;
    _state.challenge.score = null;
    _state.challenge.completedAt = null;
    persist();
    publish('challenge', deepClone(_state.challenge), null);
  }

  /**
   * Record a challenge step result.
   * @param {number} step   Step index (0-based)
   * @param {*}      result Step-specific result data
   */
  function setChallengeStepResult(step, result) {
    _state.challenge.results[step] = result;
    _state.challenge.currentStep = step + 1;
    persist();
    publish('challenge.results', result, null);
  }

  /**
   * Complete the challenge with a final score.
   * @param {number} score  0-100
   */
  function completeChallenge(score) {
    _state.challenge.completed = true;
    _state.challenge.score = Math.max(0, Math.min(100, Math.round(score)));
    _state.challenge.completedAt = new Date().toISOString();
    _state.challenge.currentStep = _state.challenge.totalSteps;

    // Award bonus XP for completing the challenge
    const bonusXP = 50 + Math.round(score / 2);
    _state.user.xp += bonusXP;

    persist();
    publish('challenge', deepClone(_state.challenge), null);
    publish('user.xp', _state.user.xp, _state.user.xp - bonusXP);

    if (_state.user.level >= 5)  unlockAchievement('level-5');
    if (_state.user.level >= 10) unlockAchievement('level-10');
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  const Store = {
    /* ---- Lifecycle ---- */

    /**
     * Initialize the store. Loads persisted state or creates defaults.
     * Must be called once before using any other method.
     */
    init: function init() {
      const persisted = loadPersistedState();
      if (persisted) {
        _state = persisted;
        console.log('[Store] Loaded persisted state');
      } else {
        _state = createDefaultState();
        persist();
        console.log('[Store] Initialized with default state');
      }

      // Fire first-login achievement on first init
      if (!persisted) {
        unlockAchievement('first-login');
      }
    },

    /**
     * Reset all state to defaults and clear localStorage.
     */
    reset: function reset() {
      _state = createDefaultState();
      localStorage.removeItem(STORAGE_KEY);
      persist();
      // Notify everything
      publish('*.*', deepClone(_state), null);
      console.log('[Store] State reset to defaults');
    },

    /* ---- Core get / set ---- */

    /**
     * Read a value using a dot-notation key.
     * Omit the key (or pass undefined) to receive the full state tree.
     *
     * @param  {string} [keyPath] e.g. 'user.xp', 'portfolio.balance'
     * @return {*}
     */
    get: function get(keyPath) {
      if (keyPath === undefined || keyPath === null) {
        return deepClone(_state);
      }
      return deepClone(getValue(keyPath));
    },

    /**
     * Write a value using a dot-notation key. Auto-persists & notifies.
     *
     * @param  {string} keyPath e.g. 'user.xp'
     * @param  {*}      value
     * @return {boolean}
     */
    set: function set(keyPath, value) {
      return setValue(keyPath, value);
    },

    /* ---- Pub/Sub ---- */

    /**
     * Subscribe to state changes.
     *
     * @param  {string}   namespace - Top-level key ('user', 'portfolio', …) or '*'
     * @param  {Function} callback  - Receives { key, newValue, oldValue, namespace }
     * @return {Function} Unsubscribe function
     */
    subscribe: subscribe,

    /**
     * The name of the DOM CustomEvent fired on every state change.
     * Detail shape: { key, newValue, oldValue, namespace }
     */
    CHANGE_EVENT: CHANGE_EVENT,

    /* ---- User ---- */

    getUser:     function ()        { return this.get('user'); },
    getXp:       function ()        { return this.get('user.xp'); },
    getLevel:    function ()        { return _state.user.level; }, // uses getter
    addXp:       function (amount)  { return this.set('user.xp', _state.user.xp + amount); },
    setUserName: function (name)    { return this.set('user.name', name); },
    setAvatarColor: function (hex)  { return this.set('user.avatarColor', hex); },

    /* ---- Learning ---- */

    getLearning:           function ()             { return this.get('learning'); },
    getModuleProgress:     function (moduleId)     { return this.get('learning.modules.' + moduleId) ?? 0; },
    updateModuleProgress:  updateModuleProgress,
    getQuizAttempts:       function (moduleId)     { return this.get('learning.quizAttempts.' + moduleId) || []; },
    recordQuizAttempt:     recordQuizAttempt,

    /* ---- Portfolio ---- */

    getPortfolio:    function ()           { return this.get('portfolio'); },
    getBalance:      function ()           { return this.get('portfolio.balance'); },
    getHoldings:     function ()           { return this.get('portfolio.holdings'); },
    getTransactions: function ()           { return this.get('portfolio.transactions'); },
    getWatchlist:    function ()           { return this.get('portfolio.watchlist'); },
    buyAsset:        buyAsset,
    sellAsset:       sellAsset,
    toggleWatchlist: toggleWatchlist,

    /* ---- Achievements ---- */

    getAchievements:    function ()    { return this.get('achievements'); },
    getUnlockedAchievements: function () { return this.get('achievements.unlocked') || []; },
    unlockAchievement:  unlockAchievement,
    hasAchievement:     hasAchievement,

    /* ---- Market Data ---- */

    getMarketData:     function ()     { return this.get('marketData'); },
    cacheMarketData:   cacheMarketData,
    isMarketDataStale: isMarketDataStale,

    /* ---- Leaderboard ---- */

    getLeaderboard: function ()    { return this.get('leaderboard'); },
    setLeaderboard:  setLeaderboard,

    /* ---- Challenge ---- */

    getChallenge:          function ()     { return this.get('challenge'); },
    unlockChallenge:       unlockChallenge,
    setChallengeStepResult: setChallengeStepResult,
    completeChallenge:     completeChallenge,

    /* ---- Settings ---- */

    getSettings:              function ()           { return this.get('settings'); },
    setSetting:               function (key, val)    { return this.set('settings.' + key, val); },
    toggleSound:              function ()            { return this.set('settings.soundEnabled', !_state.settings.soundEnabled); },
    toggleAnimations:         function ()            { return this.set('settings.animationsEnabled', !_state.settings.animationsEnabled); },
  };

  /* ------------------------------------------------------------------ */
  /*  Export to global scope                                             */
  /* ------------------------------------------------------------------ */
  window.Store = Store;
})();