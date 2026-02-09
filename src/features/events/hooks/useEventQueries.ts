import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { EventFilters } from '@/types/event.type'
import { eventsApi } from '@/api/events'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { eventKeys } from '@/features/events/events.keys'

export const useEventQueries = () => {
  // Get user role
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER

  // Pagination State
  const [page, setPage] = useState(0)
  const pageSize = 12

  // Filters State
  const [filters, setFilters] = useState<EventFilters>({
    status: 'PUBLISHED',
  })

  // Update Filter
  const updateFilter = (key: keyof EventFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
    setPage(0)
  }

  // Set Debounced Filters
  const debouncedFilters = useDebounce(filters, 500)

  // Public Events Query
  const publicEvents = useQuery({
    queryKey: eventKeys.public(debouncedFilters, page),
    queryFn: () => eventsApi.getAll(page, pageSize, debouncedFilters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })

  // My Events Query
  const myEvents = useQuery({
    queryKey: eventKeys.mine(page),
    queryFn: () => eventsApi.getMyEvents(page, pageSize),
    enabled: isOrganizer,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })

  return {
    isOrganizer,
    filters,
    page,
    setPage,
    updateFilter,
    clearFilters: () => {
      setFilters({
        status: 'PUBLISHED',
      })
      setPage(0)
    },
    publicEvents,
    myEvents,
  }
}
