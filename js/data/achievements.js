/**
 * CryptoVerse Academy — Achievement Definitions
 * 15 achievements across learning, trading, social, and challenge categories
 */
(function () {
  "use strict";

  window.DataAchievements = [
    {
      id: "blockchain-beginner",
      name: "Blockchain Beginner",
      description: "Complete your first learning module and take your first step into the world of cryptocurrency and blockchain technology.",
      icon: "badge-blockchain",
      xpReward: 50,
      category: "learning",
      condition: "Complete Module 1: History of Money",
      tier: "bronze"
    },
    {
      id: "crypto-explorer",
      name: "Crypto Explorer",
      description: "Dive into the blockchain explorer and view your first set of historical candle data for any cryptocurrency asset.",
      icon: "badge-compass",
      xpReward: 75,
      category: "learning",
      condition: "View candle chart data for at least 3 different assets",
      tier: "bronze"
    },
    {
      id: "chart-analyst",
      name: "Chart Analyst",
      description: "Demonstrate your understanding of market data by correctly identifying price trends across multiple cryptocurrency charts.",
      icon: "badge-chart",
      xpReward: 100,
      category: "learning",
      condition: "View candle charts for all 6 assets and spend at least 3 minutes on the market page",
      tier: "silver"
    },
    {
      id: "scam-detector",
      name: "Scam Detector",
      description: "Prove your ability to identify crypto scams by scoring 80% or higher on the Scam Awareness quiz module.",
      icon: "badge-shield",
      xpReward: 100,
      category: "learning",
      condition: "Score 80% or higher on all Scam Awareness quiz questions",
      tier: "silver"
    },
    {
      id: "portfolio-builder",
      name: "Portfolio Builder",
      description: "Construct your first simulated crypto portfolio by allocating funds across at least three different digital assets.",
      icon: "badge-portfolio",
      xpReward: 100,
      category: "trading",
      condition: "Create a simulated portfolio with holdings in 3 or more assets",
      tier: "silver"
    },
    {
      id: "market-strategist",
      name: "Market Strategist",
      description: "Analyze recent news events and use your knowledge to correctly predict the sentiment impact on at least 5 market scenarios.",
      icon: "badge-strategy",
      xpReward: 150,
      category: "trading",
      condition: "Correctly identify news sentiment for 5 consecutive news events in the news quiz",
      tier: "silver"
    },
    {
      id: "blockchain-expert",
      name: "Blockchain Expert",
      description: "Master the fundamentals of blockchain technology by completing all blockchain-related learning content and scoring top marks on the quiz.",
      icon: "badge-expert",
      xpReward: 200,
      category: "learning",
      condition: "Complete Module 2: Blockchain Explained and score 90%+ on the blockchain quiz",
      tier: "gold"
    },
    {
      id: "financial-thinker",
      name: "Financial Thinker",
      description: "Show a deep understanding of investment principles by completing the investing module and applying concepts like diversification and risk management.",
      icon: "badge-brain",
      xpReward: 200,
      category: "learning",
      condition: "Complete Module 6: Investing Principles and score 85%+ on the investing quiz",
      tier: "gold"
    },
    {
      id: "crypto-scholar",
      name: "Crypto Scholar",
      description: "Complete all six learning modules and demonstrate comprehensive knowledge across every area of cryptocurrency education.",
      icon: "badge-scholar",
      xpReward: 300,
      category: "learning",
      condition: "Complete all 6 learning modules (100% learning progress)",
      tier: "gold"
    },
    {
      id: "market-master",
      name: "Market Master",
      description: "Achieve an outstanding overall quiz accuracy of 90% or higher across all quiz modules, proving mastery of cryptocurrency concepts.",
      icon: "badge-master",
      xpReward: 350,
      category: "challenge",
      condition: "Achieve 90% or higher overall quiz accuracy across all completed quizzes",
      tier: "gold"
    },
    {
      id: "diversified-investor",
      name: "Diversified Investor",
      description: "Build and maintain a well-diversified simulated portfolio that includes at least five different cryptocurrency assets.",
      icon: "badge-diversify",
      xpReward: 150,
      category: "trading",
      condition: "Hold positions in 5 or more different assets simultaneously in your simulated portfolio",
      tier: "silver"
    },
    {
      id: "risk-manager",
      name: "Risk Manager",
      description: "Demonstrate disciplined risk management by maintaining a low-risk score and consistent trading patterns in your simulated portfolio over time.",
      icon: "badge-risk",
      xpReward: 200,
      category: "trading",
      condition: "Maintain a risk score of 4 or lower and a consistency score of 7 or higher for 14 consecutive days",
      tier: "gold"
    },
    {
      id: "quiz-champion",
      name: "Quiz Champion",
      description: "Answer 50 quiz questions correctly across all modules, showing consistent knowledge and dedication to learning.",
      icon: "badge-trophy",
      xpReward: 250,
      category: "challenge",
      condition: "Correctly answer a cumulative total of 50 quiz questions across all modules",
      tier: "gold"
    },
    {
      id: "challenge-conqueror",
      name: "Challenge Conqueror",
      description: "Complete every daily challenge offered for an entire week, showing consistent dedication to your cryptocurrency education journey.",
      icon: "badge-challenge",
      xpReward: 300,
      category: "challenge",
      condition: "Complete all daily challenges for 7 consecutive days",
      tier: "platinum"
    },
    {
      id: "dedication-award",
      name: "Dedication Award",
      description: "Log in and engage with CryptoVerse Academy for 30 consecutive days, demonstrating exceptional commitment to learning about cryptocurrency.",
      icon: "badge-dedication",
      xpReward: 500,
      category: "social",
      condition: "Log in and complete at least one activity on 30 consecutive days",
      tier: "platinum"
    }
  ];
})();