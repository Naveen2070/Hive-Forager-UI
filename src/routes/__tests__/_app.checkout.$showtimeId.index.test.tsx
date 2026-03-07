import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutPage } from '../_app.checkout.$showtimeId.index'
import { useSeatMap } from '@/features/showtimes/hooks/useShowTimes'
import { useReserveTickets } from '@/features/tickets/hooks/useTickets'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/showtimes/hooks/useShowTimes', () => ({
  useSeatMap: vi.fn(),
}))

vi.mock('@/features/tickets/hooks/useTickets', () => ({
  useReserveTickets: vi.fn(),
}))

vi.mock('@/features/showtimes/components/seatmap/SeatSelectionBoard', () => ({
  SeatSelectionBoard: () => <div data-testid="seat-board" />,
}))

vi.mock('@/features/showtimes/components/seatmap/CheckoutSidebar', () => ({
  CheckoutSidebar: ({ onCheckout }: any) => (
    <div data-testid="checkout-sidebar">
      <button onClick={onCheckout}>Checkout</button>
    </div>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  useParams: () => ({ showtimeId: 'show-1' }),
  useNavigate: () => vi.fn(),
}))

describe('CheckoutPage Route', () => {
  const mockSeatMapData = {
    movieTitle: 'Interstellar',
    cinemaName: 'Hive',
    auditoriumName: 'Hall 1',
    maxRows: 5,
    maxColumns: 5,
    seatMap: [],
    tiers: [],
    basePrice: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSeatMap as any).mockReturnValue({
      data: mockSeatMapData,
      isLoading: false,
      isError: false,
    })
    ;(useReserveTickets as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
  })

  it('renders party size selector and components', async () => {
    await act(async () => {
      render(<CheckoutPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Party Size/i)).toBeInTheDocument()
    expect(screen.getByTestId('seat-board')).toBeInTheDocument()
    expect(screen.getByTestId('checkout-sidebar')).toBeInTheDocument()
  })

  it('updates ticket count when plus/minus clicked', async () => {
    await act(async () => {
      render(<CheckoutPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText('2')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    const plusBtn = buttons.find((b) => b.querySelector('.lucide-plus'))
    await act(async () => {
      fireEvent.click(plusBtn!)
    })

    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
