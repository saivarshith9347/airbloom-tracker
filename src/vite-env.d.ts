/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THINGSPEAK_CHANNEL_ID: string;
  readonly VITE_THINGSPEAK_API_KEY: string;
  readonly VITE_ADMIN_USERNAME: string;
  readonly VITE_ADMIN_PASSWORD_HASH: string;
  readonly VITE_HOME_LATITUDE: string;
  readonly VITE_HOME_LONGITUDE: string;
  readonly VITE_HOME_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
