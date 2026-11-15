# Worked examples — M-of-N oracle quorum

Educational fallback. Not `orng.wax`. `T0` in the tests is `1_700_000_000`. Deadline is `T0 + 60`. Oracles are `ora_a`, `ora_b`, `ora_c`. Threshold is `2` unless a test says otherwise.

Entropy samples are 64 hex chars: `E1` is `11` repeated, `E2` is `22` repeated.

## Reach quorum

1. `ora_a` reports `E1` at `T0 + 10`. Phase stays `open`.
2. `ora_b` reports `E2` at `T0 + 20`. Phase becomes `quorum`. `combined` is 64 hex chars.

Submitting `ora_b` first and `ora_a` second yields the **same** `combined` string. Mix is XOR in oracle-id order, not arrival order.

## Failures that do not count as reports

| Event | Result |
| --- | --- |
| `ora_a` reports twice | second is `duplicate`; the second entropy is ignored |
| `ora_a` at `T0 + 61` | `late`; strike `1` on `ora_a`; report set stays empty |
| `ora_x` | `unknown oracle` |
| entropy `zz` | `bad entropy` |
| threshold `3` with only two oracle ids | `bad threshold` |
| oracle id listed twice | `duplicate oracle` |

## Silence

`ora_a` reports at `T0 + 1`. `closeDeadline` at `T0 + 60` sets phase `failed`. `ora_b` and `ora_c` gain one strike. `ora_a` stays at zero strikes.

## Suspension

A two-oracle session with threshold 2. Each `closeDeadline` while the phase is forced back to `open` adds a strike. After `MAX_STRIKES` closes, `isSuspended` is true for both ids. The test does not slash a token.

## Not in this repo

No signature check on the oracle, no bond, no `orng.wax` job. A suspended flag is a counter, not an on-chain ban.
