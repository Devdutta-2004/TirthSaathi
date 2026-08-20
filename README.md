# 🕉️ TirthSaathi — Sacred Pilgrimage PWA Platform

> **Your Trusted Spiritual Companion** — Family Connectivity, Intelligent Temple Crowd Management & Real-Time Pilgrimage Assistance.

---

## 🌟 Core System Architecture

TirthSaathi is a mobile-first Progressive Web App (PWA) built around two flagship engines:

1. **👨‍👩‍👧 TirthSaathi Finder (Family & Group Locator)**
   - Multi-device real-time GPS tracking via `navigator.geolocation.watchPosition`.
   - Live **Haversine formula** distance calculation and compass bearing between family members.
   - Interactive **OpenStreetMap** with live pulsing markers, $\pm\text{accuracy}$ radius circles, and dynamic walking routes.
   - Remote **Spiritual Audio Chime Beacon** (synthesizes 432Hz & 528Hz harmonic temple bell tones on peer smartphones).
   - Offline-first cache resilience (`localStorage` + Service Worker).

2. **🧭 TirthSaathi Flow (Intelligent Temple Crowd Management)**
   - Algorithmic gate scoring based on live occupancy percentage, queue wait times, walking distance, group size, and congestion trends.
   - Dynamic Gate Redirection & live surge alerts.
   - QR Entry Pass generation (`TS-PASS-XXXXXX`).
   - **Authority Control Center**: Live gate occupancy matrix, Open/Close toggles, and interactive QR scanner that updates gate headcounts across all connected phones in real time (<50ms latency).

3. **🛕 Indian Heritage Design System & Festival Theming**
   - Royal Temple Navy, Burnished Gold, Sacred Saffron, and Ivory Sandstone palette with subtle Jali lattice patterns.
   - Dynamic festival themes: *Default Sacred Blue*, *Mahashivratri*, *Deepotsav / Diwali*, *Navratri*, *Ram Navami*.
   - **Senior Devotee Mode**: Enlarged high-contrast fonts (115%), oversized touch targets ($\ge 52\text{px}$), and simplified 1-touch actions.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full Application (Frontend + WebSocket Server)
```bash
# Terminal 1: Start React Frontend (Vite)
npm run dev

# Terminal 2: Start Realtime WebSocket & Sync Backend
npm run server
```

- **Frontend App**: [http://localhost:3000/](http://localhost:3000/) *(or `http://192.168.x.x:3000/` on mobile)*
- **WebSocket Backend**: `ws://localhost:3001` *(Health check: `http://localhost:3001/health`)*

---

## 📱 Testing with 2 Physical Smartphones

1. Connect both smartphones to the same Wi-Fi network.
2. Open `http://<YOUR_COMPUTER_IP>:3000/` on **Phone 1** (e.g. `http://192.168.1.100:3000/`).
3. Open `http://<YOUR_COMPUTER_IP>:3000/` on **Phone 2**.
4. On Phone 1 $\rightarrow$ Go to **Finder** $\rightarrow$ note Circle Code (e.g. `TS-FAM-7X29A`).
5. On Phone 2 $\rightarrow$ Go to **Finder** $\rightarrow$ Tap **Join on Phone 2** $\rightarrow$ enter `TS-FAM-7X29A`.
6. Watch both devices track each other live on OpenStreetMap with real-time distance in meters!

---

## ☁️ Deployment on Vercel

```bash
npx vercel
```
Or import this GitHub repository directly into [Vercel Dashboard](https://vercel.com/new).

---

## 📁 Project Structure

```
├── public/
│   ├── images/               # High-res pilgrimage photography assets
│   ├── manifest.webmanifest  # PWA configuration
│   └── sw.js                 # Service Worker caching
├── server.js                 # Node.js WebSocket & Realtime Synchronization Server
├── src/
│   ├── components/
│   │   ├── home/             # Events carousel & feature highlights
│   │   ├── layout/           # AppLayout, collapsible desktop sidebar & mobile nav
│   │   ├── map/              # LiveGPSMap (OpenStreetMap + Mercator canvas)
│   │   └── Modals/           # SOS, Digital ID, Report Missing, Family modals
│   ├── context/
│   │   └── YatraContext.jsx  # Global state, GPS tracking, and WebSocket dispatcher
│   ├── screens/              # 10 dedicated screen routes (Home, Finder, Flow, Authority, etc.)
│   ├── services/
│   │   ├── crowdEngine.js    # Gate mathematical scoring algorithm
│   │   ├── familyStore.js    # Family circle data layer
│   │   ├── geoService.js     # GPS watcher, Haversine formula & Web Audio chime
│   │   ├── passService.js    # QR Entry Pass generator & scanner
│   │   ├── realtimeClient.js # WebSocket client manager
│   │   └── themeManager.js   # Dynamic festival theming engine
│   ├── App.jsx               # Screen router
│   ├── main.jsx              # App root
│   └── index.css             # Heritage design system & Tailwind styles
├── index.html                # HTML entry with Google Fonts (Marcellus, Yatra One, Cinzel)
├── package.json
└── tailwind.config.js
```

---

## 🛡️ License
Private & Confidential — Built for TirthSaathi Pilgrimage Platform.
