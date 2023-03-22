---
layout: DocumentationLayout
pageHeading: Getting Started
---

# Getting Started with running SRI - Stratum v2 reference implementation

SRI stack is flexible. It allows you to run a few different configurations. The easiest way to test these configurations is to use the SRI [role](https://github.com/stratum-mining/stratum/tree/main/roles) implementations.

Below are the most commonly used configurations you can run to get started.

### Prerequisites

Rust installed on your machine. 
If it's not:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Locally clone the Stratum repository:
```
git clone https://github.com/stratum-mining/stratum.git 
```

## Config C: SV1 firmware > Translation Proxy > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). The proxy is designed to sit in between a SV1 downstream role (most typically Mining Device(s) running SV1 firmware) and a SV2 upstream role (most typically a SV2 Pool Server).

![Config1](/assets/config-c.svg)

### 1. Start **SV2 Pool**

The Pool role for this configuration is set to point to the hosted Template Provider. In the `conf/pool-config-regnet-hosted.toml` file you should see this: `tp_address = "75.119.150.111:8442"`.

```
cd stratum/roles/v2/pool/
```
```
cargo run -p pool_sv2 -- -c conf/pool-config-regnet-hosted.toml
```

If the pool properly starts you should see the following log lines:

```log
2023-03-21T17:49:21.128335Z  INFO pool_sv2: Pool INITIALIZING with config: "conf/pool-config-regnet-hosted.toml"
2023-03-21T17:49:21.244466Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 75.119.150.111:8442
2023-03-21T17:49:21.342819Z  INFO pool_sv2::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-03-21T17:49:21.343061Z  INFO pool_sv2::lib::mining_pool: PUB KEY: [TxOut { value: 5000000000, script_pubkey: Script(OP_PUSHBYTES_65 04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a OP_CHECKSIG) }]
2023-03-21T17:49:21.343312Z  INFO pool_sv2::lib::job_negotiator: JN INITIALIZED
2023-03-21T17:49:21.343329Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2023-03-21T17:49:21.343721Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```

### 2. Start **Translator (tProxy)**

Once the SV2 pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.\
In a new terminal:
```
cd stratum/roles/translator/
```
Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. For this specific configuration, the tProxy will connect to a locally hosted pool (which you deployed in the first step). Feel free to switch the pools while testing things out.

If you're interested in learning about information present in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

```
cargo run -p translator_sv2 -- -c conf/tproxy-config-local.toml
```

If the translator starts properly, you should see the following log lines:

```log
2023-03-21T17:50:50.364920Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2023-03-21T17:50:50.374639Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: SetupConnection { protocol: MiningProtocol, min_version: 2, max_version: 2, flags: 4, endpoint_host: Owned([48, 46, 48, 46, 48, 46, 48]), endpoint_port: 50, vendor: Owned([]), hardware_version: Owned([]), firmware: Owned([]), device_id: Owned([]) }
2023-03-21T17:50:50.376488Z  INFO translator_sv2::upstream_sv2::upstream: Up: Receiving: Sv2Frame { header: Header { extension_type: 0, msg_type: 1, msg_length: U24(6) }, payload: None, serialized: Some(Slice { offset: 0x7f8b352ba010, len: 12, index: 1, shared_state: SharedState(128), owned: None }) }
2023-03-21T17:50:50.376663Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: OpenExtendedMiningChannel(OpenExtendedMiningChannel { request_id: 0, user_identity: Owned([65, 66, 67]), nominal_hash_rate: 5000000.0, max_target: Owned([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]), min_extranonce_size: 16 })
2023-03-21T17:50:50.376748Z  INFO translator_sv2: Connected to Upstream!
2023-03-21T17:50:50.378399Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2023-03-21T17:50:50.419344Z  INFO translator_sv2::upstream_sv2::upstream: Is future job: true
2023-03-21T17:50:50.419409Z  INFO translator_sv2::upstream_sv2::upstream: Up: New Extended Mining Job
2023-03-21T17:50:50.419575Z  INFO translator_sv2::upstream_sv2::upstream: Up: Set New Prev Hash
[roles/translator/src/proxy/bridge.rs:584] job.job_id = 1
[roles/translator/src/proxy/bridge.rs:584] sv2_set_new_prev_hash.job_id = 1
```

### 3. Start **SV1 CPU Miner**

After starting a pool, and a translation proxy, let’s start a CPU miner. We’ve done tests with CPUMiner.

Setup the correct CPUMiner for your OS:
- You can download the binary directly from [here](https://sourceforge.net/projects/cpuminer/files/);
- Or compile it from [https://github.com/pooler/cpuminer](https://github.com/pooler/cpuminer)
   
Go into directory of the downloaded CPUMiner, for example: 
   ```
   cd Downloads/
   ```
Then run: 
   ```
   ./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P
   ```
This will connect to the translator proxy and speak sv1. If this is successful you should see the following output:

```log
[2023-03-20 12:32:06] DEBUG: job_id='1' extranonce2=0000000000000000000000000000 ntime=6417ba1a
[2023-03-20 12:32:06] Stratum requested work restart
[2023-03-20 12:32:12] DEBUG: hash <= target
Hash:   00000001658bd854fa337fc9a8eb76981750146e18a8daae3c1b8468bd1c921d
Target: 0000000dfff20000000000000000000000000000000000000000000000000000
[2023-03-20 12:32:12] > {"method": "mining.submit", "params": ["", "1", "0000000000000000000000000000", "6417ba1a", "ad3fbde1"], "id":4}
[2023-03-20 12:32:12] < {"id":4,"error":null,"result":true}
[2023-03-20 12:32:12] accepted: 1/1 (100.00%), 51235 khash/s (yay!!!)
```

Eventually, the Translation Proxy log output will show sucessful share, which means you've run the configuration successfully!

```log
2023-03-21T17:54:24.665389Z  INFO translator_sv2::downstream_sv1::downstream: PROXY SERVER - ACCEPTING FROM DOWNSTREAM: 127.0.0.1:36298
2023-03-21T17:54:24.665855Z  INFO translator_sv2::downstream_sv1::downstream: Down: Subscribing
2023-03-21T17:54:24.666843Z  INFO translator_sv2::downstream_sv1::downstream: Down: Authorizing
BITCOIN TARGET: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
2023-03-21T17:54:28.721866Z  INFO translator_sv2::proxy::bridge: SHARE MEETS TARGET
2023-03-21T17:54:28.722207Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: Sv2Frame { header: Header { extension_type: 32768, msg_type: 27, msg_length: U24(41) }, payload: Some(Mining(SubmitSharesExtended(SubmitSharesExtended { channel_id: 1, sequence_number: 0, job_id: 1, nonce: 2784102488, ntime: 1679417936, version: 536870912, extranonce: Owned([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) }))), serialized: None }
2023-03-21T17:54:29.584107Z  INFO translator_sv2::upstream_sv2::upstream: Is future job: true

2023-03-21T17:54:29.584210Z  INFO translator_sv2::upstream_sv2::upstream: Up: New Extended Mining Job
2023-03-21T17:54:29.584363Z  INFO translator_sv2::upstream_sv2::upstream: Up: Set New Prev Hash
[roles/translator/src/proxy/bridge.rs:584] job.job_id = 2
[roles/translator/src/proxy/bridge.rs:584] sv2_set_new_prev_hash.job_id = 2
BITCOIN TARGET: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
2023-03-21T17:54:33.437332Z  INFO translator_sv2::proxy::bridge: SHARE MEETS TARGET
```


## Config D: SV1 firmware > Translation Proxy JN (Job Negotiator) > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). In this case the tProxy is designed also to implement the **Job Negotiator (JN)** sub-protocol: allowing miners to select transaction locally and send them the **Pool-side JN**. 
In the following guide a Template Provider is installed locally on the same machine, to provide block templates to the JN.

![Config2](/assets/config-d.svg)

### 1. Install, setup and run local regtest **Template Provider**
> <ins>**Warning**</ins> <br>
> To setup a local Template Provider you need to run it from a <ins>**linux**</ins> machine (please use WSL in a Windows machine or a linux virtual machine).

Clone custom bitcoin repository which works as a Template Provider:
```
git clone https://github.com/Fi3/bitcoin
``` 
```
cd bitcoin/
```
```
./autogen.sh && ./configure
```
```
make check
```

Once regtest is installed in bitcoin/ directory:
```
git checkout AddHandleCoinbaseWitnessCommitmentHash
```
```
./src/bitcoind -regtest
```

Open another terminal without closing the previous one:
```
cd bitcoin/
```
```
./src/bitcoin-cli -regtest generatetoaddress 16 bcrt1qttuwhmpa7a0ls5kr3ye6pjc24ng685jvdrksxx
```

### 2. Start **Pool**

The **Pool** role in this configuration should be configured to point to the **local Template Provider**. In the `pool-config-local.toml` file you should see this: `tp_address = "127.0.0.1:8442"`.

```
cd stratum/roles/v2/pool/
```
```
cargo run -p pool_sv2 -- -c conf/pool-config-local.toml
```
> <ins>**Warning**</ins><br>
> If you couldn't get to run the local Template Provider from a **linux** machine, you can use our hosted TP, pointed from the `conf/pool-config-regnet-hosted.toml` file, by running: 
> ```
> cargo run -p pool_sv2 -- -c conf/pool-config-regnet-hosted.toml
> ```

If the pool properly starts you should see the following log lines:

```log
2023-03-21T17:59:36.345358Z  INFO pool_sv2: Pool INITIALIZING with config: "conf/pool-config-local.toml"
2023-03-21T17:59:36.345811Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 127.0.0.1:8442
2023-03-21T17:59:36.396456Z  INFO pool_sv2::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-03-21T17:59:36.397098Z  INFO pool_sv2::lib::mining_pool: PUB KEY: [TxOut { value: 5000000000, script_pubkey: Script(OP_PUSHBYTES_65 04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a OP_CHECKSIG) }]
2023-03-21T17:59:36.397138Z  INFO pool_sv2::lib::job_negotiator: JN INITIALIZED
2023-03-21T17:59:36.397288Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2023-03-21T17:59:36.397489Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```

### 3. Start **Translator (tProxy) JN**

Once the pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.
Differently from the Config C, in this case the **tProxy** will be acting as a **Job Negotiator (JN)**, so it will negotiate the block templates to mine on with the Pool-side JN.
```
cd stratum/roles/translator/
```
Within the `tproxy-config-JN.toml` you will be able to specify which pool should a translation proxy connect to. By default, the tProxy will connect to a locally hosted pool (which you deployed in the previous step). Feel free to switch the pools while testing things out.

If you're interested in learning about information in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

At this point, run the tProxy with:
```
cargo run -p translator_sv2 -- -c conf/tproxy-config-JN.toml
```

If the translator starts properly, you should see the following log lines:

```log
2023-03-21T18:00:21.933035Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2023-03-21T18:00:21.943083Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: SetupConnection { protocol: MiningProtocol, min_version: 2, max_version: 2, flags: 6, endpoint_host: Owned([48, 46, 48, 46, 48, 46, 48]), endpoint_port: 50, vendor: Owned([]), hardware_version: Owned([]), firmware: Owned([]), device_id: Owned([]) }
2023-03-21T18:00:21.944976Z  INFO translator_sv2::upstream_sv2::upstream: Up: Receiving: Sv2Frame { header: Header { extension_type: 0, msg_type: 1, msg_length: U24(6) }, payload: None, serialized: Some(Slice { offset: 0x7f1209a40010, len: 12, index: 1, shared_state: SharedState(128), owned: None }) }
2023-03-21T18:00:21.945252Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: OpenExtendedMiningChannel(OpenExtendedMiningChannel { request_id: 0, user_identity: Owned([65, 66, 67]), nominal_hash_rate: 5000000.0, max_target: Owned([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]), min_extranonce_size: 16 })
2023-03-21T18:00:21.945448Z  INFO translator_sv2: Connected to Upstream!
2023-03-21T18:00:21.947995Z  INFO translator_sv2::template_receiver: Template Receiver try to set up connection
2023-03-21T18:00:21.960164Z  INFO translator_sv2::job_negotiator: JN proxy: setupconnection Proxy address: 0.0.0.0:34255
2023-03-21T18:00:21.961975Z  INFO translator_sv2::job_negotiator: JN CONNECTED
2023-03-21T18:00:22.001951Z  INFO translator_sv2::template_receiver: Template Receiver connection set up
2023-03-21T18:00:22.002936Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2023-03-21T18:00:22.003367Z  INFO translator_sv2::upstream_sv2::upstream: Is future job: true

2023-03-21T18:00:22.003788Z  INFO translator_sv2::upstream_sv2::upstream: Up: Set New Prev Hash
2023-03-21T18:00:22.047521Z  INFO translator_sv2::template_receiver: Received SetNewPrevHash, waiting for IS_NEW_TEMPLATE_HANDLED
2023-03-21T18:00:22.047587Z  INFO translator_sv2::template_receiver: IS_NEW_TEMPLATE_HANDLED ok
2023-03-21T18:00:22.047985Z  INFO translator_sv2::upstream_sv2::upstream: Send custom job to upstream
```

### 4. Start SV1 CPU Miner

After starting a pool, and a translation proxy, let’s start a CPU miner. We’ve done tests with CPUMiner.

Setup the correct CPUMiner for your OS:
- You can download the binary directly from [here](https://sourceforge.net/projects/cpuminer/files/);
- Or compile it from [https://github.com/pooler/cpuminer](https://github.com/pooler/cpuminer)
   
Go into directory of the downloaded CPUMiner, for example: 
   ```
   cd Downloads/
   ```
Then run: 
   ```
   ./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P
   ```
This will connect to the translator proxy and speak sv1. If this is successful you should see the following output:

```log
[2023-03-21 19:00:55] DEBUG: job_id='1' extranonce2=0000000000000000000000000000 ntime=6419f077
[2023-03-21 19:00:55] Stratum requested work restart
[2023-03-21 19:00:56] DEBUG: hash <= target
Hash:   0000002e2ac168af2b3b0d4fdbfa3c47741534bd09e812fe696513c2126935ac
Target: 00000054ffab0000000000000000000000000000000000000000000000000000
[2023-03-21 19:00:56] > {"method": "mining.submit", "params": ["", "1", "0000000000000000000000000000", "6419f077", "dfeb0506"], "id":4}
[2023-03-21 19:00:56] < {"id":4,"error":null,"result":true}
[2023-03-21 19:00:56] accepted: 1/1 (100.00%), 482.27 khash/s (yay!!!)
```

Eventually, the Translation Proxy log output will show sucessful share, which means you've run the configuration successfully!

```log
2023-03-21T18:00:54.184601Z  INFO translator_sv2::downstream_sv1::downstream: PROXY SERVER - ACCEPTING FROM DOWNSTREAM: 127.0.0.1:60826
2023-03-21T18:00:54.184922Z  INFO translator_sv2::downstream_sv1::downstream: Down: Subscribing
2023-03-21T18:00:54.185661Z  INFO translator_sv2::downstream_sv1::downstream: Down: Authorizing
BITCOIN TARGET: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 127]
2023-03-21T18:00:56.991006Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: Sv2Frame { header: Header { extension_type: 32768, msg_type: 27, msg_length: U24(41) }, payload: Some(Mining(SubmitSharesExtended(SubmitSharesExtended { channel_id: 1, sequence_number: 0, job_id: 0, nonce: 3756721414, ntime: 1679421559, version: 805306368, extranonce: Owned([0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) }))), serialized: None }
2023-03-21T18:00:57.045007Z  INFO translator_sv2::template_receiver: Received SetNewPrevHash, waiting for IS_NEW_TEMPLATE_HANDLED
2023-03-21T18:00:57.049079Z  INFO translator_sv2::template_receiver: IS_NEW_TEMPLATE_HANDLED ok
```