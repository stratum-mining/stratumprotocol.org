---
home: true
layout: HomeLayout
background: /assets/hero-bg.jpg
heroImage: /assets/stratum-v2-icon-with-text.svg
heroTitle: What is Stratum V2?
heroText: Stratum V2 is the next generation protocol for pooled mining. It focuses on making data transfers more efficient, reducing physical infrastructure requirements for mining operations, and increasing security. Additionally, Stratum V2 introduces three new sub-protocols that allow miners to select their own transaction sets through a negotiation process with pools, improving decentralization.
tagline: The next gen bitcoin mining protocol. Open source, community-ran, complete implementation of Stratum V2.
actionText: "Choose your use case:"
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
supportersTitle: Current Supporters of Stratum V2
supportersText: Companies and individuals who are supporting developers working on Stratum V2 community implementation.
supporters:
  - value: foundry
    image: /assets/foundry-logo.svg
    link: https://foundrydigital.com/
  - value: spiral
    image: /assets/spiral-logo.svg
    link: https://spiral.xyz/
  - value: sob
    image: /assets/summer-of-bitcoin.svg
    link: https://www.summerofbitcoin.org/
  - value: galaxy
    image: /assets/galaxy-logo.svg
    link: https://www.galaxy.com/
  - value: bitmex
    image: /assets/bitmex-logo.svg
    link: https://www.bitmex.com/
endorsementsTitle: Who feels SV2 is the right direction?
endorsementsText: List of companies and individuals who have indicated SV2 is the right direction for the industry.
endorsements:
  - value: braiins
    image: /assets/braiins-logo.svg
    link: https://braiins.com/
  - value: blockstream
    image: /assets/blockstream-logo.svg
    link: https://www.blockstream.com/
  - value: block
    image: /assets/block-logo.svg
    link: https://block.xyz/
whyTitle: Why Stratum V2?
why:
  - title: Security
    text: V2 introduces by-default encryption and authentication using the NOISE protocol, hardening the Stratum protocol against v1’s known man-in-the-middle attack vectors.
    image: /assets/padlock.svg
  - title: Performance
    text: V2 optimizes data transfer size and frequency between miners, proxies, & pool operators. Faster, more efficient communication means higher submission rates and reduced variance in hash rate (in turn, miner payouts).
    image: /assets/speedometer.svg
  - title: Flexibility
    text: V2 is an update to V1, not a separate protocol. It improves on the logic and framework of V1, allowing for incremental and modular improvements by miners and mining pools currently using stratum V1. Critically, v1 implementations can efficiently communicate with v2 implementations with minimal tradeoffs via either pool or client side proxy translations.
    image: /assets/blockchain.svg
  - title: Censorship Resistance
    text: V2 integrates distributed transaction selection into the protocol itself. End-miners can build and select their own transactions sets and block templates, further decentralizing the Bitcoin Network.
    image: /assets/speaker.svg
  - title: Standardization
    text: V1's failure to precisely define its specifications led to multiple semicompatible implementations with varying dialects. Stratum V2 precisely defines its protocol parameters to ensure cross-compatibility between and among pools and end-mining devices.
    image: /assets/compare.svg
footerTitle: Join us on
footerBottom: Made by the open-source Bitcoin community.
---
