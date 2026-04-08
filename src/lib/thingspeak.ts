// ThingSpeak API integration with mock data fallback

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  aqi: number;
  latitude: number;
  longitude: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  online: boolean;
  lastUpdated: string;
}

// Generate realistic mock data
function generateMockData(count: number): SensorReading[] {
  const now = Date.now();
  const readings: SensorReading[] = [];
  // Simulate a walk in a city
  let lat = 28.6139;
  let lng = 77.209;

  for (let i = count - 1; i >= 0; i--) {
    const t = now - i * 15000; // 15s intervals
    lat += (Math.random() - 0.48) * 0.0005;
    lng += (Math.random() - 0.48) * 0.0005;
    readings.push({
      timestamp: new Date(t).toISOString(),
      temperature: 22 + Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 2,
      humidity: 55 + Math.cos(i / 8) * 15 + (Math.random() - 0.5) * 5,
      aqi: Math.max(10, 80 + Math.sin(i / 6) * 60 + (Math.random() - 0.5) * 30),
      latitude: lat,
      longitude: lng,
    });
  }
  return readings;
}

let cachedMockData = generateMockData(240);

export function getLatestMockReading(): SensorReading {
  const now = new Date();
  const last = cachedMockData[cachedMockData.length - 1];
  const newReading: SensorReading = {
    timestamp: now.toISOString(),
    temperature: last.temperature + (Math.random() - 0.5) * 1.5,
    humidity: Math.max(20, Math.min(95, last.humidity + (Math.random() - 0.5) * 3)),
    aqi: Math.max(10, Math.min(300, last.aqi + (Math.random() - 0.5) * 15)),
    latitude: last.latitude + (Math.random() - 0.48) * 0.0003,
    longitude: last.longitude + (Math.random() - 0.48) * 0.0003,
  };
  cachedMockData.push(newReading);
  if (cachedMockData.length > 500) cachedMockData = cachedMockData.slice(-400);
  return newReading;
}

export function getMockHistory(hours: number): SensorReading[] {
  const cutoff = Date.now() - hours * 3600000;
  return cachedMockData.filter(r => new Date(r.timestamp).getTime() >= cutoff);
}

export function getAqiLevel(aqi: number): { label: string; color: "success" | "warning" | "danger"; description: string } {
  if (aqi <= 50) return { label: "Good", color: "success", description: "Air quality is satisfactory" };
  if (aqi <= 100) return { label: "Moderate", color: "warning", description: "Acceptable quality" };
  return { label: "Unhealthy", color: "danger", description: "Health risk detected" };
}

export const MOCK_DEVICES: DeviceInfo[] = [
  { id: "esp32-001", name: "ESP32 Unit Alpha", online: true, lastUpdated: new Date().toISOString() },
  { id: "esp32-002", name: "ESP32 Unit Beta", online: false, lastUpdated: new Date(Date.now() - 3600000).toISOString() },
  { id: "esp32-003", name: "ESP32 Unit Gamma", online: true, lastUpdated: new Date(Date.now() - 300000).toISOString() },
];

// ThingSpeak fetch (replace CHANNEL_ID and API_KEY with real values)
export async function fetchThingSpeakData(results = 100): Promise<SensorReading[] | null> {
  const CHANNEL_ID = "";
  const API_KEY = "";
  if (!CHANNEL_ID || !API_KEY) return null; // Use mock data

  try {
    const res = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=${results}`
    );
    const data = await res.json();
    return data.feeds.map((f: any) => ({
      timestamp: f.created_at,
      temperature: parseFloat(f.field1) || 0,
      humidity: parseFloat(f.field2) || 0,
      aqi: parseFloat(f.field3) || 0,
      latitude: parseFloat(f.field4) || 0,
      longitude: parseFloat(f.field5) || 0,
    }));
  } catch {
    return null;
  }
}
