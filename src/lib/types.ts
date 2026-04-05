export interface EONETEvent {
  id: string
  title: string
  description: string | null
  link: string
  closed: string | null
  categories: EONETCategory[]
  sources: EONETSource[]
  geometry: EONETGeometry[]
}

export interface EONETCategory {
  id: string
  title: string
}

export interface EONETSource {
  id: string
  url: string
}

export interface EONETGeometry {
  magnitudeValue: number | null
  magnitudeUnit: string | null
  date: string
  type: string
  coordinates: [number, number]
}

export interface EONETEventsResponse {
  title: string
  description: string
  link: string
  events: EONETEvent[]
}

export interface EONETCategoriesResponse {
  title: string
  description: string
  link: string
  categories: EONETCategoryDetail[]
}

export interface EONETCategoryDetail {
  id: string
  title: string
  link: string
  description: string
  layers: string
}
