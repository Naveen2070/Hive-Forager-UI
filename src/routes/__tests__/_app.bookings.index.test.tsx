import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from '../_app.bookings.index'
import { useMyBookings } from '@/features/bookings/hooks/useMyBookings'
import { useMyTickets } from '@/features/tickets/hooks/useTickets'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/bookings/hooks/useMyBookings', () => ({
  useMyBookings: vi.fn(),
}))

vi.mock('@/features/tickets/hooks/useTickets', () => ({
  useMyTickets: vi.fn(),
}))

vi.mock('@/features/bookings/components/TicketCard', () => ({
  TicketCard: ({ booking }: any) => (
    <div data-testid="event-card">{booking.eventTitle}</div>
  ),
}))

vi.mock('@/features/tickets/components/MovieTicketCard', () => ({
  MovieTicketCard: ({ ticket }: any) => (
    <div data-testid="movie-card">{ticket.movieTitle}</div>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('MyBookings Page Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Your wallet is empty" when no data is returned', async () => {
    ;(useMyBookings as any).mockReturnValue({
      data: { content: [] },
      isLoading: false,
    })
    ;(useMyTickets as any).mockReturnValue({ data: [], isLoading: false })

    const MyBookingsPage = (Route as any).options.component
    await act(async () => {
      render(<MyBookingsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Your wallet is empty/i)).toBeInTheDocument()
  })

  it('renders mixed events and movies in active list', async () => {
    // Set a fixed date to ensure isUpcoming logic works
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'))

    const mockBookings = {
      content: [
        {
          bookingReference: 'REF1',
          eventTitle: 'Music Festival',
          eventDate: '2025-01-02T10:00:00Z',
          eventEndDate: '2025-01-02T20:00:00Z',
          status: 'CONFIRMED',
        },
      ],
    }
    const mockTickets = [
      {
        ticketId: 'T1',
        movieTitle: 'Interstellar',
        startTimeUtc: '2025-01-01T15:00:00Z',
        status: 'CONFIRMED',
      },
    ]

    ;(useMyBookings as any).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    })
    ;(useMyTickets as any).mockReturnValue({
      data: mockTickets,
      isLoading: false,
    })

    const MyBookingsPage = (Route as any).options.component
    await act(async () => {
      render(<MyBookingsPage />, { wrapper: createWrapper() })
    })

    // Check for presence of the mocked cards
    expect(await screen.findByTestId('event-card')).toBeInTheDocument()
    expect(await screen.findByTestId('movie-card')).toBeInTheDocument()
    expect(screen.getByText(/Active/i)).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('filters items into history view correctly', async () => {
    // Provide at least one past item so we don't hit the empty state
    const mockBookings = {
      content: [
        {
          bookingReference: 'OLD1',
          eventTitle: 'Past Concert',
          eventDate: '2020-01-01T10:00:00Z',
          eventEndDate: '2020-01-01T20:00:00Z',
          status: 'CONFIRMED',
        },
      ],
    }
    ;(useMyBookings as any).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    })
    ;(useMyTickets as any).mockReturnValue({ data: [], isLoading: false })

    const MyBookingsPage = (Route as any).options.component
    await act(async () => {
      render(<MyBookingsPage />, { wrapper: createWrapper() })
    })

    const historyButton = await screen.findByRole('button', {
      name: /History/i,
    })
    await act(async () => {
      fireEvent.click(historyButton)
    })

    expect(await screen.findByText(/Past Concert/i)).toBeInTheDocument()
  })
})
