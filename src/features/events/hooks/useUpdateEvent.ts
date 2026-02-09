import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { CreateEventValues } from '../event.schemas'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'

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
