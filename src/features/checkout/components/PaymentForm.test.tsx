import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PaymentForm } from './PaymentForm'

describe('PaymentForm', () => {
  it('renders correctly with amount', () => {
    render(<PaymentForm amount={150} isProcessing={false} onSubmit={vi.fn()} />)

    expect(screen.getByText('Pay $150.00')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('4242 4242 4242 4242'),
    ).toBeInTheDocument()
  })

  it('formats card number with spaces', () => {
    render(<PaymentForm amount={100} isProcessing={false} onSubmit={vi.fn()} />)

    const input = screen.getByPlaceholderText('4242 4242 4242 4242')
    fireEvent.change(input, { target: { value: '4242424242424242' } })

    expect(input).toHaveValue('4242 4242 4242 4242')
  })

  it('formats expiry date with slash', () => {
    render(<PaymentForm amount={100} isProcessing={false} onSubmit={vi.fn()} />)

    const input = screen.getByPlaceholderText('MM / YY')
    fireEvent.change(input, { target: { value: '1225' } })

    expect(input).toHaveValue('12/25')
  })

  it('calls onSubmit with details when button is clicked', () => {
    const mockSubmit = vi.fn()
    render(
      <PaymentForm amount={100} isProcessing={false} onSubmit={mockSubmit} />,
    )

    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByPlaceholderText('MM / YY'), {
      target: { value: '1225' },
    })
    fireEvent.change(screen.getByPlaceholderText('CVC'), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Name on card'), {
      target: { value: 'John Doe' },
    })

    fireEvent.click(screen.getByRole('button'))

    expect(mockSubmit).toHaveBeenCalledWith({
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '12/25',
      cvc: '123',
      name: 'John Doe',
    })
  })

  it('shows error message if provided', () => {
    render(
      <PaymentForm
        amount={100}
        isProcessing={false}
        onSubmit={vi.fn()}
        error="Invalid card"
      />,
    )

    expect(screen.getByText('Invalid card')).toBeInTheDocument()
  })

  it('disables button when processing', () => {
    render(<PaymentForm amount={100} isProcessing={true} onSubmit={vi.fn()} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Processing Payment...')
  })
})
