# NASA EONET Dashboard

A real-time interactive dashboard for visualizing natural events worldwide, powered by NASA's [Earth Observatory Natural Event Tracker (EONET)](https://eonet.gsfc.nasa.gov/) API.

![Dashboard Screenshot](screenshot.png)

## Features

- **Interactive world map** with dark CartoDB tiles and color-coded event markers
- **Marker clustering** — events group when zoomed out, expand on click
- **Category filtering** — toggle event types on/off with live counts
- **Time range controls** — filter by 7d, 14d, 30d, 90d, 1 year, or all time
- **Searchable event list** — click any event to fly the map to its location
- **Event detail panel** — title, category, magnitude, coordinates, position history, source links
- **Auto-refresh** — polls the API every 5 minutes for new events
- **Statistics overview** — total/active/closed counts, category breakdown donut chart
- **NASA satellite overlay** — toggle VIIRS thermal anomaly detection layer (GIBS)
- **Satellite imagery** — switch between dark map and ESRI satellite tiles
- **Responsive design** — sidebar collapses to mobile overlay on small screens
- **Loading skeletons & error states** — graceful handling throughout

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Map | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Data Fetching | [SWR](https://swr.vercel.app/) |
| Charts | [Recharts](https://recharts.org/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

This project uses NASA's [EONET v3 API](https://eonet.gsfc.nasa.gov/docs/v3) — fully open, no API key required.

Key endpoints used:
- `GET /api/v3/events` — natural event data
- `GET /api/v3/categories` — event categories

## Deployment

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new). Zero configuration needed — Vercel auto-detects Next.js.

## License

MIT
