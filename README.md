# M-of-N oracle quorum with strike accounting

> **Domain:** RNG fallback — multi-oracle quorum  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Collect distinct **on-time** reports until `threshold`. Late reports strike and do not count. At deadline, silent oracles are struck; missing threshold fails. Combined entropy is **XOR of reports sorted by oracle id**.

**Code under test:** `npm test`. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Quorum, late, XOR |
| [TIPS.md](TIPS.md) | Prefer single oracle |
| [SECURITY.md](SECURITY.md) | Strikes and phase |
| [SOURCES.md](SOURCES.md) | Official |

```bash
npm test
```

MIT — Pixel Journey
