# Advanced FRAME

# Runtime Migrations and Try Runtime

## When is a Migration Required?

Converting one value in the DB to another type

```rust
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
```

```rust
// old
pub struct Foo(u32)
// new
pub struct Foo(u64)
// or
pub struct Foo(i64)
// or
pub struct Foo(u16, u16)
```

This is a clear migration ^.

```rust
// old
pub struct Foo { a: u32, b: u32 }
// new
pub struct Foo { a: u32, b: u32, c: u32 }

```

This is a migration ^.

```rust
// old
pub struct Foo { a: u32, b: u32 }
// new
pub struct Foo { a: u32, b: u32, c: PhantomData<_> }

// If for whatever reason c has a type that is encoded like (), then no migration is necessary
```

This is not a migration ^.

```rust
// old
pub enum Foo { A(u32), B(u32) }
// new
pub enum Foo { A(u32), B(u32), C(u32) }
```

This is not a migration ^.

```rust
// old
pub enum Foo { A(u32), B(u32) }
// new
pub enum Foo { A(u32), C(u32), B(u32) }
```

This is a migration ^. => DON'T DO THIS!

```rust
// old
#[pallet::storage]
pub type FooValue = StorageValue<_, u32>;
// new
#[pallet::storage]
pub type BarValue = StorageValue<_, u32>;
```

This is a migration ^.

Fix to this:
```rust
// old
#[pallet::storage]
pub type FooValue = StorageValue<_, Foo>;
// new
#[pallet::storage_prefix = "FooValue"]
#[pallet::storage]
pub type ICanNowBeRenamed = StorageValue<_, Foo>;
```

This is not a migration ^.

## Writing Runtime Migrations

Once you upgrade a runtime, the code is expecting the data to be in a new format. Any `on_initialize` or transaction might fail decoding data, and potentially `panic!`.

We need a hook for this.

## Pallet Internal Migrations

One way to write a migration is to write it inside the pallet>

```rust
#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  // WARNING: this runs for every upgrade, you to remove this in order to avoid it to run again on the next upgrade.
  fn on_runtime_upgrade() -> Weight {
    migrate_stuff_and_things_here_and_there<T>();
  }
}
```

This approach is likely to be deprecated and is no longer protected.

If you execute `migrate_stuff_and_things_here_and_there` twice, then you are DOOMED!

```rust
#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    if guard_that_stuff_has_not_been_migrated() {
      migrate_stuff_and_things_here_and_there<T>();
    } else {
      // nada
    }
  }
}
```

## Pallet Internal Migrations

FRAME introduce macros to manage migrations: `#[pallet::storage_version]`

```rust
#[pallet::hooks]
impl<T: Config> Hooks<T::BlockNumber> for Pallet<T> {
  fn on_runtime_upgrade() -> Weight {
    let current = Pallet::<T>::current_storage_version();
    let onchain = Pallet::<T>::onchain_storage_version();

    if current == 1 && onchain = 1 {
      ...
    } else {
      ...
    }
  }
}
```

## Utilities in `frame-support`

- `translate` methods:
  - for `StorageValue`, `StorageMap`, etc.
- https://paritytech.github.io/substrate/master/frame_support/storage/migration/index.html
- But generally don't restrict yourself. There are lots of ways to write migration code.

## Testing Upgrades

It utilizes some the existing runtime apis, new api that allow you to do specific things such as run all my runtime upgrades.


