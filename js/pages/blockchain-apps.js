/**
 * CryptoVerse Academy — Blockchain Beyond Cryptocurrency
 * ======================================================
 * Showcases 8 real-world blockchain applications with
 * detailed modals containing case studies, steps, benefits,
 * and challenges.
 *
 * Dependencies: window.Store, window.UI
 */
window.Pages = window.Pages || {};

window.Pages['blockchain-apps'] = function () {
  'use strict';

  var apps = [
    {
      id: 'healthcare',
      title: 'Healthcare',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      desc: 'Secure patient records, drug supply chain tracking, and decentralized clinical trial management using immutable ledgers.',
      caseStudy: 'Medicalchain and MedRec are pioneering blockchain-based health record systems. Medicalchain allows patients to give conditional access to their health records to doctors, researchers, and insurers. In Estonia, over 1 million patient records are secured using blockchain technology, giving citizens full control over who accesses their medical data. The COVID-19 pandemic accelerated adoption, with blockchain used to verify vaccine supply chains and manage patient data across borders while maintaining privacy compliance.',
      steps: ['Patient data is encrypted and stored on a distributed ledger with a unique hash reference.', 'Patients use a digital wallet app to grant time-limited access to specific records.', 'Doctors and hospitals verify credentials through the blockchain network before accessing data.', 'Every access, update, or transfer is permanently logged, creating an immutable audit trail.'],
      benefits: ['Eliminates duplicate records and reduces medical errors', 'Patients maintain full ownership and control of their health data', 'Reduces administrative costs by up to 30%', 'Enables secure cross-border medical data sharing', 'Prevents unauthorized access and data breaches'],
      examples: 'Medicalchain (UK), MedRec (MIT), Estonia e-Health Authority, BurstIQ, Pharmaceutical companies tracking drug provenance',
      challenges: 'Regulatory compliance (HIPAA, GDPR), interoperability with legacy hospital systems, scalability for large medical images, standardizing data formats across providers.'
    },
    {
      id: 'voting',
      title: 'Voting',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      desc: 'Transparent, tamper-proof electronic voting systems that increase voter trust and participation in democratic processes.',
      caseStudy: 'West Virginia became the first U.S. state to offer blockchain-based mobile voting for overseas military personnel in 2018, using the Voatz platform. In Utah County, blockchain voting was used for municipal elections. Estonia has been exploring blockchain-secured i-Voting since 2005, allowing citizens to vote remotely with cryptographic verification. Follow My Vote, an open-source blockchain voting platform, has demonstrated how voters can verify their ballot was counted while maintaining anonymity. These systems aim to solve the fundamental trust problem in elections.',
      steps: ['Voters register their identity through a verified digital identity system.', 'When voting opens, voters cast encrypted ballots that are recorded on the blockchain.', 'Each vote is anonymized using zero-knowledge proofs so no one can see who voted for whom.', 'Results are tallied automatically from the immutable ledger, with anyone able to verify the count.'],
      benefits: ['Virtually eliminates vote tampering and fraud', 'Provides mathematical proof that every vote was counted', 'Enables remote and accessible voting for all citizens', 'Reduces election costs by eliminating paper ballots and manual counting', 'Allows voters to independently verify their vote was recorded'],
      examples: 'Voatz (West Virginia, Utah), Estonia i-Voting, Follow My Vote, Votem, Bitfury Group election solutions',
      challenges: 'Digital divide (not all voters have smartphones/internet), potential for coercion in remote voting, scalability for national elections, public trust in the technology itself.'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chains',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
      desc: 'End-to-end product tracking from raw materials to consumer, ensuring authenticity, ethical sourcing, and quality control.',
      caseStudy: 'Walmart partnered with IBM Food Trust to track the journey of produce from farm to store shelf. What previously took 7 days to trace now takes 2.2 seconds. When an E. coli outbreak occurred, Walmart could quickly identify the exact farm of origin and remove only affected products. De Beers uses blockchain (Tracr) to track diamonds from mine to retail, ensuring conflict-free diamonds and reducing fraud. Maersk and IBM created TradeLens to digitize global shipping, reducing paperwork and delays at ports by up to 40%.',
      steps: ['A product receives a unique digital identity (token or NFT) at the point of origin.', 'Each participant in the supply chain (farmers, shippers, warehouses) records events on the shared ledger.', 'Smart contracts automatically trigger actions like payments when conditions are met (delivery confirmed).', 'Consumers and regulators can scan a QR code to see the complete journey and verify authenticity.'],
      benefits: ['Drastically reduces time to trace contaminated products from days to seconds', 'Eliminates counterfeit goods in luxury, pharmaceutical, and food industries', 'Reduces paperwork and administrative overhead by up to 50%', 'Enables automated payments through smart contracts', 'Increases consumer trust through radical transparency'],
      examples: 'IBM Food Trust (Walmart, Nestl\u00E9), VeChain (luxury goods, auto), TradeLens (Maersk/IBM shipping), De Beers Tracr (diamonds), Bumble Bee (seafood)',
      challenges: 'Getting all supply chain participants to adopt the same system, cost of IoT sensors for real-time data, data privacy between competing companies, handling exceptions and disputes.'
    },
    {
      id: 'banking',
      title: 'Banking',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="8" y1="10" x2="8" y2="21"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="16" y1="10" x2="16" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/></svg>',
      desc: 'Decentralized finance (DeFi), cross-border payments, and programmable money transforming traditional financial services.',
      caseStudy: 'JPMorgan Chase created JPM Coin for instant cross-border payments between institutional clients, settling transactions in seconds instead of days. The World Bank estimates that global remittances exceed $700 billion annually, with average fees of 6.5%. Blockchain solutions like Stellar and Ripple reduce these fees to fractions of a cent. Central banks worldwide (China, EU, UK) are developing Central Bank Digital Currencies (CBDCs) built on blockchain-inspired technology. DeFi protocols like Aave and Compound now hold billions in total value locked, offering lending and borrowing without traditional banks.',
      steps: ['A user initiates a payment or financial transaction through a blockchain-based application.', 'The transaction is validated by network nodes and recorded on the distributed ledger.', 'Smart contracts automatically execute the financial terms (interest, collateral, transfers).', 'Settlement occurs near-instantly, with all parties having a shared record of the transaction.'],
      benefits: ['Cross-border payments settle in seconds instead of 3-5 business days', 'Transaction costs reduced by 60-80% compared to traditional wire transfers', 'Financial services accessible to 1.7 billion unbanked adults worldwide', 'Programmable money enables automated financial agreements', '24/7 operation compared to limited banking hours'],
      examples: 'JPM Coin (JPMorgan), Stellar (remittances), Aave & Compound (DeFi lending), CBDCs (China e-CNY, Bahamas Sand Dollar), RippleNet',
      challenges: 'Regulatory uncertainty and compliance requirements, price volatility of crypto assets, smart contract security risks, competition with well-established traditional banking infrastructure.'
    },
    {
      id: 'identity',
      title: 'Identity',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      desc: 'Self-sovereign digital identity giving individuals control over their personal data, reducing identity theft and simplifying verification.',
      caseStudy: 'Microsoft has been developing its ION decentralized identity network on Bitcoin since 2019, allowing users to create self-sovereign identities. In developing nations, the UN World Food Programme uses blockchain-based identity (SCOPE) to distribute aid to Syrian refugees in Jordan, saving millions in bank fees. Estonia\'s e-Residency program provides a government-issued digital identity that allows anyone worldwide to access EU business services. The city of Zug, Switzerland ("Crypto Valley") accepts blockchain-verified digital IDs for civic services, proving the concept works at the municipal level.',
      steps: ['A user creates a decentralized identity (DID) and stores verified credentials in their personal digital wallet.', 'When identity verification is needed, the user presents a cryptographic proof without revealing unnecessary personal data.', 'The verifier checks the proof against the blockchain-anchored credential registry.', 'Access is granted or denied, with the user maintaining control and a log of every verification request.'],
      benefits: ['Individuals own and control their personal data (no more corporate data silos)', 'Eliminates password-based authentication and reduces account takeover fraud', 'Enables instant identity verification for banking, travel, and services', 'Reduces identity theft through cryptographic rather than document-based verification', 'Gives refugees and undocumented individuals verifiable digital identities'],
      examples: 'Microsoft ION, UN WFP SCOPE, Estonia e-Residency, uPort (ConsenSys), Civic, Worldcoin',
      challenges: 'Establishing trust frameworks for credential issuers, recovery mechanisms for lost private keys, government acceptance and legal recognition, balancing privacy with regulatory requirements.'
    },
    {
      id: 'education',
      title: 'Education',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',
      desc: 'Verifiable digital credentials, decentralized learning platforms, and transparent academic record systems that prevent credential fraud.',
      caseStudy: 'MIT has been issuing blockchain-based digital diplomas since 2017 through the Blockcerts platform, allowing graduates to share verifiable credentials instantly with employers. The University of Melbourne, Central New Mexico College, and dozens of institutions worldwide have followed. Learning Machine Technologies (now Hyland Credentials) powers this system. In 2021, Malta became the first country to mandate blockchain-based certification for all educational institutions. The platform Woolf University operates as a fully blockchain-governed accredited university, with all degrees and transcripts on-chain.',
      steps: ['An educational institution issues a digital certificate as a blockchain credential with cryptographic signatures.', 'The graduate receives the credential in their digital wallet and can share it with anyone.', 'Employers or other institutions verify the credential instantly by checking the blockchain record.', 'The verification confirms the credential is authentic, unaltered, and issued by the claimed institution.'],
      benefits: ['Eliminates credential fraud and fake diploma mills', 'Instant verification saves employers weeks of background checking', 'Students own portable, shareable academic records for life', 'Reduces institutional costs for transcript processing and verification', 'Enables micro-credentials and skill-based certifications alongside traditional degrees'],
      examples: 'MIT Blockcerts, Woolf University, Malta Blockchain Certificates, Sony Global Education, Open University (UK), Learning Machine/Hyland',
      challenges: 'Institutional adoption inertia and legacy system integration, establishing global standards for digital credentials, privacy of academic records, not all employers understand or accept blockchain credentials yet.'
    },
    {
      id: 'gaming',
      title: 'Gaming',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/></svg>',
      desc: 'True ownership of in-game assets as NFTs, play-to-earn economies, and decentralized gaming marketplaces with real-world value.',
      caseStudy: 'Axie Infinity generated over $4 billion in revenue in 2021, demonstrating that blockchain gaming could create real economies. Players in the Philippines earned significant income during the pandemic through the game\'s play-to-earn model. The Sandbox and Decentraland have sold virtual land parcels for millions of dollars, with major brands (Atari, Snoop Dogg, Adidas) establishing virtual presences. Immutable X provides gas-free NFT trading for games like Gods Unchained and Guild of Guardians, solving the scalability problem that previously limited blockchain gaming.',
      steps: ['Game items (weapons, characters, land) are minted as NFTs on a blockchain, giving players verifiable ownership.', 'Players earn tokens through gameplay, which can be traded on decentralized exchanges for real money.', 'A marketplace allows peer-to-peer trading of game items without platform fees or restrictions.', 'Players can use their assets across different games that support the same token standards.'],
      benefits: ['Players truly own their in-game items and can sell them freely', 'Play-to-earn models create economic opportunities in developing regions', 'Interoperable assets can move between compatible games', 'Transparent and fair random number generation for loot boxes', 'Creators earn royalties on secondary market sales of their creations'],
      examples: 'Axie Infinity, The Sandbox, Decentraland, Gods Unchained, Illuvium, Star Atlas, Immutable X',
      challenges: 'High environmental concerns (though layer-2 solutions help), regulatory uncertainty around play-to-earn as income, game quality often secondary to earning mechanics, volatility of in-game token economies.'
    },
    {
      id: 'realestate',
      title: 'Real Estate',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      desc: 'Tokenized property ownership enabling fractional investment, automated title transfers, and transparent property transaction records.',
      caseStudy: 'RealT has tokenized over $100 million worth of U.S. real estate, allowing investors to buy fractions of properties starting at $50. In 2021, a Miami condominium became one of the first properties sold entirely as NFTs in a legally binding transaction by Propy. The UAE\'s Dubai Land Department has implemented blockchain for property registration, recording over 2,000 transactions daily. ShelterZoom uses blockchain to streamline the entire real estate transaction process, from offer to closing, reducing typical closing times from 60+ days to under 30.',
      steps: ['A property is appraised and legally structured, then tokenized into digital shares on a blockchain platform.', 'Investors purchase tokens representing fractional ownership of the property, recorded on-chain.', 'Smart contracts automatically distribute rental income to token holders proportionally.', 'When the property is sold, smart contracts distribute proceeds to all token holders automatically.'],
      benefits: ['Fractional ownership lowers the barrier to real estate investing from hundreds of thousands to as little as $50', 'Eliminates intermediaries (title companies, escrow agents) reducing transaction costs by 20-30%', 'Property transactions settle in days instead of months', 'Increases liquidity in traditionally illiquid real estate markets', 'Transparent ownership records prevent title fraud'],
      examples: 'RealT (fractional U.S. properties), Propy (NFT real estate sales), Dubai Land Department, ShelterZoom, Lofty AI, Landshare',
      challenges: 'Complex legal framework for tokenized property rights across jurisdictions, traditional mortgage lenders are slow to accept blockchain records, property valuation and token pricing mechanisms, regulatory classification of property tokens as securities.'
    }
  ];

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div'); d.textContent = s; return d.innerHTML;
  }

  var html = '<style>' +
    '.ba-page{max-width:1080px;margin:0 auto;padding:24px}' +
    '.ba-header{text-align:center;margin-bottom:32px}' +
    '.ba-header h1{font-size:1.75rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0 0 8px}' +
    '.ba-header p{color:var(--text-secondary,#94a3b8);font-size:.95rem;margin:0}' +
    '.ba-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}' +
    '.ba-card{background:var(--bg-card,rgba(30,41,59,.8));border:1px solid var(--border-color,rgba(148,163,184,.15));border-radius:14px;padding:24px;text-align:center;transition:all .3s;display:flex;flex-direction:column;align-items:center}' +
    '.ba-card:hover{border-color:var(--accent,#8b5cf6);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}' +
    '.ba-card-icon{color:var(--accent,#8b5cf6);margin-bottom:12px}' +
    '.ba-card h3{font-size:1rem;font-weight:600;color:var(--text-primary,#e2e8f0);margin:0 0 8px}' +
    '.ba-card p{font-size:.85rem;color:var(--text-secondary,#94a3b8);margin:0 0 16px;line-height:1.5;flex:1}' +
    '.ba-explore-btn{background:transparent;border:1px solid var(--accent,#8b5cf6);color:var(--accent,#8b5cf6);padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.8rem;transition:all .2s;width:100%}' +
    '.ba-explore-btn:hover{background:var(--accent,#8b5cf6);color:#fff}' +
    /* Modal */
    '.ba-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s}' +
    '.ba-modal-overlay.open{opacity:1;pointer-events:auto}' +
    '.ba-modal{background:var(--bg-surface,#1e293b);border:1px solid var(--border-color,rgba(148,163,184,.2));border-radius:16px;max-width:720px;width:100%;max-height:85vh;overflow-y:auto;padding:32px;transform:translateY(20px);transition:transform .3s}' +
    '.ba-modal-overlay.open .ba-modal{transform:translateY(0)}' +
    '.ba-modal-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}' +
    '.ba-modal-header h2{font-size:1.35rem;font-weight:700;color:var(--text-primary,#e2e8f0);margin:0}' +
    '.ba-modal-close{background:none;border:none;color:var(--text-muted,#64748b);font-size:1.5rem;cursor:pointer;padding:4px;line-height:1;transition:color .2s;flex-shrink:0}' +
    '.ba-modal-close:hover{color:var(--text-primary,#e2e8f0)}' +
    '.ba-modal-section{margin-bottom:20px}' +
    '.ba-modal-section h4{font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent,#8b5cf6);margin:0 0 8px}' +
    '.ba-modal-section p{font-size:.9rem;color:var(--text-secondary,#94a3b8);line-height:1.65;margin:0 0 8px}' +
    '.ba-modal-section ul{margin:0;padding:0 0 0 18px;color:var(--text-secondary,#94a3b8);font-size:.875rem;line-height:1.7}' +
    '.ba-modal-section ol{margin:0;padding:0 0 0 18px;color:var(--text-secondary,#94a3b8);font-size:.875rem;line-height:1.7}' +
    '.ba-modal-section ol li{margin-bottom:4px}' +
    '.ba-modal-section .ba-challenges{background:rgba(249,115,22,.08);border-left:3px solid #f97316;padding:10px 14px;border-radius:0 8px 8px 0;font-size:.85rem;color:#fdba74;line-height:1.5}' +
  '</style>';

  html += '<div class="ba-page">';

  /* Header */
  html += '<div class="ba-header">' +
    '<h1>\uD83D\uDE80 Blockchain Beyond Cryptocurrency</h1>' +
    '<p>Exploring real-world applications of blockchain technology</p>' +
  '</div>';

  /* Grid */
  html += '<div class="ba-grid">';
  apps.forEach(function (app) {
    html += '<div class="ba-card">' +
      '<div class="ba-card-icon">' + app.icon + '</div>' +
      '<h3>' + esc(app.title) + '</h3>' +
      '<p>' + esc(app.desc) + '</p>' +
      '<button class="ba-explore-btn" data-action="explore-app" data-id="' + app.id + '">Explore</button>' +
    '</div>';
  });
  html += '</div>';

  html += '</div>'; /* .ba-page */

  /* Modal */
  html += '<div class="ba-modal-overlay" id="ba-modal-overlay">' +
    '<div class="ba-modal">' +
      '<div class="ba-modal-header">' +
        '<h2 id="ba-modal-title"></h2>' +
        '<button class="ba-modal-close" data-action="close-ba-modal">&times;</button>' +
      '</div>' +
      '<div id="ba-modal-content"></div>' +
    '</div>' +
  '</div>';

  return html;
};