---
title: "SRI Roadmap: Q4 2025 - Q1 2026"
description: "Following a year of significant protocol refinement and production testing, we're sharing our roadmap for Q4 2025 and Q1 2026. This phase focuses on improving user experience, expanding adoption through ready-to-use binaries and Docker deployments, building user interfaces for core applications, and integrating Bitcoin Core v30's IPC capabilities to simplify operations for miners."
date: "2025-10-24"
authors:
  - Gitgab19
tags:
  - Stratum V2
  - SRI
  - Roadmap
---

# SRI Roadmap: Q4 2025 - Q1 2026

## **A Year of Significant Progress and Refinement**
Over the past year, the **Stratum V2 Reference Implementation (SRI)** has made major progress with releases **1.2.1**, **1.3.0**, **1.4.0**, and **1.5.0**. These releases focused on refactoring protocol libraries to simplify integration and improve code quality.

We rebuilt key parts of the stack: the **Translator Proxy** (tProxy), **Job Declarator Clien**t (JDC), and Pool server now use the latest protocol crates. JDC and tProxy have been tested in production against various ASIC machines and firmware versions. We also created the first **Python** [bindings](https://github.com/stratum-mining/sv2-uniffi) for the project (kudos to @plebhash for this).

We've worked closely with the mining **community** and **companies** to improve the protocol [specification](https://stratumprotocol.org/specification). None of this would have been possible without our early adopters and financial supporters.

## **What's Next: Better UX and Wider Adoption**
Our current focus is on continuously improving the stack, with particular emphasis on SV2 Applications (especially JDC and tProxy) within the ***sv2-apps*** [repository](https://github.com/stratum-mining/sv2-apps), driven by adopter feedback and feature requests. At the same time, we'll refine the core protocol libraries in the ***stratum*** [repository](https://github.com/stratum-mining/stratum), focusing on enhancements that address real adopters needs, with the goal of improving SRI integrations across different stacks and external software.

Our main objective for this phase is to make the **user experience** much better when running SRI. We'll do this by providing ready-to-use binaries for every application on different platforms, along with simple Docker setups that make deployment easy for everyone.

To improve UX further, we're building **user interfaces** for JDC and tProxy. These UIs will provide monitoring capabilities so miners can get real-time insights into their Stratum V2 operations.

A key part of improving UX is using the new **IPC interface** from **Bitcoin Core v30**. This will let SV2 miners create and work on their own block templates without running a custom Bitcoin Core fork. They'll just need to download the official v30 version of Bitcoin Core, making their workflow much simpler.

At the same time, we'll work on improving **test coverage** for both protocol crates and applications, using a combination of unit tests and integration tests to ensure stability and reliability.

## **2025 - Quarter 4**

![2025-Q4](/assets/sri-roadmap-2025-Q4.png)

### Core Protocol Libraries Development
This quarter, our focus within the core protocol libraries will be on refining the foundational elements of Stratum V2:

* **binary_sv2 restructuring**: major refactoring of the binary_sv2 crate to improve architecture.
* **[Extension n.1](https://github.com/stratum-mining/sv2-spec/blob/main/extensions/extensions-negotiation.md)** and **[Extension n.2](https://github.com/stratum-mining/sv2-spec/blob/main/extensions/worker-specific-hashrate-tracking.md)**: Development and integration of protocol extensions to broaden Stratum V2's capabilities and support new use cases requested by the community.
* **Storage trait**: Implementation of a storage trait to improve data persistence, traceability, and recovery capabilities.
* **Extranonce improvements**: Optimization of extranonce_prefix generation for better efficiency and resiliency.
* **Improve protocol crates based on adopters' feedback**: Collecting and integrating feedback from early adopters to improve protocol crates based on real-world operational demands and production edge cases.
* **Protocol crates benchmark**: Comprehensive benchmarking to assess and optimize performance under various loads and scenarios, identifying bottlenecks and areas for improvement.


### SV2 Applications Development
The ***sv2-apps*** repository will see substantial development this quarter, focusing on application-level enhancements:

* **bitcoin_core_sv2 crate**: Integration of the bitcoin_core_sv2 crate to leverage Bitcoin Core v30's IPC functionalities, enabling miners to work with block templates without custom Bitcoin Core forks.
* **Improve JDC and tProxy**: Major improvements to both components based on production feedback, including bug fixes and performance optimizations.
* **Release apps binaries and docker images**: Official pre-built binaries for multiple platforms and Docker images to simplify deployment and lower the barrier to entry for new users.
* **JDS refactoring**: Extensive refactoring of the Job Declarator Server to improve architecture, performance, and maintainability, making it more robust.
* **Implement extensions in apps**: Development and integration of protocol extensions within the applications to expand feature sets and support custom functionalities requested by the community.
* **Monitoring crate**: Development of a monitoring crate that exposes APIs for real-time performance metrics and operational insights, giving miners better visibility into their operations.
* **Integrate tProxy in JDC**: Integration of Translator Proxy functionality directly into JDC to improve user experience by providing a single application when using Job Declaration.
* **UI for JDC and tProxy**: Development of user interfaces for both components to provide intuitive control and monitoring capabilities for managing Stratum V2 operations.
* **Non-aggregated mode in JDC**: Implementation of a non-aggregated mode to offer more granular control and data handling options for specific use cases.
* **UI for Pool and JDS**: User interfaces for both the Pool and Job Declarator Server to improve manageability and provide a better experience for pool operators.


## **2026 - Quarter 1**

![2026-Q1](/assets/sri-roadmap-2026-Q1.png)

### Core Protocol Libraries Continued Focus
* **Improve test coverage**: Significant increase in test coverage for core protocol crates to ensure higher code quality and reduce the likelihood of regressions.

### SV2 Applications Refinement
* **Enrich integration tests**: Expansion and enhancement of existing integration tests to ensure more comprehensive coverage and improved reliability of all application components.
* **Improve unit testing in apps**: Focus on improving the quality and coverage of unit tests within individual applications to catch bugs early and make the codebase more maintainable.


## **Conclusion**
Stratum V2 makes Bitcoin mining more **efficient**, **secure**, and **decentralized** by giving miners control over their own block templates. This roadmap shows our plan for **Q4 2025** and **Q1 2026** to make that vision real for everyone.

We're building SRI to be ready for production, easy to set up, and powerful enough for any mining operation. With pre-built binaries, Docker images, simple UIs, and Bitcoin Core v30 integration, we're removing the barriers for miners to use Stratum V2.

But we can't do this alone. We need miners to test and adopt these tools in **production**. We need developers to **integrate** SRI into their software and help improve it. We need pool operators to **support** the protocol and offer Stratum V2 to their users. Every adoption, every piece of feedback, every contribution gets us closer to making Stratum V2 the standard.

If you run mining operations, try SRI. If you build mining software, integrate it. If you see ways to make it better, contribute. The future of Bitcoin mining is being built right now, and we need your help.
