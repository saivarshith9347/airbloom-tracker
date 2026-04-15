/**
 * Device Management Routes
 * API endpoints for managing IoT devices with Supabase
 */

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * GET /api/devices
 * Get all devices from Supabase
 */
router.get('/', async (req, res) => {
  try {
    const { data: devices, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Devices] Error fetching devices:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch devices',
        error: error.message
      });
    }

    // Convert snake_case to camelCase for frontend
    const formattedDevices = devices.map(device => ({
      id: device.id,
      name: device.name,
      channelId: device.channel_id,
      apiKey: device.api_key,
      location: device.location || '',
      isActive: device.is_active,
      createdAt: device.created_at,
      createdBy: device.created_by
    }));

    res.json({
      success: true,
      data: formattedDevices,
      count: formattedDevices.length
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devices',
      error: error.message
    });
  }
});

/**
 * POST /api/devices
 * Add a new device to Supabase
 */
router.post('/', async (req, res) => {
  try {
    const { id, name, channelId, apiKey, location, isActive, createdAt, createdBy } = req.body;

    // Validation
    if (!name || !channelId || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, channelId, apiKey'
      });
    }

    // Insert into Supabase
    const { data: newDevice, error } = await supabase
      .from('devices')
      .insert([
        {
          id: id || undefined, // Let Supabase generate if not provided
          name,
          channel_id: channelId,
          api_key: apiKey,
          location: location || null,
          is_active: isActive || false,
          created_by: createdBy || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('[Devices] Error adding device:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({
          success: false,
          message: 'Device with this ID already exists'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to add device',
        error: error.message
      });
    }

    console.log(`[Devices] Added device: ${name} (${newDevice.id})`);

    // Format response
    const formattedDevice = {
      id: newDevice.id,
      name: newDevice.name,
      channelId: newDevice.channel_id,
      apiKey: newDevice.api_key,
      location: newDevice.location || '',
      isActive: newDevice.is_active,
      createdAt: newDevice.created_at,
      createdBy: newDevice.created_by
    };

    res.status(201).json({
      success: true,
      message: 'Device added successfully',
      data: formattedDevice
    });
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add device',
      error: error.message
    });
  }
});

/**
 * DELETE /api/devices/:id
 * Remove a device from Supabase
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: deletedDevice, error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }
      
      console.error('[Devices] Error removing device:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove device',
        error: error.message
      });
    }

    console.log(`[Devices] Removed device: ${deletedDevice.name} (${id})`);

    res.json({
      success: true,
      message: 'Device removed successfully',
      data: {
        id: deletedDevice.id,
        name: deletedDevice.name
      }
    });
  } catch (error) {
    console.error('Error removing device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove device',
      error: error.message
    });
  }
});

/**
 * PATCH /api/devices/:id/toggle
 * Toggle device active state in Supabase
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the current device
    const { data: currentDevice, error: fetchError } = await supabase
      .from('devices')
      .select('is_active, name')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch device',
        error: fetchError.message
      });
    }

    // Toggle the active state
    const newActiveState = !currentDevice.is_active;

    const { data: updatedDevice, error: updateError } = await supabase
      .from('devices')
      .update({ is_active: newActiveState })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[Devices] Error toggling device:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle device',
        error: updateError.message
      });
    }

    console.log(`[Devices] Toggled device: ${updatedDevice.name} (${id}) - Active: ${updatedDevice.is_active}`);

    res.json({
      success: true,
      message: `Device ${updatedDevice.is_active ? 'activated' : 'deactivated'}`,
      data: {
        id: updatedDevice.id,
        name: updatedDevice.name,
        isActive: updatedDevice.is_active
      }
    });
  } catch (error) {
    console.error('Error toggling device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle device',
      error: error.message
    });
  }
});

/**
 * PUT /api/devices/:id
 * Update device details in Supabase
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, channelId, apiKey, location, isActive } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (channelId !== undefined) updates.channel_id = channelId;
    if (apiKey !== undefined) updates.api_key = apiKey;
    if (location !== undefined) updates.location = location;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data: updatedDevice, error } = await supabase
      .from('devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }
      
      console.error('[Devices] Error updating device:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update device',
        error: error.message
      });
    }

    console.log(`[Devices] Updated device: ${updatedDevice.name} (${id})`);

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: {
        id: updatedDevice.id,
        name: updatedDevice.name,
        channelId: updatedDevice.channel_id,
        apiKey: updatedDevice.api_key,
        location: updatedDevice.location,
        isActive: updatedDevice.is_active
      }
    });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update device',
      error: error.message
    });
  }
});

/**
 * POST /api/devices/sync
 * Sync devices from client (for migration from localStorage)
 */
router.post('/sync', async (req, res) => {
  try {
    const { devices: clientDevices } = req.body;

    if (!Array.isArray(clientDevices)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid devices array'
      });
    }

    const syncedDevices = [];
    const errors = [];

    for (const clientDevice of clientDevices) {
      try {
        // Check if device already exists
        const { data: existing } = await supabase
          .from('devices')
          .select('id')
          .eq('id', clientDevice.id)
          .single();

        if (!existing) {
          // Insert new device
          const { data: newDevice, error } = await supabase
            .from('devices')
            .insert([
              {
                id: clientDevice.id,
                name: clientDevice.name,
                channel_id: clientDevice.channelId,
                api_key: clientDevice.apiKey,
                location: clientDevice.location || null,
                is_active: clientDevice.isActive || false,
                created_at: clientDevice.createdAt
              }
            ])
            .select()
            .single();

          if (error) {
            errors.push({ device: clientDevice.name, error: error.message });
          } else {
            syncedDevices.push(newDevice);
            console.log(`[Devices] Synced device: ${clientDevice.name}`);
          }
        }
      } catch (error) {
        errors.push({ device: clientDevice.name, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Synced ${syncedDevices.length} devices`,
      data: {
        synced: syncedDevices.length,
        errors: errors.length,
        details: errors
      }
    });
  } catch (error) {
    console.error('Error syncing devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync devices',
      error: error.message
    });
  }
});

module.exports = router;

