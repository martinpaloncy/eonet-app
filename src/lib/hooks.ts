import useSWR from 'swr'
import { fetchEvents, fetchCategories } from './api'
import { REFRESH_INTERVAL } from './constants'

export function useEonetEvents(days: number) {
  const { data, error, isLoading, mutate } = useSWR(
    ['events', days],
    () => fetchEvents({ days: days > 0 ? days : undefined, status: 'all' }),
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    events: data?.events,
    isLoading,
    error,
    mutate,
  }
}

export function useEonetCategories() {
  const { data, error, isLoading } = useSWR(
    'categories',
    fetchCategories,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000,
    }
  )

  return {
    categories: data?.categories,
    isLoading,
    error,
  }
}
