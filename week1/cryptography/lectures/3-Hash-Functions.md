# Hash Functions

A succinct representation of some data.

Easy:
1. Accept unbounded size input
2. Map to a bounded output
3. Be fast to compute
Harder/interesting:
4. Be computable one way
5. Resist pre image attacks (attacker controls one input)
6. Resist collisions (attacker controls both inputs)

Proof of work style idea used to used to resist spam - didn't use a central authority.

When bitcoin took this on, the amount of work is variable.. A perfect proof of work in bitcoin would be to find a strict pre-image attack.

We find a pre-image attack that when hashed is all zeroes.

Bitcoin used the hash to find a variable length of the pre image. It doesn't need to be all zeroes. It just needs to be x out of y zeroes. Bitcoin is not one of these 6 values. Proper cryptographers will tut at this.

Hash functions were not strictly used properly, but it Bitcoins place it's basically fine. There are no sha2 exploits for the bitcoin hashing algorithm. It's not too bad.

It's important to understand this stuff so you don't accidentally misunderstand the guarantees.

![](2022-07-13-10-41-02.png)

The data exists only once, like a value within a set in maths. Every piece of data exists only once.

It doesn't matter where the data is stored. We can identify each piece of data with this 32 byte value.

Not mathematically, but for practical purposes a one to one mapping between every value we can come up with and a 32 byte value generate from the hash.

## Speed

Some hash functions are designed to be slow.
These have applications like password hashing which slow down brute force attackers.
For our purposes we generally want them to be fast.

(You can always make a hash functions lower by using multiple hashes)

## Non-Cryptographic Hash Functions

These provide weaker guarantees in exchange for performance.
They are OK t ouse when you know that the input is not malicious.
**If in doubt, use a cryptographic hash function.**

## Pre-Image Attack

- Difficult given `y` to find `x` such that `h(x) = y`

## Second Pre-Image Attacks

- Difficult given `h(x)` to find any `x'` such that `h(x) = h(x')`

Given a hash and a pre-image, it should be difficult to find another pre-image that would produce the same hash.
That is, given `H(x)`, it should be difficult to find any `x'` such that `H(x) == H(x')`

Bitcoin is a partial second pre-image attack.

## Collision Resistance

- Difficult to find an `x` and `y` such that `h(x) == h(y)`

It should be difficult for someone to find two messages that hash to the same value. That is, it should be difficult to find a `x` and `y` such that `H(x) == H(y)`.

## Birthday Paradox

With 23 people, there is a 50% chance that two share a birthday.

Hash function security only half of the bit space.

## Hash Function Selection

When users have control fo the input,
use cryptographic has functions (in Substrate, Blake2).
-Non-cryptographic (TwoX) is faster.
Safe only when the users cannot select the pre-image

IF we restrict the possible inputs they are allowed to choose, then we can use a pretty insecure hash algorithm and still have a substantial expectation that no attackers will realistically find collisions.

If we allowed 1000 values, we could test every possible input. We only need the big guns when the attacker has a big attack space, infinite possible inputs, within which to find a collision.

Can you write a program that enumerates every possible input, then brute force it yourself and check there are no collisions.

There could possibly be no perfect proof of work for bitcoin, as there may not be a pre-image to a certain output.

## Applications

### Database Keys

Hash functions can be used to generate deterministic and unique lookup keys for databases.

Usually we have an index column so that it is fast if you want to do a lookup on a row, whose value in that field/column you know e.g. library book id.

This is a bit different in blockchains. When indexing we will tend to need to put in our backend database a key that is of fixed length that has certain properties.

We may need to know that the keys, the actual data are fixed length and more or less random. Hence at attacker through directed use should be able to decide the keys are essentially random.

### Data Integrity Checks

Member of a peer-to-peer network may host and share file chunks rather than monolithic files. bit torrent is web3 (except for lookup which is centralised)

In **Bittorrent**, each file chunk is hash identified so peers can *request* and *verify* the chunk is a member of the larger *content addressed* file.

Given a hash for some pre-image, find a set of nodes that contain collectively all the data you use. In the magnet link there is a hash. The bittorrent software will then go off and try to find nodes that will eventually provide you will all of this data. When built together you end up with this final hash.

Imagine there is a collision, an attacker has compromised the hash function, the has of the data you are actually after (e.g. ubuntu dist). You get the ISO, it has a hash. If you change the ISO in anyway you would get a different hash.

Someone comes along who wants to infect he ubuntu computers with some dodgy software. They could change the ISO that looked exactly the same in everyway except it has some different code tucked away and then they could publish on bittorrent under the same name. However when the ISO is hashed, the hash would be different. The nodes serving the malevolent ubuntu would not be accepted. Unless the attacker was able to make the malevolent ubuntu hash to the same thing, they could make it work.

## Account Abstractions

Public keys can be used to authorize actions by signing instructions.
The properties of hash functions allow other kinds of representations.

Imagine a system needs fixed length names. Take the "gavin" and hash it for a 32 byte identifier. We do this for a bunch of names.

This is used in crypto to account for the fact that different blockchains use different lengths of keys. Hash them all to the same length.

e.g. the ECDSA public key is 33 bytes (and a bit)
whereas ED2559 is 32 bytes.

![](2022-07-13-11-27-30.png)

## Multi-Signatures

![](2022-07-13-11-45-45.png)

`hash([key1: [u8; 32], key2: [u8; 32], key3: [u8; 32]], 2) -> [u8; 32]` 

## Internal System IDs

Modules within a system may have their own information stored in other parts of the system.

Storage they authorise use of by the module's internal logic.

You have a system with some names, and you need to turn them into a means of reference which is fixed length. The path to a file may be very large. You know the paths won't conflict purposely. We need a way to reduce the length into a nice little box for our BE database that insists that keys are always 32 bytes. You could just truncate, that will only work if there is no duplication in the first 32 bytes of the paths. Hashing them down is a secure way of reducing these huge names.

## Commitment Schemes

It is often useful to commit to some information without storing or revealing it:
- A prediction market would want to reveal predictions only after the confirming/refuting event occurred.
- Users of a system may want to discuss proposals without storing the proposal on the system.

However, participants should not be able to modify their predictions or proposals.

We uses hashes as a tool to implement in the same way dice are in games. The games we play in crypto are normally economic. One way to use hashes is to force players to commit to something before they reveal what that something is - **commit-reveal**.

There is a game - "modern art". It is kind of card game with interesting mechanics. Modern art is sold at auction. There is a kind of auction called a closed bid auction. Often used for selling houses. People put their best bid in, but they don't tell anyone what the bid is. All bids get revealed at the same time, and the best one is taken.

In commit reveal, the players/bidders commit to a particular bid. After the deadline, everybody reveals what their bid is. You pick your bid by requiring people to submit a hash of your bid. Then you submit the pre-image of the hash.

By submitting the hash, though you haven't given the bid, you are now committed to it.

You have to incentivise players to reveal their bids. One way to do that is to require a deposit. If they don't reveal, they get their deposit back.

Building games is 70-80% of what we do in crypto. We want a game:
- people want to play, that people find useful, that is in service to people

We want to jointly commit ourselves to a course of action without bringing all of the information required to describe that piece of information into some singular central point that may in and of itself be expensive.

When we want to upgrade a decentralised network, you upgrade it to some new piece of software, maybe some code that it is often several mb big.

We don't want everyone to have to download a mb big blob of code in order to allow people to decide whether to upgrade to it.

The decision is different technical problem compared to the technical problem of sharing the blob of code itself.

We have people who run nodes, and voters. They are two separate groups of people (possibly with overlap). Instead we just need a secure reference to the code that can be voted on. We say that we agreed upon whatever the pre-image is to the hash we voted on.

## Commit-Reveal

1. Share a hash of data as a commitment `(c)`
2. Reveal the data itself `(d)`

It is normal to add some randomness to the message to expand the input set size.

`hash(message + randomness) => commitment`.

Hash the bid and share it with everyone else, then eventually reveal after deadline. As an attacker I can just go through all possible bids, the bid space is not that big. Instead we add 32 bytes of randomness (entropy) to the hash. When you reveal you can also reveal the randomness too.

We don't try to protect people from themselves when designing games in game theory, we protect people from other people i.e. we don't force people to add randomness to their commitment hash function, but they should for their own interest.

Consensus games can go wrong if their is ambiguity i.e. what is the length of the message, if the message is `10` and the randomness is `0s334rljwltejk` - is the message `10` or `100`? In which case the solution is to define the length of the message.

## Data Structures

Data structures and time/space complexity is immensely important in blockchain systems.

If you can force machines to do 1 or 2 orders of magnitude more work than they are meant to do, you can damage the system.

You could force a machine to do more work than it is supposed to **the shanghai attack**. In real life it is not too difficult to change the rules (vs blockchain is very hard).

If the rules don't work you have a big problem.

### Pointer-Based Linked Lists

Pointer-based linked lists are a foundation of programming.

But pointers are independent of the data they reference, so the data can be modified while maintaining the list.

That is, pointer-based linked lists are not tamper evident.

Gives a strict guarantee of constant complexity additions and withdrawals.

### Hash-Based Linked LIsts

A blockchain is a hash based linked list.

Hash-based lists make the reference related to the data they are referencing. The properties of hash functions make them a good choice for this application.

Any change at any point in the list would create downstream changes to all hashes.

Bitcoin was hash-based linked list + proof of work + sha256.

You cannot insert and remove elements in a hash based linked list.

## Merkle Trees

![](2022-07-13-12-28-00.png)

Allows us to represent sets or maps with the expectation that you will be able to get an intrinsic description for that set.

A cryptographic merkle tree allows to determine the root hash only from the next level of hashes.

Someone down the pub tells us `Hash 1`. Then we can just hash `0`, `0-1` to get `0`, and then hash `1` and `0` to get the root hash in order to verify it is correct. We didn't need to trust the guy down the pub, but he was still useful to us.

A lot of the games revolve around deriving utility from information from sources we cannot trust.

## Other notes

Bitcoin was a military thing. US used to disallow foreign downloads.

One of the applications of a cryptographically secure hash function so you can take any piece of information and run it through the hash function and get another bunch of bytes that have to relevance to the inverse. Changing one bit of the input should have a 50% chance of changing all of the bits of the output. The output is random. It is determinist but random.

This is what gives it those guarantees. It becomes pretty clear that what we can do is keep feeding the ahs function back in on itself. We can take a seed which can be anything, then hash it and get a random and deterministic output. It's not entropy because it is entirely deterministic. The entropy only comes from you and your choice of pre-image.

Before you compute the answer, you will not be able to guess better for each bit better than 50% of the time.

Cryptoanalysis is the act of trying to find static relationships between the input and output of hash functions. Hash functions should not allow those connections. The input is entirely unpredictable from the output.

A cowboy use of hash functions is as a pseudo random number generator.

Hash functions are not mathematically proven things, they are practical/engineering proof. It's Hard with a capital H belief.

## Questions


