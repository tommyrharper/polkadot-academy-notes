# XCM

1. XCM Communication Model
2. Basic Top-Level Format
3. XCVM Registers*
4. Basic XCVM Instructions
...


## XCM Communication Model

- It is **agnostic**. No assumption about the consensus system.
- It is **absolute**. Messages guaranteed to be delivered.
- **Asynchronous**: Does not assume sender will be blocking.
- **Asymmetric**: No results or callbacks (separately communicated!)

## Async vs Sync

Consensus systems are generally not in sync with external systems.

Cannot verify states of other consensus systems.

## XCM is "fire and forget"

XCM has no results:

- No errors reported to sender
- No callbacks for the sender
  - Similar to UDP (User Datagram Protocol) where are no responses

## Async XCM

We could make XCM sync but we do not because:
- Complexity, custom per sender/receiver pair
- Expense of operating in fee-based systems

When it comes to interpreting XCM messages, it is all up to the receiving consensus system.

## Basic top-level format

```rust
pub enum VersionXcm {
  /*
  Obsolete versions
  #[codec(index = 0)]
  V0(v0::Xcm),
  #[codec(index = 1)]
  V1(v1::Xcm),
  */
  #[codec(index = 2)]
  V2(v2::Xcm),
  #[codec(index = 3)]
  V3(v3::Xcm),
}
```

When we release a new XCM version, only the previous version is supported, those before that are eliminated.

## Basic XCVM Operation

XCVM operates via fetch-dispatch loop

## XCM vs Standard State Machine

- Error register
  - Not cleared when an XCM program completes effectively
- Error handler register
  - That is the code that you run when there is an error that has emitted during your XCM execution
  - Regardless of the results of your original XCM execution result, when the program completes, the error register is cleared. This ensure errors from the previous execution does not affect the next round.
- Appendix register
  - analogy: try-catch-finally block
    - whatever is in the finally block goes into the appendix register

## Kinds of XCM Instructions Recap

Four kinds of XCM instructions:
- Instruction
  - Result in a state change in the local consensus system
- Trusted Indication
  - The sender wants to recipient to trust that the sender has performed some state altering operation.
- Information
- System Notification
  - A System Notification instruction that notifies about transport protocol events
  - The underlying events that have happened during message passing
  - these instructions usually originate from the relay chain.

## Instruction

Split into a few categories:
- handle assets
- change the state of the XCVM registers
- report information back to the tsender 
- deal with version negotiation
- assert a certain condition of the xcvm
...

### Handle Assets

- Handle an Asset local assets only
- Transfer an Asset assets to another consensus system
- deal an Asset with asset locking

### Asset Instructions

```rust
enum Instruction {
  // instructions that handle local assets only
  WithdrawAsset(MultiAssets),
  DepositAsset { assets: MultiAssetsFilter, beneficiary: MultiLocation},
  TransferAsset { assets: MultiAssets, beneficiary: MultiLocation},
  // instructions that transfer assets to another consensus system
  InitiateReserveWithdraw { assets: MultiAssetFilter, reserve: MultiLocation, xcm: Xcm }, // not a trusted indication
  InitiateTeleport { assets: MultiAssetFilter, dest: MultiLocation, xcm: Xcm },
  // instructions that deal with asset locking
  // instructions that burn, recover or exchange specified assets
  ExchangeAsset { give: MultiAssetFilter, want: MultiAssets, maximal: bool  },
}
```

### Register State Change Instructions

```rust
enum Instruction {
  // instructions that modify the origin register
  AliasOrigin(MultiLocation),
  DescendOrigin(InteriorMultiLocation), // give a more restricted privilege level
  UniversalOrigin(Junction),
  // instructions that provide additional instructions to execute upon certain conditions
  SetErrorHandler(Xcm),
  SetAppendix(Xcm),
  // instructions that modify the topic register
  SetTopic([u8; 32]), // set a unique identifier for a flow of messages
  // instructions that modify the error register
  Trap(u64), // this fires off an error
  // instructions that modify the fees mode register
  SetFeesMode { jit_withdraw: bool }, // new in version 3
  // instructions that clears the specified register
  ClearTopic,
  ClearError,
  ClearOrigin,
  ClearTransactionStatus,
}
```

## Information Reporting Instructions

```rust
// telling the sender what the contents of the message is
enum Instruction {
  ReportError(QueryResponseInfo),
  ReportHolding { response_info: QueryResponseInfo, assets: MultiAssetsFilter },
  // report what the status is after we execute a transac instruction
  ReportTransactionStatus(QueryResponseInfo),
  // see whether the pallet exists on the recipient side
  QueryPallet { module_name: Vec<u8>, response_info: QueryResponseInfo },
}

// the dispatchable call function is an optional parameter that the XCM sender can specify acting as a lifecycle hook on the response
pub struct QueryResponseInfo {
  pub destination: MultiLocation,
  pub query_id: QueryId,
  pub max_weight: Weight,
}
```

Since XCM is configurable, blockchains that are not blockchain based, will they receive this QueryPallet, they will not respond to it at all.

## Version Negotiation Instructions


When it encounters a new destination that it hasn't seen before, it wil do a version negotiation to determine the XCM version it should be using.
```rust
enum Instruction {
  SubscribeVersion { query_id: QueryId, max}
  // If the sender was previously unscubscribed:
  UnsubscribeVersion...
}
```

## Assertion Instructions

```rust
enum Instruction {
  ExpectAsset(MultiAsset),
  ExpectOrigin(Option<MultiLocation>),
  ExpectError(Option<(u32, Error)>),
  // if the pallet does exist but doesn't conform to all of these specified fields then we just throw an expectation false error
  ExpectPallet { index: u32, name: Vec<u8>, module_name: Vec<u8>, crate_major: u32, min_create_number: u32 },
}
```

### Weight Payment Instructions

```rust
enum Instruction {
  RefundSurplus,
  // which assets used for the fee and the max payable
  // if the specified asset does not exist in holding or it is not a valid asset then an error is thrown
  // we take a fee from when the weight is too low to pay the fee
  BuyExecution { fee: MultiAsset, weight_limit: WeightLimit }
}
```

- All of this is actually in one single big `Instruction` enum.

## Subsystem Interaction Instructions

```rust
enum Instruction<Call> {
  // new in version 3, primarily used for when you are sending an xcm message across a bridge to another network
  ExportMessage { network: NetworkId, destination: InteriorMultiLocation, xcm: Xcm<()> },
  Transact { origin_kind: OriginKind, require_weight_at_most: u64, call: DoubleEncoded<Call> }
}
```

## Trusted Indication

```rust
enum Instruction {
  ReserveAssetDeposited(MultiAssets),
  ReceiveTeleportAsset(MulltiAssets),
  NoteUnlockable { asset: MultiAsset, owner: MultiLocation },
}
```

## Information

Offering some requested information that the local system is expecting

```rust
enum Instruction {
  // the local system may not be expecting a response from the sender
  // so the you need to check that this matches what the local system is expecting
  QueryResponse { query_id: QueryId, response: Response, max_weight: Weight, querier: Option<MultiLocation> }
}
```

## System Notification

```rust
enum Instruction {
  HrmpNewChannelOpenRequest { sender: u32, ... }
}
```

## common XCM patterns

```rust
Xcm(vec![
  WithdrawAsset(some_asset), // ReceiveTeleportedAsset(..) | ReserveAssetDeposited(..) | ClaimAsset {}..}
  ClearOrigin, // optional - prevents the subsequent instructions from getting the privileges of the origin
  BuyExecution { fee: some_asset, weight_limit: Unlimited }, // this is where we pay for the fees
  // ... the rest of the instructions
])
```

## XCM Errors

Error -register - set upon execution failure with `XcmError` variant Error handler register - if set, the XCM in the register is executed upon error.

The first item in the tuple represents the index of the instruction in your Xcm vec.
