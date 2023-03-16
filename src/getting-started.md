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

### 1. Start **Pool**

The Pool role should be configured to point to the hosted Template Provider. In the `pool-config.toml` file you should see this: `tp_address = "75.119.150.111:8442"` The default `pool-config.toml` should have appropriate defaults set up for everything else.

```
cd stratum/roles/v2/pool/
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

### 2. Start **Translator (tProxy)**

Once the pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.
```
cd stratum/roles/translator/
```
Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. By default, the tProxy will connect to a locally hosted pool (which you deployed in the first step, or default to a hosted Braiins pool in case you didn't). Feel free to switch the pools while testing things out.

If you're interested in learning about information present in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

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


## Config 2: SV1 firmware > Translation Proxy JN (Job Negotiator) > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). In this case the proxy is designed also to implement the **Job Negotiator (JN)** features: it's able to negotiate the block templates to mine on with the **Pool-side JN**. In this configuration, **transaction selection** is done by the miners locally (through the tProxy JN) and then negotiated with the pool.
In the following guide a Template Provider is installed locally on the same machine, to provide block templates to the JN.

Job Negotiator follow the specification on this page: [https://github.com/stratum-mining/sv2-spec/blob/main/06-Job-Negotiation-Protocol.md](https://github.com/stratum-mining/sv2-spec/blob/main/06-Job-Negotiation-Protocol.md) 


![Config2](/assets/config-d.svg)

For the **MVP2 release** the high level description is as follows:

1. **Proxy JN** connects with the **Pool JN**;
2. **Proxy JN** sends ***AllocateMiningJobToken*** message to the **Pool JN**;
3. **Pool JN** answers with a ***AllocateMiningJobToken.Success*** which contains an unique token to identify the job;
4. **Proxy JN** connects with its chosen **Template Provider**; 
5. **Template Provider** sends ***News Template*** and ***New PrevHash*** to the **Proxy**;
6. **Proxy JN** sends ***CommitMiningJob*** message to the **Pool** which contains data of the Template;
7. **Pool** answers ***CommitMiningJob.Success*** always [read the note];
8. Proxy sends to its miners SetCustomMiningJob and let the miners start mining and sending shares to the pool

> **Note:** All other messages that are needed to identify the template and the transactions by the pool are left to be done in MVP3 release. In MVP2 the pool accepts everything that the Proxy JN has chosen.

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

### 1. Install, setup and run local regtest **Template Provider**
Clone custom bitcoin repository which works as a Template Provider:
```
git clone https://github.com/Fi3/bitcoin
``` 
(linux only. Please use WSL in a Windows machine or a linux virtual machine)
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
```
hostname -I 
```
> **Warning** This will be the IP to be used in following Pool and tProxy configuration!


### 2. Start **Pool**

The **Pool** role should be configured to point to the **local Template Provider**. Check that in the `pool-config.toml` file the line with `tp_address = "127.0.0.1:8442"` is left uncommented. The default `pool-config.toml` should have appropriate defaults set up for everything else.
```
cd stratum/roles/v2/pool/
```
```
cargo run -p pool_sv2
```

If the pool properly starts you should see the following log lines:

```log
2023-03-13T15:59:41.863132Z  INFO pool_sv2: Pool INITIALIZING with config: "pool-config.toml"
2023-03-13T15:59:41.864050Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 127.0.0.1:8442
2023-03-13T15:59:41.914946Z  INFO pool_sv2::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-03-13T15:59:41.915250Z  INFO pool_sv2::lib::mining_pool: PUB KEY: [TxOut { value: 5000000000, script_pubkey: Script(OP_PUSHBYTES_65 04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a OP_CHECKSIG) }]
2023-03-13T15:59:41.915332Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2023-03-13T15:59:41.915582Z  INFO pool_sv2::lib::job_negotiator: JN INITIALIZED
2023-03-13T15:59:41.916142Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```

### 3. Start **Translator (tProxy) JN**

Once the pool is running, let's run the tProxy that will facilitate communication between the pool and a CPU miner.
Differently from the Config 1, in this case the **tProxy** will be acting as a **Job Negotiator (JN)**, so it will negotiate the block templates to mine on with the Pool-side JN.
```
cd stratum/roles/translator/
```
Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. By default, the tProxy will connect to a locally hosted pool (which you deployed in the first step, or default to a hosted Braiins pool in case you didn't). Feel free to switch the pools while testing things out.

If you're interested in learning about information in the configuration file, check [this document](https://github.com/stratum-mining/stratum/tree/main/roles/translator#configuration-file).

Modify `proxy.config.toml` (with nano or any other text editor):
1. In the "jn_address" add/change IP:PORT with the "listen_jn_address" found in stratum/roles/v2/pool/pool-config.toml
2. In the "tp_address" add/change IP:PORT with the TP IP:PORT. 
   Use the IP found in ***Install, setup and run regtest Template Provider section*** if you want to use bitcoind

At this point, run the tProxy with:
```
cargo run -p translator_sv2
```

If the translator starts properly, you should see the following log lines:

```log
2023-03-13T16:18:44.120903Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2023-03-13T16:18:44.130553Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: SetupConnection { protocol: MiningProtocol, min_version: 2, max_version: 2, flags: 6, endpoint_host: Owned([48, 46, 48, 46, 48, 46, 48]), endpoint_port: 50, vendor: Owned([]), hardware_version: Owned([]), firmware: Owned([]), device_id: Owned([]) }
2023-03-13T16:18:44.133562Z  INFO translator_sv2::upstream_sv2::upstream: Up: Receiving: Sv2Frame { header: Header { extension_type: 0, msg_type: 1, msg_length: U24(6) }, payload: None, serialized: Some(Slice { offset: 0x7fd71dc03010, len: 12, index: 1, shared_state: SharedState(128), owned: None }) }
2023-03-13T16:18:44.133770Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: OpenExtendedMiningChannel(OpenExtendedMiningChannel { request_id: 0, user_identity: Owned([65, 66, 67]), nominal_hash_rate: 10000000000.0, max_target: Owned([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]), min_extranonce_size: 16 })
2023-03-13T16:18:44.133977Z  INFO translator_sv2: Connected to Upstream!
2023-03-13T16:18:44.136622Z  INFO translator_sv2::template_receiver: Template Receiver try to set up connection
2023-03-13T16:18:44.145626Z  INFO translator_sv2::job_negotiator: JN proxy: setupconnection Proxy address: 0.0.0.0:34255
2023-03-13T16:18:44.147897Z  INFO translator_sv2::job_negotiator: JN CONNECTED
2023-03-13T16:18:44.186136Z  INFO translator_sv2::template_receiver: Template Receiver connection set up
2023-03-13T16:18:44.188127Z  INFO translator_sv2::job_negotiator::message_handler: Received allocate mining job token success message: SetCoinbase { token: 1, coinbase_output_max_additional_size: 100, coinbase_tx_prefix: Ref([]), coinbase_tx_suffix: Ref([]) }

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