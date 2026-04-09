// Authentication utilities

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
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Authenticate a user with username and password
 * Compares against environment variables for admin credentials
 * Includes brute-force protection with rate limiting
 */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Check rate limiting
  const attemptRecord = getAttemptRecord(username);
  if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
    const minutesRemaining = Math.ceil((attemptRecord.lockedUntil - Date.now()) / (60 * 1000));
    throw new Error(`Too many failed attempts. Try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`);
  }

  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials not configured in environment variables');
    return null;
  }

  // Check if username matches (allow email format too)
  const usernameMatches = 
    username === adminUsername || 
    username === `${adminUsername}@airbloom.io` ||
    username === `${adminUsername}@mlrit.ac.in`;
  
  if (!usernameMatches) {
    // Record failed attempt
    recordFailedAttempt(username);
    return null;
  }

  // Hash the provided password and compare
  const passwordHash = await hashPassword(password);
  
  if (passwordHash === adminPasswordHash) {
    // Successful login - clear attempts
    saveAttemptRecord(username, { attempts: 0, lockedUntil: 0 });
    return {
      id: "1",
      username: adminUsername,
      email: `${adminUsername}@mlrit.ac.in`,
      name: "Admin User"
    };
  }

  // Record failed attempt
  recordFailedAttempt(username);
  return null;
}
