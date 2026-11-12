# Official sources

M-of-N quorum is a design pattern. On WAX the native randomness service is still [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng).

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Primary on-chain randomness |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Permissions, time, actions |

This lab does not verify oracle signatures. Strikes and XOR combination are educational rules only.

## Domain map

| Repo | Role |
| --- | --- |
| ORNG domain | Native oracle |
| [px-rng-fallback-drand-bls-verifier](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Single external beacon |
| **This repo** | Threshold of independent reports + strikes |
