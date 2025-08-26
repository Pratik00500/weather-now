# Weather Now (React + Tailwind + Open‑Meteo)

A fast, minimal app for **Jamie (outdoor enthusiast)** to quickly check **current weather** for any city.

## ✨ Features
- City search with **Open‑Meteo Geocoding API**
- Current weather via **Open‑Meteo Forecast API**
- Responsive, mobile‑first UI with **Tailwind CSS**
- Clear loading states and friendly error handling
- Clean, commented React Hooks code

## 🛠️ Tech Stack
- React 18 + Vite
- Tailwind CSS 3
- Open‑Meteo APIs (no auth)

## 🚀 Quick Start (Local)
```bash
npm install
npm run dev
```
Open the printed local URL in your browser.

## 🌐 Deploy Free
- **StackBlitz**: Create a new React + Vite project, then replace files with the ones here. It auto-builds.
- **CodeSandbox**: New Sandbox → React (Vite). Add Tailwind configs and paste files. Hit **Run**.

## 🔗 APIs Used
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

## ✅ Testing Tips
- Try ambiguous names (e.g., "Springfield") and select from results
- Try gibberish (e.g., "asdfgh") to see graceful error
- Toggle network offline in DevTools to test error handling
