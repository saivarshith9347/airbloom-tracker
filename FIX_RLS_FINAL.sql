-- FINAL FIX: Drop and recreate RLS policies
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.devices;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.devices;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.devices;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.devices;
DROP POLICY IF EXISTS "Anyone can view devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can insert devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can update devices" ON public.devices;
DROP POLICY IF EXISTS "Anyone can delete devices" ON public.devices;

-- Step 2: Create new policies with correct syntax
CREATE POLICY "Enable read access for all users"
ON public.devices
FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.devices
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON public.devices
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
ON public.devices
FOR DELETE
USING (true);

-- Step 3: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd as operation
FROM pg_policies
WHERE tablename = 'devices'
ORDER BY cmd;

-- Step 4: Test query (should return empty array, not error)
SELECT * FROM public.devices LIMIT 1;
