# Exotic Stuff

## Nested Errors

Errors support up to 5 bytes, which allows you to create nested errors, or insert other minimal data with the `PalletError` derive macro.

```rust
#[derive(Encode, Decode, PalletError, TypeInfo)]
pub enum SubError {
  SubError1,
  SubError2,
  SubError3,
}

use frame_system::pallet::Error as SystemError;

#[pallet::error]
pub enum Error<T> {
  // There is currently no owner set
  NoOwner,
  // asdfasd
  NotAuthorized,
  // errors coming from another place
  SubError(SubError),
  // Errors coming from another palce
  SystemError(SystemError<T>),
  ...
}
```

## Events

When an extrinsic completes successfully, there is often some metadata you would like to expose to the outside world about what exactly happened during the execution.

For example, there may be multiple different ways an extrinsic completes successfully, and you want the user to know what happened.

Or maybe there is some significant state transition that you know users want to be aware of.

Front-ends are often driven by blockchain events.

## Declaring and Emitting Events

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
  // because
  type...
}
```

## Deposit Event

```rust
#[pallet::generate_deposit(pub(super) fn deposit_event)]
```

generates:
```rust
impl<T: Config> Pallet<T>...
```

An event are storage items in the FRAME system, which is an unbounded list of events.
NEVER read the events.

## Using Events in Tests

```rust
#[test]
fn events_example() {
  new_test...(|| {
    let events = ...
    ...
  })
}
```

- Events and Errors are two ways you can signal to users what is happening when they dispatch an extrinsic.
- Events usually signify some successful thing happening.
- Errors signify when something has gone bad (and all changes reverted).
- Both are accessible by the end user when they occur.

## Outer Enum

In this presentation, you will learn about a common pattern used throughout FRAME.

## Enums in FRAME

4 main enums:
- Call
- Event
- Error
- Origin

### Breaking it down

```rust
#![allow(non_camel_case_types)]
#![allow(dead_code)]

use parity_scale_codec::Encode;

mod balances {
  use crate::*;

  #[derive(Encode)]
  pub enum Call {
    transfer { to: AccountId, amount: Balance },
    transfer_all { to: AccountId}
  }

  #[derive(Encode)]
  pub enum Error {
    DuplicateSomething
  }
}

impl into<DispatchError> for Error {
  fn into(self) -> DispatchError {
    DispatchError::Module(
      ModuleError {
        pallet: runtime::Runtime::Staking...
      }
    )
  }
}

// Similar to sp-runtime
mod runtime_primitives {
  use crate::*;
  ...
}

mod runtime {
  use create::*;

  #[derive(Encode)]
  pub enum PalletIndex {
    Balances = 0,
    Democracy = 1, 
    Staking = 2,
  }

  #[derive(Encode)]
  pub enum Call {
    BalancesCall(balances::Call),
    DemocracyCall(democracy::Call),
    StakingCall(balances::Call),
  }

  #[derive(Encode)]
  pub enum Event {
    BalancesEvent(balances::Event),
    DemocracyEvent(democracy::Event),
    // No staking events
  }

  // image this for all of the possible types above...
  impl Into<Event> for balances::Event {
    fn into(self) -> Event {
      Event::BalancesEvent(self)
    }
  }

  // image this for all of the possible types above...
  impl TryFrom<Event> for balances::Event {
    type Error = ();

    fn try_from(outer: Event) -> Result<Self, ()> {
      ...
    }
  }
}
```

## Outer Enu Encoding

This now explains how all the different runtime types are generally encoded!

```rust
fn main() {
  let democracy_call = democracy::Call::propose { proposal_hash: [7u8; 32] };
  println!("Pallet Call: {:?}", democracy_call.encode());
}
```

## Using Outer Enums

The path for using outer enums can be a bit confusing.
- The types which compose the outer enum come from pallets.
- They are aggregated in the runtime.
- They can be passed BACK to the pallets and used in pallet logic through associated types.

## System Aggregated Associated Types

You can see these aggregate types are associated types in FRAME system.

```rust
// system configuration trait. Implemented by runtime.
#[pallet::config]
...
```

## Pallet Events

```rust
pub trait Config: frame_system::Config {
  type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
}
```

## Other notes

- Outer means runtime
- Inner means pallet
