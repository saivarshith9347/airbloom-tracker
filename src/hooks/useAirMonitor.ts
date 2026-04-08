import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SensorReading,
  DeviceInfo,
  getMockHistory,
  getLatestMockReading,
  fetchThingSpeakData,
  MOCK_DEVICES,
  getAqiLevel,
} from "@/lib/thingspeak";

export function useAirMonitor() {
  const [devices] = useState<DeviceInfo[]>(MOCK_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState(MOCK_DEVICES[0].id);
  const [filterHours, setFilterHours] = useState(1);
  const [alerts, setAlerts] = useState<{ message: string; timestamp: string; aqi: number }[]>([]);

  // Query for latest sensor data with automatic polling
  const { data: latestReading } = useQuery({
    queryKey: ["sensorData"],
    queryFn: async () => {
      const apiData = await fetchThingSpeakData();
      if (apiData && apiData.length > 0) {
        return apiData[apiData.length - 1];
      }
      return getLatestMockReading();
    },
  });

  // Query for historical data based on filter hours (no polling)
  const { data: readings = [] } = useQuery({
    queryKey: ["sensorHistory", filterHours],
    queryFn: () => getMockHistory(filterHours),
    refetchInterval: false,
  });

  // Alert logic - watch latest reading and push alert based on AQI bands
  useEffect(() => {
    if (latestReading && latestReading.aqi > 100) {
      const level = getAqiLevel(latestReading.aqi);
      let alertMessage = "";
      
      if (level.band === 3) {
        alertMessage = "Moderate AQI alert: Sensitive groups affected.";
      } else if (level.band === 4) {
        alertMessage = `Unhealthy AQI: ${Math.round(latestReading.aqi)} — Health effects possible.`;
      } else if (level.band >= 5) {
        alertMessage = `HAZARDOUS AQI: ${Math.round(latestReading.aqi)} — Avoid outdoor activity.`;
      }
      
      if (alertMessage) {
        setAlerts(prev => {
          // Avoid duplicate alerts for the same timestamp
          if (prev.length > 0 && prev[0].timestamp === latestReading.timestamp) {
            return prev;
          }
          return [
            { 
              message: alertMessage, 
              timestamp: latestReading.timestamp, 
              aqi: latestReading.aqi 
            },
            ...prev.slice(0, 19),
          ];
        });
      }
    }
  }, [latestReading]);

  return {
    readings,
    latest: latestReading ?? null,
    devices,
    selectedDevice,
    setSelectedDevice,
    filterHours,
    setFilterHours,
    alerts,
    clearAlerts: () => setAlerts([]),
  };
}
