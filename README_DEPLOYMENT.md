# 🚀 AirBloom Tracker - Deployment Guide

## Current Status: Ready to Deploy ✅

Your code is configured correctly. The "invalid api key" error is because Supabase environment variables haven't been added to Vercel yet.

---

## 📚 Documentation Files

I've created several guides to help you:

1. **`NEXT_STEPS.md`** ⭐ **START HERE**
   - Complete step-by-step guide
   - What to do right now
   - Troubleshooting for common issues

2. **`QUICK_FIX_NOW.md`**
   - 3-step quick fix (5 minutes)
   - For when you just want to get it working

3. **`DEPLOYMENT_CHECKLIST.md`**
   - Detailed checklist format
   - Check off items as you complete them

4. **`VERCEL_DEPLOYMENT_STATUS.md`**
   - Explains the Vercel warning you saw
   - Deployment status information

5. **`SUPABASE_TROUBLESHOOTING.md`**
   - Comprehensive troubleshooting guide
   - Solutions for specific errors

6. **`test-supabase-connection.html`**
   - Test your Supabase connection locally
   - Verify everything works before deploying

---

## ⚡ Quick Summary

### What's Working ✅
- Local environment configured correctly
- Supabase credentials in `.env` files
- Code pushed to GitHub
- Automatic deployment in progress

### What's Missing ❌
- Supabase environment variables in Vercel
- SQL schema might not be run in Supabase

### The Fix (3 Steps)
1. **Run SQL schema** in Supabase SQL Editor
2. **Add environment variables** to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Redeploy** in Vercel

---

## 🎯 Your Supabase Credentials

**Project URL:**
```
https://mtgmcexbdoariaixrxnr.supabase.co
```

**Anon Key (for frontend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y
```

**Service Role Key (for backend - DO NOT expose in frontend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIzMDE5MSwiZXhwIjoyMDkxODA2MTkxfQ.GxDvTxWzXgFgu78VNNwMJEXP7_sBKKqr7x9SdaVieC8
```

---

## 🔧 Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://mtgmcexbdoariaixrxnr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y
```

**Important:**
- No spaces before or after values
- Select "Production" or "All" environments
- Click "Save" for each variable
- **Must redeploy after adding variables**

---

## 📊 SQL Schema Location

The SQL schema is in: `airbloom-tracker/supabase-schema.sql`

**To run it:**
1. Go to: https://app.supabase.com
2. Select your project
3. SQL Editor → New Query
4. Copy ALL code from `supabase-schema.sql`
5. Paste and Run
6. Verify "devices" table exists in Table Editor

---

## 🧪 Testing

### Test Locally (Before Deploying)
```bash
# Open the test file
open test-supabase-connection.html
# Click "Run Tests"
# Should see all ✅
```

### Test Deployed App
1. Open your Vercel URL
2. Login (username: `24r21a0489`, password: `Var@123`)
3. Go to Devices page
4. Check blue diagnostic panel
5. Should show all ✅

---

## 👥 User Accounts

### Admin User
- Username: `24r21a0489`
- Password: `Var@123`
- Email: `24r21a0489@mlrit.ac.in`
- Role: admin
- Can: Add, remove, toggle devices

### Viewer User
- Username: `viewer`
- Password: `Viewer@123`
- Email: `viewer@airbloom.io`
- Role: viewer
- Can: View and toggle devices (read-only)

---

## 🎯 Expected Behavior After Setup

### Admin Can:
- ✅ Add devices
- ✅ Remove devices
- ✅ Toggle devices on/off
- ✅ See all devices

### Viewer Can:
- ✅ See all devices (added by admin)
- ✅ Toggle devices on/off (to view data)
- ❌ Cannot add devices
- ❌ Cannot remove devices

### Real-Time Sync:
- ✅ Admin adds device → Viewer sees it instantly
- ✅ Admin removes device → Disappears from viewer
- ✅ Works across multiple tabs/windows
- ✅ Works in incognito mode

---

## 🚨 Common Issues & Solutions

### "Invalid API Key" Error
**Cause:** Supabase env vars not in Vercel
**Fix:** Add variables and redeploy

### Diagnostic Shows "❌ Missing"
**Cause:** Env vars not loaded
**Fix:** Add to Vercel, redeploy, clear cache

### Diagnostic Shows "❌ Failed"
**Cause:** SQL schema not run
**Fix:** Run schema in Supabase SQL Editor

### "relation 'devices' does not exist"
**Cause:** Table not created
**Fix:** Run SQL schema

---

## 📞 Need Help?

Share these screenshots:
1. Blue diagnostic panel (on Devices page)
2. Vercel deployment status
3. Vercel environment variables page
4. Supabase Table Editor
5. Browser console (F12) errors

---

## ✅ Success Checklist

- [ ] SQL schema run in Supabase
- [ ] "devices" table exists
- [ ] Environment variables added to Vercel
- [ ] Redeployed after adding variables
- [ ] Deployment shows "Ready"
- [ ] Diagnostic panel shows all ✅
- [ ] Can add device without errors
- [ ] Device appears in Supabase
- [ ] Viewer can see devices
- [ ] Real-time sync works

---

## 🎉 You're Almost There!

The code is ready. You just need to:
1. Run SQL schema in Supabase
2. Add env vars to Vercel
3. Redeploy

**Read `NEXT_STEPS.md` for detailed instructions!**
