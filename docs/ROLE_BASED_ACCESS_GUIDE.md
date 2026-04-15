# Role-Based Access Control Guide

## Overview

The AirBloom Tracker implements role-based access control (RBAC) to manage user permissions. This ensures that administrators have full control while viewers have read-only access to devices and sensor data.

---

## User Roles

### 👑 Admin Role

**Full Access - Can do everything:**

✅ **Device Management:**
- Add new devices
- Remove existing devices
- Modify device settings
- Toggle devices active/inactive

✅ **Dashboard Access:**
- View all active devices
- See real-time sensor data
- Access historical data
- View charts and maps

✅ **Configuration:**
- Manage system settings
- Configure environment variables
- Access all features

### 👁️ Viewer Role

**Read-Only Access - Limited permissions:**

✅ **Can Do:**
- View all devices (added by admin)
- Toggle devices active/inactive (to view their data)
- View dashboard with sensor data
- See real-time readings
- Access historical data and charts
- View maps and device locations

❌ **Cannot Do:**
- Add new devices
- Remove devices
- Modify device credentials
- Change system settings
- Access admin features

---

## How It Works

### Device Sharing

**Current Implementation:**
- Devices are stored in browser localStorage
- Each browser has its own device list
- Devices are NOT automatically shared between users

**What This Means:**
1. Admin adds a device on their computer → Stored in their browser
2. Viewer logs in on their computer → Cannot see admin's devices
3. Each user maintains their own device list

### Shared Access Solution

To enable true shared access where viewers can see admin's devices, you need one of these solutions:

#### Option 1: Backend Database (Recommended)
- Store devices in a database (MongoDB, PostgreSQL, etc.)
- All users fetch devices from the same database
- Changes sync across all users in real-time

#### Option 2: Cloud Storage
- Use Firebase, Supabase, or similar
- Store devices in cloud storage
- All users access the same data

#### Option 3: Backend API
- Deploy the existing backend
- Store devices on the server
- Frontend fetches devices via API

---

## Current Behavior

### Scenario 1: Admin User

1. Admin logs in
2. Goes to Devices page
3. Clicks "Add Device"
4. Fills in device details
5. Device is added and stored in localStorage
6. Admin can see and manage all their devices

### Scenario 2: Viewer User

1. Viewer logs in
2. Goes to Devices page
3. Sees "Viewer Mode - Read-Only Access" banner
4. "Add Device" button is disabled
5. Can see devices (if any exist in their browser)
6. Can toggle devices on/off to view data
7. Cannot delete devices (lock icon shown)

### Scenario 3: Shared Computer

If admin and viewer use the SAME computer/browser:
1. Admin adds devices → Stored in localStorage
2. Viewer logs in on same browser → Can see admin's devices
3. Viewer can toggle devices but cannot delete
4. Both users share the same device list

---

## UI Indicators

### For Viewers

**Visual Indicators:**
- 🔵 Blue banner: "Viewer Mode - Read-Only Access"
- 👁️ Eye icon in banner
- 🔒 Lock icon instead of delete button
- ⚠️ Disabled "Add Device" button
- 📝 Different description text

**Toast Notifications:**
- "Permission denied" when trying to add devices
- "Only administrators can add devices"
- "Only administrators can remove devices"

### For Admins

**Visual Indicators:**
- ✅ Green "Add Device" button (enabled)
- 🗑️ Trash icon for delete
- Full access to all features
- No restrictions shown

---

## Permission Matrix

| Feature | Admin | Viewer |
|---------|-------|--------|
| View devices | ✅ Yes | ✅ Yes |
| Add devices | ✅ Yes | ❌ No |
| Remove devices | ✅ Yes | ❌ No |
| Toggle device active/inactive | ✅ Yes | ✅ Yes |
| View dashboard | ✅ Yes | ✅ Yes |
| View sensor data | ✅ Yes | ✅ Yes |
| View charts | ✅ Yes | ✅ Yes |
| View maps | ✅ Yes | ✅ Yes |
| Modify device credentials | ✅ Yes | ❌ No |
| Access settings | ✅ Yes | ❌ No |

---

## Implementation Details

### Code Structure

**Authentication:**
```typescript
// User interface with role
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}
```

**Permission Checks:**
```typescript
// In Devices.tsx
const { user } = useAuth();
const isAdmin = user?.role === 'admin';
const isViewer = user?.role === 'viewer';

// Restrict actions
if (!isAdmin) {
  toast.error("Permission denied");
  return;
}
```

**UI Restrictions:**
```typescript
// Disable buttons for viewers
<Button 
  onClick={handleAddDevice}
  disabled={isViewer}
>
  Add Device
</Button>
```

---

## Testing Role-Based Access

### Test Case 1: Admin Can Add Devices

1. Login as admin: `24r21a0489` / `Var@123`
2. Go to Devices page
3. Click "Add Device" button
4. Fill in device details
5. Submit form
6. ✅ Device should be added successfully

### Test Case 2: Viewer Cannot Add Devices

1. Login as viewer: `viewer` / `Viewer@123`
2. Go to Devices page
3. See blue "Viewer Mode" banner
4. "Add Device" button is disabled
5. Click button (if possible)
6. ✅ Should show "Permission denied" error

### Test Case 3: Viewer Cannot Delete Devices

1. Login as viewer
2. Go to Devices page (with existing devices)
3. See lock icon instead of trash icon
4. Try to click delete
5. ✅ Should show "Permission denied" error

### Test Case 4: Viewer Can Toggle Devices

1. Login as viewer
2. Go to Devices page
3. Toggle a device active/inactive
4. ✅ Should work successfully
5. Go to dashboard
6. ✅ Should see data from active device

---

## Enabling True Shared Access

### Option 1: Use Backend API (Recommended)

**Step 1: Deploy Backend**
```bash
# Deploy backend to Railway/Render/Heroku
# See ENVIRONMENT_ANALYSIS.md for details
```

**Step 2: Create Device API Endpoints**
```javascript
// backend/routes/deviceRoutes.js
router.get('/devices', getDevices);
router.post('/devices', addDevice);
router.delete('/devices/:id', deleteDevice);
router.patch('/devices/:id/toggle', toggleDevice);
```

**Step 3: Update Frontend**
```typescript
// src/hooks/useDevices.ts
// Replace localStorage with API calls
const { data: devices } = useQuery({
  queryKey: ['devices'],
  queryFn: () => fetch('/api/devices').then(r => r.json())
});
```

### Option 2: Use Firebase/Supabase

**Step 1: Setup Firebase**
```bash
npm install firebase
```

**Step 2: Configure Firebase**
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**Step 3: Update Device Storage**
```typescript
// src/hooks/useDevices.ts
import { collection, addDoc, deleteDoc } from 'firebase/firestore';

// Store devices in Firestore instead of localStorage
```

---

## Security Considerations

### Current Security

✅ **Implemented:**
- Role-based UI restrictions
- Permission checks before actions
- Toast notifications for denied actions
- Visual indicators for user roles

⚠️ **Limitations:**
- Client-side only (can be bypassed)
- No server-side validation
- localStorage can be modified
- No audit logging

### Recommended Improvements

1. **Server-Side Validation**
   - Validate user role on backend
   - Check permissions before database operations
   - Return 403 Forbidden for unauthorized actions

2. **API Authentication**
   - Add JWT tokens to API requests
   - Verify user identity on backend
   - Implement proper session management

3. **Audit Logging**
   - Log all device additions/deletions
   - Track who made changes
   - Monitor unauthorized access attempts

4. **Data Encryption**
   - Encrypt device credentials
   - Use HTTPS for all communications
   - Secure API keys

---

## Troubleshooting

### Issue: Viewer can still add devices

**Cause:** Frontend restrictions bypassed

**Solution:**
- Implement backend validation
- Check user role on server
- Return error for unauthorized actions

### Issue: Devices not shared between users

**Cause:** Using localStorage (per-browser storage)

**Solution:**
- Implement backend database
- Use cloud storage (Firebase/Supabase)
- Deploy backend API

### Issue: Permission denied errors not showing

**Cause:** Toast notifications not configured

**Solution:**
- Ensure `sonner` is installed
- Add `<Toaster />` to App.tsx
- Import toast from 'sonner'

---

## Future Enhancements

### Planned Features

1. **Additional Roles**
   - Super Admin (manage users)
   - Operator (limited admin access)
   - Guest (temporary read-only)

2. **Granular Permissions**
   - Per-device permissions
   - Feature-level access control
   - Time-based access

3. **User Management UI**
   - Add/remove users
   - Change user roles
   - View user activity

4. **Audit Trail**
   - Log all actions
   - View change history
   - Export audit logs

---

## Summary

### Current State

- ✅ Role-based UI restrictions implemented
- ✅ Admin and Viewer roles defined
- ✅ Permission checks in place
- ✅ Visual indicators for roles
- ⚠️ Devices stored in localStorage (not shared)
- ⚠️ No backend validation

### To Enable Shared Access

1. Deploy backend with database
2. Create device API endpoints
3. Update frontend to use API
4. Add server-side permission checks
5. Implement proper authentication

### Quick Start

**Admin User:**
- Username: `24r21a0489`
- Password: `Var@123`
- Can add/remove devices

**Viewer User:**
- Username: `viewer`
- Password: `Viewer@123`
- Can view devices only

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10
**Status:** ✅ Role-based UI implemented
