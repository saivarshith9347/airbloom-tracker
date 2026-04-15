# ⚡ Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Install Dependencies
```bash
cd airbloom-tracker
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## 🔐 Login

Use these demo credentials:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Demo Account:**
- Username: `demo`
- Password: `demo123`

---

## 🎯 Key Features to Try

### 1. Toggle Theme
Click the **Sun/Moon** icon in the top-right navbar

### 2. View Devices
Navigate to **Devices** page to see all IoT devices

### 3. Check History
Go to **History** page and export data to CSV

### 4. Explore Map
- Click map style buttons (Dark/Standard/Satellite)
- Click navigation button to draw route to home
- Click fullscreen button to expand map

### 5. Monitor Data
Watch real-time updates every 15 seconds on the dashboard

---

## 📁 Project Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Check code quality
```

---

## 🎨 Quick Customization

### Change Primary Color
Edit `src/index.css`:
```css
--primary: 160 84% 39%; /* Change this */
```

### Add Device
Edit `src/lib/thingspeak.ts`:
```typescript
export const MOCK_DEVICES: DeviceInfo[] = [
  // Add your device here
  { id: "esp32-004", name: "My Device", online: true, lastUpdated: new Date().toISOString() },
];
```

### Change Home Location
Edit `src/pages/Index.tsx`:
```typescript
<EnhancedMap
  homeLocation={{ lat: YOUR_LAT, lng: YOUR_LNG, name: "Your Location" }}
/>
```

---

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Main dashboard with real-time data |
| `/login` | Authentication page |
| `/devices` | Device management and selection |
| `/history` | Historical data and CSV export |

---

## 🎯 Navigation

### Desktop
- Use top navbar links
- Click user icon for profile menu
- Click sun/moon for theme toggle

### Mobile
- Click hamburger menu (☰)
- Tap navigation items
- Swipe to close sidebar

---

## 🗺️ Map Controls

| Button | Function |
|--------|----------|
| 🗺️ (Dark) | Dark theme map |
| 🗺️ (Standard) | Standard street map |
| 🛰️ | Satellite imagery |
| 🧭 | Toggle navigation route |
| ⛶ | Fullscreen mode |

---

## 📊 Dashboard Widgets

1. **Temperature Card** - Current temperature in °C
2. **Humidity Card** - Current humidity in %
3. **AQI Card** - Air Quality Index with color coding
4. **AQI Gauge** - Visual gauge for air quality
5. **Temperature Chart** - Historical temperature data
6. **AQI Chart** - Historical air quality data
7. **Live Map** - GPS tracking with path history

---

## 🔧 Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Map Not Loading
- Check internet connection
- Clear browser cache
- Verify Leaflet CSS is loaded

### Theme Not Switching
- Clear localStorage
- Hard refresh (Ctrl+Shift+R)
- Check browser console

---

## 📚 Documentation

For detailed information, see:
- `README.md` - Main documentation
- `UPGRADE_GUIDE.md` - Upgrade details
- `FEATURES.md` - Complete feature list
- `DEPLOYMENT.md` - Production deployment
- `VISUAL_GUIDE.md` - UI/UX layouts

---

## 🎓 Learn More

### Technologies
- [React](https://react.dev) - UI framework
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Vite](https://vitejs.dev) - Build tool
- [Leaflet](https://leafletjs.com) - Maps

### Components
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Recharts](https://recharts.org) - Charts
- [Lucide](https://lucide.dev) - Icons

---

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
npm i -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t airbloom-tracker .
docker run -p 80:80 airbloom-tracker
```

---

## ✅ Checklist

- [ ] Install dependencies
- [ ] Start dev server
- [ ] Login with demo credentials
- [ ] Toggle theme
- [ ] View all devices
- [ ] Check history page
- [ ] Try map features
- [ ] Export CSV data
- [ ] Test on mobile
- [ ] Build for production

---

## 🎉 You're Ready!

Your premium IoT dashboard is ready to use!

**Need help?** Check the documentation files or open an issue.

**Happy monitoring! 🌬️**
