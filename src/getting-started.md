---
layout: DocumentationLayout
pageHeading: Getting Started
---

# Getting Started with running SRI - Stratum v2 reference implementation

SRI stack is flexible. It allows you to run a few different configurations. The easiest way to test these configurations is to use the SRI [role](https://github.com/stratum-mining/stratum/tree/main/roles) implementations.

Below are the most commonly used configurations you can run to get started.

## Config 1: SV1 firmware > Translation Proxy > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). The proxy is designed to sit in between a SV1 downstream role (most typically Mining Device(s) running SV1 firmware) and a SV2 upstream role (most typically a SV2 Pool Server).

![Config1](/assets/config-c.svg)
### 0. Clone Stratum repository locally
```
git clone https://github.com/stratum-mining/stratum.git 
```
```
cd stratum/ 
```

### 1. Start Pool

The Pool role should be configured to point to the hosted Template Provider. In the `pool-config.toml` file you should see this: `tp_address = "75.119.150.111:8442"` The default `pool-config.toml` should have appropriate defaults set up for everything else.

```
cd roles/v2/pool/
```
```
cargo run -p pool_sv2
```

If the pool properly starts you should see the following log lines:

```log
2023-02-17T17:58:38.526172Z  INFO pool: Pool INITIALIZING with config: "pool-config.toml"
2023-02-17T17:58:38.560038Z  INFO pool::lib::template_receiver: Connected to template distribution server at 75.119.150.111:8442
2023-02-17T17:58:38.646853Z  INFO pool::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-02-17T17:58:38.649072Z  INFO pool::lib::job_negotiator: JN INITIALIZED
2023-02-17T17:58:38.688521Z  INFO pool::lib::mining_pool: Starting up pool listener
2023-02-17T17:58:38.688988Z  INFO pool::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```

### 2. Start Translator

Once the pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.

Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. By default, the tProxy will connect to a locally hosted pool (which you deployed in the first step, or default to a hosted Braiins pool in case you didn't). Feel free to switch the pools while testing things out.

If you're interested in learning about information in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

Modify `proxy.config.toml (optional)`
```
cd roles/translator/
```
```
cargo run -p translator_sv2
```

If the translator starts properly, you should see the following log lines:

```log
2023-02-17T18:32:16.093603Z  INFO translator: Connected to Upstream!
2023-02-17T18:32:16.265612Z  INFO translator::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
[roles/translator/src/upstream_sv2/upstream.rs:304] m.extranonce_prefix.len() = 7
2023-02-17T18:32:16.273222Z  INFO translator::upstream_sv2::upstream: Is future job: true

2023-02-17T18:32:16.273327Z  INFO translator::upstream_sv2::upstream: Up: New Extended Mining Job
2023-02-17T18:32:16.273590Z  INFO translator::upstream_sv2::upstream: Up: Set New Prev Hash
```

### 3. Start SV1 CPU Miner

After starting a pool, and a translation proxy, let’s start a CPU miner. We’ve done tests with CPUMiner.

1. Setup the correct CPUMiner for your OS:
   1. You can download the binary directly from [here](https://sourceforge.net/projects/cpuminer/files/);
   2. Or compile it from https://github.com/pooler/cpuminer 
2. Go into directory of the downloaded CPUMiner, for example: 
   ```
   cd Downloads/
   ```
3. Then run: 
   ```
   ./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P
   ```
This will connect to the translator proxy and speak sv1. If this is successful you should see the following output:

```log
[2023-02-17 17:56:48] DEBUG: job_id='1' extranonce2=000000000000 ntime=63efb1c9
[2023-02-17 17:56:48] Stratum requested work restart
[2023-02-17 17:56:51] DEBUG: hash <= target
Hash:   000000008faeb1f1775b84d225dd17e18239ba9b70354493985c3b16ad7647b8
Target: 0000000dfff20000000000000000000000000000000000000000000000000000
[2023-02-17 17:56:51] > {"method": "mining.submit", "params": ["", "1", "000000000000", "63efb1c9", "37f163c0"], "id":4}
[2023-02-17 17:56:51] < {"id":"4","error":null,"result":true}
[2023-02-17 17:56:51] accepted: 1/1 (100.00%), 15886 khash/s (yay!!!)
```

Eventually, the Translation Proxy log output will show sucessful share, which means you've run the configuration successfully!

```log
2023-03-13T11:59:43.396190Z  INFO translator_sv2::downstream_sv1::downstream: PROXY SERVER - ACCEPTING FROM DOWNSTREAM: 127.0.0.1:53260
2023-03-13T11:59:43.396700Z  INFO translator_sv2::downstream_sv1::downstream: Down: Subscribing
2023-03-13T11:59:43.397221Z  INFO translator_sv2::downstream_sv1::downstream: Down: Authorizing
2023-03-13T11:59:49.118285Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: Sv2Frame { header: Header { extension_type: 32768, msg_type: 27, msg_length: U24(41) }, payload: Some(Mining(SubmitSharesExtended(SubmitSharesExtended { channel_id: 2, sequence_number: 0, job_id: 0, nonce: 4031057692, ntime: 1678701333, version: 536870912, extranonce: Owned([0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) }))), serialized: None }
2023-03-13T11:59:49.119795Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Submitted Share

```
