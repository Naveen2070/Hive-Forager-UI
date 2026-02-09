import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateTicketTierRequest,
  UpdateTicketTierRequest,
} from '@/types/event.type'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'

export const useTicketTierMutations = (eventId: number) => {
  const queryClient = useQueryClient()

  const addTier = useMutation({
    mutationFn: (data: CreateTicketTierRequest) =>
      eventsApi.addTier(eventId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventKeys.detail(eventId),
      })
      toast.success('Ticket tier added')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to add tier'),
  })

  const updateTier = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTicketTierRequest }) =>
      eventsApi.updateTier(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventKeys.detail(eventId),
      })
      toast.success('Ticket tier updated')
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to update tier'),
  })

  const deleteTier = useMutation({
    mutationFn: (tierId: number) => eventsApi.deleteTier(tierId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventKeys.detail(eventId),
      })
      toast.success('Ticket tier deleted')
    },
    onError: (err: any) =>
      toast.error(
        err.response?.data?.message ||
          'Cannot delete tier with existing bookings',
      ),
  })

  return { addTier, updateTier, deleteTier }
}
