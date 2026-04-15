-- Fix RLS Policies for Devices Table
-- Run this in Supabase SQL Editor if you're getting 401 errors

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'devices';

-- Drop existing policies (in case they're misconfigured)
DROP POLICY IF EXISTS "Anyone can view devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can insert devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can update devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can delete devices" ON public.devices;

-- Recreate policies with correct syntax
-- Policy 1: Allow SELECT (read) for everyone
CREATE POLICY "Enable read access for all users"
ON public.devices
FOR SELECT
USING (true);

-- Policy 2: Allow INSERT for everyone
CREATE POLICY "Enable insert access for all users"
ON public.devices
FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow UPDATE for everyone
CREATE POLICY "Enable update access for all users"
ON public.devices
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy 4: Allow DELETE for everyone
CREATE POLICY "Enable delete access for all users"
ON public.devices
FOR DELETE
USING (true);

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'devices';

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'devices';

-- Test query (should return empty array, not error)
SELECT * FROM public.devices LIMIT 1;
