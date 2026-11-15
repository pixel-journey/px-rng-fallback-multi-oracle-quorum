# Education — multi-oracle quorum

When a single randomness provider is insufficient, require M of N independent reports before combining entropy.

## Beginner

Open a session with a deadline and threshold. Each oracle may report once. When reports ≥ threshold, phase becomes `quorum`.

## Intermediate

Late reports strike without counting. Deadline close strikes silent oracles. Suspension after MAX_STRIKES. Combined bytes are deterministic from oracle id order.

## Outcomes

1. Reach 2-of-3 and read combined length 64.
2. Show late report does not enter the report map.
3. Show order-independent combined entropy.
