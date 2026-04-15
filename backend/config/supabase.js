/**
 * Supabase Client Configuration
 * Backend client with service role for admin operations
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[Supabase] Missing environment variables');
  console.error('[Supabase] Required: SUPABASE_URL, SUPABASE_SERVICE_KEY');
  throw new Error('Supabase configuration missing');
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('[Supabase] Client initialized successfully');
console.log('[Supabase] URL:', supabaseUrl);

module.exports = supabase;
