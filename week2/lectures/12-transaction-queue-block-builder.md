# Transaction Queue and Block Builder

- extrinsic
  - anything that comes from the outer world
    - Signed e.g. transaction
    - Unsigned extrinsics e.g. data from the outside world
    - Inherent Extrinsics

## Signed Extrinsics

- transactions
- signed and submitted by external accounts

## Unsigned Extrinsics

- extrinsics which are NOT signed in the standard way
- usually still requires a signature to be safe
- extra layers of programmability is provided to developers.

e.g. claim DOT Presale Tokens, I'm online

## Inherent Extrinsics

- data that is provided by block authors
- it may not be strictly deterministic
- "soft" verification by others

e.g. update the timestamp

All extrinsics must have some kind of check, else they are not sybil resistant.

## TxPool Tasks

- Validating and revalidating and banning transactions.
- Ordering transactions.
- It provides transaction submission and status updates via RPC.

## 1. Transaction Validation

Transaction validity is exclusively outside of the transaction pool and is 100% determined by the runtime.

Transaction validation should be static aka. cheap to perform.

This is done through the runtime API.

The runtime API:
```rust
impl TaggedTransactionQueue<Block> for Runtime {
  fn validate_transaction(
    ...
  ) -> TransactionValidity {
    ...
  }
}
```

Substrates transaction pool implementation makes it possible to apply different validation schemes depending on the source of the transaction.

Transactions can be received either by:
- peers
- local node

## Transaction Validation Banning

Once a certain transaction is discoverd to be invalid it is banned for a fixed duration of time.

## Transaction Ordering

The pool clusters validated transactions into two groups.
1. Ready: all of the requires tags of that transaction have already been seen by other ready transactions.
2. Future: some of the requires tags of that transaction have not yet been seen.


## Transaction ORdering

```rust
pool.import(Transaction {
  data: vec![1u8],
  requires: vec![],
  provides: vec![],
  ..Default::default(),
})

pool.ready().count() // 1
pool.future().count() // 0
```

common example: Wallet knows the current account nonce, and wants to submit a transaction for Alice.

This forces the transactions to be processed sequentially
```rust
requires: vec![(alice, current_nonce).encode()]
provides: vec![(alice, current_nonce + 1).encode()]
```

## Transaction Ordering

Once block authoring is happening we only look at the **Ready** subpool.
From that pool we take the transaction with the **highest priority** and repeat.
The pool orders based on:
1. priority
2. ttl: shortest longevity goes first.
3. time in the queue: longest to have waited goes first

## Bonus: A page in history

github.com/paritytech/substrate/issues/728


