# px-rng-fallback-multi-oracle-quorum

> **Trust:** private educational lab (Tier B)  
> **Quest:** 016 — M-of-N oracle quorum with per-oracle strikes  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

Collect distinct on-time reports until `threshold` is met. Late reports strike and do not count. At deadline, silent oracles are struck; missing threshold fails the session. Combined entropy is XOR of reports sorted by oracle id.

**Real code:** `npm test`. No live oracles, no wasm.

## Run

```bash
npm test
```

MIT — Pixel Journey
