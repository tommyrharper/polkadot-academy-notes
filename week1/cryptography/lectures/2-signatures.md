# Cryptographic Signatures

## Multi-Signatures

- These are signed by multiple parties.
- Require some threshold of members to agree to a message
- Protect against key loss

### Types of Multi-Signatures

- Verified enforcer
- Cryptographic threshold
- Cryptographic non-threshold (a.k.a signature)

## Verifier Enforced Multiple Signatures

We assume there is a verifier (for our purposes a blockchain)

This is usually good - don't have to communicate with other members.

## Key Generation - Threshold

All signers must run a *distributed key generation* (DKG) protocol taht sonstructs key shares.

The secret encodes the threshold behavior, and signing demands some threshold of signature *fragments*.

Difficult to get this to work with large members of people (1000s). With 100s it is possible.

## Key Generation - Non Threshold

Everyone creates their own pub key and private key and then they are combined afterwards.

## Schnorr Multi-Sigs

Schnorr signatures are primarily used for threshold multi-sig.
- Fit legacy systems nicely and can reduce fees on blockchains.
- Reduce verifier costs in bandwidth & CPU time, so great for certificates
- Could support soft key derivations

However, automation is tricky.

we need agreement upon the final signer list and two random nonce contributions from each prospective signer, before constructing the signature fragments.

Now bitcoin is upgraded no one will use this stuff anymore.

## BLS Signatures

- Use heavier pairing friendly elliptic curves than ECDSA/Schnorr.
- Very popular for consensus
- Good for multisig
- Supports all kinds of aggregation
- Verifying individual signatures is slow
- Verifying the aggregate is relatively fast (compare to Schnorr)

However,

- DKGs remain tricky (for threshold).
- Soft key derivations are typically insecure for BLS.
- Verifiers are 100s of times slower than Schnorr, due to using pairings for a single signature.
- For 100s or thousands of signatures faster than Schnorr

## Schnorr and BLS summary

These avoid complicating verifier logic, but introduce UX costs such as:
- DKG (Distributed key generation) protocols
- Reduced key derivation ability
- Verification speed

Few people use BLS due to complexity.

BLS is used for consensus. It is particularly useful for showing that a 1000 people have signed something.

BLS are much slower for a single signature.

The main tradeoff is storage.

## Ring Signatures

Monero uses this - Monero has 8 public keys.

- Prove the signer lies within some "anonymity set" of signing keys, but hide the individual in the group.
- They come in many sizes, with many ways of presenting their anonymity sets.
- Anonymous blockchain transactions typically employ ring signatures

## Next Lesson

- Exotic Primitives 
- Hash functions and data structures

## Questions

In BLS a single signature is presented.

What is a cryptographic threshold and non threshold?

