/**
 * Environment Configuration
 * 
 * Centralized environment variable access with validation
 * This helps debug issues in production (Vercel)
 */

interface EnvConfig {
  adminUsername: string;
  adminPasswordHash: string;
  thingspeakChannelId?: string;
  thingspeakApiKey?: string;
  homeLatitude?: string;
  homeLongitude?: string;
  homeName?: string;
  // Additional users
  user2Username?: string;
  user2PasswordHash?: string;
  user2Email?: string;
  user2Name?: string;
  user2Role?: string;
  user3Username?: string;
  user3PasswordHash?: string;
  user3Email?: string;
  user3Name?: string;
  user3Role?: string;
}

/**
 * Get environment variable safely
 */
function getEnv(key: string, required: boolean = false): string | undefined {
  const value = import.meta.env[key];
  
  if (required && (!value || value === '' || value === 'undefined')) {
    console.error(`[ENV] Required environment variable ${key} is missing!`);
    console.error('[ENV] Make sure to set it in Vercel Project Settings > Environment Variables');
    return undefined;
  }
  
  if (value && value !== '' && value !== 'undefined') {
    console.log(`[ENV] ✓ ${key} loaded`);
    return value as string;
  }
  
  return undefined;
}

/**
 * Load and validate environment configuration
 */
export function loadEnvConfig(): EnvConfig | null {
  console.log('[ENV] Loading environment configuration...');
  console.log('[ENV] Available env vars:', Object.keys(import.meta.env));
  
  const adminUsername = getEnv('VITE_ADMIN_USERNAME', true);
  const adminPasswordHash = getEnv('VITE_ADMIN_PASSWORD_HASH', true);
  
  if (!adminUsername || !adminPasswordHash) {
    console.error('[ENV] ❌ Critical environment variables missing!');
    console.error('[ENV] Required: VITE_ADMIN_USERNAME, VITE_ADMIN_PASSWORD_HASH');
    console.error('[ENV] Please add them in Vercel Project Settings and redeploy');
    return null;
  }
  
  console.log('[ENV] ✓ All required variables loaded');
  
  return {
    adminUsername,
    adminPasswordHash,
    thingspeakChannelId: getEnv('VITE_THINGSPEAK_CHANNEL_ID'),
    thingspeakApiKey: getEnv('VITE_THINGSPEAK_API_KEY'),
    homeLatitude: getEnv('VITE_HOME_LATITUDE'),
    homeLongitude: getEnv('VITE_HOME_LONGITUDE'),
    homeName: getEnv('VITE_HOME_NAME'),
    // Additional users (optional)
    user2Username: getEnv('VITE_USER2_USERNAME'),
    user2PasswordHash: getEnv('VITE_USER2_PASSWORD_HASH'),
    user2Email: getEnv('VITE_USER2_EMAIL'),
    user2Name: getEnv('VITE_USER2_NAME'),
    user2Role: getEnv('VITE_USER2_ROLE'),
    user3Username: getEnv('VITE_USER3_USERNAME'),
    user3PasswordHash: getEnv('VITE_USER3_PASSWORD_HASH'),
    user3Email: getEnv('VITE_USER3_EMAIL'),
    user3Name: getEnv('VITE_USER3_NAME'),
    user3Role: getEnv('VITE_USER3_ROLE'),
  };
}

// Export singleton instance
let envConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig | null {
  if (!envConfig) {
    envConfig = loadEnvConfig();
  }
  return envConfig;
}
