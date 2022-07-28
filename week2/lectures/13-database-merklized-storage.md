# Database and Merklized Storage

Storage access is one of the slowest things.

It is the no.1 thing you will want to optimise.

## Storage Layers

From high to low level:
- Runtime Storage API
- Storage Overlays
- Patricia-Merkle Trie
- Key-Value Database

In more detail:
- Runtime Storage API
  - exposed to the runtime via `sp-io`
  - can write to storage with a given key and value
- Storage Overlays
  - In-memory representation of 
  - transactional overlay
    - you can decide whether to commit
- Patricia-Merkle Trie
  - data structure on top of KVDB
  - Arbitrary Key and Value length
  - Nodes are Branches or Leaves
- Key-Value Database
  - Implemented with RocksDB and ParityDB
  - Just KV mapping: Hash -> Vec<u8>
  - Substrate: Blake2 256

## Base 16

Nice choice because it is 1/2 of a byte (two hex characters)

One hex character is a "nibble"

## Merkle Trie Complexity

Reading: O(logn) reads to get a single value - no so great
Writing: O(logn) reads, hashes and writes

## Pruning

- For holding older block states, and the cleaning up.
- We create new database entries but keep the old ones too.

## Unbalanced tree

This can be a good thing, done to keep some piece of data easily/efficiently accessible.
- i.e. `:code`



