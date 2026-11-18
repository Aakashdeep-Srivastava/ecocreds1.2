# CarbonGero — Backend & Monorepo Wiring

How the **Next.js frontend** and the **Go backend** live in **one repository** and
deploy together on **Vercel (free)**, backed by **Neon Postgres**.

> Status: MVP vertical slice (PRD §11 — Recycling → Proof of Sustainability) is
> **live and working**. Later PRD phases (real Algorand ASA issuance, FastAPI AI
> microservices, marketplace, ESG reports) are scaffolded conceptually but stubbed.

---

## 1. Why this structure

The PRD (§9) specifies a **Go** core backend, **FastAPI** AI services, **Postgres**,
and a **Next.js** web app. We wanted all of it in **one repo**, deployed for free.

Vercel supports **Go serverless functions** alongside a Next.js app in the same
project: the Go runtime auto-detects a root `go.mod` and compiles each function
under `/api/<name>/index.go`. The Next.js App Router serves everything else; the
root `/api/*` paths are owned by the Go functions. One `git push` deploys both.

```
┌──────────────────────── xecocreds.vercel.app ────────────────────────┐
│  Next.js (App Router)  ──fetch('/api/…')──►  Go Functions (/api/*)    │
│  src/app/**                                   api/<name>/index.go      │
│  (UI, dashboard, proofs)                      └─► pkg/** (shared Go)   │
│                                                     │                  │
│                                                     ▼                  │
│                                            Neon Postgres (DATABASE_URL)│
│                                                     │                  │
│                                            chain.Anchor() → Algorand   │
│                                                 (mock testnet tx)      │
└───────────────────────────────────────────────────────────────────────┘
```

## 2. Repository layout

```
/go.mod, /go.sum          Go module `carbongero` (root → Vercel Go runtime)
/api/
  health/index.go         GET  /api/health   → db ping
  submit/index.go         POST /api/submit   → full MVP flow, returns the proof
  proofs/index.go         GET  /api/proofs   → Proof of Sustainability registry
  stats/index.go          GET  /api/stats    → registry aggregates
/pkg/                      Shared Go (NOT `internal/` — see note below)
  db/        serverless-friendly *sql.DB singleton (lib/pq, Neon)
  carbon/    GHG engine: AD × EF × OF, net = gross − leakage (PRD §5.5)
  chain/     Algorand anchor (deterministic mock tx id + explorer URL)
  store/     business logic: Submit(), ListProofs(), GetStats()
  httpx/     JSON/error response helpers
/src/app/                 Next.js frontend
  dashboard/submit        the submit-activity flow (POST /api/submit)
  dashboard/proofs        the registry (GET /api/proofs + /api/stats)
```

### Two Vercel-specific Go gotchas we hit (and fixed)

1. **`internal/` is reserved.** Go forbids importing `…/internal/…` from outside
   the parent tree. Vercel compiles each function in a synthetic package, which is
   *outside* the module tree, so `carbongero/internal/httpx` was rejected. → We
   use **`pkg/`** instead of `internal/`.
2. **One package per directory.** Vercel compiles the whole `/api` folder as one
   package, so four flat `api/*.go` files each with `func Handler` collided
   (`Handler redeclared`). → Each function lives in its **own subdirectory**
   `api/<name>/index.go`, so each is a separate package / separate function.

## 3. Database (Neon Postgres)

- Project `carbongero` (Neon, `aws-us-east-1`), Postgres 17, free tier.
- `DATABASE_URL` stored as a Vercel env var (production/preview/development),
  with `sslmode=require` (we drop `channel_binding` for `lib/pq` compatibility).
- Schema (tables): `users`, `methodologies`, `activities`, `evidence`,
  `ai_assessments`, `impact_assessments`, `sustainability_proofs` (+ `proof_seq`).
- The Go `pkg/db` keeps a tiny pool (`MaxOpenConns=2`) suited to serverless.

## 4. The MVP flow (`POST /api/submit`)

```
activity → SHA-256(evidence) → AI stub (confidence, action)
        → carbon.Calculate(AD, EF, OF)  [PRD §5.5]
        → POS-YYYY-NNNNNN proof (sequence)
        → chain.Anchor(proof, hash) → algorand-testnet tx + explorer URL
        → persisted atomically in one transaction
```

Returns `{ activity, ai, impact, proof }`. The frontend renders the proof card
with the impact, evidence-hash, verification status, and the on-chain anchor link.

## 5. Local development

- Next only: `npm run dev` (the `/api/*` Go functions are **not** served by
  `next dev` — use `vercel dev` to run both locally, or test against production).
- Go: `go build ./...` (all functions compile as separate packages); set
  `DATABASE_URL` to the Neon string to exercise the store directly.

## 6. Algorand anchoring (Phase 4 — IMPLEMENTED)

`pkg/chain` submits a **real Algorand TestNet transaction** (go-algorand-sdk v2)
anchoring each proof: a 0-ALGO self-payment whose **note field** carries
`{app, proof, evidence-hash}`, sent via the public AlgoNode node
(`https://testnet-api.algonode.cloud`), confirmed with `WaitForConfirmation`.
The real tx id links to the Lora explorer.

- **Config-gated:** enabled by `ALGORAND_MNEMONIC` (a funded TestNet account).
- **Graceful fallback:** on any error (unfunded/timeout) it returns a deterministic
  `simulated` anchor so the flow never breaks. The proof's `blockchain_status`
  (`ANCHORED` vs `SIMULATED`) and `blockchain_network` tell the UI the truth — a
  simulated anchor is never shown as on-chain-verified.
- **To activate:** fund the account address once at a TestNet faucet; no redeploy.

## 7. Honesty / scope

- **AI assessment** is still a deterministic stub (`pkg/store.assessEvidence`).
  Real image/waste classification + duplicate/anomaly detection = PRD Phase 2 (FastAPI).
- Impact is always labeled **estimated**, never a certified carbon credit.
- Next: Pera wallet connect (user wallet-address association, FR-006 — note MetaMask
  does **not** support Algorand), ASA issuance for rewards, real auth.

## 7. Next steps (per PRD roadmap)

1. Real auth (users table is ready) + wallet association.
2. FastAPI AI microservice for evidence classification (replace the stub).
3. Real Algorand testnet anchoring via AlgoKit; ASA issuance workflow.
4. Human review queue + methodology/emission-factor admin.
5. ESG reporting + marketplace (Phase 5–6).
