/**
 * CryptoVerse Academy — Market Data
 * 6 crypto assets with 180 days of OHLCV candle data
 */
(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     Deterministic PRNG (mulberry32) — fixed seed
     so candle data is identical on every load
     ───────────────────────────────────────────── */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ─────────────────────────────────────────────
     generateCandleData(basePrice, volatility, days, trend)
     Returns an array of { date, open, high, low, close, volume }

     Parameters
     ----------
     basePrice  : number   — starting price
     volatility : number   — daily volatility factor (0-1, e.g. 0.02 = 2%)
     days       : number   — number of candles to generate
     trend      : number   — net drift over the period (-1 to +1)
   ───────────────────────────────────────────── */
  function generateCandleData(basePrice, volatility, days, trend) {
    var rng = mulberry32(Math.round(basePrice * 1000 + volatility * 10000 + days * 7 + trend * 100));
    var data = [];
    var price = basePrice;
    var now = new Date();
    var dailyDrift = trend / days;

    // Occasionally inject spike / correction events
    var spikeDays = {};
    var i;
    for (i = 0; i < Math.floor(days / 25); i++) {
      spikeDays[Math.floor(rng() * days)] = (rng() > 0.5 ? 1 : -1) * (0.03 + rng() * 0.06);
    }

    for (i = days - 1; i >= 0; i--) {
      var d = new Date(now.getTime() - i * 86400000);
      var iso = d.toISOString().split("T")[0];

      // Gaussian-ish via Box-Muller (simplified)
      var u1 = rng(), u2 = rng();
      var normal = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);

      var change = normal * volatility * price;
      // Add trend drift
      change += price * dailyDrift;
      // Add spike if scheduled
      if (spikeDays[i]) change += price * spikeDays[i];

      var open = price;
      var close = Math.max(price + change, price * 0.5); // floor at 50% of price
      var wickUp = Math.abs(close - open) * (0.3 + rng() * 1.5);
      var wickDown = Math.abs(close - open) * (0.3 + rng() * 1.5);
      var high = Math.max(open, close) + wickUp;
      var low = Math.max(Math.min(open, close) - wickDown, price * 0.4);

      // Realistic volume: base + random + surge on big moves
      var baseVol = 1000000000 + rng() * 5000000000;
      var moveRatio = Math.abs(change) / price;
      var volume = Math.round(baseVol * (1 + moveRatio * 30 + rng() * 0.8));

      data.push({
        date: iso,
        open: +open.toFixed(2),
        high: +high.toFixed(2),
        low: +low.toFixed(2),
        close: +close.toFixed(2),
        volume: volume
      });

      price = close;
    }

    return data;
  }

  /* ─────────────────────────────────────────────
     Asset Definitions
     ───────────────────────────────────────────── */
  var assets = [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "₿",
      color: "#F7931A",
      currentPrice: 68420.50,
      marketCap: 1345000000000,
      volume24h: 38200000000,
      description: "Bitcoin is the first decentralized cryptocurrency, created in 2009 by the pseudonymous Satoshi Nakamoto. It introduced the concept of a peer-to-peer electronic cash system secured by proof-of-work mining, with a capped supply of 21 million coins.",
      candleParams: { basePrice: 62000, volatility: 0.018, days: 180, trend: 0.10 },
      candles: null
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      icon: "Ξ",
      color: "#627EEA",
      currentPrice: 3680.25,
      marketCap: 443000000000,
      volume24h: 18500000000,
      description: "Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). Created by Vitalik Buterin and launched in 2015, it transitioned to proof-of-stake in 2022 via 'The Merge,' dramatically reducing its energy consumption.",
      candleParams: { basePrice: 3200, volatility: 0.025, days: 180, trend: 0.15 },
      candles: null
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      icon: "◎",
      color: "#9945FF",
      currentPrice: 172.80,
      marketCap: 78200000000,
      volume24h: 4200000000,
      description: "Solana is a high-performance blockchain supporting decentralized applications with sub-second finality and extremely low fees. Its unique architecture combines proof-of-history with proof-of-stake for high throughput, capable of processing thousands of transactions per second.",
      candleParams: { basePrice: 135, volatility: 0.035, days: 180, trend: 0.28 },
      candles: null
    },
    {
      id: "xrp",
      name: "XRP",
      symbol: "XRP",
      icon: "✕",
      color: "#23292F",
      currentPrice: 0.6234,
      marketCap: 34100000000,
      volume24h: 2100000000,
      description: "XRP is the native cryptocurrency of the XRP Ledger, designed for fast, low-cost international payments. Created by Ripple Labs, it enables real-time gross settlement and currency exchange, processing transactions in 3-5 seconds with minimal fees.",
      candleParams: { basePrice: 0.55, volatility: 0.022, days: 180, trend: 0.13 },
      candles: null
    },
    {
      id: "doge",
      name: "Dogecoin",
      symbol: "DOGE",
      icon: "Ð",
      color: "#C2A633",
      currentPrice: 0.1247,
      marketCap: 17800000000,
      volume24h: 1600000000,
      description: "Dogecoin started as a meme cryptocurrency in 2013 featuring the Shiba Inu dog from the 'Doge' meme. Despite its humorous origins, it developed a passionate community and has been used for tipping and charitable donations, gaining mainstream attention through celebrity endorsements.",
      candleParams: { basePrice: 0.09, volatility: 0.04, days: 180, trend: 0.38 },
      candles: null
    },
    {
      id: "ada",
      name: "Cardano",
      symbol: "ADA",
      icon: "₳",
      color: "#0033AD",
      currentPrice: 0.4512,
      marketCap: 15900000000,
      volume24h: 890000000,
      description: "Cardano is a proof-of-stake blockchain platform founded by Ethereum co-founder Charles Hoskinson. It is built on a research-driven approach using peer-reviewed academic papers, and supports smart contracts through its Plutus programming language.",
      candleParams: { basePrice: 0.35, volatility: 0.028, days: 180, trend: 0.29 },
      candles: null
    }
  ];

  /* ─────────────────────────────────────────────
     Generate candle data for each asset
     ───────────────────────────────────────────── */
  assets.forEach(function (asset) {
    var p = asset.candleParams;
    asset.candles = generateCandleData(p.basePrice, p.volatility, p.days, p.trend);
    // Update currentPrice to the last close
    asset.currentPrice = asset.candles[asset.candles.length - 1].close;
    delete asset.candleParams;
  });

  /* ─────────────────────────────────────────────
     Public API
     ───────────────────────────────────────────── */
  window.DataMarket = {
    assets: assets,
    generateCandleData: generateCandleData,

    getAsset: function (id) {
      return assets.find(function (a) { return a.id === id; });
    },

    getCandles: function (id, days) {
      var asset = this.getAsset(id);
      if (!asset) return [];
      if (days) return asset.candles.slice(-days);
      return asset.candles;
    },

    getLatestPrice: function (id) {
      var asset = this.getAsset(id);
      return asset ? asset.currentPrice : 0;
    },

    getPriceChange: function (id, days) {
      var candles = this.getCandles(id, days + 1);
      if (candles.length < 2) return 0;
      var first = candles[0].close;
      var last = candles[candles.length - 1].close;
      return +((last - first) / first * 100).toFixed(2);
    }
  };
})();