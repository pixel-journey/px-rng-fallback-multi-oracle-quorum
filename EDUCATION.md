# Education — M-of-N multi-oracle quorum

> **Rung:** `npm test` passes. Structural quorum accounting only — **not** BLS, not live multi-sig.  
> **The test is the rule.**

When a single randomness provider is insufficient, require **M of N** independent reports before combining entropy. Late or silent oracles accumulate **strikes**; repeated failures can **suspend**.

Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) on WAX when a single robust service is enough. Official sample path: [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

Siblings: [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) · [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) · [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | 2-of-3 reaches quorum with combined length 64 |
| Intermediate | Late/silent strikes; order-independent combine |
| Masterclass | Suspension; why this is not cryptographic multi-sig |

---

## Beginner

Oracles `ora_a`, `ora_b`, `ora_c`. Threshold **2**. Deadline `T0+60`. Entropy E1=`11`×32, E2=`22`×32.

First report → phase still `open`. Second distinct oracle → phase `quorum`, `combined` length **64**.

```bash
npm test
```

---

## Intermediate

Submission order does **not** change combined value: a then b equals b then a (combine by **sorted oracle id** under test).

| Event | Effect |
| --- | --- |
| duplicate report same oracle | `duplicate` |
| report at T0+61 | `late`, that oracle strikes +1, reports size stays 0 |
| closeDeadline with only ora_a reported | phase `failed`; ora_b and ora_c strikes 1; ora_a stays 0 |
| MAX_STRIKES silent closes | both oracles `isSuspended` true |

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Same oracle twice | `duplicate` |
| Report after deadline | `late` + strike; not in map |
| Free-ride forever | strikes → suspend |
| Threshold > N | refused at open |

---

## Masterclass

### Shape refusals

Unknown oracle, entropy `zz`, threshold 3 of 2 oracles, duplicate oracle ids in openSession — all refused.

### Common mistakes

1. Counting late reports toward quorum.  
2. Order-dependent combine (non-deterministic settlement).  
3. No strike policy → silent free-riding.  
4. Confusing this lab with on-chain BLS aggregate verify.  
5. Treating committee entropy as stronger than orng without documenting trust assumptions.

### Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Weighted / stake-weighted threshold | New accounting |
| Real signature verification per report | Host crypto |
| Automatic failover to orng | Product switch |
| Slashing bonds for false reports | Economics |

### Exercises

1. Combined length at 2-of-3? (**64**.)  
2. Does a late report enter the map? (No.)  
3. Is this BLS? (No.)  
4. Preferred production RNG on WAX? (`orng.wax`.)

Numbers: [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) · [SECURITY](SECURITY.md) · [SOURCES](SOURCES.md).

---

## What this course will not teach

- Live multi-oracle networking
- BLS aggregate verification
- That strikes equal economic slash without a bond module
