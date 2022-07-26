# Unsure

## Equivocation

Being offline/unresponsive:
- Hard to detect and prove effectively
Double voting:
- Signing two conflicting statements
- Potentially distributing them to distinct sets of peers
- BABE - a validator produces two distinct blocks at the same slot
- GRANDPA - a validator sends two distinct prevote/precommit messages on the same round

Neither BABE nor GRANDPA care what is done with a discovered equivocation. You can implement whatever you want to happen on discovering equivocation.
The protocol just detects and reports the equivocation.

The person who reported the equivocation can be rewarded.

