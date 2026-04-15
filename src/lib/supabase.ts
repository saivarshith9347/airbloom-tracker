/**
 * Supabase Client Configuration
 * Frontend client for database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables');
  console.error('[Supabase] Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string;
          name: string;
          channel_id: string;
          api_key: string;
          location: string | null;
          is_active: boolean;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id: string;
          name: string;
          channel_id: string;
          api_key: string;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          channel_id?: string;
          api_key?: string;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
}

export type DeviceRow = Database['public']['Tables']['devices']['Row'];
export type DeviceInsert = Database['public']['Tables']['devices']['Insert'];
export type DeviceUpdate = Database['public']['Tables']['devices']['Update'];
