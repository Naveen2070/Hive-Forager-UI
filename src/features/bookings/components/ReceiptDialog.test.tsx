import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ReceiptDialog } from './ReceiptDialog'
import { createWrapper } from '@/test/utils'

// Mock window.print
window.print = vi.fn()

const mockBooking: any = {
  id: 1,
  bookingReference: 'REF-123',
  eventTitle: 'Test Event',
  eventDate: new Date().toISOString(),
  eventLocation: 'Test Location',
  status: 'CONFIRMED',
  ticketsCount: 2,
  totalPrice: 100,
  bookedAt: new Date().toISOString(),
  ticketTierName: 'General',
}

describe('ReceiptDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders receipt details correctly when open', () => {
    render(
      <ReceiptDialog
        booking={mockBooking}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Transaction Receipt')).toBeInTheDocument()
    expect(screen.getByText('Reference #REF-123')).toBeInTheDocument()
    expect(screen.getByText('Payment Successful')).toBeInTheDocument()
    expect(screen.getByText('General (x2)')).toBeInTheDocument()
    expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0)
  })

  it('calls window.print when Print button is clicked', () => {
    render(
      <ReceiptDialog
        booking={mockBooking}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByText('Print'))
    expect(window.print).toHaveBeenCalled()
  })

  it('renders correct status for CANCELLED', () => {
    const cancelledBooking = { ...mockBooking, status: 'CANCELLED' }
    render(
      <ReceiptDialog
        booking={cancelledBooking}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Booking Cancelled')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ReceiptDialog
        booking={mockBooking}
        isOpen={false}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByText('Transaction Receipt')).not.toBeInTheDocument()
  })
})
