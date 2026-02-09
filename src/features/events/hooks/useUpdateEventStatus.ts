import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'

export const useUpdateEventStatus = (eventId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: string) => eventsApi.updateStatus(eventId, status),
    onSuccess: async(newData) => {
      queryClient.setQueryData(eventKeys.detail(eventId), newData)

      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

     toast.success(`${newData.title} Event status updated successfully to ${newData.status}`)
    },
    onError: (e) => {
      console.error('Error while updating event status',e)
      toast.error('Error while updating event status')
    },
  })
}
