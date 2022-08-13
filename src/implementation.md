---
layout: DocumentationLayout
pageHeading: Reference Implementation
---

# Introduction

An open-source project building a reference implementation of the Stratum V2 protocol specification in Rust.

- [Discord](https://discord.gg/TsuT3YJWKN)
- [GitHub](https://github.com/stratum-mining)
- [Contribute](https://github.com/stratum-mining/stratum/issues)

## Bandwidth Consumption

SV2 optimizes bandwidth consumption by encoding messages in minimized binary and eliminating redundant messaging.

#### Technical Description

Stratum V1's JSON-RPC, human readable test protocol, makes messages 2-3x heavier than necessary. SV2's binary encodings minimize message sizes, optimizing miner-pool communication.

Stratum V2 removes redundant and unnecessary network pings including mining.subscribe, further reducing bandwidth consumption.

SV2 reduces the average network message from ~100 bytes (unencrypted) to 48 bytes (encrypted).

#### Motivation & Impact

Reducing network traffic & computational intensity for clients and servers lowers infrastructure costs. Minimized bandwidth consumption enables more precise hashrate measurement and mining reward distribution.

## Server CPU load

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
