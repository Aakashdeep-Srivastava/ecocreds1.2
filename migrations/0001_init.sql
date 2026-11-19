-- CarbonGero — initial schema (Phases 1–4 core).
-- Reconstructed from the live Neon `carbongero` project so the schema is
-- reproducible from the repo. Idempotent: safe to run on an existing database.

CREATE TABLE IF NOT EXISTS users (
  id             text PRIMARY KEY,
  email          text NOT NULL,
  name           text,
  wallet_address text,
  role           text NOT NULL DEFAULT 'individual',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS methodologies (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  version         text NOT NULL DEFAULT 'v1',
  activity_type   text NOT NULL,
  emission_factor double precision NOT NULL,
  oxidation_factor double precision NOT NULL DEFAULT 1,
  unit            text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id          text PRIMARY KEY,
  user_id     text,
  category    text NOT NULL,
  description text,
  quantity    double precision NOT NULL,
  unit        text NOT NULL,
  location    text,
  status      text NOT NULL DEFAULT 'SUBMITTED',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence (
  id          text PRIMARY KEY,
  activity_id text,
  file_name   text,
  file_hash   text NOT NULL,
  mime_type   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_assessments (
  id                 text PRIMARY KEY,
  activity_id        text,
  classification     text,
  confidence         double precision,
  recommended_action text,
  model_version      text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS impact_assessments (
  id                 text PRIMARY KEY,
  activity_id        text,
  baseline_emissions double precision,
  project_emissions  double precision,
  net_reduction      double precision,
  unit               text,
  methodology_id     text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS proof_seq;

CREATE TABLE IF NOT EXISTS sustainability_proofs (
  id                  text PRIMARY KEY,
  activity_id         text,
  user_id             text,
  activity_type       text,
  evidence_hash       text,
  verification_status text NOT NULL DEFAULT 'VERIFIED',
  impact_value        double precision,
  impact_unit         text,
  impact_status       text NOT NULL DEFAULT 'ESTIMATED',
  methodology_id      text,
  blockchain_status   text NOT NULL DEFAULT 'PENDING',
  blockchain_network  text,
  blockchain_tx       text,
  created_at          timestamptz NOT NULL DEFAULT now()
);
