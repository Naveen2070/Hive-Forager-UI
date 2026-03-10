import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MovieTicketQRDialog } from './MovieTicketQRDialog'
import { createWrapper } from '@/test/utils'

vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="mock-qr-code">{value}</div>
  ),
}))

const mockTicket: any = {
  movieTitle: 'Interstellar',
  startTimeUtc: new Date('2025-01-01T10:00:00Z').toISOString(),
  bookingReference: 'REF-123',
  cinemaName: 'Hive IMAX',
  auditoriumName: 'Hall 1',
  reservedSeats: [{ row: 0, col: 0 }],
}

describe('MovieTicketQRDialog', () => {
  it('renders ticket details correctly when open', () => {
    render(
      <MovieTicketQRDialog
        ticket={mockTicket}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByTestId('mock-qr-code')).toHaveTextContent('REF-123')
    expect(screen.getByText(/Hive IMAX/i)).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <MovieTicketQRDialog
        ticket={mockTicket}
        isOpen={false}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByText('Interstellar')).not.toBeInTheDocument()
  })
})
