# AirBloom Tracker - Production Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub repository with your code
- Admin credentials (username and password hash)

### Step 1: Prepare Environment Variables

1. **Generate Password Hash**
   ```bash
   # Using Node.js
   node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('YOUR_PASSWORD').digest('hex'));"
   
   # Or using OpenSSL
   echo -n "YOUR_PASSWORD" | openssl dgst -sha256
   ```

2. **Required Environment Variables**
   - `VITE_ADMIN_USERNAME` - Your admin username (e.g., "admin" or "24r21a0489")
   - `VITE_ADMIN_PASSWORD_HASH` - SHA-256 hash of your password
   - `VITE_THINGSPEAK_CHANNEL_ID` - Your ThingSpeak channel ID (optional)
   - `VITE_THINGSPEAK_API_KEY` - Your ThingSpeak Read API key (optional)
   - `VITE_HOME_LATITUDE` - Default map latitude (optional)
   - `VITE_HOME_LONGITUDE` - Default map longitude (optional)
   - `VITE_HOME_NAME` - Default location name (optional)

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Vite**
   - Root Directory: **airbloom-tracker**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables:**
   - Go to "Environment Variables" section
   - Add each variable from `.env.example`
   - Make sure to add them for **Production**, **Preview**, and **Development**

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project directory
cd airbloom-tracker

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_ADMIN_USERNAME
vercel env add VITE_ADMIN_PASSWORD_HASH
# ... add other variables

# Redeploy with new environment variables
vercel --prod
```

### Step 3: Verify Deployment

1. **Check Build Logs**
   - Look for any warnings about missing environment variables
   - Ensure build completes successfully

2. **Test Login**
   - Navigate to your deployed URL
   - Try logging in with your credentials
   - Check browser console for any errors

3. **Debug if Login Fails**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for `[AUTH]` prefixed messages
   - Common issues:
     - Environment variables not set
     - Wrong password hash
     - Username mismatch

### Step 4: Post-Deployment

1. **Update Environment Variables**
   - Go to Project Settings > Environment Variables
   - Edit any variable
   - Redeploy from Deployments tab

2. **Monitor Application**
   - Check Vercel Analytics
   - Monitor error logs
   - Set up alerts if needed

## 🔧 Troubleshooting

### Login Not Working

**Symptom:** "Invalid username or password" error

**Solutions:**

1. **Check Environment Variables**
   ```bash
   # In Vercel dashboard, verify:
   - VITE_ADMIN_USERNAME is set correctly
   - VITE_ADMIN_PASSWORD_HASH matches your password
   ```

2. **Verify Password Hash**
   ```bash
   # Generate hash locally and compare
   node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('YOUR_PASSWORD').digest('hex'));"
   ```

3. **Check Browser Console**
   - Look for `[AUTH]` logs
   - Check if environment variables are loaded
   - Verify username format (with or without @domain)

4. **Clear Browser Data**
   - Clear localStorage
   - Clear sessionStorage
   - Try in incognito mode

5. **Redeploy**
   - After changing environment variables
   - Always redeploy for changes to take effect

### Environment Variables Not Loading

**Symptom:** Console shows "Environment variable not set"

**Solutions:**

1. **Verify Variable Names**
   - Must start with `VITE_`
   - Case-sensitive
   - No typos

2. **Check Vercel Settings**
   - Go to Project Settings > Environment Variables
   - Ensure variables are set for correct environment (Production)
   - No trailing spaces in values

3. **Rebuild Application**
   - Trigger new deployment
   - Environment variables are embedded at build time

### Rate Limiting Issues

**Symptom:** "Too many failed attempts" message

**Solutions:**

1. **Clear Session Storage**
   ```javascript
   // In browser console
   sessionStorage.clear();
   ```

2. **Wait 15 Minutes**
   - Rate limit expires after 15 minutes
   - Or clear sessionStorage

3. **Use Correct Credentials**
   - Avoid multiple failed attempts

## 📝 Security Best Practices

1. **Never Commit `.env` File**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Rotate Credentials Regularly**
   - Change password every 90 days
   - Update hash in Vercel

4. **Monitor Access**
   - Check Vercel logs regularly
   - Set up alerts for suspicious activity

5. **Use HTTPS Only**
   - Vercel provides HTTPS by default
   - Never use HTTP in production

## 🔍 Debugging Commands

### Check Environment Variables (Local)
```bash
# Print all VITE_ variables
npm run build -- --debug
```

### Test Authentication (Browser Console)
```javascript
// Check if env vars are loaded
console.log(import.meta.env.VITE_ADMIN_USERNAME);

// Test password hash
const password = "YOUR_PASSWORD";
const encoder = new TextEncoder();
const data = encoder.encode(password);
crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Password hash:', hashHex);
});
```

### Clear All Auth Data (Browser Console)
```javascript
// Clear everything
localStorage.removeItem('airbloom-user');
sessionStorage.clear();
location.reload();
```

## 📞 Support

If you continue to experience issues:

1. Check browser console for detailed error messages
2. Review Vercel deployment logs
3. Verify all environment variables are set correctly
4. Try deploying a fresh build
5. Test in incognito mode to rule out cache issues

## 🎯 Quick Checklist

Before deploying:
- [ ] Generated password hash
- [ ] Created `.env` file locally (for testing)
- [ ] Tested login locally
- [ ] Added all environment variables to Vercel
- [ ] Verified variable names start with `VITE_`
- [ ] No trailing spaces in variable values
- [ ] Deployed to Vercel
- [ ] Tested login in production
- [ ] Checked browser console for errors
- [ ] Verified session persistence works

After deployment:
- [ ] Login works correctly
- [ ] Session persists after refresh
- [ ] Logout works correctly
- [ ] Rate limiting works
- [ ] No console errors
- [ ] HTTPS is enabled
- [ ] All pages load correctly
