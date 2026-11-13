# M-of-N oracle quorum with strike accounting

> **Domain:** RNG fallback — multi-oracle quorum  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Collect distinct on-time reports until `threshold` is met. Late reports strike and do not count. At deadline, silent oracles are struck; missing threshold fails the session. Combined entropy is XOR of reports sorted by oracle id.

**Code under test:** `npm test`. No live oracles, no wasm.

Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) for production WAX randomness.

```bash
npm test
```

MIT — Pixel Journey
