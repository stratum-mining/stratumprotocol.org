---
home: true
layout: HomeLayout
background: /assets/hero-background.jpg
heroImage: /assets/stratum-v2-icon-with-text.svg
heroText: An open-source and community-managed reference implementation of the Stratum V2 protocol. Stratum V2 increases security, makes data transfers more efficient, and reduces mining infrastructure requirements. It also introduces three new sub-protocols that let miners select transaction sets and improve decentralization by negotiating with pools.
tagline: One giant leap for bitcoin mining
documentationCtaText: Explore GitHub
documentationCtaLink: https://github.com/stratum-mining/stratum
diagramText: Before Stratum V2, transaction sets were selected by pools. With a complete SV2 configuration they’re selected by individual miners, making the network more censorship-resistant.
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
roadmapTitle: Progress and Roadmap
roadmapTagline: This is where the Stratum V2 protocol’s progress currently stands.
roadmapSteps:
  - __MVP1__ will allow users to run SV2 in its simplest form - a miner running existing SV1 firmware with a proxy that translates messages into SV2. In this configuration, the pool selects transactions.
  - A pull request that implements a **block template provider** will be submitted to the Bitcoin Core repository for review which will make MVP1 complete.
  - Implement the **job negotiator**, which a miner or miners can use to negotiate a block template with a pool.
  - Once a translator, template provider, and job negotiator are running, we will launch an MVP2. In this configuration, a miner handles mempool transaction selection, and the pool accepts it.
  - Apply early adopter feedback and tailor configurations that will move MVP1 and MVP2 from beta to production-ready.
supportersTitle: Current Supporters of Stratum V2
supportersText: Companies who financially support developers working on Stratum V2.
supporters:
  - value: bitmex
    image: /assets/bitmex-logo.svg
    link: https://bitmex.com/
  - value: foundry
    image: /assets/foundry-logo.svg
    link: https://foundrydigital.com/
  - value: galaxy
    image: /assets/galaxy-logo.svg
    link: https://www.galaxy.com/
  - value: spiral
    image: /assets/spiral-logo.svg
    link: https://www.spiral.xyz/
  - value: sob
    image: /assets/summer-of-bitcoin.svg
    link: https://www.summerofbitcoin.org/
supportDevelopersText: Support Developers
supportDevelopersLink: "mailto:test@stratumprotocol.org"
endorsementsTitle: Who feels SV2 is the right direction?
endorsementsText: Companies who believe that SV2 is right direction.
endorsements:
  - value: block
    image: /assets/block-logo.svg
    link: https://block.xyz/
  - value: blockstream
    image: /assets/blockstream-logo.svg
    link: https://www.blockstream.com/
  - value: braiins
    image: /assets/braiins-logo.svg
    link: https://braiins.com/
showSupportText: Show support for SV2
showSupportLink: "mailto:test@stratumprotocol.org"
whyTitle: Layers of Upgrades
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
readDocumentationText: Read Documentation
readDocumentationLink: /implementation
footerTitle: Join us on
footerBottom: Made by the open-source bitcoin community. <a href="https://www.freepik.com/free-vector/space-illustration-night-alien-fantasy-landscape_5603523.htm" rel="nofollow noindex">Image by vectorpouch</a> on Freepik.
meta:
  # We can reuse & customize those tags on other pages of the website
  # Primary Meta Tags
  - name: title
    content: StratumV2
  - name: description
    content: The next gen bitcoin mining protocol. Open source, community-ran, complete implementation of Stratum V2.

  # Open Graph / Facebook
  - name: og:type
    content: website
  - name: og:url
    content: https://stratumprotocol.org/
  - name: og:title
    content: StratumV2
  - name: og:description
    content: The next gen bitcoin mining protocol. Open source, community-ran, complete implementation of Stratum V2.
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
    content: The next gen bitcoin mining protocol. Open source, community-ran, complete implementation of Stratum V2.
  - name: twitter:image
    content: /assets/landing-social-media-share-image.png
---
