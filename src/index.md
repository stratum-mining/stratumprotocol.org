---
home: true
layout: HomeLayout
background: /assets/hero-background.jpg
heroImage: /assets/stratum-v2-icon-with-text.svg
heroText1: Stratum V2 is the next generation protocol for pooled mining. It increases security, makes data transfers more efficient, and reduces mining infrastructure requirements. It also introduces three new sub-protocols that let miners select transaction sets and
heroTextHighlight: improve decentralization
heroText2: by negotiating with pools.
tagline: One giant leap for bitcoin mining
documentationCtaText: Get Started
documentationCtaLink: /overview
links:
  - title: GitHub
    url: https://github.com/stratum-mining
    icon: /assets/github-icon.svg
  - title: Documentation
    url: /milestones/
footerLinks:
  - url: https://twitter.com/StratumV2
    icon: /assets/twitter.svg
  - url: https://discord.gg/fsEW23wFYs
    icon: /assets/discord.svg
  - url: https://github.com/stratum-mining/stratum
    icon: /assets/github-icon.svg
# Configurations Section
configurationTitle: Flexible configurations
configurationTabs:
  - name: Config A
    value: config_A
    visualSrc: /assets/config-a.svg
    mobileVisualSrc: /assets/config-a-mobile.svg
    textContent: Before Stratum V2, transaction sets were selected by pools. With this SV2 configuration they’re selected by individual miners, making the network more censorship-resistant. Miners run SV2 firmware, connecting to the SV2 proxy server. Miners can pick their transactions locally and negotiate them with an SV2 pool.
  - name: Config B
    value: config_B
    visualSrc: /assets/config-b.svg
    mobileVisualSrc: /assets/config-b-mobile.svg
    textContent: In this configurations, mining pool select transactions, but it uses all the security and performance features of the protocol.
  - name: Config C
    value: config_C
    visualSrc: /assets/config-c.svg
    mobileVisualSrc: /assets/config-c-mobile.svg
    textContent: Miners can use SV2 even if they run SV1 firmware. The translation proxy translates SV1 to SV2 messages and sends them to the SV2 pool. Transactions selection, in this configuration is done by the pool.
  - name: Config D
    value: config_D
    visualSrc: /assets/config-d.svg
    mobileVisualSrc: /assets/config-d-mobile.svg
    textContent: In this configuration miners run mining devices with SV1 firmware and connect to the translation proxy which translates the SV1 to SV2 messages and sends them to the SV2 pool. Transaction selection is done by the miners locally and then negotiated with the pool.
roadmapTitle: Progress and Roadmap
roadmapTagline: This is where the Stratum V2 protocol’s progress currently stands.
roadmapSteps:
  - __MVP1__ will allow users to run SV2 where a miner runs existing SV1 firmware with a proxy that translates messages into SV2. In this configuration, the pool selects transactions.
  - A pull request that implements a **block template provider** will be submitted to the Bitcoin Core repository for review which will make MVP1 complete.
  - Implement the **job negotiator**, which a miner or miners can use to negotiate a block template with a pool.
  - Once a translator, template provider, and job negotiator are running, we will launch an MVP2. In this configuration, a miner handles mempool transaction selection, and the pool accepts it.
  - Apply early adopter feedback and tailor configurations that will move MVP1 and MVP2 from beta to production-ready.
# Specification authors section
specificationAuthorsTitle: Stratum V2 specification authors
specificationAuthorsText: Stratum V2 specs authors are Pavel Moravec and Jan Čapek, in collaboration with Matt Corallo and other industry experts.
authors:
  - image: /assets/author-1.png
  - image: /assets/author-2.png
  - image: /assets/author-3.png

# Supporters section
supportersTitle: Support for Stratum V2
supportersText1: Let’s make Stratum V2 the new standard. Show material support or indicate your approval of the protocol direction.
supportersTabs:
  - name: All contributors
    value: all-contributors
  - name: Implementers
    value: implementers
    supporters:
      - braiins
      - sri
  - name: Adopters
    value: adopters
    supporters:
      - braiins
      - galaxy
  - name: Funders
    value: funders
    supporters:
      - bitmex
      - foundry
      - galaxy
      - spiral
      - sob
supporters:
  - value: bitmex
    image: /assets/bitmex-logo.svg
    link: https://bitmex.com/
  - value: braiins
    image: /assets/braiins-logo.svg
    link: https://braiins.com/
  - value: foundry
    image: /assets/foundry-logo.svg
    link: https://foundrydigital.com/
  - value: galaxy
    image: /assets/galaxy-logo.svg
    link: https://www.galaxy.com/
  - value: spiral
    image: /assets/spiral-logo.svg
    link: https://www.spiral.xyz/
  - value: sri
    image: /assets/stratum-v2-icon.svg
    link: https://github.com/stratum-mining/stratum    
  - value: sob
    image: /assets/summer-of-bitcoin.svg
    link: https://www.summerofbitcoin.org/
whyTitle: Layers of Upgrades
supportDevelopersText: Support Developers
supportDevelopersLink: "mailto:stratumv2@gmail.com"
why:
  - title: Security
    text: V2 introduces by-default encryption and NOISE protocol authentication, hardening the protocol against man-in-the-middle attacks.
    image: /assets/padlock.svg
  - title: Performance
    text: The new Stratum optimizes data transfer size and frequency between miners, proxies, and pool operators, creating higher submission rates while reducing hash rate variance (miner payouts).
    image: /assets/speedometer.svg
  - title: Flexibility
    text: V2 improves logic and framework by letting miners and mining pools running V1 make incremental and modular improvements. These implementations can communicate via pool and client-side proxy translations with minimal tradeoffs.
    image: /assets/blockchain.svg
  - title: Censorship Resistance
    text: New features further decentralize bitcoin by integrating distributed transaction selections into the protocol, letting end-miners build and select transaction sets and block templates.
    image: /assets/speaker.svg
  - title: Standardization
    text: By failing to precisely define Stratum V1’s specifications, we inadvertently created multiple implementations with varying semi-compatible dialects. Stratum V2 fixes this by defining its protocol parameters to ensure cross-compatibility between and pools and end-mining devices.
    image: /assets/compare.svg
readDocumentationText: Read the Docs
readDocumentationLink: /overview
footerTitle: Join us on
footerBottom: Made by the open-source bitcoin community. <a href="https://www.freepik.com/free-vector/space-illustration-night-alien-fantasy-landscape_5603523.htm" rel="nofollow noindex">Image by vectorpouch</a> on Freepik.
meta:
  # We can reuse & customize those tags on other pages of the website
  # Primary Meta Tags
  - name: title
    content: StratumV2
  - name: description
    content: The next gen bitcoin mining protocol.

  # Open Graph / Facebook
  - name: og:type
    content: website
  - name: og:url
    content: https://stratumprotocol.org/
  - name: og:title
    content: StratumV2
  - name: og:description
    content: The next gen bitcoin mining protocol.
  - name: og:image
    content: /assets/landing-social-media-share-image.png

  # Twitter
  - name: twitter:card
    content: summary_large_image
  - name: twitter:url
    content: https://stratumprotocol.org/
  - name: twitter:title
    content: StratumV2
  - name: twitter:description
    content: The next gen bitcoin mining protocol.
  - name: twitter:image
    content: /assets/landing-social-media-share-image.png
---
