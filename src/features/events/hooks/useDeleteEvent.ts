import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success('Event deleted successfully')
    },
    onError: (e) => {
      console.error('Error while deleting event',e)
      toast.error('Error while deleting event')
    },
  })
}
