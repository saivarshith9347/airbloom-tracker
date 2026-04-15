-- AirBloom Tracker - Initial Database Schema
-- Run this in your Supabase SQL editor or via Supabase CLI
-- =============================================

-- DEVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  channel_id    TEXT NOT NULL,
  api_key       TEXT NOT NULL,
  location      TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT
);

-- Index for fast active device queries
CREATE INDEX IF NOT EXISTS idx_devices_is_active ON public.devices(is_active);
CREATE INDEX IF NOT EXISTS idx_devices_created_at ON public.devices(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on the devices table
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Policy: Allow SELECT for all authenticated requests
-- (our app uses anon key with custom JWT-less auth, so we allow anon reads)
CREATE POLICY "Allow read for authenticated users"
ON public.devices
FOR SELECT
USING (true);

-- Policy: Allow INSERT for authenticated users (admin role enforced in app layer)
CREATE POLICY "Allow insert for authenticated users"
ON public.devices
FOR INSERT
WITH CHECK (true);

-- Policy: Allow UPDATE for authenticated users
CREATE POLICY "Allow update for authenticated users"
ON public.devices
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy: Allow DELETE for authenticated users
CREATE POLICY "Allow delete for authenticated users"
ON public.devices
FOR DELETE
USING (true);

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

-- Enable Realtime on the devices table
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
