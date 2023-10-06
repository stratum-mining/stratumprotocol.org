---
pageHeading: Roles and Protocols
---

# Stratum v2 Overview

The Stratum v2 Protocol Suite consists of [4 protocols](#sub-protocols) (the main Mining Protocol and 3 sub-protocols) which specify the communication standards among [5 roles](#roles) for Bitcoin Mining entities, through the use of 3 types of communication [channels](#channels). This section defines the roles, channels, and provides a summary of each sub-protocol's implementation. For technical specifications, please refer to the full documentation on [Github](https://www.github.com/stratum-mining/sv2-spec).

## Roles

We define 5 roles for entities in the Stratum v2 Protocol Suite, which can be classified as either downstream or upstream in relation to each other.

### Mining Devices or Miners

The actual mining machines which compute hashes. Miners may refer to a wide variety of hashrate producers; from large-scale corporate mining farms to wildcat mobile mining operations capturing flare gas on a temporory shale drilling site. Miners are most usefully referred to at the scale they communicate upstream to a pool: a 10PH mining farm colocated with a hydro dam that communicates as a single unit to the pool and splits its work internally may be thought of as a single 'miner', separate from the 'miner' operating a single S19 in his garage down the street. Miners "point" their hashrate at a Pool, defined below. From a Stratum v2 perspective, they are considered the most downstream roles.

### Pools 

Pools operate as communication nodes to coordinate hashrate and distribute mining rewards. They create jobs for end-mining devices, validate blocks and shares, and propagate found blocks to the Bitcoin Network. Pools do not custody or control hashrate. End-mining devices compatible with the Stratum protocol can switch between pools in minutes. Pools therefore compete for hashrate based on latency, ease-of-use, payout reliability, and associated networking services, all of which Stratum v2 can significantly improve. They are considered the most upstream roles. Pools can open any kind of communication channels (as defined below) with downstream roles (Proxies or Mining Devices).


### Proxies

Proxies are intermediaries between Miners and Pools that aggregate connections and translate mining communications from Sv1->Sv2 or Sv2->Sv1. Proxies may optionally provide additional functionality including monitoring services or job declaration optimizations. Both Miners and Pools can run Proxies, and they will do so for various reasons depending on the use-case.

#### Mining Proxy

The Sv2 Mining Proxy acts as an intermediary between the mining devices and the Sv2 Pool. It receives mining requests from multiple devices, aggregates them, and forwards them to the Sv2 Pool. It can open group/extended channels with upstream (the Sv2 Pool) and standard channels with downstream (Sv2 Mining Devices).

#### Translator Proxy

Translator Proxy is responsible for translating the communication between Sv1 actual Mining Devices and an Sv2 Pool or Mining Proxy. It enables Sv1 devices to interact with Sv2-based mining infrastructure, bridging the gap between the older Sv1 protocol and Sv2. It can open extended channels with upstream (the Sv2 Pool or Mining Proxy).
For example, a Pool might run a Translator Proxy as its initial connection service to accept both Sv1 and Sv2 connections, establishing direct standard channels with the Sv2 miners and using the proxy to translate messages with the Sv1 miners.

### Job Declarators

Job Declarators (JDs) are roles which can be Pool-side and Miner-side, but they can also be run by any third parties. They are connected to a Template Provider, in this way they are able to receive and validate custom block templates. They are the roles needed to implement the so called Job Declaration Protocol. They can further distribute jobs to a Mining Proxy (or Proxies) via the Job Distribution Protocol.

#### Job Declarator Server (JDS)

Job Declarator Server (or JDS) is the role which is Pool-side, in charge of allocating the mining job tokens needed by Job Declarator Client to create custom jobs to work on. It is also the entity responsible for Pool-side block propagation in case of valid blocks found by miners connected to the pool (who are using the Job Declaration Protocol).

#### Job Declarator Client (JDC)

Job Declarator Client (or JDC) is the role which is Miner-side, in charge of creating new mining jobs from the templates received by the Template Provider to which it is connected. It declares custom jobs to the JDS, in order to start working on them. JDC is also responsible for putting in action the Pool-fallback mechanism, automatically switching to backup Pools in case of declared custom jobs refused by JDS (which is Pool side). As a solution of last-resort, it is able to switch to Solo Mining until new safe Pools appear in the market.

### Template Providers

Template Providers (TPs) are roles which can be Pool-side and Miner-side, but they can also be run by any third parties. When the TP is Miner-side, it enables the extraction of transactions from the local Bitcoin node. In this way, miners are now able to create custom block templates and declare custom mining jobs to the Pool via the Job Declaration Protocol.


## Sub-Protocols

### Mining Protocol

Also known as the "Main Protocol", this is the direct successor to Stratum v1. The main protocol is used for mining and the only part of the full protocol stack that needs to be implemented in all scenarios. It is used for communication between Mining Devices, Proxies, and Pool Services. If a miner/pool does not support transaction selection and declared mining jobs, this is the only required protocol.
#### Channels
The protocol defines three types of communication channels:

- Standard channels don’t manipulate the Merkle path / coinbase transaction, greatly simplifying the communication required between them and upstream nodes.

- Extended channels are given extensive control over the search space so that they can implement advanced use cases (e.g. translation between v1 and v2, difficulty aggregation, custom search space splitting, etc.).

- Group channels are simply collections of standard channels that are opened within a particular connection so that they are addressable through a common communication channel.

### Job Declaration Protocol

The Job Declaration Protocol is used by a miner, typically a mining farm, to declare a custom block template with a Pool. The results of this declaration can be reused for all end-miner connections to the Pool, reducing computational intensity. In other words, a single declaration can be applied to an entire mining farm or even multiple farms with a large number of devices, leading to greater efficiency. This protocol is separate to allow Pools to terminate these connections on separate infrastructure from mining protocol connections. This protocol is a separate, optional piece of infrastructure from the Mining Protocol and can be provided as a 3rd party service for mining farms. It is one of the most crucial feature of the entire SRI stack, since it pushes to a decentralization of the transaction selection power.

### Template Distribution Protocol

The Template Distribution Protocol is used to facilitate the extraction of the information about the next block from Bitcoin Core. It is designed to replace getblocktemplate (BIPs 22 and 23) with a more efficient and easier-to-implement solution for those incorporating other aspects of Stratum v2 into their systems.

### Job Distribution Protocol

Used to pass newly-declared jobs to interested nodes, which can either be Proxies or actual Mining Devices. This protocol is complementary to the Job Declaration Protocol. In the case the miners aren’t building and declaring their own work (i.e. choosing their own transaction sets), jobs will be distributed directly from Pools to Proxies and end devices, similarly to the original stratum protocol. However, this protocol is left to be specified in a future document, as it is often unnecessary due to the Job Declarators being a part of a larger Mining Protocol Proxy.