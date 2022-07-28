# Traits

## trait Block, Header, Extrinsic

You should be well versed in reading such type aliases:
```rust
// Extract the hashing type for a block.
pub type HashFor<B> = <<B as Block>::Header as Header>::Hashing;
// Extract the number type for a block
pub type NumberFor<B> = <<B as Block>::Header as Header>::Number;
```

Or..

```rust
type BalanceOf<T, I> = <
  <T as Config<I>>::Currency
  as
  Currency<<T as frame_system::Config>::AccountId>
>::Balance;
```

## trait Get

A very basic, yet very substrate-idiomatic way to pass values through types.

```rust
pub trait Get<T> {
  fn get() -> T;
}

// very basic implementation
impl<T: Default> Get<T> for () {
  fn get() -> T {
    T::default()
  }
}
// for any T that itself has a default implementation
```

```rust
parameter_types! {
  pub const Foo: u32 = 10;
}

// expands to:
pub struct Foo;
impl Get<u32> for Foo {
  fn get() -> u32 {
    10
  }
}
```

## bounded

- `BoundedVec`, `BoundedSlice`, `BoundedBTreeMap`, `BoundedSlice`

```rust
#[cfg_attr(feature = "std", derive(Serialize), serde(transparent))]
#[derive(Encode)]
pub struct BoundedVec<T>(
  pub(super) Vec<T>,
  u8,
)
```

## trait Convert and Get example

```rust 
trait inputConfig {
  type MaximumSize: Get<usize>;
  type Impossibleconvertor: convertor<u64, u32>;
}

struct Pallet<T: Config> {
  fn foo() {
    let outcome: u32 = T::ImpossibleConvertor::convert(u64::max_value());
  }
}

struct Runtime
....
```

### Implementing Traits For Tuples

```rust
struct Module1;
struct Module2;
struct Module3;

trait OnInitialize {
  fn on_initialize(&self);
}

impl OnInitialize for Module1 { fn on_initialize(&self) {} }
impl OnInitialize for Module2 { fn on_initialize(&self) {} }
impl OnInitialize for Module3 { fn on_initialize(&self) {} }

fn main() {
  let x: Vec<Box<dyn OnInitialize>> = vec![
    Box::new(Module1),
    Box::new(Module2),
    Box::new(Module3),
  ];
}
```
Better:
```rust
struct Module1;
struct Module2;
struct Module3;

trait OnInitialize {
  fn on_initialize();
}

impl OnInitialize for Module1 { fn on_initialize() {} }
impl OnInitialize for Module2 { fn on_initialize() {} }
impl OnInitialize for Module3 { fn on_initialize() {} }

impl<T1: OnInitialize, T2: OnInitialize, T3: OnInitialize> OnInitialize for (T1, T2, T3) {

}

fn main() {
  let x: Vec<Box<dyn OnInitialize>> = vec![
    Box::new(Module1),
    Box::new(Module2),
    Box::new(Module3),
  ];
}

// impl_for_tuples!(OnInitialize);
#[impl_for_tuples(30)]
pub trait OnTimestampSet<Moment> {
  fn on_timestamp_set(moment: Moment);
}

// slightly more advanced
#[impl_for_tuples(30)]
impl OnRuntimeUpgrade for Tuple {
  fn on_runtime_upgrade...
}
```

## The `std` Paradigm

1. with `std`
2. otherwise `no_std`

```rust
#![cfg_attr(not(feature = "std"), no_std)]
```

```bash
error: duplicate lang item in crate sp_io (which frame_support depends on): panic_impl.
  |
  = Notes:
 the lang item is first defined in crate std (which serde depends on)

error: duplicate lang item in crate sp_io (which frame_support depends on): oom.
  |
  = Notes:
 the lang item is first defined in crate std (which serde depends on)
```

If you import something with the `std` you will get the above error.

### Adding dependencies

- tips
  - `SKIP_WASM_BUILD=1`
  - `.maintain/build-only-wasm.sh`

A subset of the standard types in rust that also exist in rust `core` are re-exported from `sp_std`.

## Logging And Prints In The Runtime

This can expensive in terms of space. The smaller the WASM the better.

The size of the WASM blob matters.

Any logging increases the size of the WASM.

```
wasm2wat polkadot_runtime.wasm > dump | ....
```

- `Debug` vs `RuntimeDebug`.
```rust
#[derive(RuntimeDebug)]
pub struct WithDebug {
  foo: u32,
  bar: u32,
}

impl ::core::fmt::Debug for WithDebug {
  fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
    #[cfg(feature = "std")]
    {
      fmt.debug_struct("WithRuntimeDebug")
        .field("foo", &self.foo)
        .field("bar", &self.bar)
        .finish()
    }
    {
      fmt.write("<wasm:stripped>")
    }
  }
}
```

Once types implement `Debug` or `RuntimeDebug` they can be printed. Various ways:

1. If you only want something in tests, native builds et:
```rust
sp_std::if_std! {
  println!("hello world!");
}
```
2. Or you can ...


Log statements have different levels:
1. Log statements are only evaluated if the corresponding level and target is met.
```rust
// only executed if `RUST_LOG=target=trace`
frame_support::log::trace!(target: "target", "({:?})"< (0..100000).into_iter().collect());
```

2. `disable-logging` compilation flag blocks all `sp-io` calls to do any logging. This is used in official polkadot releases.

In polkadot official release there is no logging.

## Arithmetic Helpers, and the f32, f64 Story

Floating point numbers have different standards, and slightly different implementations on different architectures and vendors.

### PerThing

We store ratios and such in the runtime with "Fixed-Point" arithmetic types.

```rust
implement_per_thing!(
  Percent,
  100u8,
  u8,
  "_Percent_"
);

let p = Perbill:from_part_parts(1_000_000_000u32 / 4);
let p = Perbill::from_percent(25);
```

## Fixed Point Numbers

`Per-thing` is great for representing [0, 1] range.

What if we need more?
```
100 ~ 1
```

## Fallibility

**Conversions** are very much fallible operations. so are things like addition, multiplication, division (all in std::ops, if keen on reading some rustdocs).

- Panic 
  - `u32::MAX * u32::MAX / 2` (in debug builds)
  - `100 / 0`
- Overflow

Use checked operations

1. Checked -- recover

```rust
if let Some(outcome = a.checked_mul(b) { ... } else { ... })
```

2. Saturating -- soft recovery

```rust
let certain_output = a.saturating_mul(b);
```

There's also `wrapping_op` and carrying_op` etc on all rust primitives, but not  quite relevant.

Rust is pretty strict for the primitive types.
- `TryInto` / `TryFrom` / `From<u32>` / `Into`

```rust
// T is u32 or larger.
struct Foo<T: From<u32>>

// T is u32 or smaller
struct Foo<T: Into<u32>>

// It can maybe be converted to u32
struct Foo<T: TryInto<u32>>

struct Foo<T: UniqueSaturatedInto<u32>>

assert_eq!(u128..)
```

## Defensive Programming

Defensive programming is a form of defensive design intended to ensure the continueing function of a piece of software under unforeseen circumstances. Defensive programming practices are often used where **high availability**, **safety**, or **security** is needed.

- You (almost) never want to panic in your runtime.
  - Hence you don't want to `.unwrap()?`
- be careful with implicitly unwraps in standard operations!
  - slice/vector indexing can panic if out of bound
  - `.insert`, `remove`
  - division by zero

When using operations that could panic, comment exactly above it why you are sure it won't panic.

```rust
let pos = announcements
  .binary_search(&announcement)
  .ok()
  .ok_or(Error::<T, I>::MissingAnnouncement)?;
// index coming from `binary_search`, therefor cannot panic.
```

Document when you have code that could panic.

```rust

let maybe_value: Option<_> = ...
if maybe_value.is_non() {
  return "..."
}

let value = maybe_value.expect("value checked to be 'Some'; qed");
```

The overall ethos of defensive programming is along the lines of:
```rust
// we have good reasons to believe this is Some.
let y: Option<_> = ...

// I am really really sure about this
let x = y.expect("hard evidence; qed");

// either return a reasonable default..
let x = y.unwrap_or(reasonable_default);

...
```

Defensive traits:
```rust
// either return a reasonable default
let x = y.defensive_unwrap_or(reasonable_default);

// or return an error
let x = y.defensive_ok_or(Error::DefensiveError)?;
```

