import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SensorReading,
  fetchThingSpeakData,
  fetchThingSpeakHistory,
  getAqiLevel,
} from "@/lib/thingspeak";
import { useSupabaseDevices } from "./useSupabaseDevices";

export function useAirMonitor({ enableLivePolling = true }: { enableLivePolling?: boolean } = {}) {
  const { devices, getActiveDevices, isLoading: devicesLoading } = useSupabaseDevices();
  const activeDevices = getActiveDevices();
  
  // For backward compatibility, use first active device as primary
  const primaryDevice = activeDevices[0] ?? null;
  
  const [filterHours, setFilterHours] = useState(1);
  const [alerts, setAlerts] = useState<{ message: string; timestamp: string; aqi: number }[]>([]);

  // Debug logging
  console.log('[AirMonitor] Active devices:', activeDevices.length);
  console.log('[AirMonitor] Primary device:', primaryDevice?.name);

  /**
   * Query for latest sensor data from PRIMARY device with automatic polling
   * In multi-device mode, this fetches data from the first active device
   * TODO: Extend to fetch from all active devices
   */
  const { data: latestReading, isLoading } = useQuery({
    queryKey: ["sensorData", primaryDevice?.id],
    queryFn: async () => {
      if (!primaryDevice) {
        console.log('[AirMonitor] No active device configured');
        return null;
      }

      const apiData = await fetchThingSpeakData(
        1,
        primaryDevice.channelId,
        primaryDevice.apiKey
      );
      console.log('[AirMonitor] ThingSpeak latest data:', apiData);
      
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
    enabled: !!primaryDevice,
  });

  /**
   * Query for historical data from PRIMARY device
   * In multi-device mode, this fetches data from the first active device
   * TODO: Extend to fetch from all active devices
   */
  const { data: readings = [] } = useQuery({
    queryKey: ["sensorHistory", filterHours, primaryDevice?.id],
    queryFn: async () => {
      if (!primaryDevice) {
        console.log('[AirMonitor] No active device for history');
        return [];
      }

      const data = await fetchThingSpeakHistory(
        filterHours,
        primaryDevice.channelId,
        primaryDevice.apiKey
      );
      console.log('[AirMonitor] ThingSpeak history data:', data);
      
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
    enabled: !!primaryDevice,
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
    activeDevice: primaryDevice, // Primary active device (first one)
    activeDevices, // All active devices
    filterHours,
    setFilterHours,
    alerts,
    clearAlerts: () => setAlerts([]),
    isLoading: isLoading || devicesLoading,
  };
}
