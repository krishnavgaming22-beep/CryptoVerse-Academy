/**
 * CryptoVerse Academy — User Data
 * 30 fictional teen user profiles for the leaderboard
 */
(function () {
  "use strict";

  const AVATAR_PALETTE = [
    "#6C5CE7", "#0984E3", "#00B894", "#FDCB6E",
    "#E17055", "#D63031", "#A29BFE", "#74B9FF",
    "#55EFC4", "#FFEAA7", "#FAB1A0", "#FF7675",
    "#DFE6E9", "#B2BEC3", "#81ECEC", "#FD79A8"
  ];

  const FIRST_NAMES = [
    "Aiden", "Zara", "Marcus", "Priya", "Liam",
    "Sofia", "Kai", "Amara", "Ethan", "Mei",
    "Noah", "Aaliyah", "Jackson", "Yuki", "Oliver",
    "Fatima", "Lucas", "Isabella", "Jayden", "Ravi",
    "Mia", "Dylan", "Leilani", "Carlos", "Harper",
    "Arjun", "Chloe", "Tyler", "Ananya", "Riley"
  ];

  const HANDLES = [
    "crypto_aiden", "zchainz", "marcusx_hodl", "priyaprotocol", "liam_sats",
    "sofia_sol", "kai_node", "amara_defi", "ethan_block", "mei_hash",
    "noah_digs", "aaliyah_21m", "jack_sats", "yuki_chain", "oliver_keys",
    "fatima_coin", "lucas_gas", "bella_dao", "jay_crypto", "ravi_eth",
    "mia_maxi", "dylan_dca", "lei_luna", "carlos_btc", "harper_hodl",
    "arjun_algo", "chloe_0x", "tyler_tv", "ananya_ada", "riley_rug"
  ];

  function randomBetween(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDate(daysAgoMin, daysAgoMax) {
    const now = new Date();
    const daysAgo = randomInt(daysAgoMin, daysAgoMax);
    const d = new Date(now.getTime() - daysAgo * 86400000);
    return d.toISOString().split("T")[0];
  }

  function makeUser(index, overrides) {
    const name = FIRST_NAMES[index];
    const handle = HANDLES[index];
    const color = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
    const isTop = index < 3;

    const user = {
      id: index + 1,
      firstName: name,
      username: handle,
      avatarColor: color,
      xp: isTop ? randomInt(7500, 9500) : randomInt(50, 7400),
      portfolioGrowth: isTop
        ? randomBetween(45, 85)
        : randomBetween(-15, 84),
      learningProgress: isTop
        ? randomInt(88, 100)
        : randomInt(0, 92),
      quizAccuracy: isTop
        ? randomBetween(90, 98)
        : randomBetween(40, 94),
      riskScore: isTop ? randomInt(3, 6) : randomInt(1, 10),
      consistencyScore: isTop ? randomInt(8, 10) : randomInt(1, 9),
      joinDate: randomDate(10, 90),
      totalTrades: isTop ? randomInt(100, 200) : randomInt(5, 99),
      rank: 0
    };

    return Object.assign(user, overrides || {});
  }

  // --- 30 User Profiles ---
  const users = [
    makeUser(0, { xp: 9500, portfolioGrowth: 78.4, learningProgress: 100, quizAccuracy: 97.2, riskScore: 4, consistencyScore: 10, totalTrades: 187 }),
    makeUser(1, { xp: 9120, portfolioGrowth: 82.1, learningProgress: 98, quizAccuracy: 95.8, riskScore: 3, consistencyScore: 9, totalTrades: 165 }),
    makeUser(2, { xp: 8740, portfolioGrowth: 71.5, learningProgress: 95, quizAccuracy: 93.4, riskScore: 5, consistencyScore: 9, totalTrades: 198 }),
    makeUser(3, { xp: 7100, portfolioGrowth: 52.3, learningProgress: 82, quizAccuracy: 88.0, riskScore: 6, consistencyScore: 7, totalTrades: 92 }),
    makeUser(4, { xp: 6540, portfolioGrowth: 44.7, learningProgress: 78, quizAccuracy: 85.5, riskScore: 5, consistencyScore: 8, totalTrades: 78 }),
    makeUser(5, { xp: 5980, portfolioGrowth: 38.2, learningProgress: 75, quizAccuracy: 82.1, riskScore: 4, consistencyScore: 7, totalTrades: 65 }),
    makeUser(6, { xp: 5420, portfolioGrowth: 31.9, learningProgress: 70, quizAccuracy: 79.6, riskScore: 6, consistencyScore: 6, totalTrades: 54 }),
    makeUser(7, { xp: 4880, portfolioGrowth: 25.4, learningProgress: 67, quizAccuracy: 76.3, riskScore: 7, consistencyScore: 6, totalTrades: 48 }),
    makeUser(8, { xp: 4350, portfolioGrowth: 19.8, learningProgress: 62, quizAccuracy: 73.0, riskScore: 5, consistencyScore: 5, totalTrades: 41 }),
    makeUser(9, { xp: 3900, portfolioGrowth: 14.2, learningProgress: 58, quizAccuracy: 70.5, riskScore: 4, consistencyScore: 5, totalTrades: 36 }),
    makeUser(10, { xp: 3420, portfolioGrowth: 9.1, learningProgress: 53, quizAccuracy: 68.2, riskScore: 3, consistencyScore: 6, totalTrades: 31 }),
    makeUser(11, { xp: 3050, portfolioGrowth: 5.6, learningProgress: 49, quizAccuracy: 66.0, riskScore: 4, consistencyScore: 5, totalTrades: 28 }),
    makeUser(12, { xp: 2600, portfolioGrowth: 2.3, learningProgress: 45, quizAccuracy: 63.8, riskScore: 5, consistencyScore: 4, totalTrades: 24 }),
    makeUser(13, { xp: 2200, portfolioGrowth: -1.8, learningProgress: 41, quizAccuracy: 61.5, riskScore: 6, consistencyScore: 4, totalTrades: 21 }),
    makeUser(14, { xp: 1850, portfolioGrowth: -4.2, learningProgress: 38, quizAccuracy: 59.0, riskScore: 7, consistencyScore: 3, totalTrades: 18 }),
    makeUser(15, { xp: 1600, portfolioGrowth: -6.5, learningProgress: 35, quizAccuracy: 57.2, riskScore: 8, consistencyScore: 3, totalTrades: 15 }),
    makeUser(16, { xp: 1380, portfolioGrowth: 3.8, learningProgress: 33, quizAccuracy: 55.6, riskScore: 4, consistencyScore: 4, totalTrades: 14 }),
    makeUser(17, { xp: 1150, portfolioGrowth: -8.9, learningProgress: 30, quizAccuracy: 53.0, riskScore: 9, consistencyScore: 2, totalTrades: 12 }),
    makeUser(18, { xp: 980, portfolioGrowth: 7.2, learningProgress: 27, quizAccuracy: 51.4, riskScore: 3, consistencyScore: 5, totalTrades: 11 }),
    makeUser(19, { xp: 820, portfolioGrowth: -12.1, learningProgress: 24, quizAccuracy: 49.8, riskScore: 8, consistencyScore: 2, totalTrades: 10 }),
    makeUser(20, { xp: 710, portfolioGrowth: 11.5, learningProgress: 21, quizAccuracy: 48.2, riskScore: 2, consistencyScore: 6, totalTrades: 9 }),
    makeUser(21, { xp: 580, portfolioGrowth: -10.3, learningProgress: 19, quizAccuracy: 46.5, riskScore: 7, consistencyScore: 3, totalTrades: 8 }),
    makeUser(22, { xp: 460, portfolioGrowth: 6.8, learningProgress: 16, quizAccuracy: 45.0, riskScore: 3, consistencyScore: 4, totalTrades: 7 }),
    makeUser(23, { xp: 350, portfolioGrowth: -13.7, learningProgress: 14, quizAccuracy: 43.8, riskScore: 10, consistencyScore: 1, totalTrades: 6 }),
    makeUser(24, { xp: 280, portfolioGrowth: 4.1, learningProgress: 11, quizAccuracy: 42.2, riskScore: 2, consistencyScore: 5, totalTrades: 7 }),
    makeUser(25, { xp: 210, portfolioGrowth: -5.8, learningProgress: 9, quizAccuracy: 44.5, riskScore: 6, consistencyScore: 3, totalTrades: 6 }),
    makeUser(26, { xp: 160, portfolioGrowth: 1.3, learningProgress: 7, quizAccuracy: 41.0, riskScore: 4, consistencyScore: 2, totalTrades: 5 }),
    makeUser(27, { xp: 120, portfolioGrowth: -2.4, learningProgress: 5, quizAccuracy: 40.5, riskScore: 5, consistencyScore: 2, totalTrades: 5 }),
    makeUser(28, { xp: 85, portfolioGrowth: 0.7, learningProgress: 3, quizAccuracy: 42.8, riskScore: 3, consistencyScore: 1, totalTrades: 5 }),
    makeUser(29, { xp: 50, portfolioGrowth: -0.5, learningProgress: 1, quizAccuracy: 40.0, riskScore: 1, consistencyScore: 1, totalTrades: 5 })
  ];

  // Sort by XP descending and assign ranks
  users.sort(function (a, b) { return b.xp - a.xp; });
  users.forEach(function (u, i) { u.rank = i + 1; });

  window.DataUsers = users;
})();