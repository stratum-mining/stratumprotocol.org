---
title: " Stratum v2 (SRI) Roadmap - To infinity and beyond "
description: "Today, we’re sharing the  (Stratum Reference Implementation) roadmap providing insights into our ongoing work and the project's direction. Additionally, we are publishing the latest progress on Stratum v2 protocol specifications, further emphasizing our commitment to openness and building in public."
date: "2023-08-3"
authors:
  - Pavlenex
tags:
  - StratumV2
  - Sri
  - Roadmap

---

Today, we’re sharing the  (Stratum Reference Implementation) **roadmap** providing insights into our ongoing work and the project's direction. Additionally, we are publishing the latest progress on Stratum v2 protocol **specifications**, further emphasizing our commitment to openness and building in public.

We believe fostering collaboration and transparency in the development process accelerates community involvement and brings us one step closer to our mission - better, more robust, and more decentralized bitcoin mining.

At its core, SRI is a community-driven, open-source project. Our roadmap reflects the consensus reached within the community, constantly evolving with the collective input of every one of us. 

We welcome you to join us in our mission, start contributing, testing and help us shape the future of  bitcoin mining.

## 📖 Stratum v2 specification

The specification is the heart of any protocol. The Stratum v2 specification, meticulously maintained by an independent open-source working group [formed](https://www.cnbc.com/2022/10/11/bitcoin-mining-software-overhaul-stratum-v2-promoted-by-block-braiins.html) in October 2022, is pivotal in defining the functionality. Since its inception, the specs have undergone several updates to enhance security, performance, flexibility, and simplicity.

The main goal is to **stabilize** the specification, **formalize** the proposal procedures, and make them **accessible** to anyone interested in improving the Stratum v2. 

The table below summarizes the changelog of notable specs updates.

|Notable update|Link to a pull request|
|:----|:----|
|Noise handshake improvement|#2|
|Using Bitcoin core cryptographic primitives|#10|
|Replace future_job with min_ntime|#12|
|Message framework improvement|#40|
|Rename Job Negotiator to Job Declarator|#43|

### Noise handshake improvement

One of our first updates is improving the noise handshake. The Stratum v2 protocol updates refine the authenticated key agreement through a three-step process, **enhancing security and communication efficiency**. This includes, an exchange of keys, followed by an Elliptic Curve Diffie-Hellman (ECDH) operation, encryption algorithm negotiation and server authentication through a signature noise message.

### Using Bitcoin Core cryptographic primitives

The PR #10 implemented Bitcoin Core's cryptographic primitives, shifting from curve25519 to secp256k1 and from Blake2s to SHA256 for hashing. It introduces Schnorr/secp256k1 for server authentication, necessitating updates to CA-authority public keys and supports handshake with two different AEAD algorithms. The update **simplifies handshake messages** by eliminating unnecessary length prefixes and thoroughly describes each handshake step, moving the noise-secure layer description into a separate file.

### Replace future_job with min_ntime

Previously, 'future_job' indicated whether a job related to a future or the last sent 'SetNewPrevHash' message on the channel. Now, 'min_ntime' serves this function, remaining empty for future jobs and filled with 'min_ntime' for immediate jobs linked to the last sent 'SetNewPrevHash'. This change offers a more **granular control over job allocation** and initiation in the mining protocol.

### Message framing improvement

This update enhances the message framework by incorporating the security layer into the stratum framing itself, thus eliminating the need for redundant frame-length information and improving protocol efficiency. In the previous framework, individual frame lengths were revealed in the TCP traffic, creating potential vulnerabilities.

The new framework encrypts the Stratum v2 payload in byte chunks of maximum 65519 bytes and v2 header in 22 bytes forming  AEAD ciphertexts, effectively concealing and protecting the frame length field and facilitating implementation of large-message encoding. This change **streamlines the parsing process**, making the TCP-transcript fully uniform and random looking.

### Renaming Job Negotiator to Job Declarator

In response to community feedback regarding a protocol formerly known as **"Job Negotiator"**, we are announcing a naming update to clarify its purpose and functionality.

This protocol is one of the most critical features of Stratum v2. In combination with a template provider, it allows miners or an independent third party to select transactions, decentralizing bitcoin pool infrastructure.

Over time, we've observed confusion surrounding the term "negotiation," as it may imply a back-and-forth process between miners and pools to determine block content. We want to stress that this is not the case. Instead, the miner declares transactions to the pool, which can then choose to accept or decline them. There is no ongoing communication concerning block content between parties.

In cases where a pool accepts the declared transactions, they are subsequently propagated to the bitcoin network. Conversely, if a pool declines the transactions (censors), the miner will automatically seek an alternative pool. If the secondary pool also declines to include the transactions, the miner will continue to fall back, eventually resorting to solo mining.

Provided that all miners run standardized software this could mean that the **entire hashrate** of pools that is censoring would end up with their competitors, or eventually solo mine.

With this in mind, we’re **renaming the Job Netogiation to Job Declaration protocol**.

## 👷‍♂️ Stratum v2 implementations

Thus far, there have been two adoption paths for the Stratum v2 protocol:

- Stratum v2 implementation by Braiins
- SRI (Stratum v2 Reference implementation)

Both implementers, Braiins, and SRI, are part of the SV2 working group and share the goal of fostering a collaborative environment to support and encourage the broader adoption of Stratum v2. The remaining of the article will focus on the reference implementation, SRI, exploring its current status and future direction.

### 🛣️ Stratum Reference Implementation Roadmap

In October 2022, we launched our SRI’s [first update](https://twitter.com/StratumV2/status/1579805619351326722?s=20), which allowed miners to run Stratum v1 firmware and connect to an SV2 compatible pool. Few months afterwards, [a new update](https://twitter.com/StratumV2/status/1646542195233640454?s=20) allowed miners to select transactions, democratizing block selection. 

Currently we’re working on our **third major update**, below is an overview on what to expect in the future. 

![SRI Roadmap](/assets/SRI-roadmap-2023.png)

The third update represents our **“Now”** column on our roadmap, and aims to be completed in the next few months. It builds  on all previous updates with more features, enhanced security performance and better flexibility. Most importantly the new update, should set the milestone for easier Stratum v2 integrations into existing pools. Miners and mining pools are encouraged to test out our [previous update](https://stratumprotocol.org/blog/stratumv2-jn-announcement/) and provide feedback in the meanwhile.

**Our always evolving roadmap is available on [Miro](https://miro.com/app/board/uXjVM8FOwSE=/?share_link_id=902364718672), and also on [GitHub](https://github.com/orgs/stratum-mining/projects/5) for anyone to review and provide feedback. If you’re interested in joining our contributors team, hop on to [Discord](https://discord.gg/fsEW23wFYs).**

### Message Generator - interoperability suite 

As the Stratum v2 protocol gains popularity, we anticipate the emergence of various adoption paths. However, it is imperative that these implementations adhere closely to the specified standards. Deviation from the protocol specifications could yield catastrophic consequences, potentially resulting in significant profit loss.

Because of this, we developed an interoperability  suite called **Message Generator** (or MG), which is essential in ensuring that all implementations are following the specs, and are able to test against each other. The tool allows anyone developing Stratum v2 based software to run a series of predefined tests in different configurations to ensure compatibility.

MG is stateful, meaning it can save a value of an Sv2 message received by the tested software to be sent later in another message. The logic of the stateful MG makes it easier to implement arbitrary actions on MG, allowing the MG to send Sv2 messages where the fields' values are randomly chosen by the software, rather than the user. This represents a form of property-based testing. Currently, the implementation of arbitrary for MG is still a work in progress.

The following are the next steps for MG:
- Implement arbitrary functionality
- Write additional MG tests
- Extend MG support to Sv1 messages

### 👩‍💻SRI Stack 

Thus far, SRI’s architecture bundled some of the roles together. We’ve realized that having not overly specialized roles would ensure less bug-prone codebase, and also allow us to easier debug issues.

We’re now working on refactoring those roles, that would allow us to have:
- **SV2 pool** that doesn’t have built in job-declaration
- **SV2 mining-proxy** that does downstream aggregation/load balancing.
- **Translator-proxy** that does Sv1 to Sv2 translation
- **Job-declarator-client** that does job declaration
- **Job-declarator-server** that accepts or declines jobs and does block propagation

#### Stratum v2 Pool

The ability for **existing pools** to easily **integrate SV2** is our highest priority. This requires that we develop an HTTP API. Certain mining pools aim to monitor their clients' mining devices in order to display a malfunctioning device, or generally showcase additional data on their web app. This can be easily achieved by tracking the shares submitted by each device. We’re working on adding this in the form of an extension to the SRI, as a **monitoring-extension**.

**Pool fallback**, described in the Job Declaration section above, would allow miners to easily fall-back to an alternative pool or solo mine if alternative pool(s) decline declared transactions is critical in ensuring decentralization of the protocol. 

Adding **pool’s signature** after extranonce, generating a **coinbase** with any, not just p2pkh script as pool's output are also on our roadmap.

**Anyone** being able to **run and deploy a pool** is high on our priority list and would help with decentralization of power even more. That’s why our next focus will be to ensure our open-source stack can achieve that. We plan to develop a highly-customizable web UI for the pool.

**Separating** the job-declarator from the pool into a job-declarator server allowing greater flexibility when deploying a Job declarator.

#### Job Declarator

We’ve mentioned Job Declarator, as one of the most important aspects of SRI through this blog post. For greater flexibility, we’re refactoring the code and are working towards a **standalone Job Declarator** which would consist of JD-Server (Pool) and JD-Client (miner). Here’s what’s on our roadmap:

- Refactoring the code that has already been started to separate various components (mining, pool, and Job Declarator)
- Implementation of a Job Declarator Server in the pool
- Implementation of cryptographic signature by the JD server in the token that identifies the custom job
- Completion of the remaining messages so that the pool can propagate the block, enabling two parallel block propagations. The found block could be propagated by both miner’s and pool's bitcoin node.

#### Template provider

The template-provider generates block templates and passes them to the pool or the job-declarator using the Template Distribution protocol. Template provider is most commonly a bitcoin core full node, but can be any other node implementation.

We’ve [submitted a PR](https://github.com/bitcoin/bitcoin/pull/27854) to add template provider to bitcoin core. The goal of opening a PR in this stage was to get concept acknowledgment from core developers and community. Thus far we’re received valuable feedback and are working towards implementing suggested changes. Unlike the [previous PR](https://github.com/bitcoin/bitcoin/pull/23049) which used rust-library, the new PR implements server and message serialization and deserialization in C++. 

Next, we’ll be adding **noise handshake encryption**, and **framing** improvement as per recent specs changes. Same changes need to be added to the SRI codebase. 

We would like to thank everyone who has reviewed the PR thus far, and would like to invite more developers to take a look at it and provide feedback. 

After those updates are added, we will be **converting PR from draft to ready to review**. Hopefully after enough reviews and community consensus, the PR gets merged into the bitcoin core codebase. Meanwhile, miners wanting to help test and use the sv2 template provider can use our patched version.

#### Proxies

All miners use proxies to aggregate connections and save on bandwidth. In SRI we have two types of proxies:

- Translation Proxy
- SV2 Proxy

**Translation proxy** is something we worked on and deployed in October 2022. It allows miners running sv1 firmware to connect to an SV2 pool, by converting messages from SV1 to SV2 and vice versa. This means that miners don’t have to update firmware to use Stratum v2. Translation proxy has been tested and stabilized.

One of our goals in the future is to develop a **pure SV2 proxy**, that would aggregate connections from mining devices running SV2 firmware. Further improving mining-proxy means that we would be adding **web-ui** for easier management of devices by the miners at some point in the future.

#### Benchmarking

It’s not an unknown fact that miners by nature are very rational actors in the ecosystem. With that in mind, their actions are usually profit-driven. To ensure Stratum v2 adoption, we’ve started developing a testing & benchmarking suite which would allow industry to easily compare Stratum v2 performance against Stratum v1 in different mining scenarios. Such tool should provide data that will help miners evaluate profitability and performance and make an informed decision. We will be documenting benchmarking results in the form of a report/case-study and sharing it with the industry.

The benchmarking suite will include:
- Dockerized roles for both Stratum v1 and Stratum v2;
- Possibility to benchmark protocols in regtest, testnet and possibly mainnet; 
- Possibility to easily benchmark different configurations permitted by SRI stack;
- Web UI to easily interact with the benchmarking suite;
- Dockerized metrics collector and visualizer such as Prometheus, Criterion, Grafana, etc.

#### Firmware

In the future, as our contributors base grows, we’re hoping to kick-start the [firmware-bindings](https://docs.google.com/document/d/1iW48-Y4Xvr2IN7PU_9xYw-i5wReCQ98SyliI55_LSos/edit) as part of our efforts to support downstream firmware applications.

#### Contributors

As you may have noticed, Stratum v2 and SRI will aim to have a lot of new features, improvements and big plans. We could never develop software without our community who has been actively helping us by testing the software and providing feedback. Thank you for your efforts.

We’re a small team of contributors with big dreams, to make that happen, **we need more people to join us in our mission** of decentralizing and improving bitcoin mining and we’re welcoming anyone interested in contributing to join us on [Discord](https://discord.gg/fsEW23wFYs).
