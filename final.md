# Final

How to start the node so the blockchain doesn't hang around:

```bash
./target/release/node-template --dev
```

Check shiz is working:

```bash
cargo check -p node-template-runtime
```

Build:

```bash
cargo build --release
```

## Kill rust-analyser

If rust analyser is blocking cargo

```bash
killall cargo
```

## DEX Math

50 eth
50 btc

both $1

50 eth comes in
50 btc comes in

x * y = 50 * 50 = 2500

A person comes and wants to swap 5 eth for btc
You use the constant c

new total eth = 55 eth
2500 / 55 = 45.4545454545
45.4545454545 btc

person gets 50 - 45.4545454545 = 4.5454545455 btc

45.454545455 * 55 = 2500.0000000025

to query the value of btc:
initial amount of btc = i_a_btc = 50
new amount of btc = n_a_btc = 45.4545454545
i_a_btc / n_a_btc = 1.1

--------

If I want to add another transaction pool - there is an intercorrelation between the pools that might be a different calculation.

## Alex Brain Dump

Factory is what builds the pair. The pair is interacting through an interface. Liquidity guides the interface.

Look at Factory in Java. Factories is something where you can pop a pair in and create a pair.

The factory then posts that onto uniswap.

At that point it's tradeable on web3.

Java factory -> to generate a website.


