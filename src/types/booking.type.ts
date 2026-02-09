import type { BookingStatus, ScanStatus } from '@/types/enum.ts'

export interface BookingDTO {
  bookingId: number
  bookingReference: string
  eventId: number
  eventTitle: string
  eventDescription: string
  eventDate: string
  eventEndDate: string
  eventLocation: string
  ticketTierName: string
  ticketsCount: number
  totalPrice: number
  status: BookingStatus
  bookedAt: string
}

export interface CheckInResponse {
  success: boolean
  status:
    | 'CHECKED_IN'
    | 'ALREADY_CHECKED_IN'
    | 'EXPIRED'
    | 'NOT_FOUND'
    | 'WRONG_DATE'
    | 'INVALID_STATUS'
    | 'NOT_AUTHORIZED'
  message: string
  attendeeName?: string
  ticketTierName?: string
  bookingReference?: string
}

export interface CreateBookingRequest {
  eventId: number
  ticketTierId: number
  ticketsCount: number
}

export interface ScanResultData {
  attendeeName?: string
  ticketTier?: string
  message?: string
  referenceId?: string
}

export interface ScanResultOverlayProps {
  status: ScanStatus
  data?: ScanResultData
  onReset: () => void
}
