---
layout: DocumentationLayout
pageHeading: SV2 in Detail
---

# Features

StratumV2 offers superior security, flexibility, and performance. This section details the motivations and technical descriptions behind V2's protocol design decisions.

## Bandwidth Consumption

SV2 optimizes bandwidth consumption by encoding messages in minimized binary and eliminating redundant messaging.

#### Technical Description

Stratum V1's JSON-RPC, human readable test protocol, makes messages 2-3x heavier than necessary. SV2's binary encodings minimize message sizes, optimizing miner-pool communication.

Stratum V2 removes redundant and unnecessary network pings including mining.subscribe, further reducing bandwidth consumption.

SV2 reduces the average network message size from ~100 bytes (unencrypted) to 48 bytes (encrypted).

#### Motivation & Impact

Reducing network traffic & computational intensity for clients and servers lowers infrastructure costs. Minimized bandwidth consumption enables more precise hashrate measurement and mining reward distribution.

## Server CPU Load

Stratum V2 enables efficient caching with standard and group channels for end-devices, eliminating Merkle Root recomputation for every share submission. Proxies with extended channel connections to pools can take responsibility for upstream calculations, reducing CPU load on share submissions by 70-80%.

#### Technical Server Description

Stratum V2 enables header-only mining, eliminating Merkle root recalculation. The Merkle root is always provided to an end-device by an upstream node. End devices no longer perform any coinbase modifications, reducing overhead costs for CPU load.

#### Motivation & Impact

Any pool can (and should) take advantage of this benefit to reduce inefficiency on the network. The SV2 mining proxy can be used as an upstream node for immediate perfomance improvement of an SV1 pool.

## Job Distribution Latency

Sv2 separates mining prevhash and future job, vs the combined message in Sv1 which forces pools to send empty blocks to communicate a prevhash. Sv2 pools can send jobs to workers ahead of time for future blocks, even before the prior block has been found. Pools send the latest prevhash in a space opitimized message, starting the end-device mining on the next block in a single 32-byte message.

#### Technical Description

Pools distribute jobs to miners with predefined data blocks and variable data for end-device miner handling. In Stratum V1, the predefined data includes the prevhash (i.e. hash of the most recently found valid block) and the Merkle root for the transaction set to be included in the current block. These two data fields aren’t seperable in Sv1, forcing a heavy (slow) data transfer necessary to distribute new jobs on new block (with a new prevhash) propagation.

Stratum V2 segregates the prevhash from the rest of the predefined block data, allowing independent sends of block data prior to finding a new prevhash. The new prevhash message is sent on its own on finding a valid block; the transmission occurs much faster because the message doesn’t include the heavier data. Stratum v2 miners begin work on new blocks faster than Stratum v1 miners.

#### Motivation & Impact

Every lost millisecond is lost bitcoin for miners. Segregating the prevhash from the rest of the block data allows miners to begin work on new blocks faster.

## Binary Encoding

SV2 uses a binary encoding for messages, eliminating redundant and unnecessary network pings. They are optimized for efficient computation and networking. Stratum V1's JSON-RPC protocol is human readable, making messages 2-3x heavier than necessary.

#### Technical Description

The Sv2 Protocol has fixed message framing and is precisely defined, eliminating Sv1's interpretation errors. See 'Framing' for details.

#### Motivation & Impact

The original Stratum V1 protocol's human readable JSON has a terrible ratio between message payload size and relevant information transmitted. Stratum V2's binary protocol yields far better data efficiency, saving bandwidth for more frequent submits.

## Man-in-the-Middle Attack Prevention

Stratum V2 ensures data integrity and confidentiality with a robust encryption scheme. End-to-end encryption protects miners from several known attacks on V1 including hashrate hijacking (where a third-party intercepts communication miner<-> pool communication and takes credit (i.e. steals payouts) for the miner's work.

#### Technical Description

Stratum V2 employs a type of encryption scheme called AEAD (authenticated encryption with associated data) to address the security aspects of all communication that occurs between clients and servers. This provides both confidentiality and integrity for the ciphertexts (i.e. encrypted data) being transferred, as well as providing integrity for associated data which is not encrypted.

#### Motivation & Impact

Stratum V1 is vulnerable to three types of man-in-the-middle attack:

1. Eavesdropping on unencrypted pool<->miner communications.
2. Stealing unencrypted metadata from ISP logs.
3. Hashrate hijacking.

Attackers can implement the above attacks undetected. Stratum V2 uses authenticated encryption with associated data (AEAD) to maintain pool<->miner privacy and prevents the above attacks.

## Eliminate Empty Block Mining

Stratum v1 incentivizes 'blind mining', where end-devices temporarily mine on an empty block, without any transactions, while calculating the next block candidate's block template. Sv2 eliminates the blind bining incentive by making full-block propagation equally efficient to empty block propagation.

#### Technical Description

Stratum v1 incentivizes pools to send empty blocks containing the new prevhash, as these messages will arrive faster than a message containing a full block. Separating these two messages in Stratum V2 lets pools send full blocks to miners before the new prevhash message. The miners' end-devices are prepared to start working on a new (full) block before the previous block has been found, and only require the next prevhash message to begin mining. Since this prevhash message is the same size (i.e. takes the same amount of time to arrive) regardless of whether or not the pool has sent an empty block or a full block, there is no longer an incentive to mine on empty blocks.

#### Motivation & Impact

As long as the incentive to mine on empty blocks exists, there is a nonzero chance that a miner will actually find a valid solution during this time and propose an empty block that’s accepted by the rest of the network. Given that there is no advantage to mining on an empty block vs. a full block with Stratum V2, empty block mining should effectively be eliminated.

## Job Selection

Miners can choose their own work and mine their chosen transaction set in Sv2, further decentralizing mining. Decentralized block template construction is implemented separately from the main mining protocol and is optional for pools and miners.

#### Technical Description

Job Selection by end-miners is an optional component of Stratum V2, separate from the main mining protocol. In fact, this is actually done by three sub-protocols:

1. Job Negotiation Protocol
2. Job Distribution Protocol
3. Template Distribution Protocol.

Job selection is a negotiation process between miner and pool. The miner proposes a block template; the pool accepts or rejects it. Once a negotiated template is accepted, the template can be multicast to other mining devices and farms. Implementing Job Selection Protocols separately allows pools to terminate connections on seperate infrastructure from the main mining protocol, preventing impact on the efficiency of share submissions.

#### Motivation & Impact

Allowing miners to choose their own transaction sets helps limit mining pools' ability to censor transactions, increasing Bitcoin's censorship resistance. This idea was originally put forth by Matt Corallo in BetterHash, and we felt it was very important to include in Stratum V2 as well because it has a meaningful impact on Bitcoin’s decentralization.

## Header-Only Mining

This lightweight version of the mining protocol allows less complex mining firmware which consumes less bandwidth / CPU load. It is faster and cheaper than the fullweight version,at the cost of flexibility. It is only intended for use by end-mining devices.

#### Technical Description

Stratum V2 lets miners open standard mining channels which prevent coinbase transaction manipulation. End-mining devices don't handle extranonce or recalculating the Merkle path. We call this header-only mining. The size of the search space for a device doing header-only mining for a particular value in the nTime field is 2^(NONCE_BITS + VERSION_ROLLING_BITS) = ~280Th, where NONCE_BITS = 32 and VERSION_ROLLING_BITS = 16. This is a guaranteed search space before nTime rolling. The client that opens a particular standard channel owns the entire assigned search space and can split it further (e.g. between multiple hashing boards or individual chips) if necessary.

#### Motivation & Impact

Stratum V1's 2012 pooled mining extension predates ASIC mining farms. Considering the amount and scale of these large farms today, operations can be simplified and network traffic can be reduced significantly by supporting simplified modes which optimize for speed and lower CPO load.

## Multiplexing

Allows a single connection (e.g. TCP) for independent communication channels between any number of devices, reducing the total connections anh costs necessary for pools and proxies.

#### Technical Description

A single physical TCP connection can have as many as 232 (~4.3 billion) open channels to an upstream stratum node. These independent channels have unique channel IDs, so many devices can simultaneously receive different job assignments using the same connection, saving on infrastructure costs. Simultaneously, the channels may all share information for greater efficiency (e.g. new prevhash broadcast).

#### Motivation & Impact

Every physical connection adds complexity and extra infrastructure overhead to mining operations. Enabling multiplexing lets multiple parties communicate within a more efficient and simple single connection.

## Implicit Work Subscription

Stratum V2 eliminates unnecessary messages from V1, implicitly assuming that opening a mining channel indicates that the miner is ready for jobs.

#### Technical Description

When a miner establishes a connection with a pool (client —> server) in Stratum V1, they send a mining.authorize message. Once the authorization request is successful, the miner then sends a mining.subscribe message indicating that they wish to begin (or resume) working on jobs assigned by the pool. In other words, miners must explicitly request job assignments. In Stratum V2, it is implicitly assumed that a miner wants to receive job assignments if they open a channel with a pool.

#### Motivation & Impact

The mining.subscribe message is no longer relevant. Explicit mining subscriptions simply create unnecessary data transfers in Stratum V1. Making work subscription implicit improves the relative efficiency of the protocol.

## Native Version Rolling

Version rolling was added as an extension (BIP 310) for Stratum V1. This has become an essential part of mining, and V2 directly supports version rolling by miners without requiring any extensions.

#### Technical Description

Each Bitcoin block header contains a version field whose bits can be freely used to extend the search space for a miner. This process is called 'version rolling'. Modern ASIC machines exhaust the 32-bit nonce field's search space in under 100ms. The controller on the machine must then distribute new jobs to each mining chip. This wastes bandwidth and CPU load. Rolling the version bits can greatly reduce the frequency of distributing new jobs, and is already a standard preferred method (see BIP320). Version rolling is native to Stratum V2 rather than requiring a V1 extension.

#### Motivation & Impact

Version rolling is already extremely common and widely adopted. We’ve simply changed it from an extension in Stratum V1 to a native component of the protocol in Stratum V2.

## Zero-time Backend Switching

Zero-time backend switching lets a proxy efficiently provision and allocate jobs from different pools. A mining farm operator could use a single proxy for all of their devices while mining with multiple pools with minimal additional latency or inefficiencies.

#### Technical Description

Zero-time backend switching (i.e. changing the upstream server from which they are receiving jobs or connecting to multiple upstream servers at once) allows miners to efficiently implpment more complicated use cases (e.g. coin switching between Bitcoin and Bitcoin Cash). This is possible with the extraNonce subscription extension in v1, but is uncommon and mostly unsupported in mining firmware. As a native feature of v2, miners can receive jobs from multiple sources simultaneously on standard channels without additional inefficiencies introduced by extensions.

#### Motivation & Impact

Backend switching with zero delays enables efficiencies for more elaborate mining setups and allows optimization of physical infrastructure for complex use cases.

## Same Connection - Different Jobs

Allows miners to mine on different jobs (and potentially different coins) on a single connection.

#### Technical Description

Multiplexing in Stratum V2 uses a single physical connection to transmit data about various different jobs. This reduces infrastructure complexity and cost. A 3-Way TCP handshake requires 3 data packet transmissions. Mining pools regularly end up opening/closing hundreds or thousands of connections each day. Being able to send different jobs on a single connection reduces the frequency with which connections need to be opened and closed, as well as the total number of connections needed.

#### Motivation & Impact

As stated above in the Multiplexing section, the primary motivation for enabling data about different jobs to be transmitted on a single connection is to reduce physical infrastructure complexity and overhead costs.
