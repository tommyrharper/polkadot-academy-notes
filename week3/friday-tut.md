# Task - Extrinsic to transfer claims

1. Rename the crate from template -> proof-of-existence
2. Extrinsic to transfer claims
3. Make it generic over the hash type
4. Make it take a deposit - allows us to reason about a maximum number of claims
5. Make the deposit amount configureable (and upgradeable)
6. Give it a genesis config
7. Create a CLI utility that talks to your node and allows users to make, check, and revoke claims
8. Use fixed-length hash type