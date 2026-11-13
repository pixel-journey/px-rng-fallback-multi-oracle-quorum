# Education — M-of-N oracle quorum

> **Rung:** `npm test` passes. Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) on WAX.  
> Educational multi-oracle model with strikes and XOR combine.

## What you should be able to do

| Level | Skill |
| --- | --- |
| Beginner | Threshold of distinct on-time reports |
| Intermediate | Late and silent oracles take strikes |
| Masterclass | Combined entropy = XOR sorted by oracle id |

## Beginner

Open a session with N oracle ids and threshold M ≤ N. Reports after deadline are late (strike, not counted). When M distinct on-time reports exist → phase `quorum`.

## Intermediate

`closeDeadline` strikes silent non-suspended oracles. If still under threshold → `failed`. Five strikes → `suspended`.

## Masterclass

`combineEntropy` XORs reports in **sorted oracle id order** so combination is order-independent. Suspended oracles cannot submit.

## Will not teach

TLS / BLS verification of real feeds, or that this replaces orng.wax on WAX mainnet.
