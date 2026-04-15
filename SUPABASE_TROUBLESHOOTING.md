# 🔧 Supabase Troubleshooting Guide

## Issue: "Invalid API Key" Error

This error typically means one of these things:

### 1. Environment Variables Not Loaded in Vercel

**Check in Browser Console (F12):**

```javascript
// Run this in the browser console on your deployed site
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Expected Output:**
```
Supabase URL: https://mtgmcexbdoariaixrxnr.supabase.co
Supabase Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If you see "undefined":**
- Environment variables not set in Vercel
- Need to add them and redeploy

---

### 2. Vercel Environment Variables Not Applied

**Solution:**

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Verify these exist:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```
4. If they exist, click **"Redeploy"**
5. Wait for deployment to complete
6. Test again

---

### 3. Wrong API Key Format

**Check Your Supabase Dashboard:**

1. Go to: https://app.supabase.com
2. Select project: `airbloom-tracker`
3. Settings → API
4. Verify you copied the **"anon public"** key (NOT service_role)

**The anon key should:**
- Start with `eyJ`
- Be very long (300+ characters)
- Look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y`

---

### 4. Database Table Not Created

**Check if table exists:**

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Look for "devices" table
4. If not there, run the SQL schema again

**Run SQL Schema:**
1. SQL Editor → New Query
2. Copy all code from `supabase-schema.sql`
3. Paste and Run
4. Should see "Success"

---

### 5. Row Level Security (RLS) Blocking Access

**Temporarily disable RLS to test:**

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
```

**Test if devices work now:**
- If YES: RLS policies are the issue
- If NO: Different problem

**Re-enable RLS after testing:**
```sql
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
```

---

## 🔍 Detailed Debugging Steps

### Step 1: Check Browser Console

Open browser console (F12) and look for errors:

**Common errors:**

1. **"Missing environment variables"**
   - Supabase URL or Key not set
   - Add to Vercel and redeploy

2. **"Failed to fetch"**
   - Network issue
   - Check Supabase project is running

3. **"Invalid API key"**
   - Wrong key format
   - Check you copied anon key (not service_role)

4. **"relation 'devices' does not exist"**
   - Table not created
   - Run SQL schema

### Step 2: Test Supabase Connection

**Run this in browser console:**

```javascript
// Test Supabase connection
const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = 'https://mtgmcexbdoariaixrxnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y';

const testClient = createClient(supabaseUrl, supabaseKey);

// Try to fetch devices
const { data, error } = await testClient
  .from('devices')
  .select('*');

console.log('Data:', data);
console.log('Error:', error);
```

**Expected:**
- `Data: []` (empty array if no devices)
- `Error: null`

**If error:**
- Check error message
- Follow specific solution below

### Step 3: Verify Vercel Deployment

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click latest deployment
4. Check "Build Logs"
5. Look for environment variable warnings

**Should see:**
```
✓ Environment variables loaded
✓ VITE_SUPABASE_URL
✓ VITE_SUPABASE_ANON_KEY
```

---

## 🚨 Common Mistakes

### Mistake 1: Using Service Role Key in Frontend

**Wrong:**
```
VITE_SUPABASE_ANON_KEY = eyJ...service_role...
```

**Correct:**
```
VITE_SUPABASE_ANON_KEY = eyJ...anon...
```

### Mistake 2: Not Redeploying After Adding Variables

**Solution:**
- Always click "Redeploy" after adding/changing environment variables
- Vercel doesn't automatically rebuild

### Mistake 3: Typo in Variable Name

**Must be exactly:**
```
VITE_SUPABASE_URL (not VITE_SUPABASE_API_URL)
VITE_SUPABASE_ANON_KEY (not VITE_SUPABASE_KEY)
```

### Mistake 4: Spaces in Variable Value

**Wrong:**
```
VITE_SUPABASE_URL = https://... (space before URL)
```

**Correct:**
```
VITE_SUPABASE_URL=https://... (no spaces)
```

---

## 📋 Quick Fix Checklist

- [ ] Supabase project is active (not paused)
- [ ] SQL schema was run successfully
- [ ] "devices" table exists in Table Editor
- [ ] Environment variables added to Vercel
- [ ] Variable names are exactly correct
- [ ] Used "anon" key (not service_role)
- [ ] Redeployed after adding variables
- [ ] Waited for deployment to complete
- [ ] Cleared browser cache
- [ ] Tested in incognito window

---

## 🔄 Complete Reset Procedure

If nothing works, try this:

### 1. Verify Supabase Setup

```sql
-- Run in Supabase SQL Editor
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'devices';

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'devices';

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename = 'devices';
```

### 2. Reset Environment Variables

1. Delete both Supabase variables in Vercel
2. Re-add them (copy-paste carefully)
3. Verify no extra spaces
4. Save
5. Redeploy

### 3. Test Locally First

```bash
cd airbloom-tracker

# Make sure .env has Supabase variables
cat .env | grep SUPABASE

# Should show:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=eyJ...

# Run locally
npm run dev

# Test adding a device
# Check browser console for errors
```

---

## 💡 Alternative: Test with Supabase Dashboard

**Manually add a device in Supabase:**

1. Go to Supabase Dashboard
2. Table Editor → devices
3. Click "Insert row"
4. Fill in:
   ```
   id: (auto-generated)
   name: Test Device
   channel_id: 123456
   api_key: test_key
   location: Test Location
   is_active: false
   ```
5. Click "Save"

**Then check frontend:**
- Refresh your app
- Go to Devices page
- Should see "Test Device"
- If YES: Frontend connection works, issue is with adding
- If NO: Frontend can't connect to Supabase

---

## 📞 Still Not Working?

**Share these details:**

1. **Browser Console Output:**
   ```javascript
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Vercel Build Logs:**
   - Any warnings about environment variables?

3. **Supabase Dashboard:**
   - Does "devices" table exist?
   - Any data in the table?

4. **Network Tab (F12):**
   - Any failed requests to Supabase?
   - What's the error message?

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ No errors in browser console
- ✅ Can add device without errors
- ✅ Device appears in Supabase Table Editor
- ✅ Device appears in frontend Devices page
- ✅ Real-time sync works (add device in dashboard, appears in app)

---

**Most Common Fix:** Redeploy after adding environment variables!
