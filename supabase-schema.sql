-- AirBloom Tracker Database Schema
-- Run this in Supabase SQL Editor

-- Create devices table
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    api_key TEXT NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_devices_is_active ON public.devices(is_active);
CREATE INDEX IF NOT EXISTS idx_devices_created_at ON public.devices(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read devices
CREATE POLICY "Anyone can view devices"
    ON public.devices
    FOR SELECT
    USING (true);

-- Create policy: Anyone can insert devices (we'll add auth later)
CREATE POLICY "Anyone can insert devices"
    ON public.devices
    FOR INSERT
    WITH CHECK (true);

-- Create policy: Anyone can update devices (we'll add auth later)
CREATE POLICY "Anyone can update devices"
    ON public.devices
    FOR UPDATE
    USING (true);

-- Create policy: Anyone can delete devices (we'll add auth later)
CREATE POLICY "Anyone can delete devices"
    ON public.devices
    FOR DELETE
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for devices table
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;

-- Insert sample device (optional - remove if not needed)
-- INSERT INTO public.devices (name, channel_id, api_key, location, is_active)
-- VALUES ('Sample Device', '123456', 'sample_key', 'Sample Location', false);

-- Verify table creation
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'devices'
ORDER BY ordinal_position;
