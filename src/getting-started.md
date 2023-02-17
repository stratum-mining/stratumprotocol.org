---
layout: DocumentationLayout
pageHeading: Getting Started
---

# Getting Started with running SRI - Stratum v2 reference implementation

SRI stack is flexible. It allows you to run a few different configurations. The easiest way to test these configurations is to use the SRI [role](https://github.com/stratum-mining/stratum/tree/main/roles) implementations.

Below are the most commonly used configurations you can run to get started.

## Config 1: SV1 firmware > Translation Proxy > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). The proxy is designed to sit in between a SV1 downstream role (most typically Mining Device(s) running SV1 firmware) and a SV2 upstream role (most typically a SV2 Pool Server).

### 1. Start Pool

The Pool role should be configured to point to the hosted Template Provider. In the `pool-config.toml` file you should see this: `tp_address = "75.119.150.111:8442"` The default `pool-config.toml` should have appropriate defaults set up for everything else.

1. `cd roles/v2/pool` directory located in `Stratum > Roles > V2 > Pool`
2. Then `cargo run -p pool`

If the pool properly starts you should see the following log lines:

```
2023-02-17T17:58:38.526172Z  INFO pool: Pool INITIALIZING with config: "pool-config.toml"
2023-02-17T17:58:38.560038Z  INFO pool::lib::template_receiver: Connected to template distribution server at 75.119.150.111:8442
2023-02-17T17:58:38.646853Z  INFO pool::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-02-17T17:58:38.649072Z  INFO pool::lib::job_negotiator: JN INITIALIZED
2023-02-17T17:58:38.688521Z  INFO pool::lib::mining_pool: Starting up pool listener
2023-02-17T17:58:38.688988Z  INFO pool::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```

### 2. Start Translator

Once the pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.

Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. By default, the tProxy will connect to a locally hosted pool (which you deployed in the first step, or default to a hosted Braiins pool. Feel free to switch the pools while testing things out.

The `proxy-config.toml` is modified by the party that is running the Translator Proxy (most typically the mining farm/miner hobbyist).

If you're interested in learning about information in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

1. Modify `proxy.config.toml (optional)`
2. `cd roles/translator`
3. `cargo run -p translator`

If the translator starts properly you should see the following log lines:

### 3. Start SV1 CPU Miner

After starting a pool, and a translation proxy, let’s start a CPU miner. We’ve done tests with CPUMiner.
1. Download CPUMiner for your OS.
2. Cd into directory of the downloaded CPUMiner, for example `cd Downloads`
3. run: `./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P`. This will connect to the translator proxy and speak sv1. If this is successful you should see the following output:
```
[2023-02-17 17:56:48] DEBUG: job_id='1' extranonce2=000000000000 ntime=63efb1c9
[2023-02-17 17:56:48] Stratum requested work restart
[2023-02-17 17:56:51] DEBUG: hash <= target
Hash:   000000008faeb1f1775b84d225dd17e18239ba9b70354493985c3b16ad7647b8
Target: 0000000dfff20000000000000000000000000000000000000000000000000000
[2023-02-17 17:56:51] > {"method": "mining.submit", "params": ["", "1", "000000000000", "63efb1c9", "37f163c0"], "id":4}
[2023-02-17 17:56:51] < {"id":"4","error":null,"result":true}
[2023-02-17 17:56:51] accepted: 1/1 (100.00%), 15886 khash/s (yay!!!)
```

Now that everything is started you will see in the Translation Proxy log output:

```
2023-02-17T18:32:16.093603Z  INFO translator: Connected to Upstream!
2023-02-17T18:32:16.265612Z  INFO translator::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
[roles/translator/src/upstream_sv2/upstream.rs:304] m.extranonce_prefix.len() = 7
2023-02-17T18:32:16.273222Z  INFO translator::upstream_sv2::upstream: Is future job: true

2023-02-17T18:32:16.273327Z  INFO translator::upstream_sv2::upstream: Up: New Extended Mining Job
2023-02-17T18:32:16.273590Z  INFO translator::upstream_sv2::upstream: Up: Set New Prev Hash
```

And eventually: 
```
2023-02-17T18:12:39.296514Z  INFO translator::proxy::bridge: SHARE MEETS DOWNSTREAM TARGET
```
