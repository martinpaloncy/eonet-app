import { API_BASE } from './constants'
import type { EONETEventsResponse, EONETCategoriesResponse } from './types'

export async function fetchEvents(params: {
  days?: number
  status?: string
  limit?: number
} = {}): Promise<EONETEventsResponse> {
  const url = new URL(`${API_BASE}/events`)
  if (params.days && params.days > 0) url.searchParams.set('days', String(params.days))
  if (params.status) url.searchParams.set('status', params.status)
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`EONET API error: ${res.status}`)
  return res.json()
}

export async function fetchCategories(): Promise<EONETCategoriesResponse> {
  const res = await fetch(`${API_BASE}/categories`)
  if (!res.ok) throw new Error(`EONET API error: ${res.status}`)
  return res.json()
}
