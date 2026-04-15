# 🔍 Debug API Key Issue

## Current Situation

Your app shows:
- ✅ Environment variables are loaded
- ❌ Supabase rejects the API key with 401 Unauthorized

## Possible Causes

### 1. API Key Mismatch (Most Likely)

The key you provided earlier might be outdated or incorrect.

**The key you gave me:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z21jZXhiZG9hcmlhaXhyeG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzAxOTEsImV4cCI6MjA5MTgwNjE5MX0.odtrFtukFjLWXyLSt77ZvCkRoHFpUd-3L07nYsEPt8Y
```

**To verify:**
1. Go to: https://app.supabase.com
2. Settings → API
3. Compare the "anon public" key with the one above
4. If they're different, that's the problem!

---

### 2. Project URL Mismatch

**The URL you gave me:**
```
https://mtgmcexbdoariaixrxnr.supabase.co
```

**To verify:**
1. In Supabase Dashboard
2. Settings → API
3. Check "Project URL"
4. Should match exactly

---

### 3. Supabase Project Issues

**Check these:**
- [ ] Project is not paused (look for banner at top)
- [ ] Project is not in "Restoring" state
- [ ] No billing issues (free tier limits)
- [ ] Project region is accessible

---

## 🧪 Quick Test in Browser Console

Open your deployed app, press F12, and run this in the console:

```javascript
// Test 1: Check what's loaded
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test 2: Manual connection test
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

const testClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Test 3: Try to query
const { data, error } = await testClient
  .from('devices')
  .select('count')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

**Share the output!**

---

## 🔑 Get Fresh Keys - Step by Step

### Step 1: Login to Supabase
- Go to: https://app.supabase.com
- Login with your account

### Step 2: Select Project
- Click the project with URL: `mtgmcexbdoariaixrxnr.supabase.co`
- Or look for project name: `airbloom-tracker`

### Step 3: Go to API Settings
- Click **"Settings"** (gear icon) in left sidebar
- Click **"API"** in the settings menu

### Step 4: Copy Keys
You'll see this page with:

```
Configuration
Project URL: https://mtgmcexbdoariaixrxnr.supabase.co

Project API keys
anon public: eyJ... [Copy button]
service_role: eyJ... [Copy button]
```

**Copy the "anon public" key** (the first one)

### Step 5: Compare
- Does it match the key in your `.env` file?
- Does it match the key in Vercel?
- If NO → That's the problem!

---

## 🎯 Action Items

**Do these RIGHT NOW:**

1. **Go to Supabase Dashboard**
   - https://app.supabase.com

2. **Navigate to Settings → API**

3. **Take a screenshot** of the API settings page
   - You can blur the middle part of the keys
   - Just show the first 30 and last 10 characters

4. **Share:**
   - Screenshot of Supabase API settings
   - First 30 characters of the anon key from Supabase
   - Confirm the Project URL matches

---

## 🔄 If Keys Don't Match

**Update Local `.env`:**
```bash
# airbloom-tracker/.env
VITE_SUPABASE_URL=https://mtgmcexbdoariaixrxnr.supabase.co
VITE_SUPABASE_ANON_KEY=<paste_fresh_key_from_supabase>
```

**Update Vercel:**
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit `VITE_SUPABASE_ANON_KEY`
4. Paste fresh key
5. Save
6. Redeploy

**Test Locally:**
```bash
cd airbloom-tracker
npm run dev
# Open http://localhost:5173
# Go to Devices page
# Check diagnostic panel
```

---

## 🚨 Common Mistakes

### Mistake 1: Using Service Role Key in Frontend
**Wrong:**
```
VITE_SUPABASE_ANON_KEY=eyJ...service_role...
```

**Correct:**
```
VITE_SUPABASE_ANON_KEY=eyJ...anon...
```

The key should have `"role":"anon"` in it, not `"role":"service_role"`

### Mistake 2: Extra Spaces
**Wrong:**
```
VITE_SUPABASE_ANON_KEY= eyJ... (space before key)
```

**Correct:**
```
VITE_SUPABASE_ANON_KEY=eyJ... (no space)
```

### Mistake 3: Incomplete Key
The key is VERY long (300+ characters). Make sure you copied the entire thing.

---

## 📊 Expected vs Actual

**Expected (working):**
```
✅ VITE_SUPABASE_URL: Loaded
✅ VITE_SUPABASE_ANON_KEY: Loaded
✅ Connection Test: Connected
```

**Actual (your screenshot):**
```
✅ VITE_SUPABASE_URL: Loaded
✅ VITE_SUPABASE_ANON_KEY: Loaded
❌ Connection Test: Failed
Error: Invalid API key
```

This means:
- Variables are loaded ✅
- But the key is wrong or Supabase rejects it ❌

---

## 💡 Next Step

**Please do this:**

1. Go to Supabase Settings → API
2. Copy the "anon public" key
3. Share the first 50 characters here
4. I'll compare it with what we have in the code

Example:
```
Current key in code: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
Key from Supabase:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
                    ↑ Do these match?
```

This will tell us if the key is the issue!
