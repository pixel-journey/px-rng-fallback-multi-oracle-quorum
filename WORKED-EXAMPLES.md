# Worked examples — M-of-N oracle quorum

Oracles `ora_a`, `ora_b`, `ora_c`. Threshold **2**. Deadline `T0+60`. Entropy E1=`11`×32, E2=`22`×32.

## Quorum

First report leaves phase `open`. Second distinct oracle with any entropy → phase `quorum`, `combined` length **64**.

Submission order does not change the combined value: a then b equals b then a (xor by sorted oracle id).

## Strikes

| Event | Effect |
| --- | --- |
| duplicate report same oracle | `duplicate` |
| report at T0+61 | `late`, that oracle strikes **+1**, reports size stays 0 |
| closeDeadline with only ora_a reported | phase `failed`; ora_b and ora_c strikes 1; ora_a stays 0 |
| MAX_STRIKES silent closes | both oracles `isSuspended` true |

## Shape

Unknown oracle, entropy `zz`, threshold 3 of 2 oracles, duplicate oracle ids in openSession — all refused.

Not live multi-sig; not BLS; structural quorum accounting only.
