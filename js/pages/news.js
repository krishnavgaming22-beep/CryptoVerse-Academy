/**
 * CryptoVerse Academy — Market News Engine Page
 * ==============================================
 * Filterable news feed with category/sentiment filters, search,
 * expandable article modals, simulated events, and pagination.
 *
 * Dependencies: window.Store, window.MarketEngine, window.Utils,
 *               window.UI, window.DataNews
 */
window.Pages = window.Pages || {};

window.Pages.news = function () {
  'use strict';

  var newsItems = (window.DataNews && window.DataNews.getAll) ? window.DataNews.getAll() : [];
  var PER_PAGE = 10;

  var categories = ['All', 'Regulation', 'Technology', 'Market', 'Adoption', 'Security'];
  var sentiments = ['All', 'Positive', 'Negative', 'Neutral'];

  function sentimentColor(s) {
    if (s === 'positive') return '#22c55e';
    if (s === 'negative') return '#ef4444';
    return '#3b82f6';
  }

  function sentimentBg(s) {
    if (s === 'positive') return 'rgba(34,197,94,0.15)';
    if (s === 'negative') return 'rgba(239,68,68,0.15)';
    return 'rgba(59,130,246,0.15)';
  }

  function impactColor(level) {
    var l = parseInt(level, 10) || 5;
    if (l <= 3) return '#22c55e';
    if (l <= 6) return '#f59e0b';
    return '#ef4444';
  }

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function renderNewsCards(items) {
    if (!items || items.length === 0) {
      return '<div class="empty-state"><p>No news articles match your filters.</p></div>';
    }
    return items.map(function (n, i) {
      var body = n.body || n.content || n.text || '';
      var preview = body.length > 100 ? body.substring(0, 100) + '...' : body;
      var date = n.date || n.publishedAt || '2024-01-01';
      var sentiment = (n.sentiment || 'neutral').toLowerCase();
      var category = n.category || 'Market';
      var impact = n.impact || n.impactLevel || 5;
      var assets = n.affectedAssets || n.assets || [];
      var assetTags = (Array.isArray(assets) ? assets : [assets]).map(function (a) {
        return '<span class="news-asset-tag">' + esc(a) + '</span>';
      }).join('');

      return '<div class="news-card" data-action="open-news" data-index="' + i + '">' +
        '<div class="news-card-header">' +
          '<h3 class="news-card-title">' + esc(n.title || 'Untitled') + '</h3>' +
          '<div class="news-card-badges">' +
            '<span class="news-sentiment-badge" style="background:' + sentimentBg(sentiment) + ';color:' + sentimentColor(sentiment) + '">' + esc(sentiment) + '</span>' +
            '<span class="news-category-badge">' + esc(category) + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="news-card-preview">' + esc(preview) + '</p>' +
        '<div class="news-card-meta">' +
          '<span class="news-card-date">' + esc(date) + '</span>' +
          '<div class="news-impact-container">' +
            '<span class="news-impact-label">Impact</span>' +
            '<div class="news-impact-bar-bg"><div class="news-impact-bar-fill" style="width:' + (impact * 10) + '%;background:' + impactColor(impact) + '"></div></div>' +
            '<span class="news-impact-value">' + impact + '/10</span>' +
          '</div>' +
        '</div>' +
        (assetTags ? '<div class="news-card-assets">' + assetTags + '</div>' : '') +
      '</div>';
    }).join('');
  }

  var html = '<style>' +
    '.news-page{max-width:960px;margin:0 auto;padding:24px}' +
    '.news-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}' +
    '.news-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0}' +
    '.news-simulate-btn{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.875rem;transition:transform .2s,box-shadow .2s}' +
    '.news-simulate-btn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,.4)}' +
    '.news-filters{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center}' +
    '.news-filter-group{display:flex;gap:6px;align-items:center;flex-wrap:wrap}' +
    '.news-filter-group label{font-size:.75rem;color:var(--text-secondary,#94a3b8);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-right:4px}' +
    '.news-filter-btn{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-secondary,#94a3b8);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.8rem;transition:all .2s}' +
    '.news-filter-btn:hover,.news-filter-btn.active{background:var(--accent,#8b5cf6);color:#fff;border-color:var(--accent,#8b5cf6)}' +
    '.news-search{flex:1;min-width:200px;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-primary,#e2e8f0);padding:8px 14px;border-radius:8px;font-size:.875rem;outline:none;transition:border-color .2s}' +
    '.news-search:focus{border-color:var(--accent,#8b5cf6)}' +
    '.news-search::placeholder{color:var(--text-muted,#64748b)}' +
    '.news-feed{display:flex;flex-direction:column;gap:12px}' +
    '.news-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:18px;cursor:pointer;transition:all .25s}' +
    '.news-card:hover{border-color:var(--accent,#8b5cf6);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.3)}' +
    '.news-card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}' +
    '.news-card-title{font-size:1rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0;line-height:1.4}' +
    '.news-card-badges{display:flex;gap:6px;flex-shrink:0}' +
    '.news-sentiment-badge,.news-category-badge{padding:3px 10px;border-radius:20px;font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.03em}' +
    '.news-category-badge{background:rgba(148,163,184,.15);color:var(--text-secondary,#94a3b8)}' +
    '.news-card-preview{font-size:.875rem;color:var(--text-secondary,#94a3b8);margin:0 0 10px 0;line-height:1.5}' +
    '.news-card-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}' +
    '.news-card-date{font-size:.75rem;color:var(--text-muted,#64748b)}' +
    '.news-impact-container{display:flex;align-items:center;gap:8px}' +
    '.news-impact-label{font-size:.7rem;color:var(--text-muted,#64748b);font-weight:600;text-transform:uppercase}' +
    '.news-impact-bar-bg{width:80px;height:6px;background:rgba(148,163,184,.2);border-radius:3px;overflow:hidden}' +
    '.news-impact-bar-fill{height:100%;border-radius:3px;transition:width .4s ease}' +
    '.news-impact-value{font-size:.75rem;font-weight:600;color:var(--text-secondary,#94a3b8)}' +
    '.news-card-assets{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}' +
    '.news-asset-tag{background:rgba(99,102,241,.12);color:#818cf8;padding:2px 8px;border-radius:4px;font-size:.7rem;font-weight:500}' +
    '.news-pagination{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:24px}' +
    '.news-page-btn{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-secondary,#94a3b8);width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:.85rem;display:flex;align-items:center;justify-content:center;transition:all .2s}' +
    '.news-page-btn:hover,.news-page-btn.active{background:var(--accent,#8b5cf6);color:#fff;border-color:var(--accent,#8b5cf6)}' +
    '.news-page-btn:disabled{opacity:.3;cursor:not-allowed}' +
    '.news-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s}' +
    '.news-modal-overlay.open{opacity:1;pointer-events:auto}' +
    '.news-modal{background:var(--bg-surface,#1e293b);border:1px solid var(--border-color,rgba(148,163,184,.2));border-radius:16px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto;padding:32px;transform:translateY(20px);transition:transform .3s}' +
    '.news-modal-overlay.open .news-modal{transform:translateY(0)}' +
    '.news-modal-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px}' +
    '.news-modal-close{background:none;border:none;color:var(--text-muted,#64748b);font-size:1.5rem;cursor:pointer;padding:4px;line-height:1;transition:color .2s}' +
    '.news-modal-close:hover{color:var(--text-primary,#e2e8f0)}' +
    '.news-modal-body{font-size:.925rem;color:var(--text-secondary,#94a3b8);line-height:1.7}' +
    '.news-modal-body p{margin:0 0 12px}' +
    '.news-modal-meta{margin-top:20px;padding-top:16px;border-top:1px solid var(--border-color,rgba(148,163,184,.15))}' +
    '.empty-state{text-align:center;padding:60px 20px;color:var(--text-muted,#64748b)}' +
    '.empty-state p{font-size:1rem;margin:0}' +
  '</style>';

  html += '<div class="news-page">';

  /* Header */
  html += '<div class="news-header">' +
    '<h1>\uD83D\uDCF0 Market News</h1>' +
    '<button class="news-simulate-btn" data-action="simulate-news-event">\u26A1 Simulate New Event</button>' +
  '</div>';

  /* Category Filters */
  html += '<div class="news-filters">' +
    '<div class="news-filter-group">' +
      '<label>Category:</label>' +
      categories.map(function (c) {
        return '<button class="news-filter-btn' + (c === 'All' ? ' active' : '') + '" data-action="filter-news-category" data-category="' + c + '">' + c + '</button>';
      }).join('') +
    '</div>' +
  '</div>';

  /* Sentiment & Search Row */
  html += '<div class="news-filters">' +
    '<div class="news-filter-group">' +
      '<label>Sentiment:</label>' +
      sentiments.map(function (s) {
        return '<button class="news-filter-btn' + (s === 'All' ? ' active' : '') + '" data-action="filter-news-sentiment" data-sentiment="' + s.toLowerCase() + '">' + s + '</button>';
      }).join('') +
    '</div>' +
    '<input type="text" class="news-search" placeholder="Search news..." data-action="search-news" />' +
  '</div>';

  /* News Feed */
  html += '<div class="news-feed" id="news-feed">' + renderNewsCards(newsItems.slice(0, PER_PAGE)) + '</div>';

  /* Pagination */
  var totalPages = Math.ceil(newsItems.length / PER_PAGE);
  html += '<div class="news-pagination" id="news-pagination">';
  html += '<button class="news-page-btn" data-action="news-prev-page" data-page="prev" ' + (totalPages <= 1 ? 'disabled' : '') + '>&laquo;</button>';
  for (var p = 1; p <= totalPages; p++) {
    html += '<button class="news-page-btn' + (p === 1 ? ' active' : '') + '" data-action="news-go-page" data-page="' + p + '">' + p + '</button>';
  }
  html += '<button class="news-page-btn" data-action="news-next-page" data-page="next" ' + (totalPages <= 1 ? 'disabled' : '') + '>&raquo;</button>';
  html += '</div>';

  html += '</div>'; /* .news-page */

  /* Modal */
  html += '<div class="news-modal-overlay" id="news-modal-overlay">' +
    '<div class="news-modal">' +
      '<div class="news-modal-header">' +
        '<h2 id="news-modal-title" style="margin:0;font-size:1.25rem;color:var(--text-primary,#e2e8f0)"></h2>' +
        '<button class="news-modal-close" data-action="close-news-modal">&times;</button>' +
      '</div>' +
      '<div id="news-modal-badges" style="margin-bottom:12px"></div>' +
      '<div class="news-modal-body" id="news-modal-body"></div>' +
      '<div class="news-modal-meta" id="news-modal-meta"></div>' +
    '</div>' +
  '</div>';

  return html;
};