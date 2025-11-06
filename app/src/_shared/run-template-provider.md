#### Run Template Provider

Download the Template Provider from https://github.com/stratum-mining/sv2-tp/releases

Unpack the Template Provider. For example, in a new terminal tab, assuming you
downloaded `sv2-tp-1.0.3-x86_64-linux-gnu.tar.gz`:

```bash
tar xvf sv2-tp-1.0.3-x86_64-linux-gnu.tar.gz
```

Start the Template Provider

```bash
./sv2-tp-1.0.3/bin/sv2-tp -testnet4 -sv2port=8442 -debug=sv2
```

Optional parameters:

There are optional parameters which can be used to better manage the Template Provider:
- `sv2interval` - sets how often a new template is built (default is 30s)
- `sv2feedelta` - defines the delta fees to reach before sending new templates to downstreams (default is 1000 sats)
- `loglevel=sv2:trace` to get more detailed debugging

For example:

```bash
./sv2-tp-1.0.3/bin/sv2-tp -testnet4 -sv2 -sv2port=8442 -sv2interval=20 -sv2feedelta=1000 -debug=sv2 -loglevel=sv2:trace
```
This way new templates are constructed every 20 seconds (taking the most profitable txs from the mempool) and they are sent downstream if new fees collected are more than 1000 sats.

Startup options for the Template Provider can also be stored in `~/.bitcoin/sv2-tp.conf`.
