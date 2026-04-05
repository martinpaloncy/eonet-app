'use client'

import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import Map, { Source, Layer, Popup, NavigationControl, type MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CATEGORY_STYLES } from '@/lib/constants'
import type { EONETEvent } from '@/lib/types'

export type GlobeStyle = 'day' | 'night' | 'carto'

// Three tiled imagery styles — all label-free, no API keys
const STYLES: Record<GlobeStyle, any> = {
  day: {
    version: 8,
    projection: { type: 'globe' },
    sky: { 'sky-color': '#a2c5f2', 'horizon-color': '#f0e8d8', 'fog-color': '#cfdff5' },
    sources: {
      esri: {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: '&copy; <a href="https://www.esri.com">Esri</a>',
      },
    },
    layers: [{ id: 'tiles', type: 'raster', source: 'esri' }],
  },
  night: {
    version: 8,
    projection: { type: 'globe' },
    sources: {
      nasa: {
        type: 'raster',
        tiles: [
          'https://gitc.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
        ],
        tileSize: 256,
        maxzoom: 8,
        attribution: 'NASA Earth Observatory',
      },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#020408' } },
      { id: 'tiles', type: 'raster', source: 'nasa' },
    ],
  },
  carto: {
    version: 8,
    projection: { type: 'globe' },
    sources: {
      carto: {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
        maxzoom: 20,
        attribution:
          '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#050a14' } },
      { id: 'tiles', type: 'raster', source: 'carto' },
    ],
  },
}

// Fog / atmosphere settings per style
const FOG: Record<GlobeStyle, any> = {
  day: {
    color: 'rgba(200, 220, 240, 0.8)',
    'high-color': 'rgba(120, 160, 220, 0.5)',
    'horizon-blend': 0.04,
    'space-color': '#0b1026',
    'star-intensity': 0.0,
  },
  night: {
    color: 'rgba(2, 4, 8, 0.9)',
    'high-color': 'rgba(20, 40, 80, 0.3)',
    'horizon-blend': 0.03,
    'space-color': '#020408',
    'star-intensity': 0.35,
  },
  carto: {
    color: 'rgba(5, 10, 20, 0.85)',
    'high-color': 'rgba(30, 60, 120, 0.25)',
    'horizon-blend': 0.03,
    'space-color': '#050a14',
    'star-intensity': 0.2,
  },
}

interface HoverInfo {
  lng: number
  lat: number
  title: string
  category: string
  active: boolean
  color: string
}

interface Props {
  events: EONETEvent[]
  selectedEventId: string | null
  onSelectEvent: (id: string) => void
  globeStyle: GlobeStyle
}

export default function GlobeView({ events, selectedEventId, onSelectEvent, globeStyle }: Props) {
  const mapRef = useRef<MapRef>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

  // Build GeoJSON from events
  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: events
        .filter(e => e.geometry.length > 0)
        .map(event => {
          const g = event.geometry[event.geometry.length - 1]
          const catId = event.categories[0]?.id || 'default'
          const { color } = CATEGORY_STYLES[catId] || CATEGORY_STYLES.default
          return {
            type: 'Feature' as const,
            properties: {
              id: event.id,
              color,
              active: event.closed ? 0 : 1,
              title: event.title,
              category: event.categories[0]?.title || '',
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [g.coordinates[0], g.coordinates[1]],
            },
          }
        }),
    }),
    [events],
  )

  // Apply fog for the current style
  const applyFog = useCallback(() => {
    const map = mapRef.current?.getMap() as any
    if (!map?.setFog) return
    try {
      map.setFog(FOG[globeStyle])
    } catch {}
  }, [globeStyle])

  // Re-apply fog after every style reload
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const handler = () => applyFog()
    map.on('style.load', handler)
    applyFog()
    return () => { map.off('style.load', handler) }
  }, [applyFog])

  // Fly to selected event
  useEffect(() => {
    if (!selectedEventId || !mapRef.current) return
    const feat = geojson.features.find(f => f.properties.id === selectedEventId)
    if (!feat) return
    mapRef.current.flyTo({
      center: feat.geometry.coordinates as [number, number],
      zoom: 5,
      duration: 1500,
    })
  }, [selectedEventId, geojson])

  // Click handler
  const onClick = useCallback(
    (e: any) => {
      if (e.features?.length > 0) {
        onSelectEvent(e.features[0].properties.id)
      }
    },
    [onSelectEvent],
  )

  // Hover handlers
  const onMouseEnter = useCallback((e: any) => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = 'pointer'
    if (e.features?.length > 0) {
      const f = e.features[0]
      setHoverInfo({
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
        title: f.properties.title,
        category: f.properties.category,
        active: Number(f.properties.active) === 1,
        color: f.properties.color,
      })
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = ''
    setHoverInfo(null)
  }, [])

  // Adaptive stroke color per globe style
  const strokeColor = globeStyle === 'day' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)'
  const glowOpacity = globeStyle === 'day' ? 0.12 : 0.07

  return (
    <Map
      ref={mapRef}
      mapStyle={STYLES[globeStyle]}
      styleDiffing={false}
      initialViewState={{ longitude: 0, latitude: 20, zoom: 1.5 }}
      onLoad={applyFog}
      interactiveLayerIds={['event-points']}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      maxPitch={85}
    >
      <NavigationControl position="bottom-left" showCompass />

      <Source id="events" type="geojson" data={geojson}>
        {/* Outer glow halo */}
        <Layer
          id="event-glow"
          type="circle"
          paint={{
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              1, ['case', ['==', ['get', 'active'], 1], 10, 6],
              8, ['case', ['==', ['get', 'active'], 1], 20, 12],
            ],
            'circle-color': ['get', 'color'],
            'circle-opacity': glowOpacity,
            'circle-blur': 1,
          }}
        />
        {/* Solid points */}
        <Layer
          id="event-points"
          type="circle"
          paint={{
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              1, ['case', ['==', ['get', 'active'], 1], 3.5, 2],
              6, ['case', ['==', ['get', 'active'], 1], 6, 4],
              12, ['case', ['==', ['get', 'active'], 1], 10, 7],
            ],
            'circle-color': ['get', 'color'],
            'circle-opacity': ['case', ['==', ['get', 'active'], 1], 0.9, 0.45],
            'circle-stroke-width': [
              'interpolate', ['linear'], ['zoom'],
              1, 1,
              8, 1.5,
            ],
            'circle-stroke-color': strokeColor,
          }}
        />
      </Source>

      {hoverInfo && (
        <Popup
          longitude={hoverInfo.lng}
          latitude={hoverInfo.lat}
          closeButton={false}
          closeOnClick={false}
          anchor="bottom"
          offset={14}
        >
          <div className="font-sans">
            <div className="text-[13px] font-semibold text-white/90 mb-1 leading-snug">
              {hoverInfo.title}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/35">
              <span
                className="w-[6px] h-[6px] rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: hoverInfo.color }}
              />
              {hoverInfo.category}
            </div>
            {hoverInfo.active && (
              <div className="text-[9px] text-emerald-400/80 font-semibold mt-1.5 tracking-[0.12em]">
                ACTIVE
              </div>
            )}
          </div>
        </Popup>
      )}
    </Map>
  )
}
