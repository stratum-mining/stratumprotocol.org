---
layout: DocumentationLayout
pageHeading: Milestones
nav:
  - text: Features
    link: /features/
  - text: How To
    link: /how-to/
  - text: Implementation
    link: /implementation/
  - text: Specifications
    link: /specifications/
---

# Introduction

An open-source project was formed to create a reference implementation of the Stratum V2 specifications in Rust.

- [Discord](https://discord.com/)
- [Github](https://github.com/)
- [Contribute](https://github.com/)

## Technical Description

Having a binary rather than text-based protocol reduces bandwidth consumption considerably. Making messages human-readable in Stratum V1 resulted in some messages being approximately 2-3 times heavier than necessary, and those have now been reduced to a minimum size in V2.

Additionally, V1 includes some messages that are unnecessary altogether, such as mining. By eliminating these instances, fewer messages need to be transmitted in total and bandwidth consumption is reduced even further.

## Motivation & Impact

Reducing network traffic as well as client-side and server-side computational intensity translates to lower infrastructure costs for all participants. At the same time, a significant reduction in bandwidth consumption allows for hashing results to be transmitted more frequently, enabling more precise hashrate measurement and mining reward distribution as a result.

## Server CPU load

With the introduction of standard and group channels for end devices, Stratum V2 enables efficient caching so that server CPUs don’t need to recompute the Merkle root for every share submission. This shifts more responsibility upstream from end mining devices to proxies that connect to pools via extended channels.

## Technical Server Description

Reduced server CPU load in Stratum V2 is a result of enabling end devices to do header-only mining. This means that the Merkle root is always provided by an upstream node and doesn’t need to be handled by end devices at all. In other words, end devices no longer have to perform any coinbase modifications. This makes computations simpler for miners, but it also has the added benefit of making work validation (i.e. CPU load) much lighter on the server side.

## Motivation & Impact of the project

As pool operators ourselves, one of our motivations for reducing server CPU load is probably rather obvious — it reduces our overhead costs. However, any pool can (and should) take advantage of this benefit, so the greater motivation in the big picture is simply to reduce the inefficiency of the entire network.

## Technical Description

Having a binary rather than text-based protocol reduces bandwidth consumption considerably. Making messages human-readable in Stratum V1 resulted in some messages being approximately 2-3 times heavier than necessary, and those have now been reduced to a minimum size in V2.

Additionally, V1 includes some messages that are unnecessary altogether, such as mining. By eliminating these instances, fewer messages need to be transmitted in total and bandwidth consumption is reduced even further.

## Motivation & Impact

Reducing network traffic as well as client-side and server-side computational intensity translates to lower infrastructure costs for all participants. At the same time, a significant reduction in bandwidth consumption allows for hashing results to be transmitted more frequently, enabling more precise hashrate measurement and mining reward distribution as a result.

## Server CPU load

With the introduction of standard and group channels for end devices, Stratum V2 enables efficient caching so that server CPUs don’t need to recompute the Merkle root for every share submission. This shifts more responsibility upstream from end mining devices to proxies that connect to pools via extended channels.

## Technical Server Description

Reduced server CPU load in Stratum V2 is a result of enabling end devices to do header-only mining. This means that the Merkle root is always provided by an upstream node and doesn’t need to be handled by end devices at all. In other words, end devices no longer have to perform any coinbase modifications. This makes computations simpler for miners, but it also has the added benefit of making work validation (i.e. CPU load) much lighter on the server side.

## Motivation & Impact of the project

As pool operators ourselves, one of our motivations for reducing server CPU load is probably rather obvious — it reduces our overhead costs. However, any pool can (and should) take advantage of this benefit, so the greater motivation in the big picture is simply to reduce the inefficiency of the entire network.

## Technical Description

Having a binary rather than text-based protocol reduces bandwidth consumption considerably. Making messages human-readable in Stratum V1 resulted in some messages being approximately 2-3 times heavier than necessary, and those have now been reduced to a minimum size in V2.

Additionally, V1 includes some messages that are unnecessary altogether, such as mining. By eliminating these instances, fewer messages need to be transmitted in total and bandwidth consumption is reduced even further.

## Motivation & Impact

Reducing network traffic as well as client-side and server-side computational intensity translates to lower infrastructure costs for all participants. At the same time, a significant reduction in bandwidth consumption allows for hashing results to be transmitted more frequently, enabling more precise hashrate measurement and mining reward distribution as a result.

## Server CPU load

With the introduction of standard and group channels for end devices, Stratum V2 enables efficient caching so that server CPUs don’t need to recompute the Merkle root for every share submission. This shifts more responsibility upstream from end mining devices to proxies that connect to pools via extended channels.

## Technical Server Description

Reduced server CPU load in Stratum V2 is a result of enabling end devices to do header-only mining. This means that the Merkle root is always provided by an upstream node and doesn’t need to be handled by end devices at all. In other words, end devices no longer have to perform any coinbase modifications. This makes computations simpler for miners, but it also has the added benefit of making work validation (i.e. CPU load) much lighter on the server side.

## Motivation & Impact of the project

As pool operators ourselves, one of our motivations for reducing server CPU load is probably rather obvious — it reduces our overhead costs. However, any pool can (and should) take advantage of this benefit, so the greater motivation in the big picture is simply to reduce the inefficiency of the entire network.
