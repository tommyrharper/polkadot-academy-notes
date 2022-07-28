# SCALE codec
Simple Concatenated Aggregate Little-~Endian

A light-weight format which allows encoding and decoding which makes it suitable for highly resource constrained environments.

## Little-Endian

Store the least significant byte at the smallest memory address.

Wasm is a little endian system, which makes SCALE very performant.

## Why SCALE?

- Simple to define.
- Not Rust-specific but great in Rust
  - Easy to derive codec logic: `[#derive(Encode,  Decode)]`
  - Viable and useful for APIs like: `MaxEncodedLen` and `TypeInfo`
  - It does not use Rust `std` and thus can compile to Wasm `no_std`
- Consensus critical/bijective* one value will always encode to one blob and and that blob will only decode to that value.
- Supports a copy-free decode for basic types on LE architectures.
- It is about as thin and lightweight as can be.

## Scale vs JSON

```rust
use parity_scale_codec::{ Encode };

#[derive(Encode)]
struct Example {
  number: u8,
  is_cool: bool,
  optional: u8,
}
```

JSON:
```json
{ "number": 3, "is_cool": true, "optional": 69 }
// 42 bytes
```

SCALE:
```SCALE
[42, 1, 1, 69. 0, 0, 0]
<!-- 7 bytes -->
```

Scale just gives the raw data. It could be encoded in a million different ways

```
mkdir temp
cd temp
cargo init
cargo add parity-scale-codec --features derive
```

## Compact Integers

A "compact" or general integer encoding is sufficient for encoding large integers.

## Compact Prefix

- `0b00` for 0 to 63.
- `0b01` 64 -> some big number

## Limitations of Blockchains

- Memory
- Storage
- Computation



##  Questions

What is LE architecture?