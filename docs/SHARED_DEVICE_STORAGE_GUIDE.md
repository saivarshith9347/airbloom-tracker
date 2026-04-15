# Shared Device Storage Implementation Guide

## Problem Statement

**Current Issue:**
- Devices are stored in browser localStorage
- Each browser/session has its own device list
- Admin adds devices → Viewer in different browser cannot see them
- Incognito tabs have separate localStorage → No devices visible

**Solution:**
- Implement backend API for device storage
- All users fetch devices from same backend
- Changes sync across all users in real-time

---

## Quick Workaround (Immediate)

### Option 1: Use Same Browser

**For Testing:**
1. Admin logs in (normal tab) → Adds devices
2. Logout
3. Viewer logs in (same browser) → Can see devices

**Why it works:**
- Same browser = same localStorage
- Both users share device list

### Option 2: Manual Device Export/Import

**On Admin's Browser:**
```javascript
// Open browser console (F12)
const devices = localStorage.getItem('airbloom-devices');
console.log('Copy this:', devices);
// Copy the output
```

**On Viewer's Browser:**
```javascript
// Open browser console (F12)
localStorage.setItem('airbloom-devices', 'PASTE_COPIED_VALUE_HERE');
location.reload();
```

---

## Proper Solution: Backend API

I've created a backend API for shared device storage. Here's how to implement it:

### Step 1: Backend API (Already Created)

**New File:** `backend/routes/deviceRoutes.js`

**Endpoints:**
- `GET /api/devices` - Get all devices
- `POST /api/devices` - Add new device
- `DELETE /api/devices/:id` - Remove device
- `PATCH /api/devices/:id/toggle` - Toggle active state
- `PUT /api/devices/:id` - Update device
- `POST /api/devices/sync` - Sync from localStorage

### Step 2: Deploy Backend

**Option A: Railway.app (Recommended)**

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory: `backend`
5. Add environment variables:
   ```
   THINGSPEAK_CHANNEL_ID=3303384
   THINGSPEAK_READ_API_KEY=IOQIVSWTYLHAYRU1
   FRONTEND_URL=https://airbloom-tracker.vercel.app
   NODE_ENV=production
   PORT=5001
   ```
6. Deploy
7. Copy the generated URL (e.g., `https://airbloom-backend.railway.app`)

**Option B: Render.com**

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `airbloom-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as above)
6. Deploy

**Option C: Heroku**

```bash
cd backend
heroku create airbloom-backend
heroku config:set THINGSPEAK_CHANNEL_ID=3303384
heroku config:set THINGSPEAK_READ_API_KEY=IOQIVSWTYLHAYRU1
heroku config:set FRONTEND_URL=https://airbloom-tracker.vercel.app
heroku config:set NODE_ENV=production
git push heroku main
```

### Step 3: Update Frontend to Use Backend API

**Create new file:** `src/hooks/useDevicesAPI.ts`

```typescript
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeviceConfig } from "@/types/device";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export function useDevicesAPI() {
  const queryClient = useQueryClient();

  // Fetch devices from backend
  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/devices`);
      const result = await response.json();
      return result.data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (device: DeviceConfig) => {
      const response = await fetch(`${API_URL}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add device', {
        description: error.message
      });
    },
  });

  // Remove device mutation
  const removeDeviceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/api/devices/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove device', {
        description: error.message
      });
    },
  });

  // Toggle device mutation
  const toggleDeviceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/api/devices/${id}/toggle`, {
        method: 'PATCH',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: (error) => {
      toast.error('Failed to toggle device', {
        description: error.message
      });
    },
  });

  return {
    devices,
    isLoading,
    addDevice: (device: DeviceConfig) => addDeviceMutation.mutate(device),
    removeDevice: (id: string) => removeDeviceMutation.mutate(id),
    toggleDeviceActive: (id: string) => toggleDeviceMutation.mutate(id),
    getActiveDevices: () => devices.filter((d: DeviceConfig) => d.isActive),
  };
}
```

### Step 4: Add Backend URL to Environment Variables

**In `.env`:**
```env
VITE_BACKEND_URL=https://your-backend-url.railway.app
```

**In Vercel:**
Add environment variable:
```
VITE_BACKEND_URL = https://your-backend-url.railway.app
```

### Step 5: Update Devices Page

**In `src/pages/Devices.tsx`:**

Replace:
```typescript
import { useDevices } from "@/hooks/useDevices";
```

With:
```typescript
import { useDevicesAPI as useDevices } from "@/hooks/useDevicesAPI";
```

That's it! The rest of the code stays the same.

---

## Migration from localStorage to Backend

### Automatic Migration

Add this to your frontend:

```typescript
// src/hooks/useDevicesAPI.ts

// Sync localStorage devices to backend on first load
useEffect(() => {
  const syncLocalStorage = async () => {
    const localDevices = localStorage.getItem('airbloom-devices');
    if (localDevices) {
      try {
        const devices = JSON.parse(localDevices);
        await fetch(`${API_URL}/api/devices/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ devices }),
        });
        // Clear localStorage after successful sync
        localStorage.removeItem('airbloom-devices');
        console.log('[Migration] Devices synced to backend');
      } catch (error) {
        console.error('[Migration] Failed to sync devices:', error);
      }
    }
  };

  syncLocalStorage();
}, []);
```

---

## Testing Shared Device Storage

### Test Scenario 1: Admin Adds Device

1. Admin logs in (Browser A)
2. Adds a device
3. Device saved to backend
4. Viewer logs in (Browser B, incognito)
5. ✅ Viewer sees the device

### Test Scenario 2: Real-Time Sync

1. Admin adds device (Browser A)
2. Viewer already logged in (Browser B)
3. After 30 seconds (refetch interval)
4. ✅ Viewer sees new device

### Test Scenario 3: Viewer Cannot Delete

1. Viewer tries to delete device
2. Frontend blocks action (role check)
3. ✅ "Permission denied" toast shown

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Admin Browser                   │
│  ┌──────────────────────────────────┐  │
│  │  Add Device                      │  │
│  │  ↓                               │  │
│  │  POST /api/devices               │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│         Backend API                     │
│  ┌──────────────────────────────────┐  │
│  │  Device Storage (In-Memory)      │  │
│  │  - devices = []                  │  │
│  │  - Shared across all users       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│         Viewer Browser (Incognito)      │
│  ┌──────────────────────────────────┐  │
│  │  GET /api/devices                │  │
│  │  ↓                               │  │
│  │  See all devices                 │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Benefits of Backend Storage

### ✅ Advantages

1. **Shared Access**
   - All users see same devices
   - Works across different browsers
   - Works in incognito mode

2. **Real-Time Sync**
   - Changes visible to all users
   - Automatic refetch every 30 seconds
   - No manual refresh needed

3. **Centralized Management**
   - Single source of truth
   - Easy to backup
   - Can add database later

4. **Role-Based Control**
   - Backend can enforce permissions
   - Prevent unauthorized deletions
   - Audit logging possible

### ⚠️ Current Limitations

1. **In-Memory Storage**
   - Devices lost on server restart
   - Not persistent
   - Need database for production

2. **No Authentication**
   - No user verification on backend
   - Anyone can call API
   - Need JWT tokens

3. **No Validation**
   - Minimal input validation
   - No duplicate checking
   - Need better error handling

---

## Production Recommendations

### 1. Add Database

Replace in-memory storage with database:

**MongoDB:**
```javascript
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id: String,
  name: String,
  channelId: String,
  apiKey: String,
  location: String,
  isActive: Boolean,
  createdAt: Date
});

const Device = mongoose.model('Device', deviceSchema);
```

**PostgreSQL:**
```sql
CREATE TABLE devices (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  channel_id VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Add Authentication

Protect API endpoints:

```javascript
const jwt = require('jsonwebtoken');

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protected route
router.post('/', authenticateToken, (req, res) => {
  // Only authenticated users can add devices
});
```

### 3. Add Role-Based Permissions

Check user role on backend:

```javascript
router.delete('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can delete devices'
    });
  }
  // Delete device
});
```

---

## Summary

### Current State

- ✅ Backend API created
- ✅ Device routes implemented
- ✅ In-memory storage working
- ⚠️ Not deployed yet
- ⚠️ Frontend still uses localStorage

### To Enable Shared Access

1. Deploy backend to Railway/Render/Heroku
2. Add `VITE_BACKEND_URL` to environment variables
3. Create `useDevicesAPI` hook
4. Update Devices page to use new hook
5. Test with admin and viewer

### Quick Test (Without Backend)

Use same browser for both admin and viewer to test role-based access.

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10
**Status:** Backend API ready, deployment pending
