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
    movieTitle: 'Inception',
    cinemaName: 'Hive Multiplex Downtown',
    auditoriumName: 'IMAX Screen 1',
    startTimeUtc: '2026-10-31T19:30:00Z',
    reservedSeats: [
      { row: 5, col: 5 },
      { row: 5, col: 6 },
    ],
    totalAmount: 31.0,
    status: TicketStatus.PAID,
    createdAtUtc: '2026-05-10T14:23:05Z',
  },
]
