/**
 * CryptoVerse Academy — Utility Helpers
 * ======================================
 * A comprehensive collection of utility functions used across the platform.
 * All utilities are exposed via `window.Utils` for global access.
 *
 * Dependencies: None (pure vanilla JS)
 */
(function () {
  'use strict';

  const Utils = {};

  /* ================================================================== */
  /*  FORMATTING                                                         */
  /* ================================================================== */

  /**
   * Format a number as USD currency.
   * @param {number} n — The number to format
   * @param {number} [decimals=2] — Decimal places
   * @returns {string} e.g. "$68,420.50"
   */
  Utils.formatCurrency = function (n, decimals) {
    if (decimals === undefined) decimals = 2;
    if (n == null || isNaN(n)) return '$0.00';
    var negative = n < 0;
    var abs = Math.abs(n);
    // For very large numbers use compact notation
    if (abs >= 1e12) return (negative ? '-' : '') + '$' + (abs / 1e12).toFixed(1) + 'T';
    if (abs >= 1e9) return (negative ? '-' : '') + '$' + (abs / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (negative ? '-' : '') + '$' + (abs / 1e6).toFixed(2) + 'M';
    var parts = abs.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (negative ? '-$' : '$') + parts.join('.');
  };

  /**
   * Format a number with commas and specified decimal places.
   * @param {number} n — The number to format
   * @param {number} [decimals=2] — Decimal places
   * @returns {string} e.g. "68,420.50"
   */
  Utils.formatNumber = function (n, decimals) {
    if (decimals === undefined) decimals = 2;
    if (n == null || isNaN(n)) return '0';
    var negative = n < 0;
    var abs = Math.abs(n);
    var parts = abs.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (negative ? '-' : '') + parts.join('.');
  };

  /**
   * Format a number as a percentage string.
   * @param {number} n — The number (e.g. 5.4 or 0.054)
   * @param {boolean} [signed=true] — Prepend + for positive values
   * @returns {string} e.g. "+5.40%"
   */
  Utils.formatPercent = function (n, signed) {
    if (signed === undefined) signed = true;
    if (n == null || isNaN(n)) n = 0;
    var str = n.toFixed(2) + '%';
    if (signed && n > 0) str = '+' + str;
    return str;
  };

  /**
   * Format a Date object or timestamp into a human-readable string.
   * @param {Date|number|string} date — The date to format
   * @param {string} [format='short'] — 'short', 'medium', 'long', 'time', 'full', 'iso'
   * @returns {string}
   */
  Utils.formatDate = function (date, format) {
    if (!format) format = 'short';
    var d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

    switch (format) {
      case 'short':
        return months[d.getMonth()] + ' ' + d.getDate();
      case 'medium':
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      case 'long':
        return monthsFull[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      case 'time':
        return pad(d.getHours()) + ':' + pad(d.getMinutes());
      case 'datetime':
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      case 'full':
        return monthsFull[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      case 'iso':
        return d.toISOString();
      case 'relative':
        return Utils.timeAgo(d);
      default:
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
  };

  /* ================================================================== */
  /*  RANDOM                                                             */
  /* ================================================================== */

  /**
   * Return a random float between min (inclusive) and max (exclusive).
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  Utils.randomBetween = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  /**
   * Return a random integer between min (inclusive) and max (inclusive).
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  Utils.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /* ================================================================== */
  /*  FUNCTION UTILITIES                                                 */
  /* ================================================================== */

  /**
   * Debounce — delay execution until after `delay` ms of inactivity.
   * @param {Function} fn
   * @param {number} delay — Milliseconds
   * @returns {Function}
   */
  Utils.debounce = function (fn, delay) {
    var timer = null;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  };

  /**
   * Throttle — execute at most once every `limit` ms.
   * @param {Function} fn
   * @param {number} limit — Milliseconds
   * @returns {Function}
   */
  Utils.throttle = function (fn, limit) {
    var inThrottle = false, lastArgs, lastCtx;
    return function () {
      var ctx = this, args = arguments;
      if (!inThrottle) {
        fn.apply(ctx, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
          if (lastArgs) {
            fn.apply(lastCtx, lastArgs);
            lastArgs = null;
            lastCtx = null;
          }
        }, limit);
      } else {
        lastArgs = args;
        lastCtx = ctx;
      }
    };
  };

  /* ================================================================== */
  /*  MATH                                                               */
  /* ================================================================== */

  /**
   * Clamp a value between min and max.
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  Utils.clamp = function (val, min, max) {
    return Math.max(min, Math.min(max, val));
  };

  /**
   * Linear interpolation between a and b by factor t (0-1).
   * @param {number} a — Start value
   * @param {number} b — End value
   * @param {number} t — Interpolation factor
   * @returns {number}
   */
  Utils.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  /* ================================================================== */
  /*  ANIMATION                                                          */
  /* ================================================================== */

  /**
   * Animate a number counting up/down inside a DOM element.
   * Uses requestAnimationFrame for smooth 60fps animation with easing.
   *
   * @param {HTMLElement} el — Target element (text content will be updated)
   * @param {number} start — Starting value
   * @param {number} end — Ending value
   * @param {number} duration — Animation duration in ms
   * @param {string} [prefix=''] — Text before the number (e.g. "$")
   * @param {string} [suffix=''] — Text after the number (e.g. "%")
   * @param {number} [decimals=2] — Number of decimal places
   */
  Utils.animateCounter = function (el, start, end, duration, prefix, suffix, decimals) {
    if (!el) return;
    prefix = prefix || '';
    suffix = suffix || '';
    decimals = (decimals !== undefined) ? decimals : 2;
    duration = duration || 1000;

    var startTime = null;
    var diff = end - start;

    // Ease-out cubic for a satisfying deceleration feel
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = start + diff * easedProgress;

      // Format with commas
      var formatted = Math.abs(current).toFixed(decimals);
      var parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      el.textContent = (current < 0 ? '-' : '') + prefix + parts.join('.') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  };

  /* ================================================================== */
  /*  DOM / CLIPBOARD                                                    */
  /* ================================================================== */

  /**
   * Copy text to the clipboard.
   * Falls back to execCommand for older browsers.
   * @param {string} text — Text to copy
   * @returns {Promise<boolean>} Resolves true on success
   */
  Utils.copyToClipboard = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return Utils._fallbackCopy(text);
      });
    }
    return Utils._fallbackCopy(text);
  };

  /** @private Fallback clipboard copy using textarea */
  Utils._fallbackCopy = function (text) {
    return new Promise(function (resolve) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        resolve(true);
      } catch (e) {
        resolve(false);
      }
      document.body.removeChild(ta);
    });
  };

  /**
   * Generate a unique ID string.
   * Uses crypto.randomUUID when available, otherwise falls back to timestamp + random.
   * @returns {string} e.g. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  Utils.generateId = function () {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  /**
   * Create a human-readable relative time string.
   * @param {Date|number|string} date
   * @returns {string} e.g. "5 minutes ago", "3 hours ago", "2 days ago"
   */
  Utils.timeAgo = function (date) {
    var d = date instanceof Date ? date : new Date(date);
    var now = new Date();
    var seconds = Math.floor((now - d) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return seconds + ' seconds ago';
    var minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return minutes + ' minutes ago';
    var hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return hours + ' hours ago';
    var days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    if (days < 7) return days + ' days ago';
    var weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return weeks + ' weeks ago';
    var months = Math.floor(days / 30);
    if (months === 1) return '1 month ago';
    if (months < 12) return months + ' months ago';
    var years = Math.floor(days / 365);
    if (years === 1) return '1 year ago';
    return years + ' years ago';
  };

  /**
   * Fisher-Yates shuffle — randomly permute an array in place.
   * @param {Array} arr — Array to shuffle
   * @returns {Array} The same array, shuffled
   */
  Utils.shuffleArray = function (arr) {
    var a = arr.slice(); // Don't mutate the original
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };

  /**
   * Deep clone an object/array using structured clone or JSON fallback.
   * @param {*} obj — Value to clone
   * @returns {*} Deep copy
   */
  Utils.deepClone = function (obj) {
    // Use structured clone if available (handles Dates, Maps, Sets, etc.)
    if (typeof structuredClone === 'function') {
      try { return structuredClone(obj); } catch (e) { /* fallback */ }
    }
    // JSON fallback — loses functions, undefined, Dates become strings
    return JSON.parse(JSON.stringify(obj));
  };

  /**
   * Helper to create a DOM element with attributes and children.
   *
   * @param {string} tag — HTML tag name
   * @param {Object} [attrs] — Map of attribute names to values
   * @param {Array<string|HTMLElement>} [children] — Child elements or text
   * @returns {HTMLElement}
   *
   * @example
   *   Utils.createElement('div', { class: 'card', id: 'my-card' }, [
   *     Utils.createElement('h3', {}, ['Hello']),
   *     'Some text'
   *   ]);
   */
  Utils.createElement = function (tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        // Handle 'class' as className
        if (key === 'class') {
          el.className = attrs[key];
        } else if (key === 'style' && typeof attrs[key] === 'object') {
          Object.assign(el.style, attrs[key]);
        } else if (key.startsWith('on') && typeof attrs[key] === 'function') {
          // Event listeners: onClick → click, onChange → change, etc.
          var eventName = key.slice(2).toLowerCase();
          el.addEventListener(eventName, attrs[key]);
        } else if (key === 'dataset' && typeof attrs[key] === 'object') {
          Object.keys(attrs[key]).forEach(function (dk) {
            el.dataset[dk] = attrs[key][dk];
          });
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (child) {
        if (typeof child === 'string' || typeof child === 'number') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement || child instanceof Node) {
          el.appendChild(child);
        } else if (child != null) {
          el.appendChild(document.createTextNode(String(child)));
        }
      });
    }
    return el;
  };

  /**
   * Smooth-scroll an element into view.
   * @param {HTMLElement} el — Element to scroll to
   * @param {string|number} [offset='-80px'] — Offset from top (CSS string)
   */
  Utils.scrollIntoView = function (el, offset) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset;
    if (offset) {
      if (typeof offset === 'string' && offset.includes('px')) {
        y += parseInt(offset, 10);
      } else if (typeof offset === 'number') {
        y += offset;
      }
    } else {
      y -= 80; // Default offset for fixed navbar
    }
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ================================================================== */
  /*  TECHNICAL INDICATORS                                               */
  /* ================================================================== */

  /**
   * Calculate Relative Strength Index (RSI) from a price array.
   *
   * @param {number[]} prices — Array of closing prices (oldest first)
   * @param {number} [period=14] — RSI period
   * @returns {number[]} RSI values (same length as prices, first `period` entries are null)
   */
  Utils.calculateRSI = function (prices, period) {
    if (!period) period = 14;
    if (!prices || prices.length < period + 1) return [];

    var gains = [];
    var losses = [];
    var rsi = new Array(prices.length).fill(null);

    // Calculate price changes
    for (var i = 1; i < prices.length; i++) {
      var change = prices[i] - prices[i - 1];
      if (change >= 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }

    // First average (simple average)
    var avgGain = 0;
    var avgLoss = 0;
    for (var j = 0; j < period; j++) {
      avgGain += gains[j];
      avgLoss += losses[j];
    }
    avgGain /= period;
    avgLoss /= period;

    // Calculate initial RSI
    if (avgLoss === 0) {
      rsi[period] = 100;
    } else {
      var rs = avgGain / avgLoss;
      rsi[period] = 100 - (100 / (1 + rs));
    }

    // Subsequent RSIs use smoothed (Wilder's) averaging
    for (var k = period; k < gains.length; k++) {
      avgGain = (avgGain * (period - 1) + gains[k]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[k]) / period;

      if (avgLoss === 0) {
        rsi[k + 1] = 100;
      } else {
        var rs2 = avgGain / avgLoss;
        rsi[k + 1] = 100 - (100 / (1 + rs2));
      }
    }

    return rsi;
  };

  /**
   * Calculate Simple Moving Average (SMA).
   *
   * @param {number[]} prices — Array of closing prices (oldest first)
   * @param {number} period — Moving average period
   * @returns {number[]} SMA values (null for indices < period - 1)
   */
  Utils.calculateMA = function (prices, period) {
    if (!prices || prices.length < period) return [];
    var ma = new Array(prices.length).fill(null);

    for (var i = period - 1; i < prices.length; i++) {
      var sum = 0;
      for (var j = i - period + 1; j <= i; j++) {
        sum += prices[j];
      }
      ma[i] = sum / period;
    }

    return ma;
  };

  /**
   * Calculate MACD (Moving Average Convergence Divergence).
   * Returns { macdLine, signalLine, histogram }.
   *
   * Standard parameters: 12/26/9
   *
   * @param {number[]} prices — Array of closing prices (oldest first)
   * @param {number} [fastPeriod=12]
   * @param {number} [slowPeriod=26]
   * @param {number} [signalPeriod=9]
   * @returns {{ macdLine: number[], signalLine: number[], histogram: number[] }}
   */
  Utils.calculateMACD = function (prices, fastPeriod, slowPeriod, signalPeriod) {
    if (!fastPeriod) fastPeriod = 12;
    if (!slowPeriod) slowPeriod = 26;
    if (!signalPeriod) signalPeriod = 9;
    if (!prices || prices.length < slowPeriod + signalPeriod) {
      return { macdLine: [], signalLine: [], histogram: [] };
    }

    // Calculate EMA (Exponential Moving Average)
    function calcEMA(data, period) {
      var ema = new Array(data.length).fill(null);
      var multiplier = 2 / (period + 1);

      // First EMA is SMA
      var sum = 0;
      for (var i = 0; i < period; i++) sum += data[i];
      ema[period - 1] = sum / period;

      for (var j = period; j < data.length; j++) {
        ema[j] = (data[j] - ema[j - 1]) * multiplier + ema[j - 1];
      }
      return ema;
    }

    var emaFast = calcEMA(prices, fastPeriod);
    var emaSlow = calcEMA(prices, slowPeriod);

    // MACD line = fast EMA - slow EMA
    var macdLine = new Array(prices.length).fill(null);
    var macdValues = [];
    for (var m = 0; m < prices.length; m++) {
      if (emaFast[m] !== null && emaSlow[m] !== null) {
        macdLine[m] = emaFast[m] - emaSlow[m];
        macdValues.push(macdLine[m]);
      }
    }

    // Signal line = EMA of MACD line
    var signalLine = new Array(prices.length).fill(null);
    if (macdValues.length >= signalPeriod) {
      var emaSignal = calcEMA(macdValues, signalPeriod);
      // Map back to full-length array
      var macdIdx = 0;
      for (var s = 0; s < prices.length; s++) {
        if (macdLine[s] !== null) {
          if (emaSignal[macdIdx] !== null) {
            signalLine[s] = emaSignal[macdIdx];
          }
          macdIdx++;
        }
      }
    }

    // Histogram = MACD - Signal
    var histogram = new Array(prices.length).fill(null);
    for (var h = 0; h < prices.length; h++) {
      if (macdLine[h] !== null && signalLine[h] !== null) {
        histogram[h] = macdLine[h] - signalLine[h];
      }
    }

    return { macdLine: macdLine, signalLine: signalLine, histogram: histogram };
  };

  /* ================================================================== */
  /*  MISC HELPERS                                                       */
  /* ================================================================== */

  /**
   * Calculate exponential moving average (EMA) — exposed for reuse.
   * @param {number[]} data
   * @param {number} period
   * @returns {number[]}
   */
  Utils.calculateEMA = function (data, period) {
    var ema = new Array(data.length).fill(null);
    if (data.length < period) return ema;

    var multiplier = 2 / (period + 1);
    var sum = 0;
    for (var i = 0; i < period; i++) sum += data[i];
    ema[period - 1] = sum / period;

    for (var j = period; j < data.length; j++) {
      ema[j] = (data[j] - ema[j - 1]) * multiplier + ema[j - 1];
    }
    return ema;
  };

  /**
   * Format a large number with abbreviations (K, M, B, T).
   * @param {number} n
   * @param {number} [decimals=2]
   * @returns {string}
   */
  Utils.formatCompact = function (n, decimals) {
    if (decimals === undefined) decimals = 2;
    if (n == null || isNaN(n)) return '0';
    if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(decimals) + 'T';
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(decimals) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(decimals) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(decimals) + 'K';
    return n.toFixed(decimals);
  };

  /**
   * Safely parse a number, returning fallback on failure.
   * @param {*} value
   * @param {number} [fallback=0]
   * @returns {number}
   */
  Utils.parseNumber = function (value, fallback) {
    if (fallback === undefined) fallback = 0;
    var n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  };

  /**
   * Group an array of objects by a key.
   * @param {Array} arr
   * @param {string} key
   * @returns {Object}
   */
  Utils.groupBy = function (arr, key) {
    return arr.reduce(function (groups, item) {
      var val = typeof key === 'function' ? key(item) : item[key];
      if (!groups[val]) groups[val] = [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  /**
   * Hex color with alpha to rgba string. Useful for Canvas operations.
   * @param {string} hex — e.g. "#3b82f6"
   * @param {number} alpha — 0-1
   * @returns {string} e.g. "rgba(59, 130, 246, 0.5)"
   */
  Utils.hexToRGBA = function (hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  };

  /* ================================================================== */
  /*  EXPOSE                                                             */
  /* ================================================================== */

  window.Utils = Utils;

})();