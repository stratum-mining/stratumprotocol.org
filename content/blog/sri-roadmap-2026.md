---
title: "SRI Roadmap: Q4 2025 - Q1 2026"
description: "Following a year of significant protocol refinement and production testing, we're sharing our roadmap for Q4 2025 and Q1 2026. This phase focuses on improving user experience, expanding adoption through ready-to-use binaries and Docker deployments, building user interfaces for core applications, and integrating Bitcoin Core v30's IPC capabilities to simplify operations for miners."
date: "2025-10-24"
authors:
  - GitGab19
tags:
  - Stratum V2
  - SRI
  - Roadmap
---

Over the past year, the Stratum V2 Reference Implementation (SRI) has matured rapidly. We shipped four major releases, rebuilt key applications (Translator Proxy (tProxy), Job Declarator Client (JDC), and Pool) and tested them in production with real ASICs and firmware. We’ve also created our first bindings in [Python](https://github.com/stratum-mining/sv2-uniffi), expanding access for developers integrating SV2 into existing infrastructure. 

As maintainers of the specifications, we’ve worked closely with other builders including [Braiins](https://braiins.com/), [Demand](https://dmnd.work/), and others  to refine the Stratum V2 [spec](https://stratumprotocol.org/specification). Its evolution remains driven by collaboration and continues to be developed in public as an independent, free good, for the entire mining ecosystem.

## **What's Next: Better UX and Wider Adoption**
In the next few months, our focus will be on improving the SV2 Applications, particularly the Job Declarator Client (JDC) and Translator Proxy (tProxy) within the [sv2-apps repository](https://github.com/stratum-mining/sv2-apps), guided by adopter feedback and feature requests. In parallel, we’ll refine the core protocol libraries in the [stratum repository](https://github.com/stratum-mining/stratum), focusing on enhancements that address real-world needs and improve SRI integrations across different stacks and external software.

Our main goal for this phase is to simplify the user experience. We’ll be releasing ready-to-use binaries for all applications across major platforms, along with Docker setups that make deployment easy for everyone.

Beyond deployment UX, we plan to build interfaces for JDC and tProxy to make monitoring and management straightforward. These UIs will provide monitoring capabilities so miners can get real-time insights into their operations.

Another key step towards better UX is using the new **IPC interface** from **Bitcoin Core v30**. This will let SV2 miners create and work on their own block templates without running a custom Bitcoin Core fork. They'll just need to download the official v30+ version of Bitcoin Core, making their workflow much simpler.

At the same time, we'll work on improving **test coverage** for both protocol crates and applications, using a combination of unit tests and integration tests to ensure stability and reliability.

You can track our progress in detail on the [Q4 2025 project board](https://github.com/orgs/stratum-mining/projects/15/), where all milestones and tasks across both the `stratum` and `sv2-apps` repositories are tracked in public.

## **2025 - Quarter 4**

![2025-Q4](/assets/images/blog/roadmaps/sri-roadmap-2025-Q4.png)

### Core Protocol Libraries Development
This quarter, our focus within the core protocol libraries will be on refining the foundational elements of Stratum V2:

* **binary_sv2 restructuring**: Major refactoring of the binary_sv2 crate to improve architecture.
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

![2026-Q1](/assets/images/blog/roadmaps/sri-roadmap-2026-Q1.png)

### Core Protocol Libraries Continued Focus
* **Improve test coverage**: Significant increase in test coverage for core protocol crates to ensure higher code quality and reduce the likelihood of regressions.

### SV2 Applications Refinement
* **Enrich integration tests**: Expansion and enhancement of existing integration tests to ensure more comprehensive coverage and improved reliability of all application components.
* **Improve unit testing in apps**: Focus on improving the quality and coverage of unit tests within individual applications to catch bugs early and make the codebase more maintainable.


## **Conclusion**
Adoption of Stratum V2 has taken longer than many expected, and we’re fully aware of that. Building independent infrastructure takes time, especially when the goal is to make it a public good for the entire mining ecosystem.

We’re already working with a dozen early adopters, ASIC manufacturers, pools, and miners who are helping us test, integrate, and deploy Stratum V2. 

Earning trust in a competitive and traditionally closed industry has been one of our biggest challenges. Still, our team remains focused on creating open-source mining infrastructure that protects Bitcoin’s core values. 

Progress may feel gradual, but the direction is clear. We’re confident in our code, proud of our contributors, and excited for what the next few months will bring.

We thank our community, open-source developers, and funding partners [OpenSats](https://opensats.org), [Spiral](https://spiral.xyz), [HRF](http://hrf.org), and [Vinteum](https://vinteum.org) for helping make this work sustainable. 

We’re also looking for skilled developers who want to contribute as well as companies interested in supporting their work through grants.

If you’re a miner, pool operator, or developer interested in SV2, [join our Discord](https://discord.gg/fsEW23wFYs), we'd love to chat!
