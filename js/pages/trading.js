/**
 * CryptoVerse Academy — Trading Simulator Page
 * ==============================================
 * Full-featured trading simulator with live market data, candlestick
 * charts, order placement, portfolio tracking, and AI analysis.
 *
 * Dependencies: window.Store, window.MarketEngine, window.Charts,
 *               window.Utils, window.UI, window.DataMarket
 */
window.Pages = window.Pages || {};

window.Pages.trading = function () {
  'use strict';

  var ASSET_IDS = ['btc', 'eth', 'sol', 'xrp', 'doge', 'ada'];
  var TIMEFRAMES = ['1m', '5m', '15m', '1h', '1D'];

  /* ───────────────────────────────────────────────────────────────────
     HELPERS (page-local)
     ─────────────────────────────────────────────────────────────────── */
  function fmtPrice(p) {
    if (p == null || isNaN(p)) return '$0.00';
    if (p >= 1) return window.Utils.formatCurrency(p, 2);
    if (p >= 0.01) return window.Utils.formatCurrency(p, 4);
    return window.Utils.formatCurrency(p, 6);
  }

  function fmtPct(n) { return window.Utils.formatPercent(n, true); }

  function fmtQty(q) {
    if (q >= 1000) return window.Utils.formatNumber(q, 2);
    if (q >= 1) return window.Utils.formatNumber(q, 4);
    return window.Utils.formatNumber(q, 8);
  }

  function getAssetMeta(id) {
    if (window.DataMarket) return window.DataMarket.getAsset(id) || {};
    var defaults = {
      btc: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: '#F7931A' },
      eth: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: '#627EEA' },
      sol: { name: 'Solana', symbol: 'SOL', icon: '◎', color: '#9945FF' },
      xrp: { name: 'XRP', symbol: 'XRP', icon: '✕', color: '#00AAE4' },
      doge: { name: 'Dogecoin', symbol: 'DOGE', icon: 'Ð', color: '#C2A633' },
      ada: { name: 'Cardano', symbol: 'ADA', icon: '₳', color: '#0033AD' }
    };
    return defaults[id] || {};
  }

  function starSvg(filled) {
    var fill = filled ? 'currentColor' : 'none';
    var sw = filled ? '0' : '2';
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + fill + '" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  }

  function chevronSvg() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  }

  /* ───────────────────────────────────────────────────────────────────
     BUILD HTML
     ─────────────────────────────────────────────────────────────────── */

  // ── Asset sidebar items ──
  var assetListHtml = ASSET_IDS.map(function (id) {
    var m = getAssetMeta(id);
    return '<div class="asset-item" data-action="select-asset" data-id="' + id + '">' +
      '<div class="asset-item-icon" style="color:' + (m.color || 'var(--accent-blue)') + '">' + (m.icon || '?') + '</div>' +
      '<div class="asset-item-info">' +
        '<div class="asset-item-name">' + (m.name || id) + ' <span class="asset-item-symbol">' + (m.symbol || id.toUpperCase()) + '</span></div>' +
        '<div class="asset-item-price" id="sidebar-price-' + id + '">--</div>' +
      '</div>' +
      '<div class="asset-item-right">' +
        '<span class="asset-item-change" id="sidebar-change-' + id + '">--</span>' +
        '<button class="watchlist-btn" data-action="toggle-watchlist" data-id="' + id + '" title="Toggle watchlist">' + starSvg(false) + '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  // ── Timeframe buttons ──
  var tfBtns = TIMEFRAMES.map(function (tf) {
    var active = tf === '5m' ? ' active' : '';
    return '<button class="timeframe-btn' + active + '" data-action="set-timeframe" data-value="' + tf + '">' + tf + '</button>';
  }).join('');

  // ── Chart type buttons ──
  var chartTypeHtml =
    '<div class="chart-type-toggle">' +
      '<button class="chart-type-btn active" data-action="set-chart-type" data-value="candlestick">Candlestick</button>' +
      '<button class="chart-type-btn" data-action="set-chart-type" data-value="line">Line</button>' +
    '</div>';

  // ── Indicator toggles ──
  var indicatorBtns =
    '<div class="indicator-toggles">' +
      '<button class="indicator-btn" data-action="toggle-indicator" data-value="ma">MA</button>' +
      '<button class="indicator-btn" data-action="toggle-indicator" data-value="rsi">RSI</button>' +
      '<button class="indicator-btn" data-action="toggle-indicator" data-value="macd">MACD</button>' +
    '</div>';

  // ── Trading panel HTML ──
  var tradingPanelHtml =
    '<div class="trading-panel">' +
      '<div class="order-tabs">' +
        '<button class="order-tab active" data-action="switch-order-side" data-value="buy">Buy</button>' +
        '<button class="order-tab" data-action="switch-order-side" data-value="sell">Sell</button>' +
      '</div>' +
      '<div class="order-asset-info">' +
        '<span id="order-asset-name" style="font-weight:600;">Bitcoin (BTC)</span>' +
        '<span id="order-asset-price" style="font-family:var(--font-mono);color:var(--text-secondary);">--</span>' +
      '</div>' +
      '<div class="order-type-toggle">' +
        '<button class="order-type-btn active" data-action="switch-order-type" data-value="market">Market</button>' +
        '<button class="order-type-btn" data-action="switch-order-type" data-value="limit">Limit</button>' +
      '</div>' +
      '<div class="order-form">' +
        '<div class="form-group" id="limit-price-group" style="display:none;">' +
          '<label>Limit Price (USD)</label>' +
          '<input type="number" id="limit-price-input" class="form-input" placeholder="0.00" step="any" min="0">' +
        '</div>' +
        '<div class="form-group">' +
          '<label id="amount-label">Amount (USD)</label>' +
          '<input type="number" id="order-amount-input" class="form-input" placeholder="0.00" step="any" min="0">' +
        '</div>' +
        '<div class="quick-amount-row">' +
          '<button class="quick-amount-btn" data-action="set-quick-amount" data-value="25">25%</button>' +
          '<button class="quick-amount-btn" data-action="set-quick-amount" data-value="50">50%</button>' +
          '<button class="quick-amount-btn" data-action="set-quick-amount" data-value="75">75%</button>' +
          '<button class="quick-amount-btn" data-action="set-quick-amount" data-value="100">100%</button>' +
        '</div>' +
        '<div class="order-estimate" id="order-estimate">--</div>' +
        '<div class="order-balance-info">' +
          '<div class="balance-line"><span>Available Balance</span><span id="order-balance">--</span></div>' +
          '<div class="balance-line"><span>Holdings</span><span id="order-holdings">--</span></div>' +
        '</div>' +
        '<button class="order-submit-btn buy" id="order-submit-btn" data-action="place-order" data-type="buy">Buy BTC</button>' +
      '</div>' +
    '</div>';

  // ── Bottom panel tab buttons ──
  var bottomTabBtns =
    '<div class="bottom-tab-bar">' +
      '<button class="bottom-tab active" data-action="switch-tab" data-tab="portfolio">Portfolio</button>' +
      '<button class="bottom-tab" data-action="switch-tab" data-tab="watchlist">Watchlist</button>' +
      '<button class="bottom-tab" data-action="switch-tab" data-tab="history">Transactions</button>' +
      '<button class="bottom-tab" data-action="switch-tab" data-tab="analysis">AI Analysis</button>' +
    '</div>';

  // ── Portfolio panel ──
  var portfolioPanelHtml =
    '<div class="bottom-panel-content" id="panel-portfolio">' +
      '<div class="portfolio-grid">' +
        '<div class="portfolio-pie-section">' +
          '<h4 class="panel-subtitle">Asset Allocation</h4>' +
          '<div class="pie-chart-wrap"><canvas id="portfolio-pie" width="260" height="260"></canvas></div>' +
        '</div>' +
        '<div class="portfolio-table-section">' +
          '<h4 class="panel-subtitle">Holdings</h4>' +
          '<div class="table-wrap"><table class="data-table" id="holdings-table">' +
            '<thead><tr><th>Asset</th><th>Amount</th><th>Avg Price</th><th>Value</th><th>P/L</th><th>P/L %</th></tr></thead>' +
            '<tbody id="holdings-body"></tbody>' +
          '</table></div>' +
          '<div id="portfolio-empty" class="empty-state" style="display:none;">' +
            '<p>No assets in portfolio yet. Start trading!</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="portfolio-summary" id="portfolio-summary">' +
        '<div class="summary-item"><span>Total Value</span><span id="portfolio-total-value">--</span></div>' +
        '<div class="summary-item"><span>Total Invested</span><span id="portfolio-total-invested">--</span></div>' +
        '<div class="summary-item"><span>Total Return</span><span id="portfolio-total-return">--</span></div>' +
        '<div class="summary-item"><span>Assets Held</span><span id="portfolio-asset-count">0</span></div>' +
      '</div>' +
    '</div>';

  // ── Watchlist panel ──
  var watchlistPanelHtml =
    '<div class="bottom-panel-content" id="panel-watchlist" style="display:none;">' +
      '<div class="table-wrap"><table class="data-table" id="watchlist-table">' +
        '<thead><tr><th>Asset</th><th>Price</th><th>24h Change</th><th>Action</th></tr></thead>' +
        '<tbody id="watchlist-body"></tbody>' +
      '</table></div>' +
      '<div id="watchlist-empty" class="empty-state">' +
        '<p>No assets on your watchlist. Click the star icon next to any asset to add it.</p>' +
      '</div>' +
    '</div>';

  // ── Transaction history panel ──
  var historyPanelHtml =
    '<div class="bottom-panel-content" id="panel-history" style="display:none;">' +
      '<div class="table-wrap"><table class="data-table" id="history-table">' +
        '<thead><tr><th>Date</th><th>Type</th><th>Asset</th><th>Amount</th><th>Price</th><th>Total</th></tr></thead>' +
        '<tbody id="history-body"></tbody>' +
      '</table></div>' +
      '<div id="history-pagination"></div>' +
      '<div id="history-empty" class="empty-state">' +
        '<p>No transactions yet. Place your first trade to see it here!</p>' +
      '</div>' +
    '</div>';

  // ── AI Analysis panel ──
  var analysisPanelHtml =
    '<div class="bottom-panel-content" id="panel-analysis" style="display:none;">' +
      '<div class="analysis-grid" id="analysis-grid">' +
        '<div class="analysis-card"><div class="analysis-label">Trend</div><div class="analysis-value" id="ai-trend">--</div></div>' +
        '<div class="analysis-card"><div class="analysis-label">Momentum</div><div class="analysis-value" id="ai-momentum">--</div></div>' +
        '<div class="analysis-card"><div class="analysis-label">Volatility</div><div class="analysis-value" id="ai-volatility">--</div></div>' +
        '<div class="analysis-card"><div class="analysis-label">Market Phase</div><div class="analysis-value" id="ai-phase">--</div></div>' +
      '</div>' +
      '<div class="analysis-row">' +
        '<div class="analysis-card analysis-wide">' +
          '<div class="analysis-label">Support &amp; Resistance</div>' +
          '<div class="sr-levels" id="ai-sr-levels">' +
            '<div class="sr-row"><span class="sr-label resistance">Resistance</span><span class="sr-value" id="ai-resistance">--</span></div>' +
            '<div class="sr-row"><span class="sr-label support">Support</span><span class="sr-value" id="ai-support">--</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="analysis-card analysis-wide">' +
          '<div class="analysis-label">Market Sentiment (Fear / Greed)</div>' +
          '<div class="sentiment-meter" id="ai-sentiment-meter">' +
            '<div class="sentiment-bar"><div class="sentiment-fill" id="ai-sentiment-fill"></div></div>' +
            '<div class="sentiment-labels"><span>Extreme Fear</span><span>Neutral</span><span>Extreme Greed</span></div>' +
            '<div class="sentiment-value" id="ai-sentiment-value">--</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="analysis-row">' +
        '<div class="analysis-card">' +
          '<div class="analysis-label">Confidence (0-100)</div>' +
          '<div class="gauge-meter" id="ai-confidence-gauge">' +
            '<div class="gauge-track"><div class="gauge-fill" id="ai-confidence-fill"></div></div>' +
            '<span class="gauge-value" id="ai-confidence-value">--</span>' +
          '</div>' +
        '</div>' +
        '<div class="analysis-card">' +
          '<div class="analysis-label">Risk Level (0-10)</div>' +
          '<div class="gauge-meter gauge-risk" id="ai-risk-gauge">' +
            '<div class="gauge-track"><div class="gauge-fill" id="ai-risk-fill"></div></div>' +
            '<span class="gauge-value" id="ai-risk-value">--</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="analysis-card analysis-full">' +
        '<div class="analysis-label">Analysis Summary</div>' +
        '<p class="analysis-text" id="ai-summary">Select an asset and wait for market data to generate analysis.</p>' +
      '</div>' +
      '<p class="analysis-disclaimer">This is simulated analysis for educational purposes only. Not financial advice.</p>' +
    '</div>';

  /* ══════════════════════════════════════════════════════════════════
     FULL HTML
     ══════════════════════════════════════════════════════════════════ */
  var html = '' +
  '<style>' + TRADING_CSS + '</style>' +

  '<div class="trading-page" id="trading-page">' +

    /* ── TOP BAR ── */
    '<div class="trading-top-bar">' +
      '<div class="top-bar-inner">' +
        '<div class="top-stat"><span class="top-stat-label">Total Value</span><span class="top-stat-value" id="top-total-value">$10,000.00</span></div>' +
        '<div class="top-stat"><span class="top-stat-label">Available Balance</span><span class="top-stat-value" id="top-balance">$10,000.00</span></div>' +
        '<div class="top-stat"><span class="top-stat-label">Daily P/L</span><span class="top-stat-value" id="top-daily-pl">$0.00</span></div>' +
        '<div class="top-stat"><span class="top-stat-label">Total P/L</span><span class="top-stat-value" id="top-total-pl">$0.00</span></div>' +
        '<div class="top-stat top-stat-phase"><span class="top-stat-label">Market Phase</span><span class="top-stat-value" id="top-phase">--</span></div>' +
      '</div>' +
    '</div>' +

    /* ── MAIN LAYOUT ── */
    '<div class="trading-layout">' +

      /* ── SIDEBAR ── */
      '<aside class="asset-sidebar" id="asset-sidebar">' +
        '<div class="sidebar-header">' +
          '<span class="sidebar-title">Assets</span>' +
          '<button class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle sidebar">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="asset-list" id="asset-list">' + assetListHtml + '</div>' +
      '</aside>' +

      /* ── MAIN CONTENT ── */
      '<main class="trading-main">' +

        /* Chart + Trading Row */
        '<div class="chart-trading-row">' +

          /* Chart Area */
          '<div class="chart-area">' +
            '<div class="chart-header">' +
              '<div class="chart-header-left">' +
                '<span class="chart-asset-name" id="chart-asset-name">Bitcoin (BTC)</span>' +
                '<span class="chart-asset-price" id="chart-asset-price">--</span>' +
                '<span class="chart-asset-change" id="chart-asset-change">--</span>' +
              '</div>' +
              '<div class="chart-header-right">' +
                chartTypeHtml +
              '</div>' +
            '</div>' +
            '<div class="chart-controls">' +
              '<div class="timeframe-group">' + tfBtns + '</div>' +
              indicatorBtns +
            '</div>' +
            '<div class="chart-canvas-wrap"><canvas id="trading-chart" width="900" height="420"></canvas></div>' +
            '<div class="indicator-info" id="indicator-info" style="display:none;">' +
              '<span class="ind-tag ma" id="ind-ma">MA(20): --</span>' +
              '<span class="ind-tag rsi" id="ind-rsi">RSI(14): --</span>' +
              '<span class="ind-tag macd" id="ind-macd">MACD: --</span>' +
            '</div>' +
          '</div>' +

          /* Trading Panel */
          tradingPanelHtml +

        '</div>' +

        /* ── BOTTOM PANEL ── */
        '<div class="bottom-panel">' +
          bottomTabBtns +
          portfolioPanelHtml +
          watchlistPanelHtml +
          historyPanelHtml +
          analysisPanelHtml +
        '</div>' +

      '</main>' +

    '</div>' +

  '</div>' +

  '<script>' + TRADING_JS + '</script>';

  return html;
};


/* ══════════════════════════════════════════════════════════════════════
   INLINE STYLES
   ══════════════════════════════════════════════════════════════════════ */
var TRADING_CSS = [
  '/* ── Layout ── */',
  '.trading-page { display:flex; flex-direction:column; min-height:calc(100vh - var(--navbar-height)); padding-top:var(--navbar-height); background:var(--bg-primary); }',
  '.trading-layout { display:grid; grid-template-columns:260px 1fr; flex:1; overflow:hidden; }',

  '/* ── Top Bar ── */',
  '.trading-top-bar { background:var(--bg-secondary); border-bottom:1px solid var(--border-primary); padding:var(--space-3) var(--space-6); position:sticky; top:var(--navbar-height); z-index:var(--z-sticky); }',
  '.top-bar-inner { display:flex; gap:var(--space-8); align-items:center; justify-content:space-between; max-width:1600px; margin:0 auto; }',
  '.top-stat { display:flex; flex-direction:column; gap:2px; }',
  '.top-stat-label { font-size:var(--text-xs); color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; }',
  '.top-stat-value { font-size:var(--text-sm); font-weight:600; font-family:var(--font-mono); color:var(--text-primary); }',
  '.top-stat-phase .top-stat-value { font-size:var(--text-xs); color:var(--accent-cyan); }',

  '/* ── Sidebar ── */',
  '.asset-sidebar { background:var(--bg-secondary); border-right:1px solid var(--border-primary); display:flex; flex-direction:column; overflow:hidden; transition:width var(--transition-base); }',
  '.asset-sidebar.collapsed { width:0; border:none; }',
  '.asset-sidebar.collapsed .sidebar-header, .asset-sidebar.collapsed .asset-list { display:none; }',
  '.sidebar-header { display:flex; align-items:center; justify-content:space-between; padding:var(--space-4) var(--space-4) var(--space-2); }',
  '.sidebar-title { font-size:var(--text-sm); font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; }',
  '.sidebar-toggle-btn { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:4px; border-radius:var(--radius-sm); display:none; transition:color var(--transition-fast); }',
  '.sidebar-toggle-btn:hover { color:var(--text-primary); }',
  '.asset-list { flex:1; overflow-y:auto; padding:0 var(--space-2) var(--space-4); }',
  '.asset-list::-webkit-scrollbar { width:4px; }',
  '.asset-list::-webkit-scrollbar-thumb { background:var(--border-primary); border-radius:2px; }',

  '/* ── Asset Item ── */',
  '.asset-item { display:flex; align-items:center; gap:var(--space-3); padding:var(--space-3); border-radius:var(--radius-md); cursor:pointer; transition:all var(--transition-fast); border:1px solid transparent; margin-bottom:2px; }',
  '.asset-item:hover { background:var(--bg-tertiary); }',
  '.asset-item.active { background:var(--bg-tertiary); border-color:var(--accent-blue); box-shadow:inset 0 0 0 1px var(--accent-blue); }',
  '.asset-item-icon { width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:1.25rem; font-weight:700; border-radius:var(--radius-full); background:rgba(255,255,255,0.05); flex-shrink:0; }',
  '.asset-item-info { flex:1; min-width:0; }',
  '.asset-item-name { font-size:var(--text-sm); font-weight:500; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
  '.asset-item-symbol { color:var(--text-muted); font-weight:400; margin-left:4px; }',
  '.asset-item-price { font-size:var(--text-xs); font-family:var(--font-mono); color:var(--text-secondary); }',
  '.asset-item-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }',
  '.asset-item-change { font-size:var(--text-xs); font-weight:600; font-family:var(--font-mono); }',
  '.asset-item-change.up { color:var(--green); }',
  '.asset-item-change.down { color:var(--red); }',
  '.watchlist-btn { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:2px; line-height:1; transition:color var(--transition-fast); }',
  '.watchlist-btn:hover, .watchlist-btn.active { color:var(--accent-amber); }',

  '/* ── Main Content ── */',
  '.trading-main { display:flex; flex-direction:column; overflow-y:auto; overflow-x:hidden; }',
  '.chart-trading-row { display:grid; grid-template-columns:1fr 320px; gap:0; border-bottom:1px solid var(--border-primary); }',

  '/* ── Chart Area ── */',
  '.chart-area { display:flex; flex-direction:column; min-width:0; }',
  '.chart-header { display:flex; justify-content:space-between; align-items:center; padding:var(--space-4) var(--space-5) 0; flex-wrap:wrap; gap:var(--space-3); }',
  '.chart-header-left { display:flex; align-items:center; gap:var(--space-4); flex-wrap:wrap; }',
  '.chart-asset-name { font-size:var(--text-lg); font-weight:700; color:var(--text-primary); }',
  '.chart-asset-price { font-size:var(--text-xl); font-weight:700; font-family:var(--font-mono); color:var(--text-primary); }',
  '.chart-asset-change { font-size:var(--text-sm); font-weight:600; font-family:var(--font-mono); padding:2px 8px; border-radius:var(--radius-sm); }',
  '.chart-asset-change.up { color:var(--green); background:var(--green-bg); }',
  '.chart-asset-change.down { color:var(--red); background:var(--red-bg); }',
  '.chart-header-right { display:flex; align-items:center; gap:var(--space-3); }',

  '/* Chart type toggle */',
  '.chart-type-toggle { display:flex; background:var(--bg-tertiary); border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-primary); }',
  '.chart-type-btn { background:none; border:none; color:var(--text-muted); font-size:var(--text-xs); font-weight:500; padding:6px 14px; cursor:pointer; transition:all var(--transition-fast); }',
  '.chart-type-btn.active { background:var(--accent-blue); color:#fff; }',

  '/* Chart controls bar */',
  '.chart-controls { display:flex; align-items:center; justify-content:space-between; padding:var(--space-3) var(--space-5); gap:var(--space-3); flex-wrap:wrap; }',
  '.timeframe-group { display:flex; gap:2px; background:var(--bg-tertiary); border-radius:var(--radius-md); padding:2px; border:1px solid var(--border-primary); }',
  '.timeframe-btn { background:none; border:none; color:var(--text-muted); font-size:var(--text-xs); font-weight:600; padding:5px 12px; cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition-fast); font-family:var(--font-mono); }',
  '.timeframe-btn.active { background:var(--accent-blue); color:#fff; }',
  '.timeframe-btn:hover:not(.active) { color:var(--text-primary); }',
  '.indicator-toggles { display:flex; gap:4px; }',
  '.indicator-btn { background:var(--bg-tertiary); border:1px solid var(--border-primary); color:var(--text-muted); font-size:var(--text-xs); font-weight:600; padding:5px 12px; cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition-fast); font-family:var(--font-mono); }',
  '.indicator-btn.active { background:var(--accent-purple); color:#fff; border-color:var(--accent-purple); }',
  '.indicator-btn:hover:not(.active) { color:var(--text-primary); border-color:var(--text-muted); }',

  '/* Chart canvas */',
  '.chart-canvas-wrap { flex:1; padding:0 var(--space-5); min-height:300px; }',
  '#trading-chart { width:100%; height:100%; border-radius:var(--radius-lg); }',

  '/* Indicator info bar */',
  '.indicator-info { display:flex; gap:var(--space-4); padding:var(--space-2) var(--space-5) var(--space-4); flex-wrap:wrap; }',
  '.ind-tag { font-size:var(--text-xs); font-family:var(--font-mono); color:var(--text-muted); background:var(--bg-tertiary); padding:4px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-primary); }',
  '.ind-tag.ma { border-left:3px solid var(--accent-amber); }',
  '.ind-tag.rsi { border-left:3px solid var(--accent-purple); }',
  '.ind-tag.macd { border-left:3px solid var(--accent-cyan); }',

  '/* ── Trading Panel ── */',
  '.trading-panel { background:var(--bg-secondary); border-left:1px solid var(--border-primary); padding:var(--space-5); display:flex; flex-direction:column; gap:var(--space-4); overflow-y:auto; }',
  '.order-tabs { display:flex; background:var(--bg-tertiary); border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-primary); }',
  '.order-tab { flex:1; padding:10px; background:none; border:none; font-size:var(--text-sm); font-weight:600; cursor:pointer; color:var(--text-muted); transition:all var(--transition-fast); }',
  '.order-tab.active[data-value="buy"] { background:var(--green); color:#fff; }',
  '.order-tab.active[data-value="sell"] { background:var(--red); color:#fff; }',
  '.order-asset-info { display:flex; justify-content:space-between; align-items:center; padding-bottom:var(--space-3); border-bottom:1px solid var(--border-secondary); }',
  '.order-type-toggle { display:flex; background:var(--bg-tertiary); border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-primary); }',
  '.order-type-btn { flex:1; padding:7px; background:none; border:none; font-size:var(--text-xs); font-weight:600; cursor:pointer; color:var(--text-muted); transition:all var(--transition-fast); }',
  '.order-type-btn.active { background:var(--accent-blue); color:#fff; }',
  '.order-form { display:flex; flex-direction:column; gap:var(--space-4); flex:1; }',
  '.form-group { display:flex; flex-direction:column; gap:4px; }',
  '.form-group label { font-size:var(--text-xs); color:var(--text-muted); font-weight:500; text-transform:uppercase; letter-spacing:0.03em; }',
  '.form-input { background:var(--bg-input); border:1px solid var(--border-primary); color:var(--text-primary); font-size:var(--text-sm); font-family:var(--font-mono); padding:10px 12px; border-radius:var(--radius-md); outline:none; transition:border-color var(--transition-fast); width:100%; box-sizing:border-box; }',
  '.form-input:focus { border-color:var(--accent-blue); }',
  '.form-input::placeholder { color:var(--text-muted); }',
  '.quick-amount-row { display:flex; gap:4px; }',
  '.quick-amount-btn { flex:1; padding:6px; background:var(--bg-tertiary); border:1px solid var(--border-primary); color:var(--text-secondary); font-size:var(--text-xs); font-weight:600; cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition-fast); }',
  '.quick-amount-btn:hover { border-color:var(--accent-blue); color:var(--accent-blue); }',
  '.order-estimate { font-size:var(--text-xs); color:var(--text-muted); font-family:var(--font-mono); min-height:18px; }',
  '.order-balance-info { display:flex; flex-direction:column; gap:6px; padding:var(--space-3); background:var(--bg-tertiary); border-radius:var(--radius-md); }',
  '.balance-line { display:flex; justify-content:space-between; font-size:var(--text-xs); }',
  '.balance-line span:first-child { color:var(--text-muted); }',
  '.balance-line span:last-child { color:var(--text-secondary); font-family:var(--font-mono); font-weight:500; }',
  '.order-submit-btn { width:100%; padding:14px; border:none; border-radius:var(--radius-lg); font-size:var(--text-base); font-weight:700; cursor:pointer; transition:all var(--transition-fast); text-transform:uppercase; letter-spacing:0.05em; margin-top:auto; }',
  '.order-submit-btn.buy { background:var(--green); color:#fff; }',
  '.order-submit-btn.buy:hover { background:var(--green-light); box-shadow:var(--shadow-glow-green); }',
  '.order-submit-btn.sell { background:var(--red); color:#fff; }',
  '.order-submit-btn.sell:hover { background:var(--red-light); box-shadow:var(--shadow-glow-red); }',

  '/* ── Bottom Panel ── */',
  '.bottom-panel { background:var(--bg-secondary); flex:1; display:flex; flex-direction:column; min-height:0; }',
  '.bottom-tab-bar { display:flex; border-bottom:1px solid var(--border-primary); padding:0 var(--space-5); }',
  '.bottom-tab { padding:var(--space-3) var(--space-5); background:none; border:none; border-bottom:2px solid transparent; color:var(--text-muted); font-size:var(--text-sm); font-weight:500; cursor:pointer; transition:all var(--transition-fast); }',
  '.bottom-tab.active { color:var(--accent-blue); border-bottom-color:var(--accent-blue); }',
  '.bottom-tab:hover:not(.active) { color:var(--text-secondary); }',
  '.bottom-panel-content { flex:1; padding:var(--space-5); overflow-y:auto; }',

  '/* ── Portfolio Grid ── */',
  '.portfolio-grid { display:grid; grid-template-columns:280px 1fr; gap:var(--space-6); margin-bottom:var(--space-5); }',
  '.pie-chart-wrap { display:flex; align-items:center; justify-content:center; }',
  '.panel-subtitle { font-size:var(--text-sm); font-weight:600; color:var(--text-secondary); margin-bottom:var(--space-4); }',

  '/* ── Data Table ── */',
  '.table-wrap { overflow-x:auto; }',
  '.data-table { width:100%; border-collapse:collapse; font-size:var(--text-xs); }',
  '.data-table th { text-align:left; padding:var(--space-2) var(--space-3); color:var(--text-muted); font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:0.05em; border-bottom:1px solid var(--border-primary); white-space:nowrap; }',
  '.data-table td { padding:var(--space-2) var(--space-3); color:var(--text-secondary); font-family:var(--font-mono); border-bottom:1px solid var(--border-secondary); white-space:nowrap; }',
  '.data-table tr:hover td { background:var(--bg-tertiary); }',
  '.data-table .asset-name-cell { display:flex; align-items:center; gap:var(--space-2); color:var(--text-primary); font-weight:500; font-family:var(--font-sans); }',
  '.data-table .pl-positive { color:var(--green); }',
  '.data-table .pl-negative { color:var(--red); }',
  '.empty-state { text-align:center; padding:var(--space-12) var(--space-4); color:var(--text-muted); font-size:var(--text-sm); }',

  '/* ── Portfolio Summary ── */',
  '.portfolio-summary { display:flex; gap:var(--space-6); padding:var(--space-4); background:var(--bg-tertiary); border-radius:var(--radius-lg); border:1px solid var(--border-primary); flex-wrap:wrap; }',
  '.summary-item { display:flex; flex-direction:column; gap:2px; }',
  '.summary-item span:first-child { font-size:var(--text-xs); color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em; }',
  '.summary-item span:last-child { font-size:var(--text-sm); font-weight:700; font-family:var(--font-mono); color:var(--text-primary); }',

  '/* ── Analysis Grid ── */',
  '.analysis-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--space-4); margin-bottom:var(--space-4); }',
  '.analysis-row { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); margin-bottom:var(--space-4); }',
  '.analysis-card { background:var(--bg-tertiary); border:1px solid var(--border-primary); border-radius:var(--radius-lg); padding:var(--space-4); }',
  '.analysis-card.analysis-wide, .analysis-card.analysis-full { grid-column:span 1; }',
  '.analysis-card.analysis-full { grid-column:1 / -1; margin-top:var(--space-4); }',
  '.analysis-label { font-size:var(--text-xs); color:var(--text-muted); margin-bottom:var(--space-2); text-transform:uppercase; letter-spacing:0.03em; }',
  '.analysis-value { font-size:var(--text-lg); font-weight:700; color:var(--text-primary); }',

  '/* ── Sentiment Meter ── */',
  '.sentiment-meter { margin-top:var(--space-2); }',
  '.sentiment-bar { height:12px; border-radius:6px; background:linear-gradient(90deg, var(--red) 0%, var(--accent-amber) 50%, var(--green) 100%); position:relative; overflow:visible; }',
  '.sentiment-fill { position:absolute; top:-4px; width:4px; height:20px; background:#fff; border-radius:2px; left:50%; transform:translateX(-50%); transition:left 0.5s ease; box-shadow:0 0 8px rgba(255,255,255,0.5); }',
  '.sentiment-labels { display:flex; justify-content:space-between; margin-top:6px; font-size:10px; color:var(--text-muted); }',
  '.sentiment-value { text-align:center; margin-top:var(--space-2); font-size:var(--text-sm); font-weight:700; font-family:var(--font-mono); color:var(--text-primary); }',

  '/* ── Gauge Meter ── */',
  '.gauge-meter { margin-top:var(--space-2); display:flex; align-items:center; gap:var(--space-3); }',
  '.gauge-track { flex:1; height:10px; background:var(--bg-primary); border-radius:5px; overflow:hidden; }',
  '.gauge-fill { height:100%; border-radius:5px; background:var(--gradient-primary); transition:width 0.5s ease; width:0; }',
  '.gauge-risk .gauge-fill { background:linear-gradient(90deg, var(--green), var(--accent-amber), var(--red)); }',
  '.gauge-value { font-size:var(--text-lg); font-weight:700; font-family:var(--font-mono); color:var(--text-primary); min-width:40px; text-align:right; }',

  '/* ── Support/Resistance ── */',
  '.sr-levels { display:flex; flex-direction:column; gap:var(--space-2); margin-top:var(--space-2); }',
  '.sr-row { display:flex; justify-content:space-between; align-items:center; }',
  '.sr-label { font-size:var(--text-xs); font-weight:600; padding:3px 10px; border-radius:var(--radius-sm); }',
  '.sr-label.resistance { color:var(--red); background:var(--red-bg); }',
  '.sr-label.support { color:var(--green); background:var(--green-bg); }',
  '.sr-value { font-family:var(--font-mono); font-weight:600; color:var(--text-primary); }',

  '/* ── Analysis text ── */',
  '.analysis-text { font-size:var(--text-sm); color:var(--text-secondary); line-height:var(--leading-relaxed); margin-top:var(--space-3); }',
  '.analysis-disclaimer { font-size:var(--text-xs); color:var(--text-muted); text-align:center; margin-top:var(--space-6); padding:var(--space-3); border-top:1px solid var(--border-secondary); font-style:italic; }',

  '/* ── Pagination ── */',
  '#history-pagination { display:flex; justify-content:center; margin-top:var(--space-4); }',

  '/* ── Responsive ── */',
  '@media (max-width:1024px) {',
  '  .chart-trading-row { grid-template-columns:1fr; }',
  '  .trading-panel { border-left:none; border-top:1px solid var(--border-primary); }',
  '  .portfolio-grid { grid-template-columns:1fr; }',
  '  .analysis-grid { grid-template-columns:repeat(2, 1fr); }',
  '  .sidebar-toggle-btn { display:block; }',
  '  .asset-sidebar.collapsed + .trading-main { margin-left:0; }',
  '}',
  '@media (max-width:768px) {',
  '  .trading-layout { grid-template-columns:1fr; }',
  '  .asset-sidebar { position:fixed; top:var(--navbar-height); left:0; bottom:0; width:280px; z-index:var(--z-sidebar); transform:translateX(0); transition:transform var(--transition-base); }',
  '  .asset-sidebar.collapsed { transform:translateX(-100%); width:280px; }',
  '  .sidebar-toggle-btn { display:block; }',
  '  .top-bar-inner { gap:var(--space-4); flex-wrap:wrap; }',
  '  .top-stat { min-width:100px; }',
  '  .analysis-grid, .analysis-row { grid-template-columns:1fr; }',
  '  .analysis-card.analysis-wide, .analysis-card.analysis-full { grid-column:span 1; }',
  '  .portfolio-summary { flex-direction:column; gap:var(--space-3); }',
  '}',
  '@media (max-width:480px) {',
  '  .chart-controls { flex-direction:column; align-items:flex-start; }',
  '  .analysis-grid { grid-template-columns:1fr; }',
  '}'
].join('\n');


/* ══════════════════════════════════════════════════════════════════════
   INLINE JAVASCRIPT — Trading Page Controller
   ══════════════════════════════════════════════════════════════════════ */
var TRADING_JS = [
'(function() {',
'  "use strict";',
'  var S = window.Store, ME = window.MarketEngine, C = window.Charts, U = window.Utils, UI = window.UI;',
'  if (!S || !ME || !C || !U || !UI) { console.warn("[Trading] Missing dependencies"); return; }',

'  /* ── State ── */',
'  var selectedAsset = "btc";',
'  var timeframe = "5m";',
'  var chartType = "candlestick";',
'  var orderSide = "buy";',
'  var orderType = "market";',
'  var indicators = { ma: false, rsi: false, macd: false };',
'  var historyPage = 1;',
'  var PER_PAGE = 10;',
'  var tickTimer = null;',
'  var transactionPage = 1;',

'  /* ── DOM refs ── */',
'  function $(sel) { return document.querySelector(sel); }',
'  function $$(sel) { return document.querySelectorAll(sel); }',

'  /* ── Init ── */',
'  function init() {',
'    updateSidebarPrices();',
'    selectAsset("btc");',
'    updateTopBar();',
'    updateOrderPanel();',
'    renderBottomTab("portfolio");',
'    bindEvents();',
'    startTickLoop();',
'  }',

'  /* ── Tick Loop (3 seconds) ── */',
'  function startTickLoop() {',
'    if (tickTimer) clearInterval(tickTimer);',
'    tickTimer = setInterval(function() {',
'      onTick();',
'    }, 3000);',
'  }',

'  var throttledChartRender = U.throttle(function() { renderChart(); }, 2000);',
'  var throttledAnalysis = U.throttle(function() { if ($("#panel-analysis").style.display !== "none") renderAnalysis(); }, 3000);',

'  function onTick() {',
'    ME.tick();',
'    updateSidebarPrices();',
'    updateTopBar();',
'    updateChartHeader();',
'    updateOrderPanel();',
'    throttledChartRender();',
'    throttledAnalysis();',
'    updateActiveBottomTab();',
'  }',

'  /* ── Asset Selection ── */',
'  function selectAsset(id) {',
'    selectedAsset = id;',
'    $$(".asset-item").forEach(function(el) {',
'      el.classList.toggle("active", el.getAttribute("data-id") === id);',
'    });',
'    updateChartHeader();',
'    updateOrderPanel();',
'    renderChart();',
'    renderAnalysis();',
'    /* Switch to chart type based on candle availability */',
'    var candles = ME.getCandles(id, timeframe);',
'    if (candles.length === 0 && chartType === "candlestick") {',
'      chartType = "line";',
'      $$(".chart-type-btn").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-value") === "line"); });',
'    }',
'  }',

'  /* ── Sidebar Prices ── */',
'  function updateSidebarPrices() {',
'    ME.getAssetIds().forEach(function(id) {',
'      var price = ME.getPrice(id);',
'      var change = ME.get24hChange(id);',
'      var priceEl = $("#sidebar-price-" + id);',
'      var changeEl = $("#sidebar-change-" + id);',
'      if (priceEl) priceEl.textContent = fmtP(price);',
'      if (changeEl) {',
'        changeEl.textContent = fmtPct(change);',
'        changeEl.className = "asset-item-change " + (change >= 0 ? "up" : "down");',
'      }',
'      /* Update watchlist star */',
'      var wl = S.getWatchlist() || [];',
'      var starBtn = $(\'[data-action="toggle-watchlist"][data-id="\' + id + \'"]\');',
'      if (starBtn) starBtn.classList.toggle("active", wl.indexOf(id) !== -1);',
'    });',
'  }',

'  function fmtP(p) {',
'    if (p == null || isNaN(p)) return "$0.00";',
'    if (p >= 1) return U.formatCurrency(p, 2);',
'    if (p >= 0.01) return U.formatCurrency(p, 4);',
'    return U.formatCurrency(p, 6);',
'  }',

'  /* ── Top Bar ── */',
'  function updateTopBar() {',
'    var balance = S.getBalance() || 0;',
'    var holdings = S.getHoldings() || {};',
'    var totalValue = balance;',
'    var totalInvested = S.get("portfolio.totalInvested") || 0;',
'    var totalReturn = S.get("portfolio.totalReturn") || 0;',
'    Object.keys(holdings).forEach(function(id) {',
'      var h = holdings[id];',
'      var price = ME.getPrice(id);',
'      totalValue += h.amount * price;',
'    });',
'    var totalPL = totalValue - 10000;',
'    var dailyPL = 0;',
'    /* Estimate daily P/L from 24h changes applied to holdings */',
'    Object.keys(holdings).forEach(function(id) {',
'      var h = holdings[id];',
'      var price = ME.getPrice(id);',
'      var change24h = ME.get24hChange(id) / 100;',
'      dailyPL += h.amount * price * change24h;',
'    });',
'    dailyPL += balance * 0.0001 * (Math.random() - 0.5); /* tiny noise on cash */',

'    var tvEl = $("#top-total-value");',
'    if (tvEl) { tvEl.textContent = U.formatCurrency(totalValue); tvEl.style.color = totalPL >= 0 ? "var(--green)" : "var(--red)"; }',
'    var bEl = $("#top-balance");',
'    if (bEl) bEl.textContent = U.formatCurrency(balance);',
'    var dpEl = $("#top-daily-pl");',
'    if (dpEl) { dpEl.textContent = (dailyPL >= 0 ? "+" : "") + U.formatCurrency(dailyPL); dpEl.style.color = dailyPL >= 0 ? "var(--green)" : "var(--red)"; }',
'    var tpEl = $("#top-total-pl");',
'    if (tpEl) { tpEl.textContent = (totalPL >= 0 ? "+" : "") + U.formatCurrency(totalPL); tpEl.style.color = totalPL >= 0 ? "var(--green)" : "var(--red)"; }',
'    var phase = ME.getPhaseInfo();',
'    var phEl = $("#top-phase");',
'    if (phEl) phEl.textContent = phase.name || "--";',
'  }',

'  /* ── Chart Header ── */',
'  function updateChartHeader() {',
'    var meta = getAssetMeta(selectedAsset);',
'    var price = ME.getPrice(selectedAsset);',
'    var change = ME.get24hChange(selectedAsset);',
'    var nameEl = $("#chart-asset-name");',
'    var priceEl = $("#chart-asset-price");',
'    var changeEl = $("#chart-asset-change");',
'    if (nameEl) nameEl.textContent = (meta.name || selectedAsset) + " (" + (meta.symbol || "") + ")";',
'    if (priceEl) priceEl.textContent = fmtP(price);',
'    if (changeEl) {',
'      changeEl.textContent = fmtPct(change);',
'      changeEl.className = "chart-asset-change " + (change >= 0 ? "up" : "down");',
'    }',
'  }',

'  function getAssetMeta(id) {',
'    if (window.DataMarket) return window.DataMarket.getAsset(id) || {};',
'    var d = { btc:{name:"Bitcoin",symbol:"BTC",color:"#F7931A"}, eth:{name:"Ethereum",symbol:"ETH",color:"#627EEA"}, sol:{name:"Solana",symbol:"SOL",color:"#9945FF"}, xrp:{name:"XRP",symbol:"XRP",color:"#00AAE4"}, doge:{name:"Dogecoin",symbol:"DOGE",color:"#C2A633"}, ada:{name:"Cardano",symbol:"ADA",color:"#0033AD"} };',
'    return d[id] || {};',
'  }',

'  /* ── Chart Rendering ── */',
'  function renderChart() {',
'    var canvas = $("#trading-chart");',
'    if (!canvas) return;',
'    var candles = ME.getCandles(selectedAsset, timeframe);',
'    var assetState = ME.getAssetState(selectedAsset);',
'    var meta = getAssetMeta(selectedAsset);',

'    if (chartType === "candlestick" && candles.length > 0) {',
'      C.renderCandlestick(canvas, candles, {',
'        showVolume: true,',
'        showMA: indicators.ma,',
'        showRSI: indicators.rsi,',
'        gridLines: 5,',
'        responsive: true',
'      });',
'      updateIndicatorInfo(candles);',
'    } else {',
'      /* Line chart from price history or candle closes */',
'      var lineData;',
'      if (candles.length > 0) {',
'        lineData = candles.map(function(c) { return { x: candles.indexOf(c), y: c.close }; });',
'      } else if (assetState && assetState.priceHistory) {',
'        var hist = assetState.priceHistory.slice(-200);',
'        lineData = hist.map(function(p, i) { return { x: i, y: p }; });',
'      } else {',
'        lineData = [];',
'      }',
'      C.renderLineChart(canvas, lineData, {',
'        color: meta.color || null,',
'        fill: true,',
'        smooth: true,',
'        gridLines: 5,',
'        responsive: true',
'      });',
'      updateIndicatorInfo(candles);',
'    }',
'  }',

'  function updateIndicatorInfo(candles) {',
'    var infoEl = $("#indicator-info");',
'    var anyActive = indicators.ma || indicators.rsi || indicators.macd;',
'    if (infoEl) infoEl.style.display = anyActive ? "flex" : "none";',
'    if (!anyActive || !candles || candles.length < 2) return;',
'    var closes = candles.map(function(c) { return c.close; });',
'    if (indicators.ma) {',
'      var ma = U.calculateMA(closes, 20);',
'      var maVal = ma.filter(function(v) { return v !== null; });',
'      var lastMA = maVal.length > 0 ? maVal[maVal.length - 1] : null;',
'      var el = $("#ind-ma");',
'      if (el) el.textContent = "MA(20): " + (lastMA !== null ? fmtP(lastMA) : "--");',
'    }',
'    if (indicators.rsi) {',
'      var rsiArr = U.calculateRSI(closes, 14);',
'      var rsiVal = rsiArr.filter(function(v) { return v !== null; });',
'      var lastRSI = rsiVal.length > 0 ? rsiVal[rsiVal.length - 1] : null;',
'      var el = $("#ind-rsi");',
'      if (el) el.textContent = "RSI(14): " + (lastRSI !== null ? lastRSI.toFixed(1) : "--");',
'    }',
'    if (indicators.macd) {',
'      var macdResult = U.calculateMACD(closes);',
'      var macdLine = (macdResult.macdLine || []).filter(function(v) { return v !== null; });',
'      var lastMACD = macdLine.length > 0 ? macdLine[macdLine.length - 1] : null;',
'      var el = $("#ind-macd");',
'      if (el) el.textContent = "MACD: " + (lastMACD !== null ? lastMACD.toFixed(4) : "--");',
'    }',
'  }',

'  /* ── Order Panel ── */',
'  function updateOrderPanel() {',
'    var meta = getAssetMeta(selectedAsset);',
'    var price = ME.getPrice(selectedAsset);',
'    var balance = S.getBalance() || 0;',
'    var holdings = S.getHoldings() || {};',
'    var h = holdings[selectedAsset];',

'    var nameEl = $("#order-asset-name");',
'    var priceEl = $("#order-asset-price");',
'    var balEl = $("#order-balance");',
'    var holdEl = $("#order-holdings");',
'    var submitBtn = $("#order-submit-btn");',
'    var limitGroup = $("#limit-price-group");',
'    var amountLabel = $("#amount-label");',

'    if (nameEl) nameEl.textContent = (meta.name || selectedAsset) + " (" + (meta.symbol || "") + ")";',
'    if (priceEl) priceEl.textContent = fmtP(price);',
'    if (balEl) balEl.textContent = U.formatCurrency(balance);',
'    if (holdEl) holdEl.textContent = h ? fmtQty(h.amount) + " " + (meta.symbol || "") : "0";',
'    if (submitBtn) {',
'      submitBtn.textContent = (orderSide === "buy" ? "Buy " : "Sell ") + (meta.symbol || selectedAsset.toUpperCase());',
'      submitBtn.className = "order-submit-btn " + orderSide;',
'    }',
'    if (limitGroup) limitGroup.style.display = orderType === "limit" ? "flex" : "none";',
'    if (amountLabel) amountLabel.textContent = orderType === "limit" ? (orderSide === "buy" ? "Quantity (Units)" : "Quantity (Units)") : "Amount (USD)";',

'    updateOrderEstimate();',
'  }',

'  function updateOrderEstimate() {',
'    var estEl = $("#order-estimate");',
'    if (!estEl) return;',
'    var price = ME.getPrice(selectedAsset);',
'    var input = $("#order-amount-input");',
'    var val = input ? parseFloat(input.value) : 0;',
'    if (!val || val <= 0) { estEl.textContent = "--"; return; }',

'    if (orderType === "market") {',
'      if (orderSide === "buy") {',
'        var qty = val / price;',
'        estEl.textContent = "Est. quantity: " + fmtQty(qty);',
'      } else {',
'        /* For sell with USD input, we interpret as USD value of holdings to sell */',
'        var qty = val / price;',
'        estEl.textContent = "Est. you sell: " + fmtQty(qty) + " (" + U.formatCurrency(val) + ")";',
'      }',
'    } else {',
'      var limitPrice = parseFloat(($("#limit-price-input") || {}).value) || 0;',
'      if (limitPrice > 0) {',
'        if (orderSide === "buy") {',
'          estEl.textContent = "Total: " + U.formatCurrency(val * limitPrice);',
'        } else {',
'          estEl.textContent = "Total: " + U.formatCurrency(val * limitPrice);',
'        }',
'      } else {',
'        estEl.textContent = "Enter a limit price to see total";',
'      }',
'    }',
'  }',

'  /* ── Place Order ── */',
'  function placeOrder() {',
'    var price = ME.getPrice(selectedAsset);',
'    var balance = S.getBalance() || 0;',
'    var holdings = S.getHoldings() || {};',
'    var h = holdings[selectedAsset];',
'    var meta = getAssetMeta(selectedAsset);',
'    var input = $("#order-amount-input");',
'    var amountVal = parseFloat(input ? input.value : 0);',
'    if (!amountVal || amountVal <= 0) { UI.createToast("Enter a valid amount", "warning"); return; }',

'    var execPrice = price;',
'    var qty, total;',

'    if (orderType === "market") {',
'      if (orderSide === "buy") {',
'        total = amountVal;',
'        qty = total / price;',
'        if (total > balance) { UI.createToast("Insufficient balance. You have " + U.formatCurrency(balance), "error"); return; }',
'      } else {',
'        total = amountVal;',
'        qty = total / price;',
'        if (!h || h.amount < qty) { UI.createToast("Insufficient holdings. You have " + fmtQty(h ? h.amount : 0) + " " + meta.symbol, "error"); return; }',
'      }',
'    } else {',
'      execPrice = parseFloat(($("#limit-price-input") || {}).value) || 0;',
'      if (execPrice <= 0) { UI.createToast("Enter a valid limit price", "warning"); return; }',
'      qty = amountVal;',
'      total = qty * execPrice;',
'      if (orderSide === "buy") {',
'        if (total > balance) { UI.createToast("Insufficient balance for this limit order", "error"); return; }',
'      } else {',
'        if (!h || h.amount < qty) { UI.createToast("Insufficient holdings for this limit order", "error"); return; }',
'      }',
'    }',

'    /* Confirmation Modal */',
'    var sideLabel = orderSide === "buy" ? "Buy" : "Sell";',
'    var typeLabel = orderType === "market" ? "Market" : "Limit @ " + fmtP(execPrice);',
'    var content = "<div style=\\"text-align:left;\\">" +',
'      "<p style=\\"margin-bottom:12px;color:var(--text-secondary);\\">Please confirm your order:</p>" +',
'      "<div style=\\"display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:var(--text-sm);\\">" +',
'        "<div><span style=\\"color:var(--text-muted);\\">Type</span><br><strong>" + sideLabel + " " + typeLabel + "</strong></div>" +',
'        "<div><span style=\\"color:var(--text-muted);\\">Asset</span><br><strong>" + meta.symbol + "</strong></div>" +',
'        "<div><span style=\\"color:var(--text-muted);\\">Quantity</span><br><strong>" + fmtQty(qty) + " " + meta.symbol + "</strong></div>" +',
'        "<div><span style=\\"color:var(--text-muted);\\">Total</span><br><strong style=\\"color:" + (orderSide === "buy" ? "var(--red)" : "var(--green)") + "\\">" + U.formatCurrency(total) + "</strong></div>" +',
'      "</div></div>";',

'    UI.createModal("Confirm " + sideLabel + " Order", content, [',
'      { label: "Cancel", class: "btn-secondary" },',
'      { label: "Confirm " + sideLabel, class: orderSide === "buy" ? "btn-primary" : "btn-danger", onClick: function() { executeOrder(qty, execPrice, total); } }',
'    ]);',
'  }',

'  function executeOrder(qty, price, total) {',
'    var meta = getAssetMeta(selectedAsset);',
'    var success;',
'    if (orderSide === "buy") {',
'      success = S.buyAsset(selectedAsset, qty, price);',
'    } else {',
'      success = S.sellAsset(selectedAsset, qty, price);',
'    }',
'    if (success) {',
'      UI.createToast((orderSide === "buy" ? "Bought" : "Sold") + " " + fmtQty(qty) + " " + meta.symbol + " for " + U.formatCurrency(total), "success");',
'      var inp = $("#order-amount-input");',
'      if (inp) inp.value = "";',
'      updateTopBar();',
'      updateOrderPanel();',
'      renderBottomTab("portfolio");',
'    } else {',
'      UI.createToast("Order failed. Check your balance/holdings.", "error");',
'    }',
'  }',

'  /* ── Bottom Tabs ── */',
'  function switchBottomTab(tab) {',
'    $$(".bottom-tab").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-tab") === tab); });',
'    ["portfolio","watchlist","history","analysis"].forEach(function(t) {',
'      var el = $("#panel-" + t);',
'      if (el) el.style.display = t === tab ? "" : "none";',
'    });',
'    renderBottomTab(tab);',
'  }',

'  function updateActiveBottomTab() {',
'    var activeTab = $(".bottom-tab.active");',
'    if (activeTab) renderBottomTab(activeTab.getAttribute("data-tab"));',
'  }',

'  function renderBottomTab(tab) {',
'    if (tab === "portfolio") renderPortfolio();',
'    else if (tab === "watchlist") renderWatchlist();',
'    else if (tab === "history") renderHistory();',
'    else if (tab === "analysis") renderAnalysis();',
'  }',

'  /* ── Portfolio Tab ── */',
'  function renderPortfolio() {',
'    var holdings = S.getHoldings() || {};',
'    var keys = Object.keys(holdings);',
'    var tbody = $("#holdings-body");',
'    var emptyEl = $("#portfolio-empty");',
'    var pieCanvas = $("#portfolio-pie");',
'    var balance = S.getBalance() || 0;',
'    var totalInvested = S.get("portfolio.totalInvested") || 0;',
'    var totalReturn = S.get("portfolio.totalReturn") || 0;',
'    var holdingsValue = 0;',

'    if (keys.length === 0) {',
'      if (tbody) tbody.innerHTML = "";',
'      if (emptyEl) emptyEl.style.display = "";',
'      if (pieCanvas) { var ctx = pieCanvas.getContext("2d"); ctx.clearRect(0,0,pieCanvas.width,pieCanvas.height); }',
'    } else {',
'      if (emptyEl) emptyEl.style.display = "none";',
'      var rows = "";',
'      var pieData = [];',
'      keys.forEach(function(id) {',
'        var h = holdings[id];',
'        var meta = getAssetMeta(id);',
'        var currentPrice = ME.getPrice(id);',
'        var value = h.amount * currentPrice;',
'        var pl = value - h.amount * h.avgBuyPrice;',
'        var plPct = h.avgBuyPrice > 0 ? ((currentPrice - h.avgBuyPrice) / h.avgBuyPrice * 100) : 0;',
'        holdingsValue += value;',
'        var plClass = pl >= 0 ? "pl-positive" : "pl-negative";',
'        rows += "<tr>" +',
'          "<td><div class=\\"asset-name-cell\\"><span style=\\"color:" + (meta.color||"") + "\\\">" + (meta.icon||"") + "</span> " + (meta.symbol||id.toUpperCase()) + "</div></td>" +',
'          "<td>" + fmtQty(h.amount) + "</td>" +',
'          "<td>" + fmtP(h.avgBuyPrice) + "</td>" +',
'          "<td>" + U.formatCurrency(value) + "</td>" +',
'          "<td class=\\"" + plClass + "\\">" + (pl >= 0 ? "+" : "") + U.formatCurrency(pl) + "</td>" +',
'          "<td class=\\"" + plClass + "\\">" + U.formatPercent(plPct) + "</td>" +',
'        "</tr>";',
'        pieData.push({ label: meta.symbol || id.toUpperCase(), value: value, color: meta.color || "#3b82f6" });',
'      });',
'      if (balance > 0) pieData.push({ label: "USD Cash", value: balance, color: "#64748b" });',
'      if (tbody) tbody.innerHTML = rows;',
'      if (pieCanvas && pieData.length > 0) C.renderPieChart(pieCanvas, pieData, { donut: true, responsive: true });',
'    }',

'    var totalValue = holdingsValue + balance;',
'    var totalPL = totalValue - 10000;',
'    var tvEl = $("#portfolio-total-value");',
'    var tiEl = $("#portfolio-total-invested");',
'    var trEl = $("#portfolio-total-return");',
'    var acEl = $("#portfolio-asset-count");',
'    if (tvEl) { tvEl.textContent = U.formatCurrency(totalValue); tvEl.style.color = totalPL >= 0 ? "var(--green)" : "var(--red)"; }',
'    if (tiEl) tiEl.textContent = U.formatCurrency(totalInvested);',
'    if (trEl) { trEl.textContent = (totalReturn >= 0 ? "+" : "") + U.formatCurrency(totalReturn); trEl.style.color = totalReturn >= 0 ? "var(--green)" : "var(--red)"; }',
'    if (acEl) acEl.textContent = keys.length + " asset" + (keys.length !== 1 ? "s" : "");',
'  }',

'  /* ── Watchlist Tab ── */',
'  function renderWatchlist() {',
'    var wl = S.getWatchlist() || [];',
'    var tbody = $("#watchlist-body");',
'    var emptyEl = $("#watchlist-empty");',
'    if (!tbody) return;',
'    if (wl.length === 0) {',
'      tbody.innerHTML = "";',
'      if (emptyEl) emptyEl.style.display = "";',
'      return;',
'    }',
'    if (emptyEl) emptyEl.style.display = "none";',
'    var rows = "";',
'    wl.forEach(function(id) {',
'      var meta = getAssetMeta(id);',
'      var price = ME.getPrice(id);',
'      var change = ME.get24hChange(id);',
'      var changeClass = change >= 0 ? "pl-positive" : "pl-negative";',
'      rows += "<tr>" +',
'        "<td><div class=\\"asset-name-cell\\"><span style=\\"color:" + (meta.color||"") + "\\\">" + (meta.icon||"") + "</span> " + (meta.symbol||id.toUpperCase()) + "</div></td>" +',
'        "<td>" + fmtP(price) + "</td>" +',
'        "<td class=\\"" + changeClass + "\\">" + U.formatPercent(change) + "</td>" +',
'        "<td><button class=\\"btn btn-secondary\\" style=\\"font-size:11px;padding:3px 10px;\\" data-action=\\"toggle-watchlist\\" data-id=\\"" + id + "\\">Remove</button></td>" +',
'      "</tr>";',
'    });',
'    tbody.innerHTML = rows;',
'  }',

'  /* ── Transaction History Tab ── */',
'  function renderHistory() {',
'    var txns = S.getTransactions() || [];',
'    var tbody = $("#history-body");',
'    var emptyEl = $("#history-empty");',
'    var pagEl = $("#history-pagination");',
'    if (!tbody) return;',
'    if (txns.length === 0) {',
'      tbody.innerHTML = "";',
'      if (emptyEl) emptyEl.style.display = "";',
'      if (pagEl) pagEl.innerHTML = "";',
'      return;',
'    }',
'    if (emptyEl) emptyEl.style.display = "none";',
'    var sorted = txns.slice().reverse();',
'    var totalPages = Math.ceil(sorted.length / PER_PAGE);',
'    transactionPage = Math.min(transactionPage, totalPages);',
'    var start = (transactionPage - 1) * PER_PAGE;',
'    var pageTxns = sorted.slice(start, start + PER_PAGE);',
'    var rows = "";',
'    pageTxns.forEach(function(tx) {',
'      var meta = getAssetMeta(tx.assetId);',
'      var isBuy = tx.type === "buy";',
'      rows += "<tr>" +',
'        "<td>" + U.formatDate(tx.date, "datetime") + "</td>" +',
'        "<td><span class=\\"badge badge-" + (isBuy ? "green" : "red") + "\\">" + (isBuy ? "Buy" : "Sell") + "</span></td>" +',
'        "<td>" + (meta.symbol || tx.assetId.toUpperCase()) + "</td>" +',
'        "<td>" + fmtQty(tx.amount) + "</td>" +',
'        "<td>" + fmtP(tx.price) + "</td>" +',
'        "<td>" + U.formatCurrency(tx.total) + "</td>" +',
'      "</tr>";',
'    });',
'    tbody.innerHTML = rows;',
'    if (pagEl) {',
'      pagEl.innerHTML = UI.createPagination(transactionPage, totalPages, function(p) { transactionPage = p; renderHistory(); });',
'      UI.initPagination();',
'    }',
'  }',

'  /* ── AI Analysis Tab ── */',
'  function renderAnalysis() {',
'    var price = ME.getPrice(selectedAsset);',
'    var change24h = ME.get24hChange(selectedAsset);',
'    var assetState = ME.getAssetState(selectedAsset);',
'    var phase = ME.getPhaseInfo();',
'    var meta = getAssetMeta(selectedAsset);',
'    var candles = ME.getCandles(selectedAsset, "5m");',
'    var closes = candles.length > 0 ? candles.map(function(c) { return c.close; }) : (assetState ? assetState.priceHistory.slice(-100) : []);',

'    /* Trend */',
'    var trend = "Neutral", trendClass = "badge-blue";',
'    if (change24h > 2) { trend = "Bullish"; trendClass = "badge-green"; }',
'    else if (change24h < -2) { trend = "Bearish"; trendClass = "badge-red"; }',
'    else if (change24h > 0.5) { trend = "Slightly Bullish"; trendClass = "badge-green"; }',
'    else if (change24h < -0.5) { trend = "Slightly Bearish"; trendClass = "badge-red"; }',
'    var trendEl = $("#ai-trend");',
'    if (trendEl) trendEl.innerHTML = \'<span class="badge \' + trendClass + \'">\' + trend + "</span>";',

'    /* Momentum */',
'    var momentum = "Moderate", momClass = "badge-blue";',
'    if (closes.length > 5) {',
'      var recent = closes.slice(-5);',
'      var avgChange = Math.abs((recent[recent.length-1] - recent[0]) / recent[0] * 100);',
'      if (avgChange > 1.5) { momentum = "Strong"; momClass = "badge-green"; }',
'      else if (avgChange < 0.3) { momentum = "Weak"; momClass = "badge-amber"; }',
'    }',
'    var momEl = $("#ai-momentum");',
'    if (momEl) momEl.innerHTML = \'<span class="badge \' + momClass + \'">\' + momentum + "</span>";',

'    /* Volatility */',
'    var volLabel = "Medium", volClass = "badge-amber";',
'    var config = ME.getAssetConfig(selectedAsset);',
'    if (config) {',
'      if (config.volatility < 0.005) { volLabel = "Low"; volClass = "badge-green"; }',
'      else if (config.volatility > 0.008) { volLabel = "High"; volClass = "badge-red"; }',
'    }',
'    var volEl = $("#ai-volatility");',
'    if (volEl) volEl.innerHTML = \'<span class="badge \' + volClass + \'">\' + volLabel + "</span>";',

'    /* Phase */',
'    var phaseEl = $("#ai-phase");',
'    if (phaseEl) phaseEl.textContent = phase.name || "--";',

'    /* Support & Resistance */',
'    var support = price * 0.97, resistance = price * 1.03;',
'    if (closes.length > 20) {',
'      var recentCloses = closes.slice(-50);',
'      var minP = Math.min.apply(null, recentCloses);',
'      var maxP = Math.max.apply(null, recentCloses);',
'      support = price * 0.6 + minP * 0.4;',
'      resistance = price * 0.6 + maxP * 0.4;',
'    }',
'    var supEl = $("#ai-support");',
'    var resEl = $("#ai-resistance");',
'    if (supEl) supEl.textContent = fmtP(support);',
'    if (resEl) resEl.textContent = fmtP(resistance);',

'    /* Sentiment */',
'    var sentiment = 50;',
'    if (change24h > 3) sentiment = 75 + Math.min(change24h, 10);',
'    else if (change24h > 0) sentiment = 50 + change24h * 8;',
'    else if (change24h < -3) sentiment = 25 - Math.min(Math.abs(change24h), 10);',
'    else sentiment = 50 + change24h * 8;',
'    sentiment = Math.max(0, Math.min(100, sentiment));',
'    var sentFill = $("#ai-sentiment-fill");',
'    var sentVal = $("#ai-sentiment-value");',
'    if (sentFill) sentFill.style.left = sentiment + "%";',
'    if (sentVal) {',
'      var sentLabel = sentiment < 25 ? "Extreme Fear" : sentiment < 40 ? "Fear" : sentiment < 60 ? "Neutral" : sentiment < 75 ? "Greed" : "Extreme Greed";',
'      sentVal.textContent = sentLabel + " (" + Math.round(sentiment) + ")";',
'    }',

'    /* Confidence */',
'    var confidence = 40 + Math.min(closes.length / 2, 50) + (Math.random() * 10);',
'    confidence = Math.min(95, Math.round(confidence));',
'    var confFill = $("#ai-confidence-fill");',
'    var confVal = $("#ai-confidence-value");',
'    if (confFill) confFill.style.width = confidence + "%";',
'    if (confVal) confVal.textContent = confidence;',

'    /* Risk */',
'    var risk = Math.round(3 + config.volatility * 500 + (phase.volatilityMultiplier || 1) * 2);',
'    risk = Math.max(1, Math.min(10, risk));',
'    var riskFill = $("#ai-risk-fill");',
'    var riskVal = $("#ai-risk-value");',
'    if (riskFill) riskFill.style.width = (risk * 10) + "%";',
'    if (riskVal) riskVal.textContent = risk + "/10";',

'    /* Summary Text */',
'    var summary = generateSummary(meta, price, change24h, trend, momentum, volLabel, sentiment, phase.name);',
'    var sumEl = $("#ai-summary");',
'    if (sumEl) sumEl.textContent = summary;',
'  }',

'  function generateSummary(meta, price, change24h, trend, momentum, vol, sentiment, phase) {',
'    var name = meta.symbol || "this asset";',
'    var dir = change24h >= 0 ? "upward" : "downward";',
'    var strength = momentum === "Strong" ? "strong" : momentum === "Weak" ? "subdued" : "moderate";',
'    var sentences = [];',
'    sentences.push(name + " is currently exhibiting " + strength + " " + dir + " momentum with a 24h change of " + U.formatPercent(change24h) + ".");',
'    if (trend === "Bullish" || trend === "Slightly Bullish") {',
'      sentences.push("The overall trend appears bullish, supported by the current " + (phase || "market") + " phase and positive price action.");',
'    } else if (trend === "Bearish" || trend === "Slightly Bearish") {',
'      sentences.push("Bearish pressure is evident, and traders should consider waiting for confirmation of a reversal before entering new positions.");',
'    } else {',
'      sentences.push("The market is currently in a consolidation phase with no clear directional bias, making range-bound strategies potentially suitable.");',
'    }',
'    sentences.push("Volatility is " + vol.toLowerCase() + ", suggesting " + (vol === "Low" ? "stable conditions suitable for newer traders." : vol === "High" ? "caution is warranted due to potential for rapid price swings." : "normal market conditions with moderate risk."));',
'    return sentences.join(" ");',
'  }',

'  /* ── Event Binding ── */',
'  function bindEvents() {',
'    var page = $("#trading-page");',
'    if (!page) return;',

'    /* Delegate all data-action clicks */',
'    page.addEventListener("click", function(e) {',
'      var target = e.target.closest("[data-action]");',
'      if (!target) return;',
'      var action = target.getAttribute("data-action");',
'      switch(action) {',
'        case "select-asset": selectAsset(target.getAttribute("data-id")); break;',
'        case "set-timeframe":',
'          timeframe = target.getAttribute("data-value");',
'          $$(".timeframe-btn").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-value") === timeframe); });',
'          renderChart();',
'          break;',
'        case "toggle-indicator":',
'          var ind = target.getAttribute("data-value");',
'          indicators[ind] = !indicators[ind];',
'          target.classList.toggle("active", indicators[ind]);',
'          renderChart();',
'          break;',
'        case "set-chart-type":',
'          chartType = target.getAttribute("data-value");',
'          $$(".chart-type-btn").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-value") === chartType); });',
'          renderChart();',
'          break;',
'        case "switch-order-side":',
'          orderSide = target.getAttribute("data-value");',
'          $$(".order-tab").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-value") === orderSide); });',
'          updateOrderPanel();',
'          break;',
'        case "switch-order-type":',
'          orderType = target.getAttribute("data-value");',
'          $$(".order-type-btn").forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-value") === orderType); });',
'          updateOrderPanel();',
'          break;',
'        case "set-quick-amount":',
'          var pct = parseInt(target.getAttribute("data-value"), 10);',
'          var balance = S.getBalance() || 0;',
'          var holdings = S.getHoldings() || {};',
'          var h = holdings[selectedAsset];',
'          var amount;',
'          if (orderType === "market") {',
'            amount = (balance * pct / 100);',
'          } else {',
'            amount = h ? (h.amount * pct / 100) : 0;',
'          }',
'          var inp = $("#order-amount-input");',
'          if (inp) { inp.value = amount > 0 ? amount.toFixed(2) : ""; updateOrderEstimate(); }',
'          break;',
'        case "place-order": placeOrder(); break;',
'        case "toggle-watchlist":',
'          var wid = target.getAttribute("data-id");',
'          var added = S.toggleWatchlist(wid);',
'          UI.createToast((added ? "Added " : "Removed ") + (getAssetMeta(wid).symbol || wid.toUpperCase()) + (added ? " to" : " from") + " watchlist", "info");',
'          updateSidebarPrices();',
'          if ($(".bottom-tab.active") && $(".bottom-tab.active").getAttribute("data-tab") === "watchlist") renderWatchlist();',
'          break;',
'        case "switch-tab":',
'          switchBottomTab(target.getAttribute("data-tab"));',
'          break;',
'      }',
'    });',

'    /* Input listeners for order estimate */',
'    var amtInput = $("#order-amount-input");',
'    if (amtInput) amtInput.addEventListener("input", updateOrderEstimate);',
'    var limInput = $("#limit-price-input");',
'    if (limInput) limInput.addEventListener("input", updateOrderEstimate);',

'    /* Sidebar toggle */',
'    var toggleBtn = $("#sidebar-toggle-btn");',
'    var sidebar = $("#asset-sidebar");',
'    if (toggleBtn && sidebar) {',
'      toggleBtn.addEventListener("click", function() { sidebar.classList.toggle("collapsed"); });',
'    }',
'  }',

'  /* ── Cleanup on page leave ── */',
'  var cleanupHandler = function() {',
'    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }',
'    window.removeEventListener("routeChanged", cleanupHandler);',
'  };',
'  window.addEventListener("routeChanged", cleanupHandler);',

'  /* ── Start ── */',
'  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }',
'  else { init(); }',

'})();'
].join('\n');