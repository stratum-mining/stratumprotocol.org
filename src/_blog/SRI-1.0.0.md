---
title: "Introducing SRI 1.0.0 - the most important milestone in our Stratum V2 journey!"
description: "We are thrilled to announce the launch of SRI 1.0.0! This marks an important milestone in our mission to decentralize and enhance bitcoin mining and stands ready for immediate testing and integration."
date: "2024-04-21"
authors:
  - Pavlenex
tags:
  - StratumV2
  - SRI
  - Release

---

We are thrilled to announce the launch of SRI [1.0.0](https://github.com/stratum-mining/stratum/releases)! This marks an important milestone in our mission to decentralize and enhance bitcoin mining and stands ready for immediate testing and integration.

Start your SV2 journey with our [getting started guide](https://stratumprotocol.org/getting-started/).  

## 🛎️ Key highlights

[![SRI 1.0.0 Announcement](https://img.youtube.com/vi/cyduxNB5R7E/mqdefault.jpg)](https://www.youtube.com/watch?v=cyduxNB5R7E)

### 👷 Miners  
- Connect to a SV2 pool without upgrading existing SV1 firmware through Translation Proxy or
- Connect to an SV2 pool directly with an SV2 firmware device (BraiinsOS)
- Run you own bitcoin node, construct templates, and declare them to the SV2 Pool
- Utilize pool fallback functionality in case the pool decides to censor

### 🛠️ Pools
- Deploy and operate a very simple SV2 Pool 
- Integrate SV2 into an existing pool through our libraries

The new version is a result of improvements in the Stratum V2 [specification](https://github.com/stratum-mining/sv2-spec) through the working [group](https://www.cnbc.com/2022/10/11/bitcoin-mining-software-overhaul-stratum-v2-promoted-by-block-braiins.html) collaboration and rigorous testing with our interoperability suite to ensure compatibility between the two implementations of the Stratum V2 protocol. 

As we planned [eight months ago](https://stratumprotocol.org/blog/sri-roadmap-2023/), the release allows miners running SV1 or SV2 firmware to connect to an SV2 Pool (directly or through a translation proxy), optionally using a locally hosted Job Declaration Client and a patched version of a Bitcoin Core Node to **construct their own block templates** which are then sent to the Job Declarator Server run by the SV2 Pool. It’s important to mention that our code refactoring introduced the ability for the node and JDC to be run by an independent third-party, not just the miners.

![Config A](/assets/config-a.svg)

The newly implemented **pool fallback functionality** ensures that if a pool rejects a miner's template, the miner's Job Declarator Client automatically switches to an alternative pool. Miners can configure several fallback options and if all listed pools decide to censor, miners will end up solo mining. This serves as a powerful incentive for pools to act in the best interest of miners, as rejecting templates without a valid reason could lead to a significant loss of hash power to competitors. If all miners run standardized software, the entire hash rate of the pool could end up with a competing pool.

Aside from pools rejecting templates with transactions they wish to censor, there are several other scenarios where template rejection could trigger the pool fallback feature:

- A bug in the pool or downstream
- A connection interruption between the pool and downstream
- Downstream creates custom templates below the acceptable fee policy defined by the pool

**SRI’s pool** is simple and opinionated and currently can receive a template from the Template Provider, and create jobs for the downstream with the adequate difficulty. Anyone can easily deploy this simple pool today or use our libraries to integrate into their existing operations. Going forward, we plan to continue refactoring our code to allow for more diverse use-cases. Anyone interested in integrating SV2 into an existing pool, or starting a brand-new pool, [let us know](https://discord.gg/stEjAZ2y8r), we’d love to collaborate more closely. One example of a pool using SRI in production is [DMND](https://dmnd.work).

**Template Provider** enables the selection of transactions from the locally-run bitcoin node. Miners (soon, also independent third parties) can create custom block templates and declare custom mining jobs to the pool. Currently, to use the Template Provider you need to use our patched version of Bitcoin Core. Sjors Provoost opened a pull request in the Bitcoin Core repo [#29432](https://github.com/bitcoin/bitcoin/pull/29432) which can be tested and reviewed. We’re inviting code reviewers to take a look at smaller PR’s that build [#2943](https://github.com/bitcoin/bitcoin/pull/29432). 

## 🙏 Thank you!

SRI 1.0.0 wouldn’t be possible without our contributors, supporters, working group, testers, and community.  Since our last update, our contributor base has grown even further!  What once started as a one-man project, is now a community of contributors building backbone infrastructure for the entire mining industry.

A huge shout-out to: fi3, gitgab19, pavlenex, plebhash, priceless-p, satsie, sjors, ccdle12, darricksee, jakubtrnka, lobarrel, lorbax, rrybarczyk, vincenzopalazzo, 4ss0, 0xSaksham and many more!

Thanks to [HRF](http://hrf.org), [OpenSats](https://opensats.org), and [Spiral](http://spiral.xyz) for supporting contributors through grants and donations, ensuring the project's sustainability.
Special thanks to [Santacroce](https://santacroce.xyz/), [Hut8](http://hut8.io), and Oblast63 for providing the equipment for community testing, and to the working group members, including [Braiins](https://braiins.com) and others, for their role in refining the specifications.

## 🎁 Support us

- Individuals can support the development and maintenance of the SRI by [donating through OpenSats](https://opensats.org/projects/stratumv2), a 501(c)(3) public charity dedicated to supporting open-source Bitcoin projects.
- Corporate entities interested in providing grants to SRI contributors, please get in touch with us directly. Your support can make a significant difference in accelerating development, research, and innovation. Please [get in touch](mailto:stratumv2@gmail.com)
- Contribute - We’re inviting developers interested in contributing to SRI to look into our codebase, study the specs and join our regular weekly developer meetings on Discord to get up to speed and get proper onboarding.

## 🏁 Dive in

After months of testing, including over [600 blocks](https://mempool.space/testnet/address/tb1qa0sm0hxzj0x25rh8gw5xlzwlsfvvyz8u96w3p8) mined on testnet, we are confident to invite you to [experience SRI 1.0.0](https://stratumprotocol.org/getting-started/) firsthand. 

Your feedback, issue reports, and feature suggestions are invaluable to us, directly shaping the future of SRI. For the most straightforward experience, consider running the full stack locally or connecting to our community-supported infrastructure.  

To ensure SRI 1.0.0 works seamlessly across various setups, we encourage you to [share your testing experience](https://forms.gle/QAX3hriMzKAMELFB6). 

Please [report](https://github.com/stratum-mining/stratum/issues) any inconveniences or bugs, and feel free to ask for assistance through [Discord](https://discord.gg/stEjAZ2y8r). Your active participation is crucial in refining and enhancing our software for everyone.

**Start your SV2 journey [here](https://stratumprotocol.org/getting-started/).**