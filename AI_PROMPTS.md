# AI handoff — multi-oracle quorum fallback

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | **Preferred** single-service RNG on WAX |
| [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Public beacon time gate |
| [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) | Bonded house |

## Non-negotiables

1. Structural **M-of-N** accounting only — not BLS aggregate verify, not live multi-sig.
2. Threshold M distinct oracles must report before phase `quorum`.
3. Combine is **order-independent** (sorted oracle id). Submission order must not change settlement.
4. Late or silent oracles accumulate **strikes**; repeated failures can **suspend**.
5. Late reports do **not** enter the report map and do not count toward quorum.
6. Duplicate report from the same oracle is refused.
7. Prefer `orng.wax` when a single robust service is enough. Do **not** tag this lab `orng`.

## Prompt seeds

- "M=2 of N=3 — two reports same payload, different order — same combine?"
- "Late report after quorum — enters map?"
- "Duplicate oracle id — refused?"
- "When is quorum justified if orng is available on WAX?"

## Do not

- Claim BLS verification here.
- Let submission order change the combined digest.
- Ship as primary WAX RNG without documenting orng skip.
