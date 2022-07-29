# FRAME storage

There are 4 main layers of storage in substrate

- runtime storage api
- storage overlays
- patricia-merkle trie
- key-value database

In FRAME we only use:

- runtime storage api
- storage overlays

## Overlay Change Set

### Verify First, Write Last

This was the rule for all of FRAME development.

```rust
fn give_balance_to_bob(who: &[u8]) -> Result<(), ()> {
  sp_io::storage::set(who, &100u32.encode());
  if who != b"bob" {
    // Too late to return an error, change is already made
    return Err(());
  }

  Ok(())
}

#[test]
fn verify_first_write_last() {
  sp_io::TestExternalities::new_empty()...
}
```

### Transaction Storage

- can spawn new transactional layers
- helps us to prevent stuff entering storage

### Storage Layer by Default

- Storage layer is now default.

## FRAME Storage Keys

we follow a simple pattern:
```rust
hash(name) + hash(name2) + ...
```

## Pallet Name

The pallet name comes from the `construct_runtime!`.

## FRAME Storage Primitives

- StorageValue
- StorageMap
- CountedStorageMap
- StorageDoubleMap
- StorageNMap
