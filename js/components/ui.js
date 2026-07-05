/**
 * CryptoVerse Academy — UI Components
 * ======================================
 * Reusable UI component functions that generate HTML strings or DOM
 * elements. All components use the project's CSS variable design tokens
 * and follow the dark fintech theme established in variables.css.
 *
 * Dependencies: window.Utils (helpers.js)
 *
 * Usage:
 *   UI.createToast('Order placed!', 'success');
 *   const modal = UI.createModal('Confirm', '<p>Are you sure?</p>', [...]);
 *   document.querySelector('#container').innerHTML = UI.createProgressBar(75, 'blue');
 */
(function () {
  'use strict';

  var UI = {};

  /* ================================================================== */
  /*  SVG ICON HELPERS                                                   */
  /* ================================================================== */

  var ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
  };

  /**
   * Get an SVG icon string with a given class.
   * @param {string} name — Key from ICONS
   * @param {string} [cls] — Additional CSS class
   * @returns {string}
   */
  function icon(name, cls) {
    return '<span class="ui-icon' + (cls ? ' ' + cls : '') + '">' + (ICONS[name] || '') + '</span>';
  }

  /* ================================================================== */
  /*  TOAST NOTIFICATIONS                                                */
  /* ================================================================== */

  /**
   * Ensure the #toast-container exists in the DOM.
   */
  function ensureToastContainer() {
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Create and show a toast notification.
   *
   * @param {string} message — Toast message text
   * @param {string} [type='info'] — 'success' | 'error' | 'info' | 'warning'
   * @param {number} [duration=3000] — Auto-dismiss time in ms (0 = persistent)
   * @returns {HTMLElement} The toast element
   */
  UI.createToast = function (message, type, duration) {
    type = type || 'info';
    duration = (duration !== undefined) ? duration : 3000;

    var container = ensureToastContainer();

    var titleMap = { success: 'Success', error: 'Error', info: 'Info', warning: 'Warning' };

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
      '<div class="toast-icon">' + icon(type) + '</div>' +
      '<div class="toast-content">' +
        '<div class="toast-title">' + (titleMap[type] || 'Notification') + '</div>' +
        '<div class="toast-message">' + message + '</div>' +
      '</div>' +
      '<div class="toast-close">' + icon('close') + '</div>';

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', function () {
      removeToast(toast);
    });

    container.appendChild(toast);

    // Auto-remove
    if (duration > 0) {
      setTimeout(function () {
        removeToast(toast);
      }, duration);
    }

    return toast;
  };

  function removeToast(toastEl) {
    if (!toastEl || !toastEl.parentNode) return;
    toastEl.classList.add('removing');
    setTimeout(function () {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 300);
  }

  /* ================================================================== */
  /*  MODAL                                                              */
  /* ================================================================== */

  /**
   * Create a modal overlay with title, content, and action buttons.
   *
   * @param {string} title — Modal title text
   * @param {string} content — HTML content string
   * @param {Array<{label: string, class?: string, onClick?: Function}>} [actions] — Action buttons
   * @returns {HTMLElement} The modal element (has .close() method)
   */
  UI.createModal = function (title, content, actions) {
    actions = actions || [];

    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    // Modal panel
    var modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    var header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML =
      '<h3>' + title + '</h3>' +
      '<div class="modal-close">' + icon('close') + '</div>';

    // Close button in header
    header.querySelector('.modal-close').addEventListener('click', function () {
      backdrop.close();
    });

    // Content body
    var body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = content;

    // Footer with actions
    var footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';
    footer.style.gap = 'var(--space-3)';
    footer.style.marginTop = 'var(--space-6)';

    actions.forEach(function (action) {
      var btn = document.createElement('button');
      btn.className = 'btn ' + (action.class || 'btn-secondary');
      btn.textContent = action.label;
      if (action.onClick) {
        btn.addEventListener('click', function () {
          action.onClick(btn, modal);
        });
      }
      footer.appendChild(btn);
    });

    // Add a default "Close" button if no actions provided
    if (actions.length === 0) {
      var closeBtn = document.createElement('button');
      closeBtn.className = 'btn btn-secondary';
      closeBtn.textContent = 'Close';
      closeBtn.addEventListener('click', function () { backdrop.close(); });
      footer.appendChild(closeBtn);
    }

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);

    // Click outside to close
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) backdrop.close();
    });

    // Escape key to close
    function onEsc(e) {
      if (e.key === 'Escape') {
        backdrop.close();
        document.removeEventListener('keydown', onEsc);
      }
    }
    document.addEventListener('keydown', onEsc);

    // Close method
    backdrop.close = function () {
      backdrop.style.opacity = '0';
      setTimeout(function () {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        document.removeEventListener('keydown', onEsc);
        document.body.style.overflow = '';
      }, 200);
    };

    backdrop.querySelector = modal.querySelector.bind(modal);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return backdrop;
  };

  /**
   * Create a confirmation dialog modal.
   *
   * @param {string} message — Confirmation message
   * @param {Function} onConfirm — Called when user confirms
   * @param {Function} [onCancel] — Called when user cancels
   * @param {Object} [options] — { title, confirmText, cancelText, danger }
   * @returns {HTMLElement}
   */
  UI.createConfirmDialog = function (message, onConfirm, onCancel, options) {
    options = options || {};

    var title = options.title || 'Confirm Action';
    var confirmText = options.confirmText || 'Confirm';
    var cancelText = options.cancelText || 'Cancel';
    var danger = options.danger || false;

    var actions = [
      {
        label: cancelText,
        class: 'btn-secondary',
        onClick: function () {
          modal.close();
          if (onCancel) onCancel();
        }
      },
      {
        label: confirmText,
        class: danger ? 'btn-danger' : 'btn-primary',
        onClick: function () {
          modal.close();
          if (onConfirm) onConfirm();
        }
      }
    ];

    var modal = UI.createModal(title, '<p style="color: var(--text-secondary); line-height: 1.6;">' + message + '</p>', actions);
    return modal;
  };

  /* ================================================================== */
  /*  DROPDOWN                                                           */
  /* ================================================================== */

  /**
   * Create a dropdown menu attached to a trigger element.
   *
   * @param {HTMLElement} triggerEl — The element that triggers the dropdown
   * @param {Array<{label: string, icon?: string, onClick?: Function, divider?: boolean}>} items
   * @returns {Object} { open, close, destroy } control methods
   */
  UI.createDropdown = function (triggerEl, items) {
    items = items || [];

    // Wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'dropdown';
    triggerEl.parentNode.insertBefore(wrapper, triggerEl);
    wrapper.appendChild(triggerEl);

    // Menu
    var menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    items.forEach(function (item) {
      if (item.divider) {
        var div = document.createElement('div');
        div.className = 'dropdown-divider';
        menu.appendChild(div);
        return;
      }

      var menuItem = document.createElement('div');
      menuItem.className = 'dropdown-item';
      menuItem.innerHTML = (item.icon ? '<span style="width:20px;text-align:center;">' + item.icon + '</span>' : '') +
        '<span>' + item.label + '</span>';

      if (item.onClick) {
        menuItem.addEventListener('click', function () {
          item.onClick();
          closeDropdown();
        });
      }

      menu.appendChild(menuItem);
    });

    wrapper.appendChild(menu);

    function openDropdown() {
      // Close other open dropdowns first
      document.querySelectorAll('.dropdown.open').forEach(function (dd) {
        if (dd !== wrapper) dd.classList.remove('open');
      });
      wrapper.classList.add('open');
    }

    function closeDropdown() {
      wrapper.classList.remove('open');
    }

    function destroy() {
      // Restore trigger to its parent
      if (wrapper.parentNode) {
        wrapper.parentNode.insertBefore(triggerEl, wrapper);
        wrapper.parentNode.removeChild(wrapper);
      }
      document.removeEventListener('click', outsideClickHandler);
    }

    // Toggle on trigger click
    triggerEl.addEventListener('click', function (e) {
      e.stopPropagation();
      if (wrapper.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on outside click
    function outsideClickHandler(e) {
      if (!wrapper.contains(e.target)) {
        closeDropdown();
      }
    }
    document.addEventListener('click', outsideClickHandler);

    return { open: openDropdown, close: closeDropdown, destroy: destroy, el: wrapper };
  };

  /* ================================================================== */
  /*  ACCORDION                                                          */
  /* ================================================================== */

  /**
   * Create an accordion component (returns HTML string).
   *
   * @param {Array<{title: string, content: string, open?: boolean}>} items
   * @returns {string} HTML string
   */
  UI.createAccordion = function (items) {
    if (!items || !items.length) return '';
    var id = Utils.generateId();

    return '<div class="accordion" data-accordion-id="' + id + '">' +
      items.map(function (item, i) {
        var isOpen = item.open || false;
        return '<div class="accordion-item' + (isOpen ? ' open' : '') + '">' +
          '<div class="accordion-header" data-accordion-index="' + i + '">' +
            '<span>' + item.title + '</span>' +
            '<span class="accordion-chevron">' + icon('chevronDown') + '</span>' +
          '</div>' +
          '<div class="accordion-body">' +
            '<div class="accordion-content">' + item.content + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  };

  /**
   * Initialize accordion click handlers on existing accordion DOM elements.
   * Call this after inserting accordion HTML into the DOM.
   */
  UI.initAccordions = function () {
    document.querySelectorAll('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var item = header.parentElement;
        var wasOpen = item.classList.contains('open');

        // Optionally: close siblings in the same accordion
        // var accordion = item.closest('.accordion');
        // if (accordion) accordion.querySelectorAll('.accordion-item').forEach(ai => ai.classList.remove('open'));

        item.classList.toggle('open', !wasOpen);
      });
    });
  };

  /* ================================================================== */
  /*  TABS                                                               */
  /* ================================================================== */

  /**
   * Create a tabbed interface (returns HTML string with data attributes
   * for the initTabs() handler to wire up).
   *
   * @param {Array<{id: string, label: string, content: string, active?: boolean}>} tabs
   * @returns {string} HTML string
   */
  UI.createTabs = function (tabs) {
    if (!tabs || !tabs.length) return '';
    var id = Utils.generateId();
    var activeId = (tabs.find(function (t) { return t.active; }) || tabs[0]).id;

    var tabsHtml = '<div class="tabs" data-tabs-id="' + id + '">';
    tabsHtml += tabs.map(function (tab) {
      return '<div class="tab' + (tab.id === activeId ? ' active' : '') + '" data-tab-id="' + tab.id + '">' + tab.label + '</div>';
    }).join('');
    tabsHtml += '</div>';

    var panelsHtml = '<div class="tab-panels" data-tabs-panels="' + id + '">';
    tabsHtml += panelsHtml;
    panelsHtml = tabsHtml; // re-assign trick won't work, let me fix

    // Build properly
    var full = tabsHtml + '<div class="tab-panels" data-tabs-panels="' + id + '">';
    full += tabs.map(function (tab) {
      return '<div class="tab-panel' + (tab.id === activeId ? '' : '" style="display:none') + '" data-tab-panel="' + tab.id + '">' + tab.content + '</div>';
    }).join('');
    full += '</div>';

    return full;
  };

  /**
   * Initialize tab switching on existing tab DOM elements.
   * Call this after inserting tab HTML into the DOM.
   */
  UI.initTabs = function () {
    document.querySelectorAll('.tabs').forEach(function (tabBar) {
      var tabsId = tabBar.getAttribute('data-tabs-id');
      var panelContainer = document.querySelector('[data-tabs-panels="' + tabsId + '"]');
      if (!panelContainer) return;

      tabBar.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var tabId = tab.getAttribute('data-tab-id');

          // Update active tab
          tabBar.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');

          // Show matching panel
          panelContainer.querySelectorAll('.tab-panel').forEach(function (panel) {
            var panelId = panel.getAttribute('data-tab-panel');
            if (panelId === tabId) {
              panel.style.display = '';
              panel.classList.add('active');
            } else {
              panel.style.display = 'none';
              panel.classList.remove('active');
            }
          });
        });
      });
    });
  };

  /* ================================================================== */
  /*  PROGRESS BAR                                                       */
  /* ================================================================== */

  /**
   * Create a progress bar (HTML string).
   *
   * @param {number} percent — 0-100
   * @param {string} [color='blue'] — 'blue', 'green', 'amber', 'red', 'purple', 'cyan'
   * @param {boolean} [showLabel=false] — Show percentage label
   * @returns {string} HTML string
   */
  UI.createProgressBar = function (percent, color, showLabel) {
    color = color || 'blue';
    var clamped = Math.max(0, Math.min(100, percent));

    var colorClassMap = {
      blue: '',
      green: 'progress-fill-green',
      amber: 'progress-fill-amber',
      red: 'progress-fill-red',
      purple: '', // uses gradient-primary (blue-purple)
      cyan: ''
    };

    var fillClass = colorClassMap[color] || '';
    var inlineStyle = '';
    if (color === 'purple') inlineStyle = 'background: var(--gradient-primary);';
    if (color === 'cyan') inlineStyle = 'background: linear-gradient(135deg, #06b6d4, #22d3ee);';

    var labelHtml = '';
    if (showLabel) {
      labelHtml = '<span style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);">' + Math.round(clamped) + '%</span>';
    }

    return '<div class="progress-bar" style="position:relative;">' +
      '<div class="progress-fill ' + fillClass + '" style="width:' + clamped + '%;' + inlineStyle + '"></div>' +
      labelHtml +
    '</div>';
  };

  /* ================================================================== */
  /*  STAT CARD                                                          */
  /* ================================================================== */

  /**
   * Create a stat card (HTML string).
   *
   * @param {string} label — e.g. "Total Volume"
   * @param {string} value — e.g. "$1.23B"
   * @param {number|string} [change] — e.g. 5.4 or "+5.40%"
   * @param {string} [iconSvg] — SVG string for the icon
   * @returns {string} HTML string
   */
  UI.createStatCard = function (label, value, change, iconSvg) {
    var changeNum = typeof change === 'number' ? change : parseFloat(change);
    var isUp = !isNaN(changeNum) && changeNum >= 0;
    var isDown = !isNaN(changeNum) && changeNum < 0;
    var hasChange = !isNaN(changeNum) && changeNum !== 0;

    var changeHtml = '';
    if (hasChange) {
      var changeStr = (changeNum > 0 ? '+' : '') + changeNum.toFixed(2) + '%';
      changeHtml = '<div class="stat-change ' + (isUp ? 'up' : 'down') + '">' +
        icon(isUp ? 'arrowUp' : 'arrowDown') +
        '<span>' + changeStr + '</span>' +
      '</div>';
    }

    return '<div class="stat-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">' +
        '<div class="stat-label">' + label + '</div>' +
        (iconSvg ? '<div class="toast-icon" style="color:var(--accent-blue);opacity:0.6;">' + iconSvg + '</div>' : '') +
      '</div>' +
      '<div class="stat-value">' + value + '</div>' +
      changeHtml +
    '</div>';
  };

  /* ================================================================== */
  /*  BADGE                                                              */
  /* ================================================================== */

  /**
   * Create a badge/tag (HTML string).
   *
   * @param {string} text — Badge text
   * @param {string} [type='blue'] — 'green', 'red', 'blue', 'purple', 'amber'
   * @returns {string} HTML string
   */
  UI.createBadge = function (text, type) {
    type = type || 'blue';
    return '<span class="badge badge-' + type + '">' + text + '</span>';
  };

  /* ================================================================== */
  /*  PAGINATION                                                         */
  /* ================================================================== */

  /**
   * Create a pagination control (HTML string).
   * After inserting into the DOM, call UI.initPagination() to wire up events.
   *
   * @param {number} currentPage — Current active page (1-based)
   * @param {number} totalPages — Total number of pages
   * @param {Function} [onChange] — Callback function (not wired via HTML)
   * @returns {string} HTML string
   */
  UI.createPagination = function (currentPage, totalPages, onChange) {
    if (totalPages <= 1) return '';

    var pages = [];
    var maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (var i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, current, and neighbors
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      var start = Math.max(2, currentPage - 1);
      var end = Math.min(totalPages - 1, currentPage + 1);
      for (var j = start; j <= end; j++) pages.push(j);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    var html = '<div class="pagination" data-pagination-page="' + currentPage + '" data-pagination-total="' + totalPages + '">';

    // Prev button
    html += '<button class="pagination-btn" data-pagination-action="prev"' + (currentPage <= 1 ? ' disabled style="opacity:0.3;pointer-events:none;"' : '') + '>' + icon('arrowLeft') + '</button>';

    // Page buttons
    pages.forEach(function (p) {
      if (p === '...') {
        html += '<span style="color:var(--text-muted);padding:0 var(--space-1);">...</span>';
      } else {
        html += '<button class="pagination-btn' + (p === currentPage ? ' active' : '') + '" data-pagination-page-btn="' + p + '">' + p + '</button>';
      }
    });

    // Next button
    html += '<button class="pagination-btn" data-pagination-action="next"' + (currentPage >= totalPages ? ' disabled style="opacity:0.3;pointer-events:none;"' : '') + '>' + icon('arrowRight') + '</button>';

    html += '</div>';

    // Store onChange callback for initPagination
    if (onChange) {
      // Use a data attribute approach or a WeakMap
      setTimeout(function () {
        var el = document.querySelector('.pagination[data-pagination-page="' + currentPage + '"]');
        if (el) el._onChange = onChange;
      }, 0);
    }

    return html;
  };

  /**
   * Initialize pagination click handlers on existing pagination elements.
   */
  UI.initPagination = function () {
    document.querySelectorAll('.pagination').forEach(function (pg) {
      pg.addEventListener('click', function (e) {
        var btn = e.target.closest('.pagination-btn');
        if (!btn || btn.disabled) return;

        var current = parseInt(pg.getAttribute('data-pagination-page'), 10);
        var total = parseInt(pg.getAttribute('data-pagination-total'), 10);
        var newPage = current;

        if (btn.hasAttribute('data-pagination-action')) {
          var action = btn.getAttribute('data-pagination-action');
          if (action === 'prev') newPage = Math.max(1, current - 1);
          if (action === 'next') newPage = Math.min(total, current + 1);
        } else if (btn.hasAttribute('data-pagination-page-btn')) {
          newPage = parseInt(btn.getAttribute('data-pagination-page-btn'), 10);
        }

        if (newPage !== current && pg._onChange) {
          pg._onChange(newPage);
        }
      });
    });
  };

  /* ================================================================== */
  /*  SKELETON LOADING                                                   */
  /* ================================================================== */

  /**
   * Create skeleton loading placeholders (HTML string).
   *
   * @param {string} [type='card'] — 'card', 'text', 'table', 'profile'
   * @param {number} [count=3] — Number of skeleton items
   * @returns {string} HTML string
   */
  UI.createSkeleton = function (type, count) {
    type = type || 'card';
    count = count || 3;

    var pulseStyle = 'animation: pulse 1.5s ease-in-out infinite; background: var(--bg-tertiary); border-radius: var(--radius-md);';
    var pulseCSS = '@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }';
    var styleTag = '<style>' + pulseCSS + '</style>';

    var items = '';

    for (var i = 0; i < count; i++) {
      switch (type) {
        case 'card':
          items += '<div style="background:var(--bg-card);border:1px solid var(--border-primary);border-radius:var(--radius-xl);padding:var(--space-6);">' +
            '<div style="' + pulseStyle + 'width:60%;height:20px;margin-bottom:var(--space-4);"></div>' +
            '<div style="' + pulseStyle + 'width:40%;height:28px;margin-bottom:var(--space-4);"></div>' +
            '<div style="' + pulseStyle + 'width:80%;height:14px;margin-bottom:var(--space-2);"></div>' +
            '<div style="' + pulseStyle + 'width:60%;height:14px;"></div>' +
          '</div>';
          break;

        case 'text':
          items += '<div style="margin-bottom:var(--space-4);">' +
            '<div style="' + pulseStyle + 'width:100%;height:14px;margin-bottom:var(--space-2);"></div>' +
            '<div style="' + pulseStyle + 'width:90%;height:14px;margin-bottom:var(--space-2);"></div>' +
            '<div style="' + pulseStyle + 'width:70%;height:14px;"></div>' +
          '</div>';
          break;

        case 'table':
          items += '<div style="display:flex;gap:var(--space-4);padding:var(--space-3) 0;border-bottom:1px solid var(--border-secondary);">' +
            '<div style="' + pulseStyle + 'flex:2;height:16px;"></div>' +
            '<div style="' + pulseStyle + 'flex:1;height:16px;"></div>' +
            '<div style="' + pulseStyle + 'flex:1;height:16px;"></div>' +
            '<div style="' + pulseStyle + 'flex:1;height:16px;"></div>' +
          '</div>';
          break;

        case 'profile':
          items += '<div style="display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) 0;">' +
            '<div style="' + pulseStyle + 'width:48px;height:48px;border-radius:var(--radius-full);flex-shrink:0;"></div>' +
            '<div style="flex:1;">' +
              '<div style="' + pulseStyle + 'width:50%;height:16px;margin-bottom:var(--space-2);"></div>' +
              '<div style="' + pulseStyle + 'width:30%;height:14px;"></div>' +
            '</div>' +
          '</div>';
          break;

        default:
          items += '<div style="' + pulseStyle + 'height:100px;"></div>';
      }
    }

    return styleTag + '<div class="skeleton-group">' + items + '</div>';
  };

  /* ================================================================== */
  /*  SEARCH BAR                                                         */
  /* ================================================================== */

  /**
   * Create a search bar (HTML string). Wire up via initSearchBars() or
   * pass onSearch callback which is stored via data attribute.
   *
   * @param {string} [placeholder='Search...'] — Input placeholder
   * @param {Function} [onSearch] — Callback(text) fired on input (debounced)
   * @returns {string} HTML string
   */
  UI.createSearchBar = function (placeholder, onSearch) {
    placeholder = placeholder || 'Search...';
    var id = Utils.generateId();

    var html = '<div class="search-bar" data-search-id="' + id + '">' +
      icon('search') +
      '<input type="text" placeholder="' + placeholder + '" data-search-input="' + id + '" autocomplete="off" />' +
    '</div>';

    // Store callback
    if (onSearch) {
      setTimeout(function () {
        var input = document.querySelector('[data-search-input="' + id + '"]');
        if (input) {
          input._onSearch = onSearch;
          input.addEventListener('input', Utils.debounce(function () {
            if (input._onSearch) input._onSearch(input.value);
          }, 300));
        }
      }, 0);
    }

    return html;
  };

  /* ================================================================== */
  /*  EMPTY STATE                                                        */
  /* ================================================================== */

  /**
   * Create an empty state placeholder (HTML string).
   *
   * @param {string} [iconSvg] — SVG icon string (default: box icon)
   * @param {string} [title='No data found'] — Title text
   * @param {string} [description=''] — Description text
   * @returns {string} HTML string
   */
  UI.createEmptyState = function (iconSvg, title, description) {
    iconSvg = iconSvg || icon('empty');
    title = title || 'No data found';
    description = description || '';

    return '<div class="empty-state">' +
      '<div class="empty-state-icon">' + iconSvg + '</div>' +
      '<h4>' + title + '</h4>' +
      (description ? '<p>' + description + '</p>' : '') +
    '</div>';
  };

  /* ================================================================== */
  /*  TOOLTIP                                                            */
  /* ================================================================== */

  /**
   * Create a tooltip-wrapped element (HTML string).
   * Uses the CSS .tooltip class with data-tooltip attribute.
   *
   * @param {string} text — The visible text/trigger
   * @param {string} tooltipContent — The tooltip text (shown on hover)
   * @param {string} [tag='span'] — HTML tag for the wrapper
   * @returns {string} HTML string
   */
  UI.createTooltip = function (text, tooltipContent, tag) {
    tag = tag || 'span';
    return '<' + tag + ' class="tooltip" data-tooltip="' + tooltipContent.replace(/"/g, '&quot;') + '">' + text + '</' + tag + '>';
  };

  /* ================================================================== */
  /*  LOADING STATE                                                      */
  /* ================================================================== */

  /**
   * Show a loading overlay inside a container.
   *
   * @param {HTMLElement|string} container — Element or CSS selector
   */
  UI.showLoading = function (container) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return;

    // Save current content
    if (!container._savedContent) {
      container._savedContent = container.innerHTML;
      container._savedDisplay = container.style.display || '';
    }

    container.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-16);gap:var(--space-4);">' +
        '<div class="spinner"></div>' +
        '<span style="color:var(--text-tertiary);font-size:var(--text-sm);">Loading...</span>' +
      '</div>';
  };

  /**
   * Restore the original content of a container after loading.
   *
   * @param {HTMLElement|string} container — Element or CSS selector
   */
  UI.hideLoading = function (container) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container || !container._savedContent) return;

    container.innerHTML = container._savedContent;
    container.style.display = container._savedDisplay;
    delete container._savedContent;
    delete container._savedDisplay;
  };

  /* ================================================================== */
  /*  RIPPLE EFFECT                                                      */
  /* ================================================================== */

  /**
   * Add a Material Design-style ripple effect to a button element.
   * The ripple spawns at the click position and expands outward.
   *
   * @param {HTMLElement} buttonEl — The button element
   */
  UI.addRippleEffect = function (buttonEl) {
    if (!buttonEl) return;

    buttonEl.style.position = 'relative';
    buttonEl.style.overflow = 'hidden';

    buttonEl.addEventListener('click', function (e) {
      // Remove any existing ripple
      var existing = buttonEl.querySelector('.ripple');
      if (existing) existing.remove();

      // Calculate ripple size and position
      var rect = buttonEl.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;

      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      buttonEl.appendChild(ripple);

      // Remove after animation
      setTimeout(function () {
        if (ripple.parentNode) ripple.remove();
      }, 600);
    });
  };

  /* ================================================================== */
  /*  CONVENIENCE — INIT ALL                                             */
  /* ================================================================== */

  /**
   * Initialize all interactive UI components in the document.
   * Call this after dynamically inserting UI HTML.
   */
  UI.initAll = function () {
    UI.initAccordions();
    UI.initTabs();
    UI.initPagination();

    // Add ripple to all .btn elements
    document.querySelectorAll('.btn').forEach(function (btn) {
      UI.addRippleEffect(btn);
    });
  };

  /* ================================================================== */
  /*  EXPOSE                                                             */
  /* ================================================================== */

  window.UI = UI;

  // Auto-init on DOMContentLoaded if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UI.initAll);
  } else {
    UI.initAll();
  }

})();