# Tips — multi-oracle quorum

## Do

- Sort oracle ids before combining.  
- Strike late and silent participants.  
- Cap session open time with a hard deadline.

## Don't

- Accept two reports from one oracle.  
- Raise threshold above N.  
- Ship without documenting "structural only, not BLS."

## Related

[drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) · [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) · [orng dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent)
