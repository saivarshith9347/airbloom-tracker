import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SensorReading,
  DeviceInfo,
  fetchThingSpeakData,
  fetchThingSpeakHistory,
  getAqiLevel,
} from "@/lib/thingspeak";
import { useDevices } from "./useDevices";

export function useAirMonitor({ enableLivePolling = true }: { enableLivePolling?: boolean } = {}) {
  const { devices } = useDevices();
  const activeDevice = devices[0] ?? null;
  
  const [devices_legacy] = useState<DeviceInfo[]>([]);
  const [filterHours, setFilterHours] = useState(1);
  const [alerts, setAlerts] = useState<{ message: string; timestamp: string; aqi: number }[]>([]);

  // Debug logging
  console.log("Active Device:", activeDevice);

  // Query for latest sensor data with automatic polling
  const { data: latestReading, isLoading } = useQuery({
    queryKey: ["sensorData", activeDevice?.id],
    queryFn: async () => {
      if (!activeDevice) {
        console.log("No active device configured");
        return null;
      }

      const apiData = await fetchThingSpeakData(
        1,
        activeDevice.channelId,
        activeDevice.apiKey
      );
      console.log("ThingSpeak latest data:", apiData);
      
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const latest = apiData[apiData.length - 1];
        // Validate data integrity
        if (latest && 
            typeof latest.temperature === 'number' && 
            typeof latest.humidity === 'number' && 
            typeof latest.aqi === 'number' &&
            !isNaN(latest.temperature) &&
            !isNaN(latest.humidity) &&
            !isNaN(latest.aqi)) {
          return latest;
        }
      }
      return null;
    },
    refetchInterval: enableLivePolling ? 15_000 : false,
    enabled: !!activeDevice,
  });

  // Query for historical data based on filter hours (no polling)
  const { data: readings = [] } = useQuery({
    queryKey: ["sensorHistory", filterHours, activeDevice?.id],
    queryFn: async () => {
      if (!activeDevice) {
        console.log("No active device for history");
        return [];
      }

      const data = await fetchThingSpeakHistory(
        filterHours,
        activeDevice.channelId,
        activeDevice.apiKey
      );
      console.log("ThingSpeak history data:", data);
      
      if (data && Array.isArray(data)) {
        // Filter out invalid readings
        return data.filter(r => 
          r && 
          typeof r.temperature === 'number' && 
          typeof r.humidity === 'number' && 
          typeof r.aqi === 'number' &&
          !isNaN(r.temperature) &&
          !isNaN(r.humidity) &&
          !isNaN(r.aqi)
        );
      }
      return [];
    },
    refetchInterval: false,
    enabled: !!activeDevice,
  });

  // Alert logic - watch latest reading and push alert based on AQI bands
  const lastAlertAqiBandRef = useRef<number>(0);
  const lastAlertTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!latestReading || latestReading.aqi <= 100) return;

    const level = getAqiLevel(latestReading.aqi);
    const now = Date.now();
    const COOLDOWN_MS = 5 * 60 * 1000;

    if (
      level.band === lastAlertAqiBandRef.current &&
      now - lastAlertTimeRef.current < COOLDOWN_MS
    )
      return;

    let alertMessage = "";
    if (level.band === 3)
      alertMessage = "Unhealthy for Sensitive Groups: AQI elevated.";
    else if (level.band === 4)
      alertMessage = `Unhealthy AQI: ${Math.round(latestReading.aqi)} — health effects possible for everyone.`;
    else if (level.band >= 5)
      alertMessage = `HAZARDOUS AQI: ${Math.round(latestReading.aqi)} — avoid outdoor activity.`;

    if (alertMessage) {
      lastAlertAqiBandRef.current = level.band;
      lastAlertTimeRef.current = now;
      setAlerts((prev) => [
        {
          message: alertMessage,
          timestamp: latestReading.timestamp,
          aqi: latestReading.aqi,
        },
        ...prev.slice(0, 19),
      ]);
    }
  }, [latestReading]);

  return {
    readings,
    latest: latestReading ?? null,
    devices: devices_legacy,
    activeDevice,
    selectedDevice: null,
    setSelectedDevice: () => {},
    filterHours,
    setFilterHours,
    alerts,
    clearAlerts: () => setAlerts([]),
    isLoading,
  };
}
