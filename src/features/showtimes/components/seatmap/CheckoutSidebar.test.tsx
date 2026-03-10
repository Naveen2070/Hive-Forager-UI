import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutSidebar } from './CheckoutSidebar'
import { usePayment } from '@/features/checkout/hooks/usePayment'

vi.mock('@/features/checkout/hooks/usePayment', () => ({
  usePayment: vi.fn(),
}))

vi.mock('@/features/checkout/components/PaymentForm', () => ({
  PaymentForm: ({ onSubmit, amount, error }: any) => (
    <div data-testid="mock-payment-form">
      <span>Amount: ${amount}</span>
      {error && <span>{error}</span>}
      <button onClick={() => onSubmit({ name: 'Test' })}>Submit</button>
    </div>
  ),
}))

const mockProps: any = {
  movieTitle: 'Interstellar',
  cinemaName: 'Hive IMAX',
  auditoriumName: 'Hall 1',
  basePrice: 10,
  tiers: [{ priceSurcharge: 5, seats: [{ row: 0, col: 0 }] }],
  selectedSeats: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  onCheckout: vi.fn(),
  isPending: false,
}

describe('CheckoutSidebar', () => {
  const mockProcessPayment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(usePayment as any).mockReturnValue({
      processPayment: mockProcessPayment,
      isProcessing: false,
    })
  })

  it('renders order summary correctly', () => {
    render(<CheckoutSidebar {...mockProps} />)

    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText(/Hive IMAX - Hall 1/i)).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
    // 2 tickets at 10 + 1 surcharge of 5 = 25
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('transitions to payment form when proceed button is clicked', () => {
    render(<CheckoutSidebar {...mockProps} />)

    fireEvent.click(screen.getByText('Proceed to Payment'))

    expect(screen.getByTestId('mock-payment-form')).toBeInTheDocument()
    expect(screen.getByText('Amount: $25')).toBeInTheDocument()
  })

  it('calls onCheckout when payment is successful', async () => {
    mockProcessPayment.mockResolvedValue({ success: true })
    render(<CheckoutSidebar {...mockProps} />)

    fireEvent.click(screen.getByText('Proceed to Payment'))
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => expect(mockProps.onCheckout).toHaveBeenCalled())
  })

  it('shows error when payment fails', async () => {
    mockProcessPayment.mockResolvedValue({
      success: false,
      error: 'Payment failed',
    })
    render(<CheckoutSidebar {...mockProps} />)

    fireEvent.click(screen.getByText('Proceed to Payment'))
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() =>
      expect(screen.getByText('Payment failed')).toBeInTheDocument(),
    )
  })
})
