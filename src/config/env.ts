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
