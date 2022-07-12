# Exotic Primitives

- VRFs
- Erasure coding
- ZK Proofs

## Verifiable Random Functions (VRFs)

These are used in consensus for babe to decide who is producing blocks. People to randomly choose to check stuff.
IN parachains logic to choose validators to check parachain blocks.

- Used to obtain *private randomness* that is *publicly verifiable*
- A variation on a signature scheme:
  - Still have private/public key pairs, input as a message
  - in addition to signature we get an output

Provable randomness.
A deterministic signature scheme that is suitably psuedorandom.

## VRF Interface

```
sign(sk, input) -> signature
verify(pk, signature) -> option output
eval(sk, input) -> output
```

## VRF Output properties

- output is determinnistic function of key and input
  - eval is deterministic
- psuedo-random
- until the VRF is revealed, only the holder of the secret key knows the output

## VRF Usage

- Choose input after key, then the keyhold cannot influence the output
- The output then is effectively a random number only to the keyholder
- But they can later reveal it, publish the VRF proof (signature)

### Example

- Playing a card game in a distributed and trustless way
- For player A to draw a card, the players agree on a new random number x
- A's card is determined by `eval(sk_A,x) mod 52`
- To play the card, A publishes the signature

Anyone who is verifying the signature can also get the output.

No one has implemented poker on ethereum using this.

### Extensions

- Threshold VRFs/Common coin
  - generate the same random number if `t` out of `n` people participate
- RingVRFs
  - the VRF output could be from any one of a group of public keys

##  Erasure coding

- Turn data into pieces (with some redundancy) so it can be reconstructed even if some pieces are missing.
- A message of `k` symbols is turned into a coded message of `n` symbols can recovered from any `k` of these `n` symbols.

## Classical use

- Used for noisy channels
- If a few bits of the coded data are randomly flipped, we can still recover the original data
- Typically `n` is not much bigger than `k`

## Use in decentralised systems

- We have data we want ot keep publicly available
  - but not have everyone store
  - but we don't trust everyone who is storing pieces
- typically we use `n` much bigger than `k` - 2 or 3 or 4 times bigger

Used in polkadot for parachain blocks.

## ZK proofs

How do we do private operations on a public blockchain and have everyone know that they were done correctly?

- A prover wants to convince a verifier that something is true without revealing why it is true
- They can be interactive protocols, but mostly we'll be dealing with the non-interactive variety (as it is simpler).

## What can we show?

- NP relation: `function(statement, witness) -> bool`
- Prover knows a witness for a statement:
  - They want to show that they know it (a proof of knowledge)
  - ... without revealing anything about the witness (ZK)
- with a small proof even if the witness is large (succinctness)

Proving that a DNA string is not in a data base of DNA strings that you don't want to reveal.

### Interface

- NP relation: `function(statement, witness) => bool`
  - `prove(statement, witness) -> proof`
  - `verify(statement, proof) -> bool`

### Example

- They show that the prover knows the private key (the discrete log of the public key) without revealing anything about it.
- The statement is the public key and the witness is the private key.

-  **Proof of knowledge** - if you can compute correct proofs of a statement, you should be able to compute a witness for it.
-  **Zero knowledge** - the proof reveals nothing about the witness that was no revealed by the statement itself.

- There are many schemes to produce succinct ZK proofs of knowledge (ZK-SNARKs) for every NP relation.

## Scaling vai ZK proofs in blockchains

A small amount of data, a ZK proof, and execution time can be used to show properties of a much larger dataset which the verifier doesn't need to know.

- Large amount of data - a blockchain
- Verifier is e.g. an app on a mobile phone

OR

- The verifier is blockchain, with very expensive data and computation costs
- Layer 2s using ZK rollups

## Privacy

A user has private data, but we can show publicly that this private data is correctly used.
Example: private cryptocurrrency (zCash)
- Keep amounts secret
  - but show they are positive
- Keep who pays secret

## Practical considerations

- Very powerful primitive

## downsides

- Slow prover time for general computation
- To be fast, need to hand optimise (people writing machine code, like being back in the 70s)
- Very weird computation model: Non-deterministic arithmetic circuits

## Downsides conclusion

- So if you want to use this for a component, expect a team of skilled people to work for at least a year on it...
- But if you are watching this 5 years later, people have built tools to make it less painful.

## Summary

- VRF: Private randomness that is later publicly verifiable
- Erasure Coding: Making data robust against losses with redundancy
- ZK Proofs: Just magic, but expensive magic

### Questions

Do you think as it becomes easier to use ZK Proofs they will become very important and significant?

