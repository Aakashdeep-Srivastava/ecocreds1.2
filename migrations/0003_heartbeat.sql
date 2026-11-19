-- CarbonGero — DB keep-alive heartbeat.
-- A single-row table the cron pings so the Neon project stays active during slow
-- onboarding. Minimal compute: one tiny upsert per ping. Idempotent.

CREATE TABLE IF NOT EXISTS heartbeats (
  id         text PRIMARY KEY,
  last_ping  timestamptz NOT NULL DEFAULT now(),
  ping_count bigint NOT NULL DEFAULT 0
);
