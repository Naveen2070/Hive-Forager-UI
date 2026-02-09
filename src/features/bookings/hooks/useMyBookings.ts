import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '@/api/booking.ts'
import { bookingKeys } from '@/features/bookings/bookings.keys.ts'


export const useMyBookings = () => {
  return useQuery({
    queryKey: bookingKeys.mine(),
    queryFn: bookingsApi.getMyBookings,
  })
}
