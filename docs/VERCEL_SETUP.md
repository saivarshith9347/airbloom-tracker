# Vercel Deployment Setup - Step by Step

## 🚨 CRITICAL: Environment Variables Must Be Set in Vercel

Your login is failing because environment variables are NOT set in Vercel. Follow these exact steps:

## Step 1: Generate Password Hash

```bash
cd airbloom-tracker
node scripts/generate-password-hash.js Var@123
```

You should see output like:
```
=================================
Password Hash Generated
=================================

Password: Var@123
SHA-256 Hash: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a

Add this to your .env file:
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

**Copy the hash!** You'll need it in the next step.

## Step 2: Add Environment Variables to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click on your project (`airbloom-tracker`)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add these TWO variables:

#### Variable 1:
```
Key: VITE_ADMIN_USERNAME
Value: 24r21a0489
Environment: Production, Preview, Development (check all three)
```

#### Variable 2:
```
Key: VITE_ADMIN_PASSWORD_HASH
Value: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
Environment: Production, Preview, Development (check all three)
```

6. Click **Save** for each variable

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login
vercel login

# Add environment variables
vercel env add VITE_ADMIN_USERNAME
# When prompted, enter: 24r21a0489
# Select: Production, Preview, Development

vercel env add VITE_ADMIN_PASSWORD_HASH
# When prompted, enter: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
# Select: Production, Preview, Development
```

## Step 3: Redeploy

**IMPORTANT:** Environment variables only take effect after redeployment!

### Option A: Using Vercel Dashboard

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **...** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete (usually 1-2 minutes)

### Option B: Using Git Push

```bash
# Make a small change (or empty commit)
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

### Option C: Using Vercel CLI

```bash
vercel --prod
```

## Step 4: Test Login

1. Go to your deployed URL: `https://airbloom-tracker.vercel.app/login`
2. Enter credentials:
   - Username: `24r21a0489` or `24r21a0489@mlrit.ac.in`
   - Password: `Var@123`
3. Open browser console (F12) to see debug logs
4. You should see:
   ```
   [ENV] Loading environment configuration...
   [ENV] ✓ VITE_ADMIN_USERNAME loaded
   [ENV] ✓ VITE_ADMIN_PASSWORD_HASH loaded
   [AUTH] ✓ Username matched
   [AUTH] ✓ Password hashed successfully
   [AUTH] ✓✓✓ AUTHENTICATION SUCCESSFUL ✓✓✓
   ```

## Troubleshooting

### Issue 1: Still Getting "Invalid username or password"

**Check browser console for these logs:**

```
[ENV] ❌ Required environment variable VITE_ADMIN_USERNAME is missing!
```

**Solution:**
- Environment variables are NOT set in Vercel
- Go back to Step 2 and add them
- Make sure to redeploy after adding (Step 3)

### Issue 2: "Authentication system not configured"

**This means:**
- Environment variables are missing or empty
- You didn't redeploy after adding them

**Solution:**
```bash
# Verify variables are set in Vercel
vercel env ls

# Should show:
# VITE_ADMIN_USERNAME (Production, Preview, Development)
# VITE_ADMIN_PASSWORD_HASH (Production, Preview, Development)

# If not shown, add them (Step 2)
# Then redeploy (Step 3)
```

### Issue 3: Password Hash Mismatch

**Check console logs:**
```
[AUTH] Generated hash: abc123...
[AUTH] Expected hash: xyz789...
```

**Solution:**
- The hash in Vercel doesn't match your password
- Regenerate hash: `node scripts/generate-password-hash.js Var@123`
- Update `VITE_ADMIN_PASSWORD_HASH` in Vercel
- Redeploy

### Issue 4: Username Not Matching

**Check console logs:**
```
[AUTH] Provided: 24r21a0489@mlrit.ac.in
[AUTH] Expected one of:
[AUTH]   - 24r21a0489
[AUTH]   - 24r21a0489@airbloom.io
[AUTH]   - 24r21a0489@mlrit.ac.in
```

**Solution:**
- Use one of the accepted formats
- Or update `VITE_ADMIN_USERNAME` in Vercel to match what you're entering

## Verification Checklist

Before asking for help, verify:

- [ ] Environment variables added to Vercel dashboard
- [ ] Both `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD_HASH` are set
- [ ] Variables are set for Production environment
- [ ] Redeployed after adding variables
- [ ] Waited for deployment to complete
- [ ] Tested in incognito mode (to avoid cache)
- [ ] Checked browser console for `[ENV]` and `[AUTH]` logs
- [ ] Password hash is exactly 64 characters
- [ ] No trailing spaces in variable values

## Quick Test

Run this in browser console on your deployed site:

```javascript
// Check if environment variables are loaded
console.log('Username:', import.meta.env.VITE_ADMIN_USERNAME);
console.log('Hash:', import.meta.env.VITE_ADMIN_PASSWORD_HASH);

// Should NOT be undefined
// If undefined, environment variables are not set or not redeployed
```

## Common Mistakes

1. ❌ Added variables but didn't redeploy
2. ❌ Added variables only for "Production" but testing on "Preview"
3. ❌ Typo in variable names (must be exact: `VITE_ADMIN_USERNAME`)
4. ❌ Wrong password hash (regenerate to be sure)
5. ❌ Trailing spaces in values
6. ❌ Testing immediately without waiting for deployment

## Success Indicators

✅ **In Vercel Dashboard:**
- Environment Variables section shows 2 variables
- Both have green checkmarks
- Latest deployment is "Ready"

✅ **In Browser Console:**
```
[ENV] ✓ VITE_ADMIN_USERNAME loaded
[ENV] ✓ VITE_ADMIN_PASSWORD_HASH loaded
[AUTH] ✓✓✓ AUTHENTICATION SUCCESSFUL ✓✓✓
```

✅ **In Application:**
- Login redirects to dashboard
- No error messages
- Session persists on refresh

## Need Help?

1. Take screenshot of:
   - Vercel Environment Variables page
   - Browser console logs
   - Login error message

2. Check that:
   - Variables are set in Vercel
   - Deployment completed successfully
   - Using correct credentials

3. Try:
   - Incognito mode
   - Different browser
   - Clear cache and cookies

## Contact

If still not working after following ALL steps:
- Check browser console for detailed error messages
- Verify environment variables in Vercel dashboard
- Ensure you redeployed after adding variables
- Test with the exact credentials: `24r21a0489` / `Var@123`
