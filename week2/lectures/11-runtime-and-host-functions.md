# Runtime and host functions

Substrate asa whole is like an FPGA.
- The runtime is the HDL e.g. VHDL
- The client is the hardware i.e. the gate array.

The WASM is the **meta-protocol**.

- The runtime API
  - entry points into the runtime
- host functions
  - functions in the client that the wasm runtime can trigger

## Example: Block Execution - Takeaways

1. The client is in charge of storing state - the runtime is in charge of understanding it.

Because the runtime can change, so can the types.

2. The wasm of every block is part of the state of that block.

## Example: Runtime API

Some existing runtime APIs in Substrate include:
- Core - most important for executing blocks.
- TxQueue - tells the off-chain code whether a transaction is valid and how to prioritise it.
- BlockBuilder - critical for authoring nodes - for writing blocks.
- OffchainWorker - doing non-consensus tasks.
  - optional
- Metadata - We won't use it much today - to teach off-chain tools the structure of your storage and extrinsics
- Consensus related, aka - Accessors
- Testing

## Which Runtime APIs are "required"?

Depends on what that client wants to do. There is a core runtime API that all blockchains must have.

## Examples: Host Function

See some existing host functions in Substrate:
- Cryptography operations and hashing.
- IO
  - storage
  - print
- storage root.
  - this is the state root
- allocating memory.
- threads (experimental)
  - could be used for some computationally intense tasks.
    - e.g. a zero knowledge proof.

## Another Example: TransactionPool

Transaction Pool operations have NO SIDE EFFECTS -- No write host functions.

## Defining a Runtime API

```rust
// somewhere in common between client/runtime => substrate-primitive.
decl_runtime_apis! {
  pub trait Core {
    fn version() -> RuntimeVersion;
    fn execute_block(block: Block) -> bool;
    #[renamed("initialise_block", 2)]
    fn initialize_block(header: &<Block as BlockT>::Header);
  }
}

// somewhere in runtime code
impl_runteim_apis! {
  impl sp_api::Core<Block> for Runtime {
    fn version() -> RuntimeVersion { ... }
    fn execute_block(block: Block) -> { ... }
    fn initialize_block(header: &<Block as BlockT>::Header) { ... }
  }
}

// somewhere in the client code
let block_hash = "0xfff...";
let block = Block { ... };
// the block_hash refers to which blocks runtime to use. ???
let outcome: Vec<u8> = api.execute_block(block_hash, block).unwrap();
```

### Takeaways

- All runtime APIs are executed on top of a **specific block**. This is the implicit at parameter
- All api traits are generic over **Block**
- All runtime APIs return a `REsult<Vec<u8>, _>` where the inner `Vec<u8>` is the SCALE encoded value that we wanted to return. In some abstractions, they also auto-decode it, in some they don't.

## Defining a Host Function

```rust
//  somewhere in substrate primitives, almost always `sp_io`
#[runtime_interface]
pub trait Storage {
  fn get(&self, key: &[u8]) -> Option<Vec<u8>> {
    self.storage(key).map(|s| s.to_vec())
  }

  fn root() -> Vec<u8>
}

#[runtime_interface]
pub trait Hashing {
  fn blake2_128(data: &[u8]) -> [u8; 16] {
    sp_core::hashing::blake2_128(data)
  }
}

// somewhere in substrate runtime
let hashed_value = sp_io::storage::get(b"key")
  .and_then(sp_io::hashing::blake2_128)
  .unwrap();
```

## Considerations: Determinism

- All about **context**, but generally crucial.
- Core must be **absolutely deterministic**.
- BlockBuilder.. 🧐
- OffchainWorker.. 🤷

Host functions that mutate state (storage) must be deterministic.

## Considerations: Speed
Native is generally **faster than Wasm** (heavily depends on WASM execution type) but it has a **slow one-time delay**.

WASM call is kind of like io.

## Consideration: Types

The runtime and the client basically only talk to each other in opaque types, i.e. `Vec<u8>`. (scale encoded bytes)

## Considerations: Adding Host Function

Adding a host function that's not being used?
- NOPE!

Runtime requiring a host function?
- You must upgrade the clients first. A fork must happen.
- The old one must stay FOREVER!

## Substrate pull request tags

- `E4-newhostfunctions`

## Consideration: Runtime API Versioning

The runtime APIs of each runtime are explicitly defined.

The types (including the return types corresponding to that runtime API) are in the metadata.

It is *in principle* solved.

Not always in practice.

Rule of thumb: Every time you change the signature of a host function, i.e. change the input/output types, you need to think about this.







