# Vercel Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env` file NOT committed (check `.gitignore`)
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass locally (if any)

## Vercel Environment Variables

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

### Required Variables (CRITICAL)

- [ ] `VITE_ADMIN_USERNAME` = `24r21a0489`
- [ ] `VITE_ADMIN_PASSWORD_HASH` = `557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a`

### Optional Variables (Recommended)

- [ ] `VITE_HOME_LATITUDE` = `28.6139`
- [ ] `VITE_HOME_LONGITUDE` = `77.209`
- [ ] `VITE_HOME_NAME` = `Home Base`

### Legacy Variables (Optional - Can be empty)

- [ ] `VITE_THINGSPEAK_CHANNEL_ID` = (leave empty or add default)
- [ ] `VITE_THINGSPEAK_API_KEY` = (leave empty or add default)

## Environment Selection

For each variable above:
- [ ] Check "Production"
- [ ] Check "Preview"
- [ ] Check "Development"

## Deployment

- [ ] Click "Redeploy" button in Vercel
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Verify no environment variable warnings

## Post-Deployment Testing

### 1. Check Environment Variables

Open deployed site, press F12, run in console:

```javascript
console.log('Username:', import.meta.env.VITE_ADMIN_USERNAME);
console.log('Hash:', import.meta.env.VITE_ADMIN_PASSWORD_HASH);
```

Expected output:
```
Username: 24r21a0489
Hash: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

- [ ] Username shows correct value (NOT undefined)
- [ ] Hash shows correct value (NOT undefined)

### 2. Test Login

- [ ] Navigate to `/login` page
- [ ] Enter username: `24r21a0489`
- [ ] Enter password: `Var@123`
- [ ] Click "Sign In"
- [ ] Should redirect to dashboard
- [ ] No "Invalid credentials" error

### 3. Test Dashboard

- [ ] Dashboard loads without errors
- [ ] No "No active devices" message (if devices configured)
- [ ] Check browser console for errors
- [ ] Verify no authentication errors

### 4. Test Device Management

- [ ] Navigate to `/devices` page
- [ ] Page loads successfully
- [ ] Can add new device
- [ ] Can toggle device active/inactive
- [ ] Device state persists on refresh

## Troubleshooting

### Issue: "Invalid username or password"

**Solution:**
1. Verify environment variables in Vercel dashboard
2. Check for typos or extra spaces
3. Ensure variable names start with `VITE_`
4. Redeploy after fixing

### Issue: Variables show "undefined" in console

**Solution:**
1. Environment variables not set in Vercel
2. Add them in Project Settings → Environment Variables
3. Must redeploy after adding variables
4. Clear browser cache

### Issue: Build fails

**Solution:**
1. Check build logs in Vercel
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are listed
4. Try building locally first

### Issue: Page loads but authentication fails

**Solution:**
1. Check browser console for errors
2. Verify password hash is correct
3. Test hash generation locally
4. Ensure no trailing spaces in env values

## Success Criteria

- [ ] ✅ Build completes successfully
- [ ] ✅ Environment variables load correctly
- [ ] ✅ Login works with correct credentials
- [ ] ✅ Dashboard displays without errors
- [ ] ✅ Device management works
- [ ] ✅ No console errors
- [ ] ✅ All pages accessible

## Additional Notes

### Password Hash Generation

If you need to generate a new password hash:

```bash
# Using Node.js
node scripts/generate-password-hash.js

# Or using OpenSSL
echo -n "your_password" | openssl dgst -sha256

# Or online tool
# https://emn178.github.io/online-tools/sha256.html
```

### Environment Variable Format

```
VITE_ADMIN_USERNAME=24r21a0489
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
VITE_HOME_LATITUDE=28.6139
VITE_HOME_LONGITUDE=77.209
VITE_HOME_NAME=Home Base
```

**Important:**
- No quotes around values
- No spaces around `=`
- No trailing spaces
- Must start with `VITE_` for Vite projects

## Backend Deployment (Separate)

The backend is NOT deployed on Vercel. If you want to use the backend:

1. Deploy backend to Railway/Render/Heroku
2. Set backend environment variables:
   - `THINGSPEAK_CHANNEL_ID`
   - `THINGSPEAK_READ_API_KEY`
   - `FRONTEND_URL` (your Vercel URL)
   - `NODE_ENV=production`
3. Update frontend to call backend API
4. Test end-to-end integration

## Support

For issues, check:
1. This checklist
2. `ENVIRONMENT_ANALYSIS.md` (comprehensive guide)
3. `IMMEDIATE_ACTION_REQUIRED.md` (quick fix guide)
4. Vercel build logs
5. Browser console errors

---

**Last Updated:** 2026-04-10
**Status:** Ready for deployment
