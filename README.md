# CryptoVerse 


A professional cryptocurrency education and paper trading platform designed for teenagers aged 13–18. Learn blockchain, investing, market analysis, and crypto safety through realistic interactive simulations — with zero real money at risk.

## Features

- **Learning Hub** — Interactive modules on History of Money, Blockchain, and Bitcoin
- **Trading Simulator** — Paper trade 6 cryptocurrencies with $10,000 virtual money
- **Candlestick Charts** — Professional charts with MA, RSI, MACD indicators
- **Market Engine** — Realistic simulated prices with news-driven volatility
- **AI Market Analysis** — Simulated trend/momentum/sentiment analysis
- **Scam Awareness Centre** — Interactive rug pull, pump & dump, fake giveaway scenarios + 20+ myth busters
- **Blockchain Beyond Crypto** — 8 real-world application case studies
- **Teen Investor Academy** — 8 investing lessons with interactive scenarios
- **Achievement System** — 15 achievements across 4 tiers with XP rewards
- **Leaderboards** — Compete against 30 simulated users
- **Final Challenge** — 30-day simulation with Investor Report Card
- **Chart Challenge** — Mini-game predicting price movements

## Tech Stack

- Vanilla HTML5, CSS3, JavaScript (ES6+)
- No frameworks (React, Vue, Angular, etc.)
- Canvas API for professional charts
- LocalStorage for state persistence
- Dark fintech UI with glassmorphism

## Getting Started

1. Clone the repository
2. Open `index.html` in any modern browser
3. Start learning!

No build step, no dependencies, no server required.

## Project Structure

```
CryptoVerse-Academy/
├── index.html                 # Main SPA entry
├── css/
│   ├── variables.css          # Design tokens & CSS variables
│   ├── base.css               # Reset, typography, animations
│   ├── components.css         # Reusable UI component styles
│   └── pages.css              # Page-specific styles
├── js/
│   ├── app.js                 # Main application entry point
│   ├── store.js               # State management (localStorage)
│   ├── router.js              # Hash-based SPA router
│   ├── data/
│   │   ├── users.js           # 30 fictional leaderboard users
│   │   ├── market.js          # Asset definitions & 180-day OHLCV data
│   │   ├── news.js            # 105 market news events
│   │   ├── quizzes.js         # 102 quiz questions
│   │   ├── achievements.js    # 15 achievement definitions
│   │   └── learning.js        # 6 learning modules content
│   ├── utils/
│   │   ├── helpers.js         # Formatting, math, DOM utilities
│   │   └── market-engine.js   # Simulated market with GBM
│   ├── components/
│   │   ├── ui.js              # Toast, modal, tabs, etc.
│   │   └── charts.js          # Canvas candlestick/line/pie charts
│   └── pages/
│       ├── landing.js         # Landing page
│       ├── learning.js        # Learning Hub (3 modules)
│       ├── trading.js         # Trading Simulator
│       ├── news.js            # Market News Engine
│       ├── scams.js           # Scam Awareness Centre
│       ├── blockchain-apps.js # Blockchain Beyond Crypto
│       ├── academy.js         # Teen Investor Academy
│       ├── achievements.js    # Achievement Dashboard
│       ├── leaderboard.js     # Leaderboards
│       ├── profile.js         # User Profile & Progress
│       └── final-challenge.js # Final Challenge & Report Card
└── assets/                    # Icons, badges, images
```

## Disclaimer

This platform is for **educational purposes only**. It does not provide financial advice. All trading is simulated with virtual currency. No real money is involved.

## License

MIT
