import { useState, useEffect } from "react";
import { DeviceConfig } from "@/types/device";

const STORAGE_KEY = "airbloom-devices";

export function useDevices() {
  const [devices, setDevices] = useState<DeviceConfig[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDevices(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const save = (data: DeviceConfig[]) => {
    setDevices(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addDevice = (device: DeviceConfig) => {
    save([...devices, device]);
  };

  const removeDevice = (id: string) => {
    save(devices.filter((d) => d.id !== id));
  };

  const updateDevice = (device: DeviceConfig) => {
    save(devices.map((d) => (d.id === device.id ? device : d)));
  };

  return { devices, addDevice, removeDevice, updateDevice };
}
