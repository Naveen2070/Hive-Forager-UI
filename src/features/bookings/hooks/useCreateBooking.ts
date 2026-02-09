import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { eventKeys } from '@/features/events/events.keys'
import { bookingsApi } from '@/api/booking.ts'

export const useCreateBooking = (eventId: number) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: async(data) => {
      // Refresh the Event Details (to update seat count)
      await  queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })

      // Refresh the Events List (to update seat bars on the grid)
      await queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success(`Booking created successfully for ${data.eventTitle}`)

      // Navigate to Ticket Wallet
      await navigate({ to: '/bookings' })
    },
    onError: (error: any) => {
      console.error("Error during purchase",error)
    toast.error(error.response?.data?.message || 'Could not complete purchase.')
    },
  })
}
