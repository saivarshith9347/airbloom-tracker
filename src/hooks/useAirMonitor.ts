import { useState, useEffect, useCallback } from "react";
import {
  SensorReading,
  DeviceInfo,
  getMockHistory,
  getLatestMockReading,
  fetchThingSpeakData,
  MOCK_DEVICES,
} from "@/lib/thingspeak";

export function useAirMonitor(refreshInterval = 15000) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [latest, setLatest] = useState<SensorReading | null>(null);
  const [devices] = useState<DeviceInfo[]>(MOCK_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState(MOCK_DEVICES[0].id);
  const [filterHours, setFilterHours] = useState(1);
  const [alerts, setAlerts] = useState<{ message: string; timestamp: string; aqi: number }[]>([]);

  const fetchData = useCallback(async () => {
    const apiData = await fetchThingSpeakData();
    if (apiData) {
      setReadings(apiData);
      setLatest(apiData[apiData.length - 1]);
    } else {
      const newReading = getLatestMockReading();
      setLatest(newReading);
      setReadings(getMockHistory(filterHours));
      if (newReading.aqi > 150) {
        setAlerts(prev => [
          { message: `High AQI detected: ${Math.round(newReading.aqi)}`, timestamp: newReading.timestamp, aqi: newReading.aqi },
          ...prev.slice(0, 19),
        ]);
      }
    }
  }, [filterHours]);

  useEffect(() => {
    // Initial load
    setReadings(getMockHistory(filterHours));
    const hist = getMockHistory(1);
    if (hist.length) setLatest(hist[hist.length - 1]);
  }, []);

  useEffect(() => {
    setReadings(getMockHistory(filterHours));
  }, [filterHours]);

  useEffect(() => {
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, refreshInterval]);

  return {
    readings,
    latest,
    devices,
    selectedDevice,
    setSelectedDevice,
    filterHours,
    setFilterHours,
    alerts,
    clearAlerts: () => setAlerts([]),
  };
}
