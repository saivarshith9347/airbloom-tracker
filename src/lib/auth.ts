// Authentication utilities
import { getEnvConfig } from '@/config/env';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

// Rate limiting for brute-force protection
const RATE_LIMIT_KEY = "airbloom-rate";

interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
}

function getAttemptRecord(username: string): AttemptRecord {
  try {
    const raw = sessionStorage.getItem(`${RATE_LIMIT_KEY}:${username}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { attempts: 0, lockedUntil: 0 };
}

function saveAttemptRecord(username: string, record: AttemptRecord): void {
  try {
    sessionStorage.setItem(`${RATE_LIMIT_KEY}:${username}`, JSON.stringify(record));
  } catch {}
}

function recordFailedAttempt(username: string): void {
  const record = getAttemptRecord(username);
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000;
  }
  saveAttemptRecord(username, record);
}

/**
 * Hash a password using SHA-256
 * Production-safe: Works in both browser and serverless environments
 */
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Authentication system error');
  }
}

/**
 * Authenticate a user with username and password
 * Production-ready with comprehensive error handling and logging
 * 
 * @param username - Username or email to authenticate
 * @param password - Plain text password
 * @returns User object if authentication succeeds, null otherwise
 * @throws Error if rate limited or system error occurs
 */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  console.log('[AUTH] ==========================================');
  console.log('[AUTH] Authentication attempt started');
  console.log('[AUTH] Username provided:', username);
  console.log('[AUTH] ==========================================');
  
  // Input validation
  if (!username || !password) {
    console.error('[AUTH] ❌ Missing username or password');
    throw new Error('Username and password are required');
  }

  // Check rate limiting
  const attemptRecord = getAttemptRecord(username);
  if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
    const minutesRemaining = Math.ceil((attemptRecord.lockedUntil - Date.now()) / (60 * 1000));
    console.warn('[AUTH] ⚠️ Rate limit exceeded for:', username);
    throw new Error(`Too many failed attempts. Try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`);
  }

  // Get credentials from environment configuration
  console.log('[AUTH] Loading environment configuration...');
  const envConfig = getEnvConfig();
  
  if (!envConfig) {
    console.error('[AUTH] ❌ Environment configuration failed to load');
    console.error('[AUTH] This usually means environment variables are not set in Vercel');
    console.error('[AUTH] Go to: Vercel Project Settings > Environment Variables');
    console.error('[AUTH] Add: VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD_HASH');
    throw new Error('Authentication system not configured. Please contact administrator.');
  }

  const adminUsername = envConfig.adminUsername;
  const adminPasswordHash = envConfig.adminPasswordHash;

  console.log('[AUTH] ✓ Environment configuration loaded');
  console.log('[AUTH] Expected username:', adminUsername);
  console.log('[AUTH] Expected hash length:', adminPasswordHash?.length);

  // Check if username matches (allow multiple email formats)
  const usernameMatches = 
    username === adminUsername || 
    username === `${adminUsername}@airbloom.io` ||
    username === `${adminUsername}@mlrit.ac.in`;
  
  if (!usernameMatches) {
    console.warn('[AUTH] ❌ Username does not match');
    console.warn('[AUTH] Provided:', username);
    console.warn('[AUTH] Expected one of:');
    console.warn('[AUTH]   -', adminUsername);
    console.warn('[AUTH]   -', `${adminUsername}@airbloom.io`);
    console.warn('[AUTH]   -', `${adminUsername}@mlrit.ac.in`);
    recordFailedAttempt(username);
    return null;
  }

  console.log('[AUTH] ✓ Username matched');
  console.log('[AUTH] Hashing provided password...');

  // Hash the provided password and compare
  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
    console.log('[AUTH] ✓ Password hashed successfully');
    console.log('[AUTH] Generated hash:', passwordHash);
    console.log('[AUTH] Expected hash:', adminPasswordHash);
  } catch (error) {
    console.error('[AUTH] ❌ Password hashing failed:', error);
    throw new Error('Authentication system error');
  }
  
  // Compare password hashes
  if (passwordHash === adminPasswordHash) {
    console.log('[AUTH] ==========================================');
    console.log('[AUTH] ✓✓✓ AUTHENTICATION SUCCESSFUL ✓✓✓');
    console.log('[AUTH] User:', username);
    console.log('[AUTH] ==========================================');
    
    // Successful login - clear attempts
    saveAttemptRecord(username, { attempts: 0, lockedUntil: 0 });
    return {
      id: "1",
      username: adminUsername,
      email: `${adminUsername}@mlrit.ac.in`,
      name: "Admin User"
    };
  }

  // Password mismatch
  console.error('[AUTH] ==========================================');
  console.error('[AUTH] ❌ PASSWORD MISMATCH');
  console.error('[AUTH] This means the password is incorrect');
  console.error('[AUTH] Or the hash in environment variables is wrong');
  console.error('[AUTH] ==========================================');
  recordFailedAttempt(username);
  return null;
}
