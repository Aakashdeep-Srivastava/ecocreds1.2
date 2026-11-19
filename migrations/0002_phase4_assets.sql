-- CarbonGero — Phase 4 (Algorand asset layer).
-- ASA reward issuance, on-chain transaction log, and asset transfer history.
-- Idempotent: safe to re-run.

-- Registry of Algorand Standard Assets the platform knows about.
-- asset_class distinguishes voluntary platform REWARD tokens from
-- CARBON_CREDIT assets (PRD §6.2) — the two must never be conflated.
CREATE TABLE IF NOT EXISTS digital_assets (
  id              text PRIMARY KEY,            -- e.g. ASA-REWARD-CGRO
  asa_id          bigint NOT NULL DEFAULT 0,   -- Algorand asset id (0 = simulated/unfunded)
  asset_class     text NOT NULL DEFAULT 'REWARD',
  unit_name       text NOT NULL,
  asset_name      text NOT NULL,
  decimals        int  NOT NULL DEFAULT 0,
  total           bigint NOT NULL DEFAULT 0,
  creator_address text,
  network         text NOT NULL DEFAULT 'simulated',
  create_tx       text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- A reward (ASA units) granted for a verified Proof of Sustainability.
-- status: ISSUED (on-chain transfer confirmed), SIMULATED (no funded treasury),
--         OPTIN_REQUIRED (wallet must opt in first), PENDING_WALLET (no wallet
--         linked yet), FAILED.
CREATE TABLE IF NOT EXISTS reward_issuances (
  id             text PRIMARY KEY,
  proof_id       text,
  user_id        text,
  wallet_address text,
  asa_id         bigint NOT NULL DEFAULT 0,
  amount         bigint NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'PENDING_WALLET',
  network        text NOT NULL DEFAULT 'simulated',
  tx_id          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reward_issuances_user_idx ON reward_issuances (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS reward_issuances_proof_uidx ON reward_issuances (proof_id);

-- Generic on-chain transaction log (anchor + asset ops).
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id              text PRIMARY KEY,
  tx_id           text,
  network         text NOT NULL DEFAULT 'simulated',
  kind            text NOT NULL,               -- ANCHOR | ASA_CREATE | ASA_TRANSFER | OPTIN
  ref_id          text,                        -- proof id / issuance id
  address         text,
  status          text NOT NULL DEFAULT 'SIMULATED',
  confirmed_round bigint NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blockchain_transactions_kind_idx ON blockchain_transactions (kind, created_at DESC);

-- Asset ownership-change history (PRD FR-033/FR-035).
CREATE TABLE IF NOT EXISTS asset_transfers (
  id           text PRIMARY KEY,
  asa_id       bigint NOT NULL DEFAULT 0,
  from_address text,
  to_address   text,
  amount       bigint NOT NULL DEFAULT 0,
  tx_id        text,
  network      text NOT NULL DEFAULT 'simulated',
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS asset_transfers_asa_idx ON asset_transfers (asa_id, created_at DESC);
