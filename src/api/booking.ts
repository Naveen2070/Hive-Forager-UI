import { api } from './axios'
import type {
  BookingDTO,
  CheckInResponse,
  CreateBookingRequest,
} from '@/types/booking.type.ts'
import type { PageResponse } from '@/types/common.type.ts'

export const bookingsApi = {
  create: async (data: CreateBookingRequest) => {
    const response = await api.post<BookingDTO>('/bookings', data)
    return response.data
  },

  getMyBookings: async () => {
    const response = await api.get<PageResponse<BookingDTO>>('/bookings')
    return response.data
  },

  checkIn: async (reference: string) => {
    const response = await api.post<CheckInResponse>('/bookings/check-in', {
      bookingReference: reference,
    })
    return response.data
  },
}
