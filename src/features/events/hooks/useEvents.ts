import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useState } from 'react'
import type { EventFilters } from '@/types/event.type.ts'
import type { CreateEventValues } from '@/features/events/event.schemas.ts'
import { eventsApi } from '@/api/events.ts'
import { eventKeys } from '@/features/events/events.keys.ts'
import { useAuthStore } from '@/store/auth.store.ts'
import { UserRole } from '@/types/enum.ts'
import { useDebounce } from '@/hooks/useDebounce.ts'

// --- GET ---

export const useEventDetail = (eventId: number) => {
  const query = useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventsApi.getById(eventId),
  })

  return {
    event: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useEventQueries = () => {
  // Get user role
  const { user } = useAuthStore()
  const isOrganizer = user?.role === UserRole.ORGANIZER

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

// --- POST ---

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      toast.success('Event created successfully')
      await navigate({ to: '/events' })
    },
    onError: (error) => {
      console.error({
        feature: 'useCreateEvent',
        error: error,
      })
      toast.error('Failed to create event. Please try again.')
    },
  })
}

// --- PUT ---

export const useUpdateEvent = (eventId: number) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateEventValues) => {
      // ⚠️ IMPORTANT: Filter out ticketTiers
      // The UpdateEventRequest interface does not support updating tiers via the main PUT endpoint.
      // Tiers are usually managed via separate Add/Update Tier endpoints.
      const { ticketTiers, ...updatePayload } = data

      // Ensure date formatting if needed
      const formattedPayload = {
        ...updatePayload,
        startDate:
          updatePayload.startDate.length === 16
            ? `${updatePayload.startDate}:00`
            : updatePayload.startDate,
        endDate:
          updatePayload.endDate.length === 16
            ? `${updatePayload.endDate}:00`
            : updatePayload.endDate,
      }

      return eventsApi.update(eventId, formattedPayload)
    },
    onSuccess: async () => {
      // Invalidate specific event AND lists
      await queryClient.invalidateQueries({
        queryKey: eventKeys.detail(eventId),
      })
      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success('Event updated successfully')

      await navigate({ to: '/events' })
    },
    onError: (error) => {
      console.error('Update failed', error)
      toast.error('Failed to update event')
    },
  })
}

export const useUpdateEventStatus = (eventId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: string) => eventsApi.updateStatus(eventId, status),
    onSuccess: async (newData) => {
      await queryClient.setQueryData(eventKeys.detail(eventId), newData)

      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success(
        `${newData.title} Event status updated successfully to ${newData.status}`,
      )
    },
    onError: (e) => {
      console.error('Error while updating event status', e)
      toast.error('Error while updating event status')
    },
  })
}

// --- DELETE ---

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success('Event deleted successfully')
    },
    onError: (e) => {
      console.error('Error while deleting event', e)
      toast.error('Error while deleting event')
    },
  })
}
