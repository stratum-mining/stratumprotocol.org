---
title: "Hello World"
description: "This is the description."
date: "2023-03-14"
authors:
  - Pavlenex
tags:
  - StratumV2
  - Bitcoin
  - Mining
---
# StratumV2 Overview

The StratumV2 Protocol Suite consists of 4 Protocols (the main Mining Protocol and 3 sub-protocols) which specify the communication standards among 5 Roles for Bitcoin Mining entities. This section defines the roles and provides a summary of each sub-protocol's implementation. For technical specifications, please refer to the full documentation on [Github](https://www.github.com/stratum-mining/sv2-spec).

[![Test Video](https://img.youtube.com/vi/WqRz3dJPRLw/mqdefault.jpg)](https://www.youtube.com/watch?v=WqRz3dJPRLw "Test Video")

## Roles

We define 5 Roles for entities in the StratumV2 Protocol Suite:

### Mining Devices or Miners

The actual mining machines which compute hashes. Miners may refer to a wide variety of hashrate producers; from large-scale corporate mining farms to wildcat mobile mining operations capturing flare gas on a temporory shale drilling site. Miners are most usefully referred to at the scale they communicate upstream to a pool: a 10PH mining farm colocated with a hydro dam that communicates as a single unit to the pool and splits its work internally may be thought of as a single 'miner', separate from the 'miner' operating a single S19 in his garage down the street. Miners "point" their hashrate at a Pool, defined below.

### Pools (Hashrate Consumers)

Pools operate as communication nodes to coordinate hashrate and distribute mining rewards. They create jobs for end-mining devices, validate blocks and shares, and propagate found blocks to the Bitcoin Network. Pools do not custody or control hashrate. End-mining devices compatible with the Stratum protocol can switch between pools in minutes. Pools therefore compete for hashrate based on latency, ease-of-use, payout reliability, and associated networking services, all of which StratumV2 can significantly improve.

### Proxies

Proxies are intermediaries between Miners and Pools that aggregate connections and translate mining communications from v1->v2 or v2->v1. Proxies may optionally provide additional functionality including monitoring services or job negotiation optimizations. Both Miners and Pools can run Proxies, and will do so for various reasons depending on the use-case. e.g. A StratumV2 pool might run a proxy as its initial connection service to accept both V1 and V2 connections, establishing direct standard channels with the V2 miners and using the proxy to translate messages with the v1 miners.
