---
pageHeading: Reference Implementation
---

# The Stratum Mining Reference Implementation

The [SV2 Reference Implementation](https://www.github.com/stratum-mining/stratum) provides:

A robust set of Stratum V2 (Sv2) primitives as Rust library crates for anyone to expand the protocol or implement a role.
For example:

- Pools supporting Sv2
- Mining-device/hashrate producers integrating Sv2 into their firmware
- Bitcoin nodes implementing Template Provider to build the blocktemplate

The above Rust primitives as a C library available for use in other languages via FFI.

A set of helpers built on top of the above primitives and the external Bitcoin-related Rust crates for flexible implementations of the Sv2 roles.

An open-source implementation of a Sv2 proxy for miners.

An open-source implementation of a Sv2 pool for mining pool operators.

## Native Support

The Reference Implementation's modular design supports use in 3rd party software and is available under an MIT open-source license. However, the implementation itself supports several native use-cases for miners and pools:

### Miner Use-Cases

- Sv1 Miners can use the proxy (roles/sv2/mining-proxy) to connect with a Sv2-compatible pool.

- Sv1 mining farms mining to a Sv2-compatible pool gain some of the security and efficiency improvements Sv2 offers over Stratum V1 (Sv1). The Sv1<->Sv2 miner proxy does not support all the features of Sv2, but works as a temporary measure before upgrading completely to Sv2-compatible firmware. (The Sv1<->Sv2 translation proxy implementation is a work in progress.)

### Pool Use-Cases

- Pools supporting Sv2 can deploy the open source binary crate (roles/pool) to offer their clients (miners participating in said pool) an Sv2-compatible pool.

- The Rust helper library provides a suite of tools for mining pools to build custom Sv2 compatible pool implementations.

- The C library provides a set of FFI bindings to the Rust helper library for miners to integrate Sv2 into their existing firmware stack.

For further detailed documentation on how to deploy the reference implementation for one of the above use-cases or integrate, see the README on [Github](https://www.github.com/stratum-mining/stratum) or join our developer community on [Discord](https://discord.gg/fsEW23wFYs).
