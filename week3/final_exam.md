# Final Exam

Due on Wednesday by noon.

Make something that puts all this stuff together.

- Create simple multi-token DEX.
  - You can use existing multi-asset pallet
  - Create a Uniswap style DEX to allow users to trustlessly exchange tokens with one another
    - Be sure to implement Liquidity rewards.
    - Expose an API which acts as a "price oracle" based on the existing liquidity pools.
  - Add a simple NFT pallet (like the kitties pallet we will do in class)
    - Allow users to mint or buy/sell new kitties with any token.
- Build a Quadratic voting system
  - Create a simple Identity pallet, or use the existing identity pallet.
  - Create a voting system where users with identities can reserve an amount of token, which then weights their vote on a quadratic scale.
  - Proposals should be a simple on chain text or hash, votes can be simply aye or nay.
  - As a bonus, create a more complex proposal system where users can vote on multiple things at once, and have to consider how they want to distribute their votes across them.
- Basic Direct Delegation Proof of Stake system:
  - A pallet which manages the DPoS System
    - Where one set of users can register to be a validator by providing a session key for Aura/BABE.
    - Where any user can use their tokens to delegate (vote) for the set of validators.
    - Where every N blocks, the current "winners" are selected, and Aura/BABE is updated.
    - As a bonus, try to support delegation chains, where you can back a delegator who themselves pick the validator
  - A pallet which gives block rewards to the current block producer.
    - As a bonus, you can think about and implement some kind of slashing for validators if they "misbehave".
- Build a Liquid Staking Protocol
  - Create a new pallet which interface with the existing `pallet-staking` and `pallet-democracy` (you might need to make some alterations to them).
  - For `pallet-staking`


You can bring your own idea. But find a TA who is willing to understand your idea and grade it.
- Write a UTxO runtime without frame?
- Tooling for Substrate / Polkadot / Parachains?
- Front-end development for existing tools in the space?
- Other ideas welcome.

Until Sunday the 31st to choose what you want to do.

## Grading 

- Implementation
  - Correctness and accuracy of implementation
  - Evidence of using various techniques used in class
  - As close to production ready as possible
- Code Quality
  - Tests and code coverage
  - Use of best practices and efficient code
  - Well documented, with considerations and compromises noted
- Bonus Points
  - Integrate this into a working node.
  - UX to interact with the runtime code.
    - Value functionality over beauty
  - Integrate node as a working parachain on a relay chain.
  - Working cross chain scenarios for your runtime logic using XCM and XCMP.


