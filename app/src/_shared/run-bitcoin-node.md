#### Run bitcoin node

Download Bitcoin Core v30 or newer from https://bitcoincore.org/en/download/

⚠️ Note: for macOS download the `.tar.gz` archive, because the `.zip` archive
only contains the GUI.

Unpack it, e.g. assuming you downloaded `bitcoin-30.0-x86_64-linux-gnu.tar.gz`:

```bash
tar xvf bitcoin-30.0-x86_64-linux-gnu.tar.gz
```

Edit or create the `bitcoin.conf` file stored in `~/.bitcoin/` by adding:
```bash
[testnet4]
server=1
rpcuser=username
rpcpassword=password
```

Start Bitcoin Core:

```sh
./bitcoin-30.0/bin/bitcoin -m node -testnet4 -ipcbind=unix
```

⚠️ Note: it's best to wait until `bitcoind` is fully synced with the testnet4 before proceeding.
