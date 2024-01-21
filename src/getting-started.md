---
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

```
cd roles/pool/
```
The `config-examples` directory contains configuration examples to be used by the party running the SV2 Pool (most typically the pool service provider) to address the most preferred customization.
To better understand and learn about information present in the SV2 Pool configuration files, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/v2/pool/README.md).

To run this configuration, for simplicity, you can point the SV2 Pool to our hosted Template Provider (testnet or regtest), commenting/uncommenting the corresponding lines in your `pool-config.toml`.
For example, if you want to use our **hosted testnet TP**, your config file should be like this:
```
cp config-examples/pool-config-hosted-tp-example.toml pool-config.toml
cat pool-config.toml
# SRI Pool config
authority_public_key = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"
authority_secret_key = "7qbpUjScc865jyX2kiB4NVJANoC7GA7TAJupdzXWkc62"
cert_validity_sec = 3600
test_only_listen_adress_plain =  "0.0.0.0:34250"
listen_address = "0.0.0.0:34254"

# list of compressed or uncompressed pubkeys for coinbase payout (only supports 1 item in the array at this point)
coinbase_outputs = [
    { output_script_type = "P2WPKH", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
]

# Pool signature (string to be included in coinbase tx)
pool_signature = "Stratum v2 SRI Pool"

# Template Provider config
# Local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
#tp_address = "127.0.0.1:8442"
# Hosted testnet TP 
tp_address = "75.119.150.111:8442"
```
   
Once your preferred config is set, you can run the SV2 Pool:
```
cargo run -- -c pool-config.toml
```
If the pool properly starts you should see the following log lines:
```log
2024-01-21T23:40:49.598914Z  INFO pool_sv2: Pool INITIALIZING with config: "pool-config.toml"
2024-01-21T23:40:49.942310Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 75.119.150.111:8442
2024-01-21T23:40:50.713814Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=0
2024-01-21T23:40:50.714082Z  INFO pool_sv2::lib::mining_pool: PUB KEY: Ok([TxOut { value: 0, script_pubkey: Script(OP_0 OP_PUSHBYTES_20 ebe1b7dcc293ccaa0ee743a86f89df8258c208fc) }])
2024-01-21T23:40:50.714247Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2024-01-21T23:40:50.714537Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
2024-01-21T23:40:51.076184Z  INFO roles_logic_sv2::handlers::template_distribution: Received NewTemplate with id: 28, is future: true
2024-01-21T23:40:51.076493Z  INFO roles_logic_sv2::handlers::template_distribution: Received SetNewPrevHash for template: 28
```

### 2. Start **Translator (tProxy)**

Once the SV2 pool is running, let's run the tProxy that will facilitate communication between the pool and a SV1 miner.\
In a new terminal:
```
cd stratum/roles/translator/
```
Just like in the `stratum/roles/pool` directory, the `config-examples` directory contains configuration examples to be used by the party running the SV2 Translator Proxy (most typically the mining farm/miner hobbyist) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/translator/README.md).

Within the `tproxy-config.toml` you will be able to specify which pool should a translation proxy connect to. For this specific configuration, the tProxy will connect to a locally hosted pool (which you deployed in the first step). Feel free to switch the pools while testing things out.
To run a Translator Proxy with the local Pool you just launched, for example, your config file should be like this:
```
cp config-examples/tproxy-config-local-pool-example.toml tproxy-config.toml
cat tproxy-config.toml 
# Braiins Pool Upstream Connection
# upstream_authority_pubkey = "u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt"
# upstream_address = "18.196.32.109"
# upstream_port = 3336

# Local SRI Pool Upstream Connection
upstream_address = "127.0.0.1"
upstream_port = 34254
upstream_authority_pubkey = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"

# Local Mining Device Downstream Connection
downstream_address = "0.0.0.0"
downstream_port = 34255

# Version support
max_supported_version = 2
min_supported_version = 2

# Minimum extranonce2 size for downstream
# Max value: 16 (leaves 0 bytes for search space splitting of downstreams)
# Max value for CGminer: 8
# Min value: 2
min_extranonce2_size = 8
coinbase_reward_sat = 5_000_000_000

# Difficulty params
[downstream_difficulty_config]
# hashes/s of the weakest miner that will be connecting
min_individual_miner_hashrate=5_000_000.0
# target number of shares per minute the miner should be sending
shares_per_minute = 6.0

[upstream_difficulty_config]
# interval in seconds to elapse before updating channel hashrate with the pool
channel_diff_update_interval = 60
# estimated accumulated hashrate of all downstream miners
channel_nominal_hashrate = 5_000_000.0
```
Once your preferred config is set, you can run the tProxy:
```
cargo run -- -c proxy-config.toml
```
If the translator starts properly, you should see the following log lines:

```log
2024-01-21T23:47:16.653365Z  INFO translator_sv2: PC: ProxyConfig { upstream_address: "127.0.0.1", upstream_port: 34254, upstream_authority_pubkey: Secp256k1PublicKey(XOnlyPublicKey(e76c2b09eed7baa394dbb794896e913c86a5f719ea803bc0a4aaa104383cee24ac5b32268edbcc58d105534c281f112f5e7a5c1ff0e2d113bd938dc7698e2cce)), downstream_address: "0.0.0.0", downstream_port: 34255, max_supported_version: 2, min_supported_version: 2, min_extranonce2_size: 8, downstream_difficulty_config: DownstreamDifficultyConfig { min_individual_miner_hashrate: 5000000.0, shares_per_minute: 6.0, submits_since_last_update: 0, timestamp_of_last_update: 0 }, upstream_difficulty_config: UpstreamDifficultyConfig { channel_diff_update_interval: 60, channel_nominal_hashrate: 5000000.0, timestamp_of_last_update: 0, should_aggregate: false } }
2024-01-21T23:47:16.655204Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2024-01-21T23:47:16.658890Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=100
2024-01-21T23:47:16.659007Z  INFO translator_sv2: Connected to Upstream!
2024-01-21T23:47:16.659499Z  INFO roles_logic_sv2::handlers::mining: Received OpenExtendedMiningChannelSuccess with request id: 0 and channel id: 2
2024-01-21T23:47:16.659523Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2024-01-21T23:47:16.659714Z  INFO roles_logic_sv2::handlers::mining: Received new extended mining job for channel id: 0 with job id: 112 is_future: true
2024-01-21T23:47:16.659750Z  INFO roles_logic_sv2::handlers::mining: Received SetNewPrevHash channel id: 2, job id: 112
2024-01-21T23:47:17.523726Z  INFO roles_logic_sv2::handlers::mining: Received new extended mining job for channel id: 2 with job id: 113 is_future: false
```

### 3. Start **SV1 Miner**
After starting a pool, and a translation proxy, let’s start a SV1 miner.
#### Physical ASIC miner
If you have a physical miner, setup is very easy since you just have to point your ASIC miner to the local tProxy which you deployed in the last step of this guide.
You can do it from your miner config, adding this line to your endpoints:
```
stratum+tcp://<tProxy ip>:34255
```
where `tProxy ip` is the ip address of the local machine which is running the tProxy.
#### CPU Miner
If you don't have a physical miner, you can do tests with CPUMiner.

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
* Connected to localhost (127.0.0.1) port 34255 (#0)
* Connection #0 to host localhost left intact
[2023-03-28 13:08:51] > {"id": 1, "method": "mining.subscribe", "params": ["cpuminer/2.5.1"]}
[2023-03-28 13:08:51] < {"id":1,"error":null,"result":[[["mining.set_difficulty","ae6812eb4cd7735a302a8a9dd95cf71f"],["mining.notify","ae6812eb4cd7735a302a8a9dd95cf71f"]],"000000000000000000000000000000010000000000000000000000000001",2]}
[2023-03-28 13:08:51] Stratum session id: ae6812eb4cd7735a302a8a9dd95cf71f
[2023-03-28 13:08:51] > {"id": 2, "method": "mining.authorize", "params": ["", ""]}
[2023-03-28 13:08:51] < {"id":2,"error":null,"result":true}
[2023-03-28 13:08:52] < {"method":"mining.set_difficulty","params":[0.03571428571428571]}
[2023-03-28 13:08:52] Stratum difficulty set to 0.0357143
[2023-03-28 13:08:52] < {"method":"mining.notify","params":["1","9973803c689d114202d8fa6e7a812464ec5968614898bef00000000800000000","02000000010000000000000000000000000000000000000000000000000000000000000000ffffffff25036e052500","ffffffff02dbd4250000000000434104466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278aac0000000000000000266a24aa21a9edf91da350df08181fe10fa729adb64397b97fcf1680d030db9ef9ad124423caa800000000",["2bfe0456baee2eff5f1fdcbcab78aab12c7313b012ac27363aa9798c274bd593","2d82a85bd4f3a555db28b11cfae0665c2f0217601756ea8d35936679425ec02a","cae46b308f58e509a0e55d13f232b8077cf20561096d843be0ac2aaa56d3a3b3","c9260f546d915dba514bb933ab06bb1337c544835c61c117fb20c6abb9ef6e45","fbae0b78208cb543bf8f25a5f616271e1671e44c0191b2d8b3c3bc6313f78b6a","d30f4074e3588d2f07c0d1dedcee893954cbbc6b2a6714b0ce915a58ca88fc27","e72cac419d4edfcd794343ac08805bf49db6f26970e49aab7351c53b8ae51e24","3a888db192e72c75ba383b9b73fe85cb1f423f8d935289e769a5229d73d545c1","761b4af369aaadd5180df680632a535060c350900aa7fedb1b5d4eb65a5da929","ae190c0907f7638fcbb9e46e0d9c2a85b916b9712616ffdea7179704ccd682b2","b702b7b8c1956699fe58d9570bdb75d7c0c87d78889d92abd7089ec2c57384c9","d0a5fb4f50c214775d9970972164105c3acbbf08a22576e6e91ccf70196ec2c1"],"20000000","1929ee8d","6422ca0e",true]}
[2023-03-28 13:08:52] DEBUG: job_id='1' extranonce2=0000 ntime=6422ca0e
[2023-03-28 13:08:52] Stratum requested work restart
[2023-03-28 13:08:54] DEBUG: hash <= target
Hash:   000000136077f7444332e7885526a371afdc00f17a08c9aa077fb845d6074536
Target: 0000001bffe40000000000000000000000000000000000000000000000000000
[2023-03-28 13:08:54] > {"method": "mining.submit", "params": ["", "1", "0000", "6422ca0e", "bd5c6540"], "id":4}
[2023-03-28 13:08:54] < {"id":4,"error":null,"result":true}
[2023-03-28 13:08:54] accepted: 1/1 (100.00%), 33963 khash/s (yay!!!)
```
Eventually, the Translation Proxy log output will show successful share, which means you've run the configuration successfully!

```log
2023-03-28T11:08:51.052292Z  INFO translator_sv2::downstream_sv1::downstream: PROXY SERVER - ACCEPTING FROM DOWNSTREAM: 127.0.0.1:50225
2023-03-28T11:08:51.052704Z  INFO translator_sv2::downstream_sv1::downstream: Down: Subscribing
2023-03-28T11:08:51.054303Z  INFO translator_sv2::downstream_sv1::downstream: Down: Authorizing
2023-03-28T11:08:54.552777Z  INFO roles_logic_sv2::utils: reduce_path: coinbase_id: [55, 0, 43, 216, 197, 11, 114, 249, 81, 1, 236, 139, 193, 183, 192, 161, 226, 175, 179, 206, 208, 147, 206, 20, 71, 31, 50, 216, 79, 177, 68, 0]
2023-03-28T11:08:54.553161Z  INFO translator_sv2::proxy::bridge: SHARE MEETS DOWNSTREAM TARGET
```


## Config D: SV1 firmware > Translation Proxy JD (Job Declarator) > SV2 Pool

This configuration allows mining devices running SV1 firmware to connect to an SV2 Pool through a Translation Proxy (tProxy). In this case the tProxy is designed also to implement the **Job Declarator (JD)** sub-protocol: allowing miners to select transactions locally and send them to the **Pool-side JDS (Job Declarator Server)**. 
In the following guide a Template Provider is installed locally on the same machine, to provide block templates to the JD.

![Config2](/assets/config-d.svg)

### 1. Install, setup and run local regtest **Template Provider**
> <ins>**Warning**</ins> <br>
> To setup a local Template Provider you need to run it from a <ins>**linux**</ins> machine (please use WSL in a Windows machine or a linux virtual machine).

Clone custom bitcoin repository which works as a Template Provider:
```
git clone https://github.com/Sjors/bitcoin.git
```

Check out the SV2 branch:
```
cd bitcoin/
git checkout 2023/11/sv2-poll
```

Build `bitcoind`:
```
make clean
./autogen.sh && ./configure 
make -j 10
```

Edit `bitcoin.conf` file by adding:
```
testnet=1
server=1
rpcuser=username
rpcpassword=password
```

Run the TP:
```
./src/bitcoind -sv2 -sv2port=8442 -debug=sv2 
```

Hint:  there are optional parameters which can be used to better manage TP:
- `sv2interval` which sets how often a new template is built (default is 30s)
- `sv2feedelta` which defines the delta fees to reach before sending new templates to downstreams (default is 1000 sats)
- `loglevel=sv2:trace` to get more detailed debugging

For example:
```
./src/bitcoind -sv2 -sv2port=8442 -sv2interval=2 -sv2feedelta=1000 -debug=sv2 -loglevel=sv2:trace
```

### 2. Start **SV2 Pool**

In a new terminal:
```
cd stratum/roles/v2/pool/
```

The `config-examples` directory contains configuration examples to be used by the party running the SV2 Pool (most typically the pool service provider) to address the most preferred customization.
To better understand and learn about information present in the SV2 Pool configuration files, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/v2/pool/README.md).

The **Pool** role in this configuration should be configured to point to the **local Template Provider** which you deployed in the first step of this guide. In the `pool-config.toml` file you should see the `tp_address = "127.0.0.1:8442"` line uncommented. The correct config file to exploit the local TP should be like this:
```
cp config-examples/pool-config-local-tp-example.toml pool-config.toml
cat pool-config.toml 
# SRI Pool config
authority_public_key = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"
authority_secret_key = "7qbpUjScc865jyX2kiB4NVJANoC7GA7TAJupdzXWkc62"
cert_validity_sec = 3600
test_only_listen_adress_plain =  "0.0.0.0:34250"
listen_address = "0.0.0.0:34254"

# List of coinbase outputs used to build the coinbase tx
# ! Right now only one output is supported, so comment all the ones you don't need !
# For P2PK, P2PKH, P2WPKH, P2TR a public key is needed. For P2SH and P2WSH, a redeem script is needed.  
coinbase_outputs = [
    #{ output_script_type = "P2PK", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2PKH", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2SH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    #{ output_script_type = "P2WSH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    { output_script_type = "P2WPKH", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
    #{ output_script_type = "P2TR", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
]

# Pool signature (string to be included in coinbase tx)
pool_signature = "Stratum v2 SRI Pool"

# Template Provider config
# Local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
tp_address = "127.0.0.1:8442"
# Hosted testnet TP 
# tp_address = "75.119.150.111:8442"
```

Once your preferred config is set, you can run the SV2 Pool:
```
cargo run -- -c pool-config.toml
```

If the pool properly starts you should see the following log lines:

```log
2024-01-21T23:55:49.701624Z  INFO pool_sv2: Pool INITIALIZING with config: "pool-config.toml"
2024-01-21T23:55:49.702476Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 127.0.0.1:8442
2024-01-21T23:55:50.032056Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=0
2024-01-21T23:55:50.032336Z  INFO pool_sv2::lib::mining_pool: PUB KEY: Ok([TxOut { value: 0, script_pubkey: Script(OP_0 OP_PUSHBYTES_20 ebe1b7dcc293ccaa0ee743a86f89df8258c208fc) }])
2024-01-21T23:55:50.032568Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2024-01-21T23:55:50.032958Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
2024-01-21T23:55:50.195377Z  INFO roles_logic_sv2::handlers::template_distribution: Received NewTemplate with id: 12140, is future: true
2024-01-21T23:55:50.195584Z  INFO roles_logic_sv2::handlers::template_distribution: Received SetNewPrevHash for template: 12140
2024-01-21T23:56:05.957257Z  INFO roles_logic_sv2::handlers::template_distribution: Received NewTemplate with id: 12141, is future: false
```

### 3. Start **Job Declarator Server**

Differently from the Config C, in this case the miner has the ability to choose their own Block Template. The pool service provider runs a Job Declarator Server (JDS), which negotiates templates on behalf of the pool.

Let's start JDS. In a new terminal::

```
cd stratum/roles/v2/jd-server
```

Just like in the other roles, the `config-examples` directory contains configuration examples to be used by the pool service provider running JDS.

The JDS in this case should be configured to point to the **local Template Provider** and the **local Pool** that you deployed in the previous steps. The correct `jds-config.toml` config file should look like this:
```
cp config-examples/jds-config-local-example.toml jds-config.toml
cat jds-config.toml 
# SRI Pool config
authority_public_key = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"
authority_secret_key = "7qbpUjScc865jyX2kiB4NVJANoC7GA7TAJupdzXWkc62"
cert_validity_sec = 3600

# List of coinbase outputs used to build the coinbase tx
# ! Right now only one output is supported, so comment all the ones you don't need !
# For P2PK, P2PKH, P2WPKH, P2TR a public key is needed. For P2SH and P2WSH, a redeem script is needed.  
coinbase_outputs = [
    #{ output_script_type = "P2PK", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2PKH", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2SH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    #{ output_script_type = "P2WSH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    { output_script_type = "P2WPKH", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
    #{ output_script_type = "P2TR", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
]

# SRI Pool JD config
listen_jd_address = "127.0.0.1:34264"
# RPC config for mempool (it can be also the same TP if correctly configured)
core_rpc_url =  "http://127.0.0.1"
core_rpc_port = 18332
core_rpc_user =  "username"
core_rpc_pass =  "password"
```

Once your preferred config is set, you can run the JDS:

```
cargo run -- -c jds-config.toml
```

If the JDS properly starts you should see the following log lines:

```log
2024-01-22T13:40:07.833458Z  INFO jd_server: Jds INITIALIZING with config: "jds-config.toml"
2024-01-22T13:40:07.833604Z  INFO jd_server::lib::job_declarator: JD INITIALIZED
```

### 4. Start **Job Declarator Client**

In order for the miner to be able to negotiate Block Templates, the miner also needs to run the Job Declarator Client (JDC).

Let's start JDC. In a new terminal:

```
cd stratum/roles/jd-client
```

Just like in the other roles, the `config-examples` directory contains configuration examples to be used by the miner running JDC.

The JDC in this case should be configured to point to the **local JDS** that you deployed in the previous steps. The correct `jdc-config.toml` config file should look like this:
```
cp config-examples/jdc-config-local-example.toml jdc-config.toml 
cat jdc-config.toml 
# SRI JDC config
downstream_address = "127.0.0.1"
downstream_port = 34265

# Version support
max_supported_version = 2
min_supported_version = 2

# Minimum extranonce2 size for downstream
# Max value: 16 (leaves 0 bytes for search space splitting of downstreams)
# Max value for CGminer: 8
# Min value: 2
min_extranonce2_size = 8

# Withhold
withhold = false

# Auth keys for open encrypted connection downstream
authority_public_key = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"
authority_secret_key = "7qbpUjScc865jyX2kiB4NVJANoC7GA7TAJupdzXWkc62"
cert_validity_sec = 3600

# How many time the JDC try to reinitialize itself after a failure 
retry = 10

# Template Provider config
# Local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
tp_address = "127.0.0.1:8442"
# Hosted testnet TP 
# tp_address = "75.119.150.111:8442"
tp_authority_pub_key = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"

# Solo Mining config
# List of coinbase outputs used to build the coinbase tx in case of Solo Mining (as last-resort solution of the pools fallback system)
# ! Put your Extended Public Key or Script as output_script_value !
# ! Right now only one output is supported, so comment all the ones you don't need !
# For P2PK, P2PKH, P2WPKH, P2TR a public key is needed. For P2SH and P2WSH, a redeem script is needed.  
coinbase_outputs = [
    #{ output_script_type = "P2PK", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2PKH", output_script_value = "0372c47307e5b75ce365daf835f226d246c5a7a92fe24395018d5552123354f086" },
    #{ output_script_type = "P2SH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    #{ output_script_type = "P2WSH", output_script_value = "00142ef89234bc95136eb9e6fee9d32722ebd8c1f0ab" },
    { output_script_type = "P2WPKH", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
    #{ output_script_type = "P2TR", output_script_value = "036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075" },
]

[timeout]
unit = "secs"
value = 1

# List of upstreams (JDS) used as backup endpoints
# In case of shares refused by the JDS, the fallback system will propose the same job to the next upstream in this list
[[upstreams]]
authority_pubkey = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"
pool_address = "127.0.0.1:34254"
jd_address = "127.0.0.1:34264"
# Pool signature (string to be included in coinbase tx)
pool_signature = "Stratum v2 SRI Pool"
 
# [[upstreams]]
# authority_pubkey = "2di19GHYQnAZJmEpoUeP7C3Eg9TCcksHr23rZCC83dvUiZgiDL"
# pool_address = "127.0.0.1:34254"
# jd_address = "127.0.0.1:34264"
# Pool signature (string to be included in coinbase tx)
# pool_signature = "Stratum v2 SRI Pool"
```

Once your preferred config is set, you can run the JDS:

```
cargo run -- -c jdc-config.toml
```

If the JDS properly starts you should see the following log lines:

```log
2024-01-22T13:59:21.834169Z  INFO jd_client::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2024-01-22T13:59:21.835277Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=110
2024-01-22T13:59:21.835305Z  INFO jd_client: Connected to Upstream!
2024-01-22T13:59:21.836175Z  INFO jd_client::job_declarator: JD proxy: setupconnection Proxy address: 127.0.0.1:34265
2024-01-22T13:59:21.836343Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=1
2024-01-22T13:59:21.836347Z  INFO jd_client::job_declarator: JD CONNECTED
2024-01-22T13:59:21.836354Z  INFO jd_client::downstream: Listening for downstream mining connections on 127.0.0.1:34265
2024-01-22T13:59:35.222702Z  INFO roles_logic_sv2::handlers::mining: Received SetNewPrevHash channel id: 3, job id: 3
```

### 3. Start **Translator (tProxy)**

Now, let's run the tProxy that will facilitate communication between the pool and a SV1 miner.

In a new terminal:
```
cd stratum/roles/translator/
```
Just like in other roles, the `config-examples` directory contains configuration examples to be used by the party running the SV2 Translator Proxy (most typically the mining farm/miner hobbyist) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/translator/README.md).

Within the `tproxy-config.toml` you will be able to specify which pool should a translation proxy connect to. For this specific configuration, the tProxy will connect to a locally hosted pool (which you deployed in the first step). Feel free to switch the pools while testing things out.
To connect a Translator Proxy with the local JDC you just launched, for example, your config file should be like this:
```
cp config-examples/tproxy-config-local-jdc-example.toml tproxy-config.toml
cat tproxy-config.toml 
# Braiins Pool Upstream Connection
# upstream_authority_pubkey = "u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt"
# upstream_address = "18.196.32.109"
# upstream_port = 3336

# Local SRI JDC Upstream Connection
upstream_address = "127.0.0.1"
upstream_port = 34265
upstream_authority_pubkey = "3VANfft6ei6jQq1At7d8nmiZzVhBFS4CiQujdgim1ign"

# Local Mining Device Downstream Connection
downstream_address = "0.0.0.0"
downstream_port = 34255

# Version support
max_supported_version = 2
min_supported_version = 2

# Minimum extranonce2 size for downstream
# Max value: 16 (leaves 0 bytes for search space splitting of downstreams)
# Max value for CGminer: 8
# Min value: 2
min_extranonce2_size = 8
coinbase_reward_sat = 5_000_000_000

# Difficulty params
[downstream_difficulty_config]
# hashes/s of the weakest miner that will be connecting
min_individual_miner_hashrate=10_000_000_000_000.0
# target number of shares per minute the miner should be sending
shares_per_minute = 6.0

[upstream_difficulty_config]
# interval in seconds to elapse before updating channel hashrate with the pool
channel_diff_update_interval = 60
# estimated accumulated hashrate of all downstream miners
channel_nominal_hashrate = 10_000_000_000_000.0
```

Once your preferred config is set, you can run the Translator Proxy:

```
cargo run -- -c tproxy-config.toml
```

If the Translator properly starts you should see the following log lines:

```log
2024-01-22T14:00:43.370226Z  INFO translator_sv2: PC: ProxyConfig { upstream_address: "127.0.0.1", upstream_port: 34265, upstream_authority_pubkey: Secp256k1PublicKey(XOnlyPublicKey(e76c2b09eed7baa394dbb794896e913c86a5f719ea803bc0a4aaa104383cee24ac5b32268edbcc58d105534c281f112f5e7a5c1ff0e2d113bd938dc7698e2cce)), downstream_address: "0.0.0.0", downstream_port: 34255, max_supported_version: 2, min_supported_version: 2, min_extranonce2_size: 8, downstream_difficulty_config: DownstreamDifficultyConfig { min_individual_miner_hashrate: 5000000.0, shares_per_minute: 6.0, submits_since_last_update: 0, timestamp_of_last_update: 0 }, upstream_difficulty_config: UpstreamDifficultyConfig { channel_diff_update_interval: 60, channel_nominal_hashrate: 5000000.0, timestamp_of_last_update: 0, should_aggregate: false } }
2024-01-22T14:00:43.371656Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34265
2024-01-22T14:00:43.374506Z  INFO roles_logic_sv2::handlers::common: Received SetupConnectionSuccess: version=2, flags=10
2024-01-22T14:00:43.374563Z  INFO translator_sv2: Connected to Upstream!
2024-01-22T14:00:43.375370Z  INFO roles_logic_sv2::handlers::mining: Received OpenExtendedMiningChannelSuccess with request id: 0 and channel id: 1
2024-01-22T14:00:43.375381Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2024-01-22T14:00:43.895656Z  INFO roles_logic_sv2::handlers::mining: Received new extended mining job for channel id: 1 with job id: 1 is_future: true
2024-01-22T14:00:43.895743Z  INFO roles_logic_sv2::handlers::mining: Received SetNewPrevHash channel id: 1, job id: 1
2024-01-22T14:00:49.574430Z  INFO roles_logic_sv2::handlers::mining: Received new extended mining job for channel id: 1 with job id: 2 is_future: false
2024-01-22T14:00:53.376930Z  INFO roles_logic_sv2::handlers::mining: Received SetTarget for channel id: 1
2024-01-22T14:00:53.376962Z  INFO translator_sv2::upstream_sv2::upstream: SetTarget: SetTarget { channel_id: 1, maximum_target: Ref([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]) }
```

### 5. Start **SV1 Miner**
After starting a pool, and a translation proxy, let’s start a SV1 miner.
#### Physical ASIC miner
If you have a physical miner, setup is very easy since you just have to point your ASIC miner to the local tProxy which you deployed in the last step of this guide.
You can do it from your miner config, adding this line to your endpoints:
```
stratum+tcp://<tProxy ip>:34255
```
where `tProxy ip` is the ip address of the local machine which is running the tProxy.
#### CPU Miner
If you don't have a physical miner, you can do tests with CPUMiner.

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
* Connected to localhost (127.0.0.1) port 34255 (#0)
* Connection #0 to host localhost left intact
[2023-03-28 14:18:11] > {"id": 1, "method": "mining.subscribe", "params": ["cpuminer/2.5.1"]}
[2023-03-28 14:18:11] 128 miner threads started, using 'sha256d' algorithm.
[2023-03-28 14:18:11] < {"id":1,"error":null,"result":[[["mining.set_difficulty","ae6812eb4cd7735a302a8a9dd95cf71f"],["mining.notify","ae6812eb4cd7735a302a8a9dd95cf71f"]],"000000000000000000000000000000010000000000000002",8]}
[2023-03-28 14:18:11] Stratum session id: ae6812eb4cd7735a302a8a9dd95cf71f
[2023-03-28 14:18:11] > {"id": 2, "method": "mining.authorize", "params": ["", ""]}
[2023-03-28 14:18:11] < {"id":2,"error":null,"result":true}
[2023-03-28 14:18:12] < {"method":"mining.set_difficulty","params":[0.0011655011655011655]}
[2023-03-28 14:18:12] Stratum difficulty set to 0.0011655
[2023-03-28 14:18:12] < {"method":"mining.notify","params":["1","ba521c4aba4886ca7319ba89333714504dbd4b2ea11a7b09295e6e046e1407e6","020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff2402f20000","ffffffff0200f2052a01000000434104466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278aac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000",[],"30000000","207fffff","6422d610",true]}
[2023-03-28 14:18:12] DEBUG: job_id='1' extranonce2=0000000000000000 ntime=6422d610
[2023-03-28 14:18:12] Stratum requested work restart
[2023-03-28 14:18:13] DEBUG: hash <= target
Hash:   000001b0a8b6be5c01c2e79656080eea652a30f49b5d04565ad923753dd9c811
Target: 00000359fca60000000000000000000000000000000000000000000000000000
[2023-03-28 14:18:13] > {"method": "mining.submit", "params": ["", "1", "0000000000000000", "6422d610", "1b4f00da"], "id":4}
[2023-03-28 14:18:13] < {"id":4,"error":null,"result":true}
[2023-03-28 14:18:13] accepted: 1/1 (100.00%), 171.09 khash/s (yay!!!)
```
Eventually, the Translation Proxy log output will show sucessful share, which means you've run the configuration successfully!

```log
2023-03-28T11:08:51.052292Z  INFO translator_sv2::downstream_sv1::downstream: PROXY SERVER - ACCEPTING FROM DOWNSTREAM: 127.0.0.1:50225
2023-03-28T11:08:51.052704Z  INFO translator_sv2::downstream_sv1::downstream: Down: Subscribing
2023-03-28T11:08:51.054303Z  INFO translator_sv2::downstream_sv1::downstream: Down: Authorizing
2023-03-28T11:08:54.552777Z  INFO roles_logic_sv2::utils: reduce_path: coinbase_id: [55, 0, 43, 216, 197, 11, 114, 249, 81, 1, 236, 139, 193, 183, 192, 161, 226, 175, 179, 206, 208, 147, 206, 20, 71, 31, 50, 216, 79, 177, 68, 0]
2023-03-28T11:08:54.553161Z  INFO translator_sv2::proxy::bridge: SHARE MEETS DOWNSTREAM TARGET
```
> <ins>**Warning**</ins> <br>
> If Translation Proxy log outputs something like:
> 
```log
2023-03-28T12:19:56.605826Z ERROR translator_sv2::proxy::bridge: Submit share error Ok("difficulty-too-low")
2023-03-28T12:19:56.606004Z ERROR translator_sv2::proxy::bridge: Make sure to set `min_individual_miner_hashrate` in the config file
```
> You have to stop the tProxy execution, edit the difficulty parameters in your `proxy-config.toml`, to better adjust them accordingly to your miner, and run it again!
