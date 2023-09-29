---
pageHeading: Roles and Protocols
---

# Stratum v2 Overview

The Stratum v2 Protocol Suite consists of 4 Protocols (the main Mining Protocol and 3 sub-protocols) which specify the communication standards among 5 Roles for Bitcoin Mining entities. This section defines the roles and provides a summary of each sub-protocol's implementation. For technical specifications, please refer to the full documentation on [Github](https://www.github.com/stratum-mining/sv2-spec).

## Roles

We define 5 Roles for entities in the Stratum v2 Protocol Suite:

### Mining Devices or Miners

The actual mining machines which compute hashes. Miners may refer to a wide variety of hashrate producers; from large-scale corporate mining farms to wildcat mobile mining operations capturing flare gas on a temporory shale drilling site. Miners are most usefully referred to at the scale they communicate upstream to a pool: a 10PH mining farm colocated with a hydro dam that communicates as a single unit to the pool and splits its work internally may be thought of as a single 'miner', separate from the 'miner' operating a single S19 in his garage down the street. Miners "point" their hashrate at a Pool, defined below.

### Pools (Hashrate Consumers)

Pools operate as communication nodes to coordinate hashrate and distribute mining rewards. They create jobs for end-mining devices, validate blocks and shares, and propagate found blocks to the Bitcoin Network. Pools do not custody or control hashrate. End-mining devices compatible with the Stratum protocol can switch between pools in minutes. Pools therefore compete for hashrate based on latency, ease-of-use, payout reliability, and associated networking services, all of which Stratum v2 can significantly improve.

### Proxies

Proxies are intermediaries between Miners and Pools that aggregate connections and translate mining communications from v1->v2 or v2->v1. Proxies may optionally provide additional functionality including monitoring services or job declaration optimizations. Both Miners and Pools can run Proxies, and will do so for various reasons depending on the use-case. e.g. A Stratum v2 pool might run a proxy as its initial connection service to accept both V1 and V2 connections, establishing direct standard channels with the V2 miners and using the proxy to translate messages with the v1 miners.

### Job Declarators

Job Declarators (JDs) are Pool-side Proxies that receive and validate custom block templates from Template Providers. They declare the template to the pool per the Job Declaration Protocol.
They can further distribute jobs to a Mining Proxy (or Proxies) via the Job Distribution Protocol.

### Template Providers

Template Providers (TPs) are Miner-side Proxies that create custom block templates and negotiate their use with the job declarator via the Job declaration Protocol. Template Providers are usually a Bitcoin Core full node, but can also work with a different node implementation.

## Sub-Protocols

### Mining Protocol

Also known as the "Main Protocol", this is the direct successor to StratumV1. The main protocol is used for mining and the only part of the full protocol stack that needs to be implemented in all scenarios. It is used for communication between Mining Devices, Proxies, and Pool Services. If a miner/pool does not support transaction selection, this is the only required protocol.
The protocol defines three types of communication channels:

- Standard channels don’t manipulate the Merkle path / coinbase transaction, greatly simplifying the communication required between them and upstream nodes.

- Extended channels are given extensive control over the search space so that they can implement advanced use cases (e.g. translation between v1 and v2, difficulty aggregation, custom search space splitting, etc.).

- Group channels are simply collections of standard channels that are opened within a particular connection so that they are addressable through a common communication channel.

### Job Declaration Protocol

A Miner's Template Provider negotiates a block template (which includes the transaction set) with a Pool's Job Declarator. The Pool can reuse declaration outcomes across all end-miner connections to reduce computational intensity. A single declaration can multicast to multiple farms with hundreds of thousands of devices. This protocol is a separate, optional piece of infrastructure from the Mining Protocol and can be provided as a 3rd party service for mining farms.
Separating job declaration as a sub-protocol lets pools terminate declaration connections independently of mining protocol connections (i.e. share submissions).
Work declaration likely requires, at minimum, validity spot-checks and (potentially) rate-limiting.

### Template Distribution Protocol

Used to get information about the next block out of Bitcoin Core. This protocol was designed as a much more efficient and easy-to-implement API to replace getblocktemplate (BIPs 22 and 23). More specifically, the Template Distribution Protocol is used to communicate with a part of Bitcoin Core called “bitcoind” which implements the Bitcoin protocol for Remote Procedure Call (RPC) use. In other words, bitcoind allows the Bitcoin protocol to be integrated with other software.

### Job Distribution Protocol

Used to pass newly-negotiated work to interested nodes, which can either be proxies or actual mining devices. This protocol is complementary to the Job declaration protocol. In the case that miners aren’t negotiating their own work (i.e. choosing their own transaction sets), jobs will be distributed directly from pools to proxies and end devices, similarly to in the original stratum protocol. Additionally, it’s possible that the Job declaration role will be part of a larger Mining Protocol proxy that also distributes jobs, making this sub-protocol unnecessary even when miners do choose their own transaction sets.
