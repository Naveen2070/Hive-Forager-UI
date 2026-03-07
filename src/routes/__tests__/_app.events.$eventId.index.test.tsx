import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventDetailsPage } from '../_app.events.$eventId.index'
import { useEventDetail } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/events/hooks/useEvents', () => ({
  useEventDetail: vi.fn(),
}))

vi.mock('@/features/events/components/detail/EventHero', () => ({
  EventHero: () => <div data-testid="event-hero" />,
}))

vi.mock('@/features/bookings/components/BookingCard', () => ({
  BookingCard: () => <div data-testid="booking-card" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  useParams: () => ({ eventId: '1' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('EventDetailsPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders event details, hero and booking card', async () => {
    const mockEvent = { id: 1, title: 'Music Fest', description: 'Fun times' }
    ;(useEventDetail as any).mockReturnValue({
      event: mockEvent,
      isLoading: false,
      isError: false,
    })

    await act(async () => {
      render(<EventDetailsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('event-hero')).toBeInTheDocument()
    expect(screen.getByTestId('booking-card')).toBeInTheDocument()
    expect(screen.getByText('Fun times')).toBeInTheDocument()
  })

  it('renders DataFallback on error', async () => {
    ;(useEventDetail as any).mockReturnValue({
      event: null,
      isLoading: false,
      isError: true,
    })

    await act(async () => {
      render(<EventDetailsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Event Not Found/i)).toBeInTheDocument()
  })
})
