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
  submit/index.go         POST /api/submit   → full MVP flow, returns proof + reward
  proofs/index.go         GET  /api/proofs   → Proof of Sustainability registry
  stats/index.go          GET  /api/stats    → registry aggregates
  wallet/index.go         GET/POST /api/wallet → link wallet / Pera login (returns user)
  rewards/index.go        GET  /api/rewards  → reward-token summary + issuance history
  assets/index.go         GET  /api/assets   → reward-ASA descriptor (asa id, live flag)
  account/index.go        GET  /api/account  → live on-chain ASA holdings (indexer)
/migrations/               SQL schema (0001_init, 0002_phase4_assets) — idempotent
/pkg/                      Shared Go (NOT `internal/` — see note below)
  db/        serverless-friendly *sql.DB singleton (lib/pq, Neon)
  carbon/    GHG engine: AD × EF × OF, net = gross − leakage (PRD §5.5)
  chain/     Algorand: anchor.go (proof anchor), asa.go (reward ASA issuance),
             indexer.go (on-chain holdings), algorand.go (algod/txn plumbing)
  store/     business logic: Submit(), ListProofs(), GetStats(), reward issuance,
             ListRewards(), GetRewardSummary(), GetAccountSnapshot(), LinkWallet()
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
  `ai_assessments`, `impact_assessments`, `sustainability_proofs` (+ `proof_seq`),
  and the Phase-4 asset layer: `digital_assets`, `reward_issuances`,
  `blockchain_transactions`, `asset_transfers`. Reproduce from `/migrations/*.sql`.
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

## 6b. Reward ASA issuance + asset indexing (Phase 4 — IMPLEMENTED)

On a verified proof, `store.issueReward` grants a **CarbonGero Reward (CGRO)**
ASA — a *voluntary platform reward, not a carbon credit* (PRD §6.2.A). 1 CGRO per
kgCO2e (minimum 1). `chain.IssueReward` mirrors the anchor design:

- **Config-gated:** real on-chain transfer needs `ALGORAND_MNEMONIC` (funded
  treasury) **and** `ALGORAND_REWARD_ASA` (the reward ASA id). Otherwise it
  records a `SIMULATED` issuance.
- **Opt-in aware:** if the recipient wallet hasn't opted into the ASA, it returns
  `OPTIN_REQUIRED` (actionable) rather than failing. No wallet linked → `PENDING_WALLET`.
- **Statuses** persist on `reward_issuances.status`: `ISSUED | SIMULATED |
  OPTIN_REQUIRED | PENDING_WALLET | FAILED`. Every on-chain tx is also logged to
  `blockchain_transactions`.
- **Asset indexer (`pkg/chain/indexer.go`)**: `GET /api/account?address=` queries
  the AlgoNode TestNet indexer for a wallet's live ASA holdings + reward balance.
- **Client opt-in**: the Rewards page (`RewardWallet.tsx`) builds a 0-amount asset
  transfer with `algosdk` and signs it via Pera (use-wallet) — no smart contract.

**No smart contracts / PyTeal.** Rewards use layer-1 ASAs directly (create +
transfer + opt-in), which need no TEAL. Freeze/clawback/retirement contracts
(PRD §6.3) remain future work.

### Env vars (Algorand)

| Var | Purpose | Default |
|---|---|---|
| `ALGORAND_MNEMONIC` | Funded TestNet treasury (enables real anchoring + issuance) | — (simulated) |
| `ALGORAND_REWARD_ASA` | Reward ASA id to issue/opt into | — (simulated) |
| `ALGORAND_ALGOD` | algod endpoint | AlgoNode TestNet |
| `ALGORAND_INDEXER` | indexer endpoint | AlgoNode TestNet |

## 7. Pera wallet login (Phase 1/5 — IMPLEMENTED)

`/login` and `/signup` offer **Continue with Pera Wallet**. On connect, the
address is linked server-side (`POST /api/wallet` → `store.LinkWallet`, returns
the user) and promoted to the client session (`AuthContext.setWalletSession`,
persisted in `localStorage`). The dashboard identity + sign-out reflect it.

## 8. Honesty / scope

- **AI assessment** is still a deterministic stub (`pkg/store.assessEvidence`).
  Real image/waste classification + duplicate/anomaly detection = PRD Phase 2 (FastAPI).
- Impact is always labeled **estimated**, never a certified carbon credit.
- Reward issuance runs in **simulated** mode until the treasury is funded and a
  reward ASA is created; the UI always shows which mode produced a record.

## 8b. Freemium claim + DB keep-alive

- **Freemium model**: rewards accrue off-chain while anonymous
  (`reward_issuances.status = PENDING_WALLET`). The user claims them to their
  Algorand wallet via `POST /api/rewards/claim` (gated on a connected Pera
  wallet) — one on-chain transfer settles the accrued balance. See
  `RewardWallet.tsx`.
- **Keep-alive**: `GET /api/cron/keepalive` does one tiny upsert into
  `heartbeats`; a Vercel cron (`vercel.json`, every 12h → daily on Hobby) hits it
  so the Neon project stays active during slow onboarding. We deliberately do
  **not** keep the compute warm 24/7 — scale-to-zero is what preserves the free
  compute budget. Optionally set `CRON_SECRET` to lock the endpoint.

## 8c. Going live on Algorand (one-time, no secret in chat)

Run `go run ./cmd/setup-asa` locally with a **funded** TestNet account's mnemonic
(`ALGORAND_MNEMONIC`). It creates the CGRO ASA and prints `ALGORAND_REWARD_ASA`.
Set both env vars in Vercel (Production) and redeploy — issuance + claims flip
from `SIMULATED` to real on-chain transfers automatically.

## 9. Next steps (per PRD roadmap)

1. Fund the TestNet treasury + create the CGRO ASA → flip issuance live (run
   `cmd/setup-asa`, set the two env vars; no code change).
2. Real auth + organisations (replace the single demo user).
3. FastAPI AI microservice for evidence classification (replace the stub).
4. Smart-contract controls (freeze/clawback/retirement), human review queue, ESG
   reporting + marketplace (Phase 5–6).
