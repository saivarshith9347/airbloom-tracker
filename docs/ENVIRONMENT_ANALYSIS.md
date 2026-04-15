# 🔍 Complete Environment Variables Analysis

## 📋 Executive Summary

This document provides a comprehensive analysis of ALL environment variables used in the AirBloom Tracker project, including frontend (Vite/React) and backend (Express) components.

**Project Type:** Vite + React + TypeScript (Frontend) + Express.js (Backend)
**Deployment Platform:** Vercel (Frontend), Separate hosting for Backend
**Authentication:** Custom SHA-256 password hashing (No JWT/NextAuth)

---

## 🎯 Critical Findings

### ✅ What's Working
- Custom authentication system using SHA-256 password hashing
- Centralized environment configuration (`src/config/env.ts`)
- Comprehensive error logging and debugging
- Device-specific ThingSpeak credentials (stored in localStorage)

### ⚠️ Issues Identified
1. **No JWT/Session Management** - Authentication is client-side only
2. **Backend Not Integrated** - Backend exists but frontend doesn't use it
3. **ThingSpeak Credentials** - Frontend has placeholders but uses device-specific credentials
4. **Missing Backend Deployment** - Backend needs separate deployment (not on Vercel)

---

## 📦 FRONTEND Environment Variables (Vite)

### Required Variables (CRITICAL)

#### 1. VITE_ADMIN_USERNAME
- **Purpose:** Admin login username
- **Used In:** 
  - `src/config/env.ts` (line 45)
  - `src/lib/auth.ts` (line 97, 102, 112, 157)
- **Current Value:** `24r21a0489`
- **Example:** `24r21a0489`
- **Required:** ✅ YES (Authentication will fail without it)
- **Vercel Status:** ⚠️ MUST BE SET IN VERCEL

#### 2. VITE_ADMIN_PASSWORD_HASH
- **Purpose:** SHA-256 hash of admin password
- **Used In:**
  - `src/config/env.ts` (line 46)
  - `src/lib/auth.ts` (line 97, 103, 145)
- **Current Value:** `557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a`
- **Password:** `Var@123` (hashed)
- **Example:** `557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a`
- **Required:** ✅ YES (Authentication will fail without it)
- **Vercel Status:** ⚠️ MUST BE SET IN VERCEL

### Optional Variables (Feature-Specific)

#### 3. VITE_THINGSPEAK_CHANNEL_ID
- **Purpose:** Default ThingSpeak channel ID (legacy - now device-specific)
- **Used In:**
  - `src/config/env.ts` (line 60)
  - `src/vite-env.d.ts` (line 4)
  - `src/pages/Index.tsx` (line 73 - error message only)
- **Current Value:** Empty (devices use their own channel IDs)
- **Example:** `2739166`
- **Required:** ❌ NO (Device-specific credentials used instead)
- **Vercel Status:** ⚠️ OPTIONAL (Can be empty)

#### 4. VITE_THINGSPEAK_API_KEY
- **Purpose:** Default ThingSpeak Read API Key (legacy - now device-specific)
- **Used In:**
  - `src/config/env.ts` (line 61)
  - `src/vite-env.d.ts` (line 5)
  - `src/pages/Index.tsx` (line 73 - error message only)
- **Current Value:** Empty (devices use their own API keys)
- **Example:** `ABC123XYZ456`
- **Required:** ❌ NO (Device-specific credentials used instead)
- **Vercel Status:** ⚠️ OPTIONAL (Can be empty)

#### 5. VITE_HOME_LATITUDE
- **Purpose:** Default map center latitude
- **Used In:**
  - `src/config/env.ts` (line 62)
  - `src/pages/Index.tsx` (line 196)
- **Current Value:** `28.6139`
- **Example:** `28.6139`
- **Required:** ❌ NO (Has fallback value)
- **Vercel Status:** ✅ OPTIONAL (Defaults to 28.6139)

#### 6. VITE_HOME_LONGITUDE
- **Purpose:** Default map center longitude
- **Used In:**
  - `src/config/env.ts` (line 63)
  - `src/pages/Index.tsx` (line 197)
- **Current Value:** `77.209`
- **Example:** `77.209`
- **Required:** ❌ NO (Has fallback value)
- **Vercel Status:** ✅ OPTIONAL (Defaults to 77.209)

#### 7. VITE_HOME_NAME
- **Purpose:** Default location name for map
- **Used In:**
  - `src/config/env.ts` (line 64)
  - `src/pages/Index.tsx` (line 198)
- **Current Value:** `Home Base`
- **Example:** `Home Base`
- **Required:** ❌ NO (Has fallback value)
- **Vercel Status:** ✅ OPTIONAL (Defaults to "Home Base")

---

## 🖥️ BACKEND Environment Variables (Express)

### Required Variables

#### 1. THINGSPEAK_CHANNEL_ID
- **Purpose:** ThingSpeak channel ID for backend API
- **Used In:**
  - `backend/services/thingSpeakService.js` (line 12)
- **Current Value:** `3303384`
- **Example:** `3303384`
- **Required:** ✅ YES (Backend API will fail without it)
- **Deployment:** ⚠️ MUST BE SET ON BACKEND HOST

#### 2. THINGSPEAK_READ_API_KEY
- **Purpose:** ThingSpeak Read API Key for backend
- **Used In:**
  - `backend/services/thingSpeakService.js` (line 13)
- **Current Value:** `IOQIVSWTYLHAYRU1`
- **Example:** `IOQIVSWTYLHAYRU1`
- **Required:** ✅ YES (Backend API will fail without it)
- **Deployment:** ⚠️ MUST BE SET ON BACKEND HOST

#### 3. PORT
- **Purpose:** Backend server port
- **Used In:**
  - `backend/server.js` (line 17)
- **Current Value:** `5001`
- **Example:** `5001` (development), `80` or `443` (production)
- **Required:** ❌ NO (Defaults to 5000)
- **Deployment:** ✅ OPTIONAL (Platform usually sets this)

#### 4. FRONTEND_URL
- **Purpose:** CORS configuration - allowed frontend origin
- **Used In:**
  - `backend/server.js` (line 18)
- **Current Value:** `https://airbloom-tracker.vercel.app`
- **Example:** `https://airbloom-tracker.vercel.app`
- **Required:** ✅ YES (CORS will block requests without it)
- **Deployment:** ⚠️ MUST BE SET TO PRODUCTION FRONTEND URL

#### 5. NODE_ENV
- **Purpose:** Environment mode (development/production)
- **Used In:**
  - `backend/server.js` (line 67, 78)
  - `backend/controllers/dataController.js` (line 102)
- **Current Value:** `development`
- **Example:** `production`
- **Required:** ❌ NO (Defaults to development)
- **Deployment:** ✅ RECOMMENDED (Set to "production")

---

## 🚨 MISSING CONFIGURATION

### Authentication System Analysis

**Current Implementation:**
- ✅ Custom SHA-256 password hashing
- ✅ Client-side authentication
- ✅ Rate limiting (session storage)
- ❌ NO JWT tokens
- ❌ NO server-side session management
- ❌ NO NextAuth
- ❌ NO secure token storage

**Security Concerns:**
1. Authentication is entirely client-side
2. No server-side validation
3. No secure session management
4. Password hash is exposed in frontend code (embedded at build time)

**Recommendation:**
- Current system works for basic access control
- For production, consider adding backend authentication
- Implement JWT tokens for API requests
- Move authentication logic to backend

### Missing Environment Variables

**None identified** - All required variables are defined in `.env.example`

---

## 📝 Complete Environment Variable List

### Frontend (.env for Vite)

```env
# ============================================
# FRONTEND ENVIRONMENT VARIABLES (Vite)
# ============================================

# REQUIRED - Authentication (CRITICAL)
VITE_ADMIN_USERNAME=24r21a0489
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a

# OPTIONAL - ThingSpeak (Legacy - Device-specific now)
VITE_THINGSPEAK_CHANNEL_ID=
VITE_THINGSPEAK_API_KEY=

# OPTIONAL - Map Configuration (Has defaults)
VITE_HOME_LATITUDE=28.6139
VITE_HOME_LONGITUDE=77.209
VITE_HOME_NAME=Home Base
```

### Backend (.env for Express)

```env
# ============================================
# BACKEND ENVIRONMENT VARIABLES (Express)
# ============================================

# REQUIRED - ThingSpeak API
THINGSPEAK_CHANNEL_ID=3303384
THINGSPEAK_READ_API_KEY=IOQIVSWTYLHAYRU1

# REQUIRED - CORS Configuration
FRONTEND_URL=https://airbloom-tracker.vercel.app

# OPTIONAL - Server Configuration
PORT=5001
NODE_ENV=production
```

---

## 🚀 Vercel Deployment Configuration

### Step-by-Step Setup

#### 1. Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_ADMIN_USERNAME` | `24r21a0489` | Production, Preview, Development |
| `VITE_ADMIN_PASSWORD_HASH` | `557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a` | Production, Preview, Development |
| `VITE_HOME_LATITUDE` | `28.6139` | Production, Preview, Development |
| `VITE_HOME_LONGITUDE` | `77.209` | Production, Preview, Development |
| `VITE_HOME_NAME` | `Home Base` | Production, Preview, Development |

**Optional (if using default ThingSpeak):**
| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_THINGSPEAK_CHANNEL_ID` | `your_channel_id` | Production, Preview, Development |
| `VITE_THINGSPEAK_API_KEY` | `your_api_key` | Production, Preview, Development |

#### 2. Verify Configuration

After adding variables:
1. Click "Redeploy" in Vercel
2. Wait for build to complete
3. Open deployed site
4. Press F12 (Developer Console)
5. Run:
   ```javascript
   console.log(import.meta.env.VITE_ADMIN_USERNAME);
   console.log(import.meta.env.VITE_ADMIN_PASSWORD_HASH);
   ```
6. Should show your values (NOT undefined)

#### 3. Test Login

1. Go to `/login` page
2. Enter credentials:
   - Username: `24r21a0489`
   - Password: `Var@123`
3. Should successfully log in

---

## 🔧 Backend Deployment (Separate from Vercel)

### Recommended Platforms

1. **Railway.app** (Recommended)
2. **Render.com**
3. **Heroku**
4. **DigitalOcean App Platform**
5. **AWS Elastic Beanstalk**

### Deployment Steps

#### Option 1: Railway.app

1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory: `backend`
5. Add environment variables:
   ```
   THINGSPEAK_CHANNEL_ID=3303384
   THINGSPEAK_READ_API_KEY=IOQIVSWTYLHAYRU1
   FRONTEND_URL=https://airbloom-tracker.vercel.app
   NODE_ENV=production
   ```
6. Deploy
7. Copy the generated URL (e.g., `https://your-app.railway.app`)

#### Option 2: Render.com

1. Create account at render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `airbloom-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as above)
6. Deploy

### Update Frontend to Use Backend

**Currently:** Frontend calls ThingSpeak API directly
**To Use Backend:** Update `src/lib/thingspeak.ts` to call your backend API

```typescript
// Replace ThingSpeak API calls with backend API calls
const BACKEND_URL = 'https://your-backend-url.railway.app';

export async function fetchThingSpeakData(results: number) {
  const response = await fetch(`${BACKEND_URL}/api/data/latest`);
  return response.json();
}
```

---

## 📋 Deployment Checklist

### Frontend (Vercel)

- [ ] Add `VITE_ADMIN_USERNAME` to Vercel
- [ ] Add `VITE_ADMIN_PASSWORD_HASH` to Vercel
- [ ] Add optional map variables (LATITUDE, LONGITUDE, NAME)
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click "Redeploy" after adding variables
- [ ] Verify build completes successfully
- [ ] Test login on deployed site
- [ ] Check browser console for environment variable values
- [ ] Verify no "undefined" errors in console

### Backend (Railway/Render/etc.)

- [ ] Choose hosting platform
- [ ] Create new project/service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add `THINGSPEAK_CHANNEL_ID` environment variable
- [ ] Add `THINGSPEAK_READ_API_KEY` environment variable
- [ ] Add `FRONTEND_URL` environment variable (Vercel URL)
- [ ] Set `NODE_ENV=production`
- [ ] Deploy backend
- [ ] Test API endpoints (health check)
- [ ] Copy backend URL for frontend integration

### Integration (Optional)

- [ ] Update frontend to use backend API
- [ ] Replace direct ThingSpeak calls with backend calls
- [ ] Update CORS settings if needed
- [ ] Test end-to-end data flow
- [ ] Verify authentication still works

---

## 🐛 Debugging Guide

### Issue: "Invalid username or password" in Production

**Cause:** Environment variables not set in Vercel

**Solution:**
1. Go to Vercel Project Settings → Environment Variables
2. Verify `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD_HASH` exist
3. Check for typos or extra spaces
4. Redeploy after adding/fixing variables

**Debug Steps:**
```javascript
// In browser console on deployed site:
console.log('Username:', import.meta.env.VITE_ADMIN_USERNAME);
console.log('Hash:', import.meta.env.VITE_ADMIN_PASSWORD_HASH);

// Should show:
// Username: 24r21a0489
// Hash: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

### Issue: "Authentication system not configured"

**Cause:** Environment variables are undefined

**Solution:**
1. Check Vercel environment variables are set
2. Ensure variable names start with `VITE_`
3. Redeploy after adding variables
4. Clear browser cache

### Issue: Backend CORS errors

**Cause:** `FRONTEND_URL` not set correctly

**Solution:**
1. Set `FRONTEND_URL` to your Vercel deployment URL
2. Include protocol: `https://airbloom-tracker.vercel.app`
3. No trailing slash
4. Restart backend server

### Issue: No sensor data showing

**Cause:** Device not configured or ThingSpeak credentials invalid

**Solution:**
1. Go to Devices page
2. Add a device with valid ThingSpeak credentials
3. Toggle device to "Active"
4. Refresh dashboard

---

## 🔐 Security Recommendations

### Current Security Level: ⚠️ BASIC

**Implemented:**
- ✅ Password hashing (SHA-256)
- ✅ Rate limiting (5 attempts, 15-minute lockout)
- ✅ Client-side validation
- ✅ HTTPS (Vercel provides SSL)
- ✅ Security headers (X-Frame-Options, etc.)

**Missing:**
- ❌ Server-side authentication
- ❌ JWT tokens
- ❌ Secure session management
- ❌ API authentication
- ❌ Backend authorization

### Recommended Improvements

1. **Add Backend Authentication**
   - Move authentication logic to backend
   - Implement JWT tokens
   - Secure API endpoints

2. **Environment Variable Security**
   - Never commit `.env` files
   - Use different credentials for dev/prod
   - Rotate API keys regularly

3. **API Security**
   - Add authentication to backend API
   - Implement rate limiting on backend
   - Validate all inputs

4. **Frontend Security**
   - Don't expose sensitive data in frontend
   - Use secure HTTP-only cookies for tokens
   - Implement CSRF protection

---

## 📊 Environment Variable Summary Table

| Variable | Type | Required | Current Value | Used In | Vercel Status |
|----------|------|----------|---------------|---------|---------------|
| `VITE_ADMIN_USERNAME` | Frontend | ✅ YES | `24r21a0489` | Auth | ⚠️ MUST SET |
| `VITE_ADMIN_PASSWORD_HASH` | Frontend | ✅ YES | `557d05...` | Auth | ⚠️ MUST SET |
| `VITE_THINGSPEAK_CHANNEL_ID` | Frontend | ❌ NO | Empty | Legacy | ✅ OPTIONAL |
| `VITE_THINGSPEAK_API_KEY` | Frontend | ❌ NO | Empty | Legacy | ✅ OPTIONAL |
| `VITE_HOME_LATITUDE` | Frontend | ❌ NO | `28.6139` | Map | ✅ OPTIONAL |
| `VITE_HOME_LONGITUDE` | Frontend | ❌ NO | `77.209` | Map | ✅ OPTIONAL |
| `VITE_HOME_NAME` | Frontend | ❌ NO | `Home Base` | Map | ✅ OPTIONAL |
| `THINGSPEAK_CHANNEL_ID` | Backend | ✅ YES | `3303384` | API | ⚠️ BACKEND HOST |
| `THINGSPEAK_READ_API_KEY` | Backend | ✅ YES | `IOQIVSW...` | API | ⚠️ BACKEND HOST |
| `FRONTEND_URL` | Backend | ✅ YES | `https://...` | CORS | ⚠️ BACKEND HOST |
| `PORT` | Backend | ❌ NO | `5001` | Server | ✅ OPTIONAL |
| `NODE_ENV` | Backend | ❌ NO | `development` | Config | ✅ OPTIONAL |

---

## 🎯 Quick Action Items

### Immediate (Required for Production)

1. ✅ Add `VITE_ADMIN_USERNAME` to Vercel
2. ✅ Add `VITE_ADMIN_PASSWORD_HASH` to Vercel
3. ✅ Redeploy on Vercel
4. ✅ Test login on production

### Short-term (Recommended)

1. ⚠️ Deploy backend to Railway/Render
2. ⚠️ Set backend environment variables
3. ⚠️ Test backend API endpoints
4. ⚠️ Update frontend to use backend (optional)

### Long-term (Security Improvements)

1. 🔒 Implement server-side authentication
2. 🔒 Add JWT token management
3. 🔒 Secure API endpoints
4. 🔒 Add comprehensive logging
5. 🔒 Implement monitoring and alerts

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify environment variables in Vercel dashboard
3. Review build logs in Vercel
4. Test locally with same environment variables
5. Check this document for debugging steps

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10
**Status:** ✅ Complete Analysis
