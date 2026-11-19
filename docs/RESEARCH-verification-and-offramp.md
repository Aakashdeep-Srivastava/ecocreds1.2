# Research Brief — On-chain verification/"peer review" & crypto→PayPal off-ramp

> High-level research, Nov 2026. Scopes two questions the team raised:
> (1) how transactions get verified / "peer reviewed" on Algorand, and
> (2) how a user/corporate converts CarbonGero crypto value to PayPal/fiat.
> This is a design/decision brief, **not** regulatory or financial advice.

---

## 1. Transaction verification & "peer review" on Algorand

Two different things are often both called "verification". Separate them:

### 1a. Network-level verification (automatic — already live in CarbonGero)
Algorand uses **Pure Proof-of-Stake (PPoS)**. Every transaction is validated by
the network and included in a block via cryptographic sortition. Key properties:

- **Instant finality** (~2.8s blocks, no forks, no reorgs) — once confirmed, a tx
  is irreversible. There is no "wait N confirmations for safety" like Bitcoin.
- We already confirm txns with `WaitForConfirmation` (anchor + ASA transfer) and
  read them back through the **indexer** (`/api/account`). That *is* the on-chain
  verification: anyone can independently re-verify a proof/reward tx on the Lora
  explorer. No extra work needed here.

### 1b. Human "peer review" before issuance (a CarbonGero design choice)
This is the domain meaning — an **independent verifier approves** an activity
before a credit is issued (PRD §5.4 `NEEDS_HUMAN_REVIEW`, §5.6, §12 "independent
verification references"). Recommended design (future build):

- Add a **verifier role** + review queue: `SUBMITTED → UNDER_REVIEW →
  VERIFIED/REJECTED`. AI assessment is advisory only; a human verifier signs off.
- **Attest on-chain**: record the verifier's approval as its own Algorand txn
  (note field: `{proof, verifier, decision, methodology}`) — or, for stronger
  guarantees, gate issuance behind an **Algorand multi-signature** account
  (platform + verifier keys) or a smart contract that only mints the credit ASA
  when an authorized verifier has signed. This gives a tamper-evident,
  independently checkable "peer-review" trail distinct from the raw tx.
- This is the correct place for **PyTeal / Algorand Python** (an
  issuance-authorization contract) — see PRD §6.3.

---

## 2. Converting CarbonGero crypto value → PayPal / fiat

### The honest constraint
- **PayPal does not support Algorand (ALGO) directly.** You cannot withdraw ALGO
  (or an Algorand ASA) straight into a PayPal balance.
- **CarbonGero should not convert/custody fiat itself** — doing so is regulated
  money transmission (licensing, KYC/AML). Keep CarbonGero as the **asset + record
  layer** and integrate a **licensed third-party ramp** that owns compliance.

### Recommended architecture (keep the platform out of the money-transmission path)
1. **Settle real value in USDC on Algorand**, not a bespoke token. USDC is native
   on Algorand and is what every off-ramp supports. (Keep CGRO reward points and
   carbon-credit certificates as their own ASAs; when a corporate *pays* for a
   credit, settle that leg in USDC.)
2. **Embed a regulated off-ramp** so the user/corporate cashes out themselves:
   - **Transak** — off-ramp **supports Algorand**; sells 40+ assets incl. USDC;
     ~0.99–1.99% fee; embeddable widget/API.
   - **MoonPay** — USDC/USDT/DAI → bank via ACH/SEPA/card; 160+ countries.
   - **Ramp Network** — similar embeddable off-ramp.
   - **Noah** (Nov 2026: *Algorand + Noah* partnership for regulated on-chain
     payments) — worth evaluating for institutional/regulated payouts.
3. **Fiat lands in the user's bank**, then to PayPal if they wish — or pick a ramp
   with a PayPal payout option where available.

### If PayPal specifically is required: the PYUSD bridge
- **PYUSD = PayPal USD**, PayPal's own stablecoin. Path: convert the Algorand
  value → **USDC → PYUSD** (via an exchange/converter) → into the PayPal balance.
- Or route through a **US exchange** (Coinbase/Kraken): ALGO/USDC → USD → PayPal
  cash-out (**US-only**; sell/cash-out only, region-dependent).
- Third-party exchangers (e.g. BestChange-listed) do ALGO→PYUSD directly, but
  these are not something to embed for end users at scale (trust/compliance).

### Practical recommendation for CarbonGero
- **MVP / now:** keep rewards (CGRO) and credits as ASAs; **do not** build fiat
  off-ramp in-house. Document that cash-out happens via a partner.
- **Phase 6:** integrate **one** embedded off-ramp (start with **Transak** — it
  supports Algorand) for corporates to settle carbon-credit purchases in USDC and
  cash out. Treat PayPal as a *downstream* user choice, not a platform feature.
- **Never** present CarbonGero as converting crypto to fiat itself until the
  licensing question is answered with counsel.

---

## Sources
- [Transak Off-Ramp (supports Algorand)](https://transak.com/off-ramp)
- [Best crypto on/off-ramp providers 2026 (dashdevs)](https://dashdevs.com/blog/best-crypto-on-ramp-and-off-ramp-providers-2026/)
- [Best stablecoin off-ramps 2026 (eco.com)](https://eco.com/support/en/articles/15210579-best-stablecoin-offramps-2026-cash-out-routes-compared)
- [Algorand + Noah regulated on-chain payments (PR Newswire, Nov 2026)](https://www.prnewswire.com/news-releases/algorand-and-noah-team-up-to-deliver-institutional-grade-regulated-payments-on-chain-302619060.html)
- [Buy/cash-out ALGO with PayPal via Coinbase (US-only)](https://www.coinbase.com/how-to-buy/algorand)
- [PYUSD ↔ ALGO converter (Coinbase)](https://www.coinbase.com/converter/pyusd/algo)
- [ALGO → PayPal USD exchangers (BestChange)](https://www.bestchange.com/algorand-to-paypal-usd.html)
