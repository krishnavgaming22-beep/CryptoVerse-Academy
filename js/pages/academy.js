/**
 * CryptoVerse Academy — Teen Investor Academy
 * =============================================
 * 8 investing lesson modules with interactive scenarios,
 * quiz questions, XP rewards, and progress tracking.
 *
 * Dependencies: window.Store, window.DataQuizzes, window.UI
 */
window.Pages = window.Pages || {};

window.Pages.academy = function () {
  'use strict';

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  var lessons = [
    {
      id: 'risk-reward',
      title: 'Risk vs Reward',
      icon: '\u26A1',
      content: [
        'Every investment carries some level of risk \u2014 the possibility that you could lose some or all of your money. Understanding the relationship between risk and potential reward is the foundation of smart investing. Generally, investments with higher potential returns also come with higher risk of loss.',
        'Think of it like a ladder. The bottom rung is a savings account \u2014 very safe, very low returns. The top rung might be a single speculative crypto \u2014 potentially huge returns but also a real chance of losing everything. Smart investors don\'t just jump to the top rung; they figure out which rung is right for their goals and comfort level.',
        'The key insight is that risk isn\'t just about losing money \u2014 it\'s about not having money when you need it. If you\'re saving for a bike you want next month, even a "safe" stock investment might be too risky because prices can dip in the short term. Time horizon matters just as much as the investment itself.',
        'Professional investors use a concept called "risk-adjusted return" \u2014 they don\'t just ask "how much could I make?" but "how much could I make for each unit of risk I take?" This is why diversification is so powerful: it reduces your overall risk without proportionally reducing your expected returns.'
      ],
      takeaways: [
        'Higher potential returns always come with higher risk of loss',
        'Your time horizon (when you need the money) is crucial for choosing investments',
        'Risk-adjusted return matters more than raw return numbers',
        'Never invest money you can\'t afford to lose entirely',
        'Understanding risk is more valuable than finding the "best" investment'
      ],
      scenario: {
        question: 'You\'ve saved $500 from your part-time job. Your friend tells you about three options. What do you choose?',
        choices: [
          { id: 'a', text: 'Savings account earning 2% annually \u2014 virtually zero risk', correct: false, feedback: 'Very safe! Your $500 will grow to $510 after a year. You won\'t lose money, but inflation (prices going up) means your money actually loses a tiny bit of purchasing power. This is great for money you need soon, but not ideal for long-term growth.' },
          { id: 'b', text: 'Diversified stock index fund \u2014 historically averages 8-10% but could drop 15% in a bad year', correct: true, feedback: 'Excellent choice! This is what most financial advisors recommend. Over many years, you\'d likely see strong growth, and even in bad years, you wouldn\'t lose everything. The key word is "diversified" \u2014 you\'re not betting on one company but on the entire market.' },
          { id: 'c', text: 'Put it all on a hot new crypto token that "everyone" says will 100x', correct: false, feedback: 'Dangerous! While you might get lucky, this is gambling, not investing. For every crypto that goes 100x, hundreds go to zero. Putting ALL your money on one speculative asset is the opposite of smart investing. Even if it works once, the behavior will eventually catch up with you.' }
        ]
      }
    },
    {
      id: 'diversification',
      title: 'Diversification',
      icon: '\uD83C\uDF1F',
      content: [
        'Diversification is the investing equivalent of not putting all your eggs in one basket. Instead of putting all your money into one stock, one crypto, or one asset type, you spread it across different investments. If one performs poorly, the others can help cushion the blow.',
        'Imagine you have 10 eggs. You could put all 10 in one basket \u2014 if the basket drops, you lose everything. Or you could put 2 eggs each in 5 different baskets \u2014 if one basket drops, you still have 8 eggs. The math of diversification is even more powerful than this analogy suggests, because different investments don\'t always move in the same direction.',
        'A well-diversified portfolio might include stocks from different sectors (technology, healthcare, energy), different asset classes (stocks, bonds, real estate), different geographies (US, international, emerging markets), and different risk levels. The goal isn\'t to maximize returns \u2014 it\'s to find the sweet spot where you get good returns for the level of risk you\'re comfortable with.',
        'The surprising truth is that you can reduce about 90% of the risk in a stock portfolio through diversification alone, without giving up much expected return. That\'s why index funds (which hold hundreds or thousands of stocks) are so popular \u2014 they give you automatic diversification at very low cost.'
      ],
      takeaways: [
        'Diversification reduces risk without proportionally reducing returns',
        'Spread investments across different asset classes, sectors, and geographies',
        'Index funds are an easy way to achieve instant diversification',
        'Even within crypto, diversify across different projects and types',
        'Diversification is one of the few "free lunches" in investing'
      ],
      scenario: {
        question: 'You have $1,000 to invest. Your cousin is obsessed with one tech stock and wants you to go all in with him. What\'s your move?',
        choices: [
          { id: 'a', text: 'Go all in on the tech stock \u2014 your cousin did tons of research!', correct: false, feedback: 'Even if your cousin\'s research is great, putting 100% in one stock is extremely risky. Companies can face unexpected problems: lawsuits, competition, management changes, or industry shifts. One bad earnings report could wipe out 30-50% of your investment overnight.' },
          { id: 'b', text: 'Put $500 in the tech stock and $500 in a diversified index fund', correct: true, feedback: 'Smart balance! You\'re still participating in the opportunity your cousin identified, but you\'re protecting yourself with a diversified position. If the tech stock soars, you still benefit. If it crashes, your index fund provides a safety net. This is how experienced investors think.' },
          { id: 'c', text: 'Ignore your cousin entirely and put everything in bonds', correct: false, feedback: 'While bonds are safer, this is too conservative for a young investor with a long time horizon. You\'d be missing out on growth opportunities. The best approach is somewhere in the middle \u2014 not all in on one risky bet, but not hiding from all risk either.' }
        ]
      }
    },
    {
      id: 'long-term',
      title: 'Long-Term Investing',
      icon: '\uD83D\uDCC5',
      content: [
        'Time is the most powerful force in investing. Thanks to compound interest \u2014 earning returns on your returns \u2014 money invested early grows exponentially over decades. Someone who starts investing $100/month at age 18 can end up with significantly more money at retirement than someone who starts investing $300/month at age 35.',
        'The S&P 500 (a measure of the 500 largest US companies) has returned an average of about 10% per year over the last 100 years. But here\'s what trips people up: in any single year, it might be up 30% or down 30%. The average only shows up over long periods. This is why trying to time the market (guessing when to buy and sell) usually fails.',
        'Legendary investor Warren Buffett says: "The stock market is a device for transferring money from the impatient to the patient." The longest-running study of investor behavior (by Dalbar) consistently shows that average investors underperform the market by a wide margin because they buy high and sell low out of emotion.',
        'For teenagers, this is incredible news. You have the most valuable asset in investing \u2014 time. Every dollar you invest now has decades to compound. A $1,000 investment at age 16 at 8% average annual return would be worth over $46,000 by age 60 \u2014 without adding another penny.'
      ],
      takeaways: [
        'Compound interest makes early investing incredibly powerful',
        'The stock market rewards patience and punishes impatience',
        'Time in the market beats timing the market almost always',
        'Starting early matters far more than starting big',
        'Long-term investors can ride out short-term volatility'
      ],
      scenario: {
        question: 'You invested $200 in a diversified fund. A month later, a market crash drops it to $160. What do you do?',
        choices: [
          { id: 'a', text: 'Sell immediately before it drops further \u2014 cut your losses!', correct: false, feedback: 'This is the #1 mistake investors make. By selling during a dip, you lock in your losses permanently. Historically, markets recover from crashes \u2014 often within 1-2 years. Selling low and buying high is exactly backwards from what you should do.' },
          { id: 'b', text: 'Hold tight and don\'t even check the price for a few months', correct: true, feedback: 'This is the wisdom of long-term investing! Short-term price movements are noise. If you believe in your investment thesis and have a long time horizon, temporary dips are irrelevant. In fact, many experienced investors see dips as buying opportunities.' },
          { id: 'c', text: 'Borrow money to buy more shares at the lower price', correct: false, feedback: 'While buying dips can be smart, borrowing money to invest (margin trading) amplifies both gains AND losses. If the price drops further before recovering, you could owe more than your original investment. This is how people get into serious financial trouble.' }
        ]
      }
    },
    {
      id: 'emotional',
      title: 'Emotional Investing',
      icon: '\uD83E\uDD14',
      content: [
        'Our brains are wired for survival, not for rational investing. When prices rise rapidly, the fear of missing out (FOMO) pushes us to buy at the worst possible time. When prices crash, panic pushes us to sell at the bottom. These emotional reactions are why the average investor significantly underperforms the market.',
        'Behavioral economists have identified dozens of cognitive biases that affect investment decisions. "Loss aversion" makes us feel the pain of losing $100 twice as intensely as the pleasure of gaining $100. "Confirmation bias" makes us seek out information that agrees with decisions we\'ve already made. "Anchoring" makes us fixate on the price we paid rather than the current value.',
        'The best investors develop systems to remove emotion from decisions. This might include automatic investing (putting in a set amount every month regardless of what the market is doing), written investment plans (so you have clear rules to follow), and "cooling off" periods (waiting 24-48 hours before making any big investment decision).',
        'Social media has made emotional investing harder than ever. Seeing friends post about their crypto gains creates intense FOMO. But remember: people rarely post their losses. For every "I turned $100 into $10,000!" post, there are thousands of people who lost money on the same trade. Social media creates a biased sample that makes investing look easier and more profitable than it really is.'
      ],
      takeaways: [
        'Emotional decisions are the #1 reason investors underperform',
        'FOMO leads to buying high; panic leads to selling low',
        'Systems and rules help remove emotion from investing',
        'Social media creates a biased, misleading picture of investing results',
        'Taking time before deciding almost always leads to better outcomes'
      ],
      scenario: {
        question: 'You see everyone on social media posting about a new crypto that went up 500% in a week. Your heart is racing. What do you do?',
        choices: [
          { id: 'a', text: 'Buy immediately \u2014 you don\'t want to miss out on the next big thing!', correct: false, feedback: 'Classic FOMO! By the time everyone on social media is talking about it, the biggest gains have likely already happened. Buying after a 500% rally means you\'re paying premium prices and the risk of a pullback is very high. This is exactly when smart money is selling to people like you.' },
          { id: 'b', text: 'Wait 48 hours and research the project fundamentals before deciding', correct: true, feedback: 'Excellent self-control! This 48-hour rule is used by professional investors. After the emotional urgency fades, you can evaluate the investment rationally. Does the project solve a real problem? Is the team legitimate? What\'s the tokenomics? Most "hot tips" don\'t survive this kind of scrutiny.' },
          { id: 'c', text: 'Ask your friend who already made money on it for advice', correct: false, feedback: 'While your friend\'s intentions might be good, they have a "sunk cost" bias \u2014 they already own it and want to believe it\'ll keep going up so they feel good about their investment. Their success also doesn\'t guarantee yours, since you\'d be buying at a much higher price.' }
        ]
      }
    },
    {
      id: 'fomo',
      title: 'FOMO (Fear of Missing Out)',
      icon: '\uD83D\uDE31',
      content: [
        'FOMO isn\'t just a feeling \u2014 it\'s a well-documented psychological phenomenon that costs investors billions of dollars every year. When we see others profiting from an investment, our brains process that as a threat to our social standing and financial security. The evolutionary response is to join the herd immediately.',
        'Studies have shown that FOMO-driven buying consistently happens near market tops. During the 2021 crypto bull run, Google searches for "buy bitcoin" spiked at the exact peak price. During the 2022 market crash, those same people sold at massive losses. This buy-high-sell-low pattern, driven by FOMO and panic, destroys wealth systematically.',
        'The counter-intuitive truth is that the best investment opportunities often come when everyone else is fearful. Warren Buffett\'s famous advice to "be fearful when others are greedy, and greedy when others are fearful" is backed by decades of market data. The best times to buy are usually when the headlines are terrifying.',
        'Building FOMO resistance is a skill. Start by understanding that for every story of someone getting rich quick, there are many more stories of people who lost money chasing the same opportunity. Set investment rules in advance and stick to them. Remember: no single investment will make or break your financial future \u2014 consistent, disciplined investing over time is what builds real wealth.'
      ],
      takeaways: [
        'FOMO consistently leads to buying at market tops',
        'The best opportunities often come when everyone else is scared',
        'No single investment will make or break your financial future',
        'Social media amplifies FOMO by showing only success stories',
        'Pre-set investment rules are your best defense against FOMO'
      ],
      scenario: {
        question: 'Your group chat is buzzing: "XYZ token is about to be listed on a major exchange! Buy NOW before it moons!" You\'ve never heard of it. What\'s your play?',
        choices: [
          { id: 'a', text: 'Quickly buy $200 worth before the price goes up more', correct: false, feedback: 'You just invested in something you know nothing about based on group chat hype. This is exactly how scams and pump-and-dump schemes work. The people creating the hype often sell to people like you right after you buy, leaving you with a worthless token.' },
          { id: 'b', text: 'Research the token first: read the whitepaper, check the team, review the community', correct: true, feedback: 'Due diligence before investing is non-negotiable. A legitimate project will have a clear whitepaper, a verifiable team, an active and genuine community, and a clear use case. If you can\'t find these things in 15 minutes of research, that\'s a major red flag. Most hype tokens fail this test.' },
          { id: 'c', text: 'Ask the person in the group chat to manage your money for you', correct: false, feedback: 'Never hand over control of your investments to someone based on a group chat. This is how Ponzi schemes and investment fraud operate. No one cares about your money as much as you do, and anyone promising to manage it for you in a casual chat is a huge red flag.' }
        ]
      }
    },
    {
      id: 'market-cycles',
      title: 'Market Cycles',
      icon: '\uD83D\uDCC8',
      content: [
        'Financial markets move in cycles \u2014 periods of growth (bull markets) followed by periods of decline (bear markets), with transitions in between. Understanding these cycles doesn\'t mean you can perfectly predict them, but it does mean you won\'t be surprised when they happen.',
        'A typical market cycle has four phases: Accumulation (smart money buys quietly after a crash), Markup (prices rise as more investors notice), Distribution (smart money sells while retail investors buy enthusiastically), and Markdown (prices fall as reality sets in). The crypto market tends to follow a roughly 4-year cycle tied to Bitcoin\'s halving events.',
        'The most important thing to understand about cycles is that they\'re normal and inevitable. Every bear market in history has been followed by a bull market that reached new highs. The worst thing you can do during a downturn is panic sell. The second worst thing is to stop investing entirely because you\'re scared.',
        'For young investors, bear markets are actually a gift. If you\'re regularly investing (dollar-cost averaging), bear markets mean you\'re buying at lower prices, getting more shares for your money. When the market recovers \u2014 and it always does \u2014 those cheap shares will be worth much more. Your investment horizon of decades means short-term downturns are buying opportunities, not disasters.'
      ],
      takeaways: [
        'Markets are cyclical: bear markets are always followed by bull markets',
        'Bull markets make you money, bear markets make you wealthy (if you keep investing)',
        'Selling during downturns locks in temporary losses as permanent ones',
        'Young investors benefit enormously from bear market buying opportunities',
        'Understanding cycles helps you stay calm during market turbulence'
      ],
      scenario: {
        question: 'The market has been crashing for 6 months. Your portfolio is down 40%. Everyone says "crypto is dead." Your instinct is to sell everything. What should you actually do?',
        choices: [
          { id: 'a', text: 'Sell everything and move to cash until things "settle down"', correct: false, feedback: 'Selling after a 40% drop means locking in those losses permanently. Historically, the worst days in the market are often followed closely by the best days \u2014 and you\'d miss the recovery. People who sold during the 2020 COVID crash missed one of the fastest market recoveries in history.' },
          { id: 'b', text: 'Continue your regular investment schedule and consider increasing your contributions', correct: true, feedback: 'This is the mindset of a successful long-term investor. By continuing to invest regularly (or even increasing contributions), you\'re buying at discounted prices. When the market recovers \u2014 and it will \u2014 those discounted shares will generate outsized returns. Bear markets are sales for long-term investors.' },
          { id: 'c', text: 'Borrow money to buy as much as possible at the "bottom"', correct: false, feedback: 'Trying to call the exact bottom is impossible, and borrowing amplifies risk. What if the market drops another 30% from here? You\'d owe money on an investment that\'s even further underwater. Never invest money you don\'t have, and never try to perfectly time market bottoms.' }
        ]
      }
    },
    {
      id: 'dca',
      title: 'Dollar Cost Averaging',
      icon: '\uD83D\uDCB3',
      content: [
        'Dollar Cost Averaging (DCA) is one of the simplest and most effective investment strategies. Instead of trying to time the market by buying a large amount all at once, you invest a fixed amount at regular intervals (weekly, monthly, etc.) regardless of what the price is doing.',
        'Here\'s why DCA works: when prices are high, your fixed dollar amount buys fewer shares. When prices are low, it buys more shares. Over time, this averages out your purchase price and removes the emotional stress of trying to pick the "perfect" time to buy. Studies show DCA often outperforms lump-sum investing for most people because it prevents the paralysis of trying to time the market.',
        'Let\'s say you invest $100 per month. In month 1, the price is $10, so you buy 10 shares. In month 2, the price drops to $8, so you buy 12.5 shares. In month 3, it recovers to $11, so you buy 9.09 shares. Total invested: $300. Total shares: 31.59. Average price paid: $9.50 per share (less than the simple average of $9.67).',
        'DCA is particularly powerful for young investors because you can automate it. Set up a recurring investment from your allowance or part-time job earnings, and literally forget about it. This "set it and forget it" approach removes emotion, ensures consistent investing, and takes advantage of compound growth over your long time horizon.'
      ],
      takeaways: [
        'DCA removes the stress and impossibility of timing the market',
        'You automatically buy more shares when prices are low (discounted)',
        'Automation makes DCA effortless \u2014 set it up once and let it run',
        'DCA works best over long time periods with consistent contributions',
        'It\'s not foolproof but it\'s the most reliable strategy for most people'
      ],
      scenario: {
        question: 'You want to start investing $50/month from your allowance. The market has been going up steadily. Your friend says "wait for a dip." What do you do?',
        choices: [
          { id: 'a', text: 'Wait for a dip as your friend suggests \u2014 no point buying at the top', correct: false, feedback: 'This is market timing, and even professionals fail at it consistently. While waiting for a dip sounds smart, the market could go up another 50% before any significant dip. Meanwhile, you\'re missing out on growth and the power of compounding. Time in the market beats timing the market.' },
          { id: 'b', text: 'Start your $50/month DCA plan immediately and stick to it regardless of what the market does', correct: true, feedback: 'This is exactly right! The beauty of DCA is that it doesn\'t matter where the market is when you start. If it goes up, great \u2014 your money is growing. If it dips, even better \u2014 your next $50 buys more shares at a discount. Consistency beats timing every time.' },
          { id: 'c', text: 'Invest all your savings now instead of spreading it out monthly', correct: false, feedback: 'Lump-sum investing actually slightly outperforms DCA on average (because markets go up more often than down), BUT it requires a strong stomach. If the market dips 20% right after you invest everything, would you panic? For most people (especially beginners), DCA is psychologically much easier to maintain.' }
        ]
      }
    },
    {
      id: 'inflation',
      title: 'Inflation',
      icon: '\uD83D\uDD25',
      content: [
        'Inflation is the rate at which prices for goods and services increase over time, which means your money loses purchasing power. If inflation is 3% per year, something that costs $100 today will cost $103 next year. Your $100 hasn\'t changed, but it can buy less. This is why simply saving money in cash actually makes you poorer over time.',
        'Historically, US inflation has averaged about 3% per year. At that rate, prices double roughly every 24 years. That means if you\'re 16, by the time you\'re 40, everything will cost roughly twice as much. If your savings are earning 0.5% in a bank account but inflation is 3%, you\'re actually losing 2.5% of purchasing power every year.',
        'Investing is the primary way to outpace inflation. Historically, the stock market has returned about 10% per year, well above the 3% average inflation rate. That 7% "real return" is what builds real wealth over time. Cash under your mattress loses value. Cash invested in a diversified portfolio grows in real terms.',
        'Inflation also affects different investments differently. Cash and savings accounts lose value to inflation. Bonds barely keep pace. Stocks and real estate tend to outpace inflation over time. Some people even see cryptocurrency as an "inflation hedge" \u2014 though this is debated, since crypto is still too volatile to be a reliable store of value. Understanding inflation is crucial because it changes the true value of every financial decision you make.'
      ],
      takeaways: [
        'Inflation silently erodes the purchasing power of cash over time',
        'Money in a bank account earning low interest actually loses value',
        'Investing in growth assets is the primary defense against inflation',
        'Historical stock market returns (~10%) significantly outpace inflation (~3%)',
        'Understanding inflation helps you make better long-term financial decisions'
      ],
      scenario: {
        question: 'You\'ve been saving cash for 3 years \u2014 you have $1,500 in a piggy bank. Inflation has averaged 4% per year. Roughly how much purchasing power has your savings lost?',
        choices: [
          { id: 'a', text: 'About $50 \u2014 not much, inflation is overblown', correct: false, feedback: 'Actually, the loss is much bigger than that! At 4% annual inflation, your $1,500 in today\'s money had the purchasing power of about $1,330 when you started saving. That\'s roughly $170 of purchasing power lost to inflation \u2014 more than 11% of your savings. And this compounds over longer periods.' },
          { id: 'b', text: 'About $170-180 \u2014 roughly 12% of your savings\' value', correct: true, feedback: 'Spot on! At 4% inflation over 3 years, you\'ve lost approximately $180 in purchasing power. Your $1,500 can now buy only what $1,320 could buy three years ago. This is why "saving" alone isn\'t enough \u2014 you need to invest to at least match or beat inflation, or your money is slowly losing value.' },
          { id: 'c', text: 'Nothing \u2014 cash is cash, it doesn\'t lose value', correct: false, feedback: 'This is a dangerous misconception. While the number on the bill doesn\'t change, what that money can buy does. Think about what $1 could buy 50 years ago versus today. Inflation is real, persistent, and it affects everyone who holds cash. This is precisely why investing matters, especially starting young.' }
        ]
      }
    }
  ];

  /* ══════════════════════════════════════════════════════════
     BUILD HTML
     ══════════════════════════════════════════════════════════ */

  /* Compute overall progress */
  var completedCount = 0;
  lessons.forEach(function (l) {
    if (window.Store && window.Store.getLessonCompleted && window.Store.getLessonCompleted(l.id)) completedCount++;
  });
  var overallPct = Math.round((completedCount / lessons.length) * 100);

  var html = '<style>' +
    '.academy-page{max-width:960px;margin:0 auto;padding:24px}' +
    '.academy-header{text-align:center;margin-bottom:24px}' +
    '.academy-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 6px}' +
    '.academy-header p{color:var(--text-secondary,#94a3b8);font-size:.95rem;margin:0}' +
    '.academy-overall-bar{margin-bottom:28px;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:12px;padding:16px 20px}' +
    '.academy-overall-bar .bar-label{display:flex;justify-content:space-between;font-size:.85rem;color:var(--text-secondary,#94a3b8);margin-bottom:8px}' +
    '.academy-overall-bar .bar-label span:last-child{color:var(--accent,#8b5cf6);font-weight:700}' +
    '.academy-progress-bg{height:10px;background:rgba(148,163,184,.15);border-radius:5px;overflow:hidden}' +
    '.academy-progress-fill{height:100%;background:linear-gradient(90deg,#8b5cf6,#6366f1);border-radius:5px;transition:width .5s ease}' +
    '.academy-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:24px}' +
    '.academy-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:14px;padding:20px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden}' +
    '.academy-card:hover{border-color:var(--accent,#8b5cf6);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.3)}' +
    '.academy-card.completed{border-color:#22c55e}' +
    '.academy-card.completed::after{content:"\\2713";position:absolute;top:12px;right:12px;background:#22c55e;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700}' +
    '.academy-card-icon{font-size:1.8rem;margin-bottom:8px}' +
    '.academy-card h3{font-size:.95rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 6px}' +
    '.academy-card p{font-size:.8rem;color:var(--text-secondary,#94a3b8);margin:0}' +
    '.academy-xp-tag{display:inline-block;margin-top:8px;background:rgba(34,197,94,.12);color:#22c55e;padding:3px 10px;border-radius:12px;font-size:.7rem;font-weight:600}' +
    /* Lesson Detail View */
    '.academy-lesson{display:none;background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:16px;padding:28px;animation:fadeIn .3s ease}' +
    '.academy-lesson.active{display:block}' +
    '@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
    '.academy-lesson-back{background:transparent;border:1px solid var(--border-color,rgba(148,163,184,.2));color:var(--text-secondary,#94a3b8);padding:8px 16px;border-radius:8px;cursor:pointer;font-size:.8rem;margin-bottom:20px;transition:all .2s}' +
    '.academy-lesson-back:hover{color:var(--text-primary,#e2e8f0);border-color:var(--accent,#8b5cf6)}' +
    '.academy-lesson h2{font-size:1.3rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 16px;display:flex;align-items:center;gap:10px}' +
    '.academy-lesson .lesson-content{font-size:.9rem;color:var(--text-secondary,#94a3b8);line-height:1.7;margin-bottom:20px}' +
    '.academy-lesson .lesson-content p{margin:0 0 12px}' +
    '.academy-lesson .takeaways{background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:10px;padding:16px;margin-bottom:20px}' +
    '.academy-lesson .takeaways h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#22c55e;margin:0 0 10px}' +
    '.academy-lesson .takeaways ul{margin:0;padding:0 0 0 16px;color:var(--text-secondary,#94a3b8);font-size:.85rem;line-height:1.8}' +
    '.academy-lesson .scenario-box{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:12px;padding:20px;margin-bottom:20px}' +
    '.academy-lesson .scenario-box h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent,#8b5cf6);margin:0 0 10px}' +
    '.academy-lesson .scenario-q{font-size:.95rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 14px;line-height:1.5}' +
    '.scenario-choices{display:flex;flex-direction:column;gap:8px}' +
    '.scenario-choice{background:var(--bg-surface,#0f172a);border:1px solid var(--border-color,rgba(148,163,184,.2));border-radius:10px;padding:14px;cursor:pointer;transition:all .2s;text-align:left;color:var(--text-secondary,#94a3b8);font-size:.875rem;line-height:1.4}' +
    '.scenario-choice:hover{border-color:var(--accent,#8b5cf6);color:var(--text-primary,#e2e8f0)}' +
    '.scenario-choice.selected-correct{border-color:#22c55e;background:rgba(34,197,94,.08);color:#86efac}' +
    '.scenario-choice.selected-wrong{border-color:#ef4444;background:rgba(239,68,68,.08);color:#fca5a5}' +
    '.scenario-feedback{margin-top:10px;padding:12px;border-radius:8px;font-size:.85rem;line-height:1.5;display:none}' +
    '.scenario-feedback.correct{display:block;background:rgba(34,197,94,.08);border-left:3px solid #22c55e;color:#86efac}' +
    '.scenario-feedback.wrong{display:block;background:rgba(239,68,68,.08);border-left:3px solid #ef4444;color:#fca5a5}' +
    '.academy-complete-btn{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;display:none;margin-top:8px}' +
    '.academy-complete-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(34,197,94,.4)}' +
  '</style>';

  html += '<div class="academy-page">';

  /* Header */
  html += '<div class="academy-header">' +
    '<h1>\uD83C\uDF93 Teen Investor Academy</h1>' +
    '<p>Master the fundamentals of smart investing \u2014 one lesson at a time</p>' +
  '</div>';

  /* Overall Progress */
  html += '<div class="academy-overall-bar">' +
    '<div class="bar-label"><span>Overall Progress</span><span>' + completedCount + ' / ' + lessons.length + ' completed (' + overallPct + '%)</span></div>' +
    '<div class="academy-progress-bg"><div class="academy-progress-fill" style="width:' + overallPct + '%"></div></div>' +
  '</div>';

  /* Grid View */
  html += '<div class="academy-grid" id="academy-grid">';
  lessons.forEach(function (l) {
    var done = window.Store && window.Store.getLessonCompleted && window.Store.getLessonCompleted(l.id);
    html += '<div class="academy-card' + (done ? ' completed' : '') + '" data-action="open-lesson" data-lesson="' + l.id + '">' +
      '<div class="academy-card-icon">' + l.icon + '</div>' +
      '<h3>' + esc(l.title) + '</h3>' +
      '<p>Learn the fundamentals with interactive scenarios and quizzes</p>' +
      '<span class="academy-xp-tag">+20 XP</span>' +
    '</div>';
  });
  html += '</div>';

  /* Lesson Detail Views (one per lesson, toggled via JS) */
  lessons.forEach(function (l) {
    var done = window.Store && window.Store.getLessonCompleted && window.Store.getLessonCompleted(l.id);
    html += '<div class="academy-lesson" id="academy-lesson-' + l.id + '">';

    html += '<button class="academy-lesson-back" data-action="close-lesson">\u2190 Back to All Lessons</button>';
    html += '<h2>' + l.icon + ' ' + esc(l.title) + '</h2>';

    /* Content */
    html += '<div class="lesson-content">';
    l.content.forEach(function (p) { html += '<p>' + esc(p) + '</p>'; });
    html += '</div>';

    /* Takeaways */
    html += '<div class="takeaways"><h4>Key Takeaways</h4><ul>';
    l.takeaways.forEach(function (t) { html += '<li>' + esc(t) + '</li>'; });
    html += '</ul></div>';

    /* Scenario */
    html += '<div class="scenario-box">' +
      '<h4>\uD83C\uDFAF Interactive Scenario</h4>' +
      '<p class="scenario-q">' + esc(l.scenario.question) + '</p>' +
      '<div class="scenario-choices">';
    l.scenario.choices.forEach(function (c) {
      html += '<button class="scenario-choice" data-action="answer-scenario" data-lesson="' + l.id + '" data-choice="' + c.id + '">' + esc(c.text) + '</button>';
    });
    html += '</div>' +
      '<div class="scenario-feedback" id="scenario-feedback-' + l.id + '"></div>' +
    '</div>';

    /* Complete Button */
    html += '<button class="academy-complete-btn' + (done ? '' : '') + '" id="complete-btn-' + l.id + '" data-action="complete-lesson" data-lesson="' + l.id + '" style="' + (done ? 'display:inline-block;background:linear-gradient(135deg,#64748b,#475569)' : 'display:none') + '">' +
      (done ? 'Already Completed \u2713' : 'Complete Lesson (+20 XP)') +
    '</button>';

    html += '</div>'; /* .academy-lesson */
  });

  html += '</div>'; /* .academy-page */
  return html;
};