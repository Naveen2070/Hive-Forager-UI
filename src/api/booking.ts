import { api } from './axios'
import type {
  BookingDTO,
  CheckInResponse,
  CreateBookingRequest,
} from '@/types/booking.type.ts'
import type { PageResponse } from '@/types/common.type.ts'
import { BookingStatus } from '@/types/enum'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const bookingsApi = {
  create: async (data: CreateBookingRequest): Promise<BookingDTO> => {
    if (isMock) {
      return {
        id: `mock-id-${Date.now()}`,
        bookingReference: `HIVE-${Math.floor(Math.random() * 100000)}`,
        eventId: data.eventId,
        eventTitle: 'Mock Event Reservation',
        eventDate: new Date().toISOString(),
        eventEndDate: new Date(Date.now() + 86400000).toISOString(),
        status: BookingStatus.CONFIRMED,
        ticketQuantity: data.ticketsCount,
        totalPrice: 50.0 * data.ticketsCount,
        createdAt: new Date().toISOString(),
      } as unknown as BookingDTO
    }
    const response = await api.post<BookingDTO>('/bookings', data)
    return response.data
  },

  getMyBookings: async (): Promise<PageResponse<BookingDTO>> => {
    if (isMock) {
      const { MY_BOOKINGS_MOCK } = await import('@/api/mocks/bookings.mock')
      return MY_BOOKINGS_MOCK
    }
    const response = await api.get<PageResponse<BookingDTO>>('/bookings')
    return response.data
  },

  checkIn: async (reference: string): Promise<CheckInResponse> => {
    if (isMock) {
      return {
        success: true,
        message: 'Checked in successfully.',
        bookingReference: reference,
        checkedInAt: new Date().toISOString(),
      } as unknown as CheckInResponse
    }
    const response = await api.post<CheckInResponse>('/bookings/check-in', {
      bookingReference: reference,
    })
    return response.data
  },
}
