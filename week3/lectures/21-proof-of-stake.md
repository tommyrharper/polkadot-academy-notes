# Proof of Stake

## NPoS: Assumptions

- Validators: those who wish to author blocks.
- Nominators/Delegators: Those who wish to support wanna-be authors.
- Validation and nomination intentions can change, therefore we need **periodic elections** to always choose the best validators + hold them slashable
- Every election period is called an **Era**, e.g. 24hrs in Polkadot.

## Solo-PoS

Authority-wanna-bees aka. validators bring their own stake. No further participation. Top validators are elected.

Problem?

Only people with the hardware that want power get in charge.

## Single-Delegation-PoS

Anyone can dilute themselves in any given validators. Top validator based on total stake are elected.

Problems?

There is a lot of wasted stake.

## Multi-Delegation-PoS

Your stake is divided 1/n among n validators.

## Nominated Proof of Stake

You name up to `N` nominees, an *arbitrary algorithm* computer either onchain or offchain, decides the **winners** and **how to distribute the stake among them**.
- Can optimize other criteria other than "who had more approval votes".
- Has a much higher chance to make sure staked tokens won't get wasted.

NPoS is **approval-based, multi-winner election**.

## NPoS Protocol Overview

1. Validator + Nominator **Snapshot**
   - Allows us to index stakers, not AccountIds.
   - Allows us to not need to "freeze" the staking system.
2. Signed Phase
   - Any signed account can come up with a **NPoS solution** based on that snapshot.
   - Deposits, rewards, slash, other game-theoretic tools incorporated to make it secure.
3. Unsigned Phase
   - As the first backup, any validators can also submit a solution as a part of their block authoring.
4. Fallbacks
   - If all of the above fails, the chain won't rotate validators and the governance can either:
     - dictate the next validator set
     - trigger an onchain election (limited in what it can do)

## Why NPoS?

1. Polkadot validators are the source of truth for the state transition of both the relay chain and all of the parachains + bridges.
2. Polkadot validators are assigned to parachains as back groups, and swapped over time.
3. Polkadot validators all author the same number of blocks.

What properties do we want a validator set to have for the above requirements?

### Election score

```rust
pub struct ElectionScore {
  // The minimal winner, in terms of total backing stake.
  // This parameter should be maximised.
  pub minimal_stake: u128,

  // The sum of the total backing of all winners.
  // This parameter should be maximised
  pub sum_stake: u128,

  // The sum squared of the total backing of all the winners, aka. the variance.
  // This parameter should be minimised.
  pub sum_stake_squared: u128,
}
```

TLDR: NPoS allows us to incentivise the formation of a validator set that optimised the aforementioned `ElectionScore`.

## NPoS Drawbacks

- Scalability

But we strive to get much better economic security measures in return. And solve the scalability in the mid-term too.

## Proportional Representation

We initially chose an algorithm called `Sequential Phragmen` which fulfulls proportional justified representation (PJR).

## NPoS Future

- First, repay any technical debt, make everything ready for any further scaling.
- Infra for multi-block election
  - Onchain
  - Offchain
- Staking/Election parachain
- More (tax) friendly/configurable reward payout.



## Other notes

So validators are not rewarded for having more than the minimum amount of stake.

The stake of the weakest polkadot validator is 1.7 million DOT.
