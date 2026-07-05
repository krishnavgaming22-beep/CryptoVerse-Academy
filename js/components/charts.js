/**
 * CryptoVerse Academy — Charts
 * ================================
 * Canvas-based chart rendering with NO external libraries.
 * Supports candlestick, line, pie, bar, RSI, and MACD charts.
 * All charts are responsive, dark-themed, and interactive.
 *
 * Dependencies: window.Utils (helpers.js)
 *
 * Color tokens (from css/variables.css):
 *   --bg-primary:    #0a0e17   (chart background)
 *   --bg-tertiary:   #1a1f2e   (grid/axes)
 *   --text-secondary: #94a3b8  (labels)
 *   --text-muted:    #475569   (subtle labels)
 *   --border-primary: rgba(148,163,184,0.1)  (grid lines)
 *   --green:         #10b981   (bullish/up)
 *   --red:           #f43f5e   (bearish/down)
 *   --accent-blue:   #3b82f6   (primary accent)
 *   --accent-cyan:   #06b6d4
 *   --accent-purple: #8b5cf6
 *   --accent-amber:  #f59e0b
 *   --accent-rose:   #f43f5e
 *
 * Usage:
 *   Charts.renderCandlestick(canvasEl, data, { showVolume: true, showMA: true });
 */
(function () {
  'use strict';

  var Charts = {};

  /* ================================================================== */
  /*  THEME COLORS                                                       */
  /* ================================================================== */

  /** Resolve CSS variable at runtime, with fallback */
  function cssVar(name, fallback) {
    if (typeof getComputedStyle === 'function') {
      var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return val || fallback;
    }
    return fallback;
  }

  /** Cached theme object — refreshed on each render call */
  function getTheme() {
    return {
      bg:           cssVar('--bg-primary', '#0a0e17'),
      bgSecondary:  cssVar('--bg-secondary', '#111827'),
      bgTertiary:   cssVar('--bg-tertiary', '#1a1f2e'),
      grid:         cssVar('--border-primary', 'rgba(148,163,184,0.1)'),
      gridStrong:   'rgba(148,163,184,0.18)',
      text:         cssVar('--text-primary', '#f1f5f9'),
      textSec:      cssVar('--text-secondary', '#94a3b8'),
      textMuted:    cssVar('--text-muted', '#475569'),
      green:        cssVar('--green', '#10b981'),
      greenLight:   cssVar('--green-light', '#34d399'),
      red:          cssVar('--red', '#f43f5e'),
      redLight:     cssVar('--red-light', '#fb7185'),
      blue:         cssVar('--accent-blue', '#3b82f6'),
      blueLight:    cssVar('--accent-blue-light', '#60a5fa'),
      cyan:         cssVar('--accent-cyan', '#06b6d4'),
      purple:       cssVar('--accent-purple', '#8b5cf6'),
      purpleLight:  cssVar('--accent-purple-light', '#a78bfa'),
      amber:        cssVar('--accent-amber', '#f59e0b'),
      amberLight:   cssVar('--accent-amber-light', '#fbbf24'),
      rose:         cssVar('--accent-rose', '#f43f5e'),
      crosshair:    'rgba(148,163,184,0.5)',
      tooltipBg:    'rgba(17,24,39,0.92)',
      tooltipBorder:'rgba(148,163,184,0.15)'
    };
  }

  /* ================================================================== */
  /*  CANVAS SETUP                                                       */
  /* ================================================================== */

  /**
   * Set up a canvas with proper DPI scaling.
   * @param {HTMLCanvasElement} canvas
   * @returns {{ ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number }}
   */
  function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Store logical dimensions
    canvas._logicalWidth = w;
    canvas._logicalHeight = h;

    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  /**
   * Register a ResizeObserver on a canvas to auto-redraw on container resize.
   * @param {HTMLCanvasElement} canvas
   * @param {Function} renderFn — Render function to call on resize
   */
  function makeResponsive(canvas, renderFn) {
    // Use ResizeObserver if available
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        renderFn();
      });
      observer.observe(canvas.parentElement || canvas);
      canvas._resizeObserver = observer;
    } else {
      window.addEventListener('resize', Utils.debounce(renderFn, 150));
    }
  }

  /* ================================================================== */
  /*  TOOLTIP OVERLAY                                                    */
  /* ================================================================== */

  /** Currently active tooltip element */
  var _activeTooltip = null;

  function showChartTooltip(canvas, x, y, lines, theme) {
    removeChartTooltip();

    var el = document.createElement('div');
    el.className = 'chart-tooltip';
    el.style.cssText =
      'position:fixed;z-index:600;pointer-events:none;' +
      'background:' + theme.tooltipBg + ';' +
      'border:1px solid ' + theme.tooltipBorder + ';' +
      'border-radius:8px;padding:8px 12px;font-size:12px;' +
      'font-family:var(--font-mono),monospace;color:' + theme.textSec + ';' +
      'line-height:1.6;backdrop-filter:blur(8px);' +
      'box-shadow:0 4px 20px rgba(0,0,0,0.4);max-width:250px;';

    el.innerHTML = lines.map(function (l) {
      if (typeof l === 'string') return '<div>' + l + '</div>';
      return '<div style="color:' + (l.color || theme.textSec) + ';">' + l.text + '</div>';
    }).join('');

    document.body.appendChild(el);
    _activeTooltip = el;

    // Position near cursor but keep on screen
    var rect = canvas.getBoundingClientRect();
    var left = rect.left + x + 16;
    var top = rect.top + y - 10;

    // Prevent overflow
    if (left + 200 > window.innerWidth) left = rect.left + x - 200;
    if (top + 100 > window.innerHeight) top = rect.top + y - 100;

    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function removeChartTooltip() {
    if (_activeTooltip && _activeTooltip.parentNode) {
      _activeTooltip.parentNode.removeChild(_activeTooltip);
      _activeTooltip = null;
    }
  }

  /* ================================================================== */
  /*  HELPER — FORMAT                                                    */
  /* ================================================================== */

  function fmtPrice(n) {
    if (n == null) return '';
    if (Math.abs(n) >= 10000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (Math.abs(n) >= 1) return '$' + n.toFixed(2);
    if (Math.abs(n) >= 0.01) return '$' + n.toFixed(4);
    return '$' + n.toFixed(6);
  }

  function fmtVol(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toFixed(0);
  }

  function fmtDate(d) {
    if (!d) return '';
    var date = d instanceof Date ? d : new Date(d);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
  }

  function fmtTime(d) {
    if (!d) return '';
    var date = d instanceof Date ? d : new Date(d);
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
  }

  /* ================================================================== */
  /*  CANDLESTICK CHART                                                  */
  /* ================================================================== */

  /**
   * Render a professional candlestick chart.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array<{time: Date, open: number, high: number, low: number, close: number, volume?: number}>} data
   * @param {Object} [options]
   *   - showVolume {boolean}   — Show volume bars at bottom (default: true)
   *   - showMA {boolean}       — Show moving average overlay (default: false)
   *   - maPeriod {number}      — MA period (default: 20)
   *   - showRSI {boolean}      — Show RSI sub-panel (default: false)
   *   - rsiPeriod {number}     — RSI period (default: 14)
   *   - zoom {number}          — Zoom level 0.5-2 (default: 1)
   *   - pan {number}           — Pan offset in candles (default: 0)
   *   - gridLines {number}     — Number of horizontal grid lines (default: 5)
   *   - showCrosshair {boolean}— Show crosshair on hover (default: true)
   *   - responsive {boolean}   — Auto-resize on container resize (default: true)
   */
  Charts.renderCandlestick = function (canvas, data, options) {
    if (!canvas || !data || data.length === 0) return;

    options = Object.assign({
      showVolume: true,
      showMA: false,
      maPeriod: 20,
      showRSI: false,
      rsiPeriod: 14,
      zoom: 1,
      pan: 0,
      gridLines: 5,
      showCrosshair: true,
      responsive: true
    }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;
    var dpr = s.dpr;

    // Layout margins
    var margin = { top: 20, right: 70, bottom: 30, left: 10 };
    var rsiHeight = options.showRSI ? H * 0.2 : 0;
    var volumeHeight = options.showVolume ? H * 0.15 : 0;

    var chartH = H - margin.top - margin.bottom - volumeHeight - (options.showRSI ? 8 : 0);
    var chartW = W - margin.left - margin.right;
    var volTop = margin.top + chartH + 4;
    var rsiTop = volTop + volumeHeight + 8;
    var rsiH = rsiHeight - 8;

    // Calculate visible range
    var candleW = Math.max(3, (chartW / data.length) * options.zoom);
    var totalCandlesVisible = Math.floor(chartW / candleW);
    var startIdx = Math.max(0, Math.floor(data.length - totalCandlesVisible) + Math.floor(options.pan));
    var endIdx = Math.min(data.length, startIdx + totalCandlesVisible);
    var visibleData = data.slice(startIdx, endIdx);
    if (visibleData.length === 0) return;

    // Calculate MA
    var maData = [];
    if (options.showMA) {
      var closes = data.map(function (d) { return d.close; });
      maData = Utils.calculateMA(closes, options.maPeriod);
    }

    // Calculate RSI
    var rsiData = [];
    if (options.showRSI) {
      var rsiCloses = data.map(function (d) { return d.close; });
      rsiData = Utils.calculateRSI(rsiCloses, options.rsiPeriod);
    }

    // Price range
    var minPrice = Infinity, maxPrice = -Infinity, maxVol = 0;
    visibleData.forEach(function (d) {
      if (d.low < minPrice) minPrice = d.low;
      if (d.high > maxPrice) maxPrice = d.high;
      if (d.volume > maxVol) maxVol = d.volume;
    });

    // Include MA in price range
    if (options.showMA) {
      for (var mi = startIdx; mi < endIdx; mi++) {
        if (maData[mi] !== null && maData[mi] !== undefined) {
          if (maData[mi] < minPrice) minPrice = maData[mi];
          if (maData[mi] > maxPrice) maxPrice = maData[mi];
        }
      }
    }

    // Add padding to price range
    var priceRange = maxPrice - minPrice;
    var pricePadding = priceRange * 0.08;
    minPrice -= pricePadding;
    maxPrice += pricePadding;

    // Sizing
    var bodyW = Math.max(1, candleW * 0.65);
    var wickW = Math.max(1, bodyW * 0.15);

    function priceToY(price) {
      return margin.top + chartH * (1 - (price - minPrice) / (maxPrice - minPrice));
    }

    function idxToX(i) {
      return margin.left + (i - startIdx + 0.5) * candleW;
    }

    /* ── Clear & Background ── */
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Grid Lines ── */
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 0.5;

    // Horizontal grid + price labels
    var priceStep = niceStep((maxPrice - minPrice) / options.gridLines);
    var priceLabelStart = Math.ceil(minPrice / priceStep) * priceStep;

    ctx.font = '11px var(--font-mono), monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (var pg = priceLabelStart; pg <= maxPrice; pg += priceStep) {
      var y = priceToY(pg);
      if (y < margin.top || y > margin.top + chartH) continue;

      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(W - margin.right, y);
      ctx.stroke();

      // Price label on right axis
      ctx.fillStyle = theme.textMuted;
      ctx.fillText(fmtPrice(pg), W - margin.right + 8, y);
    }

    // Vertical grid + time labels
    var timeStep = Math.max(1, Math.floor(visibleData.length / 6));
    for (var ti = 0; ti < visibleData.length; ti += timeStep) {
      var x = idxToX(startIdx + ti);
      ctx.beginPath();
      ctx.strokeStyle = theme.grid;
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartH);
      ctx.stroke();

      // Time label
      ctx.fillStyle = theme.textMuted;
      ctx.textAlign = 'center';
      ctx.fillText(fmtDate(visibleData[ti].time), x, H - margin.bottom + 16);
    }

    /* ── Volume Bars ── */
    if (options.showVolume && maxVol > 0) {
      visibleData.forEach(function (d, i) {
        var cx = idxToX(startIdx + i);
        var isUp = d.close >= d.open;
        var volH = (d.volume / maxVol) * volumeHeight;
        ctx.fillStyle = isUp ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)';
        ctx.fillRect(cx - bodyW / 2, volTop + volumeHeight - volH, bodyW, volH);
      });

      // Volume section separator
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(margin.left, volTop);
      ctx.lineTo(W - margin.right, volTop);
      ctx.stroke();
    }

    /* ── Candlesticks ── */
    visibleData.forEach(function (d, i) {
      var cx = idxToX(startIdx + i);
      var isUp = d.close >= d.open;
      var color = isUp ? theme.green : theme.red;

      // Wick (high-low line)
      ctx.strokeStyle = color;
      ctx.lineWidth = wickW;
      ctx.beginPath();
      ctx.moveTo(cx, priceToY(d.high));
      ctx.lineTo(cx, priceToY(d.low));
      ctx.stroke();

      // Body
      var bodyTop = priceToY(Math.max(d.open, d.close));
      var bodyBot = priceToY(Math.min(d.open, d.close));
      var bodyHeight = Math.max(1, bodyBot - bodyTop);

      if (isUp) {
        ctx.fillStyle = theme.bg; // Hollow body for up candles
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillRect(cx - bodyW / 2, bodyTop, bodyW, bodyHeight);
        ctx.strokeRect(cx - bodyW / 2, bodyTop, bodyW, bodyHeight);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(cx - bodyW / 2, bodyTop, bodyW, bodyHeight);
      }
    });

    /* ── Moving Average Overlay ── */
    if (options.showMA && maData.length) {
      ctx.strokeStyle = theme.amber;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      var maStarted = false;
      for (var mi2 = startIdx; mi2 < endIdx; mi2++) {
        if (maData[mi2] === null || maData[mi2] === undefined) continue;
        var mx = idxToX(mi2);
        var my = priceToY(maData[mi2]);
        if (!maStarted) {
          ctx.moveTo(mx, my);
          maStarted = true;
        } else {
          ctx.lineTo(mx, my);
        }
      }
      ctx.stroke();
    }

    /* ── RSI Panel ── */
    if (options.showRSI && rsiData.length) {
      // RSI background
      ctx.fillStyle = 'rgba(10,14,23,0.6)';
      ctx.fillRect(margin.left, rsiTop, chartW, rsiH);

      // RSI border
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(margin.left, rsiTop);
      ctx.lineTo(W - margin.right, rsiTop);
      ctx.stroke();

      // RSI levels (30, 50, 70)
      [30, 50, 70].forEach(function (level) {
        var ly = rsiTop + rsiH * (1 - level / 100);
        ctx.strokeStyle = level === 50 ? theme.gridStrong : theme.grid;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(margin.left, ly);
        ctx.lineTo(W - margin.right, ly);
        ctx.stroke();

        // Label
        ctx.fillStyle = theme.textMuted;
        ctx.font = '10px var(--font-mono), monospace';
        ctx.textAlign = 'left';
        ctx.fillText(level.toString(), W - margin.right + 8, ly);
      });

      // RSI line
      ctx.strokeStyle = theme.purple;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      var rsiStarted = false;
      for (var ri = startIdx; ri < endIdx; ri++) {
        if (rsiData[ri] === null || rsiData[ri] === undefined) continue;
        var rx = idxToX(ri);
        var ry = rsiTop + rsiH * (1 - rsiData[ri] / 100);
        if (!rsiStarted) {
          ctx.moveTo(rx, ry);
          rsiStarted = true;
        } else {
          ctx.lineTo(rx, ry);
        }
      }
      ctx.stroke();

      // Overbought/oversold zones
      ctx.fillStyle = 'rgba(244,63,94,0.05)';
      ctx.fillRect(margin.left, rsiTop, chartW, rsiH * 0.3); // 70-100 zone
      ctx.fillStyle = 'rgba(16,185,129,0.05)';
      ctx.fillRect(margin.left, rsiTop + rsiH * 0.7, chartW, rsiH * 0.3); // 0-30 zone

      // RSI label
      ctx.fillStyle = theme.purpleLight;
      ctx.font = '10px var(--font-sans), sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (' + options.rsiPeriod + ')', margin.left + 4, rsiTop + 12);
    }

    /* ── Crosshair & Tooltip ── */
    if (options.showCrosshair) {
      // Remove old listeners
      if (canvas._crosshairCleanup) canvas._crosshairCleanup();

      var onMove = function (e) {
        var rect = canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        // Redraw (or use overlay canvas for performance — for now, redraw)
        var s2 = setupCanvas(canvas);
        var ctx2 = s2.ctx;

        // Re-render everything (for simplicity; in production, use an overlay canvas)
        // Instead, let's draw crosshair on top via a lightweight approach
        // We'll use a single overlay canvas
        if (!canvas._overlayCanvas) {
          canvas._overlayCanvas = document.createElement('canvas');
          canvas._overlayCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
          canvas.style.position = 'relative';
          canvas.parentElement.style.position = 'relative';
          canvas.parentElement.appendChild(canvas._overlayCanvas);
        }

        var ov = canvas._overlayCanvas;
        ov.width = canvas.width;
        ov.height = canvas.height;
        var octx = ov.getContext('2d');
        octx.scale(dpr, dpr);

        // Determine which candle we're hovering
        var candleIdx = Math.floor((mx - margin.left) / candleW) + startIdx;
        if (candleIdx < 0 || candleIdx >= data.length) {
          removeChartTooltip();
          return;
        }

        var hoverData = data[candleIdx];
        var hoverX = idxToX(candleIdx);

        // Vertical crosshair line
        octx.strokeStyle = theme.crosshair;
        octx.lineWidth = 0.5;
        octx.setLineDash([4, 4]);
        octx.beginPath();
        octx.moveTo(hoverX, margin.top);
        octx.lineTo(hoverX, margin.top + chartH);
        octx.stroke();

        // Horizontal crosshair
        if (my >= margin.top && my <= margin.top + chartH) {
          octx.beginPath();
          octx.moveTo(margin.left, my);
          octx.lineTo(W - margin.right, my);
          octx.stroke();

          // Price label on Y axis
          var hoverPrice = minPrice + (maxPrice - minPrice) * (1 - (my - margin.top) / chartH);
          octx.setLineDash([]);
          octx.fillStyle = theme.blue;
          octx.fillRect(W - margin.right, my - 10, margin.right, 20);
          octx.fillStyle = '#ffffff';
          octx.font = '11px var(--font-mono), monospace';
          octx.textAlign = 'left';
          octx.textBaseline = 'middle';
          octx.fillText(fmtPrice(hoverPrice), W - margin.right + 6, my);
        }
        octx.setLineDash([]);

        // Tooltip
        var isUp = hoverData.close >= hoverData.open;
        var lines = [
          '<div style="color:' + theme.textSec + ';font-size:10px;margin-bottom:4px;">' +
            fmtDate(hoverData.time) + ' ' + fmtTime(hoverData.time) + '</div>',
          { text: 'O: ' + fmtPrice(hoverData.open), color: theme.text },
          { text: 'H: ' + fmtPrice(hoverData.high), color: theme.greenLight },
          { text: 'L: ' + fmtPrice(hoverData.low), color: theme.redLight },
          { text: 'C: ' + fmtPrice(hoverData.close), color: isUp ? theme.green : theme.red }
        ];
        if (options.showVolume && hoverData.volume) {
          lines.push({ text: 'Vol: ' + fmtVol(hoverData.volume), color: theme.textMuted });
        }
        if (options.showMA && maData[candleIdx] != null) {
          lines.push({ text: 'MA' + options.maPeriod + ': ' + fmtPrice(maData[candleIdx]), color: theme.amber });
        }
        if (options.showRSI && rsiData[candleIdx] != null) {
          lines.push({ text: 'RSI: ' + rsiData[candleIdx].toFixed(1), color: theme.purpleLight });
        }

        showChartTooltip(canvas, hoverX, my, lines, theme);
      };

      var onLeave = function () {
        if (canvas._overlayCanvas) {
          var octx = canvas._overlayCanvas.getContext('2d');
          octx.clearRect(0, 0, canvas._overlayCanvas.width, canvas._overlayCanvas.height);
        }
        removeChartTooltip();
      };

      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseleave', onLeave);

      canvas._crosshairCleanup = function () {
        canvas.removeEventListener('mousemove', onMove);
        canvas.removeEventListener('mouseleave', onLeave);
      };
    }

    /* ── Right axis border ── */
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W - margin.right, margin.top);
    ctx.lineTo(W - margin.right, margin.top + chartH);
    ctx.stroke();

    /* ── Responsive ── */
    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderCandlestick(canvas, data, options);
      });
    }
  };

  /* ================================================================== */
  /*  LINE CHART                                                         */
  /* ================================================================== */

  /**
   * Render a line chart with optional gradient fill.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array<{x: number|string|Date, y: number}>|number[]} data — Points or simple values
   * @param {Object} [options]
   *   - color {string}       — Line color (default: blue)
   *   - fillColor {string}   — Gradient fill color (default: same as color)
   *   - lineWidth {number}   — Line width (default: 2)
   *   - fill {boolean}       — Show gradient fill (default: true)
   *   - smooth {boolean}     — Smooth curve (default: true)
   *   - gridLines {number}   — Horizontal grid lines (default: 5)
   *   - labels {boolean}     — Show Y-axis labels (default: true)
   *   - showDots {boolean}   — Show data point dots (default: false)
   *   - responsive {boolean}
   */
  Charts.renderLineChart = function (canvas, data, options) {
    if (!canvas || !data || data.length === 0) return;

    options = Object.assign({
      color: null, // will use theme.blue
      fillColor: null,
      lineWidth: 2,
      fill: true,
      smooth: true,
      gridLines: 5,
      labels: true,
      showDots: false,
      responsive: true
    }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;
    var dpr = s.dpr;

    var color = options.color || theme.blue;
    var fillColor = options.fillColor || color;

    // Normalize data to [{x, y}] format
    var points = data.map(function (d, i) {
      if (typeof d === 'number') return { x: i, y: d };
      return { x: typeof d.x === 'number' ? d.x : i, y: d.y };
    });

    var margin = { top: 20, right: options.labels ? 60 : 10, bottom: 30, left: 10 };
    var chartW = W - margin.left - margin.right;
    var chartH = H - margin.top - margin.bottom;

    var minY = Math.min.apply(null, points.map(function (p) { return p.y; }));
    var maxY = Math.max.apply(null, points.map(function (p) { return p.y; }));
    var range = maxY - minY || 1;
    minY -= range * 0.05;
    maxY += range * 0.05;
    range = maxY - minY;

    function toX(x) { return margin.left + (x / (points.length - 1 || 1)) * chartW; }
    function toY(y) { return margin.top + chartH * (1 - (y - minY) / range); }

    // Clear
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 0.5;
    var yStep = niceStep(range / options.gridLines);
    var yStart = Math.ceil(minY / yStep) * yStep;
    ctx.font = '11px var(--font-mono), monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (var gy = yStart; gy <= maxY; gy += yStep) {
      var yy = toY(gy);
      ctx.beginPath();
      ctx.moveTo(margin.left, yy);
      ctx.lineTo(W - margin.right, yy);
      ctx.stroke();
      if (options.labels) {
        ctx.fillStyle = theme.textMuted;
        ctx.fillText(fmtPrice(gy), W - margin.right + 8, yy);
      }
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = options.lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    if (options.smooth && points.length > 2) {
      // Catmull-Rom spline
      ctx.moveTo(toX(points[0].x), toY(points[0].y));
      for (var li = 0; li < points.length - 1; li++) {
        var p0 = points[Math.max(0, li - 1)];
        var p1 = points[li];
        var p2 = points[Math.min(points.length - 1, li + 1)];
        var p3 = points[Math.min(points.length - 1, li + 2)];

        var cp1x = toX(p1.x) + (toX(p2.x) - toX(p0.x)) / 6;
        var cp1y = toY(p1.y) + (toY(p2.y) - toY(p0.y)) / 6;
        var cp2x = toX(p2.x) - (toX(p3.x) - toX(p1.x)) / 6;
        var cp2y = toY(p2.y) - (toY(p3.y) - toY(p1.y)) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toX(p2.x), toY(p2.y));
      }
    } else {
      points.forEach(function (p, idx) {
        if (idx === 0) ctx.moveTo(toX(p.x), toY(p.y));
        else ctx.lineTo(toX(p.x), toY(p.y));
      });
    }
    ctx.stroke();

    // Gradient fill
    if (options.fill) {
      var grad = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartH);
      grad.addColorStop(0, hexToRGBA(fillColor, 0.3));
      grad.addColorStop(1, hexToRGBA(fillColor, 0.0));

      ctx.lineTo(toX(points[points.length - 1].x), margin.top + chartH);
      ctx.lineTo(toX(points[0].x), margin.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Dots
    if (options.showDots) {
      points.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(toX(p.x), toY(p.y), 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = theme.bg;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // Right axis
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W - margin.right, margin.top);
    ctx.lineTo(W - margin.right, margin.top + chartH);
    ctx.stroke();

    // Hover tooltip
    if (canvas._crosshairCleanup) canvas._crosshairCleanup();
    var onMove2 = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx2 = e.clientX - rect.left;
      var idx2 = Math.round(((mx2 - margin.left) / chartW) * (points.length - 1));
      idx2 = Math.max(0, Math.min(points.length - 1, idx2));

      var pt = points[idx2];
      showChartTooltip(canvas, toX(pt.x), toY(pt.y), [
        { text: fmtPrice(pt.y), color: color }
      ], theme);
    };
    var onLeave2 = function () { removeChartTooltip(); };
    canvas.addEventListener('mousemove', onMove2);
    canvas.addEventListener('mouseleave', onLeave2);
    canvas._crosshairCleanup = function () {
      canvas.removeEventListener('mousemove', onMove2);
      canvas.removeEventListener('mouseleave', onLeave2);
    };

    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderLineChart(canvas, data, options);
      });
    }
  };

  /* ================================================================== */
  /*  PIE / DONUT CHART                                                  */
  /* ================================================================== */

  /**
   * Render a pie or donut chart.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array<{label: string, value: number, color?: string}>} data
   * @param {Object} [options]
   *   - donut {boolean}       — Render as donut (default: true)
   *   - donutWidth {number}   — Donut ring width as fraction (0-1) (default: 0.35)
   *   - showLabels {boolean}  — Show labels (default: true)
   *   - showPercent {boolean} — Show percentage (default: true)
   *   - legendPosition {string} — 'right' | 'bottom' (default: 'right')
   *   - responsive {boolean}
   */
  Charts.renderPieChart = function (canvas, data, options) {
    if (!canvas || !data || data.length === 0) return;

    options = Object.assign({
      donut: true,
      donutWidth: 0.35,
      showLabels: true,
      showPercent: true,
      legendPosition: 'right',
      responsive: true
    }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;
    var dpr = s.dpr;

    var defaultColors = [theme.blue, theme.cyan, theme.purple, theme.amber, theme.green, theme.rose, theme.purpleLight, theme.amberLight];

    var total = data.reduce(function (s, d) { return s + d.value; }, 0);
    if (total === 0) return;

    // Layout
    var legendW = (options.showLabels && options.legendPosition === 'right') ? 140 : 0;
    var legendH = (options.showLabels && options.legendPosition === 'bottom') ? Math.ceil(data.length / 3) * 24 : 0;
    var chartW = W - legendW - 20;
    var chartH = H - legendH - 20;
    var cx = 10 + chartW / 2;
    var cy = 10 + chartH / 2;
    var radius = Math.min(chartW, chartH) / 2 - 10;

    // Clear
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    // Draw slices
    var startAngle = -Math.PI / 2;
    var sliceData = []; // For tooltip hit detection

    data.forEach(function (d, i) {
      var sliceAngle = (d.value / total) * Math.PI * 2;
      var endAngle = startAngle + sliceAngle;
      var color = d.color || defaultColors[i % defaultColors.length];

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Subtle border between slices
      ctx.strokeStyle = theme.bg;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Store for tooltip
      sliceData.push({
        startAngle: startAngle,
        endAngle: endAngle,
        color: color,
        label: d.label,
        value: d.value,
        percent: (d.value / total * 100).toFixed(1)
      });

      // Label on slice (if big enough)
      if (options.showLabels && sliceAngle > 0.3) {
        var midAngle = startAngle + sliceAngle / 2;
        var labelR = radius * (options.donut ? 0.72 : 0.65);
        var lx = cx + Math.cos(midAngle) * labelR;
        var ly = cy + Math.sin(midAngle) * labelR;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px var(--font-sans), sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var labelStr = options.showPercent ? d.label + '\n' + (d.value / total * 100).toFixed(1) + '%' : d.label;
        var labelLines = labelStr.split('\n');
        labelLines.forEach(function (line, li) {
          ctx.fillText(line, lx, ly + li * 14 - (labelLines.length - 1) * 7);
        });
      }

      startAngle = endAngle;
    });

    // Donut hole
    if (options.donut) {
      var innerR = radius * (1 - options.donutWidth);
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = theme.bg;
      ctx.fill();

      // Center text
      ctx.fillStyle = theme.text;
      ctx.font = 'bold 18px var(--font-sans), sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total >= 1e9 ? (total / 1e9).toFixed(1) + 'B' : total >= 1e6 ? (total / 1e6).toFixed(1) + 'M' : total.toFixed(2), cx, cy - 6);
      ctx.font = '11px var(--font-sans), sans-serif';
      ctx.fillStyle = theme.textMuted;
      ctx.fillText('Total', cx, cy + 14);
    }

    // Legend (right side)
    if (options.showLabels && options.legendPosition === 'right') {
      var lx2 = W - legendW + 10;
      var ly2 = 20;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      sliceData.forEach(function (sd) {
        // Color swatch
        ctx.fillStyle = sd.color;
        ctx.fillRect(lx2, ly2 - 5, 10, 10);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(lx2, ly2 - 5, 10, 10);

        // Label
        ctx.fillStyle = theme.textSec;
        ctx.font = '12px var(--font-sans), sans-serif';
        ctx.fillText(sd.label, lx2 + 16, ly2);

        // Percent
        ctx.fillStyle = theme.textMuted;
        ctx.font = '11px var(--font-mono), monospace';
        ctx.fillText(sd.percent + '%', lx2 + 16, ly2 + 15);

        ly2 += 32;
      });
    }

    // Hover tooltip
    if (canvas._crosshairCleanup) canvas._crosshairCleanup();
    var onMove3 = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx3 = e.clientX - rect.left;
      var my3 = e.clientY - rect.top;

      var dx = mx3 - cx;
      var dy = my3 - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;

      var hovered = null;
      if (dist <= radius && (!options.donut || dist >= radius * (1 - options.donutWidth))) {
        for (var si = 0; si < sliceData.length; si++) {
          if (angle >= sliceData[si].startAngle && angle < sliceData[si].endAngle) {
            hovered = sliceData[si];
            break;
          }
        }
      }

      if (hovered) {
        showChartTooltip(canvas, mx3, my3, [
          { text: hovered.label, color: hovered.color },
          { text: hovered.percent + '%', color: theme.text }
        ], theme);
      } else {
        removeChartTooltip();
      }
    };
    var onLeave3 = function () { removeChartTooltip(); };
    canvas.addEventListener('mousemove', onMove3);
    canvas.addEventListener('mouseleave', onLeave3);
    canvas._crosshairCleanup = function () {
      canvas.removeEventListener('mousemove', onMove3);
      canvas.removeEventListener('mouseleave', onLeave3);
    };

    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderPieChart(canvas, data, options);
      });
    }
  };

  /* ================================================================== */
  /*  BAR CHART                                                          */
  /* ================================================================== */

  /**
   * Render a bar chart.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array<{label: string, value: number, color?: string}>} data
   * @param {Object} [options]
   *   - horizontal {boolean}  — Horizontal bars (default: false)
   *   - barColor {string}     — Default bar color
   *   - showValues {boolean}  — Show value labels (default: true)
   *   - gridLines {number}    — (default: 5)
   *   - responsive {boolean}
   */
  Charts.renderBarChart = function (canvas, data, options) {
    if (!canvas || !data || data.length === 0) return;

    options = Object.assign({
      horizontal: false,
      barColor: null,
      showValues: true,
      gridLines: 5,
      responsive: true
    }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;
    var dpr = s.dpr;

    var defaultBarColor = options.barColor || theme.blue;
    var barColors = [theme.blue, theme.cyan, theme.purple, theme.amber, theme.green, theme.rose];

    // Clear
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    if (options.horizontal) {
      // ── Horizontal Bar Chart ──
      var hMargin = { top: 10, right: 60, bottom: 10, left: 100 };
      var hChartW = W - hMargin.left - hMargin.right;
      var hChartH = H - hMargin.top - hMargin.bottom;

      var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
      maxVal = maxVal || 1;

      var barH2 = Math.min(30, hChartH / data.length * 0.7);
      var gap2 = (hChartH - barH2 * data.length) / (data.length + 1);

      // Grid
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 0.5;
      var xStep = niceStep(maxVal / options.gridLines);
      ctx.font = '10px var(--font-mono), monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (var xg = 0; xg <= maxVal; xg += xStep) {
        var xx = hMargin.left + (xg / maxVal) * hChartW;
        ctx.beginPath();
        ctx.moveTo(xx, hMargin.top);
        ctx.lineTo(xx, hMargin.top + hChartH);
        ctx.stroke();
        ctx.fillStyle = theme.textMuted;
        ctx.fillText(fmtPrice(xg), xx - 4, hMargin.top + hChartH + 14);
      }

      // Bars
      data.forEach(function (d, i) {
        var y = hMargin.top + gap2 + i * (barH2 + gap2);
        var bw = (d.value / maxVal) * hChartW;
        var color = d.color || barColors[i % barColors.length];

        // Bar with rounded top-right corner
        var grad = ctx.createLinearGradient(hMargin.left, 0, hMargin.left + bw, 0);
        grad.addColorStop(0, hexToRGBA(color, 0.7));
        grad.addColorStop(1, color);
        ctx.fillStyle = grad;
        roundRect(ctx, hMargin.left, y, bw, barH2, 4);
        ctx.fill();

        // Label
        ctx.fillStyle = theme.textSec;
        ctx.font = '12px var(--font-sans), sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.label, hMargin.left - 10, y + barH2 / 2);

        // Value
        if (options.showValues) {
          ctx.fillStyle = theme.text;
          ctx.font = '11px var(--font-mono), monospace';
          ctx.textAlign = 'left';
          ctx.fillText(fmtPrice(d.value), hMargin.left + bw + 8, y + barH2 / 2);
        }
      });
    } else {
      // ── Vertical Bar Chart ──
      var vMargin = { top: 20, right: 10, bottom: 50, left: 10 };
      var vChartW = W - vMargin.left - vMargin.right;
      var vChartH = H - vMargin.top - vMargin.bottom;

      var maxVal2 = Math.max.apply(null, data.map(function (d) { return d.value; }));
      maxVal2 = maxVal2 || 1;

      var barW = Math.min(60, (vChartW / data.length) * 0.6);
      var gap = (vChartW - barW * data.length) / (data.length + 1);

      // Grid
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 0.5;
      var yStep2 = niceStep(maxVal2 / options.gridLines);
      var yStart2 = 0;
      ctx.font = '10px var(--font-mono), monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (var yg = yStart2; yg <= maxVal2; yg += yStep2) {
        var yy = vMargin.top + vChartH - (yg / maxVal2) * vChartH;
        ctx.beginPath();
        ctx.moveTo(vMargin.left, yy);
        ctx.lineTo(W - vMargin.right, yy);
        ctx.stroke();
      }

      // Bars
      data.forEach(function (d, i) {
        var x = vMargin.left + gap + i * (barW + gap);
        var bh = (d.value / maxVal2) * vChartH;
        var by = vMargin.top + vChartH - bh;
        var color = d.color || barColors[i % barColors.length];

        // Bar with gradient
        var grad2 = ctx.createLinearGradient(0, by, 0, vMargin.top + vChartH);
        grad2.addColorStop(0, color);
        grad2.addColorStop(1, hexToRGBA(color, 0.4));
        ctx.fillStyle = grad2;
        roundRect(ctx, x, by, barW, bh, 4);
        ctx.fill();

        // X-axis label
        ctx.fillStyle = theme.textMuted;
        ctx.font = '11px var(--font-sans), sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.label, x + barW / 2, vMargin.top + vChartH + 8);

        // Value on top
        if (options.showValues) {
          ctx.fillStyle = theme.textSec;
          ctx.font = '10px var(--font-mono), monospace';
          ctx.textBaseline = 'bottom';
          ctx.fillText(fmtPrice(d.value), x + barW / 2, by - 4);
        }
      });
    }

    // Hover
    if (canvas._crosshairCleanup) canvas._crosshairCleanup();
    var onMove4 = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx4 = e.clientX - rect.left;
      var my4 = e.clientY - rect.top;

      // Find hovered bar
      var hovered = null;
      if (options.horizontal) {
        var hMargin2 = { top: 10, right: 60, bottom: 10, left: 100 };
        var hChartH2 = H - hMargin2.top - hMargin2.bottom;
        var barH3 = Math.min(30, hChartH2 / data.length * 0.7);
        var gap3 = (hChartH2 - barH3 * data.length) / (data.length + 1);
        data.forEach(function (d, i) {
          var y = hMargin2.top + gap3 + i * (barH3 + gap3);
          if (my4 >= y && my4 <= y + barH3 && mx4 >= hMargin2.left) {
            hovered = d;
          }
        });
      } else {
        var vMargin2 = { top: 20, right: 10, bottom: 50, left: 10 };
        var vChartW2 = W - vMargin2.left - vMargin2.right;
        var vChartH2 = H - vMargin2.top - vMargin2.bottom;
        var barW2 = Math.min(60, (vChartW2 / data.length) * 0.6);
        var gap4 = (vChartW2 - barW2 * data.length) / (data.length + 1);
        data.forEach(function (d, i) {
          var x = vMargin2.left + gap4 + i * (barW2 + gap4);
          if (mx4 >= x && mx4 <= x + barW2) {
            hovered = d;
          }
        });
      }

      if (hovered) {
        showChartTooltip(canvas, mx4, my4, [
          { text: hovered.label, color: hovered.color || defaultBarColor },
          { text: fmtPrice(hovered.value), color: theme.text }
        ], theme);
      } else {
        removeChartTooltip();
      }
    };
    var onLeave4 = function () { removeChartTooltip(); };
    canvas.addEventListener('mousemove', onMove4);
    canvas.addEventListener('mouseleave', onLeave4);
    canvas._crosshairCleanup = function () {
      canvas.removeEventListener('mousemove', onMove4);
      canvas.removeEventListener('mouseleave', onLeave4);
    };

    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderBarChart(canvas, data, options);
      });
    }
  };

  /* ================================================================== */
  /*  RSI CHART (Standalone Panel)                                       */
  /* ================================================================== */

  /**
   * Render a standalone RSI indicator panel.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {number[]} prices — Array of closing prices
   * @param {number} [period=14] — RSI period
   * @param {Object} [options]
   *   - color {string}
   *   - responsive {boolean}
   */
  Charts.renderRSI = function (canvas, prices, period, options) {
    if (!canvas || !prices || prices.length < period + 1) return;

    period = period || 14;
    options = Object.assign({ color: null, responsive: true }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;

    var rsiColor = options.color || theme.purple;
    var rsiData = Utils.calculateRSI(prices, period);

    // Filter to only non-null values
    var validRSI = [];
    for (var i = 0; i < rsiData.length; i++) {
      if (rsiData[i] !== null) validRSI.push({ x: validRSI.length, y: rsiData[i] });
    }
    if (validRSI.length === 0) return;

    var margin = { top: 20, right: 50, bottom: 20, left: 10 };
    var chartW = W - margin.left - margin.right;
    var chartH = H - margin.top - margin.bottom;

    function toX(x) { return margin.left + (x / (validRSI.length - 1)) * chartW; }
    function toY(y) { return margin.top + chartH * (1 - y / 100); }

    // Clear
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    // Overbought/oversold zones
    ctx.fillStyle = 'rgba(244,63,94,0.06)';
    ctx.fillRect(margin.left, toY(100), chartW, toY(70) - toY(100));
    ctx.fillStyle = 'rgba(16,185,129,0.06)';
    ctx.fillRect(margin.left, toY(30), chartW, toY(0) - toY(30));

    // Grid lines at 30, 50, 70
    [30, 50, 70].forEach(function (level) {
      ctx.strokeStyle = level === 50 ? theme.gridStrong : theme.grid;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(margin.left, toY(level));
      ctx.lineTo(W - margin.right, toY(level));
      ctx.stroke();

      ctx.fillStyle = theme.textMuted;
      ctx.font = '10px var(--font-mono), monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(level.toString(), W - margin.right + 8, toY(level));
    });

    // RSI line
    ctx.strokeStyle = rsiColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    validRSI.forEach(function (pt, idx) {
      if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
      else ctx.lineTo(toX(pt.x), toY(pt.y));
    });
    ctx.stroke();

    // Gradient fill under RSI line
    ctx.lineTo(toX(validRSI[validRSI.length - 1].x), toY(50));
    ctx.lineTo(toX(validRSI[0].x), toY(50));
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartH);
    grad.addColorStop(0, hexToRGBA(rsiColor, 0.15));
    grad.addColorStop(0.5, hexToRGBA(rsiColor, 0.0));
    grad.addColorStop(1, hexToRGBA(rsiColor, 0.15));
    ctx.fillStyle = grad;
    ctx.fill();

    // Label
    ctx.fillStyle = rsiColor;
    ctx.font = 'bold 11px var(--font-sans), sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('RSI (' + period + ')', margin.left + 4, margin.top + 4);

    // Current value
    var currentRSI = validRSI[validRSI.length - 1].y;
    ctx.fillStyle = currentRSI > 70 ? theme.red : currentRSI < 30 ? theme.green : theme.textSec;
    ctx.font = 'bold 12px var(--font-mono), monospace';
    ctx.textAlign = 'right';
    ctx.fillText(currentRSI.toFixed(1), W - margin.right, margin.top + 4);

    // Hover
    if (canvas._crosshairCleanup) canvas._crosshairCleanup();
    var onMove5 = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx5 = e.clientX - rect.left;
      var idx3 = Math.round(((mx5 - margin.left) / chartW) * (validRSI.length - 1));
      idx3 = Math.max(0, Math.min(validRSI.length - 1, idx3));
      var pt2 = validRSI[idx3];
      showChartTooltip(canvas, toX(pt2.x), toY(pt2.y), [
        { text: 'RSI: ' + pt2.y.toFixed(1), color: rsiColor }
      ], theme);
    };
    var onLeave5 = function () { removeChartTooltip(); };
    canvas.addEventListener('mousemove', onMove5);
    canvas.addEventListener('mouseleave', onLeave5);
    canvas._crosshairCleanup = function () {
      canvas.removeEventListener('mousemove', onMove5);
      canvas.removeEventListener('mouseleave', onLeave5);
    };

    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderRSI(canvas, prices, period, options);
      });
    }
  };

  /* ================================================================== */
  /*  MACD CHART (Standalone Panel)                                      */
  /* ================================================================== */

  /**
   * Render a standalone MACD indicator panel.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {number[]} prices — Array of closing prices
   * @param {Object} [options]
   *   - responsive {boolean}
   */
  Charts.renderMACD = function (canvas, prices, options) {
    if (!canvas || !prices || prices.length < 35) return; // Need at least 26+9 data points

    options = Object.assign({ responsive: true }, options || {});

    var theme = getTheme();
    var s = setupCanvas(canvas);
    var ctx = s.ctx, W = s.w, H = s.h;

    var macdResult = Utils.calculateMACD(prices);

    // Extract valid data points
    var validData = [];
    for (var i = 0; i < prices.length; i++) {
      if (macdResult.macdLine[i] !== null) {
        validData.push({
          x: validData.length,
          macd: macdResult.macdLine[i],
          signal: macdResult.signalLine[i] || 0,
          histogram: macdResult.histogram[i] || 0
        });
      }
    }
    if (validData.length === 0) return;

    var margin = { top: 20, right: 50, bottom: 20, left: 10 };
    var chartW = W - margin.left - margin.right;
    var chartH = H - margin.top - margin.bottom;

    // Find range
    var allVals = validData.reduce(function (arr, d) {
      arr.push(d.macd, d.signal, d.histogram);
      return arr;
    }, []);
    var minV = Math.min.apply(null, allVals);
    var maxV = Math.max.apply(null, allVals);
    var rangeV = maxV - minV || 1;
    minV -= rangeV * 0.1;
    maxV += rangeV * 0.1;
    rangeV = maxV - minV;

    function toX(x) { return margin.left + (x / (validData.length - 1)) * chartW; }
    function toY(y) { return margin.top + chartH * (1 - (y - minV) / rangeV); }

    // Clear
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W, H);

    // Zero line
    var zeroY = toY(0);
    ctx.strokeStyle = theme.gridStrong;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(W - margin.right, zeroY);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = theme.textMuted;
    ctx.font = '10px var(--font-mono), monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('0', W - margin.right + 8, zeroY);

    var barW = Math.max(1, chartW / validData.length * 0.6);

    // Histogram bars
    validData.forEach(function (d) {
      var x = toX(d.x);
      var y = toY(d.histogram);
      var h = zeroY - y;
      ctx.fillStyle = d.histogram >= 0
        ? 'rgba(16,185,129,0.5)'
        : 'rgba(244,63,94,0.5)';
      ctx.fillRect(x - barW / 2, Math.min(y, zeroY), barW, Math.abs(h));
    });

    // MACD line
    ctx.strokeStyle = theme.blue;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    validData.forEach(function (d, idx) {
      if (idx === 0) ctx.moveTo(toX(d.x), toY(d.macd));
      else ctx.lineTo(toX(d.x), toY(d.macd));
    });
    ctx.stroke();

    // Signal line
    ctx.strokeStyle = theme.amber;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    validData.forEach(function (d, idx) {
      if (d.signal === 0 && idx === 0) return;
      if (idx === 0) ctx.moveTo(toX(d.x), toY(d.signal));
      else ctx.lineTo(toX(d.x), toY(d.signal));
    });
    ctx.stroke();

    // Labels
    ctx.font = 'bold 11px var(--font-sans), sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = theme.blue;
    ctx.fillText('MACD', margin.left + 4, margin.top + 4);

    ctx.fillStyle = theme.amber;
    ctx.fillText('Signal', margin.left + 52, margin.top + 4);

    ctx.fillStyle = theme.textMuted;
    ctx.fillText('Hist', margin.left + 108, margin.top + 4);

    // Current values
    var last = validData[validData.length - 1];
    ctx.font = '10px var(--font-mono), monospace';
    ctx.textAlign = 'right';

    ctx.fillStyle = theme.blue;
    ctx.fillText(last.macd.toFixed(4), W - margin.right, margin.top + 4);
    ctx.fillStyle = theme.amber;
    ctx.fillText(last.signal.toFixed(4), W - margin.right, margin.top + 16);

    // Hover
    if (canvas._crosshairCleanup) canvas._crosshairCleanup();
    var onMove6 = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx6 = e.clientX - rect.left;
      var idx4 = Math.round(((mx6 - margin.left) / chartW) * (validData.length - 1));
      idx4 = Math.max(0, Math.min(validData.length - 1, idx4));
      var pt3 = validData[idx4];
      showChartTooltip(canvas, toX(pt3.x), toY(pt3.macd), [
        { text: 'MACD: ' + pt3.macd.toFixed(4), color: theme.blue },
        { text: 'Signal: ' + pt3.signal.toFixed(4), color: theme.amber },
        { text: 'Hist: ' + pt3.histogram.toFixed(4), color: pt3.histogram >= 0 ? theme.green : theme.red }
      ], theme);
    };
    var onLeave6 = function () { removeChartTooltip(); };
    canvas.addEventListener('mousemove', onMove6);
    canvas.addEventListener('mouseleave', onLeave6);
    canvas._crosshairCleanup = function () {
      canvas.removeEventListener('mousemove', onMove6);
      canvas.removeEventListener('mouseleave', onLeave6);
    };

    if (options.responsive) {
      makeResponsive(canvas, function () {
        Charts.renderMACD(canvas, prices, options);
      });
    }
  };

  /* ================================================================== */
  /*  UTILITY FUNCTIONS                                                  */
  /* ================================================================== */

  /**
   * Calculate a "nice" step size for axis ticks.
   * @param {number} roughStep
   * @returns {number}
   */
  function niceStep(roughStep) {
    if (roughStep <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log10(roughStep)));
    var norm = roughStep / pow;
    var nice;
    if (norm <= 1.5) nice = 1;
    else if (norm <= 3) nice = 2;
    else if (norm <= 7) nice = 5;
    else nice = 10;
    return nice * pow;
  }

  /**
   * Convert hex color to rgba string.
   * @param {string} hex
   * @param {number} alpha
   * @returns {string}
   */
  function hexToRGBA(hex, alpha) {
    if (!hex) return 'rgba(59,130,246,' + alpha + ')';
    // Handle rgb/rgba strings
    if (hex.startsWith('rgb')) {
      return hex.replace(/[\d.]+\)$/, alpha + ')');
    }
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  /**
   * Draw a rounded rectangle path.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {number} r — border radius
   */
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * Clean up all chart resources (event listeners, observers, tooltips).
   * @param {HTMLCanvasElement} canvas
   */
  Charts.destroy = function (canvas) {
    if (!canvas) return;
    if (canvas._crosshairCleanup) {
      canvas._crosshairCleanup();
      canvas._crosshairCleanup = null;
    }
    if (canvas._resizeObserver) {
      canvas._resizeObserver.disconnect();
      canvas._resizeObserver = null;
    }
    if (canvas._overlayCanvas && canvas._overlayCanvas.parentNode) {
      canvas._overlayCanvas.parentNode.removeChild(canvas._overlayCanvas);
      canvas._overlayCanvas = null;
    }
    removeChartTooltip();
  };

  /* ================================================================== */
  /*  EXPOSE                                                             */
  /* ================================================================== */

  window.Charts = Charts;

})();