-- Reschedule feature: lets an admin propose a new date/time to a client
-- instead of outright rejecting a pending reservation. The client confirms
-- or declines via a tokenized link emailed to them.
--
-- Run this SQL in your Supabase SQL Editor.

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS reschedule_token TEXT,
  ADD COLUMN IF NOT EXISTS reschedule_date DATE,
  ADD COLUMN IF NOT EXISTS reschedule_time TEXT,
  ADD COLUMN IF NOT EXISTS reschedule_status TEXT
    CHECK (reschedule_status IN ('proposed', 'accepted', 'declined'));

-- The token is the unguessable secret used in the client's email link.
-- Unique (ignoring NULLs) so a token always maps to at most one reservation,
-- and indexed for fast lookups by the public confirm/decline endpoint.
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_reschedule_token
  ON reservations (reschedule_token)
  WHERE reschedule_token IS NOT NULL;
