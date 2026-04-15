/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THINGSPEAK_CHANNEL_ID: string;
  readonly VITE_THINGSPEAK_API_KEY: string;
  readonly VITE_ADMIN_USERNAME: string;
  readonly VITE_ADMIN_PASSWORD_HASH: string;
  readonly VITE_HOME_LATITUDE: string;
  readonly VITE_HOME_LONGITUDE: string;
  readonly VITE_HOME_NAME: string;
  // Additional users
  readonly VITE_USER2_USERNAME: string;
  readonly VITE_USER2_PASSWORD_HASH: string;
  readonly VITE_USER2_EMAIL: string;
  readonly VITE_USER2_NAME: string;
  readonly VITE_USER2_ROLE: string;
  readonly VITE_USER3_USERNAME: string;
  readonly VITE_USER3_PASSWORD_HASH: string;
  readonly VITE_USER3_EMAIL: string;
  readonly VITE_USER3_NAME: string;
  readonly VITE_USER3_ROLE: string;
  // Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
