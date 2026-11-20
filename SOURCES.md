# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Contract patterns |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Auth / multi-party design context |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | **Preferred** single-service RNG on WAX |
| [drand.love](https://drand.love/) | Related public randomness (see drand lab) |

This lab is **structural** M-of-N accounting (strikes, suspension, order-independent combine). It is not BLS aggregate verify and not a live multi-sig.

## Product facts locked by tests

- Threshold **M of N** distinct oracles must report before phase `quorum`.
- Combine is **order-independent** (sorted oracle id). Submission order must not change settlement.
- Late or silent oracles accumulate **strikes**; repeated failures can **suspend**.
- Late reports do **not** enter the report map and do not count toward quorum.
- Duplicate report from the same oracle is refused.
- Prefer `orng.wax` when a single robust service is enough.

## Related labs

| Lab | Topic |
| --- | --- |
| [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Post-bet time gate |
| [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) | Future-block delay |
| [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) | Bonded reveal |
| `px-contract-examples-vault` (private index; not this public course) | Full curriculum order |
