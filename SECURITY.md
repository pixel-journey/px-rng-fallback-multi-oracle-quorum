# Security — multi-oracle quorum (fallback)

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Duplicate report same oracle | refused |
| Report after deadline | late; strike +1; not counted |
| Deadline close with insufficient reports | failed; silent oracles struck |
| MAX_STRIKES | suspension |
| Threshold > N / bad entropy / unknown oracle | refused |
| Report order | combined value order-independent (sorted ids) |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Cryptographic authenticity | Reports are structural hex, not verified signatures |
| Sybil oracles | Anyone can invent N names without stake |
| Collusion of M members | Threshold design only; no crypto binding |
| Live networking | No transport in this lab |
| Auth per report | `require_auth(oracle)` on each submission |

## Attack angles

1. Arrival-order combine (non-deterministic settlement across nodes).
2. Threshold 1 while advertising decentralization.
3. No strike ledger → one dead oracle freezes every session.
4. Calling the lab a BLS aggregate verifier.

## Honesty limits

Structural accounting only. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) when a single robust service is enough. Related: [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos).
