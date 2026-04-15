# ✅ Deployment Checklist - Fix "Invalid API Key" Error

## Current Status

- ✅ Code pushed to GitHub
- ✅ Automatic deployment triggered in Vercel
- ⏳ **WAITING:** Deployment to complete
- ❌ **MISSING:** Supabase environment variables in Vercel
- ❓ **UNKNOWN:** SQL schema run in Supabase

---

## 🎯 Complete Checklist

### Part 1: Vercel Setup

- [ ] **1.1** Wait for automatic deployment to show "Ready"
  - Go to: https://vercel.com/dashboard
  - Click: Your project
  - Status should be: **"Ready"** (not "Building")

- [ ] **1.2** Add VITE_SUPABASE_URL environment variable
  - Settings → Environment Variables → Add
  - Name: `VITE_SUPABASE_URL`
  - Value: `https://mtgmcexbdoariaixrxnr.supabase.co`
  - Environment: Production (or All)

- [ ] **1.3** Add VITE_SUPABASE_ANON_KEY environment variable
  - Name: `VITE_SUPABASE_ANON_KEY`
  - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y`
  - Environment: Production (or All)

- [ ] **1.4** Redeploy after adding variables
  - Deployments → ••• → Redeploy
  - Wait for "Ready" status

---

### Part 2: Supabase Setup

- [ ] **2.1** Login to Supabase
  - Go to: https://app.supabase.com
  - Login with your account

- [ ] **2.2** Select your project
  - Click: `airbloom-tracker` project
  - Or the project with URL: `mtgmcexbdoariaixrxnr.supabase.co`

- [ ] **2.3** Run SQL schema
  - Click: "SQL Editor" in left sidebar
  - Click: "New Query"
  - Copy ALL code from: `airbloom-tracker/supabase-schema.sql`
  - Paste into editor
  - Click: "Run" (or press Ctrl+Enter)
  - Should see: "Success. No rows returned"

- [ ] **2.4** Verify table exists
  - Click: "Table Editor" in left sidebar
  - Should see: "devices" table in the list
  - Click on "devices" to see columns:
    - id (uuid)
    - name (text)
    - channel_id (text)
    - api_key (text)
    - location (text)
    - is_active (boolean)
    - created_at (timestamp)
    - created_by (text)
    - updated_at (timestamp)

---

### Part 3: Verification

- [ ] **3.1** Open deployed app
  - Go to your Vercel URL
  - Should load without errors

- [ ] **3.2** Login as admin
  - Username: `24r21a0489`
  - Password: `Var@123`
  - Should redirect to dashboard

- [ ] **3.3** Check diagnostic panel
  - Go to: Devices page
  - Look at blue box at top
  - Should show:
    - ✅ VITE_SUPABASE_URL: Loaded
    - ✅ VITE_SUPABASE_ANON_KEY: Loaded
    - ✅ Connection Test: Connected

- [ ] **3.4** Test adding a device
  - Click: "Add Device"
  - Fill in:
    - Name: Test Sensor
    - Location: Test Location
    - Channel ID: 2739166 (or your actual ID)
    - API Key: (your ThingSpeak Read API Key)
  - Click: "Add Device"
  - Should see: "Device added successfully" toast

- [ ] **3.5** Verify device in Supabase
  - Go back to Supabase
  - Table Editor → devices
  - Should see your "Test Sensor" in the table

- [ ] **3.6** Test viewer access
  - Open incognito window
  - Go to your Vercel URL
  - Login as viewer:
    - Username: `viewer`
    - Password: `Viewer@123`
  - Go to Devices page
  - Should see the "Test Sensor" device
  - Should see "Viewer Mode" banner
  - Try to add device → Should show "Permission denied"
  - Toggle device on/off → Should work

- [ ] **3.7** Test real-time sync
  - Keep both windows open (admin + viewer)
  - In admin window: Add another device
  - In viewer window: Should automatically appear (within 1-2 seconds)

---

## 🚨 Troubleshooting

### Issue: Diagnostic shows "❌ Missing"

**Cause:** Environment variables not loaded

**Fix:**
1. Verify variables exist in Vercel Settings
2. Check spelling: `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
3. Redeploy after adding variables
4. Clear browser cache
5. Try incognito window

---

### Issue: Diagnostic shows "❌ Failed" connection

**Cause:** SQL schema not run or table doesn't exist

**Fix:**
1. Go to Supabase SQL Editor
2. Run the schema from `supabase-schema.sql`
3. Verify "devices" table exists in Table Editor
4. Refresh your app

---

### Issue: "relation 'devices' does not exist"

**Cause:** SQL schema not run

**Fix:**
1. Run SQL schema in Supabase (Part 2.3 above)
2. Verify table exists (Part 2.4 above)

---

### Issue: Can add device but doesn't appear

**Cause:** Real-time subscription not working

**Fix:**
1. Check browser console (F12) for errors
2. Verify this line in SQL schema was run:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
   ```
3. Refresh the page

---

### Issue: Viewer can't see devices

**Cause:** RLS policies blocking access

**Fix:**
1. Temporarily disable RLS to test:
   ```sql
   ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
   ```
2. If it works, RLS is the issue
3. Re-enable RLS:
   ```sql
   ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
   ```
4. Verify policies exist (they're in the schema)

---

## 📊 Expected Results

### Admin User
- ✅ Can add devices
- ✅ Can remove devices
- ✅ Can toggle devices on/off
- ✅ Sees all devices
- ✅ Changes sync in real-time

### Viewer User
- ✅ Can see all devices
- ✅ Can toggle devices on/off
- ❌ Cannot add devices (shows error)
- ❌ Cannot remove devices (lock icon)
- ✅ Changes sync in real-time

### Real-Time Sync
- ✅ Admin adds device → Viewer sees it immediately
- ✅ Admin removes device → Disappears from viewer
- ✅ Admin toggles device → Updates in viewer
- ✅ Viewer toggles device → Updates in admin
- ✅ Works across multiple tabs/windows
- ✅ Works in incognito mode

---

## 🎯 Success Criteria

You'll know everything is working when:

1. **Diagnostic panel shows all ✅**
2. **Can add device without errors**
3. **Device appears in Supabase Table Editor**
4. **Device visible in both admin and viewer accounts**
5. **Real-time sync works (changes appear instantly)**
6. **Works in incognito window**
7. **Viewer can see but not modify devices**

---

## 📸 What to Share If Issues Persist

1. **Screenshot:** Diagnostic panel (blue box on Devices page)
2. **Screenshot:** Vercel deployment status
3. **Screenshot:** Vercel environment variables page
4. **Screenshot:** Supabase Table Editor showing "devices" table
5. **Console logs:** Browser console (F12) - any errors?

---

## ⏱️ Time Estimate

- **Vercel setup:** 3-5 minutes
- **Supabase setup:** 2-3 minutes
- **Verification:** 2-3 minutes
- **Total:** ~10 minutes

---

## 🎉 Next Steps After Success

Once everything is working:

1. **Remove diagnostic component** (optional)
   - It's the blue box at the top of Devices page
   - Edit `src/pages/Devices.tsx`
   - Remove `<SupabaseDiagnostic />` line

2. **Add your real devices**
   - Use your actual ThingSpeak Channel IDs
   - Use your actual Read API Keys

3. **Test with real data**
   - Activate devices
   - Go to Dashboard
   - Should see real sensor data

4. **Share with team**
   - Give them the Vercel URL
   - Give them viewer credentials
   - They can see all devices

---

**Start with Part 1 (Vercel Setup) and work through the checklist!** ✅
