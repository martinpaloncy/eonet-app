# EONET — NASA Earth Events Dashboard

A real-time 3D globe dashboard for tracking natural events worldwide, powered by NASA's [Earth Observatory Natural Event Tracker (EONET)](https://eonet.gsfc.nasa.gov/) API.

Built with Next.js, MapLibre GL, and TypeScript.

## Features

- **3D Globe Visualization** — interactive globe with three rendering modes:
  - **Day Satellite** — high-resolution ESRI World Imagery with deep zoom
  - **Night Satellite** — NASA VIIRS CityLights composite showing Earth at night
  - **Cartographic** — minimal dark basemap for data-focused viewing
- **Live Event Tracking** — color-coded markers for wildfires, storms, volcanic activity, sea ice, and more
- **Category Filtering** — toggle event types on/off with live counts per category
- **Time Range Controls** — filter by 7 days, 14 days, 30 days, 90 days, 1 year, or all time
- **Search** — filter events by name in real time
- **Fly-to Navigation** — select any event from the sidebar to fly the globe to its location
- **Event Details** — category, magnitude, coordinates, full position history, and source links
- **Statistics Panel** — active/closed counts with category breakdown donut chart
- **Auto-refresh** — polls NASA EONET every 5 minutes for new events
- **Responsive** — sidebar collapses to a mobile overlay with backdrop on small screens

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, TypeScript) |
| Globe / Map | [MapLibre GL JS v5](https://maplibre.org/) + [react-map-gl v8](https://visgl.github.io/react-map-gl/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Data Fetching | [SWR](https://swr.vercel.app/) |
| Charts | [Recharts](https://recharts.org/) |
| Deployment | [Vercel](https://vercel.com/) |

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Inter font, metadata)
│   ├── page.tsx            # Entry point
│   └── globals.css         # Theme, scrollbar, MapLibre overrides
├── components/
│   ├── Dashboard.tsx       # Main client component, state management
│   ├── MapView.tsx         # 3D globe (MapLibre GL, three tile styles, fog/atmosphere)
│   ├── Header.tsx          # Top bar with globe mode toggle, refresh, panel toggle
│   ├── Sidebar.tsx         # Control panel container
│   ├── StatsPanel.tsx      # Event counts + category donut chart
│   ├── CategoryFilter.tsx  # Colored toggle pills with counts
│   ├── TimeRange.tsx       # Preset time range buttons
│   ├── EventList.tsx       # Scrollable event list with loading skeletons
│   └── EventDetail.tsx     # Full event view with position history
└── lib/
    ├── api.ts              # NASA EONET API client
    ├── hooks.ts            # SWR hooks (useEonetEvents, useEonetCategories)
    ├── types.ts            # TypeScript interfaces for EONET data
    └── constants.ts        # API config, category colors, time presets
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys required — all data sources are public.

## Data Sources

| Source | Provider | Usage |
|--------|----------|-------|
| [EONET v3 API](https://eonet.gsfc.nasa.gov/docs/v3) | NASA | Natural event data (wildfires, storms, volcanoes, etc.) |
| [World Imagery](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer) | Esri | Day satellite tiles |
| [VIIRS CityLights](https://earthdata.nasa.gov/earth-observation-data) | NASA GIBS | Night satellite composite |
| [Dark Basemap](https://carto.com/basemaps/) | CARTO / OpenStreetMap | Cartographic tiles |

## Deployment

Push to GitHub and import at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js — zero configuration needed.

## License

MIT
