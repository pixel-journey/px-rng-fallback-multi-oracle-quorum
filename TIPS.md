# Tips — multi-oracle quorum (fallback)

M-of-N reports combine (this lab: ordered XOR / structural merge). **Not** BLS aggregation. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.

## Do

- Sort oracle ids **before** combining so report order does not change the result.
- Strike late and silent participants; track strikes per oracle.
- Cap session open time with a hard deadline.
- Refuse a second report from the same oracle for the same session.

## Don't

- Raise threshold above N.
- Ship without the line “structural only, not BLS.”
- Let a single oracle report twice under two aliases.

## Common mistakes

1. Combining reports in arrival order (non-deterministic across nodes).
2. Threshold 1 of N while advertising “decentralized.”
3. No strike ledger → one dead oracle freezes every session forever.
4. Treating the XOR of user-supplied hex as a verified signature.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Real threshold signatures | Outside this TypeScript structural lab |
| Stake-weighted oracles | New governance surface |
| Fallback to TAPOS if quorum fails | [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) |

Related: [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) · [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) · [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) · `px-contract-examples-vault` (private index; not this public course)
