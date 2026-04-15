-- TEMPORARY FIX: Disable RLS to test if that's the issue
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'devices';
-- Should show: rowsecurity = false

-- Test query (should work now)
SELECT * FROM public.devices;

-- ============================================
-- IMPORTANT: After testing, re-enable RLS
-- ============================================
-- Run this after confirming the app works:
-- ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
