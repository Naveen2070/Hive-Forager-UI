import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieReceiptDialog } from './MovieReceiptDialog'
import { TicketStatus } from '@/types/enum'
import { createWrapper } from '@/test/utils'

const mockTicket: any = {
  movieTitle: 'Interstellar',
  startTimeUtc: new Date('2025-01-01T10:00:00Z').toISOString(),
  bookingReference: 'REF-123',
  cinemaName: 'Hive IMAX',
  auditoriumName: 'Hall 1',
  reservedSeats: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  totalAmount: 30.0,
  status: TicketStatus.CONFIRMED,
  createdAtUtc: new Date().toISOString(),
}

describe('MovieReceiptDialog', () => {
  it('renders receipt details correctly when open', () => {
    render(
      <MovieReceiptDialog
        ticket={mockTicket}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Movie Receipt')).toBeInTheDocument()
    expect(screen.getByText('Reference #REF-123')).toBeInTheDocument()
    expect(screen.getByText('Payment Successful')).toBeInTheDocument()
    expect(screen.getByText('Seats (x2)')).toBeInTheDocument()
    expect(screen.getAllByText('$30.00').length).toBeGreaterThan(0)
  })

  it('does not render when isOpen is false', () => {
    render(
      <MovieReceiptDialog
        ticket={mockTicket}
        isOpen={false}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByText('Movie Receipt')).not.toBeInTheDocument()
  })
})
