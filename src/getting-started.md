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
cd stratum/roles/v2/pool/
```
The `pool-config-example.toml` is a configuration example which can be copy/paste into `/conf` directory by the party that is running the SV2 Pool (most typically the pool service provider) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/v2/pool/README.md).
```
cp pool-config-example.toml ./conf/pool-config.toml
```
```
cd conf/
```
To run this configuration, for simplicity, you can point the SV2 Pool to our hosted Template Provider (testnet or regtest), commenting/uncommenting the corresponding lines in your `pool-config.toml`.
For example, if you want to use our **hosted testnet TP**, your config file should be like this:
```
# SRI Pool config
authority_public_key = "2di19GHYQnAZJmEpoUeP7C3Eg9TCcksHr23rZCC83dvUiZgiDL"
authority_secret_key = "2Z1FZug7mZNyM63ggkm37r4oKQ29khLjAvEx43rGkFN47RcJ2t"
cert_validity_sec = 3600
test_only_listen_adress_plain =  "0.0.0.0:34250"
listen_address = "0.0.0.0:34254"
# list of compressed or uncompressed pubkeys for coinbase payout (only supports 1 item in the array at this point)
coinbase_outputs = [
    "04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a",
]

# Template Provider config
# local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
# tp_address = "127.0.0.1:8442"
# hosted testnet TP 
tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"
# hosted testnet TP 
# tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"

# SRI Pool JN config
listen_jn_address = "127.0.0.1:34264"
```
> <ins>**Warning**</ins><br>
> If you want to mine spendable bitcoin on regtest, you can do it with bitcoin-cli:
> 1. Get a legacy Bitcoin address:
>   ```
>   bitcoin-cli -regtest -rpcwallet="<PUT YOUR WALLET NAME HERE>" getnewaddress "test" "legacy"
>   ```
> 2. Retrieve its corresponding public key:
>   ```
>   bitcoin-cli -regtest getaddressinfo <PUT THE ADDRESS GENERATED HERE>
>   ```
> 3. Copy the pubkey showed in the output;
> 4. Paste it in the `coinbase_outputs` of `pool-config.toml`, after deleting the one which is already present;
> 5. Mine a block;
> 6. Generate 100 blocks: 
>   ```
>   bitcoin-cli -regtest generatetoaddress 100 bcrt1qc5xss0cma0zldxfzzdpjxsayut7yy86e2lr6km
>   ```
> Now the mined bitcoin are spendable!
   
Once your preferred config is set, you can run the SV2 Pool:
```
cargo run -p pool_sv2 
```
If the pool properly starts you should see the following log lines:
```log
2023-03-28T10:34:24.205288Z  INFO pool_sv2: Pool INITIALIZING with config: "pool-config.toml"
2023-03-28T10:34:24.279421Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 89.116.25.191:8442
2023-03-28T10:34:24.437363Z  INFO pool_sv2::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-03-28T10:34:24.437865Z  INFO pool_sv2::lib::mining_pool: PUB KEY: [TxOut { value: 5000000000, script_pubkey: Script(OP_PUSHBYTES_65 04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a OP_CHECKSIG) }]
2023-03-28T10:34:24.438053Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2023-03-28T10:34:24.438115Z  INFO pool_sv2::lib::job_negotiator: JN INITIALIZED
2023-03-28T10:34:24.438623Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```
> <ins>**Warning**</ins> <br>
> If you want to create more custom configs, you can save them in the same `conf/` directory.
> To run the specific custom config, you can do it by running:
> ```
> cargo run -p pool_sv2 -- -c [your-custom-config.toml]
> ```

### 2. Start **Translator (tProxy)**

Once the SV2 pool is running, let's run the tProxy that will facilitate communication between the pool and a SV1 miner.\
In a new terminal:
```
cd stratum/roles/translator/
```
The `proxy-config-example.toml` is a configuration example which can be copy/paste into `/conf` directory by the party that is running the Translator Proxy (most typically the mining farm/miner hobbyist) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/translator/README.md).
```
cp proxy-config-example.toml ./conf/proxy-config.toml
```
```
cd conf/
```
Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. For this specific configuration, the tProxy will connect to a locally hosted pool (which you deployed in the first step). Feel free to switch the pools while testing things out.
To run this configuration, for example, your config file should be like this:
```
# Braiins Pool Upstream Connection
# upstream_authority_pubkey = "u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt"
# upstream_address = "18.196.32.109"
# upstream_port = 3336

# Local SRI Pool Upstream Connection
upstream_address = "127.0.0.1"
upstream_port = 34254
upstream_authority_pubkey = "2di19GHYQnAZJmEpoUeP7C3Eg9TCcksHr23rZCC83dvUiZgiDL"

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

# JN config (optional), if set (uncommented) the tProxy starts on JN mode
# [jn_config]
# local pool JN (local pool must be run before tProxy to work)
jn_address = "127.0.0.1:34264"
# local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
tp_address = "127.0.0.1:8442"
# hosted testnet TP 
# tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"

# Difficulty params
[downstream_difficulty_config]
# hashes/s of the weakest miner that will be connecting
min_individual_miner_hashrate=5_000_000.0
# minimum number of shares needed before a mining.set_difficulty is sent for updating targets
miner_num_submits_before_update=5
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
cargo run -p translator_sv2 
```
If the translator starts properly, you should see the following log lines:

```log
2023-03-28T10:57:06.624837Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2023-03-28T10:57:06.650990Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: SetupConnection { protocol: MiningProtocol, min_version: 2, max_version: 2, flags: 4, endpoint_host: Owned([48, 46, 48, 46, 48, 46, 48]), endpoint_port: 50, vendor: Owned([]), hardware_version: Owned([]), firmware: Owned([]), device_id: Owned([]) }
2023-03-28T10:57:06.663001Z  INFO translator_sv2::upstream_sv2::upstream: Up: Receiving: Sv2Frame { header: Header { extension_type: 0, msg_type: 1, msg_length: U24(6) }, payload: None, serialized: Some(Slice { offset: 0x7f7b0c95b000, len: 12, index: 1, shared_state: SharedState(128), owned: None }) }
2023-03-28T10:57:06.663187Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: OpenExtendedMiningChannel(OpenExtendedMiningChannel { request_id: 0, user_identity: Owned([65, 66, 67]), nominal_hash_rate: 5000000.0, max_target: Owned([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]), min_extranonce_size: 8 })
2023-03-28T10:57:06.663286Z  INFO translator_sv2: Connected to Upstream!
2023-03-28T10:57:06.665887Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2023-03-28T10:57:06.666147Z  INFO translator_sv2::upstream_sv2::upstream: Is future job: true

2023-03-28T10:57:06.666208Z  INFO translator_sv2::upstream_sv2::upstream: Up: New Extended Mining Job
2023-03-28T10:57:06.666353Z  INFO translator_sv2::upstream_sv2::upstream: Up: Set New Prev Hash
```
> <ins>**Warning**</ins> <br>
> If you want to create more custom configs, you can save them in the same `conf/` directory.
> To run the specific custom config, you can do it by running:
> ```
> cargo run -p translator_sv2 -- -c [your-custom-config.toml]
> ```

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
Eventually, the Translation Proxy log output will show sucessful share, which means you've run the configuration successfully!

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
git clone https://github.com/stratum-mining/bitcoin.git 
``` 
```
git checkout last-tested-tp 
```
```
cd bitcoin/
```
```
./autogen.sh && ./configure --enable-template-provider
```
```
make check
```
> <ins>**Warning**</ins> <br>
> This is a very important command, don't forget to run it!
> You would have to do it <ins>every time you'll restart your local Template Provider.</ins>
```
rm -r ~/.bitcoin/regtest
```
Once installed, in bitcoin/ directory:
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

### 2. Start **SV2 Pool**
```
cd stratum/roles/v2/pool/
```
The `pool-config-example.toml` is a configuration example which can be copy/paste into `/conf` directory by the party that is running the SV2 Pool (most typically the pool service provider) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/v2/pool/README.md).
```
cp pool-config-example.toml ./conf/pool-config.toml
```
```
cd conf/
```
The **Pool** role in this configuration should be configured to point to the **local Template Provider** which you deployed in the first step of this guide. In the `pool-config.toml` file you should see the `tp_address = "127.0.0.1:8442"` line uncommented. The correct config file to exploit the local TP should be like this:
```
# SRI Pool config
authority_public_key = "2di19GHYQnAZJmEpoUeP7C3Eg9TCcksHr23rZCC83dvUiZgiDL"
authority_secret_key = "2Z1FZug7mZNyM63ggkm37r4oKQ29khLjAvEx43rGkFN47RcJ2t"
cert_validity_sec = 3600
test_only_listen_adress_plain =  "0.0.0.0:34250"
listen_address = "0.0.0.0:34254"
# list of compressed or uncompressed pubkeys for coinbase payout (only supports 1 item in the array at this point)
coinbase_outputs = [
    "04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a",
]

# Template Provider config
# local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
tp_address = "127.0.0.1:8442"
# hosted testnet TP 
# tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"
# hosted testnet TP 
# tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"

# SRI Pool JN config
listen_jn_address = "127.0.0.1:34264"
```
> <ins>**Warning**</ins><br>
> If you want to mine spendable bitcoin on regtest, you can do it with bitcoin-cli:
> 1. Get a legacy Bitcoin address:
>   ```
>   bitcoin-cli -regtest -rpcwallet="<PUT YOUR WALLET NAME HERE>" getnewaddress "test" "legacy"
>   ```
> 2. Retrieve its corresponding public key:
>   ```
>   bitcoin-cli -regtest getaddressinfo <PUT THE ADDRESS GENERATED HERE>
>   ```
> 3. Copy the pubkey showed in the output;
> 4. Paste it in the `coinbase_outputs` of `pool-config.toml`, after deleting the one which is already present;
> 5. Mine a block;
> 6. Generate 100 blocks: 
>   ```
>   bitcoin-cli -regtest generatetoaddress 100 bcrt1qc5xss0cma0zldxfzzdpjxsayut7yy86e2lr6km
>   ```
> Now the mined bitcoin are spendable!

Once your preferred config is set, you can run the SV2 Pool:
```
cargo run -p pool_sv2 
```
> <ins>**Warning**</ins><br>
> If you couldn't get to run the local Template Provider from a **linux** machine, you can use our hosted TP (testnet or regtest), commenting/uncommenting the corresponding lines in your `pool-config.toml`.

If the pool properly starts you should see the following log lines:

```log
2023-03-28T11:59:40.951579Z  INFO pool_sv2: Pool INITIALIZING with config: "pool-config.toml"
2023-03-28T11:59:40.952304Z  INFO pool_sv2::lib::template_receiver: Connected to template distribution server at 127.0.0.1:8442
2023-03-28T11:59:41.024149Z  INFO pool_sv2::lib::template_receiver::setup_connection: Setup template provider connection success!
2023-03-28T11:59:41.024398Z  INFO pool_sv2::lib::mining_pool: PUB KEY: [TxOut { value: 5000000000, script_pubkey: Script(OP_PUSHBYTES_65 04466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f276728176c3c6431f8eeda4538dc37c865e2784f3a9e77d044f33e407797e1278a OP_CHECKSIG) }]
2023-03-28T11:59:41.025534Z  INFO pool_sv2::lib::mining_pool: Starting up pool listener
2023-03-28T11:59:41.026100Z  INFO pool_sv2::lib::job_negotiator: JN INITIALIZED
2023-03-28T11:59:41.026343Z  INFO pool_sv2::lib::mining_pool: Listening for encrypted connection on: 0.0.0.0:34254
```
> <ins>**Warning**</ins> <br>
> If you want to create more custom configs, you can save them in the same `conf/` directory.
> To run the specific custom config, you can do it by running:
> ```
> cargo run -p pool_sv2 -- -c [your-custom-config.toml]
> ```

### 3. Start **Translator (tProxy) JD**

Once the SV2 pool is running, let's run the tProxy that will facilitate communication between the pool and a SV1 miner.
Differently from the Config C, in this case the **tProxy** will be acting as a **Job Declarator (JD)**, so it will select transactions locally and send them to the **Pool-side JDS**
```
cd stratum/roles/translator/
```
The `proxy-config-example.toml` is a configuration example which can be copy/paste into `/conf` directory by the party that is running the Translator Proxy (most typically the mining farm/miner hobbyist) to address the most preferred customization.
To better understand and learn about information present in the configuration file, check [this README](https://github.com/stratum-mining/stratum/blob/main/roles/translator/README.md).
```
cp proxy-config-example.toml ./conf/proxy-config.toml
```
```
cd conf/
```
Within the `proxy-config.toml` you will be able to specify which pool should a translation proxy connect to. For this specific configuration, the tProxy will connect to a locally hosted pool (which you deployed in the first step). 
> <ins>**Warning**</ins><br>
> To enable the JN sub-protocol, make sure that the `[jn_config]` line in `proxy-config.toml` is uncommented. If you couldn't get to run the local Template Provider from a **linux** machine, you can use our hosted TP (testnet or regtest), commenting/uncommenting the corresponding lines in your `proxy-config.toml`.

To run this configuration, your config file should be like this:
```
# Braiins Pool Upstream Connection
# upstream_authority_pubkey = "u95GEReVMjK6k5YqiSFNqqTnKU4ypU2Wm8awa6tmbmDmk1bWt"
# upstream_address = "18.196.32.109"
# upstream_port = 3336

# Local SRI Pool Upstream Connection
upstream_address = "127.0.0.1"
upstream_port = 34254
upstream_authority_pubkey = "2di19GHYQnAZJmEpoUeP7C3Eg9TCcksHr23rZCC83dvUiZgiDL"

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

# JN config (optional), if set (uncommented) the tProxy starts on JN mode
[jn_config]
# local pool JN (local pool must be run before tProxy to work)
jn_address = "127.0.0.1:34264"
# local TP (this is pointing to localhost so you must run a TP locally for this configuration to work)
tp_address = "127.0.0.1:8442"
# hosted testnet TP 
# tp_address = "89.116.25.191:8442"
# hosted regnet TP 
# tp_address = "75.119.150.111:8442"

# Difficulty params
[downstream_difficulty_config]
# hashes/s of the weakest miner that will be connecting
min_individual_miner_hashrate=5_000_000.0
# minimum number of shares needed before a mining.set_difficulty is sent for updating targets
miner_num_submits_before_update=5
# target number of shares per minute the miner should be sending
shares_per_minute = 6.0

[upstream_difficulty_config]
# interval in seconds to elapse before updating channel hashrate with the pool
channel_diff_update_interval = 60
# estimated accumulated hashrate of all downstream miners
channel_nominal_hashrate = 5_000_000.0
```
At this point, run the tProxy with:
```
cargo run -p translator_sv2
```

If the translator starts properly, you should see the following log lines:

```log
2023-03-28T12:16:03.130356Z  INFO translator_sv2::upstream_sv2::upstream: PROXY SERVER - ACCEPTING FROM UPSTREAM: 127.0.0.1:34254
2023-03-28T12:16:03.175910Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: SetupConnection { protocol: MiningProtocol, min_version: 2, max_version: 2, flags: 6, endpoint_host: Owned([48, 46, 48, 46, 48, 46, 48]), endpoint_port: 50, vendor: Owned([]), hardware_version: Owned([]), firmware: Owned([]), device_id: Owned([]) }
2023-03-28T12:16:03.177935Z  INFO translator_sv2::upstream_sv2::upstream: Up: Receiving: Sv2Frame { header: Header { extension_type: 0, msg_type: 1, msg_length: U24(6) }, payload: None, serialized: Some(Slice { offset: 0x7f50fe42a010, len: 12, index: 1, shared_state: SharedState(128), owned: None }) }
2023-03-28T12:16:03.178368Z  INFO translator_sv2::upstream_sv2::upstream: Up: Sending: OpenExtendedMiningChannel(OpenExtendedMiningChannel { request_id: 0, user_identity: Owned([65, 66, 67]), nominal_hash_rate: 5000000.0, max_target: Owned([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]), min_extranonce_size: 8 })
2023-03-28T12:16:03.179222Z  INFO translator_sv2: Connected to Upstream!
2023-03-28T12:16:03.182523Z  INFO translator_sv2::template_receiver: Template Receiver try to set up connection
2023-03-28T12:16:03.190738Z  INFO translator_sv2::job_negotiator: JN proxy: setupconnection Proxy address: 0.0.0.0:34255
2023-03-28T12:16:03.192886Z  INFO translator_sv2::job_negotiator: JN CONNECTED
2023-03-28T12:16:03.232878Z  INFO translator_sv2::template_receiver: Template Receiver connection set up
2023-03-28T12:16:03.233755Z  INFO translator_sv2::upstream_sv2::upstream: Up: Successfully Opened Extended Mining Channel
2023-03-28T12:16:03.234006Z  INFO translator_sv2::upstream_sv2::upstream: Is future job: true

2023-03-28T12:16:03.234211Z  INFO translator_sv2::upstream_sv2::upstream: Up: Set New Prev Hash
2023-03-28T12:16:03.284539Z  INFO translator_sv2::template_receiver: Received SetNewPrevHash, waiting for IS_NEW_TEMPLATE_HANDLED
2023-03-28T12:16:03.285990Z  INFO translator_sv2::template_receiver: IS_NEW_TEMPLATE_HANDLED ok
2023-03-28T12:16:03.287963Z  INFO translator_sv2::upstream_sv2::upstream: Send custom job to upstream
```
> <ins>**Warning**</ins> <br>
> If you want to create more custom configs, you can save them in the same `conf/` directory.
> To run the specific custom config, you can do it by running:
> ```
> cargo run -p translator_sv2 -- -c [your-custom-config.toml]
> ```

### 4. Start **SV1 Miner**
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
