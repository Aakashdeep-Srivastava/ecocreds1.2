# CarbonGero — Launch Readiness (demo → real people earning real money)

> Honest assessment. The code MVP is strong; **"people earning real money" is
> gated far more by legal / compliance / anti-fraud / funding than by code.**
> Don't turn on cash-out until verification is real and counsel has reviewed it.

---

## Where it stands today
**Live & working (demo):** anonymous usage → submit activity → Proof of
Sustainability → Algorand anchor (simulated until the treasury is funded) →
rewards accrue off-chain → **freemium claim** to a Pera wallet → **human
verifier** approve/reject → **carbon-credit certificates** → **corporate
exchange** (list / buy / retire). Everything is config-gated and honestly
labeled (estimated vs verified vs certified; simulated vs on-chain).

**NOT production-ready for money:** single demo user (no real auth), AI is a
deterministic stub, treasury unfunded, no KYC, no legal entity, no fiat rails.

---

## The hard gates before you can pay real people
1. **Real identity & auth** — replace the single demo user (e.g. Clerk).
   Per-user wallets and per-user ledgers. Without this you can't attribute
   earnings or stop one person farming many accounts.
2. **Real verification = your anti-fraud core.** If rewards are money, people
   *will* game photos. You need real image/waste classification + duplicate &
   anomaly detection (the FastAPI services) + human review. The verifier queue
   is built; the AI must become real before cash is involved, or you pay for
   fake activity.
3. **Legal entity + compliance.** Paying people is a business (tax, ToS,
   liability). Carbon credits touch environmental-claims and possibly
   securities/commodity regulation. **Get counsel.** Never market "certified
   carbon credits" without real registry accreditation — the app already labels
   them "voluntary / not accredited"; keep it that way until it's true.
4. **KYC / AML.** Any cash-out requires identity verification + sanctions
   screening. Easiest path: delegate it to the off-ramp provider (Transak /
   MoonPay) which owns this compliance.
5. **Money movement — do NOT custody or convert fiat yourself** (money-transmitter
   licensing). Three options, in increasing regulatory burden:
   - **(a) Points → goods/vouchers** (what the Rewards page already does). "Earn
     CGRO, redeem for real products." Lowest risk, launch-able first.
   - **(b) Crypto cash-out:** settle value in **USDC on Algorand** → user
     off-ramps via an **embedded licensed ramp** → their bank/PayPal. You never
     touch fiat. (See `docs/RESEARCH-verification-and-offramp.md`.)
   - **(c) Direct fiat payout:** highest burden; avoid unless licensed.
6. **Funding model — who pays the users?** The economics must close:
   **corporates buying verified carbon credits** (the exchange) is where real
   money enters; a cut funds user rewards (plus sponsors/grants). Define unit
   economics (e.g. ₹ per kg recycled) *before* launch or you bleed money and
   attract fraud.
7. **Abuse controls, rate limits, privacy** (PII minimization + consent), ToS.

---

## A realistic phased launch
- **Phase A — Closed beta, points only (no cash).** Real auth + real AI
  verification; CGRO redeemable for vouchers. No fiat → low regulatory risk.
  Goal: learn fraud patterns and real demand.
- **Phase B — B2B carbon-exchange pilot.** Onboard a few corporates to buy
  verified credits in USDC. This is your **revenue** and the "real money in."
  Manual/human verification is fine at low volume.
- **Phase C — User cash-out.** Once revenue funds it and KYC + a licensed ramp
  are integrated, let users convert earned value to fiat.
- **Phase D — Scale.** Mobile app, more activity categories, programmatic
  verification, marketplace liquidity, developer SDK.

---

## Make it genuinely usable for people
- **Mobile-first** — people recycle with a phone. Ship the Expo app (PRD Phase 5).
- **Dead-simple flow:** snap photo → instant AI feedback → see points. No jargon.
- **Trust is the product:** show the on-chain proof + verifier approval; lead with
  transparency.
- **No wallet to start** (freemium) — already designed; a wallet is only needed at
  cash-out.

---

## Immediate engineering next steps (to be launch-credible)
1. **Real auth + per-user data** (Clerk) — unblocks everything else.
2. **FastAPI verification service** (real image/waste + duplicate/anomaly) — the
   anti-fraud core; replace the stub.
3. **Fund the treasury + create CGRO ASA** (`cmd/setup-asa`) → on-chain rewards live.
4. **Embed one off-ramp** (Transak — supports Algorand) for USDC cash-out.
5. **Mobile app** (Expo) for real-world reach.

**Bottom line:** sequence is *real auth → real verification → B2B revenue (credit
sales) → then user cash-out via a licensed ramp.* The infrastructure is ready to
support all of it; the gating work is compliance, anti-fraud, and funding — not
more blockchain code.
