// ThingSpeak API integration

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  aqi: number;
  latitude: number;
  longitude: number;
}

interface ThingSpeakFeed {
  created_at: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

export type AqiColor = "success" | "warning" | "danger" | "default";

export interface AqiLevel {
  label: string;
  color: AqiColor;
  description: string;
  band: 1 | 2 | 3 | 4 | 5 | 6;
}

export function getAqiLevel(aqi: number): AqiLevel {
  if (aqi <= 50)  return { label: "Good",                    color: "success",  description: "Air quality is satisfactory and poses little or no risk.",          band: 1 };
  if (aqi <= 100) return { label: "Moderate",               color: "warning",  description: "Acceptable quality; some pollutants may affect very sensitive people.", band: 2 };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "warning",  description: "Sensitive groups may experience health effects.",                    band: 3 };
  if (aqi <= 200) return { label: "Unhealthy",              color: "danger",   description: "Everyone may begin to experience health effects.",                   band: 4 };
  if (aqi <= 300) return { label: "Very Unhealthy",         color: "danger",   description: "Health alert: everyone may experience serious health effects.",      band: 5 };
  return              { label: "Hazardous",                  color: "danger",   description: "Health warning of emergency conditions.",                            band: 6 };
}

// ThingSpeak fetch with device-specific credentials
export async function fetchThingSpeakData(
  results: number,
  channelId: string,
  apiKey: string
): Promise<SensorReading[] | null> {
  if (!channelId || !apiKey) {
    console.warn("ThingSpeak credentials not provided");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`
    );
    
    if (!res.ok) {
      console.error("ThingSpeak API error:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    
    if (!data.feeds || !Array.isArray(data.feeds)) {
      console.error("Invalid ThingSpeak response format:", data);
      return null;
    }
    
    return data.feeds.map((f: ThingSpeakFeed) => ({
      timestamp: f.created_at,
      temperature: parseFloat(f.field1) || 0,
      humidity: parseFloat(f.field2) || 0,
      aqi: parseFloat(f.field3) || 0,
      latitude: parseFloat(f.field4) || 0,
      longitude: parseFloat(f.field5) || 0,
    }));
  } catch (error) {
    console.error("ThingSpeak fetch error:", error);
    return null;
  }
}

export async function fetchThingSpeakHistory(
  hours: number,
  channelId: string,
  apiKey: string
): Promise<SensorReading[] | null> {
  if (!channelId || !apiKey) {
    console.warn("ThingSpeak credentials not provided");
    return null;
  }

  const results = Math.min(8000, hours * 240); // max 8000 from ThingSpeak
  
  try {
    const res = await fetch(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`
    );
    
    if (!res.ok) {
      console.error("ThingSpeak API error:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    
    if (!data.feeds || !Array.isArray(data.feeds)) {
      console.error("Invalid ThingSpeak response format:", data);
      return null;
    }
    
    const cutoff = Date.now() - hours * 3600000;
    return data.feeds
      .map((f: ThingSpeakFeed) => ({
        timestamp: f.created_at,
        temperature: parseFloat(f.field1) || 0,
        humidity: parseFloat(f.field2) || 0,
        aqi: parseFloat(f.field3) || 0,
        latitude: parseFloat(f.field4) || 0,
        longitude: parseFloat(f.field5) || 0,
      }))
      .filter((r: SensorReading) => new Date(r.timestamp).getTime() >= cutoff);
  } catch (error) {
    console.error("ThingSpeak history fetch error:", error);
    return null;
  }
}

export function exportReadingsToCsv(readings: SensorReading[], filename?: string): void {
  const header = "Timestamp,Temperature (°C),Humidity (%),AQI,Latitude,Longitude\n";
  const rows = readings
    .map(
      (r) =>
        `${r.timestamp},${r.temperature.toFixed(2)},${r.humidity.toFixed(2)},${r.aqi.toFixed(2)},${r.latitude.toFixed(5)},${r.longitude.toFixed(5)}`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `airbloom-data-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
