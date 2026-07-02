/**
 * CryptoVerse Academy — Hash-Based SPA Router
 * ==============================================
 * A lightweight, zero-dependency router that maps URL hash fragments
 * (e.g. `#/trading/bitcoin`) to page renderer functions.
 *
 * Features:
 *   - Parameterised routes  (`/trading/:asset` → `{ asset: "bitcoin" }`)
 *   - Default / fallback route
 *   - Programmatic navigation via `Router.navigate(path)`
 *   - 'routeChanged' CustomEvent dispatched on every navigation
 *   - Automatic scroll-to-top on route change
 *
 * Usage:
 *   Router.register('/',           renderHome);
 *   Router.register('/trading/:asset', renderTrading);
 *   Router.setDefaultRenderer(render404);
 *   Router.start();
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Internal state                                                     */
  /* ------------------------------------------------------------------ */

  /** @type {Map<string, { pattern: RegExp, paramNames: string[], renderer: Function }>} */
  const routes = new Map();

  /** @type {Function|null} Fallback renderer when no route matches */
  let defaultRenderer = null;

  /** @type {Object|null} Current matched route info */
  let currentRoute = null;

  /** The base hash prefix we expect (empty string = no prefix). */
  const HASH_PREFIX = '';

  /* ------------------------------------------------------------------ */
  /*  Route parsing                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Convert a route pattern like '/trading/:asset' into a RegExp
   * and extract the parameter names.
   *
   * @param  {string} pathPattern - e.g. '/trading/:asset' or '/module/:id/lesson/:step'
   * @return {{ pattern: RegExp, paramNames: string[] }}
   */
  function compileRoute(pathPattern) {
    // Escape everything except `:param` segments
    const paramNames = [];
    const regexStr = pathPattern.replace(
      /:([a-zA-Z_][a-zA-Z0-9_]*)/g,
      function (_, paramName) {
        paramNames.push(paramName);
        return '([^/]+)'; // capture until next slash or end
      }
    );

    // Allow optional trailing slash
    const fullPattern = new RegExp('^' + regexStr + '/?$');
    return { pattern: fullPattern, paramNames: paramNames };
  }

  /**
   * Try to match a raw path (without leading #) against registered routes.
   *
   * @param  {string} path - e.g. '' or '/trading/bitcoin'
   * @return {{ renderer: Function, params: Object } | null}
   */
  function matchRoute(path) {
    // Normalise: strip leading/trailing whitespace, ensure no double slashes
    const normalised = path.replace(/\s+/g, '').replace(/\/+/g, '/');

    for (const [patternStr, route] of routes) {
      const match = route.pattern.exec(normalised);
      if (match) {
        // Build params object from captured groups
        const params = {};
        route.paramNames.forEach(function (name, i) {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        return { renderer: route.renderer, params: params, pattern: patternStr };
      }
    }

    return null; // no match
  }

  /* ------------------------------------------------------------------ */
  /*  Navigation                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Internal: resolve the current hash, find the matching route,
   * invoke its renderer, and fire events.
   */
  function handleRouteChange() {
    // Strip the '#' and any prefix
    let hash = window.location.hash || '#/';
    let path = hash.substring(1); // remove leading '#'

    // Remove leading slash for consistent matching, but keep it for route patterns
    if (path.length === 0 || path === '/') {
      path = '/';
    }

    const matched = matchRoute(path);

    let renderer;
    let params = {};
    let matchedPattern = null;

    if (matched) {
      renderer = matched.renderer;
      params = matched.params;
      matchedPattern = matched.pattern;
    } else if (defaultRenderer) {
      renderer = defaultRenderer;
    } else {
      console.warn('[Router] No route matched', path, 'and no default renderer set.');
      return;
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Build route info object
    const routeInfo = {
      path: path,
      params: params,
      pattern: matchedPattern,
      hash: hash,
      timestamp: Date.now(),
      previous: currentRoute ? { path: currentRoute.path, pattern: currentRoute.pattern } : null,
    };

    currentRoute = routeInfo;

    // Invoke the renderer with params
    try {
      renderer(params, routeInfo);
    } catch (err) {
      console.error('[Router] Renderer error for path', path, ':', err);
    }

    // Dispatch custom event for any external listeners
    window.dispatchEvent(new CustomEvent('routeChanged', { detail: routeInfo }));
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  const Router = {
    /**
     * Register a route pattern with its renderer function.
     *
     * @param {string}   pathPattern - e.g. '/', '/trading/:asset', '/module/:id/lesson/:step'
     * @param {Function} renderer    - Called with (params, routeInfo) on match
     */
    register: function register(pathPattern, renderer) {
      if (typeof renderer !== 'function') {
        throw new TypeError('[Router] renderer must be a function');
      }

      const compiled = compileRoute(pathPattern);
      routes.set(pathPattern, {
        pattern: compiled.pattern,
        paramNames: compiled.paramNames,
        renderer: renderer,
      });

      return this; // allow chaining
    },

    /**
     * Set the default/fallback renderer when no route matches.
     *
     * @param {Function} renderer - Called with ({}, routeInfo)
     */
    setDefaultRenderer: function setDefaultRenderer(renderer) {
      if (typeof renderer !== 'function') {
        throw new TypeError('[Router] default renderer must be a function');
      }
      defaultRenderer = renderer;
      return this;
    },

    /**
     * Programmatically navigate to a path.
     * Updates `window.location.hash` which triggers `hashchange`.
     *
     * @param {string} path - e.g. '/', '/trading/bitcoin'
     */
    navigate: function navigate(path) {
      // Ensure path starts with '/'
      const normalised = path.startsWith('/') ? path : '/' + path;
      window.location.hash = HASH_PREFIX + normalised;
    },

    /**
     * Start the router. Reads the current hash, resolves the route,
     * and begins listening for hashchange events.
     *
     * Call this once after all routes are registered.
     */
    start: function start() {
      // Listen for hash changes
      window.addEventListener('hashchange', handleRouteChange);

      // Render the initial route
      handleRouteChange();

      console.log('[Router] Started —', routes.size, 'route(s) registered');
    },

    /**
     * Stop listening for hash changes (useful for teardown/testing).
     */
    stop: function stop() {
      window.removeEventListener('hashchange', handleRouteChange);
    },

    /**
     * Get info about the currently active route.
     *
     * @return {Object|null} Current route info or null if not started
     */
    getCurrentRoute: function getCurrentRoute() {
      return currentRoute ? { ...currentRoute } : null;
    },

    /**
     * Check whether a given path would match any registered route.
     *
     * @param  {string}  path
     * @return {boolean}
     */
    hasRoute: function hasRoute(path) {
      return matchRoute(path) !== null;
    },

    /**
     * Return all registered route patterns (for debugging).
     *
     * @return {string[]}
     */
    getRegisteredRoutes: function getRegisteredRoutes() {
      return Array.from(routes.keys());
    },
  };

  /* ------------------------------------------------------------------ */
  /*  Export to global scope                                             */
  /* ------------------------------------------------------------------ */
  window.Router = Router;
})();