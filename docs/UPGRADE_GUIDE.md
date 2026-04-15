# AirBloom Tracker - Upgrade Guide

## 🎉 What's New

Your IoT dashboard has been transformed into a premium, production-ready SaaS application with the following features:

### ✨ Key Features Implemented

#### 1. **Dark Mode & Light Mode**
- Toggle button in the top navbar (Sun/Moon icon)
- Smooth transitions between themes
- Persistent user preference (localStorage)
- Modern color palette for both themes

#### 2. **Authentication System**
- Secure login page with username/email and password
- Protected routes (redirects to login if not authenticated)
- User session management with localStorage
- Logout functionality in user menu

**Demo Credentials:**
- Username: `admin` / Password: `admin123`
- Username: `demo` / Password: `demo123`

#### 3. **Multi-Device System**
- Each device has a unique Device ID and Name
- Device selection page at `/devices`
- Click any device to view its dashboard
- Device status indicators (online/offline)
- Support for 3 devices (easily extensible)

#### 4. **Enhanced Dashboard**
- Modern SaaS-style UI with clean cards
- Smooth animations and transitions
- Device status display
- Improved responsiveness for mobile and desktop
- Loading states with skeleton UI
- Gradient backgrounds

#### 5. **Advanced Map Features**
- **Map Style Toggle**: Switch between Dark, Standard, and Satellite views
- **Navigation Feature**: Draw route from current location to home base
- **Home Location Marker**: Custom marker for home/checkpoint
- **Fullscreen Mode**: Expand map to full screen
- **Smooth Updates**: No lag with marker position updates
- **Improved Performance**: Optimized rendering

#### 6. **Navigation System**
- Top navbar with responsive design
- Mobile sidebar menu
- Navigation items:
  - Dashboard (Home)
  - Devices
  - History & Logs
- User menu with profile and logout

#### 7. **Separate History Page**
- Dedicated `/history` route
- Removed from main dashboard
- Export to CSV functionality
- Statistics cards
- Time range filtering

#### 8. **UI Enhancements**
- Loading states with skeleton components
- Subtle animations (slide-in, pulse-glow)
- Modern typography with Inter and JetBrains Mono
- Glassmorphism effects
- Soft shadows and glows
- Improved spacing and layout

#### 9. **Alerts & Feedback**
- Alert system for high AQI values
- Toast notifications (Sonner)
- Loading indicators
- Error handling
- Success feedback

#### 10. **Code Quality**
- Modular component structure
- Reusable components
- TypeScript for type safety
- Context API for state management
- Clean separation of concerns

## 🚀 Getting Started

### Installation

```bash
cd airbloom-tracker
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
airbloom-tracker/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── EnhancedMap.tsx # Advanced map with satellite & navigation
│   │   │   ├── SensorCard.tsx
│   │   │   ├── AqiGauge.tsx
│   │   │   └── ...
│   │   ├── ui/                 # Reusable UI components (shadcn/ui)
│   │   ├── Layout.tsx          # Main layout with navbar
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Theme management
│   ├── pages/
│   │   ├── Index.tsx           # Dashboard page
│   │   ├── Login.tsx           # Login page
│   │   ├── Devices.tsx         # Device selection page
│   │   └── History.tsx         # History & logs page
│   ├── hooks/
│   │   └── useAirMonitor.ts    # Main data hook
│   ├── lib/
│   │   ├── thingspeak.ts       # API & mock data
│   │   └── utils.ts            # Utilities
│   └── App.tsx                 # Main app with routing
```

## 🎨 Customization

### Adding New Devices

Edit `src/lib/thingspeak.ts`:

```typescript
export const MOCK_DEVICES: DeviceInfo[] = [
  { id: "esp32-001", name: "ESP32 Unit Alpha", online: true, lastUpdated: new Date().toISOString() },
  { id: "esp32-004", name: "Your New Device", online: true, lastUpdated: new Date().toISOString() },
];
```

### Changing Home Location

Edit `src/pages/Index.tsx`:

```typescript
<EnhancedMap
  readings={readings}
  latest={latest}
  homeLocation={{ lat: YOUR_LAT, lng: YOUR_LNG, name: "Your Location" }}
/>
```

### Adding Real API Integration

Replace mock data in `src/lib/thingspeak.ts`:

```typescript
export async function fetchThingSpeakData(results = 100): Promise<SensorReading[] | null> {
  const CHANNEL_ID = "YOUR_CHANNEL_ID";
  const API_KEY = "YOUR_API_KEY";
  // ... rest of implementation
}
```

### Customizing Theme Colors

Edit `src/index.css` to change color variables:

```css
:root {
  --primary: 160 84% 39%; /* Change primary color */
  --accent: 200 80% 50%;  /* Change accent color */
}
```

## 🔐 Authentication

The current implementation uses mock authentication. For production:

1. Replace mock users in `src/contexts/AuthContext.tsx`
2. Implement real API calls to your backend
3. Add JWT token management
4. Implement refresh token logic
5. Add password reset functionality

## 🗺️ Map Features

### Map Styles
- **Dark**: Default dark theme map (CARTO)
- **Standard**: OpenStreetMap standard view
- **Satellite**: ESRI satellite imagery

### Navigation
Click the navigation button to draw a route from current position to home location.

### Fullscreen
Click the maximize button to expand the map to fullscreen.

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Hamburger menu, stacked cards
- **Tablet**: 2-column grid
- **Desktop**: Full layout with sidebar

## 🎯 Next Steps

1. **Connect Real Hardware**: Replace mock data with actual ESP32 data
2. **Add More Sensors**: Extend the sensor types (CO2, PM2.5, etc.)
3. **Implement Real Auth**: Connect to your authentication backend
4. **Add Data Export**: Implement PDF reports
5. **Add Notifications**: Email/SMS alerts for critical AQI levels
6. **Add User Management**: Admin panel for managing users and devices
7. **Add Analytics**: Historical trends and predictions

## 🐛 Troubleshooting

### Map not loading
- Check internet connection (map tiles require internet)
- Verify Leaflet CSS is imported
- Check browser console for errors

### Authentication not persisting
- Check localStorage is enabled in browser
- Clear browser cache and try again

### Theme not switching
- Check localStorage permissions
- Verify ThemeContext is properly wrapped in App.tsx

## 📄 License

© 2026 AirBloom Tracker. All rights reserved.

## 🤝 Support

For issues or questions, please check the documentation or contact support.

---

**Enjoy your upgraded IoT dashboard! 🚀**
