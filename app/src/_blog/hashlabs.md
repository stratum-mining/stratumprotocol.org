---
title: "How Stratum V2 Increases Mining Profitability"
description: "We are thrilled to announce the launch of SRI 1.0.0! This marks an important milestone in our mission to decentralize and enhance bitcoin mining and stands ready for immediate testing and integration."
date: "2025-06-12"
permalink: /blog/case-study/hashlabs/
authors:
  - Pavlenex
tags:
  - Case-study
  - Research
---
**This case study compares two Bitcoin mining protocols, Stratum V1 and V2 , and demonstrates how the combined technical improvements of Stratum V2 translate into a substantial profitability increase for miners.**

![](/assets/case-study/hashlabs/featured.jpeg)

In bitcoin mining, a millisecond can determine whether a miner successfully earns the block reward or loses out to a competitor. At the core of this race lies the **mining protocol** that connects miners, pools, and the network, with the goal of ensuring effective communication between participants.

For over a decade, **Stratum V1 (SV1)** has served as the industry standard mining protocol, but as mining competition has intensified over the years, the need for technical improvements on the protocol-side has become apparent. While we have seen massive technical improvements on the mining hardware side over the past decade, miners have been stuck with a less than optimal protocol.

This is why we have developed **Stratum V2 (SV2)**, the successor to SV1. This protocol is associated with **miner-side block construction**, allowing miners to run their own nodes and create their own block templates. While this remains a critical innovation, SV2 also introduces substantial improvements in **security and efficiency** impacting profitability.

## **Objectives & Methodology**

The primary objective of the case study is to evaluate if SV2 improves mining efficiency and profitability compared to SV1. This is achieved by measuring the following **key performance indicators** and evaluating their impact on net profitability:

* Share Submission  
* Latency: 
  * Block Change  
  * Job Latency  
  * Block Propagation  
* Hashrate Hijacking

This study was conducted at [Hashlabs](https://www.hashlabs.io) using two identical S19k Pro ASIC miners, one running SV1 and the other SV2. Tests were performed in a controlled environment with simulated network latency, containerized infrastructure, and an early-stage open-source [benchmarking tool](https://github.com/stratum-mining/benchmarking-tool). For a detailed breakdown of the testing process, refer to Appendix A: Benchmarking Setup and Methodology.

### **Share Acceptance Rate**

**Share Acceptance** **Rate** refers to the percentage of valid work a miner submits to the pool in the form of shares. Shares can be either valid or stale. 

* **Valid shares** are based on the current chain tip and result in a payout.   
* **Stale shares** are submitted too late, often due to network latency or inefficient communication, and are rejected. This represents wasted hashing power.

However, not all stale shares are caused by inefficiencies. On average, about 2% of stale shares are rejected for expected reasons, such as not meeting the pool’s minimum difficulty. This 2% rejection rate is considered an industry standard. The remaining 98% are preventable and caused by avoidable delays. Reducing these avoidable stale shares improves mining efficiency and increases profitability.

![](/assets/case-study/hashlabs/share-acceptance.png)

Our benchmark data shows that miners using **Stratum V1** waste between **0.1% and 0.2%** of their hashing power submitting shares that do not result in payouts. Switching to **Stratum V2 without Job Declaration** reduces this inefficiency to around 0.08%, while using **Stratum V2 with Job Declaration** eliminates it nearly entirely, assuming miner and pool node have the same level of connectivity.

For miners operating on thin profit margins of around **10%**, this translates to a potential **net profit increase of up to 2% when fully adopting Stratum V2 with Job Declaration**.

By connecting directly to a local **Job Declaration Client ([JDC](https://stratumprotocol.org/specification/06-Job-Declaration-Protocol/#62-job-declarator-client))**, which is connected to the **Bitcoin node running on-site by the miner**, SV2 ensures miners continuously receive the most up-to-date jobs. This setup minimizes latency and maximizes the freshness of jobs.

Our tests used only a single SV1 connected to the tProxy. We anticipate that Stratum V2's advantage would increase further with multiple downstream connections. In fact, a separate test conducted using CPU miners demonstrated an additional **0.4% improvement** in favor of Stratum V2, as shown in the chart below.

![](/assets/case-study/hashlabs/share-acceptance-2.png)

### **Latency**

Our benchmarks demonstrate **substantial latency improvements** using Stratum V2 compared to Stratum V1. These improvements are again attributed to the Job Declaration Client (JDC). The JDC, connected to the Bitcoin node positioned within the mining farm’s local network, drastically reduces latency by delivering fresh mining jobs directly to ASICs. In comparison, Stratum V1 relies on remote pools to distribute jobs, introducing higher latency due to network distance and potential congestion.

To further contextualize these results, we measured the network latency to various production pool endpoints during the benchmark sessions. The average round-trip time (RTT) observed across four reports was approximately 110ms. This value was used internally within the tool infrastructure to simulate realistic network conditions during the benchmarks.

![](/assets/case-study/hashlabs/latency-all.png)

#### **Block Change latency**

**Block Change Latency** is a delay experienced when **switching to a new job after a block is found on the network**. During this brief period, miners continue working on outdated job templates that will not be rewarded, resulting in entirely wasted hash power. Reducing this latency directly improves profitability.

![](/assets/case-study/hashlabs/block-change-latency.png)

According to our benchmarking data, **Stratum V2 with Job Declaration (JD)** reduces block change latency from **325 ms (SV1)** to just **1.42 ms**, a difference of **323.58 ms**, making it over **228 times faster**. Even without JD, **SV2 still improves latency**, reducing it to **57.8 ms**, about **5.6 times faster** than SV1.

SV1 miners lose approximately **323.58 milliseconds per block** due to block change latency compared to SV2 with JD. Over a year, this adds up to around **4.9 hours** of completely wasted hashing time. To quantify the efficiency gain of switching to SV2 with JD, we compare this latency difference to the total block interval of **600,000 milliseconds** (10 minutes):

![](/assets/case-study/hashlabs/efficiency-gain.png)

For miners operating on a **10% profit margin**, this translates to a **net profit increase of approximately 0.54%** by switching from SV1 to **SV2 with Job Declaration**. Since block change latency directly causes shares to become stale and rejected, its impact is already captured in our share acceptance rate.

#### **Job Latency**

**Job Latency** refers to the time it takes for miners to receive new jobs from the Pool (or from the JDC, in the case of SV2), which typically occurs every 30 seconds, but may also occur more frequently. While this latency does not result in wasted hash power, it introduces an **opportunity cost**. 

During the delay, miners may continue working on valid job templates that do not include the most recent transactions, potentially reducing the fee revenue earned per block.

![](/assets/case-study/hashlabs/job-latency.png)

According to our benchmarking data, **Stratum V2 with Job Declaration (JD)** reduces job latency from **228 ms (SV1)** to just **2.44 ms**, a difference of **225.54 ms**, making it over **93 times faster**. Even without JD, **SV2 still improves latency**, reducing it to **57.8 ms**, about **4 times faster** than SV1.

To quantify this, a time-based fee growth model was applied to a dataset of 53,154 Bitcoin blocks spanning approximately one year. The assumption is that transaction fees accumulate linearly across the 600-second block interval, and that job templates are refreshed 20 times per block (every 30 seconds). Given the latency difference between SV1 (0.228 seconds) and SV2 with JD (0.00244 seconds), and a fee growth rate of **0.00031443 BTC per second**, the cumulative fee loss per block is modeled as:

![](/assets/case-study/hashlabs/block-loss.png)

The average transaction fee per block, based on a total of 10,027.81 BTC in fees across the dataset of 53,154 blocks, is **0.18866 BTC**. The opportunity cost per block for SV1 miners is:

![](/assets/case-study/hashlabs/oportunity-cost.png)

**This means SV1 miners lose approximately 0.75% of potential transaction fee revenue on every block** simply due to job latency. Over thousands of blocks, this adds up to a significant long-term loss.

While this 0.75% figure reflects the percentage of fee revenue lost per block, it does not represent a gain relative to the entire block reward. When accounting for both the transaction fees (0.18866 BTC) and the block subsidy (3.125 BTC), the total block reward is approximately 3.31366 BTC. The 0.00141 BTC gain from reduced job latency therefore corresponds to a 0.04% increase in total block revenue. For miners operating on a 10% profit margin, this translates into a **0.4% net profit boost**. 

Even when comparing SV2 without JD to SV2 with JD, the latency difference of 55.3 milliseconds results in a cumulative block loss of **0.000347 BTC**, translating into an opportunity cost of approximately **0.18%** per block. 

In both cases, reducing job latency increases profitability by ensuring miners are working on the most up-to-date block templates with the highest fee density.

![](/assets/case-study/hashlabs/job-latency-table.png)

**Miners using SV2 with Job Declaration gain a competitive timing advantage** worth approximately 0.00141 BTC per block by capturing transaction fees before competing miners using less efficient protocols. This represents up to **74 BTC per year** (52,560 blocks × 0.00141 BTC) that early SV2 adopters can claim ahead of their competition.

![](/assets/case-study/hashlabs/job-latency-2.png)

At a BTC price of $110,000, this timing advantage is worth more than **8.17 million USD annually** for miners who adopt SV2 with JD while others continue using SV1. This is a **zero-sum competitive advantage** over existing transaction fees, not new revenue creation. As more miners adopt SV2, this advantage diminishes, making early adoption strategically valuable.

As transaction fees are expected to become a larger portion of miner income over time, **reducing fee-related inefficiencies** will become increasingly **critical** **for long-term profitability**. 

### **Block Propagation**

**Block Propagation Latency** measures the time it takes for a newly mined block to be broadcasted and accepted by the Bitcoin network. Faster propagation improves profitability by increasing the [likelihood](https://bitcoin.stackexchange.com/questions/126019/up-to-date-statistics-about-chain-reorganizations) that a miner’s block is accepted first, especially during chain-split races. 

![](/assets/case-study/hashlabs/block-propagation.png)

SV2 with Job Declaration reduces block propagation time from **96.3 milliseconds (SV1)** to just **3.44 milliseconds**, making block propagation faster. The major improvement in block propagation speed with Stratum V2 results primarily from its architectural design. Stratum V2 enables **dual block propagation**. A block can be propagated from the miner-side Job Declaration Client (JDC) in addition to the server-side Job Declaration Server (JDS), hosted by the mining pool. Conversely, Stratum V1 only propagates blocks from the pool-side server, leading to higher propagation delays.

The impact of improved block propagation speed can be significant, particularly during tight race conditions such as chain splits, where delays in propagating a mined block may result in a complete loss of the block reward, potentially causing substantial revenue losses. However, accurately predicting the occurrence and frequency of these events is practically challenging. Chain splits occur unpredictably and infrequently, making it difficult to precisely quantify the long-term profitability gains from reduced propagation latency. Nonetheless, given the competitive nature of mining, even infrequent events can meaningfully influence profitability over extended periods.

## **Hashrate Hijacking**

Stratum V1 exposes miners to a critical vulnerability: hashrate hijacking. Due to its lack of encryption and authentication, an attacker positioned between a miner and its pool can intercept job data and submit the miner’s resulting shares under their own credentials. The miner continues working, unaware that they are no longer receiving credit for their hashpower. Based on industry estimates, this type of attack happens often, resulting in [1%-2% of hashrate](https://braiins.com/blog/hashrate-robbery-stratum-v2-fixes-this-and-more) being effectively stolen, to avoid detection.

Stratum V2 addresses this risk by encrypting the communication channel and enforcing authentication, making hashrate hijacking practically impossible. For miners operating on 10% profit margins, recovering even a 0.5% loss in effective hashrate can **boost net profit by up to 5%**.

## **Summary**

By reducing latency, optimizing share submissions, and improving security, **Stratum V2** achieves a potential gain in net profit of **7.75%** coming exclusively from technical advancements.

Additional profitability gains from transparency improvements, such as preventing pools from secretly withholding hashrate or obscuring true fees, are outside the scope of this research but merit further investigation.

| KPI / Improvement                   | Type                             | Net Profit Gain       |
| ----------------------------------- | -------------------------------- | --------------------- |
| **Reduced stale shares**            | Measured efficiency gain         | **+2.0%**             |
| **Fee gain from lower job latency** | Modeled, margin-adjusted gain    | **+0.4%**             |
| **Hashrate hijacking protection**   | Industry-estimated security gain | **+5.0%**             |
| **Block change latency**            | Included in stale share impact   | *(not counted twice)* |
| **Block propagation**               | Latency improvement, not modeled | *(unmeasured)*        |
| **Total estimated net profit gain** |                                  | **up to 7.4%**        |

Beyond efficiency and profitability, Stratum V2 strengthens **security** through end-to-end encryption, **eliminating hashrate hijacking**, and empowering miners to **construct their own block templates** helping preserve Bitcoin’s core principles of security, decentralization and censorship resistance.

In addition to these measurable gains Stratum V2 introduces greater modularity and flexibility to mining operations. Unlike SV1’s rigid, pool-centric architecture, SV2 allows for more advanced network and daemon setups, enabling redundancy and failover strategies that weren’t previously possible. With features like Job Declaration (JD), miners can automatically fall back to solo mining if a pool connection drops, keeping operations running even over limited bandwidth connections (such as LTE). This reduces the risk of a single point of failure and gives operators more control over uptime.

**Our benchmarking demonstrates that in the relentless pursuit of excellence within Bitcoin mining, Stratum V2 provides a competitive edge through measurable profitability improvements.**

Adopting Stratum V2 is not merely about incremental improvements; nor is it only about decentralization. It's about securing a decisive edge in an increasingly competitive environment where fractional optimizations can impact profitability and can be the difference between success and failure.

The results presented in this report should be seen as directional, highlighting the potential of SV2 rather than representing its full capabilities. As the [benchmarking tool](https://github.com/stratum-mining/benchmarking-tool) and SV2 applications [mature](https://github.com/stratum-mining/stratum?tab=readme-ov-file#-project-maturity), we expect to see even more compelling performance improvements.

---

Acknowledgements:

This case study is the result of a collaborative effort from the mining community. We’re grateful to everyone who contributed their time, feedback, and expertise throughout the benchmarking process. Special thanks to those who reviewed early drafts, tested the benchmarking tool, and helped refine the methodology:

Alejandro De La Torre, Alen Mahmetov, Filippo Merli, Francisco Quadrio Monteiro, Gabriele Vernetti, Gary Krause, General Kenobi, Jakub Trnka, Jaran Mellerud, Jay Beddict, Lorenzo Bonazzi, Matt Corallo, Martin Schneider, Pavlenex, Plebhash, Reese Russel, Sjors Provoost, Steve Lee.

## Appendix A: Benchmarking Setup and Methodology

**This appendix outlines the complete setup, configurations, tools, and assumptions used in the SV2 vs SV1 benchmarking process.**

The benchmarking was conducted at Hashlabs facilities using two identical hardware devices **ASIC S19k Pro 120Th**, running stock firmware (MD5:a859d95a7110b29b0b70e3e681a5aa2c 2024-04-12) each configured to run separately on SV1 and SV2. The tests were performed under controlled conditions on the Bitcoin mainnet network and Testnet 4 (for measuring block propagation speed) using an [open-source benchmarking tool.](https://github.com/stratum-mining/benchmarking-tool) It is important to note that the **benchmarking tool** is in its alpha stage, and there is room for improvement for both SV1 and SV2 stacks.

All tests were executed via a **dedicated VPS**, which launched the entire benchmarking environment, including pool servers, proxies, and nodes, within **Docker containers**, ensuring all components shared the same hardware resources (CPU, memory, storage). 

To simulate real-world latency conditions, **artificial network delays** were introduced by the [benchmarking-tool](https://github.com/stratum-mining/benchmarking-tool). These delays are dynamically adjusted based on a continuously updated measurement of the **average latency between the benchmarking environment and major mining pools** such as Antpool, Braiins Pool, F2Pool, SpiderPool, Ocean, and ViaBTC. The latency calculation logic is available [here](https://github.com/stratum-mining/benchmarking-tool/tree/main/pools-latency-calculator).

The SV1 pool was implemented using the open-source [public-pool software](https://github.com/benjamin-wilson/public-pool), while SV2 leveraged the complete suite of applications (Pool, Proxy, JDC, JDS) developed and maintained by [SRI](https://github.com/stratum-mining/stratum/tree/main/roles). The SV2 applications deployed are reference implementations and are not considered production ready. However, the protocol layer of the reference implementation is solid, and developers are encouraged to build production-grade applications on top of it. 

Each SV1 and SV2 pool instance operated with **its own dedicated Bitcoin node**, ensuring isolation and proper protocol-specific behavior. In the **SV2 Configuration with Job Declaration**, the miner also ran **a local Bitcoin node** to enable block template construction.

We evaluated usage across two SV2 configurations and compared them to SV1:

1. **Without Job Declaration (JD):** Uses a Translation Proxy (tProxy) to enable SV1 firmware miners to connect to an SV2 pool without requiring a full node.  
2. **With Job Declaration (JD):** Deploys the complete SV2 stack (including a local Bitcoin node on the miner side). It grants miners control over block template construction but increases miner-side bandwidth, due to running a local Bitcoin node.
