-- CarbonGero — human peer-review verification + carbon-credit certificates + exchange.
-- PRD §5.4 (human review), §5.6 (certified vs internal), §6.2.B (carbon credit
-- assets), §7 (marketplace). Idempotent.

-- Human peer-review verdicts on a proof (independent of AI assessment).
CREATE TABLE IF NOT EXISTS reviews (
  id              text PRIMARY KEY,
  proof_id        text NOT NULL,
  verifier_id     text,
  decision        text NOT NULL,              -- APPROVED | REJECTED
  notes           text,
  attest_network  text NOT NULL DEFAULT 'simulated',
  attest_tx       text,                        -- on-chain attestation tx (optional)
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reviews_proof_idx ON reviews (proof_id, created_at DESC);

-- Human-review gate on each proof. New proofs await review; a carbon credit can
-- only be issued from an APPROVED proof.
ALTER TABLE sustainability_proofs
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'PENDING_REVIEW';
-- Grandfather existing demo proofs so the marketplace has seed data.
UPDATE sustainability_proofs SET review_status='APPROVED' WHERE review_status='PENDING_REVIEW';

-- Carbon-credit certificates (PRD §6.2.B). A voluntary-market style record issued
-- from an APPROVED proof. NOT a registry-accredited credit unless/until real
-- accreditation is in place — labeling must stay honest.
CREATE TABLE IF NOT EXISTS carbon_credits (
  id             text PRIMARY KEY,            -- CC-YYYY-NNNNNN
  proof_id       text UNIQUE,                 -- one credit per proof (anti-double-issue)
  serial         text UNIQUE,                 -- registry-style serial
  owner_user     text,
  owner_address  text,
  project_id     text,
  registry       text NOT NULL DEFAULT 'CarbonGero (voluntary)',
  methodology_id text,
  vintage        int,                         -- vintage year
  quantity       double precision NOT NULL DEFAULT 0,
  unit           text NOT NULL DEFAULT 'kgCO2e',
  status         text NOT NULL DEFAULT 'ISSUED', -- ISSUED | LISTED | SOLD | RETIRED
  price_usdc     double precision,            -- listing price (exchange leg settles externally)
  asa_id         bigint NOT NULL DEFAULT 0,   -- on-chain credit ASA (0 until tokenized)
  anchor_network text NOT NULL DEFAULT 'simulated',
  anchor_tx      text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  listed_at      timestamptz,
  retired_at     timestamptz
);
CREATE INDEX IF NOT EXISTS carbon_credits_status_idx ON carbon_credits (status, created_at DESC);
CREATE INDEX IF NOT EXISTS carbon_credits_owner_idx ON carbon_credits (owner_user, created_at DESC);
CREATE SEQUENCE IF NOT EXISTS credit_seq;

-- Full provenance/ownership audit for a credit (PRD FR-032/033/037).
CREATE TABLE IF NOT EXISTS credit_events (
  id           text PRIMARY KEY,
  credit_id    text NOT NULL,
  kind         text NOT NULL,                 -- ISSUE | LIST | SALE | RETIRE
  actor        text,                          -- who performed it
  counterparty text,                          -- buyer/seller where relevant
  price_usdc   double precision,
  network      text NOT NULL DEFAULT 'simulated',
  tx           text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credit_events_credit_idx ON credit_events (credit_id, created_at DESC);
