import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MovieTicketCard } from './MovieTicketCard'
import { TicketStatus } from '@/types/enum'
import { createWrapper } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

// Mock Dialogs
vi.mock('./MovieTicketQRDialog', () => ({
  MovieTicketQRDialog: () => <div data-testid="qr-dialog" />,
}))
vi.mock('./MovieReceiptDialog', () => ({
  MovieReceiptDialog: () => <div data-testid="receipt-dialog" />,
}))

const mockTicket: any = {
  id: '1',
  movieTitle: 'Interstellar',
  cinemaName: 'Hive IMAX',
  auditoriumName: 'Hall 1',
  startTimeUtc: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  status: TicketStatus.CONFIRMED,
  totalAmount: 15.0,
  bookingReference: 'REF-123',
  reservedSeats: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
}

describe('MovieTicketCard', () => {
  it('renders upcoming ticket details correctly', () => {
    render(<MovieTicketCard ticket={mockTicket} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText('Hive IMAX')).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
    expect(screen.getByText('View Ticket')).toBeInTheDocument()
  })

  it('renders "Pay Now" for pending status', () => {
    const pendingTicket = { ...mockTicket, status: TicketStatus.PENDING }
    render(<MovieTicketCard ticket={pendingTicket} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Pay Now')).toBeInTheDocument()
  })

  it('renders completed stamp for past tickets', () => {
    const pastTicket = {
      ...mockTicket,
      startTimeUtc: new Date(Date.now() - 172800000).toISOString(),
    }
    render(<MovieTicketCard ticket={pastTicket} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })
})
