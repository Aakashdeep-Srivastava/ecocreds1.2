-- CarbonGero — community engagement: pledges + waitlist ("get involved / book
-- for future"). Feeds the public Global Meter. Idempotent.

CREATE TABLE IF NOT EXISTS community_signups (
  id         text PRIMARY KEY,
  kind       text NOT NULL,                 -- PLEDGE | WAITLIST
  name       text,
  email      text,
  role       text,                          -- individual | smb | verifier | project
  message    text,
  target_kg  double precision NOT NULL DEFAULT 0,  -- pledged future avoided CO2 (kg/yr)
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_kind_idx ON community_signups (kind, created_at DESC);
