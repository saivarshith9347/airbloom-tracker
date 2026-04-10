# Authentication System - Production Ready

## Overview

The AirBloom Tracker uses a client-side authentication system with the following features:

- ✅ SHA-256 password hashing
- ✅ Rate limiting (5 attempts, 15-minute lockout)
- ✅ Session management with 8-hour expiration
- ✅ Environment variable-based credentials
- ✅ Production-ready error handling
- ✅ Comprehensive logging for debugging
- ✅ Multiple email format support

## Architecture

### Client-Side Authentication

This application uses **client-side authentication** where credentials are stored as environment variables and validated in the browser. This approach is suitable for:

- Single admin user scenarios
- Internal tools and dashboards
- Prototypes and MVPs
- Applications without sensitive data

**Note:** For production applications with multiple users or sensitive data, consider implementing a proper backend authentication system with a database.

## How It Works

### 1. Password Hashing

Passwords are hashed using SHA-256 before comparison:

```javascript
// Password: "Var@123"
// Hash: 557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

### 2. Environment Variables

Credentials are stored in environment variables (never in code):

```env
VITE_ADMIN_USERNAME=24r21a0489
VITE_ADMIN_PASSWORD_HASH=557d05015431d58b28589b76ab0802877aad0e3cb3020be41d21b116e45d620a
```

### 3. Authentication Flow

```
User enters credentials
        ↓
Rate limit check
        ↓
Username validation
        ↓
Password hashing
        ↓
Hash comparison
        ↓
Session creation (8 hours)
        ↓
Redirect to dashboard
```

### 4. Session Management

- Sessions stored in `localStorage`
- 8-hour expiration
- Automatic cleanup on expiry
- Cleared on logout

### 5. Rate Limiting

- Stored in `sessionStorage`
- 5 failed attempts allowed
- 15-minute lockout period
- Per-username tracking

## Files Structure

```
src/
├── lib/
│   └── auth.ts              # Core authentication logic
├── contexts/
│   └── AuthContext.tsx      # React context for auth state
├── pages/
│   └── Login.tsx            # Login UI component
└── components/
    └── ProtectedRoute.tsx   # Route protection wrapper
```

## Configuration

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate password hash:
   ```bash
   node scripts/generate-password-hash.js YOUR_PASSWORD
   ```

3. Update `.env`:
   ```env
   VITE_ADMIN_USERNAME=your_username
   VITE_ADMIN_PASSWORD_HASH=generated_hash
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Production (Vercel)

1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Add variables:
   - `VITE_ADMIN_USERNAME`
   - `VITE_ADMIN_PASSWORD_HASH`
4. Redeploy application

## Debugging

### Enable Debug Logs

All authentication operations log to the console with `[AUTH]` prefix:

```javascript
[AUTH] Authentication attempt for: admin
[AUTH] Environment check passed
[AUTH] Expected username: admin
[AUTH] Username matched, verifying password...
[AUTH] Password hashed successfully
[AUTH] Authentication successful for: admin
```

### Common Issues

#### 1. "Invalid username or password"

**Causes:**
- Wrong username
- Wrong password
- Incorrect password hash
- Environment variables not set

**Debug:**
```javascript
// In browser console
console.log(import.meta.env.VITE_ADMIN_USERNAME);
console.log(import.meta.env.VITE_ADMIN_PASSWORD_HASH);
```

#### 2. "Authentication system not configured"

**Cause:** Environment variables missing

**Solution:**
- Check `.env` file exists
- Verify variable names start with `VITE_`
- Restart dev server after changes
- In production, redeploy after adding variables

#### 3. "Too many failed attempts"

**Cause:** Rate limit triggered

**Solution:**
```javascript
// Clear rate limit data
sessionStorage.clear();
```

Or wait 15 minutes for automatic reset.

#### 4. Session expires immediately

**Cause:** System clock mismatch or corrupted session data

**Solution:**
```javascript
// Clear session
localStorage.removeItem('airbloom-user');
```

## Security Considerations

### Current Implementation

✅ **Strengths:**
- Password hashing (SHA-256)
- Rate limiting
- Session expiration
- No passwords in code
- HTTPS enforced (Vercel)

⚠️ **Limitations:**
- Client-side validation (credentials visible in build)
- Single user support
- No password reset mechanism
- No multi-factor authentication

### Recommendations for Production

For a production application with multiple users:

1. **Implement Backend Authentication**
   - Use JWT tokens
   - Store credentials in database
   - Hash passwords with bcrypt/argon2
   - Implement refresh tokens

2. **Add Security Features**
   - Multi-factor authentication
   - Password reset via email
   - Account lockout after failed attempts
   - Audit logging

3. **Use Authentication Service**
   - Auth0
   - Firebase Authentication
   - AWS Cognito
   - Supabase Auth

## API Reference

### `authenticateUser(username, password)`

Authenticates a user with username and password.

**Parameters:**
- `username` (string): Username or email
- `password` (string): Plain text password

**Returns:**
- `Promise<User | null>`: User object if successful, null otherwise

**Throws:**
- `Error`: If rate limited or system error

**Example:**
```typescript
try {
  const user = await authenticateUser('admin', 'password123');
  if (user) {
    console.log('Login successful:', user);
  } else {
    console.log('Invalid credentials');
  }
} catch (error) {
  console.error('Login error:', error.message);
}
```

### `useAuth()` Hook

React hook for accessing authentication state and methods.

**Returns:**
```typescript
{
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Example:**
```typescript
function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <LoginForm onLogin={login} />;
}
```

## Testing

### Manual Testing

1. **Test Valid Login:**
   - Enter correct username and password
   - Should redirect to dashboard
   - Session should persist on refresh

2. **Test Invalid Login:**
   - Enter wrong password
   - Should show error message
   - Should not redirect

3. **Test Rate Limiting:**
   - Enter wrong password 5 times
   - Should show lockout message
   - Should prevent further attempts

4. **Test Session Expiration:**
   - Login successfully
   - Wait 8 hours (or modify expiration time)
   - Refresh page
   - Should redirect to login

5. **Test Logout:**
   - Login successfully
   - Click logout
   - Should clear session
   - Should redirect to login

### Automated Testing

```typescript
// Example test with Vitest
import { describe, it, expect } from 'vitest';
import { authenticateUser } from './auth';

describe('Authentication', () => {
  it('should authenticate valid credentials', async () => {
    const user = await authenticateUser('admin', 'correct_password');
    expect(user).not.toBeNull();
    expect(user?.username).toBe('admin');
  });

  it('should reject invalid credentials', async () => {
    const user = await authenticateUser('admin', 'wrong_password');
    expect(user).toBeNull();
  });

  it('should enforce rate limiting', async () => {
    // Attempt login 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await authenticateUser('admin', 'wrong');
    }
    
    // 6th attempt should throw error
    await expect(
      authenticateUser('admin', 'wrong')
    ).rejects.toThrow('Too many failed attempts');
  });
});
```

## Maintenance

### Changing Admin Password

1. Generate new hash:
   ```bash
   node scripts/generate-password-hash.js NEW_PASSWORD
   ```

2. Update environment variable:
   - Local: Update `.env`
   - Production: Update Vercel environment variables

3. Redeploy (production only)

### Adding Multiple Users

Current system supports single user. To add multiple users:

1. **Option A:** Create separate deployments per user
2. **Option B:** Implement backend authentication system
3. **Option C:** Use authentication service (Auth0, Firebase, etc.)

### Monitoring

Check logs for authentication issues:

```javascript
// Filter console for auth logs
console.log = (function(oldLog) {
  return function(...args) {
    if (args[0]?.includes('[AUTH]')) {
      // Send to monitoring service
      // e.g., Sentry, LogRocket, etc.
    }
    oldLog.apply(console, args);
  };
})(console.log);
```

## Migration Guide

### From Mock Auth to Real Backend

1. Create backend API endpoints:
   ```
   POST /api/auth/login
   POST /api/auth/logout
   GET  /api/auth/me
   POST /api/auth/refresh
   ```

2. Update `auth.ts`:
   ```typescript
   export async function authenticateUser(username: string, password: string) {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password }),
     });
     
     if (!response.ok) {
       throw new Error('Authentication failed');
     }
     
     return response.json();
   }
   ```

3. Implement JWT token handling
4. Add refresh token logic
5. Update session management

## Support

For issues or questions:

1. Check browser console for `[AUTH]` logs
2. Verify environment variables are set
3. Review DEPLOYMENT_GUIDE.md
4. Test in incognito mode
5. Check Vercel deployment logs

## License

This authentication system is part of AirBloom Tracker and follows the same license.
