// Device configuration types

export interface DeviceConfig {
  id: string;
  name: string;
  channelId: string;
  apiKey: string;
  location?: string;
  isActive: boolean; // Multiple devices can be active simultaneously
  createdAt: string;
}
