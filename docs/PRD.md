# CarbonGero — Product Requirements Document

> **Product name:** **CarbonGero** (always — not "EcoVoyage" or "EcoCreds", which are retired/source names).
> **Source vision:** the *EcoVoyage* pitch deck (Team Yogya — Mind the Product, E‑Summit '25) — its ideas inform this product, but the product is **CarbonGero**.
> **Current codebase:** `ecocreds1.2` — Next.js 14 App Router app, deployed at **https://xecocreds.vercel.app**.
> This PRD reconciles the deck's product vision with the existing implementation and lays out a **phase‑wise build plan**.

---

## 1. Vision & One‑liner

**Carbon‑credit‑as‑a‑Service (CoaaS) for the travel ecosystem.**
An incentive‑oriented platform that lets individuals, corporates, and governments **track, earn, trade, and redeem carbon credits** across three interconnected sectors — **Transport, Hospitality, and Events/Tourism** — turning sustainable choices into measurable, rewardable action.

*"Smart for Business, Great for Planet."*

## 2. Problem

- Travel, tourism, events, and hospitality generate **high carbon emissions** (transport = largest contributor; hotel food services alone ≈ 70% of hotel emissions).
- **Low awareness** of carbon credits and their benefits → weak trust/engagement.
- **Hard to track** consumer sustainability behaviour → data‑integrity gap.
- **Costly/complex** for businesses to integrate carbon programs without hurting UX.
- **Fragmented standards** and regulation.

## 3. Market (from deck)

- 150M urban Indian travelers (TAM); 262M vehicles projected by 2050.
- Hospitality sector → USD **541.7B by 2035** (9.7% demand CAGR).
- Events/exhibition market ≈ **$8.44B**; media & entertainment ≈ **$48B**.
- EV sales projected at **35% of total** by 2030.

## 4. User Types & Roles

| Role | Segment | Core jobs |
|------|---------|-----------|
| **Individual traveler** | B2C | Track footprint, earn credits (transport/hotel/event), join challenges, redeem rewards |
| **Corporate / Enterprise** | B2B | Company‑wide dashboard, employee engagement campaigns, ESG/CSR reporting, redeemable programs |
| **Government body** | B2G | Carbon‑credit framework, public‑transport campaigns, certification/accountability |
| **Partner** (hotel, airline, aggregator) | B2B2C | Issue/accept credits, sustainable‑stay consent, redemption vouchers, API sync |
| **Event organizer** | B2B | GreenGather program, QR check‑in, waste programs, booth/platform fees |

## 5. Product Pillars (three sectors)

### 5.1 Transport (CoaaS)
- One‑stop tracking of carbon credits; partnerships across channels; credits redeemable via coupons; awareness program; **linked to Carbon Credit Trading Scheme**.
- B2G: government‑backed certification (NSCICM, BEE), e‑buses/metros/e‑cycles, anti‑double‑counting.
- B2B: corporate campaigns, dashboards; aggregator credit programs (Ola, Rapido, BluSmart); airline SAF/carbon‑capture (Star Alliance) → upgrades, emission dashboards.
- B2C app flow: download → login/customize → **upload bills/proofs + scan QR to earn** → join streaks/challenges → redeem → track emissions.

### 5.2 Hospitality (CoaaS)
- **Guest Credit Program** — "Sustainable Stay consent": towel/linen reuse, low‑energy rooms, EV taxis, plant‑based dining, no single‑use plastics → earn credits.
- **Hotel Credit Program** — Green Hotel Certification based on energy efficiency, waste reduction, afforestation funding; **"Carbon Neutral Stay"** cert.
- **Credit score & redemption** — discounts on future stays, room upgrades, spa/meal vouchers, donations to sustainability projects.
- **Tech:** app + web dashboard; API with Hotel Management Systems & booking platforms (MakeMyTrip, Goibibo, Agoda, direct sites).

### 5.3 Events / Tourism — **GreenGather Program**
- Register for event → input transport/food → **emissions calculated** → app suggests lower‑emission substitutes.
- Earn by uploading proof (public transport, EVs, eco‑hotels, plant‑based meals); participate in streaks/challenges/leaderboards.
- Smart digital event: **QR‑based check‑in**, QR food tags, smart recycling bins, AI/blockchain carbon tracking, reverse vending machines ("Trash to Treasure").
- Redeem: event discounts, merch, food, carbon offsets.

## 6. Core Systems

### 6.1 Carbon Credit Scoring
Combustion / Direct GHG emissions formula from the deck:

```
GHG_Direct = Activity Data (AD) × Emission Factor (EF) × Oxidation Factor (OF)
  GHG_Direct — Direct GHG Emissions [t CO2]
  AD — Activity data [TOE | kCal | kg | tonne of material]
  EF — Emission factor [t CO2/TOE | g CO2/kCal]
  OF — Oxidation factor [dimensionless]
```

A **standard score card** converts emissions *saved* → carbon credits.

### 6.2 Earn → Track → Trade → Redeem loop
- **Earn:** sustainable transport, hotel programs, GreenGather events, bonus credits, referrals (50 credits/user).
- **Track:** real‑time, AI + blockchain for accuracy/transparency; personalized dashboard.
- **Trade:** Carbon Credit Trading Scheme linkage; carbon‑credit exchanges (ACX in appendix).
- **Redeem:** hotel upgrades, flight discounts, vouchers, event passes, offsets/donations.

### 6.3 Gamification — **GreenPrints Engagement Program**
- EcoChallenger leaderboards, achievement badges, monthly themes ("Zero Emission Commute Week").
- Social: share achievements, **EcoTribes** group challenges, EcoMentor pairing, in‑app forum.
- Loyalty tiers: **Seedling → Sapling → Mighty Oak** with escalating perks.
- Seasonal campaigns ("Summer of Sustainability", "New Year, New Footprint").
- **EcoQuest:** AI travel planner optimizing itineraries for minimal footprint.

## 7. Revenue Model

| Stream | Detail |
|--------|--------|
| **Subscriptions** | Basic / Premium / Enterprise tiers for travel businesses |
| **Data & analytics** | ESG sustainability reports (₹30k–40k/report), API access, advisory |
| **Transaction fees** | 2–3% on carbon‑credit trades; 5–10% redemption commission from partners |
| **Event‑based** | Platform fee (organizers/govt), booth fee (reverse vending), eco‑product revenue share |
| **Gamification** | Challenge entry fees (₹50–500); Green Loyalty subscription (₹299–599/mo) |

## 8. KPIs & Targets

- **Adoption:** Active Users / TAM → Y1 7.5M (5%), Y2 30M (20%), Y3 60M (40%).
- **LTV:** ARPU ₹800 × 4‑yr lifespan. **CAC:** marketing cost / new users. **ROI (Y1):** rev 2.5B vs cost 1.5B.
- **Environmental:** 1M metric tons CO₂ offset (Y1); 200 kg CO₂ reduction/user/yr; 50% sustainable bookings by Y3.
- **Engagement:** DAU/MAU ≥ 0.3, avg session ≥ 5 min by end Y1.
- **Partners:** 1,000 by Y1 → 5,000 by Y3; 40% B2B revenue by Y3.

## 9. GTM (from deck)

- **0–6 mo (Awareness):** launch key B2B/B2C partners, digital campaigns, influencers, early‑adopter incentives.
- **6–18 mo (Scale):** corporate subscriptions, govt agencies, offline activations (airports/stations/events), expand API integrations.
- **18+ mo (Domination):** SE Asia & Middle East, global carbon exchanges, certifications, AI personalization.

---

## 10. Current Implementation vs. Vision (gap analysis)

**Exists today** (`src/app/…`):
- ✅ Marketing landing page (redesigned — "Carbon Almanac" system)
- ✅ Auth: login / signup (demo mode, no backend — personal user persona)
- ✅ Dashboard shell: sidebar, topbar, metric cards, emissions chart
- ✅ Routes (static/mock data): `travel`, `hotels`, `challenges`, `Rewards`, `analytics`, `scanner` (QR), `profile`, `corporate` + `corporate/reports`

**Not yet built (gaps vs. deck):**
- ❌ Real auth & user accounts; persistence (DB)
- ❌ Carbon‑credit scoring engine (the GHG formula + scorecard)
- ❌ Earn flow: bill/proof upload, QR scan → credits awarded
- ❌ Credit wallet / ledger; trading; redemption catalog with real fulfilment
- ❌ Gamification engine (streaks, leaderboards, EcoTribes, tiers, badges)
- ❌ GreenGather events module (registration, footprint calc, QR check‑in)
- ❌ Hospitality "Sustainable Stay consent" + Green Hotel certification
- ❌ Corporate ESG reporting with real data; partner/API integrations
- ❌ AI travel planner (EcoQuest), AI insights
- ❌ Backend/API, blockchain ledger (or a credible mock), notifications

---

## 11. Technical Direction

- **Framework:** Next.js App Router. *Recommendation: upgrade 14 → latest (15/16) as Phase 0* (requires React 19; verify `react-chartjs-2`, `html5-qrcode`). Gives Server Actions, Cache Components, longer function timeouts.
- **Design system:** "Carbon Almanac" — Fraunces (display) + Hanken Grotesk (UI) + JetBrains Mono (data); paper/forest/lime tokens in `tailwind.config.js` + `globals.css`. **Reuse everywhere.**
- **Data:** start with typed mock/fixtures (labelled as mock), then a real DB (Postgres via Vercel Marketplace / Neon) + API routes/Server Actions.
- **Auth:** Clerk (Vercel‑native) or NextAuth when real accounts are needed.
- **Carbon engine:** pure‑TS module implementing GHG formula + scorecard; unit‑tested; feeds wallet ledger.
- **Charts:** chart.js (already in use) with the Almanac palette; mounted‑guard to avoid SSR hydration mismatch.

---

## 12. Phase‑wise Build Plan

### Phase 0 — Foundations (infra & polish)
- Optional: upgrade Next.js to latest + React 19; verify build & key libs.
- Solidify the Carbon Almanac design system; apply to **every** existing route (travel, hotels, challenges, rewards, analytics, scanner, profile, corporate).
- Centralize mock data into a typed `lib/data` layer (clearly labelled mock).
- **Exit:** every page on‑brand; clean build; no hydration errors.

### Phase 1 — The Credit Core (B2C MVP)
- **Carbon scoring engine** (GHG formula + scorecard) as a tested TS module.
- **Credit wallet / ledger**: balance, history, earn/spend transactions.
- **Earn flows:** manual activity logging (transport/hotel/meal) → credits; QR‑scan stub; bill/proof upload stub.
- **Redemption catalog:** browse rewards, "redeem" against balance (mock fulfilment).
- **Dashboard:** real numbers wired to wallet + scoring.
- **Exit:** a user can log an activity, earn credits, see them in the wallet, and redeem.

### Phase 2 — Engagement (GreenPrints)
- Streaks & monthly challenges, leaderboards, badges, loyalty tiers (Seedling→Mighty Oak).
- Profile with achievements; referral codes (50 credits).
- Seasonal campaign framework.
- **Exit:** measurable engagement loop; DAU/MAU‑style metrics instrumented.

### Phase 3 — Sector Modules
- **Hospitality:** Sustainable Stay consent flow; hotel credit program; Green Hotel cert view.
- **Events (GreenGather):** event registration, footprint calc + substitute suggestions, QR check‑in, waste program.
- **Transport:** aggregator‑style earn (mock Ola/Rapido), EV multipliers.
- **Exit:** all three pillars have a working credit loop.

### Phase 4 — B2B / B2G & Reporting
- Corporate dashboard with org‑wide aggregation; employee campaigns.
- ESG/CSR report generation (PDF/export) from real data.
- Partner/admin views; (mock) API integration surfaces.
- **Exit:** a corporate admin can run a campaign and export an ESG report.

### Phase 5 — Intelligence & Scale
- EcoQuest AI travel planner + AI insights (via Vercel AI Gateway).
- Real backend (DB + auth), notifications.
- Carbon‑credit trading surface; exchange integration mock.
- **Exit:** AI‑assisted, persistent, trade‑capable platform.

---

## 13. Immediate Next Steps (proposed)
1. Decide on the **Next.js upgrade** (latest vs. stay on 14 for now).
2. **Phase 0** cleanup: apply the design system to the remaining dashboard routes + centralize mock data.
3. Begin **Phase 1 — Credit Core**.

*Living document — update as phases complete.*
