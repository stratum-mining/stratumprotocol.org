---
home: true
layout: HomeLayout
background: /assets/home-background.svg
heroImage: /assets/stratum-v2-logo-with-text.svg
tagline: The next gen bitcoin mining protocol.
actionText: "Choose your use case:"
links:
  - title: Milestones
    url: /milestones/
  - title: GitHub
    url: https://github.com/stratum-mining
    icon: /assets/github-icon.svg
footerLinks:
  - url: https://twitter.com/StratumV2
    icon: /assets/twitter.svg
  - url: https://discord.gg/TsuT3YJWKN
    icon: /assets/discord.svg
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
footer: © 2022 Powered by the glorious passion and dedication of the open-source bitcoin community.
---
