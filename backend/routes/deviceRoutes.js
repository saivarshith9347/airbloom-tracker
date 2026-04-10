/**
 * Device Management Routes
 * API endpoints for managing IoT devices
 */

const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let devices = [];

/**
 * GET /api/devices
 * Get all devices
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: devices,
      count: devices.length
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
 * Add a new device
 */
router.post('/', (req, res) => {
  try {
    const { id, name, channelId, apiKey, location, isActive, createdAt } = req.body;

    // Validation
    if (!id || !name || !channelId || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, name, channelId, apiKey'
      });
    }

    // Check if device already exists
    const existingDevice = devices.find(d => d.id === id);
    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: 'Device with this ID already exists'
      });
    }

    // Add device
    const newDevice = {
      id,
      name,
      channelId,
      apiKey,
      location: location || '',
      isActive: isActive || false,
      createdAt: createdAt || new Date().toISOString()
    };

    devices.push(newDevice);

    console.log(`[Devices] Added device: ${name} (${id})`);

    res.status(201).json({
      success: true,
      message: 'Device added successfully',
      data: newDevice
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
 * Remove a device
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const deviceIndex = devices.findIndex(d => d.id === id);

    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const deletedDevice = devices.splice(deviceIndex, 1)[0];

    console.log(`[Devices] Removed device: ${deletedDevice.name} (${id})`);

    res.json({
      success: true,
      message: 'Device removed successfully',
      data: deletedDevice
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
 * Toggle device active state
 */
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;

    const device = devices.find(d => d.id === id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    device.isActive = !device.isActive;

    console.log(`[Devices] Toggled device: ${device.name} (${id}) - Active: ${device.isActive}`);

    res.json({
      success: true,
      message: `Device ${device.isActive ? 'activated' : 'deactivated'}`,
      data: device
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
 * Update device details
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, channelId, apiKey, location, isActive } = req.body;

    const device = devices.find(d => d.id === id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update fields
    if (name !== undefined) device.name = name;
    if (channelId !== undefined) device.channelId = channelId;
    if (apiKey !== undefined) device.apiKey = apiKey;
    if (location !== undefined) device.location = location;
    if (isActive !== undefined) device.isActive = isActive;

    console.log(`[Devices] Updated device: ${device.name} (${id})`);

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: device
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
router.post('/sync', (req, res) => {
  try {
    const { devices: clientDevices } = req.body;

    if (!Array.isArray(clientDevices)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid devices array'
      });
    }

    // Merge with existing devices (avoid duplicates)
    clientDevices.forEach(clientDevice => {
      const exists = devices.find(d => d.id === clientDevice.id);
      if (!exists) {
        devices.push(clientDevice);
        console.log(`[Devices] Synced device: ${clientDevice.name}`);
      }
    });

    res.json({
      success: true,
      message: `Synced ${clientDevices.length} devices`,
      data: devices
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

