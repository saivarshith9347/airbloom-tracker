/**
 * Supabase Devices Hook
 * Real-time device management with Supabase
 */

import { useState, useEffect, useRef } from "react";
import { supabase, DeviceRow } from "@/lib/supabase";
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
      const formattedDevices: DeviceConfig[] = (data || []).map((device: DeviceRow) => ({
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
    } catch (err: unknown) {
      console.error('[Supabase] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
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
          if (payload.eventType === 'INSERT' && payload.new) {
            const newDevice = payload.new as DeviceRow;
            setDevices(prev => [{
              id: newDevice.id,
              name: newDevice.name,
              channelId: newDevice.channel_id,
              apiKey: newDevice.api_key,
              location: newDevice.location || '',
              isActive: newDevice.is_active,
              createdAt: newDevice.created_at,
            }, ...prev]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as DeviceRow;
            setDevices(prev => prev.map(d => d.id === updated.id ? {
              id: updated.id,
              name: updated.name,
              channelId: updated.channel_id,
              apiKey: updated.api_key,
              location: updated.location || '',
              isActive: updated.is_active,
              createdAt: updated.created_at,
            } : d));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setDevices(prev => prev.filter(d => d.id !== (payload.old as DeviceRow).id));
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Migrate from localStorage on first load (run once after initial fetch completes)
  const hasMigratedRef = useRef(false);
  useEffect(() => {
    if (isLoading || hasMigratedRef.current) return;
    hasMigratedRef.current = true;

    const localDevices = localStorage.getItem('airbloom-devices');
    if (!localDevices) return;

    try {
      const parsedDevices: DeviceConfig[] = JSON.parse(localDevices);
      if (!Array.isArray(parsedDevices) || parsedDevices.length === 0) return;

      // Only migrate devices that don't already exist in Supabase (by id)
      const existingIds = new Set(devices.map(d => d.id));
      const toMigrate = parsedDevices.filter(d => !existingIds.has(d.id));

      if (toMigrate.length === 0) {
        localStorage.removeItem('airbloom-devices');
        return;
      }

      console.log('[Migration] Migrating', toMigrate.length, 'device(s) to Supabase');
      Promise.all(toMigrate.map(device => addDevice(device)))
        .then(() => {
          localStorage.removeItem('airbloom-devices');
          toast.success(`Migrated ${toMigrate.length} device(s) to cloud storage`);
        })
        .catch(err => console.error('[Migration] Failed:', err));
    } catch (error) {
      console.error('[Migration] Parse error:', error);
    }
  }, [isLoading, devices]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (err: unknown) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to add device', {
        description: err instanceof Error ? err.message : 'Unknown error'
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
    } catch (err: unknown) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to remove device', {
        description: err instanceof Error ? err.message : 'Unknown error'
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
    } catch (err: unknown) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to toggle device', {
        description: err instanceof Error ? err.message : 'Unknown error'
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
    } catch (err: unknown) {
      console.error('[Supabase] Error:', err);
      toast.error('Failed to update device', {
        description: err instanceof Error ? err.message : 'Unknown error'
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
