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
introductionTitle: What is Stratum V2?
introductionText: Stratum V2 (SV2) is the next generation protocol for pooled mining. It makes data transfers more efficient, reduces miners' infrastructure requirements, and secures miners' network communications. Stratum V2's subprotocols allow miners to build their own block templates and mine their selected transactions to further decentralize the Bitcoin mining network.
introductionCtaTitle: Explore the Documentation
introductionCtaLink: implementation/
features:
  - title: Miners
    value: miners
    text: SV2's reference implementation mining proxy lets SV1 mining farms proxy to SV2 with 0 downtime, offering immediate improvements to miners' network security. Full integration of the SV2 implementation also improves data transfer efficiency and reduces the miner's infrastructure requirements.
    image: https://media.istockphoto.com/photos/man-mining-for-bitcoin-picture-id939519232?s=612x612
    imageOverlay: /assets/orange-particles.svg
  - title: Manufacturers
    value: manufacturers
    text: SV2 enables header-only mining for end-mining devices, completely eliminating the need for extranonce, Merkle path handling, and any coinbase modification on downstream machines. This simplified mode streamlines miners' computation and lightens server-side validation.
    image: https://media.istockphoto.com/photos/senior-worker-working-with-welding-tool-picture-id1266644220?s=612x612
    imageOverlay: /assets/blue-particles.svg
  - title: Pool Operators
    value: pool-operators
    text: SV2's reference implementation provides a set of FFI bindings for mining pools to integrate SV2 into their existing software stack. This allows pools to use SV2 without any additional configuration, in conjunction with the mining-proxy allowing mining pools' workers to operate on either Sv1 or Sv2 protocol implementations.
    image: https://media.istockphoto.com/vectors/summer-swimming-pool-background-illustration-with-inflatable-ring-vector-id1304928779?s=612x612
    imageOverlay: /assets/purple-planet.svg
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

footer: © 2022 Powered by the glorious passion and dedication of the open-source bitcoin community.
---
