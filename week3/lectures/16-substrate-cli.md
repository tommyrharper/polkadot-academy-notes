# Unsure Again

## Building Specific Binaries

```
cargo build --release -p node-template
```

This will generate only the node-template binary. Much faster than building everything.

## Testing Specific Packages

```
[package]
name = "node-template-runtime"
```

```
cargo test -p node-template-runtime
```

This will run the tests just in the node-template-runtime library.

## Wasm Builder Environment Variables

Some useful environment varieable from the Wasm builder:
- `WASM_BUILD_DIR` - The directory where the wasm files are built.

```
SKIP_WASM_BUILD=1 cargo build --release
```

## Substrate Master Doesn't Compile?

Probably just need to:

```
rustup update
```

## CLI OUtput

```
./target/release/substrate --help
```

## Chain Specification

A JSON object which uniquely defines a blockchain.

Contains various metadata and the genesis state.

## Opinionated FRAME based JSON

```
./target/release/substrate build-spec --chain=dev > spec.json
```

## Raw Chain Spec

Totally un-opinionated. Just raw key-value pairs.

Keys are hexed.

```
./target/release/substrate build-spec --chain=dev --raw > spec.json
```

## Loading Chain Spec

```
./target/release/substrate --chain=spec.json
```

Some specs are included in the client binary:
from: `substrate/bin/node/cli/src/command.rs`

```rust
fn load_spec(&self, id: &str) -> std::result::Result<Box<dyn sc_service>>...
```

## Storage Trie Keys

We will learn how specifically keys are generated in the FRAME section.

But you can use tools like:

## Development Node

The common way to launch a test network:

```
./target/release/substrate --dev
```

## `--dev` Implications

- `--chain=dev`: Use the dev cahin spec.
- `--force-authoring`: Make blocks even if you are offline (not connected to any peers)
  - dangerous if on mainnet - other nodes will think you are high if you go offline.
- `--rpc-cors=all`: Allow any browser Origin to access the HTTP & WS RPC servers
- `--alice`: Shortcut for `--name Alice -- validator` with session keys for `Alice` added to keystore.
- `--tmp`: ...

## Development Accounts

e.g. `--alice`

- alice
- bob
- charlie
- dave
- eve
- ferdie

On a `--dev` these accounts are preseeded and given funds.

## Control Where Data is Stored

```
./target/release/substrate --dev --base-paths=./tmp/
```

This will result in:

- /tmp
  - /chains
    - /dev
      - /db
      - /network
      - /keystore

## Purge Chain DAta

Without specifying a `--base-path`, you amy not know where the blockchain data is being stored.

`purge-chain` sub-command can help with that.

## Database Stuff

```bash
--database
# choose the db
# Options: rocksdb, paritydb, paritydb-experimental, auto
--db-cache
# limit the memory the database cache can use in mib
```

## Execute as Native

```
--execution <STRATEGY>
  The execution strategy that should be used by all execution contexts
  [native, wasm, both, native-else-wasm]
```

```
./target/release/substrate --dev --execution=native
```

This could be used to have `println!`s in wasm code.

## Block Pruning

You can control how many finalised blocks to keep and the underlying block state.

```bash
--keep-blocks <COUNT>
# default is to keep all the data

--pruning <PRUNING_MODE>
# default is to keep the last 256 blocks
```

## RPC and WS

You probably want to control RPC and WS ports if you are launching multiple nodes on the same machine.

```bash
--rpc-port <PORT>
# specify http rpc server tcp port

--ws-port <PORT>
# specify ws rpc server tcp port
```

Bandwidth config:
```bash
--rpc-max-request-size ,RPC_MAX_REQUEST_SIZE>
```

## Unsafe RPC and WS Stuff

```bash
--rpc-methods <METHOD_SET>
# unsafe - exposes every RPC method
# safe only exposes a safe subset
# auto - acts as safe if RPC is served externally, otherwise is unsafe

--rpc-external
# listen to all RPC interfaces

--ws-external
# listen to all ws interfaces
```

## Enabling Logs

```bash
-l, --log <LOG_PATTERN>
# sets a custom logging filter
```

Same as `RUST_LOG` environment variable.

All `runtime` prefixed logs:

```bash
RUST_LOG=runtime=debug ./target/release/substrate --dev
```

All `runtime::staking` prefixed logs:

```bash
./target/release/substrate --dev --log=runtime::staking=debug
```

## Logs in the Code

Just an example of how you can add logs to the code:

```rust
pub(crate) const LOG_TARGET: &str = "runtime::staking";

// syntactic sugar for logging
#[macro_export]
macro_rules! log {
  ($level:tt, Spatter:expr)...
}
```

## Sync Flags

You can control hwo you sync yoru node:

```bash
--sync <SYNC_NODE>
# full - download and validate full blockchain history
# fast - download block and the latest state only.
# fast-unsafe - same as fast but skip downloading state proofs
# warp - download the latest state and proof.
```

## Transaction Pool Size

```bash
--pool-kbytes <COUNT>
# default 2000
```

## Cool IPFS STuff

Both Substrate and IPFS use LibP2P.

It is pretty easy to turn a Substrate node into an IPFS client.

```bash
--ipfs-server
# join the ipfs server
```
