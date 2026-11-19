# CarbonGero — Consolidation → Production Implementation Plan + Market-Readiness Benchmark

> The authoritative roadmap to take CarbonGero from "impressive working demo" to a
> product real people and SMBs use in production. Every phase is grounded in the
> research (`DEEP-RESEARCH-launch.md`), the app audit (`APP-STATE.md`), and the
> product strategy (`PRODUCT-STRATEGY.md`). Compliance items need qualified
> counsel — this is engineering/product planning, not legal advice.

---

## PART A — Market-readiness benchmark (honest scorecard)

Scored 0–5 (5 = production-grade). This is a candid self-assessment.

| Dimension | Score | Why |
|---|:--:|---|
| Feature completeness (vertical slice) | **4** | Submit→verify→proof→credit→marketplace→rewards + public funnel all exist |
| Transparency & trust design | **4** | Honest "estimated/voluntary/simulated" labels, on-chain proof — a genuine strength |
| Technical reliability & scale | **3** | Serverless + Neon; no load test, single region, Hobby 12-fn cap, no alerting |
| Retention/engagement design | **3** | Global Meter + reward loop; missing streaks, notifications, teams, social depth |
| Go-to-market readiness | **2** | Public funnel built; no SMB B2B2C product, no analytics/attribution |
| Data privacy & security | **2** | No real auth, no PII policy/consent, minimal hardening |
| Ops & support | **2** | No monitoring, error tracking, status page, or support flow |
| **Verification integrity (anti-fraud)** | **1** | 🔴 AI is a stub; no duplicate/anomaly detection — *blocks any reward=money* |
| **Legal & regulatory compliance** | **1** | 🔴 No entity/ToS/privacy; greenwashing-claim risk; not accredited |
| **Payments & monetization** | **1** | 🔴 No real payment; purchase is a reserve/record; no live revenue |
| **Overall** | **≈2.3 / 5** | **Public *voluntary beta* ready (no money) with light hardening; NOT monetized-launch ready.** |

### Verdict — three readiness tiers
- **Tier 1 — Voluntary beta, no money (labelled).** ~70% there. Reachable in **2–3 weeks** with compliance copy + auth + privacy basics. *Safe to put in front of real users.*
- **Tier 2 — Monetized B2B2C (SMB subscriptions + resale of recognised credits).** Needs real auth, a payment partner, a legal entity, and recognised-credit sourcing. **~6–10 weeks.**
- **Tier 3 — Individual cash-out / own-issued credits.** Needs real AI verification (anti-fraud), licensed payments/KYC, and — for *real* credits — multi-year registry accreditation. **Quarters, with counsel.**

### Competitive benchmark (where we stand)
| Axis | CarbonGero | Cool The Globe | Ecologi | Greenly |
|---|---|---|---|---|
| Verified (not self-reported) actions | ✅ unique | ❌ | ❌ | n/a |
| On-chain proof/traceability | ✅ unique | ❌ | partial | ❌ |
| Earn (not just pay) | ✅ | partial | ❌ | ❌ |
| Public marketplace (buy/bulk) | ✅ | buy only | buy | ❌ (no marketplace) |
| SMB B2B2C subscription | ❌ to build | partial | ✅ | ✅ (pricey) |
| Real AI verification | ❌ stub | n/a | n/a | ✅ accounting |
| Accredited credits | ❌ (voluntary) | resells | ✅ | sources |
**Takeaway:** our moat (verified → on-chain proof → earn → marketplace) is real and unmatched; our gaps (verification integrity, compliance, payments, SMB product) are exactly the production-grade basics.

---

## PART B — Step-by-step implementation plan

Each phase lists **goal · tasks · acceptance criteria (done when) · grounding**.

### Phase 0 — Consolidate & harden what exists *(1 week)*
**Goal:** make the real features robust and consistent before building more.
- Tidy the 8 Go functions; add input validation, consistent errors, basic rate-limit guard on POSTs.
- Add **error tracking** (Sentry free) + a simple `/status` and uptime check; keep the keep-alive cron.
- Replace remaining **mock corporate/ESG charts** with real data or clearly label them "sample".
- Seed realistic demo data; write a short **runbook** (envs, deploy, DB, rollback).
- Consolidate docs into a single `/docs` index.
- **Done when:** no unlabeled mock data; errors tracked; a teammate can deploy + roll back from the runbook.

### Phase 1 — Trust & compliance foundation *(1–2 weeks)* 🔴 gate for any public use
**Goal:** be legally safe to show real users (greenwashing law is the live risk).
- **Two-tier relabel across the UI** (DEEP-RESEARCH #1/#4): "Voluntary **Proof / Impact token** (CGRO)" vs "**Recognised carbon credit**" — never present a recycling photo as a tonne of CO₂.
- **Greenwashing-safe copy pass** (EmpCo 2024/825): remove any "carbon neutral / net zero / certified" implications; our badge ≠ certification; keep "estimated / voluntary / not accredited" everywhere.
- Add **Terms of Service, Privacy Policy, cookie/consent**, and an "How verification works + what credits are/aren't" transparency page (reuse `/learn`).
- Stand up a **legal entity** + contact/DPO; data-retention + deletion policy.
- Never promise CGRO price appreciation (securities hygiene).
- **Done when:** counsel-reviewed copy; ToS/Privacy live; no neutral/certified claims; two tiers visually distinct.

### Phase 2 — Real identity & accounts *(1–2 weeks)*
**Goal:** replace the single demo user so everything can attribute to people/orgs.
- Integrate **Clerk** (Vercel-native): email + wallet sign-in; per-user `users` rows; roles (individual / SMB-admin / verifier / admin).
- Migrate store from `USR-DEMO` to the authenticated user id; per-user proofs, rewards, pledges, credits.
- **Org/teams** model for SMBs (members, seats).
- **Done when:** real users sign up; data is per-user; roles gate the verifier queue + admin.

### Phase 3 — Real verification & anti-fraud *(2–4 weeks)* 🔴 gate for reward=money
**Goal:** make verification trustworthy before value is attached.
- **FastAPI microservice**: image/waste classification + **duplicate (perceptual hash) + anomaly detection**; replace `assessEvidence` stub via the existing verification seam.
- Keep **human review** for low-confidence/flagged items; add verifier SLA + audit log.
- Rate-limit submissions; ge/time sanity checks; per-user caps.
- **Done when:** measurable precision on a test set; duplicates/obvious fakes rejected; AI = advisory, human decides.

### Phase 4 — Go live on Algorand *(0.5 week, mostly ops)*
**Goal:** flip rewards/anchoring from simulated → real.
- Run `cmd/setup-asa` with a funded TestNet (then MainNet) treasury; set `ALGORAND_MNEMONIC` + `ALGORAND_REWARD_ASA`.
- Verify ASA issuance, opt-in, claim, and credit anchors are real on explorer.
- **Done when:** a reward + a credit anchor appear on-chain; UI shows ANCHORED not SIMULATED.

### Phase 5 — Monetization via partners *(3–5 weeks)* — Tier 2 revenue
**Goal:** real revenue without becoming a bank or a registry.
- **SMB B2B2C subscription** (copy Ecologi): **headcount-based** monthly plan; employer dashboard + team meter; Stripe billing.
- **Recognised-credit resale**: integrate a credit API (Patch/Cloverly/Sylvera-sourced) so the "real credit" leg sells *accredited* credits; keep CGRO proofs separate.
- **Payment/off-ramp partner** (Transak/MoonPay/Stripe) owns KYC/settlement; CarbonGero never custodies fiat.
- **Done when:** an SMB can subscribe and pay; a corporate can buy a recognised credit; no fiat on our books.

### Phase 6 — Retention & engagement *(2–3 weeks)* — the moat
**Goal:** beat the ~12-week drop-off (DEEP-RESEARCH #5).
- **Cooperative teams + shared goal meters** (not punitive leaderboards); **streaks**; gentle **email/push nudges** (verify decision, reward claimed, sale).
- Redemption catalog wired to real CGRO balances; "impact story" shareable cards.
- **Done when:** streaks + notifications live; a team meter works; D7/D30 retention instrumented.

### Phase 7 — Beta launch + measurement *(1–2 weeks)*
**Goal:** launch to a real cohort and measure against targets.
- Product analytics (PostHog free): funnel (land→calc→signup→submit→verified→reward), activation, D7/D30 retention, NPS.
- Closed beta: a few SMBs + their employees (B2B2C); segmented from the waitlist already being collected.
- Feedback loop + weekly iteration.
- **Done when:** KPIs tracked against the gates below; first paying SMB.

### Phase 8 — Scale *(ongoing)*
Mobile (Expo), localization (languages + country emission factors), more activity categories, MainNet, SOC2-path security, and — only if it ever makes sense — the multi-year journey toward recognised methodology/accreditation.

---

## PART C — Launch gates & KPIs ("is it market-ready?" — measured)

**Compliance gates (all must be green before monetized launch — "knowledge awareness"):**
- [ ] ToS + Privacy + consent live; legal entity formed
- [ ] No "carbon-neutral/certified/net-zero" claims; two-tier labelling enforced
- [ ] Payment/KYC handled by a licensed partner (no fiat custody)
- [ ] CGRO positioned as earned utility/impact token, no profit promise
- [ ] Recognised-credit leg sources accredited credits only

**Integrity gates:**
- [ ] AI verification precision ≥ target on a held-out set; duplicate-rejection working
- [ ] Human-in-the-loop for flagged items; full audit trail
- [ ] Anti-abuse: per-user caps + rate limits + anomaly flags

**Product/ops gates:**
- [ ] Real auth; per-user data; roles enforced
- [ ] Error tracking + uptime monitoring + rollback runbook
- [ ] Activation (land→first verified action) and **D30 retention** instrumented with targets

**Readiness scoring to re-run at each phase:** re-score Part A; **Tier-1 (voluntary beta)** ships when Phase 0–2 are green; **Tier-2 (monetized B2B2C)** when 0–5 + compliance gates are green; **Tier-3** when integrity + payments/KYC gates are green.

---

## Sequencing summary (critical path)
`Phase 0 harden → Phase 1 compliance → Phase 2 auth` unlocks a safe **voluntary beta**.
Then `Phase 3 verification + Phase 5 partners` unlock **revenue** (SMB B2B2C + recognised-credit resale). `Phase 4` (on-chain) and `Phase 6` (retention) run in parallel where capacity allows. `Phase 7` measures; `Phase 8` scales.

**The one-line strategy:** ship a legally-safe, transparent **voluntary proof + engagement** product with an SMB subscription and an accredited-credit resale leg — *earn the right to issue your own credits later*, don't claim it on day one.
