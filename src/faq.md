---
layout: DocumentationLayout
pageHeading: Frequently Asked Questions
---

## Efficiency

#### How does Stratum V2 improve network communication?

Stratum V2 separates the ‘prevhash’ message from the rest of the block template so that full blocks can be prepared and sent to miners ahead of time, eliminating the incentive to send empty blocks immediately after a new block has been found.

#### How does SV2 lower overhead costs for miners and pools?

SV2 saves miners money by reducing data usage and enabling simpler setups (e.g. header-only mining), while also decreasing hash rate variance. It saves pools money by reducing frequency and size of data transfers and reducing amount of work validation necessary for shares submitted by miners who do header-only mining.

#### How extensible is the SV2 protocol? Does it allow for upgrades and improvements?

Stratum V2 makes Bitcoin protocol upgrades easier through greater standardization and a simplified mining mode called header-only mining which eliminates the need for mining firmware and protocols to be updated in conjunction with full nodes.

The protocol supports vendor-specific extensions that don’t pollute the main mining protocol or complicate pool implementations.

## Decentralization

#### How does Stratum V2 improve Bitcoin’s decentralization?

This is immense for mining centralization. Instead of focusing on the centralization of pools, we can now focus on centralization of actual miners/farm owners. You can see how this can change hash rate distribution in the chart below from Matt Corallo’s presentation about consensus group centralization. As for performance, it’s complicated. With a properly-optimized client and reasonably good internet connection, it can be faster than receiving work from the pool. But pools have to put a lot of work into properly optimizing their setups to make this possible.

#### What are the incentives for a miner to negotiate their own transaction set with the pool?

Pools currently act as very large miners controlling a significant part of the total hash rate. This means that pools can try to prevent (i.e. censor) some transactions from getting into the blockchain or they can strongly influence the BIP activation process, as we saw with SegWit signalling in 2017. Miners who negotiate their own blocks can prevent this power centralization in pools, similarly to if they were solo mining. At the same time, miners can continue to benefit from decreased variance in payouts by mining with a pool.

#### Do pools have veto power on valid transactions?

In V2, pools can always actively reject a whole block proposed by a miner, but they can’t reject individual transactions within a block. I.e. pools do full block validation and reject any blocks that contain invalid transactions.

#### Why the separate protocol for work selection?

Matt Corallo's BetterHash implementation of work selection was not feasible to be implemented by pools. Stratum V2 solves this by making work selection a separate group of sub-protocols and allowing pools to reject invalid blocks proposed by miners.

Miners can select their own work (i.e. transaction set), meaning that mining will more closely resemble the pre-stratum era of solo mining while miners will still benefit from decreased variance through pools.

## Security

#### What are the main benefits of using encryption in V2?

Authentication is really important. Without it, an adversary can try a man-in-the-middle attack (MITM) to quite simply steal money by redirecting hashing power to another pool. Public key signature authentication isn’t ideal because it’s quite slow, so verifying a signature for every message would be very inefficient.

Modern authentication encryption schemes provide exactly what’s needed: an authenticated channel between two parties where one relatively expensive signature operation is used to create a shared secret, which can then be used by much faster symmetric key authentication schemes. Modern implementations are really fast, well researched, and unlikely to run into engineering surprises.

In V1, an attacker can steal and modify job assignments before they reach miners, then intercept the work when the miner tries to submit it — all without the pool or miner being able to know it’s happening! V2 prevents this kind of attack, called “hashrate hijacking.”

#### How much overhead does encryption add?

The pool-to-miner overhead is about 5%, rather insignificant. For miner-to-pool communication it adds 16 bytes (more than 50%), but it’s important to put in context. Even with encryption, share submission messages in V2 are more than 50% lighter than V1. Furthermore, the total amount of transfers is reduced such that ultimately we’re not actually talking about much additional data due to encryption.

#### How does SV2 prevent hashrate hijacking?

Stratum V2 uses authenticated encryption with associated data (AEAD), which provides confidentiality and ensures data integrity so that hashrate cannot be stolen from miners. BetterHash proposed to use pre-message signing, which also addressed MiTM attack vectors although not as thoroughly as AEAD.

## Stratum V2 Adoption

#### What are the incentives for various types of mining operations to upgrade to V2?

One of the biggest incentives for miners is the bandwidth efficiency improvements, which now makes it possible to operate even without really great internet connections. At the same time, this can improve submission rates which in turn reduces the variance in a miner’s hashrate (and thus their rewards in score-based reward systems such as PPLNS). Also on the efficiency front, the ability for pools to distribute future block templates to miners ahead of time (separately from the ‘SetNewPrevHash’ message) should eliminate empty block mining. Finally, the switch from JSON-based (i.e. human readable) code to a fully binary (i.e. machine readable) codebase significantly reduces the size of data transfers.

Another incentive that can’t be understated is cryptographic authentication. If you’re mining today, it’s entirely possible that your ISP is silently stealing 1% of your hashpower.

Encryption in V2 solves this.

#### Are there any firmware implementations of SV2?

An implementation of Stratum V2 is part of BOSminer, which is a free and open-source project developed by Braiins. This means that miners can download BOSminer and easily begin benefiting from V2 in their operations.

Stratum V2 can be implemented purely on the software side through use of the SV2 Proxy, allowing miners to benefit from V2's improved security and network efficiency even without any changes to their existing SV1 firmware.

## Brief History of the Stratum Mining Protocol

Miners need to interact with the Bitcoin protocol to submit their work and be rewarded. To standardize the communication between miners and Bitcoin protocol, an open-source “[getwork](https://en.bitcoin.it/wiki/Getwork)” protocol was developed. It acted as a quick and easy solution for standalone miners to start mining. But by 2012, getwork’s inefficiencies had grown very problematic as mining underwent radical changes and network hashrate grew exponentially.

Mining profitability decreased and rewards were being paid out on a less frequent basis as more miners joined the network. It became apparent that miners needed to combine their hashrate to remain profitable. This led to the introduction of mining pools: services which enabled miners to earn rewards on a more consistent basis by combining (i.e. “pooling” together) the hashrate from many individual miners.

The first ever mining pool was developed by Marek “Slush” Platinus in 2010 and was called Bitcoin.cz. It was later renamed to [Slush Pool](https://slushpool.com/home/?_ga=2.211851856.5530925.1604453318-1643383159.1592795906) and operations were handed over to Braiins, who continue running the pool to this day.

As data transfer requirements for pools grew exponentially, the limitations of the getwork protocol became even more apparent. This led Slush to develop the stratum protocol ([Stratum V1](https://braiins.com/stratum-v1)) for communication between miners and mining pools in 2012.

During the Stratum V1 development, other members of the mining community had spent months developing an open-source protocol called [“getblocktemplate“(BIP22)](https://en.bitcoin.it/wiki/BIP_0022) that would supersede the “getwork” protocol. With Stratum V1 being released near the same time, direct adoption for the getblocktemplate protocol suffered. However, Stratum V1 had shared a lot of the getblocktemplate mechanisms under the surface.

Over recent years, total network hashrate has grown exponentially and physical hashrate distribution has also improved. However, the fact that a majority of hashrate is ultimately concentrated in just a few mining pools leaves the network vulnerable to a (albeit very unlikely) 51% attack from a powerful state actor such as the US or China.

Taking control over mining pools within their jurisdictions would be essentially free for governments, whereas taking over physical mining operations or setting up their own physical mining operations would be complex and incredibly costly. Therefore, shutting off this attack vector is an important way to ensure Bitcoin’s long-term resilience to possible state attacks.

Today, miners depend on mining pools to assign them blocks to work on. If miners were empowered to construct their own block templates again — as all miners used to do in the early days of CPU mining — it would make a pool attack far more difficult to pull off.
