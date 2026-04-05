export const API_BASE = 'https://eonet.gsfc.nasa.gov/api/v3'

export const REFRESH_INTERVAL = 5 * 60 * 1000

export const TIME_PRESETS = [
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '1y', days: 365 },
  { label: 'All', days: 0 },
]

export const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  wildfires: { color: '#ef4444', label: 'Wildfires' },
  severeStorms: { color: '#a855f7', label: 'Severe Storms' },
  volcanoes: { color: '#f97316', label: 'Volcanoes' },
  earthquakes: { color: '#eab308', label: 'Earthquakes' },
  floods: { color: '#3b82f6', label: 'Floods' },
  seaLakeIce: { color: '#06b6d4', label: 'Sea & Lake Ice' },
  landslides: { color: '#84cc16', label: 'Landslides' },
  snow: { color: '#e2e8f0', label: 'Snow' },
  drought: { color: '#d97706', label: 'Drought' },
  dustHaze: { color: '#78716c', label: 'Dust & Haze' },
  waterColor: { color: '#0ea5e9', label: 'Water Color' },
  tempExtremes: { color: '#dc2626', label: 'Temp. Extremes' },
  manmade: { color: '#6b7280', label: 'Manmade' },
  default: { color: '#9ca3af', label: 'Other' },
}
