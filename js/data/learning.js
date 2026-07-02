/**
 * CryptoVerse Academy — Learning Content
 * 6 structured learning modules with comprehensive educational content
 */
(function () {
  "use strict";

  window.DataLearning = {

    /* ════════════════════════════════════════════════
       MODULE 1 — HISTORY OF MONEY
       ════════════════════════════════════════════════ */
    module1: {
      id: "history",
      title: "History of Money",
      subtitle: "From Barter to Bitcoin — Understanding How Money Evolved",
      type: "timeline",
      milestones: [
        {
          id: "h1-bar",
          title: "Barter System",
          year: "10,000+ BCE",
          description: "Before money existed, people exchanged goods and services directly. A farmer might trade wheat for a blacksmith's tools. While this worked in small communities, it had a major flaw: both parties needed to want what the other offered — a problem called the 'double coincidence of wants.' If you had chickens but needed shoes, you had to find a shoemaker who wanted chickens.",
          illustration: "Two people standing across from each other, one holding a sack of grain, the other holding a clay pot, with exchange arrows between them.",
          funFact: "Some Pacific island cultures used massive stone disks called 'Rai stones' as money. The largest weighed over 4 tons and was so heavy it rarely moved — people just agreed on who owned it!"
        },
        {
          id: "h1-coin",
          title: "First Metal Coins",
          year: "600 BCE",
          description: "The ancient Lydians (in modern-day Turkey) created the first standardized metal coins from electrum, a naturally occurring gold-silver alloy. Each coin had a consistent weight and was stamped with the king's symbol, guaranteeing its value. This innovation spread rapidly to Greece, Persia, and eventually the Roman Empire. Standardized coins made trade vastly more efficient because you no longer had to weigh and test precious metals for every transaction.",
          illustration: "Ancient Lydian gold coin with a lion's head stamp, alongside a simple balance scale showing standardized weights.",
          funFact: "The word 'salary' comes from 'salarium,' the allowance Roman soldiers received to buy salt — which was extremely valuable in ancient times!"
        },
        {
          id: "h1-paper",
          title: "Paper Money",
          year: "700 CE",
          description: "China's Tang Dynasty introduced the first paper money, called 'jiaozi,' around the 7th century. Merchants would deposit their heavy coins with a trusted authority and receive paper receipts they could trade. These receipts were lighter, easier to carry, and could represent large values. By the Song Dynasty (11th century), the government itself was issuing paper currency. Paper money didn't reach Europe until the 1600s, when goldsmiths began issuing paper receipts for deposited gold.",
          illustration: "A scroll of ancient Chinese paper money with calligraphy, next to a pile of heavy metal coins showing the contrast in portability.",
          funFact: "The first European paper money was issued in Sweden in 1661 by the Stockholm Banco — the same country that would later become one of the most cashless societies in the world!"
        },
        {
          id: "h1-gold",
          title: "The Gold Standard",
          year: "1816 CE",
          description: "The Gold Standard formally began when Britain adopted it in 1816, and most major economies followed by the late 1800s. Under this system, paper money could be exchanged for a fixed amount of gold. This gave people confidence that their paper money had real, tangible value. The Gold Standard limited how much money governments could print, which kept inflation low. However, it also restricted governments' ability to respond to economic crises by increasing the money supply.",
          illustration: "A golden bar resting on a pedestal, with paper banknotes fanning out from it, connected by golden chains representing the fixed exchange rate.",
          funFact: "During the Great Depression, countries that abandoned the Gold Standard earliest recovered fastest — proving that rigid monetary systems can sometimes worsen economic crises."
        },
        {
          id: "h1-fiat",
          title: "Fiat Currency",
          year: "1971 CE",
          description: "In 1971, President Nixon ended the US dollar's convertibility to gold, effectively ending the Gold Standard. The dollar became a 'fiat' currency — its value derived from government decree and public trust rather than physical backing. Today, all major currencies (dollar, euro, yen, etc.) are fiat. Governments and central banks can now create more money to stimulate economies, but this also means inflation can erode purchasing power. The 2008 financial crisis highlighted the vulnerabilities of the fiat banking system.",
          illustration: "A modern dollar bill floating above a printing press, with arrows showing it expanding and contracting. In the background, a graph shows the declining purchasing power of $1 over decades.",
          funFact: "Since 1971, the US dollar has lost over 85% of its purchasing power. What cost $1 in 1971 would cost over $7.50 today — an invisible tax called inflation."
        },
        {
          id: "h1-digital",
          title: "Digital Banking",
          year: "1990s CE",
          description: "The internet revolutionized money. Online banking, credit cards, PayPal (founded 1998), and mobile payments transformed how we transact. Money became numbers on screens rather than physical objects. While convenient, these systems still relied on trusted intermediaries — banks, credit card networks, and payment processors. If your bank fails, gets hacked, or freezes your account, you could lose access to your money. This centralization was exactly what the creators of Bitcoin wanted to address.",
          illustration: "A laptop showing a bank account balance, with digital coins flowing between a smartphone, a computer, and a store terminal, all connected by internet lines to a central bank server.",
          funFact: "In 2023, over 80% of all money in existence was purely digital — existing only as records in bank databases, not as physical cash."
        },
        {
          id: "h1-crypto",
          title: "Cryptocurrency Era",
          year: "2009 CE",
          description: "On January 3, 2009, Satoshi Nakamoto mined Bitcoin's genesis block, launching the first decentralized digital currency. Bitcoin's breakthrough was solving the 'double-spending problem' without a central authority, using a technology called blockchain. Since then, thousands of cryptocurrencies have been created, each exploring different ideas. Ethereum added smart contracts, Solana focused on speed, and new innovations continue to emerge. Cryptocurrency represents the latest chapter in humanity's 12,000-year journey of reinventing money.",
          illustration: "A glowing Bitcoin symbol emerging from a smartphone, surrounded by a network of connected nodes (small dots linked by lines) representing the decentralized blockchain, with historical money symbols (coins, bills, credit cards) fading in the background.",
          funFact: "The Bitcoin genesis block contained a hidden message from Satoshi: a newspaper headline reading 'Chancellor on brink of second bailout for banks' — a commentary on the 2008 financial crisis."
        }
      ]
    },

    /* ════════════════════════════════════════════════
       MODULE 2 — BLOCKCHAIN EXPLAINED
       ════════════════════════════════════════════════ */
    module2: {
      id: "blockchain",
      title: "Blockchain Explained",
      subtitle: "How Transactions Work on a Decentralized Network",
      type: "steps",
      steps: [
        {
          id: "b2-s1",
          title: "Transaction Created",
          description: "It all starts when someone wants to send cryptocurrency. Imagine Alex wants to send 0.1 BTC to Sam. Alex opens their wallet app and enters Sam's wallet address and the amount (0.1 BTC). Alex's wallet creates a digital transaction message that essentially says: 'Move 0.1 BTC from Alex's address to Sam's address.' This message includes the sender's public key, the recipient's address, the amount, and a digital signature created using Alex's private key.",
          visual: "A smartphone screen showing a send form with 'To: Sam's address' and 'Amount: 0.1 BTC', with a large 'Send' button. An arrow shows the transaction being created as a data packet."
        },
        {
          id: "b2-s2",
          title: "Transaction Broadcast",
          description: "Alex's wallet broadcasts (sends) the signed transaction to the Bitcoin network. This broadcast goes out to multiple 'nodes' — computers running the Bitcoin software that maintain a copy of the blockchain. The transaction isn't confirmed yet — it's just been announced to the network. Think of it like shouting in a crowded room: 'I want to transfer 0.1 BTC to Sam!' Multiple nodes hear the message and start verifying it.",
          visual: "The smartphone sending out radio waves in all directions. Multiple computer nodes (shown as monitors) receive the waves. The transaction data packet travels along network lines connecting the nodes in a web pattern."
        },
        {
          id: "b2-s3",
          title: "Transaction Verified",
          description: "When nodes receive Alex's transaction, they immediately verify several things: (1) Does Alex actually own the 0.1 BTC being sent? They check the blockchain history to confirm. (2) Is Alex's digital signature valid? They use Alex's public key to verify the signature was created with the correct private key. (3) Has this Bitcoin already been spent? They check for double-spending. If everything checks out, the node considers the transaction valid and passes it along to other nodes. Invalid transactions are rejected immediately.",
          visual: "A magnifying glass icon over the transaction, with checkmarks appearing next to three verification criteria: 'Sufficient balance ✓', 'Valid signature ✓', 'Not double-spent ✓'. Green checkmarks appear as each verification passes."
        },
        {
          id: "b2-s4",
          title: "Transaction Enters Mempool",
          description: "Once verified, the transaction enters the 'mempool' — a waiting room for unconfirmed transactions. Think of it like a queue at a ticket counter. Miners pick transactions from the mempool to include in the next block. Transactions with higher fees are usually picked first because miners want to maximize their earnings. If the network is busy, the mempool gets crowded and fees rise. If it's quiet, even low-fee transactions get confirmed quickly. Alex's transaction waits here until a miner selects it.",
          visual: "A pool or waiting room illustration showing transaction envelopes floating in a 'mempool' container. A miner character with a pickaxe reaches in to select transactions, prioritizing ones with gold coin fee icons."
        },
        {
          id: "b2-s5",
          title: "Block Created",
          description: "A miner collects a batch of transactions from the mempool (including Alex's) and packages them into a candidate 'block.' The block also contains a reference to the previous block's hash, a timestamp, and a special 'coinbase' transaction that awards the miner newly created Bitcoin plus transaction fees. But before this block can be added to the blockchain, the miner must solve a complex mathematical puzzle — this is the 'proof of work.'",
          visual: "A transparent block container being filled with transaction envelopes. Above the block, a mathematical equation is displayed with spinning numbers. A miner is shown working furiously at a computer to solve the puzzle."
        },
        {
          id: "b2-s6",
          title: "Mining (Proof of Work)",
          description: "Now comes the hard part: mining. Miners compete to find a specific number (called a 'nonce') that, when combined with the block's data and run through a hash function (SHA-256), produces a hash that starts with a certain number of zeros. This is like a combination lock with quintillions of possibilities — miners must guess over and over until they find the right combination. The first miner to find a valid hash wins the right to add the block and receives the block reward. This computational work is what secures the network — it would cost billions of dollars to attack.",
          visual: "A race between multiple miners, each with computers showing hash outputs. Most outputs are red (invalid), but one suddenly turns green — showing the winning hash. Confetti and gold coins appear around the winning miner."
        },
        {
          id: "b2-s7",
          title: "Block Broadcast",
          description: "When a miner finds the valid hash, they immediately broadcast the completed block to the entire network. Other nodes receive the block and independently verify everything: all transactions in the block are valid, the proof-of-work is correct, and the block properly references the previous one. If everything checks out, each node adds this block to their local copy of the blockchain. The chain has grown by one link.",
          visual: "The completed block glowing and sending out broadcast waves to all nodes in the network. Each node receives the block, runs a verification animation, and then adds it to their chain (shown as a stack of blocks growing taller)."
        },
        {
          id: "b2-s8",
          title: "Confirmed!",
          description: "Alex's transaction is now confirmed! Sam sees 0.1 BTC appear in their wallet. One confirmation means the transaction is in one block. For extra security, people often wait for 6 confirmations (about 1 hour) — meaning 6 more blocks have been added on top. Each additional block makes reversing the transaction exponentially harder. The transaction is now permanently recorded on the blockchain — visible to anyone, verifiable by anyone, and controlled by no one. This is the power of decentralization.",
          visual: "Sam's wallet screen showing the new 0.1 BTC balance with a celebration animation. In the background, a blockchain visualization shows 6 blocks stacked, each glowing brighter to represent increasing confirmations. A padlock icon appears, symbolizing security."
        }
      ]
    },

    /* ════════════════════════════════════════════════
       MODULE 3 — HOW BITCOIN WORKS
       ════════════════════════════════════════════════ */
    module3: {
      id: "bitcoin",
      title: "How Bitcoin Works",
      subtitle: "The Technical and Economic Design of the World's First Cryptocurrency",
      type: "topics",
      topics: [
        {
          id: "bt-mining",
          title: "Mining",
          content: [
            "Bitcoin mining is the process by which new bitcoins are created and transactions are verified on the network. Miners use specialized computers (called ASICs — Application-Specific Integrated Circuits) to solve complex mathematical puzzles. When a miner successfully solves the puzzle, they get to add a new block of transactions to the blockchain and receive a reward in newly created bitcoins plus transaction fees.",

            "Mining serves two critical purposes: it secures the network and creates new coins. Because solving the puzzle requires enormous computational effort (and therefore electricity), attacking the Bitcoin network would require more computing power than all honest miners combined — making it prohibitively expensive. This is what makes Bitcoin 'secure by math.'",

            "The mining reward started at 50 BTC per block in 2009 and halves approximately every four years in an event called 'the halving.' As of 2024, miners receive 3.125 BTC per block. Mining has evolved from individuals running software on laptops to massive industrial operations with warehouses full of specialized hardware, often located near cheap electricity sources like hydroelectric dams."
          ],
          keyPoints: [
            "Miners verify transactions and create new blocks",
            "Mining requires specialized hardware (ASICs) and significant electricity",
            "Miners are rewarded with newly created Bitcoin and transaction fees",
            "Mining secures the network by making attacks computationally expensive",
            "The block reward halves approximately every 4 years",
            "Industrial mining operations have replaced early hobbyist mining"
          ],
          interactiveElement: "Mining Simulator: Adjust mining difficulty, electricity cost, and hash rate to see how long it takes to mine a block and whether it's profitable."
        },
        {
          id: "bt-hashing",
          title: "Hashing",
          content: [
            "A hash function is a mathematical algorithm that takes any input data and produces a fixed-length output called a 'hash' or 'digest.' Bitcoin uses the SHA-256 (Secure Hash Algorithm 256-bit) function, which always produces a 64-character hexadecimal output regardless of input size. Whether you hash a single word or an entire book, the output is always 64 characters.",

            "The magic of hashing is two properties. First, it's deterministic — the same input always produces the same output. Second, it's a one-way function — you cannot reverse a hash to discover the original input. Even a tiny change in input (changing one letter) produces a completely different hash. This makes hashes perfect for verifying data integrity.",

            "In Bitcoin mining, miners must find a hash that starts with a certain number of zeros. Since the hash is unpredictable, the only way to find it is by trying different inputs (nonces) repeatedly — essentially guessing. The 'difficulty' determines how many leading zeros are required. More zeros = exponentially more guesses needed = more computational work = more security."
          ],
          keyPoints: [
            "SHA-256 always produces a 64-character hexadecimal output",
            "Same input always produces the same hash (deterministic)",
            "Even a tiny input change creates a completely different hash (avalanche effect)",
            "Hashes are one-way — you cannot reverse them to find the input",
            "Miners must find hashes with a specific number of leading zeros",
            "Higher difficulty = more leading zeros required = more computation needed"
          ],
          interactiveElement: "Hash Generator: Type any text and instantly see its SHA-256 hash. Try changing a single character and watch the hash completely change."
        },
        {
          id: "bt-difficulty",
          title: "Difficulty Adjustment",
          content: [
            "Bitcoin's network automatically adjusts mining difficulty every 2,016 blocks (approximately every two weeks) to maintain a consistent block time of about 10 minutes. This self-regulating mechanism is one of Bitcoin's most elegant design features.",

            "Here's how it works: if more miners join the network, blocks are found faster than every 10 minutes. After 2,016 blocks, the network measures how long they actually took. If it was less than 14 days, the difficulty increases. If more than 14 days, difficulty decreases. This ensures the network produces blocks at a predictable rate regardless of how many miners participate.",

            "This adjustment mechanism has profound implications. It means Bitcoin's monetary policy is predictable — we know approximately when new bitcoins will be created. It also means the network is resilient: even if many miners quit, the network keeps running by lowering difficulty. And if mining becomes too profitable, more miners join until equilibrium is reached."
          ],
          keyPoints: [
            "Difficulty adjusts every 2,016 blocks (~2 weeks)",
            "Target: one block every ~10 minutes",
            "If blocks are found too fast → difficulty increases",
            "If blocks are found too slow → difficulty decreases",
            "The system self-regulates regardless of miner count",
            "This ensures predictable coin issuance schedule"
          ],
          interactiveElement: "Difficulty Adjustment Simulator: Watch blocks being mined at different speeds. See how the network automatically adjusts difficulty when you add or remove miners."
        },
        {
          id: "bt-halving",
          title: "The Halving",
          content: [
            "Approximately every 210,000 blocks (about every 4 years), the Bitcoin block reward cuts in half. This event, called 'the halving,' reduces the rate at which new bitcoins enter circulation. The first halving in 2012 reduced the reward from 50 BTC to 25 BTC. The second in 2016 cut it to 12.5 BTC. The third in 2020 reduced it to 6.25 BTC, and the fourth in 2024 brought it to 3.125 BTC.",

            "The halving is coded into Bitcoin's software — it's not a decision made by any person or organization. Because fewer new bitcoins are created after each halving, and demand may stay the same or grow, the halving has historically been associated with significant price increases in the months and years that follow.",

            "The final halving will occur around 2140, when the block reward will drop below one satoshi (the smallest unit of Bitcoin, 0.00000001 BTC) and no new bitcoins will be created. After that, miners will be compensated entirely by transaction fees. This fixed supply schedule makes Bitcoin fundamentally different from fiat currencies, which can be printed in unlimited quantities."
          ],
          keyPoints: [
            "Block reward halves every ~210,000 blocks (~4 years)",
            "2024 halving: reward reduced from 6.25 to 3.125 BTC",
            "The halving is automatic — no one can change it",
            "Historically associated with price increases due to reduced supply",
            "Last bitcoin will be mined around 2140",
            "After 2140, miners earn only transaction fees"
          ],
          interactiveElement: "Halving Timeline: An interactive timeline showing all past and future halvings, block rewards, and cumulative supply. Slide a time handle to see how the supply curve approaches 21 million."
        },
        {
          id: "bt-supply",
          title: "Supply Cap",
          content: [
            "Bitcoin has a hard cap of 21 million coins — there will never be more than this. This is hardcoded into Bitcoin's protocol and cannot be changed without overwhelming consensus from the network. As of 2024, over 19.5 million bitcoins have been mined, leaving approximately 1.5 million yet to be created over the next century+.",

            "The 21 million cap creates 'digital scarcity.' Unlike fiat currencies that central banks can print endlessly, Bitcoin's supply is mathematically limited. Some proponents compare this to gold, which is also scarce and cannot be manufactured. This scarcity is a key reason many investors view Bitcoin as a potential store of value.",

            "Not all 21 million bitcoins are accessible. An estimated 3-4 million BTC are permanently lost due to people losing their private keys or seed phrases. Satoshi Nakamoto's estimated ~1 million BTC has never been moved. This means the actual circulating supply is significantly lower than 21 million, making each remaining bitcoin even scarcer."
          ],
          keyPoints: [
            "Maximum supply: exactly 21,000,000 BTC — never more",
            "The cap is enforced by Bitcoin's code, not by any authority",
            "Over 19.5 million BTC mined as of 2024",
            "Estimated 3-4 million BTC are permanently lost",
            "Satoshi's ~1 million BTC has never been spent",
            "Last BTC will be mined approximately in 2140"
          ],
          interactiveElement: "Supply Counter: Watch an animated counter showing Bitcoin's current supply ticking up toward 21 million. See how the rate slows with each halving."
        },
        {
          id: "bt-decentralization",
          title: "Decentralization",
          content: [
            "Bitcoin is decentralized — no single entity controls it. There's no CEO, no company, and no government in charge. The network is maintained by thousands of independent nodes (computers running Bitcoin software) spread across the globe. Anyone can run a node, and anyone can become a miner.",

            "This decentralization provides several key benefits. First, censorship resistance: no one can block your transactions or freeze your account. Second, no single point of failure: even if some nodes go offline, the network continues operating. Third, trustlessness: you don't need to trust any person or institution — you only need to trust the math and code that everyone can verify.",

            "However, decentralization has trade-offs. Bitcoin is slower than centralized payment systems (7 transactions per second vs. Visa's 65,000). It uses more energy. And there's no customer service to call if something goes wrong. These trade-offs are intentional — Bitcoin prioritizes security and decentralization over speed and convenience."
          ],
          keyPoints: [
            "No single person, company, or government controls Bitcoin",
            "Thousands of independent nodes maintain the network globally",
            "Benefits: censorship resistance, no single point of failure, trustless operation",
            "Anyone can run a node or mine Bitcoin",
            "Trade-offs: slower transactions, higher energy use, no customer support",
            "Decentralization is a security feature, not a bug"
          ],
          interactiveElement: "Network Visualization: See a live-style map of Bitcoin nodes around the world. Click to add or remove nodes and watch how the network stays resilient."
        },
        {
          id: "bt-consensus",
          title: "Consensus Mechanisms",
          content: [
            "A consensus mechanism is how a decentralized network agrees on the current state of the blockchain. Since there's no central authority, all participants must agree on which transactions are valid and what order they occurred in. Bitcoin uses 'Proof of Work' (PoW) as its consensus mechanism.",

            "In Proof of Work, miners compete to solve a computational puzzle. The first to solve it gets to propose the next block. Other nodes verify the solution and the block's transactions. If everything is valid, they add the block to their chain. This works because solving the puzzle is genuinely hard (requiring real energy expenditure), but verifying the solution is easy for everyone else.",

            "Ethereum switched from PoW to 'Proof of Stake' (PoS) in 2022. In PoS, validators lock up ('stake') their own cryptocurrency as collateral instead of expending computational energy. If they validate honestly, they earn rewards. If they try to cheat, they lose their stake. Both systems achieve consensus but with different trade-offs in security, energy use, and decentralization."
          ],
          keyPoints: [
            "Consensus mechanisms let decentralized networks agree on the truth",
            "Bitcoin uses Proof of Work (PoW) — miners expend energy to secure the network",
            "Ethereum uses Proof of Stake (PoS) — validators stake cryptocurrency as collateral",
            "PoW: high security, high energy use, truly decentralized",
            "PoS: lower energy use, different security model, faster transactions",
            "The choice of consensus mechanism involves fundamental trade-offs"
          ],
          interactiveElement: "Consensus Comparison: Side-by-side interactive comparison of PoW vs PoS. Simulate an attack attempt and see how each system defends against it."
        }
      ]
    },

    /* ════════════════════════════════════════════════
       MODULE 4 — TRADING FUNDAMENTALS
       ════════════════════════════════════════════════ */
    module4: {
      id: "trading",
      title: "Trading Fundamentals",
      subtitle: "Learn the Basics of Buying, Selling, and Analyzing Cryptocurrency Markets",
      type: "lessons",
      lessons: [
        {
          id: "tr-bs",
          title: "Buying & Selling Cryptocurrency",
          content: [
            { heading: "Getting Started", text: "To buy cryptocurrency, you first need an account on a crypto exchange — a digital marketplace like Coinbase, Binance, or Kraken. You'll create an account, verify your identity (KYC), and then deposit funds using a bank transfer, credit card, or sometimes even PayPal. Once funded, you can place orders to buy crypto at current or specified prices." },
            { heading: "How Buying Works", text: "When you buy cryptocurrency on an exchange, the exchange matches you with a seller. The crypto doesn't go into your personal wallet immediately — it stays in your exchange account. Think of the exchange like a bank holding your assets. You can keep it there for convenience or transfer it to a personal wallet for more control." },
            { heading: "How Selling Works", text: "Selling is the reverse: you place a sell order on the exchange, it matches with a buyer, and you receive fiat currency (like dollars). You can then withdraw this to your bank account. Remember that selling triggers a taxable event in most countries — you may owe capital gains tax on any profit." },
            { heading: "Important Safety Tips", text: "Always use reputable exchanges with strong security. Enable two-factor authentication (2FA). Never share your passwords or 2FA codes. For large holdings, transfer crypto to a personal hardware wallet. Start with small amounts while you learn the ropes." }
          ],
          keyTakeaways: [
            "Use reputable exchanges with strong security track records",
            "Always enable two-factor authentication (2FA)",
            "Start with small amounts while learning",
            "Consider moving large holdings to a personal wallet",
            "Selling crypto may have tax implications",
            "Never invest money you can't afford to lose"
          ]
        },
        {
          id: "tr-orders",
          title: "Market vs. Limit Orders",
          content: [
            { heading: "Market Orders", text: "A market order buys or sells immediately at the best available current price. It's simple and fast — you say 'buy 0.1 BTC now' and it happens. However, in volatile markets, the price might change between when you click and when your order executes. You might pay slightly more (or receive slightly less) than you expected. Market orders are best when speed is more important than price precision." },
            { heading: "Limit Orders", text: "A limit order lets you specify the exact price you want. 'Buy 0.1 BTC at $65,000' means your order will only execute if the price reaches $65,000. You have more control, but the order might never fill if the price never reaches your target. Limit orders are useful for buying dips — setting a buy order below the current price." },
            { heading: "Stop Orders", text: "A stop-loss order automatically sells when the price falls to a level you specify. If you buy at $68,000, you might set a stop-loss at $60,000. If the price crashes while you're asleep, your order triggers automatically, limiting your loss. Stop orders are essential risk management tools for any trader." },
            { heading: "Which to Use?", text: "Beginners often use market orders for simplicity. As you gain experience, you'll use limit orders for better pricing and stop orders for risk management. Many experienced traders combine them — using limit orders to enter positions and stop orders to protect against large losses." }
          ],
          keyTakeaways: [
            "Market orders: fast but less price control",
            "Limit orders: precise pricing but may not execute",
            "Stop-loss orders: automatic selling to limit losses",
            "Combine order types for a complete trading strategy",
            "Always set stop-losses to manage risk",
            "Practice with paper trading before using real money"
          ]
        },
        {
          id: "tr-charts",
          title: "Reading Charts",
          content: [
            { heading: "Candlestick Basics", text: "Candlestick charts are the most popular way to visualize crypto prices. Each 'candle' shows four pieces of information for a time period: the opening price, closing price, highest price, and lowest price. Green (or white) candles show the price went up during that period; red (or black) candles show it went down. The 'body' of the candle shows the open-to-close range, and the 'wicks' show the high and low." },
            { heading: "Volume", text: "Volume bars at the bottom of a chart show how many units were traded in each period. High volume during a price increase suggests strong buying interest and makes the move more credible. Low volume during a price change suggests the move might not be sustainable. Always look at volume alongside price." },
            { heading: "Support and Resistance", text: "Support levels are price points where buying tends to appear, preventing the price from falling further. Resistance levels are price points where selling pressure appears, preventing further rises. These levels often form at round numbers, previous highs/lows, or psychological price points. Identifying support and resistance helps with entry and exit decisions." },
            { heading: "Trend Lines", text: "A trend line connects a series of higher lows (uptrend) or lower highs (downtrend) on a chart. An uptrend line acts as dynamic support; a downtrend line acts as dynamic resistance. The trend is your friend — trading with the trend generally has a higher probability of success than trading against it." }
          ],
          keyTakeaways: [
            "Candlesticks show open, high, low, and close prices",
            "Green candles = price up; red candles = price down",
            "Volume confirms the strength of price movements",
            "Support = price floor; Resistance = price ceiling",
            "Trend lines help identify market direction",
            "Charts are tools, not crystal balls — no pattern guarantees future results"
          ]
        },
        {
          id: "tr-portfolio",
          title: "Portfolio Management",
          content: [
            { heading: "What Is a Portfolio?", text: "A portfolio is your collection of cryptocurrency investments. Just like you wouldn't put all your clothes in one drawer, you shouldn't put all your investment money into one cryptocurrency. A well-managed portfolio balances risk and reward by including different types of assets." },
            { heading: "Asset Allocation", text: "This is how you divide your money among different investments. A simple approach might be 50% Bitcoin (the safest crypto), 30% Ethereum (the second-largest), and 20% split among smaller, higher-risk projects. Your allocation should match your risk tolerance — more conservative investors should hold more Bitcoin and stablecoins." },
            { heading: "Rebalancing", text: "Over time, some assets will grow faster than others, throwing off your target allocation. If Bitcoin surges from 50% to 70% of your portfolio, you might sell some Bitcoin and buy other assets to return to your targets. This naturally enforces 'buy low, sell high.' Rebalance monthly or quarterly." },
            { heading: "Tracking", text: "Use a portfolio tracker (like CoinGecko or CoinMarketCap's portfolio feature) to monitor your holdings. Don't check obsessively — crypto is 24/7 and constant checking leads to emotional decisions. Set up price alerts for important levels and review your portfolio weekly or monthly." }
          ],
          keyTakeaways: [
            "Don't put all your eggs in one basket — diversify",
            "Allocate based on your risk tolerance and time horizon",
            "Rebalance periodically to maintain your target allocation",
            "Use portfolio trackers but don't obsess over prices",
            "Keep records of your trades for tax purposes",
            "Review your strategy regularly but don't react to every price move"
          ]
        },
        {
          id: "tr-risk",
          title: "Risk Management",
          content: [
            { heading: "The #1 Rule", text: "Never invest more than you can afford to lose. This isn't just a cliché — it's the foundation of all risk management. Crypto can drop 50-80% in a bear market. If you invest your rent money and it crashes, you could lose your home. Only use disposable income for high-risk investments." },
            { heading: "Position Sizing", text: "Never put more than 1-5% of your total portfolio into a single high-risk trade. If a small altcoin crashes to zero, losing 2% of your portfolio is painful but survivable. Losing 50% of your portfolio on a single bad bet can be devastating. Small position sizes let you survive mistakes." },
            { heading: "Stop-Losses", text: "Always set stop-loss orders to automatically sell if the price drops below a predetermined level. A common approach is to set stop-losses 10-15% below your entry price. This limits any single trade's maximum loss. Without stop-losses, a sudden crash could wipe out a large portion of your portfolio." },
            { heading: "Risk-Reward Ratio", text: "Before entering a trade, consider the potential reward versus the risk. A 1:3 risk-reward ratio means you're risking $1 to potentially make $3. Even if you're only right 40% of the time, this ratio makes you profitable over many trades. Always know your exit point before you enter." }
          ],
          keyTakeaways: [
            "Rule #1: Only invest what you can afford to lose",
            "Keep individual position sizes small (1-5% of portfolio)",
            "Always use stop-loss orders to limit potential losses",
            "Calculate risk-reward ratios before every trade",
            "Diversification reduces but doesn't eliminate risk",
            "Never chase losses — stick to your strategy"
          ]
        },
        {
          id: "tr-psychology",
          title: "Market Psychology",
          content: [
            { heading: "Fear and Greed", text: "The two most powerful emotions in trading are fear and greed. During bull markets, greed drives people to buy at any price ('it can only go up!'). During bear markets, fear causes people to sell at the worst time ('it's never going to recover!'). The best investors recognize these emotions in themselves and others, and make rational decisions instead." },
            { heading: "FOMO (Fear Of Missing Out)", text: "When you see a coin surging 100% and everyone on social media is talking about it, FOMO pushes you to buy in. This almost always leads to buying near the peak. By the time something is trending on social media, the big gains have usually already been made. The best time to buy is when nobody is talking about it." },
            { heading: "Confirmation Bias", text: "We naturally seek information that confirms what we already believe and ignore information that contradicts it. If you're bullish on a coin, you'll read bullish articles and dismiss bearish ones. Combat this by actively seeking out arguments against your position. If you can't make a strong case for the other side, you haven't researched enough." },
            { heading: "Developing Discipline", text: "Successful trading requires a plan and the discipline to follow it. Before buying, know your entry price, stop-loss level, and target price. Write it down. When emotions run high, refer back to your plan. Taking breaks from screens during extreme volatility prevents impulsive decisions. Remember: in trading, doing nothing is often the best action." }
          ],
          keyTakeaways: [
            "Fear and greed drive most market irrationality",
            "FOMO leads to buying at peaks — resist it",
            "Actively seek out information that challenges your views",
            "Have a written trading plan and stick to it",
            "Take breaks during extreme volatility",
            "Doing nothing is often better than making emotional decisions"
          ]
        }
      ]
    },

    /* ════════════════════════════════════════════════
       MODULE 5 — SCAM AWARENESS
       ════════════════════════════════════════════════ */
    module5: {
      id: "scams",
      title: "Scam Awareness",
      subtitle: "Learn to Identify and Avoid the Most Common Cryptocurrency Scams",
      type: "scenarios",
      scenarios: [
        {
          id: "sc-rug",
          title: "The Rug Pull",
          summary: "A hot new crypto project promises massive returns. The social media buzz is incredible. But when you invest, the developers vanish with all the money.",
          steps: [
            { step: 1, title: "The Hype", content: "Developers launch a new token with incredible promises: '100x returns guaranteed!' 'Partnership with a major company!' They hire influencers, run ads, and create FOMO. The token's price starts climbing rapidly as excited investors pour in." },
            { step: 2, title: "The Bait", content: "The project creates a liquidity pool so people can buy the token. Early buyers see impressive gains and post screenshots online, fueling more FOMO. The developers seem active and responsive, releasing 'updates' and 'roadmaps.' Everything looks legitimate." },
            { step: 3, title: "The Warning Signs", content: "RED FLAGS: Anonymous team with no verifiable identities. No independent code audit. Unrealistic return promises. Copy-pasted whitepaper. Community members raising concerns are banned. The smart contract has functions that look suspicious if you read the code." },
            { step: 4, title: "The Pull", content: "When enough money has been raised, the developers execute a hidden function in the smart contract that drains all the liquidity from the pool. Or they simply sell all their pre-mined tokens. The price instantly crashes to zero. The website goes offline. Social media accounts are deleted. Your investment is gone." },
            { step: 5, title: "How to Protect Yourself", content: "ALWAYS verify the team behind a project. Check for reputable third-party audits. Read the smart contract code (or have someone trusted review it). Be suspicious of guaranteed returns — there's no such thing. If a project creates FOMO pressure, that's a warning sign, not an opportunity. Use tools like Token Sniffer to analyze new tokens before buying." }
          ]
        },
        {
          id: "sc-pump",
          title: "The Pump & Dump",
          summary: "A group coordinates to buy a cheap coin, hype it up to drive the price higher, then sell everything at the peak — leaving latecomers with massive losses.",
          steps: [
            { step: 1, title: "The Setup", content: "Organizers identify a low-value, low-liquidity cryptocurrency. They quietly accumulate a large position at low prices. These coins typically have small market caps, making them easy to manipulate. The organizers may create multiple social media accounts to appear as separate people." },
            { step: 2, title: "The Pump", content: "The group begins coordinated buying and promoting the coin across social media, forums, and messaging apps. They might claim 'insider information,' fake partnerships, or impending announcements. As retail investors start buying, the price surges dramatically — sometimes 500% or more in hours." },
            { step: 3, title: "The Dump", content: "At the peak, the organizers sell their entire position into the buying frenzy. Since they bought at rock-bottom prices and the price has skyrocketed, they make enormous profits. The massive sell-off crashes the price. The retail investors who bought during the pump are left holding coins worth a fraction of what they paid." },
            { step: 4, title: "The Aftermath", content: "Victims often don't realize they've been scammed. The price drop is explained as a 'correction' or 'profit-taking.' The organizers move on to the next coin and repeat the cycle. These schemes often operate on platforms like Telegram and Discord, where they can coordinate quickly and disappear easily." },
            { step: 5, title: "How to Protect Yourself", content: "Be extremely skeptical of sudden hype around low-market-cap coins. If everyone on social media is suddenly talking about the same coin, ask yourself: 'Why?' Check if the project has genuine fundamentals or just hype. Never buy based solely on social media tips. Remember: the people promoting the coin likely bought it much cheaper than you." }
          ]
        },
        {
          id: "sc-giveaway",
          title: "The Fake Giveaway",
          summary: "You see a post from 'Elon Musk' offering to double any Bitcoin you send. It looks real. But it's a scam designed to steal your crypto.",
          steps: [
            { step: 1, title: "The Impersonation", content: "Scammers create fake social media accounts that look identical to famous people, exchanges, or crypto projects. They use the same profile picture, similar usernames (like 'Vitalik_Buterin' with a capital I instead of l), and post convincing content. These accounts often have thousands of followers from previous scams." },
            { step: 2, title: "The Offer", content: "The fake account posts something like: 'To celebrate our success, we're giving back to the community! Send 0.1 BTC to the address below and we'll send back 0.2 BTC! Limited time only!' They may create fake video testimonials from 'winners' and reply to comments saying 'I got paid!'" },
            { step: 3, title: "The Illusion of Legitimacy", content: "The scammers may use bots to post fake 'I received my doubled crypto!' comments. They might show doctored screenshots of successful transactions. Some even create fake live-stream videos of 'real-time payouts.' The more convincing the setup, the more people fall for it." },
            { step: 4, title: "The Theft", content: "When you send your crypto to the 'giveaway address,' it goes directly to the scammer. There is NO doubling. There is NO return. The money is gone instantly. Since crypto transactions are irreversible, there's no way to get it back. The scammers then move the funds through mixers to hide the trail." },
            { step: 5, title: "How to Protect Yourself", content: "RULE: No legitimate person or project will ever ask you to send crypto to receive more crypto back. NEVER send crypto to participate in a giveaway. Verify account authenticity — look for the blue verification checkmark. If an offer seems too good to be true, it absolutely is. Report fake accounts to the platform." }
          ]
        },
        {
          id: "sc-phish",
          title: "The Phishing Attack",
          summary: "You receive an email that looks like it's from your crypto exchange. It says your account has a security issue and provides a link to fix it. But the link leads to a fake site that steals your login details.",
          steps: [
            { step: 1, title: "The Bait", content: "You receive an email, text, or direct message that appears to be from a legitimate source — your exchange, wallet provider, or a crypto platform. It might say: 'Your account has been compromised. Click here to verify your identity immediately or your account will be suspended.' The design, logos, and language look authentic." },
            { step: 2, title: "The Fake Website", content: "The link takes you to a website that looks exactly like the real thing — same design, same layout, even the same URL (except for one subtle difference, like 'coinbase-security.com' instead of 'coinbase.com'). It has a login form, or perhaps asks you to enter your seed phrase for 'verification.'" },
            { step: 3, title: "The Credential Theft", content: "When you enter your username, password, 2FA code, or seed phrase on the fake site, the scammers capture everything. They may redirect you to the real site so you don't notice anything wrong. Within seconds, they use your credentials to log into your real account and drain your funds." },
            { step: 4, title: "The Discovery", content: "You might not notice until you try to log in and find your balance is zero. Or you might see transactions you didn't make. By then, the funds have been moved through multiple wallets and are nearly impossible to recover. The phishing site may have been taken down, but the scammers are already targeting new victims." },
            { step: 5, title: "How to Protect Yourself", content: "NEVER click links in unsolicited emails or messages. ALWAYS type the URL directly into your browser or use a bookmark. Check the URL carefully — scammers use subtle misspellings. Enable hardware 2FA (not SMS). NEVER enter your seed phrase anywhere except your wallet app. Use a password manager to detect fake login pages. When in doubt, contact the company directly through their official website." }
          ]
        }
      ]
    },

    /* ════════════════════════════════════════════════
       MODULE 6 — INVESTING PRINCIPLES
       ════════════════════════════════════════════════ */
    module6: {
      id: "investing",
      title: "Investing Principles",
      subtitle: "Essential Concepts for Smart and Responsible Cryptocurrency Investing",
      type: "topics",
      topics: [
        {
          id: "inv-risk",
          title: "Risk vs. Reward",
          content: [
            "Every investment involves a trade-off between risk and potential reward. Higher-risk investments offer the possibility of larger returns but also larger losses. Lower-risk investments offer more modest returns but greater safety. There is no investment that offers high rewards with low risk — anyone promising this is likely running a scam.",

            "In crypto, the risk spectrum is wide. Bitcoin is generally considered the least risky cryptocurrency due to its large market cap, long history, and widespread adoption. Mid-cap coins like Cardano and XRP carry moderate risk. Small, new, or meme coins carry extreme risk — they could 100x or go to zero.",

            "Understanding your personal risk tolerance is crucial. Ask yourself: How would I feel if my investment dropped 50% tomorrow? Could I sleep at night? Would I need to sell at a loss to cover expenses? Be honest with yourself. There's no shame in being conservative — the best investment strategy is one you can stick with through good times and bad."
          ],
          keyPoints: [
            "Higher risk = higher potential reward AND higher potential loss",
            "No investment offers guaranteed high returns with low risk",
            "Bitcoin is generally the lowest-risk crypto; meme coins are extremely high-risk",
            "Know your personal risk tolerance before investing",
            "Only invest amounts that wouldn't devastate you if lost",
            "Risk tolerance changes with age, income, and financial obligations"
          ]
        },
        {
          id: "inv-diversify",
          title: "Diversification",
          content: [
            "Diversification means spreading your investments across different assets so that a single failure doesn't wipe you out. The classic saying is 'don't put all your eggs in one basket.' If you hold only one coin and it crashes, you lose everything. If you hold 10 coins and one crashes, you only lose a portion of your portfolio.",

            "In crypto, you can diversify across different categories: established coins (BTC, ETH) for stability, smart contract platforms (SOL, ADA) for growth potential, and perhaps a small allocation to newer projects. You can also diversify by holding some stablecoins as a 'safe harbor' during market downturns.",

            "However, note that during crypto bear markets, most cryptocurrencies tend to fall together because they're correlated. True diversification might also mean holding some non-crypto assets like stocks or bonds. The key is finding a mix that matches your goals and risk tolerance."
          ],
          keyPoints: [
            "Diversification reduces the impact of any single asset's failure",
            "Spread investments across different categories: established, growth, stable",
            "Consider non-crypto assets as part of overall diversification",
            "Crypto assets tend to be correlated — they often move together",
            "Rebalance periodically to maintain your target allocation",
            "Diversification reduces risk but doesn't eliminate it"
          ]
        },
        {
          id: "inv-longterm",
          title: "Long-Term Investing",
          content: [
            "Long-term investing means buying assets you believe in and holding them for months or years, rather than trying to profit from short-term price swings. This approach is often called 'HODLing' in the crypto community. Historically, long-term holding has been the most successful strategy in crypto.",

            "The reasoning is simple: crypto markets are extremely volatile in the short term but have shown strong upward trends over longer periods. Bitcoin has experienced multiple 70-80% drawdowns but has always reached new all-time highs given enough time. Traders who try to time the market often miss the biggest gains.",

            "Long-term investing also reduces stress. Instead of checking prices hourly and agonizing over daily swings, you can focus on learning, building your career, and living your life. Set it and (mostly) forget it. Review your portfolio monthly or quarterly, not hourly."
          ],
          keyPoints: [
            "Historically the most successful crypto strategy",
            "Short-term volatility is noise; long-term trends matter more",
            "Reduces stress compared to active trading",
            "Avoids the temptation to time the market",
            "Review monthly or quarterly, not hourly",
            "Patience and discipline are your greatest advantages"
          ]
        },
        {
          id: "inv-emotional",
          title: "Emotional Investing",
          content: [
            "Emotions are the enemy of good investment decisions. When prices are surging, euphoria makes you feel invincible and want to invest everything. When prices are crashing, panic makes you want to sell everything immediately. Both reactions usually lead to buying high and selling low — the exact opposite of what you should do.",

            "Studies show that the average investor significantly underperforms the market because of emotional decisions. They buy during euphoria (at peak prices) and sell during panic (at bottom prices). Professional investors often do the opposite — buying when others are fearful and selling when others are greedy.",

            "Combat emotional investing with a written plan. Before investing, write down your strategy: what you'll buy, when you'll buy, how much you'll invest, and when you'll sell. When emotions run high, refer to your plan. Taking breaks from screens during extreme volatility also helps. Remember: the market will still be there tomorrow."
          ],
          keyPoints: [
            "Euphoria leads to buying at peaks; panic leads to selling at bottoms",
            "Emotional investors historically underperform the market",
            "Create a written investment plan and follow it",
            "Take breaks from screens during extreme volatility",
            "Buy when others are fearful; be cautious when others are greedy",
            "Your emotions are real — but they make terrible investment advisors"
          ]
        },
        {
          id: "inv-fomo",
          title: "Understanding FOMO",
          content: [
            "FOMO — Fear Of Missing Out — is one of the most dangerous forces in investing. It's that urgent feeling when you see a coin pumping 200% and everyone seems to be making money except you. Your brain screams 'buy now or you'll miss the opportunity forever!' This is exactly the moment when you should step back, not dive in.",

            "FOMO is driven by social proof — we assume that because others are doing something, it must be the right choice. In crypto, FOMO is amplified by social media where people post their gains (but rarely their losses). Remember: for every person posting about their 10x gain, thousands lost money on similar bets.",

            "The antidote to FOMO is having a pre-defined investment strategy. If you've already decided to invest $100 per month into specific coins through DCA, stick to that plan regardless of what's trending. The best trades are often the ones you DON'T make. There will always be another opportunity — the market is open 24/7/365."
          ],
          keyPoints: [
            "FOMO drives impulsive buying at the worst times",
            "Social media amplifies FOMO by showing only successes",
            "For every winner posted, many more people lost money",
            "A pre-defined strategy protects you from FOMO-driven decisions",
            "The market will always offer new opportunities",
            "Missing out on one trade is not a failure — chasing it might be"
          ]
        },
        {
          id: "inv-cycles",
          title: "Market Cycles",
          content: [
            "Cryptocurrency markets move in cycles — periods of growth (bull markets) followed by periods of decline (bear markets). These cycles have historically lasted roughly 4 years, loosely correlated with Bitcoin's halving events. Understanding cycles helps you maintain perspective during extreme market conditions.",

            "A typical cycle has four phases: (1) Accumulation — prices are low, smart money buys quietly. (2) Mark-up (Bull Market) — prices rise, public interest grows, media coverage increases. (3) Distribution — early investors start taking profits while new investors keep buying. (4) Mark-down (Bear Market) — prices fall, public loses interest, negative sentiment peaks. Then the cycle repeats.",

            "The key insight is that bear markets create the best buying opportunities, and bull markets create the best selling opportunities. This is emotionally backwards from what feels natural — buying when things look terrible and selling when everything looks amazing. Understanding cycles helps you act rationally when others are acting emotionally."
          ],
          keyPoints: [
            "Markets cycle through bull and bear phases",
            "Four phases: Accumulation → Mark-up → Distribution → Mark-down",
            "Cycles have historically lasted ~4 years in crypto",
            "Bear markets = best time to accumulate (but patiently)",
            "Bull markets = time to be cautious about new investments",
            "Understanding cycles helps you buy low and sell high"
          ]
        },
        {
          id: "inv-dca",
          title: "Dollar Cost Averaging (DCA)",
          content: [
            "Dollar Cost Averaging (DCA) is the practice of investing a fixed amount of money at regular intervals, regardless of the asset's price. For example, buying $50 of Bitcoin every Friday. You buy more Bitcoin when prices are low and less when prices are high, naturally averaging your purchase price over time.",

            "DCA's main advantage is that it removes the need to time the market — which even professionals struggle to do consistently. Instead of agonizing over whether 'now is the right time to buy,' you simply follow your schedule. Over months and years, DCA typically outperforms lump-sum investing for most people because it reduces the impact of volatility.",

            "DCA also reduces emotional stress. When prices crash, instead of panicking, DCA investors see it as a buying opportunity — their regular purchase buys more at the lower price. When prices are high, they don't feel pressure to invest more than planned. This disciplined approach is ideal for beginners and long-term investors."
          ],
          keyPoints: [
            "Invest a fixed amount at regular intervals, regardless of price",
            "Removes the need to time the market",
            "Naturally buys more at low prices, less at high prices",
            "Reduces emotional stress and decision fatigue",
            "Historically outperforms trying to time entries",
            "Works best with a long-term time horizon (months to years)"
          ]
        },
        {
          id: "inv-inflation",
          title: "Inflation and Money",
          content: [
            "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power. When inflation is 3%, something that costs $100 today will cost $103 next year. Your money is worth 3% less — even if it's sitting in your bank account. This is often called a 'hidden tax' because governments can create money without directly taxing citizens.",

            "One of the main arguments for Bitcoin as an investment is its potential as an inflation hedge. Unlike fiat currencies that can be printed in unlimited quantities, Bitcoin has a fixed supply of 21 million. The logic is simple: if the supply of dollars grows while the supply of Bitcoin stays fixed, Bitcoin's value should increase relative to dollars over time.",

            "However, it's important to note that Bitcoin's relationship with inflation is still being debated. While its fixed supply is theoretically anti-inflationary, Bitcoin's price has been too volatile to function as a reliable store of value in the short term. Think of it this way: Bitcoin may be a good long-term hedge, but you shouldn't view it as a replacement for a traditional emergency fund or stable savings account."
          ],
          keyPoints: [
            "Inflation erodes the purchasing power of money over time",
            "Since 1971, the US dollar has lost over 85% of its purchasing power",
            "Bitcoin's fixed supply of 21 million makes it theoretically anti-inflationary",
            "Bitcoin is often compared to 'digital gold' as a store of value",
            "Bitcoin's short history makes its inflation-hedging properties still debated",
            "Diversify rather than relying solely on any single asset for inflation protection"
          ]
        }
      ]
    }
  };
})();