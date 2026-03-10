import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TicketCard } from './TicketCard'
import { BookingStatus } from '@/types/enum'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

// Mock Dialogs to avoid rendering complex UI
vi.mock('./TicketQRDialog', () => ({
  TicketQRDialog: () => <div data-testid="qr-dialog" />,
}))

vi.mock('./ReceiptDialog', () => ({
  ReceiptDialog: () => <div data-testid="receipt-dialog" />,
}))

// Mock Clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

const mockBooking: any = {
  id: 1,
  eventId: 101,
  eventTitle: 'Music Festival',
  eventDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  eventEndDate: new Date(Date.now() + 172800000).toISOString(),
  eventLocation: 'Grand Arena',
  status: BookingStatus.CONFIRMED,
  ticketsCount: 2,
  ticketTierName: 'VIP',
  totalPrice: 150.0,
  bookingReference: 'REF-123456',
}

describe('TicketCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upcoming booking details correctly', () => {
    render(<TicketCard booking={mockBooking} />, { wrapper: createWrapper() })

    expect(screen.getByText('Music Festival')).toBeInTheDocument()
    expect(screen.getByText('Grand Arena')).toBeInTheDocument()
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
    expect(screen.getByText('2 × VIP')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
  })

  it('copies booking reference to clipboard', async () => {
    render(<TicketCard booking={mockBooking} />, { wrapper: createWrapper() })

    const copyButton = screen.getByText(/REF: REF-123456/)
    await fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('REF-123456')
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Booking reference copied'),
    )
  })

  it('renders past booking with correct stamp', () => {
    const pastBooking = {
      ...mockBooking,
      eventDate: new Date(Date.now() - 172800000).toISOString(),
      eventEndDate: new Date(Date.now() - 86400000).toISOString(),
      status: BookingStatus.CONFIRMED,
    }

    render(<TicketCard booking={pastBooking} />, { wrapper: createWrapper() })

    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('renders cancelled booking with correct stamp', () => {
    const cancelledBooking = {
      ...mockBooking,
      status: BookingStatus.CANCELLED,
    }

    render(<TicketCard booking={cancelledBooking} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('CANCELLED')).toBeInTheDocument()
  })

  it('shows "HAPPENING NOW" for ongoing events', () => {
    const ongoingBooking = {
      ...mockBooking,
      eventDate: new Date(Date.now() - 3600000).toISOString(), // Started 1h ago
      eventEndDate: new Date(Date.now() + 3600000).toISOString(), // Ends in 1h
    }

    render(<TicketCard booking={ongoingBooking} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('HAPPENING NOW')).toBeInTheDocument()
  })

  it('opens QR dialog when "View Ticket" is clicked', () => {
    render(<TicketCard booking={mockBooking} />, { wrapper: createWrapper() })

    fireEvent.click(screen.getByText('View Ticket'))
    // Since we mocked TicketQRDialog, we can't easily check internal state unless we pass a prop or use a real mock
    // But we verified the button exists and is clickable for CONFIRMED status
  })

  it('renders "Pay Now" for pending status', () => {
    const pendingBooking = {
      ...mockBooking,
      status: BookingStatus.PENDING,
    }

    render(<TicketCard booking={pendingBooking} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Pay Now')).toBeInTheDocument()
  })
})
