# Dispatchables

`Call` is the part of the extrinsic that can be executed i.e. dispatched

```rust
struct Extrinsic {
  call: Call,
  signature_stuff: Option<_>,
}
```

## Dispatchables: Recap on `Call`

```rust
//  somewhere in your pallet, called my_pallet
#[pallet::call]
impl<T: Config> Pallet<T> {
  fn transfer(from: T::AccountId, to: T::AccountId, ... )
}

// expanded in your pallet
enum Call {
  transfer { from: T::AccountId, to: T::AccountId, ... }
}

// in your outer runtime
enum Call {
  System(frame_system::Call),
  MyPallet(my_pallet::Call),
}

// think about what this is:
Call::MyPallet(my_pallet::Call::transfer { ... }).encode()
```

## Dispatchables

Arguments can be anything that is encodeable.

```rust
#[derive(Decode)]
struct Foo {
  x: Vec<u32>,
  y: Option<String>,
}

#[pallet::call]
impl<T: Config> Pallet<T> {
  #[pallet::call_index(12)]
  #[pallet::weight(128_000_000)]
  fn dispatch(
    origin: OriginFor<T>,
    arg1: u32,
    #[pallet::compact] arg1_compact: u32,
    arg2: Foo,
  ) -> DispatchResult {
    let _ = ensure_none(origin)?;
  }
  ...
}
```

### Call Index

By default, **order of functions**, and pallets in `construct_runtime` MATTER.

Nowadays, you can overwrite both if needed.

```rust
#[pallet::call_index(5)]
fn dispatchable() {}

frame_support::contruct_runtime!(
  pub enum Runtime where
  {
    System: frame_system = 1,
    Example: pallet_template = 0,
  }
)
```

## Dispatchables: Weight

Weight = u64*

A measure of how much **resources** this dispatch is consuming, alongside more **static** information.

The **tx-fee** of a typical FRAME-based runtime is also partially a function of weight.

```
Weight, in itself, can be multi-dimensional, but for now assume it is one, and it represents time.
```

## Weight Examples

`#[weight]` attribute is technically a shorthand for:

```rust
type Weight = u64;

pub enum Pays {
  // Default, if you only provide a weight.
  Yes,
  No,
}

pub enum DispatchClass {
  // User operation, normal stuff
  Normal,
  // User operations that are useful for the chain: runtime upgrade etc.
  Operational,
  // Operations that MUST happen e.g. some hooks controller by pallets.
  Mandatory,
}
```

- Default `DispatchClass::Normal` ??

```rust
#[pallet::weight(128_000_000)]
fn dispatch(..) {..}

#[pallet::weight(128_000_000, DispatchClass::Mandatory)]
fn dispatch(..) {..}

#[pallet::weight(128_000_000, DispatchClass::Mandatory, Pays::No)]
fn dispatch(..) {..}

#[pallet::weight(128_000_000, Pays::Yes)]
fn dispatch(..) {..}

#[pallet::weight(T::some_weight())]
fn dispatch(..) {..}

#[pallet::weight(T::some_weight(a, b))]
fn dispatch(_: OriginFor<T>, a: u32, b: u32) {..}
```

## Block Limits: Length

A block is limited by:
- Length
- Weight

`5MB` limit.

Static/Stack size (`size_of` in `std::mem` - Rust) of the transactions need to be as small as possible.

Our transaction is composed of `enum Call`. What is the stack size of an `enum`?

For an enum the rust compiler must always store the size of the greatest variant on the stack:
```rust
struct ComplicatedStuff {
  who: [u8; 32],
  data: [u8; 1024],
}

enum Calls {
  Transfer(u32, [u8; 32], [u8; 32]),
  setCode(Vec<u8>),
  // Compiler will always assume it is this variant and reserve the corresponding amount of space
  // As this variant is the biggest
  Complicated(u32, ComplicatedStuff),
  // Change it to use Box:
  // Complicated(u32, Box<ComplicatedStuff>),
}
```

To get around this we can use a `Box` to take something off the stack and place it on the heap.


```rust
std::mem::size_of::<Vec<u8>>(); // 24
std::mem::size_of::<ComplicatedStuff>(); // 1056
std::mem::size_of::<Calls>(); // 72
// struct ComplicatedStuff {...}
```

Boxing reduces the allocation size on the stack.

## Block Limits TLDR

- `Weight` - measure of how much time (and other resources) are consumed, tracked in the system pallet.
- `Length` - Similarly
- `DispatchClass` - 3 opinionated categories of weight/length used in FRAME.
- `Pays` - is used by another (optional) pallet (transaction-payment) to charge for fees. The fee is a function of both the weight and other stuff.
- `Box` - useful utility to lessen the size of a `Call` enum.

## Origin

Where the message was coming from.

Immediately pass it to one of these functions:
- ensure_signed()
- ensure_none()
  - means ensure unsigned.
- ensure_root()
  - runtime needs to determine whether or not an origin is root or not.
  - root access can be used to give privileged access to certain functionality.
    - this can be a governance body or a democratic majority.
    - put ensure_root when you want some functionality controlled by governance
      - then use the `sudo-pallet` to implement the root stuff


## Return Type

```rust
type DispatchResult = Result<(), DispatchError>;
```

```rust
fn dispatch(origin: OriginFor<T>) -> DispatchResult {
  Ok(())
}

fn dispatch(origin: OriginFor<T>) -> DispatchResult {
  Err('stuff')
}
```

## Advanced Return Type

- There is also `DispatchResultWithPostInfo`.
  - This allows you to fix the weight of the function
    - Because normally you assume the worst weight if there are a number of possible branches
      - You can refund the user

```rust
pub struct PostDispatchInfo {
  // if set, this is the real consumed weight, else, whatever we set in pre-dispatch
  pub actual_weight: Option<Weight>
  //  if set, overwrite the previous weight
  pub pays_fee: Pays,
}
```

```rust
#[pallet::weight(worse_weight)]
fn dispatch(origin: OriginFor<T>) -> DispatchResultWithInfo {
  // stuff

  if condition {
    // early exit
    return Err(PostDispatchInfo {
      actual_weight: less_weight,
      ..Default::default()
    })
  }

  // recall `impl From<()> for PostDispatchInfo
  // For PostDispatchInfo you always need to finish with this syntax
  Ok(().into())
}

#[pallet::weight(more_weight)]
fn dispatch(origin: OriginFor<T>) -> DispatchResultWithInfo {
  // stuff
  Ok(Some(success_full_execution_weight).into())
}

#[pallet::weight(accurate_weight, Pays::Yes)]
fn dispatch(origin: OriginFor<T>) -> DispatchResultWithInfo {
  // useful dispatch, one time only, let's make it free.
  // this encourages people to do the useful thing
  Ok(Pays::No.into())
}

#[pallet::weight(worse_weight, Pays::Yes)]
fn dispatch(origin: OriginFor<T>) -> DispatchResultWithInfo {
  // ...
}
```

- Always assume the worse weight possible.

```md
An inaccurate weight will cause an **overweight** block. This could potentially cause blocks that exceed the desired block-time (forgiving in a solo-chain, not so much in a parachain).
```

### Questions

What is length?
