# Multi-User Authentication Guide

## Overview

The AirBloom Tracker now supports multiple users with different roles. You can add admin users and viewer users with independent credentials.

---

## User Roles

### Admin Role
- Full access to all features
- Can view all devices and sensors
- Can add/remove/manage devices
- Can configure settings

### Viewer Role
- Read-only access
- Can view all active devices and sensors
- Can view dashboard and charts
- Cannot add/remove devices
- Cannot modify settings

---

## Default Users

### User 1: Admin (Primary)
- **Username:** `24r21a0489`
- **Email:** `24r21a0489@mlrit.ac.in`
- **Password:** `Var@123`
- **Role:** Admin
- **Hash:** `557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a`

### User 2: Viewer (Sample)
- **Username:** `viewer`
- **Email:** `viewer@airbloom.io`
- **Password:** `Viewer@123`
- **Role:** Viewer
- **Hash:** `06470f816c6846a98c2a79c2ce2cfa4fcb4ad935a8e4252065e99370ec119e0c`

---

## Environment Variables

### Required (Admin User)

```env
VITE_ADMIN_USERNAME=24r21a0489
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

### Optional (Additional Users)

#### User 2 (Viewer)
```env
VITE_USER2_USERNAME=viewer
VITE_USER2_PASSWORD_HASH=06470f816c6846a98c2a79c2ce2cfa4fcb4ad935a8e4252065e99370ec119e0c
VITE_USER2_EMAIL=viewer@airbloom.io
VITE_USER2_NAME=Viewer User
VITE_USER2_ROLE=viewer
```

#### User 3 (Optional)
```env
VITE_USER3_USERNAME=your_username
VITE_USER3_PASSWORD_HASH=your_password_hash
VITE_USER3_EMAIL=user3@airbloom.io
VITE_USER3_NAME=User 3
VITE_USER3_ROLE=viewer
```

---

## Adding Users to Vercel

### Step 1: Go to Vercel Dashboard

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add User 2 (Viewer) Variables

Add these 5 variables for the viewer user:

| Variable Name | Value |
|--------------|-------|
| `VITE_USER2_USERNAME` | `viewer` |
| `VITE_USER2_PASSWORD_HASH` | `06470f816c6846a98c2a79c2ce2cfa4fcb4ad935a8e4252065e99370ec119e0c` |
| `VITE_USER2_EMAIL` | `viewer@airbloom.io` |
| `VITE_USER2_NAME` | `Viewer User` |
| `VITE_USER2_ROLE` | `viewer` |

For each variable:
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**
- Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy**
3. Wait for build to complete

### Step 4: Test Login

Try logging in with the viewer account:
- Username: `viewer`
- Password: `Viewer@123`

---

## Creating Additional Users

### Step 1: Generate Password Hash

Use one of these methods:

#### Method 1: Node.js Script
```bash
cd airbloom-tracker
npm run generate-hash
# Enter your password when prompted
```

#### Method 2: Command Line
```bash
echo -n "YourPassword123" | openssl dgst -sha256
```

#### Method 3: Online Tool
Visit: https://emn178.github.io/online-tools/sha256.html
- Enter your password
- Copy the hash

### Step 2: Add Environment Variables

For User 3, add these variables to Vercel:

```
VITE_USER3_USERNAME=john
VITE_USER3_PASSWORD_HASH=<generated_hash>
VITE_USER3_EMAIL=john@airbloom.io
VITE_USER3_NAME=John Doe
VITE_USER3_ROLE=viewer
```

### Step 3: Redeploy

Redeploy your application for changes to take effect.

---

## Login Options

Users can log in using any of these formats:

### Username Only
```
viewer
```

### Email Format
```
viewer@airbloom.io
viewer@mlrit.ac.in
```

All formats will work for authentication.

---

## User Management

### Current Limitations

- Maximum 3 users supported (1 admin + 2 additional)
- Users are configured via environment variables
- No UI for user management
- Roles are fixed (cannot be changed after login)

### Future Enhancements

- Database-backed user management
- UI for adding/removing users
- Role-based permissions
- User profile management
- Password reset functionality

---

## Security Features

### Password Hashing
- SHA-256 hashing algorithm
- Passwords never stored in plain text
- Hashes embedded at build time

### Rate Limiting
- 5 failed attempts allowed
- 15-minute lockout after 5 failures
- Per-user rate limiting

### Session Management
- Client-side session storage
- Automatic logout on browser close
- No persistent sessions

---

## Testing Multi-User System

### Test Scenario 1: Admin Login

1. Go to `/login`
2. Enter:
   - Username: `24r21a0489`
   - Password: `Var@123`
3. Should see full dashboard with all features

### Test Scenario 2: Viewer Login

1. Go to `/login`
2. Enter:
   - Username: `viewer`
   - Password: `Viewer@123`
3. Should see dashboard (read-only)

### Test Scenario 3: Multiple Logins

1. Open browser window 1 → Login as admin
2. Open browser window 2 (incognito) → Login as viewer
3. Both should work independently

---

## Troubleshooting

### Issue: Viewer user cannot login

**Cause:** Environment variables not set in Vercel

**Solution:**
1. Check Vercel environment variables
2. Ensure all 5 USER2 variables are set
3. Redeploy after adding variables

### Issue: "User not found" error

**Cause:** Username doesn't match any configured user

**Solution:**
1. Check username spelling
2. Verify environment variables are set
3. Check browser console for available users

### Issue: Password hash doesn't work

**Cause:** Hash generated incorrectly

**Solution:**
1. Regenerate hash using provided methods
2. Ensure no extra spaces or newlines
3. Hash should be exactly 64 characters

---

## Complete Environment Variable List

### For Vercel Dashboard

Copy these to Vercel (all environments):

```
# Admin User (Required)
VITE_ADMIN_USERNAME=24r21a0489
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a

# Viewer User (Optional)
VITE_USER2_USERNAME=viewer
VITE_USER2_PASSWORD_HASH=06470f816c6846a98c2a79c2ce2cfa4fcb4ad935a8e4252065e99370ec119e0c
VITE_USER2_EMAIL=viewer@airbloom.io
VITE_USER2_NAME=Viewer User
VITE_USER2_ROLE=viewer

# Map Configuration (Optional)
VITE_HOME_LATITUDE=28.6139
VITE_HOME_LONGITUDE=77.209
VITE_HOME_NAME=Home Base
```

---

## API Reference

### User Interface

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}
```

### Authentication Function

```typescript
async function authenticateUser(
  username: string, 
  password: string
): Promise<User | null>
```

**Returns:**
- `User` object if authentication succeeds
- `null` if credentials are invalid
- Throws error if rate limited or system error

---

## Best Practices

### Password Security

1. Use strong passwords (min 8 characters)
2. Include uppercase, lowercase, numbers, symbols
3. Don't reuse passwords
4. Change passwords periodically

### User Management

1. Create viewer accounts for read-only access
2. Limit admin accounts to trusted users
3. Use descriptive usernames
4. Document user credentials securely

### Environment Variables

1. Never commit `.env` files to Git
2. Use different passwords for dev/prod
3. Rotate credentials regularly
4. Keep backup of environment variables

---

## Summary

### What's New

- ✅ Multi-user authentication support
- ✅ Role-based access (admin/viewer)
- ✅ Up to 3 users supported
- ✅ Independent credentials per user
- ✅ Flexible login formats

### Quick Setup

1. Add viewer user variables to Vercel
2. Redeploy application
3. Test login with viewer credentials
4. Share credentials with team members

### Credentials Summary

| User | Username | Password | Role | Access |
|------|----------|----------|------|--------|
| Admin | `24r21a0489` | `Var@123` | Admin | Full |
| Viewer | `viewer` | `Viewer@123` | Viewer | Read-only |

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10
**Status:** ✅ Multi-user system active
