---
pageHeading: Getting Started
---

# Getting Started with running SRI - Stratum V2 reference implementation

This document aims to assist users in deploying the SRI software stack efficiently. Stratum V2 as a protocol is flexible, and allows users to run multiple configurations. In the getting started guide, we’re focusing on running [roles](https://stratumprotocol.org/docs/#roles) which allow miners to construct their own block templates. 

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

**Objective**: Give Stratum V2 a try, mine blocks on the testnet with minimal setup.

- Community-hosted roles used: SV2 Pool, testnet Template Provider, and Job Declarator Server.
- Self-hosted roles to run: Job Declarator Client (JDC) and Translator Proxy.

### Step 1: Setup and Configuration

#### Clone the repository

```bash
git clone https://github.com/stratum-mining/stratum.git
cd stratum
```

#### Checkout the latest stable release

```bash
git tag --sort=version:refname | tail -1 | xargs git checkout
```

Alternatively, you can list all available tags and checkout a specific one:

```bash
git tag --sort=version:refname
git checkout v1.3.0  # Replace with the latest version shown
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

#### CPU Miner
If you don't have a physical miner, you can do tests with CPUMiner.

Setup the correct CPUMiner for your OS:
- You can download the binary directly from [here](https://sourceforge.net/projects/cpuminer/files/);
- Or compile it from [https://github.com/pooler/cpuminer](https://github.com/pooler/cpuminer)

On the CPUMiner directory:
 
`./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P`

#### Adjust proxy-config (optional)

Depending on mining device you do run, you may have to adjust `tproxy-config-local-jdc-example.toml` file in order to adjust the `min_individual_miner_hashrate` and `channel_nominal_hashrate` parameters accordingly


## II Getting Started - Running all roles 

**Objective**: Establish a complete, self-hosted Stratum V2 environment for comprehensive testing and deeper understanding of all components.

### Step 1: Setup and Configuration

#### Run Template Provider

Download a release from Sjors' fork of Bitcoin Core from https://github.com/Sjors/bitcoin/releases

Edit the `bitcoin.conf` file stored in `~/.bitcoin/` by adding:
```bash
[testnet4]
server=1
rpcuser=username
rpcpassword=password
```

Unpack the Template Provider. For example, assuming you downloaded `bitcoin-sv2-tp-0.1.15-x86_64-linux-gnu.tar.gz`:

```bash
tar xvf bitcoin-sv2-tp-0.1.15-x86_64-linux-gnu.tar.gz
```

⚠️ Note: macOS binaries are not code signed. Read release notes for instructions on how to proceed.

Start the Template Provider.

```bash
./bitcoin-sv2-tp-0.1.15/bin/bitcoind -testnet4 -sv2 -sv2port=8442 -debug=sv2 
```

⚠️ Note: you need to wait until `bitcoind` is fully synced with the testnet before you proceed.

Optional parameters:

There are optional parameters which can be used to better manage the Template Provider:
- `sv2interval` - sets how often a new template is built (default is 30s)
- `sv2feedelta` - defines the delta fees to reach before sending new templates to downstreams (default is 1000 sats)
- `loglevel=sv2:trace` to get more detailed debugging

For example: 

```bash
./bitcoin-sv2-tp-0.1.15/bin/bitcoind -testnet4 -sv2 -sv2port=8442 -sv2interval=20 -sv2feedelta=1000 -debug=sv2 -loglevel=sv2:trace
```
This way new templates are constructed every 20 seconds (taking the most profitable txs from the mempool) and they are sent downstream if new fees collected are more than 1000 sats. 

#### Clone the repository

```bash
git clone https://github.com/stratum-mining/stratum.git
cd stratum
```

#### Checkout the latest stable release

```bash
git tag --sort=version:refname | tail -1 | xargs git checkout
```

Alternatively, you can list all available tags and checkout a specific one:

```bash
git tag --sort=version:refname
git checkout v1.3.0  # Replace with the latest version shown
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
cargo run -- -c jdc-config-local-example.toml
```
#### Run Translator Proxy

```bash
cd roles/translator/config-examples/
cargo run -- -c tproxy-config-local-jdc-example.toml
```
#### Connect Mining Devices

Connect mining device - Translator Proxy will be running on port `34255`, so you will need just to edit your mining device(s) configuration, adding the line:

`stratum+tcp://<tProxy ip>:34255`
#### CPU Miner
If you don't have a physical miner, you can do tests with CPUMiner.

Setup the correct CPUMiner for your OS:
- You can download the binary directly from [here](https://sourceforge.net/projects/cpuminer/files/);
- Or compile it from [https://github.com/pooler/cpuminer](https://github.com/pooler/cpuminer)

On the CPUMiner directory:
 
`./minerd -a sha256d -o stratum+tcp://localhost:34255 -q -D -P`
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

If you didn’t change anything in the configuration files present in every role subdirectory, the valid block mined will be recognized by the string `Stratum V2 SRI Pool (0x5374726174756d2076322053524920506f6f6c)` inserted into the scriptSig of the coinbase tx input. 

A way to look for it is to check the address `tb1qa0sm0hxzj0x25rh8gw5xlzwlsfvvyz8u96w3p8` since the default coinbase output is configured to be a P2WPKH built with a public key = `036adc3bdf21e6f9a0f0fb0066bf517e5b7909ed1563d6958a10993849a7554075`

You can perform a search on one of the following block explorers:
- [mempool.space/testnet](https://mempool.space/testnet)
- [blockstream.info/testnet](https://blockstream.info/testnet/)

## IV Customizing configuration

### Customize the “pool_signature” string
To customize the string which is inserted into the `scriptSig` of the coinbase tx input, you need to run every role locally. To make changes, edit the `pool_signature` field present in:
- roles/pool/config-examples/pool-config-local-tp-example.toml
- roles/jd-client/config-examples/jdc-config-local-example.toml

Double check that the strings are equal and that you save your changes in both configuration files!

### Customize the coinbase tx output script
To customize the coinbase tx output script, you need to run every role locally. To make changes, edit the `coinbase_output` field present in:
- roles/jd-client/config-examples/jdc-config-local-example.toml
- roles/jd-server/config-examples/jd-server-config-local-example.toml

You can use any of the following script types:  P2PK,P2PKH, P2WPKH, P2SH, P2WSH, P2TR. 
In case a public key is required, as explained in the config files, you can start by creating a testnet wallet on mobile, using Green wallet, or a desktop one, using Electrum wallet, and extract the extended public key they provide. At this point, you can derive the child public key to use in the configuration files, [using this script](https://github.com/stratum-mining/stratum/tree/dev/utils/bip32-key-derivation).

## Community support

If you get any issue during testing phase, feel free to [join our community Discord](https://discord.gg/fsEW23wFYs) to get community support or file a [bug report on GitHub](https://github.com/stratum-mining/stratum/issues/new).
