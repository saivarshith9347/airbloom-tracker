# 🌬️ AirBloom Tracker

A premium, production-ready IoT dashboard for portable air quality monitoring and GPS tracking systems. Built with React, TypeScript, Tailwind CSS, and modern web technologies.

![AirBloom Tracker](https://img.shields.io/badge/version-2.0.0-green.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📚 Documentation

### Getting Started
- [Quick Start Guide](docs/QUICK_START.md)
- [Features Overview](docs/FEATURES.md)

### Deployment & Setup
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Vercel Setup](docs/VERCEL_SETUP.md)
- [Vercel Deployment Checklist](docs/VERCEL_DEPLOYMENT_CHECKLIST.md)
- [Vercel Deployment Status](docs/VERCEL_DEPLOYMENT_STATUS.md)
- [Deployment Status](docs/DEPLOYMENT_STATUS.md)
- [Deployment Summary](docs/DEPLOYMENT_SUMMARY.md)
- [README Deployment](docs/README_DEPLOYMENT.md)

### Authentication & Security
- [Auth Setup](docs/AUTH_README.md)
- [Role-Based Access Guide](docs/ROLE_BASED_ACCESS_GUIDE.md)
- [Supabase Setup Guide](docs/SUPABASE_SETUP_GUIDE.md)
- [Supabase Troubleshooting](docs/SUPABASE_TROUBLESHOOTING.md)

### Multi-Device & Multi-User
- [Multi-Device Guide](docs/MULTI_DEVICE_GUIDE.md)
- [Multi-User Guide](docs/MULTI_USER_GUIDE.md)
- [Shared Device Storage Guide](docs/SHARED_DEVICE_STORAGE_GUIDE.md)

### Troubleshooting & Fixes
- [Debug API Key](docs/DEBUG_API_KEY.md)
- [Quick Fix Guide](docs/QUICK_FIX_GUIDE.md)
- [Quick Fix Now](docs/QUICK_FIX_NOW.md)
- [Production Fix Summary](docs/PRODUCTION_FIX_SUMMARY.md)
- [Final Solution](docs/FINAL_SOLUTION.md)
- [Solution RLS Issue](docs/SOLUTION_RLS_ISSUE.md)
- [Urgent Fix](docs/URGENT_FIX.md)
- [Immediate Action Required](docs/IMMEDIATE_ACTION_REQUIRED.md)

### Reference & Analysis
- [Changelog](docs/CHANGELOG.md)
- [Upgrade Guide](docs/UPGRADE_GUIDE.md)
- [Environment Analysis](docs/ENVIRONMENT_ANALYSIS.md)
- [Complete Analysis Summary](docs/COMPLETE_ANALYSIS_SUMMARY.md)
- [Summary](docs/SUMMARY.md)
- [Visual Guide](docs/VISUAL_GUIDE.md)
- [Index](docs/INDEX.md)
- [Next Steps](docs/NEXT_STEPS.md)

## ✨ Features

### 🎨 Modern UI/UX
- **Dark & Light Mode** with smooth transitions
- **Glassmorphism** design with soft shadows
- **Responsive** layout for mobile, tablet, and desktop
- **Animations** and loading states
- **Modern typography** with Inter and JetBrains Mono fonts

### 🔐 Authentication
- Secure login system
- Protected routes
- Session management
- User profile menu

### 📱 Multi-Device Support
- Manage multiple IoT devices
- Device status monitoring (online/offline)
- Individual device dashboards
- Easy device switching

### 🗺️ Advanced Mapping
- **Multiple map styles**: Dark, Standard, Satellite
- **GPS tracking** with real-time updates
- **Navigation** feature with route drawing
- **Home location** markers
- **Fullscreen mode**
- Smooth marker animations

### 📊 Real-Time Monitoring
- Temperature, Humidity, and AQI sensors
- Live data charts with Recharts
- Historical data visualization
- Time-range filtering (1h, 6h, 24h, 7d)

### 🚨 Alerts & Notifications
- High AQI alerts
- Toast notifications
- Alert history
- Visual feedback

### 📈 Data Management
- Historical data logs
- CSV export functionality
- Data filtering
- Statistics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd airbloom-tracker

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Login Credentials

Use these demo credentials to login:

- **Admin**: `admin` / `admin123`
- **Demo**: `demo` / `demo123`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
airbloom-tracker/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Layout.tsx       # Main layout
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication
│   │   └── ThemeContext.tsx # Theme management
│   ├── pages/
│   │   ├── Index.tsx        # Dashboard
│   │   ├── Login.tsx        # Login page
│   │   ├── Devices.tsx      # Device management
│   │   └── History.tsx      # Data logs
│   ├── hooks/
│   │   └── useAirMonitor.ts # Data management
│   ├── lib/
│   │   ├── thingspeak.ts    # API integration
│   │   └── utils.ts         # Utilities
│   └── App.tsx
├── public/
└── package.json
```

## 🎯 Key Technologies

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Lucide React** - Icons

## 🔧 Configuration

### Adding Real API Integration

Edit `src/lib/thingspeak.ts`:

```typescript
export async function fetchThingSpeakData(results = 100) {
  const CHANNEL_ID = "YOUR_CHANNEL_ID";
  const API_KEY = "YOUR_API_KEY";
  // Implementation...
}
```

### Customizing Theme

Edit `src/index.css` to modify color variables:

```css
:root {
  --primary: 160 84% 39%;
  --accent: 200 80% 50%;
  /* ... more variables */
}
```

### Adding Devices

Edit `src/lib/thingspeak.ts`:

```typescript
export const MOCK_DEVICES: DeviceInfo[] = [
  { id: "esp32-001", name: "Device 1", online: true, lastUpdated: new Date().toISOString() },
  // Add more devices...
];
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Theme Customization

The app supports both light and dark themes with smooth transitions. Toggle using the sun/moon icon in the navbar.

## 🗺️ Map Configuration

### Map Styles
- **Dark**: CARTO dark theme (default)
- **Standard**: OpenStreetMap
- **Satellite**: ESRI World Imagery

### Home Location

Set your home location in `src/pages/Index.tsx`:

```typescript
<EnhancedMap
  homeLocation={{ lat: 28.6139, lng: 77.209, name: "Home Base" }}
/>
```

## 📊 Data Flow

1. **useAirMonitor** hook fetches data
2. Data flows to dashboard components
3. Real-time updates every 15 seconds
4. Historical data stored in state
5. Charts and maps update automatically

## 🔐 Security Notes

- Current auth is mock-based for demo
- Implement real JWT authentication for production
- Add HTTPS in production
- Secure API keys in environment variables
- Implement rate limiting

## 🚀 Deployment

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

Create `.env` file:

```env
VITE_THINGSPEAK_CHANNEL_ID=your_channel_id
VITE_THINGSPEAK_API_KEY=your_api_key
VITE_API_URL=your_api_url
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For detailed upgrade information, see [UPGRADE_GUIDE.md](docs/UPGRADE_GUIDE.md)

## 🎉 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Maps powered by [Leaflet](https://leafletjs.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for IoT enthusiasts**
