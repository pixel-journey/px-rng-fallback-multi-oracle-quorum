# Worked examples — quorum

## Example A — reach quorum

3 oracles, threshold 2: two on-time reports → phase `quorum`, `combined` set.

## Example B — late report

`reportedTs > deadline` → reason `late`, strike incremented, report not stored.

## Example C — duplicate

Second report from same oracle → `duplicate`.

## Example D — deadline close

After deadline, silent oracles struck; if reports ≥ threshold → quorum else failed.

## Example E — suspension

After MAX_STRIKES (5), oracle suspended; further submits refused.

## Example F — XOR order

Same two entropies in different arrival order still produce the same `combined` (ids sorted).
