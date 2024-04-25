---
home: true
layout: Home
background: /assets/hero-background.jpg
heroImage: /assets/stratum-v2-icon-with-text.svg
heroText1: Stratum V2 is the next generation protocol for pooled mining. It increases security, makes data transfers more efficient, and reduces mining infrastructure requirements. It also introduces three new sub-protocols that let miners select transaction sets and
heroTextHighlight: improve decentralization.
tagline: One giant leap for bitcoin mining
documentationCtaText: Get started
documentationCtaLink: /getting-started
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
    textContent: Miners can utilize Stratum V2 without updating to SV2 firmware. Connect your SV1 firmware devices through Translation Proxy which facilitates the conversion of SV1 messages to SV2 for communication with an SV2 pool. Miners handle transaction selection locally via their own Template Provider, and declare them to a pool. If a pool rejects the proposed transactions, miners automatically switch to an alternative pool. Should all configured pools decline the proposal, miners fallback to solo mining.
  - name: Config B
    value: config_B
    visualSrc: /assets/config-b.svg
    mobileVisualSrc: /assets/config-b-mobile.svg
    textContent: Before Stratum V2, transaction sets were selected by pools. With this SV2 configuration they’re selected by individual miners, making the network more censorship-resistant. Miners run SV2 firmware, connecting to the SV2 proxy server. Miners can pick their transactions locally and declare them to an SV2 pool.
  - name: Config C
    value: config_C
    visualSrc: /assets/config-c.svg
    mobileVisualSrc: /assets/config-c-mobile.svg
    textContent: Miners can use SV2 even if they run SV1 firmware. The translation proxy translates SV1 to SV2 messages and sends them to the SV2 pool. Transactions selection, in this configuration is done by the pool.
  - name: Config D
    value: config_D
    visualSrc: /assets/config-d.svg
    mobileVisualSrc: /assets/config-d-mobile.svg
    textContent: In this configuration, mining pool selects transactions, but it uses all the security and performance features of the SV2 protocol.
roadmapTitle: Progress and Roadmap
roadmapTagline: This is where the Stratum V2 protocol’s progress currently stands.
roadmapSteps:
  - __MVP1__ will allow users to run SV2 where a miner runs existing SV1 firmware with a proxy that translates messages into SV2. In this configuration, the pool selects transactions.
  - A pull request that implements a **block template provider** will be submitted to the Bitcoin Core repository for review which will make MVP1 complete.
  - Implement the **job declarator**, which a miner or miners can use to declare a block template to a pool.
  - Once a translator, template provider, and job declarator are running, we will launch an MVP2. In this configuration, a miner handles mempool transaction selection, and the pool accepts it.
  - Apply early adopter feedback and tailor configurations that will move MVP1 and MVP2 from beta to production-ready.
# Specification authors section
specificationAuthorsTitle: Stratum V2 specification authors
specificationAuthorsText: Stratum V2 specs authors are Pavel Moravec and Jan Čapek, in collaboration with Matt Corallo and other industry experts.
specificationAuthorsImages:
  - image: /assets/author-1.png
  - image: /assets/author-2.png
  - image: /assets/author-3.png

# Supporters section
supportersTitle: Support for Stratum V2
supportersText1: Let’s make Stratum V2 the new standard. Show material support or indicate your approval of the protocol direction.
supportersTabs:
  - name: All contributors
    value: all-contributors
    supporters:
      - braiins
      - demand
      - sri
      - hrf
      - opensats
      - spiral
      - hut
  - name: Implementers
    value: implementers
    supporters:
      - braiins
      - sri
  - name: Adopters
    value: adopters
    supporters:
      - braiins
      - demand
      - hut
  - name: Funders
    value: funders
    supporters:
      - hrf
      - opensats
      - spiral
pastSupportersTabs:
  - name: Past Supporters
    value: past-supporters
    supporters:
      - bitmex
      - sob
      - foundry
      - galaxy
supporters:
  - value: braiins
    image: /assets/braiins-logo.svg
    link: https://braiins.com/
  - value: demand
    image: /assets/demand-logo.svg
    link: https://www.dmnd.work  
  - value: hrf
    image: /assets/hrf-logo.svg
    link: https://www.hrf.org/
  - value: opensats
    image: /assets/opensats-logo.svg
    link: https://opensats.org/
  - value: spiral
    image: /assets/spiral-logo.svg
    link: https://www.spiral.xyz/
  - value: sri
    image: /assets/stratum-v2-icon.svg
    link: https://github.com/stratum-mining/stratum
  - value: bitmex
    image: /assets/bitmex-logo.svg
    link: https://bitmex.com/
  - value: foundry
    image: /assets/foundry-logo.svg
    link: https://foundrydigital.com/
  - value: galaxy
    image: /assets/galaxy-logo.svg
    link: https://www.galaxy.com/
  - value: sob
    image: /assets/summer-of-bitcoin.svg
    link: https://www.summerofbitcoin.org/
  - value: hut
    image: /assets/hut-logo.svg
    link: https://hut8.io/

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
readDocumentationLink: /docs/
footerTitle: Join us on
footerBottom: Made by the open-source bitcoin community. <a href="https://www.freepik.com/free-vector/space-illustration-night-alien-fantasy-landscape_5603523.htm" rel="nofollow noindex">Image by vectorpouch</a> on Freepik.
meta:
  # We can reuse & customize those tags on other pages of the website
  # Primary Meta Tags
  - name: title
    content: StratumV2
  - name: description
    content: The next generation bitcoin mining protocol. Better security, performance, flexibility and censorship resistance, by allowing miners to select transactions.

  # Open Graph / Facebook
  - name: og:type
    content: website
  - name: og:url
    content: https://stratumprotocol.org/
  - name: og:title
    content: StratumV2
  - name: og:description
    content: The next generation bitcoin mining protocol. Better security, performance, flexibility and censorship resistance, by allowing miners to select transactions.
  - name: og:image
    content: https://stratumprotocol.org/assets/stratum-v2-open-graph-preview.png

  # Twitter
  - name: twitter:card
    content: summary_large_image
  - name: twitter:url
    content: https://stratumprotocol.org/
  - name: twitter:title
    content: StratumV2
  - name: twitter:description
    content: The next generation bitcoin mining protocol. Better security, performance, flexibility and censorship resistance, by allowing miners to select transactions.
  - name: twitter:image
    content: https://stratumprotocol.org/assets/stratum-v2-open-graph-preview.png
---
