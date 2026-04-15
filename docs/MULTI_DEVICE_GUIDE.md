# Multi-Device Support Guide

## Overview

The AirBloom Tracker now supports **multiple active devices simultaneously**. You can activate and monitor data from multiple ThingSpeak channels at the same time.

## Key Features

### ✅ What Changed

1. **Multiple Active Devices**
   - Previously: Only one device could be active at a time
   - Now: Multiple devices can be active simultaneously
   - No restrictions on the number of active devices

2. **Independent Device Control**
   - Each device has its own active/inactive state
   - Activating one device does NOT deactivate others
   - Deactivating one device does NOT affect others

3. **Toggle Functionality**
   - Simple switch to activate/deactivate any device
   - Real-time state updates
   - State persists across page reloads

4. **Enhanced UI**
   - Active devices show green "Active" badge
   - Inactive devices show gray state
   - Stats show count of active vs inactive devices
   - Multi-device indicator on dashboard

## Data Model

### DeviceConfig Interface

```typescript
interface DeviceConfig {
  id: string;              // Unique device identifier
  name: string;            // Device name (e.g., "Home Sensor")
  channelId: string;       // ThingSpeak channel ID
  apiKey: string;          // ThingSpeak Read API key
  location?: string;       // Optional location
  isActive: boolean;       // Active state (multiple can be true)
  createdAt: string;       // Creation timestamp
}
```

### Key Property: `isActive`

- **Type:** `boolean`
- **Default:** `false` (new devices start inactive)
- **Behavior:** Multiple devices can have `isActive = true`
- **Storage:** Persisted in localStorage

## API / Hook Methods

### useDevices Hook

```typescript
const {
  devices,              // All devices
  addDevice,            // Add new device
  removeDevice,         // Remove device
  updateDevice,         // Update device
  toggleDeviceActive,   // Toggle active state
  activateDevice,       // Activate device
  deactivateDevice,     // Deactivate device
  getActiveDevices,     // Get all active devices
} = useDevices();
```

#### Method Details

**`toggleDeviceActive(id: string)`**
- Toggles device between active and inactive
- Does NOT affect other devices
- Updates localStorage automatically

**`activateDevice(id: string)`**
- Sets device to active
- Does NOT deactivate other devices
- Idempotent (safe to call multiple times)

**`deactivateDevice(id: string)`**
- Sets device to inactive
- Does NOT affect other devices
- Idempotent (safe to call multiple times)

**`getActiveDevices(): DeviceConfig[]`**
- Returns array of all active devices
- Empty array if no devices are active
- Used by dashboard to fetch data

### useAirMonitor Hook

```typescript
const {
  activeDevice,    // Primary active device (first one)
  activeDevices,   // All active devices
  latest,          // Latest reading from primary device
  readings,        // Historical data from primary device
  // ... other properties
} = useAirMonitor();
```

## User Workflow

### Adding a Device

1. Go to **Devices** page
2. Click **Add Device** button
3. Fill in:
   - Device Name (required)
   - Channel ID (required)
   - API Key (required)
   - Location (optional)
4. Click **Add Device**
5. Device is added as **inactive** by default

### Activating Devices

1. Go to **Devices** page
2. Find the device card
3. Toggle the switch to **ON**
4. Device becomes active (green badge appears)
5. Repeat for any other devices you want to activate

### Deactivating Devices

1. Go to **Devices** page
2. Find the active device card
3. Toggle the switch to **OFF**
4. Device becomes inactive
5. Other active devices remain unaffected

### Viewing Data

1. Activate one or more devices
2. Go to **Dashboard** (Index page)
3. Data from primary device (first active) is displayed
4. Dashboard shows indicator if multiple devices are active

## Technical Implementation

### Storage

**Location:** `localStorage`
**Key:** `"airbloom-devices"`
**Format:** JSON array of DeviceConfig objects

```json
[
  {
    "id": "uuid-1",
    "name": "Home Sensor",
    "channelId": "123456",
    "apiKey": "ABC123",
    "location": "Living Room",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "name": "Office Sensor",
    "channelId": "789012",
    "apiKey": "DEF456",
    "location": "Office",
    "isActive": true,
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

### State Management

1. **Load on Mount**
   - `useDevices` hook loads from localStorage on mount
   - Parses JSON and validates array structure
   - Falls back to empty array if invalid

2. **Save on Change**
   - Every device operation saves to localStorage
   - Ensures state persists across page reloads
   - Atomic updates (all or nothing)

3. **React State**
   - Devices stored in React state
   - UI updates automatically on state change
   - No manual refresh needed

### Data Fetching

**Current Implementation:**
- Dashboard fetches data from **primary device** (first active)
- Uses `activeDevices[0]` as data source
- Polls every 15 seconds for live data

**Future Enhancement:**
- Fetch data from ALL active devices
- Combine or display separately
- Multi-device dashboard view

## UI Components

### Devices Page

**Stats Cards:**
- Total Devices
- Active Devices (green)
- Inactive Devices (gray)

**Device Cards:**
- Device name and location
- Channel ID (visible)
- API Key (masked)
- Active/Inactive badge
- Toggle switch
- Delete button
- "View Dashboard" button (only for active devices)

**Visual Indicators:**
- Active devices: Green ring border
- Active badge: Green with power icon
- Toggle switch: Green when active

### Dashboard (Index Page)

**No Active Devices:**
- Shows empty state
- "No active devices" message
- Button to go to Devices page

**One Active Device:**
- Shows device name and channel
- Displays sensor data
- Normal dashboard view

**Multiple Active Devices:**
- Shows primary device name
- Badge: "+N more active"
- Data from first active device

## Error Handling

### No Devices Configured

**Scenario:** User has not added any devices

**Behavior:**
- Devices page shows empty state
- Dashboard shows "No active devices"
- Prompts user to add device

### No Active Devices

**Scenario:** Devices exist but none are active

**Behavior:**
- Dashboard shows "No active devices"
- Message: "Activate at least one device"
- Button to go to Devices page

### All Devices Deactivated

**Scenario:** User deactivates all devices

**Behavior:**
- Dashboard automatically shows empty state
- No data fetching occurs
- Saves bandwidth and API calls

### Device Deletion

**Scenario:** User deletes an active device

**Behavior:**
- Device removed from list
- If it was the only active device, dashboard shows empty state
- Other active devices continue working

## Best Practices

### For Users

1. **Start with One Device**
   - Add and activate one device first
   - Verify it works before adding more

2. **Meaningful Names**
   - Use descriptive device names
   - Include location for clarity

3. **Deactivate Unused Devices**
   - Save API calls and bandwidth
   - Keep dashboard focused

4. **Regular Monitoring**
   - Check device status periodically
   - Ensure active devices are working

### For Developers

1. **Always Check Active Devices**
   ```typescript
   const activeDevices = getActiveDevices();
   if (activeDevices.length === 0) {
     // Handle no active devices
   }
   ```

2. **Use Primary Device for Single View**
   ```typescript
   const primaryDevice = activeDevices[0] ?? null;
   ```

3. **Validate Device Data**
   ```typescript
   if (!device.channelId || !device.apiKey) {
     // Handle invalid device
   }
   ```

4. **Persist State Changes**
   ```typescript
   // Always save after modifying devices
   save(updatedDevices);
   ```

## Migration from Single-Device

### Automatic Migration

Existing devices are automatically migrated:
- Old devices without `isActive` property
- Automatically set to `isActive: false`
- User must manually activate them

### Manual Steps

If you have existing devices:

1. Go to Devices page
2. You'll see all devices as inactive
3. Toggle switch to activate desired devices
4. Dashboard will start showing data

## Future Enhancements

### Planned Features

1. **Multi-Device Dashboard**
   - Show data from all active devices
   - Side-by-side comparison
   - Aggregate statistics

2. **Device Groups**
   - Group devices by location
   - Activate/deactivate groups
   - Group-level statistics

3. **Device Priority**
   - Set primary device
   - Fallback to secondary if primary fails
   - Priority-based data display

4. **Bulk Operations**
   - Activate all devices
   - Deactivate all devices
   - Bulk delete

5. **Device Status Monitoring**
   - Online/offline detection
   - Last data received timestamp
   - Connection health indicator

6. **Data Aggregation**
   - Average across all active devices
   - Min/max values
   - Combined charts

## Troubleshooting

### Device Not Activating

**Problem:** Toggle switch doesn't work

**Solutions:**
1. Check browser console for errors
2. Verify localStorage is not full
3. Try refreshing the page
4. Clear browser cache

### Data Not Showing

**Problem:** Active device but no data on dashboard

**Solutions:**
1. Verify device is actually active (green badge)
2. Check ThingSpeak credentials are correct
3. Ensure channel has recent data
4. Check browser console for API errors

### State Not Persisting

**Problem:** Devices reset to inactive on refresh

**Solutions:**
1. Check localStorage is enabled
2. Verify no browser extensions blocking storage
3. Check for localStorage quota errors
4. Try incognito mode to test

### Multiple Devices Showing Same Data

**Problem:** All devices show identical readings

**Solutions:**
1. Verify each device has unique channel ID
2. Check API keys are correct
3. Ensure channels have different data
4. Currently expected (shows primary device only)

## Testing Checklist

- [ ] Add device → starts as inactive
- [ ] Activate device → shows green badge
- [ ] Activate multiple devices → all show active
- [ ] Deactivate one device → others remain active
- [ ] Delete active device → others unaffected
- [ ] Refresh page → state persists
- [ ] No active devices → dashboard shows empty state
- [ ] One active device → dashboard shows data
- [ ] Multiple active devices → dashboard shows indicator
- [ ] Toggle switch → immediate visual feedback

## Support

For issues or questions:
1. Check browser console for errors
2. Verify device configuration
3. Test with single device first
4. Review this guide for common issues

## Summary

✅ **Multiple devices can be active simultaneously**
✅ **Independent device control**
✅ **Simple toggle interface**
✅ **State persists across reloads**
✅ **No restrictions on active device count**
✅ **Backward compatible with existing devices**

The multi-device system provides flexibility and scalability for monitoring multiple air quality sensors from a single dashboard.
