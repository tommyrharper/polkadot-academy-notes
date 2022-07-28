# Core QA

There is a problem where you obviously don't know want parachain to be to have 100k nodes and asking the approval checkers for the check.

whoever is doing the check needs to provide a proof that they have an upcoming block. Possible with Oura, BABE, sasafras. Impossible with Proof of Work.  We need this functionality elsewhere in the system to prove you have an upcoming block.

The problem is to always make it reliable.

There are some variations on XCMP, and it remains to be seen which one we want to implement.

Proof of Work Parachains - how widely accepted is it? With PoW it is hard to prove you will have an upcoming block, so it doesn't integrate with the Polkadot system.

We use VRFs in approvals. Nothing that needs half way decent randomness with PoW. Ethereum can do this in a very clever way. At it's core it is DDOS attack papered over by really shitty economics.

IS there any way to secure a bridge, to add another security layer that be between two separate chains.

The chains can't really trust each other, but the users can choose to trust both chains.

Can we explain again the limitations of increasing block time on a parachain? You will miss a bunch of opportunities to create blocks. That minute will happen due to approvals, you have to wait a minute for the guys who initially say that they signed the thing to check it, if those people don't show up. We probably wouldn't let a customer parachain do that. Having certain blocks once per month to allow a parachain to upgrade it's runtime. A few different upgrade strategies - atm every validator compiles the code. It can go wrong as if we are depending on the availability system, the roots could be corrupted, at the moment what happens is we just make every validator compile it. For upgrades every validator compiles it ahead of time, signs a message saying I successfully compiled it, once all the validators sign they can upgrade.

- Pure mathematician - Jeff

There are things where you want ZK, maybe it makes sense to use something like this, reuse the proof a bunch of times.

The total number of validators who have to see the parachain block is not that large. We only have like 40ish guys checking. You have to analyse this somewhere.

Could you go over the approvals?

The archetype of approvals is the validators will check whoever they feel like. If we use that model, then the bad guy can just go and check.

We want VRFs to figure who checks which parachain blocks. We have a relay chain block and a relay chain block. We have this notion of t

When the relay chain block makes some parachain blocks available, the validators use the babe randomness from this relay chain blob, they use that to seed this VRF behaviour. For every parachain block, every validator is assigned to check every parachain block but for a certain tranche.

We use the VRF to assign the validators to the tranche.

## Questions

Do any of you have ideas of something that would be cool to be built on top of this system that hasn't been done yet?
