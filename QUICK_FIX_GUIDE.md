# Quick Fix Guide - Login Not Working in Production

## 🚨 Problem
Login works locally but fails in Vercel with "Invalid username or password"

## ⚡ Quick Fix (5 minutes)

### Step 1: Generate Password Hash

```bash
cd airbloom-tracker
node scripts/generate-password-hash.js YOUR_PASSWORD
```

Copy the hash that's printed.

### Step 2: Add to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

```
Key: VITE_ADMIN_USERNAME
Value: your_username (e.g., "admin" or "24r21a0489")

Key: VITE_ADMIN_PASSWORD_HASH  
Value: [paste the hash from Step 1]
```

5. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **...** menu on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Test

1. Visit your deployed URL
2. Try logging in
3. Open browser console (F12) to see debug logs
4. Look for `[AUTH]` messages

## ✅ Should Work Now!

If still not working, check:

1. **Environment Variables Set?**
   ```
   Vercel Dashboard > Settings > Environment Variables
   Both VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD_HASH should be there
   ```

2. **Correct Username?**
   ```
   Try these formats:
   - Just username: "admin"
   - With @mlrit.ac.in: "admin@mlrit.ac.in"
   - With @airbloom.io: "admin@airbloom.io"
   ```

3. **Correct Password Hash?**
   ```bash
   # Regenerate to be sure
   node scripts/generate-password-hash.js YOUR_PASSWORD
   # Compare with what's in Vercel
   ```

4. **Redeployed After Adding Variables?**
   ```
   Environment variables only take effect after redeployment
   ```

## 🐛 Still Not Working?

### Check Browser Console

Press F12 and look for these logs:

```
✅ Good:
[AUTH] Authentication attempt for: admin
[AUTH] Environment check passed
[AUTH] Username matched, verifying password...
[AUTH] Authentication successful

❌ Bad:
[AUTH] Admin credentials not configured
[AUTH] Password mismatch
```

### Clear Browser Data

```javascript
// In browser console, run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Verify Environment Variables

```javascript
// In browser console, run:
console.log(import.meta.env.VITE_ADMIN_USERNAME);
console.log(import.meta.env.VITE_ADMIN_PASSWORD_HASH);

// Should show your values, not undefined
```

## 📞 Need More Help?

Read the detailed guides:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `AUTH_README.md` - Authentication system documentation
- `PRODUCTION_FIX_SUMMARY.md` - All changes explained

## 🎯 Common Mistakes

1. ❌ Forgot to redeploy after adding variables
2. ❌ Typo in environment variable names
3. ❌ Wrong password hash
4. ❌ Trailing spaces in variable values
5. ❌ Using wrong username format

## ✨ Pro Tips

1. **Test Locally First**
   ```bash
   npm run verify-env
   npm run dev
   # Try logging in
   ```

2. **Use Incognito Mode**
   - Avoids cache issues
   - Fresh session every time

3. **Check Build Logs**
   - Vercel Dashboard > Deployments > [Latest] > Build Logs
   - Look for environment variable warnings

4. **Enable Debug Mode**
   - Browser console shows all `[AUTH]` logs
   - Helps identify exact issue

## 🔄 Quick Commands

```bash
# Generate password hash
npm run generate-hash YOUR_PASSWORD

# Verify local environment
npm run verify-env

# Test locally
npm run dev

# Build for production
npm run build
```

## 📋 Checklist

Before asking for help, verify:

- [ ] Environment variables added to Vercel
- [ ] Variable names start with `VITE_`
- [ ] Password hash is 64 characters (SHA-256)
- [ ] Redeployed after adding variables
- [ ] Tested in incognito mode
- [ ] Checked browser console for errors
- [ ] Tried all username formats
- [ ] Cleared browser cache/storage

---

**Most Common Solution:** Add environment variables to Vercel and redeploy. That's it! 🎉
