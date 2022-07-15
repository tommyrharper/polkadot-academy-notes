# Auctions

Where supply and demand meet is the point of equilibrium.

This is a macro tendency.

we are going to look at a micro level - i.e. if I am seller, what price should I sell at.

We have 1 seller and several buyers. How to optimize the price?

The optimal thing is to aim for the person who offers the highest price by a tiny bit.

In reality the buyer doesn't know the other buyers price.

The seller doesn't have the power to change supply that much, so they can just look at the market and take that price.

However for a rare good e.g. a piece of art or an oil well, we can use an option - a market that has a single seller and many buyers.

Or e.g. auctioning parachain slots.


## Seller Options

They can just choose a price and post it, or they can go for an auction.

How are auctions superior to posting a price?

## Price Posting

Individual valuations `va,vb`.

If they know the valuation they can just go for `max(va,vb)`.

Imagine:

buyers random valuations between 0 and 1.
valuations are independent.
each buyer know their own valuation, not anyone elses.

firm posts price `p`.

either buyer will buy it if the price <= va/vb

The chance that at least one of the two valuations is below `p` is `(1 - p^2)`

revenue is `p(1-p^2)` - this is concave function.

## Auctions

- Static auctions: all bids submitted at once
  - first-price payment rule
    - you pay what you bid
  - second-price payment rule
    - the highest bidder wins and pays the price of the second highest bidder
    - makes bidders lives strategically easier
    - generates same revenue as first-price
- Dynamic auctions: bids are submitted over time
  - english auction - ascending price
    - strategically equivalent to second-price auction
  - dutch auction - descending price
    - strategically equivalent to first-price auction

## Second Price Auction

This is strategically simplest.

Optimal strategy is just to post your own valuation.

ba=va, bb = vb

This is the **dominant** strategy.

### Expected revenue

- Price is the second highest valuation.
- Expected value of the minimum of these two variables between 0 and 1 is 1/3.

- Posting a price earned 0.38

We can improve this by adding a reserve price.

Expected revenue is maximal when `r = 1/2`, at which point revenue `~=0.42`

## English Auction

**strategically equivalent** to a static second price auction.

Dominant strategy is to stay in the game as long as the price is below your valuation.

### Shill bidding

- English auctions popular among theorists, not so much among practitioners.
  - bidder acts on behalf of the auctioneer to drive up the price.

## First-Price Auction

**Equilibrium strategy:** *Nash equilibrium* for both bidders to bid half of their valuations i.e. `ba=va/2`

Nash equilibrium is worse than a dominant strategy.

Bidding is **not** truthful.
- bidders *shade* their bid and bid below their value.

Expected revenue is `1/3` - same as a second price auction.

- **Revenue Equivalence Theorem:** When valuations are independent and private as in our mode, then all auction mechanisms that allocate the good to the highest-valuing bidder in equilibrium are the same.

## Dutch Auction

- Dutch auction is strategically equivalent and revenue equivalent to the static first-price auction.

## Summary

- First price and dutch auctions are strategy equivalent.
- Second-price and English auctions are strategy equivalent.
- All four actions are revenue equivalent.
- The optimal auction has a reserve price.
- The optimal auction beats price posting in terms of revenue.

## Common value auctions

This is an oil well instead of a piece of art.

The value is objective.

These give higher revenue than subjective auction.

People converge on the average value (or true valuation), hence the winner tends to pay more than the value (*winners curse*).

### Reality

In reality first price auctions lead to higher revenue that second price auctions - due to *risk aversion*. People want certainty.

## Front running

A front runner is a node that allows it to see transactions first. Can make a new transaction and make it appear on a ledger before another one (almost like time travel).

This is common in finance applications.

## Candle Auction

Dynamic first-price (english) auction with a random ending time.

This was done in the 17th and 18th century when they actually used a candle, and the auction ended when the candle goes out.

- This protects against sniping (last minute bidding)
- Also protects against griefing - whenever you make a highest bid there is a chance you will win, even if the other bidders are still willing to overbid.
- Polkadot uses candle auctions for the assignment of parachains.


