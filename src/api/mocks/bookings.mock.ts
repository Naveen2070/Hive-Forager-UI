import { BookingStatus } from '@/types/enum.ts'
import type { BookingDTO } from '@/types/booking.type.ts'

export const MY_BOOKINGS_MOCK: {
  content: BookingDTO[]
  totalPages: number
  totalElements: number
} = {
  totalPages: 1,
  totalElements: 4,
  content: [
    // 1. Next Up (Upcoming Event - Maps to Event ID 1)
    {
      bookingId: 1001,
      bookingReference: 'HIVE-A7B8C9',
      eventId: 1,
      eventTitle: 'Hive Developer Conference 2026',
      eventDescription:
        'The biggest annual gathering of worker bees and tech architects in the industry.',
      eventDate: '2026-03-15T09:00:00Z',
      eventEndDate: '2026-03-17T18:00:00Z',
      eventLocation: 'Moscone Center, San Francisco',
      ticketTierName: 'VIP Nectar Pass',
      ticketsCount: 1,
      totalPrice: 499.0,
      status: BookingStatus.CONFIRMED,
      bookedAt: '2026-02-01T10:30:00Z',
    },
    // 2. Later (Future Event - Maps to Event ID 2)
    {
      bookingId: 1002,
      bookingReference: 'HIVE-X1Y2Z3',
      eventId: 2,
      eventTitle: 'Midnight Cinema: The Matrix',
      eventDescription:
        'A special 3D screening of the sci-fi classic. Red pill or blue pill?',
      eventDate: '2026-04-10T23:30:00Z',
      eventEndDate: '2026-04-11T02:00:00Z',
      eventLocation: 'Alamo Drafthouse, Austin',
      ticketTierName: 'Balcony Recliner',
      ticketsCount: 2,
      totalPrice: 45.0,
      status: BookingStatus.CONFIRMED,
      bookedAt: '2026-02-28T14:15:00Z',
    },
    // 3. History (Past Event - Maps to Event ID 3)
    {
      bookingId: 998,
      bookingReference: 'HIVE-M4N5O6',
      eventId: 3,
      eventTitle: 'React Native Meetup',
      eventDescription: 'Local community meetup for mobile developers.',
      eventDate: '2026-01-20T18:00:00Z',
      eventEndDate: '2026-01-20T21:00:00Z',
      eventLocation: 'WeWork Central, New York',
      ticketTierName: 'General Admission',
      ticketsCount: 1,
      totalPrice: 0.0,
      status: BookingStatus.CHECKED_IN,
      bookedAt: '2025-12-15T09:00:00Z',
    },
    // 4. History (Cancelled Event - Maps to Event ID 4)
    {
      bookingId: 1005,
      bookingReference: 'HIVE-Q7R8S9',
      eventId: 4,
      eventTitle: 'Outdoor Symphony in the Park',
      eventDescription: 'An evening of classical music under the stars.',
      eventDate: '2026-05-01T19:00:00Z',
      eventEndDate: '2026-05-01T22:00:00Z',
      eventLocation: 'Central Park Bandshell',
      ticketTierName: 'Lawn Seating',
      ticketsCount: 4,
      totalPrice: 120.0,
      status: BookingStatus.CANCELLED,
      bookedAt: '2026-02-10T11:20:00Z',
    },
  ],
}
