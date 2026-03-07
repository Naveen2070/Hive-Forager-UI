import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TicketQRDialog } from './TicketQRDialog'
import { createWrapper } from '@/test/utils'

// Mock react-qr-code as it can be tricky to test in JSDOM
vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="mock-qr-code">{value}</div>
  ),
}))

const mockBooking: any = {
  eventTitle: 'Music Festival',
  eventDate: new Date('2025-01-01T10:00:00Z').toISOString(),
  bookingReference: 'REF-123456',
  ticketsCount: 2,
  ticketTierName: 'VIP',
  status: 'CONFIRMED',
}

describe('TicketQRDialog', () => {
  it('renders ticket details correctly when open', () => {
    render(
      <TicketQRDialog
        booking={mockBooking}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Music Festival')).toBeInTheDocument()
    expect(screen.getByText(/January 1st, 2025/i)).toBeInTheDocument()
    expect(screen.getByTestId('mock-qr-code')).toHaveTextContent('REF-123456')
    expect(screen.getByText('ADMIT 2')).toBeInTheDocument()
    expect(screen.getByText('VIP TICKET')).toBeInTheDocument()
    expect(screen.getAllByText(/REF-123456/i).length).toBeGreaterThan(0)
  })

  it('shows "ALREADY CHECKED IN" badge when status is CHECKED_IN', () => {
    const checkedInBooking = { ...mockBooking, status: 'CHECKED_IN' }
    render(
      <TicketQRDialog
        booking={checkedInBooking}
        isOpen={true}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('ALREADY CHECKED IN')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <TicketQRDialog
        booking={mockBooking}
        isOpen={false}
        onOpenChange={() => {}}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByText('Music Festival')).not.toBeInTheDocument()
  })
})
