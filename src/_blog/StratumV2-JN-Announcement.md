---
title: " Miners can now select transacitons"
description: "A new update of Stratum v2 is available.The new update allows miners to select transactions via a new sub-protocol and their node. We’re inviting miners, pools, firmware makers, and the community to check out our getting started guide and pilot test the software!"
date: "2023-04-14"
authors:
  - Pavlenex
tags:
  - StratumV2
  - JobNegotiator

---

*We dig dig dig dig dig dig dig in our mine 
The whole day through
To dig dig dig dig dig dig dig is what we really like to do
It ain't no trick to get rich quick
If you dig dig dig with a shovel or a pick
In a mine! In a mine! In a mine! In a mine!
Where a million sats shine!*

*Heigh-ho, Heigh-ho
Heigh-ho, Heigh-ho*

---

After months of coding in our dusty mines, we’re ready to ship a new Stratum v2 reference implementation (SRI) update! 

The new update allows miners to select transactions via a new sub-protocol and their node. This is a major milestone in democratizing transaction selections in pooled mining and decentralizing bitcoin!

**We’re inviting miners, pools, firmware makers, and the community to check out our [getting started guide](https://stratumprotocol.org/getting-started/#config-d-sv1-firmware--translation-proxy-jn-job-negotiator--sv2-pool) and pilot test the software locally, with CPU or actual mining devices. Your feedback will have a high impact on the development direction.**

**Please submit your feedback after testing [via this form](https://docs.google.com/forms/d/1is27h37PtsXtXC9zSbweNfxcyEtHzATjdJphIy8hArw/).**


SRI’s flexible stack offers various components when setting up a configuration that suits your needs. As an early adopter, we recommend testing the SV1 mining device ( Antminer S9, S19+, or Whatsminer), connecting to an SV2 pool via Translation Proxy. Miners will run their own template provider (bitcoind) with the max fee policy. Within the translation proxy sits a Job Negotiator that runs a sub-protocol responsible for distributing miner’s templates to the pool. 

![Config D](/assets/config-d.svg)

While there are various configurations to explore, testing the configuration, which includes Translation Proxy and Job Negotiator will provide valuable feedback to the development team.

## What is a Job Negotiator?

With the current mining protocol - Stratum v1, the pools use their template providers to dispatch work to the miners. As a result, mining pools are the central point of failure and potential weak spot when it comes to censoring certain transactions by excluding them from the template.

A Job Negotiator, in combination with a template provider, gives the responsibility back to miners or an independent third party to provide a new template (select transactions), thereby making bitcoin pool infrastructure more decentralized.

### How does Job Negotiation work?

Below is a high-level overview of how a **Job Negotiator (JN)** works. 

We call it the JN dance.  💃 Let’s dance!

*  Downstream (Mining farm, miners) runs a JN. On startup, downstream’s JN connects to a JN run by the Pool
*  Downstream’s JN sends the AllocateMiningJobToken message to Pool’s JN requesting to get a unique identifier for mining jobs
*  Pool JN sends back a unique token that helps identify miner's job via the AllocateMiningJobToken.Sucess message
*  Downstream’s JN then connects to a Template Provider. Template Provider is usually run locally by the downstream or by an independent third-party
*  In SV2, miners run their own nodes. The template provider is bitcoind node in our case.  Upon established connection, the Template Provider sends New Template and SetNewPrevHash to downstream’s JN. New template contains the merkle path of the transactions that were selected by the bitcoind. SetNewPrevHash is the last valid block header in the blockchain
*  With SetNewPrevHash, a new template, and the token. a new job can be constructed, so downstream’s JN sends a CommitMiningJob message containing a proposed set of transactions (template data) to Pool’s JN.
*  The next step is critical in understanding how we implemented JN in the reference implementation. It differs from the specs. In the current iteration, the pool always answers with a CommitMiningJob.Success message accepting the miner's proposal. The pool must accept what’s been suggested by the miner(s). The pool must accept what the miner(s) suggest. Currently, the pool cannot decline what miners are proposing and needs to be made aware of the blocks being mined. 
*  In CommitMiningJobSucess, the pool sends coinbase output used for payouts. Miners must build jobs that have a coinbase with that output. 
In our next release, we’re adding the ability for miners to fall back to a different pool or solo mine if the pool fails to accept transactions selected by downstream’s Template Provider. We will also add sanity checks so pools can verify the validity of blocks.
* Next, the Translation proxy sends a SetCustomMiningJob message to the Pool. The pool sends the job_id that the proxy needs to add to the share and sends it back to the pool to prove that work has been done. Upon verifying the pool replies with SetCustomMiningJobSucess.
* Translation Proxy then translates the SV2 message and sends the mining.notify (sv1 message) to mining devices.
*  Mining devices would then start mining and send mining.submit to the Pool through the Translation Proxy, submitting the shares to the pool.

This is our engineer's way of dancing, a bunch of bullet points. Below is an actual dance with some music. Volume up.

[![ How Job Negotiator works](https://img.youtube.com/vi/nOIAhRVCThs/mqdefault.jpg)](https://www.youtube.com/watch?v=nOIAhRVCThs "How JN works video Video")

## How to get started?

To get started, follow the instructions on [this page](https://stratumprotocol.org/getting-started/#config-d-sv1-firmware--translation-proxy-jn-job-negotiator--sv2-pool). You can set up everything locally, use a CPU or an ASIC miner, connect to ours, or deploy a pool on your own.

So far, our community has tested on the following devices/firmware. If you’ve tested the SRI stack on a different device or a firmware version, please [fill this form out](https://docs.google.com/forms/d/1is27h37PtsXtXC9zSbweNfxcyEtHzATjdJphIy8hArw/), and we will update the table.

| Device            | Firmware | Firmware version |
| ----------------- | -------- | ---------------- |
| Antminer s9       | OEM      | XXX           |
| Antminer S19j Pro | OEM      | XXX           |


## What’s next?

With the next update, we will add a fallback functionality that would allow miners to fall back to a different pool or solo mine in case the pool chooses not to accept their suggestion. Miners would, in that case, disconnect and fall back. 

In addition, we will add ways for pools to spot-check the validity of blocks and a few other improvements, like enhancing the encryption and ensuring we're following the latest changes in the spec. Most importantly, we hope to open a pull request for template provider in Bitcoin Core.

We'd like to thank Stratum v2 supporters, implementers, and all contributors, without whom SRI wouldn't be possible. Please donate to our [crowdfunding page](https://opensats.org/projects/stratumv2) hosted by OpenSats Foundation and Swan to support our development efforts. 

![Supporters](/assets/stratum-v2-supporters.png)

If you’re a company willing to directly support the work of developers by providing a direct grant and being featured on our website, please [get in touch](mailto:stratumv2@gmail.com).We will connect you with our contributors in need of funding.

[Join our Discord](https://discord.gg/UHckbC7x58) to engage with the Stratum v2 community.

We’re excited to [hear your feedback](https://docs.google.com/forms/d/1is27h37PtsXtXC9zSbweNfxcyEtHzATjdJphIy8hArw/prefill).

Heigh-ho, Heigh-ho!

