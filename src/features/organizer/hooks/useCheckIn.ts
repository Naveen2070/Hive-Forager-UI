import { useMutation } from '@tanstack/react-query'
import { bookingsApi } from '@/api/booking.ts'


export const useCheckIn = () => {
  return useMutation({
    mutationFn: async (reference: string) => {
      return await bookingsApi.checkIn(reference)
    },
  })
}
