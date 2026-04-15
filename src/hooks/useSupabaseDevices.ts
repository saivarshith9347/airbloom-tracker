/**
 * Supabase Devices Hook
 * Real-time device management with Supabase
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DeviceConfig } from "@/types/device";
import { toast } from "sonner";

export function useSupabaseDevices() {
  const [devices, setDevices] = useState<DeviceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch devices from Supabase
  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase] Error fetching devices:', error);
        setError(error.message);
        return;
      }

      // Convert snake_case to camelCase
      const formattedDevices: DeviceConfig[] = (data || []).map((device: any) => ({
        id: device.id,
        name: device.name,
        channelId: device.channel_id,
        apiKey: device.api_key,
        location: device.location || '',
        isActive: device.is_active,
        createdAt: device.created_at,
      }));

      setDevices(formattedDevices);
      setError(null);
    } catch (err: any) {
      console.error('[Supabase] Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDevices();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('devices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          console.log('[Supabase] Real-time update:', payload);
          fetchDevices(); // Refetch all devices on any change
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Migrate from localStorage on first load
  useEffect(() => {
    const migrateFromLocalStorage = async () => {
      const localDevices = localStorage.getItem('airbloom-devices');
      if (localDevices && devices.length === 0) {
        try {
          const parsedDevices = JSON.parse(localDevices);
          if (Array.isArray(parsedDevices) && parsedDevices.length > 0) {
            console.log('[Migration] Found', parsedDevices.length, 'devices in localStorage');
            
            // Insert each device
            for (const device of parsedDevices) {
              await addDevice(device);
            }
            
            // Clear localStorage after successful migration
            localStorage.removeItem('airbloom-devices');
            console.log('[Migration] Devices migrated to Supabase');
            toast.success('Devices migrated to cloud storage');
          }
        } catch (error) {
          console.error('[Migration] Failed:', error);
        }
      }
    };

    if (!isLoading) {
      migrateFromLocalStorage();
    }
  }, [isLoading]);

  // Add device
  const addDevice = async (device: DeviceConfig) => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([
          {
            id: device.id,
            name: device.name,
            channel_id: device.channelId,
            api_key: device.apiKey,
            location: device.location || null,
            is_active: device.isActive || false,
            created_at: device.createdAt || new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('[Supabase] Error adding device:', error);
        toast.error('Failed to add device', {
          description: error.message
        });
        return;
      }

      console.log('[Supabase] Device added:', data);
      // Real-time subscription will update the list automatically
    } catch (err: any) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to add device', {
        description: err.message
      });
    }
  };

  // Remove device
  const removeDevice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase] Error removing device:', error);
        toast.error('Failed to remove device', {
          description: error.message
        });
        return;
      }

      console.log('[Supabase] Device removed:', id);
      // Real-time subscription will update the list automatically
    } catch (err: any) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to remove device', {
        description: err.message
      });
    }
  };

  // Toggle device active state
  const toggleDeviceActive = async (id: string) => {
    try {
      // Find current device
      const device = devices.find(d => d.id === id);
      if (!device) return;

      const { error } = await supabase
        .from('devices')
        .update({ is_active: !device.isActive })
        .eq('id', id);

      if (error) {
        console.error('[Supabase] Error toggling device:', error);
        toast.error('Failed to toggle device', {
          description: error.message
        });
        return;
      }

      console.log('[Supabase] Device toggled:', id);
      // Real-time subscription will update the list automatically
    } catch (err: any) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to toggle device', {
        description: err.message
      });
    }
  };

  // Update device
  const updateDevice = async (device: DeviceConfig) => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          name: device.name,
          channel_id: device.channelId,
          api_key: device.apiKey,
          location: device.location || null,
          is_active: device.isActive,
        })
        .eq('id', device.id);

      if (error) {
        console.error('[Supabase] Error updating device:', error);
        toast.error('Failed to update device', {
          description: error.message
        });
        return;
      }

      console.log('[Supabase] Device updated:', device.id);
      // Real-time subscription will update the list automatically
    } catch (err: any) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to update device', {
        description: err.message
      });
    }
  };

  // Get active devices
  const getActiveDevices = () => {
    return devices.filter(d => d.isActive);
  };

  return {
    devices,
    isLoading,
    error,
    addDevice,
    removeDevice,
    toggleDeviceActive,
    updateDevice,
    getActiveDevices,
  };
}
