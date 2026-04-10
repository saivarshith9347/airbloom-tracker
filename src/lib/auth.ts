// Authentication utilities
import { getEnvConfig } from '@/config/env';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}

// Define multiple users with their credentials
interface UserCredential {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
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
 * Get all registered users with their credentials
 * Supports multiple users from environment variables
 */
function getRegisteredUsers(): UserCredential[] {
  const envConfig = getEnvConfig();
  
  if (!envConfig) {
    return [];
  }

  const users: UserCredential[] = [];

  // Primary admin user from environment variables
  if (envConfig.adminUsername && envConfig.adminPasswordHash) {
    users.push({
      id: "1",
      username: envConfig.adminUsername,
      passwordHash: envConfig.adminPasswordHash,
      email: `${envConfig.adminUsername}@mlrit.ac.in`,
      name: "Admin User",
      role: "admin"
    });
  }

  // Additional users from environment variables
  // VITE_USER2_USERNAME, VITE_USER2_PASSWORD_HASH, VITE_USER2_NAME, VITE_USER2_ROLE
  if (envConfig.user2Username && envConfig.user2PasswordHash) {
    users.push({
      id: "2",
      username: envConfig.user2Username,
      passwordHash: envConfig.user2PasswordHash,
      email: envConfig.user2Email || `${envConfig.user2Username}@airbloom.io`,
      name: envConfig.user2Name || "Viewer User",
      role: (envConfig.user2Role as 'admin' | 'viewer') || "viewer"
    });
  }

  // User 3
  if (envConfig.user3Username && envConfig.user3PasswordHash) {
    users.push({
      id: "3",
      username: envConfig.user3Username,
      passwordHash: envConfig.user3PasswordHash,
      email: envConfig.user3Email || `${envConfig.user3Username}@airbloom.io`,
      name: envConfig.user3Name || "User 3",
      role: (envConfig.user3Role as 'admin' | 'viewer') || "viewer"
    });
  }

  return users;
}

/**
 * Authenticate a user with username and password
 * Supports multiple users with different roles
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

  // Get all registered users
  console.log('[AUTH] Loading registered users...');
  const registeredUsers = getRegisteredUsers();
  
  if (registeredUsers.length === 0) {
    console.error('[AUTH] ❌ No users configured');
    console.error('[AUTH] This usually means environment variables are not set in Vercel');
    console.error('[AUTH] Go to: Vercel Project Settings > Environment Variables');
    console.error('[AUTH] Add: VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD_HASH');
    throw new Error('Authentication system not configured. Please contact administrator.');
  }

  console.log('[AUTH] ✓ Found', registeredUsers.length, 'registered user(s)');

  // Normalize username (remove email domain if present)
  const normalizedUsername = username.split('@')[0];

  // Find matching user
  const matchedUser = registeredUsers.find(user => {
    const userMatches = 
      username === user.username ||
      normalizedUsername === user.username ||
      username === user.email ||
      username === `${user.username}@airbloom.io` ||
      username === `${user.username}@mlrit.ac.in`;
    return userMatches;
  });

  if (!matchedUser) {
    console.warn('[AUTH] ❌ Username not found');
    console.warn('[AUTH] Provided:', username);
    console.warn('[AUTH] Available users:', registeredUsers.map(u => u.username).join(', '));
    recordFailedAttempt(username);
    return null;
  }

  console.log('[AUTH] ✓ User found:', matchedUser.username);
  console.log('[AUTH] ✓ User role:', matchedUser.role);
  console.log('[AUTH] Hashing provided password...');

  // Hash the provided password and compare
  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
    console.log('[AUTH] ✓ Password hashed successfully');
    console.log('[AUTH] Generated hash:', passwordHash);
    console.log('[AUTH] Expected hash:', matchedUser.passwordHash);
  } catch (error) {
    console.error('[AUTH] ❌ Password hashing failed:', error);
    throw new Error('Authentication system error');
  }
  
  // Compare password hashes
  if (passwordHash === matchedUser.passwordHash) {
    console.log('[AUTH] ==========================================');
    console.log('[AUTH] ✓✓✓ AUTHENTICATION SUCCESSFUL ✓✓✓');
    console.log('[AUTH] User:', matchedUser.username);
    console.log('[AUTH] Role:', matchedUser.role);
    console.log('[AUTH] ==========================================');
    
    // Successful login - clear attempts
    saveAttemptRecord(username, { attempts: 0, lockedUntil: 0 });
    return {
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role
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
