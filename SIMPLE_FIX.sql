-- SIMPLE FIX: Just disable RLS
-- This will make your app work immediately
-- Run this in Supabase SQL Editor

-- Disable Row Level Security
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'devices';
-- Should show: rowsecurity = false

-- Test query
SELECT * FROM public.devices;
-- Should return empty array (no error)
