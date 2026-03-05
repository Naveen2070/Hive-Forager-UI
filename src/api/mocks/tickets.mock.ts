import { TicketStatus } from '@/types/enum'
import type {
  MyTicketResponse,
  TicketCheckoutResponse,
} from '@/types/ticket-checkout.type'

export const MOCK_CHECKOUT_RESPONSE: TicketCheckoutResponse = {
  ticketId: 'ticket-111',
  bookingReference: 'HIVE-X1Y2Z3',
  totalAmount: 31.0,
  status: TicketStatus.PENDING,
  createdAtUtc: new Date().toISOString(),
}

export const MOCK_MY_TICKETS: MyTicketResponse[] = [
  {
    ticketId: 'ticket-111',
    bookingReference: 'HIVE-X1Y2Z3',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    cinemaId: 'cinema-111',
    showtimeId: 'show-111',

    movieTitle: 'Inception',
    cinemaName: 'Hive Multiplex Downtown',
    auditoriumName: 'IMAX Screen 1',
    startTimeUtc: '2026-10-31T19:30:00Z',
    reservedSeats: [
      { row: 5, col: 5 },
      { row: 5, col: 6 },
    ],
    totalAmount: 31.0,
    status: TicketStatus.CONFIRMED,
    createdAtUtc: '2026-05-10T14:23:05Z',
  },
  {
    ticketId: 'ticket-222',
    bookingReference: 'HIVE-A9B8C7',
    movieId: '123e4567-e89b-12d3-a456-426614174003',
    cinemaId: 'cinema-222',
    showtimeId: 'show-222',

    movieTitle: 'Spider-Man: Beyond',
    cinemaName: 'Starlight Cinemas',
    auditoriumName: 'Screen 4',
    startTimeUtc: '2025-12-15T20:00:00Z',
    reservedSeats: [
      { row: 2, col: 10 },
      { row: 2, col: 11 },
    ],
    totalAmount: 45.0,
    status: TicketStatus.CONFIRMED,
    createdAtUtc: '2025-12-01T10:00:00Z',
  },
]
