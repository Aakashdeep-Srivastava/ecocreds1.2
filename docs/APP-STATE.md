# CarbonGero — App State & User-Journey Map (internal audit)

> Honest, code-grounded snapshot: what's implemented, what's *real* vs *simulated*
> right now, and how each user journey is managed end-to-end. Companion to the
> external deep-research report and `docs/LAUNCH.md` / `docs/PRODUCT-STRATEGY.md`.

---

## 1. Architecture (as built)
- **Monorepo on Vercel (Hobby):** Next.js 16 + React 19 frontend + **8 Go serverless
  functions** + **Neon Postgres** + **Algorand TestNet**. Live at xecocreds.vercel.app.
- **Go functions (8 / 12 Hobby cap):** `health` (+ keep-alive cron via `?ping=1`),
  `submit`, `proofs`, `stats`, `wallet`, `rewards` (summary/assets/account/claim),
  `market` (reviews/credits/issue/list/buy/retire/buy-bulk), `community`
  (Global Meter / pledge / waitlist).
- **Shared Go (`pkg/`):** `db`, `carbon` (GHG: AD×EF×OF − leakage), `chain`
  (anchor, ASA issuance, indexer, verifier attestation, certificate anchor — all
  config-gated with simulated fallback), `store` (all business logic), `httpx`.
- **DB (16 tables):** users, methodologies, activities, evidence, ai_assessments,
  impact_assessments, sustainability_proofs, reviews, carbon_credits,
  credit_events, digital_assets, reward_issuances, blockchain_transactions,
  asset_transfers, heartbeats, community_signups. Reproducible from `/migrations/*.sql`.

---

## 2. Feature inventory & status

| Area | Status | Notes |
|---|---|---|
| Activity submit → evidence SHA-256 → proof → anchor | ✅ Real (anchor simulated) | Full flow persists atomically |
| Carbon accounting (GHG engine + seeded methodologies/factors) | ✅ Real | Always labelled **estimated** |
| **AI verification** | 🔴 **Stub** | Deterministic, not real image/waste classification |
| **Human peer-review verifier** (approve/reject + on-chain attestation) | ✅ Real | `review_status` gates credit issuance; verifier role is demo |
| Proof of Sustainability registry + stats | ✅ Real | — |
| **Reward ASA (CGRO)** issuance + opt-in + freemium claim | 🟡 Real code, **simulated** | Flips live on funding + 2 env vars |
| Asset indexer (on-chain holdings) | ✅ Real (reads TestNet) | — |
| **Carbon-credit certificates** (issue from APPROVED proof) | ✅ Real | serial, vintage, project, on-chain cert anchor (simulated) |
| **Exchange**: list / buy / retire / **bulk buy** + provenance | ✅ Real | Payment settlement **not built** (off-platform) |
| Public marketplace storefront | ✅ Real | single + bulk purchase |
| Public: calculator / learn / get-involved (Global Meter, pledge, waitlist) | ✅ Real | Meter reads real proof data |
| DB keep-alive heartbeat + daily cron | ✅ Real | minimal compute |
| Dashboard (sidebar, charts, tour) | ✅ Real UI | corporate/ESG analytics still **mock** |
| **Real auth / multi-user / RBAC** | 🔴 Missing | single `USR-DEMO`; Pera login is session-only |
| Payment collection / KYC / fiat off-ramp | 🔴 Missing | by design — needs licensed partner |
| Mobile app (Expo) | 🔴 Missing | — |
| FastAPI AI microservices | 🔴 Missing | replaces the stub |

**Legend:** ✅ real & live · 🟡 real code, simulated until configured · 🔴 missing/stub.

---

## 3. Real vs simulated RIGHT NOW
- **Real & persisted (Neon):** users/activities/proofs, carbon calc, verifier
  decisions, credit issuance + exchange + provenance, marketplace, calculator,
  pledges/waitlist, heartbeat. Everything you click writes real rows.
- **Simulated (honest labels in UI/DB):** Algorand anchoring, CGRO reward
  transfers, on-chain credit anchors — run in `simulated` mode until the treasury
  is funded and `ALGORAND_MNEMONIC` + `ALGORAND_REWARD_ASA` are set (`cmd/setup-asa`).
- **Stubbed:** AI assessment (deterministic). **Mock:** corporate ESG charts.

---

## 4. User journeys & the states to manage

### Individual (freemium, no login to start)
`land → /calculator (footprint) → /learn → /get-involved (pledge/waitlist)` →
*(dashboard)* `submit activity + evidence → AI (advisory) → verifier approves →
Proof of Sustainability → earn CGRO → claim to Pera wallet → redeem/hold`.

### Verifier
`/dashboard/verify` queue → approve/reject → **on-chain attestation** → proof
becomes `APPROVED` (now eligible to become a credit).

### SMB / corporate buyer
`/marketplace → browse listed credits → buy (single or bulk) → retire (offset
claim) → certificate + provenance`. **Sell side:** `/dashboard/marketplace →
issue from approved proof → list at price`.

### State machines to manage
- **Activity:** DRAFT → SUBMITTED → VERIFIED
- **Proof.review_status:** PENDING_REVIEW → APPROVED / REJECTED
- **Reward.status:** PENDING_WALLET → (claim) → ISSUED / SIMULATED / OPTIN_REQUIRED / FAILED
- **Credit.status:** ISSUED → LISTED → SOLD → RETIRED
- **Signup.kind:** PLEDGE / WAITLIST

### Management gaps (what "managing the journey" still needs)
1. **Real accounts** — everything is one demo user; can't attribute actions,
   earnings, teams, or prevent farming without auth (Clerk).
2. **Admin surface** — no UI to manage methodologies, emission factors, verifier
   roles, or the review SLA.
3. **Notifications** — no email/push on verify decision, reward claim, or sale.
4. **Fraud controls** — AI is a stub; duplicate/anomaly detection is required
   before rewards = money.
5. **Payment/KYC** — purchase is a reserve/record; real settlement + identity
   checks are unbuilt (deliberately — licensed partner).

---

## 5. Recommended sequence to make the journey production-real
1. **Real auth + per-user data (Clerk)** — unlocks attribution, teams, SMB.
2. **FastAPI AI verification** (image/waste + duplicate/anomaly) — anti-fraud core.
3. **Fund treasury + CGRO ASA** — flip rewards/anchoring live (no code change).
4. **Notifications + admin** — operate the review/reward/sale loops.
5. **Payment + KYC via licensed partner** — enable real money (see off-ramp research).
6. **Mobile (Expo)** — real-world reach.
