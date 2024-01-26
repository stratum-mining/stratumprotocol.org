---
pageHeading: Getting Started
---

# Getting Started with running SRI - Stratum v2 reference implementation

This document aims to assist users in deploying the SRI software stack efficiently. Stratum v2 as a protocol is flexible, and allows users to run multiple configurations. In the getting started guide, we’re focusing on running [roles](https://stratumprotocol.org/docs/#roles) which allow miners to construct their own block templates. 

![SRI ](/assets/Sri-AllRoles.png)

## Prerequisites

Rust installed on your machine. If it's not:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
There are two primary ways to use all roles:  

- Run certain roles and connecting to our community-hosted roles. (The easiest way to test SRI)
- Run all roles (Recommended way)

## I Getting Started - The easiest way

**Objective**: Give Stratum v2 a try, mine blocks on the testnet with minimal setup.

- Community-hosted roles used: SV2 Pool, testnet Template Provider, and Job Declarator Server.
- Self-hosted roles to run: Job Declarator Client (JDC) and Translator Proxy.

### Step 1: Setup and Configuration

#### Clone the repository

```bash
git clone https://github.com/stratum-mining/stratum.git
git checkout main
```
#### Run Job Declarator Client (JDC)
```bash
cd roles/jd-client/config-examples/
cargo run -- -c jdc-config-hosted-example.toml
```
#### Run Translator Proxy

```bash
cd roles/translator/config-examples/
cargo run -- -c tproxy-config-local-jdc-example.toml
```
#### Connect mining devices

Connect mining device - Translator Proxy will be running on port `34255`, so you will need just to edit your mining device(s) configuration, adding the line:

`stratum+tcp://<tProxy ip>:34255`

#### Adjust proxy-config (optional)

Depending on mining device you do run, you may have to adjust proxy-config file in order to adjust the min_individual_miner_hashrate and channel_nominal_hashrate parameters accordingly

You’re all set up, proceed to the `Final Step` section.

## II Getting Started - Running all roles 

**Objective**: Establish a complete, self-hosted Stratum V2 environment for comprehensive testing and deeper understanding of all components.

### Step 1: Setup and Configuration

#### Run Template Provider

Clone template provider repository:

```bash
git clone https://github.com/Sjors/bitcoin.git
```
Next, compile the template provider:

```bash
make clean
./autogen.sh && ./configure 
make -j 10
```
Edit the `bitcoin.conf`` file by adding:
```bash
testnet=1
server=1
rpcuser=username
rpcpassword=password
```
Run the Template provider:

```bash
./src/bitcoind -sv2 -sv2port=8442 -debug=sv2 
```
Optional paremeters:

There are optional parameters which can be used to better manage the Template Provider:
- `sv2interval` - sets how often a new template is built (default is 30s)
- `sv2feedelta` - defines the delta fees to reach before sending new templates to downstreams (default is 1000 sats)
- `loglevel=sv2:trace` to get more detailed debugging

For example: 

```bash
./src/bitcoind -sv2 -sv2port=8442 -sv2interval=2 -sv2feedelta=1000 -debug=sv2 -loglevel=sv2:trace
```
This way new templates are constructed every 2 seconds (taking the most profitable txs from the mempool) and they are sent downstream if new fees collected are more than 1000 sats. 

#### Clone the repository

```bash
git clone https://github.com/stratum-mining/stratum.git
git checkout master
```
#### Run the SV2 Pool

```bash
cd roles/pool/config-examples
cargo run -- -c pool-config-local-tp-example.toml
```
#### Run the Job Declarator Server (JDS)

```bash
cd roles/jd-server/config-examples
cargo run -- -c jds-config-local-example.toml
```
#### Run Job Declarator Client (JDC)

```bash
cd roles/jd-client/config-examples/
cargo run -- -c proxy-config-local-example.toml
```
#### Run Translator Proxy

```bash
cd roles/translator/config-examples/
cargo run -- -c proxy-config-local-jdc-example.toml
```
#### Connect mining devices

Connect mining device - Translator Proxy will be running on port `34255`, so you will need just to edit your mining device(s) configuration, adding the line:

`stratum+tcp://<tProxy ip>:34255`

## III Final Step: monitoring for blocks

Once set up, monitor the machines and role logs for any valid blocks found.

Following pictures detail the logs from tProxy, JDC, and Pool when a block is found.

Pool logs

![SRI Pool](/assets/SV2Pool-logs.png)

Job Declarator Client (JDC) logs

![SRI JDC](/assets/JobDeclaratorClient-JDC-logs.png)

Translation Proxy tProxy logs

![SRI tProxy](/assets/TranslationProxy-tProxy-logs.png) 

### Monitor for mined blocks on Testnet

If you didn’t change anything in the configuration files present in every role subdirectory, the valid block mined will be recognized by the string `Stratum v2 SRI Pool (0x5374726174756d2076322053524920506f6f6c)` inserted into the scriptSig of the coinbase tx input. 

A way to look for it is to check the address `tb1qa0sm0hxzj0x25rh8gw5xlzwlsfvvyz8u96w3p8` since the default coinbase output is configured to be a P2WPKH built with a public key = `036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075`

You can performa search on one of the following block explorers:
- https://mempool.space/testnet 
- https://blockstream.info/testnet/ 

## IV Customizing configuration

### Customize the “pool_signature” string
To customize the string which is inserted into the `scriptSig` of the coinbase tx input, you can change it by editing the `pool_signature` field present in:
- roles/pool/pool-config.toml
- roles/jd-client/jd-client-config.toml

Double check that the strings are equal and that you save your changes in both configuration files!

### Customize the coinbase tx output script
To customize the coinbase tx output script, edit the `coinbase_output` field present in:
- roles/pool/pool-config.toml
- roles/jd-server/jd-server-config.toml

You can use any of the following script types:  P2PK,P2PKH, P2WPKH, P2SH, P2WSH, P2TR. 
In case a public key is required, as explained in the config files, you can start by creating a testnet wallet on mobile, using Green wallet, or a desktop one, using Electrum wallet, and extract the extended public key they provide. At this point, you can derive the child public key to use in the configuration files, using the script we developed as SRI. Please have a look at https://github.com/stratum-mining/stratum/tree/dev/utils/bip32-key-derivation.

## Community support

If you get any issue during testing phase, feel free to [join our community Discord](https://discord.gg/fsEW23wFYs) to get community support or file a [bug report on GitHub](https://github.com/stratum-mining/stratum/issues/new).