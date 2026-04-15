# 🎨 AirBloom Tracker - Visual Guide

## 🖼️ Page Layouts

### 1. Login Page (`/login`)

```
┌─────────────────────────────────────────┐
│                                         │
│              🌬️ Logo                    │
│         AirBloom Tracker                │
│   IoT Environmental Monitoring          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Welcome back                     │ │
│  │  Enter your credentials           │ │
│  │                                   │ │
│  │  Username or Email                │ │
│  │  [___________________________]    │ │
│  │                                   │ │
│  │  Password                         │ │
│  │  [___________________________]    │ │
│  │                                   │ │
│  │  [      Sign in      ]            │ │
│  │                                   │ │
│  │  Demo Credentials:                │ │
│  │  admin / admin123                 │ │
│  │  demo / demo123                   │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Dashboard Page (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🌬️ AirBloom  [Dashboard] [Devices] [History]  ☀️ 👤      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📡 ESP32 Unit Alpha                    🟢 Online    │   │
│  │ Device ID: esp32-001                   12:34:56     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ⚠️ High AQI detected: 165                          [×]    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 🌡️       │ │ 💧       │ │ 🌬️       │ │   AQI    │     │
│  │ Temp     │ │ Humidity │ │ Air Qual │ │  Gauge   │     │
│  │ 24.5°C   │ │ 65.2%    │ │ 85 AQI   │ │   ⚪     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
│  Analytics                          [1h] [6h] [24h] [7d]   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ Temperature vs Time │  │   AQI vs Time       │         │
│  │                     │  │                     │         │
│  │      📈 Chart       │  │      📈 Chart       │         │
│  │                     │  │                     │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Live GPS Tracking    [🗺️] [🗺️] [🛰️] [🧭] [⛶]      │   │
│  │ 28.61390, 77.20900                                  │   │
│  │                                                     │   │
│  │              🗺️ Interactive Map                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Devices Page (`/devices`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🌬️ AirBloom  [Dashboard] [Devices] [History]  ☀️ 👤      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 Devices                                                 │
│  Manage and monitor your IoT devices                       │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Total    │ │ Online   │ │ Offline  │                   │
│  │   3      │ │   2      │ │   1      │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  Available Devices                                          │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ ESP32 Unit Alpha        │  │ ESP32 Unit Beta         │ │
│  │ 📍 New Delhi, India     │  │ 📍 Mumbai, India        │ │
│  │ 🟢 Active               │  │ ⚫ Offline              │ │
│  │                         │  │                         │ │
│  │ Device ID: esp32-001    │  │ Device ID: esp32-002    │ │
│  │ Last AQI: 85            │  │ Last AQI: 120           │ │
│  │ Updated: 12:34:56       │  │ Updated: 11:30:00       │ │
│  │                         │  │                         │ │
│  │ [View Dashboard →]      │  │ [View Dashboard →]      │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────┐                               │
│  │ ESP32 Unit Gamma        │                               │
│  │ 📍 Bangalore, India     │                               │
│  │ 🟢 Active               │                               │
│  │                         │                               │
│  │ Device ID: esp32-003    │                               │
│  │ Last AQI: 65            │                               │
│  │ Updated: 12:30:00       │                               │
│  │                         │                               │
│  │ [View Dashboard →]      │                               │
│  └─────────────────────────┘                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. History Page (`/history`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🌬️ AirBloom  [Dashboard] [Devices] [History]  ☀️ 👤      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📜 History & Logs              [📥 Export CSV]            │
│  View and export historical sensor data                    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Total    │ │ Time     │ │ Avg AQI  │                   │
│  │ Records  │ │ Range    │ │          │                   │
│  │  240     │ │  1h      │ │   82     │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Data Logs                    [1h] [6h] [24h] [7d]  │   │
│  │                                                     │   │
│  │ Time      | Temp  | Humidity | AQI  | Location    │   │
│  │───────────|───────|──────────|──────|─────────────│   │
│  │ 12:34:56  | 24.5° | 65.2%    | 85   | 28.61, 77.2 │   │
│  │ 12:34:41  | 24.4° | 65.1%    | 84   | 28.61, 77.2 │   │
│  │ 12:34:26  | 24.6° | 65.3%    | 86   | 28.61, 77.2 │   │
│  │ 12:34:11  | 24.5° | 65.2%    | 85   | 28.61, 77.2 │   │
│  │ ...                                                 │   │
│  │                                                     │   │
│  │                    [← Previous] [Next →]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Color Schemes

### Light Mode
```
Background:     #FFFFFF (White)
Card:           #FFFFFF (White)
Text:           #0A0F14 (Dark Gray)
Muted Text:     #6B7280 (Gray)
Primary:        #10B981 (Green)
Border:         #E5E7EB (Light Gray)
```

### Dark Mode
```
Background:     #0F1419 (Dark Blue)
Card:           #1A1F26 (Elevated Dark)
Text:           #E5E7EB (Light Gray)
Muted Text:     #6B7280 (Gray)
Primary:        #10B981 (Green)
Border:         #2D3748 (Dark Gray)
```

## 🎯 Interactive Elements

### Buttons

```
Primary Button:
┌─────────────────┐
│   Sign in       │  ← Green background, white text
└─────────────────┘

Secondary Button:
┌─────────────────┐
│   Cancel        │  ← Gray background, dark text
└─────────────────┘

Ghost Button:
┌─────────────────┐
│   View More     │  ← Transparent, hover effect
└─────────────────┘
```

### Cards

```
Standard Card:
┌─────────────────────────────┐
│ 🌡️ Temperature              │
│                             │
│        24.5°C               │
│                             │
└─────────────────────────────┘

Hover Effect:
┌─────────────────────────────┐
│ 🌡️ Temperature              │  ← Slight scale up
│                             │  ← Shadow increases
│        24.5°C               │
│                             │
└─────────────────────────────┘
```

### Status Indicators

```
Online:  🟢 ← Pulsing green dot
Offline: ⚫ ← Static gray dot
Warning: 🟡 ← Yellow dot
Danger:  🔴 ← Red dot
```

## 📱 Responsive Layouts

### Mobile (< 640px)
```
┌─────────────┐
│ ☰  Logo  ☀️ │
├─────────────┤
│             │
│  [Card 1]   │
│  [Card 2]   │
│  [Card 3]   │
│  [Card 4]   │
│             │
│  [Chart 1]  │
│             │
│  [Chart 2]  │
│             │
│  [Map]      │
│             │
└─────────────┘
```

### Tablet (640px - 1024px)
```
┌─────────────────────────┐
│ Logo  Nav Items  ☀️ 👤  │
├─────────────────────────┤
│                         │
│  [Card 1]  [Card 2]     │
│  [Card 3]  [Card 4]     │
│                         │
│  [Chart 1]  [Chart 2]   │
│                         │
│  [Map - Full Width]     │
│                         │
└─────────────────────────┘
```

### Desktop (> 1024px)
```
┌───────────────────────────────────────┐
│ Logo  Nav Items          ☀️ 👤        │
├───────────────────────────────────────┤
│                                       │
│  [Card 1] [Card 2] [Card 3] [Card 4] │
│                                       │
│  [Chart 1]              [Chart 2]     │
│                                       │
│  [Map - Full Width with Controls]     │
│                                       │
└───────────────────────────────────────┘
```

## 🗺️ Map Controls

```
Map Header:
┌─────────────────────────────────────────────────┐
│ Live GPS Tracking    [🗺️] [🗺️] [🛰️] [🧭] [⛶]  │
│ 28.61390, 77.20900                              │
└─────────────────────────────────────────────────┘
     ↑           ↑    ↑    ↑    ↑    ↑
     │           │    │    │    │    └─ Fullscreen
     │           │    │    │    └────── Navigation
     │           │    │    └─────────── Satellite
     │           │    └──────────────── Standard
     │           └───────────────────── Dark
     └───────────────────────────────── Title

Map Markers:
📍 ← Current position (blue marker)
🟢 ← Home location (green circle)
━━ ← Path history (green line)
╌╌ ← Navigation route (yellow dashed)
```

## 🎭 Animations

### Slide In
```
Frame 1: opacity: 0, translateY: 10px
Frame 2: opacity: 0.5, translateY: 5px
Frame 3: opacity: 1, translateY: 0px
Duration: 0.3s
```

### Pulse Glow
```
Frame 1: opacity: 1
Frame 2: opacity: 0.5
Frame 3: opacity: 1
Duration: 2s (infinite)
```

### Hover Scale
```
Normal: scale(1)
Hover:  scale(1.02)
Duration: 0.2s
```

## 🎨 Typography

```
Headings:
H1: 2.25rem (36px) - Bold
H2: 1.875rem (30px) - Bold
H3: 1.5rem (24px) - Semibold

Body:
Regular: 1rem (16px) - Normal
Small: 0.875rem (14px) - Normal
Tiny: 0.75rem (12px) - Normal

Code:
Monospace: JetBrains Mono
Size: 0.875rem (14px)
```

## 🔔 Notifications

### Toast Notification
```
┌─────────────────────────────┐
│ ✓ Success!                  │
│ Data exported successfully  │
└─────────────────────────────┘
  ↑
  Slides in from bottom-right
  Auto-dismiss after 5s
```

### Alert Banner
```
┌─────────────────────────────────────┐
│ ⚠️ High AQI detected: 165      [×] │
└─────────────────────────────────────┘
  ↑
  Appears at top of dashboard
  Dismissible with X button
```

---

**This visual guide helps you understand the layout and design of AirBloom Tracker!** 🎨
