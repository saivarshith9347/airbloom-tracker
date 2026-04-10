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

  /**
   * Toggle device active state
   * Supports multiple active devices simultaneously
   * @param id - Device ID to toggle
   */
  const toggleDeviceActive = (id: string) => {
    const updatedDevices = devices.map((d) => {
      if (d.id === id) {
        return { ...d, isActive: !d.isActive };
      }
      return d;
    });
    save(updatedDevices);
  };

  /**
   * Activate a specific device
   * Does NOT deactivate other devices (multi-device support)
   * @param id - Device ID to activate
   */
  const activateDevice = (id: string) => {
    const updatedDevices = devices.map((d) => {
      if (d.id === id) {
        return { ...d, isActive: true };
      }
      return d;
    });
    save(updatedDevices);
  };

  /**
   * Deactivate a specific device
   * Does NOT affect other devices
   * @param id - Device ID to deactivate
   */
  const deactivateDevice = (id: string) => {
    const updatedDevices = devices.map((d) => {
      if (d.id === id) {
        return { ...d, isActive: false };
      }
      return d;
    });
    save(updatedDevices);
  };

  /**
   * Get all active devices
   * @returns Array of active devices
   */
  const getActiveDevices = (): DeviceConfig[] => {
    return devices.filter((d) => d.isActive);
  };

  return {
    devices,
    addDevice,
    removeDevice,
    updateDevice,
    toggleDeviceActive,
    activateDevice,
    deactivateDevice,
    getActiveDevices,
  };
}
