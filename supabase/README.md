# Supabase Setup

## Quick Setup

1. Go to your Supabase project at https://app.supabase.com
2. Open the SQL editor (left sidebar > SQL Editor)
3. Copy and paste the contents of `migrations/20260415000000_initial_schema.sql`
4. Click "Run"

## Environment Variables

Add these to your `.env` file (or Vercel project settings):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema

### Devices Table

The `devices` table stores IoT device configurations:

| Column       | Type        | Description                          |
|--------------|-------------|--------------------------------------|
| id           | UUID        | Primary key (auto-generated)         |
| name         | TEXT        | Device display name                  |
| channel_id   | TEXT        | ThingSpeak channel ID                |
| api_key      | TEXT        | ThingSpeak API read key              |
| location     | TEXT        | Device location (optional)           |
| is_active    | BOOLEAN     | Whether device is currently active   |
| created_at   | TIMESTAMPTZ | Creation timestamp                   |
| created_by   | TEXT        | User who created the device          |

### Indexes

- `idx_devices_is_active` - Fast queries for active devices
- `idx_devices_created_at` - Ordered by creation date

### Row Level Security (RLS)

RLS is enabled with policies that allow:
- **SELECT**: All authenticated users can read devices
- **INSERT**: All authenticated users can add devices
- **UPDATE**: All authenticated users can modify devices
- **DELETE**: All authenticated users can remove devices

> **Note**: The current policies use `USING (true)` which allows all operations. For production multi-user scenarios, you may want to restrict operations based on `created_by` or implement role-based access control.

### Realtime

The `devices` table is configured for Realtime subscriptions, enabling:
- Live updates when devices are added
- Instant notifications when devices are modified
- Real-time sync across multiple clients

## Using Supabase CLI (Optional)

If you prefer using the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Verifying the Setup

After running the migration, verify the table exists:

```sql
SELECT * FROM public.devices;
```

You should see an empty table with the correct schema.

## Troubleshooting

### Migration Already Applied

If you see errors about objects already existing, the migration has already been applied. You can safely ignore these errors or use `CREATE TABLE IF NOT EXISTS` statements.

### RLS Blocking Queries

If queries are being blocked:
1. Check that RLS policies are created correctly
2. Verify you're using the correct Supabase anon key
3. Check the Supabase logs for policy violations

### Realtime Not Working

If realtime updates aren't working:
1. Verify the table is added to the `supabase_realtime` publication
2. Check that your client is properly subscribed to the channel
3. Ensure your Supabase project has Realtime enabled

## Migration History

- `20260415000000_initial_schema.sql` - Initial database schema with devices table, RLS policies, and Realtime configuration
