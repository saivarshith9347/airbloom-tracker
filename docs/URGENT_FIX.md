# 🚨 URGENT FIX - Invalid API Key Error

## What I See in Your Screenshots

✅ **Good News:**
- VITE_SUPABASE_URL: Loaded
- VITE_SUPABASE_ANON_KEY: Loaded

❌ **Problem:**
- Connection Test: Failed
- Error: Invalid API key
- Console shows: 401 Unauthorized errors

## 🔍 Root Cause

The API key is loaded but **Supabase is rejecting it**. This means one of these:

1. **Most Likely:** The anon key has been regenerated/changed in Supabase
2. **Or:** The Supabase project is paused or has issues
3. **Or:** Row Level Security (RLS) is blocking access

---

## ✅ SOLUTION 1: Get Fresh API Keys from Supabase

### Step 1: Go to Supabase Dashboard

1. Open: https://app.supabase.com
2. Login to your account
3. Click your project (the one with URL: `mtgmcexbdoariaixrxnr.supabase.co`)

### Step 2: Check Project Status

Look at the top of the dashboard:
- Is there a banner saying "Project is paused"?
- If YES: Click "Resume project" and wait

### Step 3: Get Fresh API Keys

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (should be: `https://mtgmcexbdoariaixrxnr.supabase.co`)
   - **anon public** key (this is what we need)
   - **service_role** key (for backend only)

### Step 4: Copy the NEW anon key

1. Find the section: **"Project API keys"**
2. Look for: **"anon public"** (NOT service_role)
3. Click the **copy icon** to copy the full key
4. It should start with: `eyJ...`

### Step 5: Update Your Environment Variables

**In your local `.env` file:**
```bash
# Replace the old key with the new one
VITE_SUPABASE_ANON_KEY=<paste_the_new_key_here>
```

**In Vercel:**
1. Go to Vercel Dashboard
2. Your project → Settings → Environment Variables
3. Find: `VITE_SUPABASE_ANON_KEY`
4. Click **"Edit"**
5. Paste the NEW key
6. Click **"Save"**
7. **Redeploy** (Deployments → ••• → Redeploy)

---

## ✅ SOLUTION 2: Check if SQL Schema Was Run

The 401 error could also mean the table doesn't exist or RLS is blocking.

### Step 1: Check if Table Exists

1. In Supabase Dashboard
2. Click **"Table Editor"** in left sidebar
3. Look for **"devices"** table
4. **If you DON'T see it:** Run the SQL schema (see below)

### Step 2: Run SQL Schema

1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"**
3. Copy ALL code from: `airbloom-tracker/supabase-schema.sql`
4. Paste into the editor
5. Click **"Run"** (or Ctrl+Enter)
6. Should see: **"Success. No rows returned"**

### Step 3: Verify Table Was Created

1. Go back to **"Table Editor"**
2. Click **"devices"** table
3. Should see columns: id, name, channel_id, api_key, location, is_active, created_at, created_by, updated_at

---

## ✅ SOLUTION 3: Temporarily Disable RLS

If the table exists but you still get 401, RLS might be blocking.

### Test by Disabling RLS:

1. Go to Supabase **SQL Editor**
2. Run this query:
   ```sql
   ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
   ```
3. Click **"Run"**
4. Go back to your app and refresh
5. Try adding a device again

**If it works now:**
- RLS was the issue
- Re-enable it: `ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;`
- The policies in the schema should allow access

**If it still doesn't work:**
- The API key is definitely invalid
- Get a fresh key from Supabase (Solution 1)

---

## 🎯 Quick Checklist

Do these in order:

- [ ] **1. Check Supabase project status** (is it paused?)
- [ ] **2. Get fresh anon key** from Supabase Settings → API
- [ ] **3. Update local `.env`** with new key
- [ ] **4. Update Vercel env var** with new key
- [ ] **5. Redeploy** in Vercel
- [ ] **6. Check if "devices" table exists** in Table Editor
- [ ] **7. If no table, run SQL schema** from `supabase-schema.sql`
- [ ] **8. If still failing, disable RLS** temporarily to test

---

## 📸 What to Share Next

After trying the above, please share:

1. **Screenshot:** Supabase Settings → API page (showing the anon key - you can blur part of it)
2. **Screenshot:** Supabase Table Editor (showing if "devices" table exists)
3. **Screenshot:** The diagnostic panel after updating the key
4. **Console logs:** Any new errors after the fix

---

## 🔑 Most Likely Fix

**99% chance the issue is:**
- The anon key in your Supabase dashboard is DIFFERENT from the one you gave me
- OR the Supabase project was paused/restarted and keys were regenerated

**Solution:**
1. Go to Supabase Settings → API
2. Copy the CURRENT anon key
3. Update everywhere (local .env + Vercel)
4. Redeploy

---

## ⚡ Do This Right Now

1. **Open:** https://app.supabase.com
2. **Click:** Your project
3. **Go to:** Settings → API
4. **Copy:** The "anon public" key
5. **Share:** The first 30 characters of the key (so I can verify it matches)

Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...` (first 30 chars)

This will tell us if the key is different!
