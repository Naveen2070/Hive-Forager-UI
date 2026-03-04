import type { SeatCoordinateDTO } from '@/types/seating.types.ts'
import type { TicketStatus } from '@/types/enum.ts'

export interface ReserveTicketRequest {
  showtimeId: string
  seats: SeatCoordinateDTO[]
}

export interface TicketCheckoutResponse {
  ticketId: string
  bookingReference: string
  totalAmount: number
  status: TicketStatus | string
  createdAtUtc: string
}

export interface MyTicketResponse {
  ticketId: string
  bookingReference: string
  movieId: string
  cinemaId: string
  showtimeId: string
  movieTitle: string
  cinemaName: string
  auditoriumName: string
  startTimeUtc: string
  reservedSeats: SeatCoordinateDTO[]
  totalAmount: number
  status: TicketStatus | string
  createdAtUtc: string
}

export interface PaymentWebhookPayload {
  bookingReference: string
  transactionId: string
  status: string
}
