import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BookingCard } from './BookingCard'
import { useAuthStore } from '@/store/auth.store'
import { useCreateBooking } from '../hooks/useCreateBooking'
import { createWrapper } from '@/test/utils'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('../hooks/useCreateBooking', () => ({
  useCreateBooking: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

const mockEvent: any = {
  id: 1,
  organizerId: 'org-1',
  startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
  ticketTiers: [
    { id: 101, name: 'General', price: 10, availableAllocation: 10 },
    { id: 102, name: 'VIP', price: 50, availableAllocation: 5 },
    { id: 103, name: 'Sold Out', price: 100, availableAllocation: 0 },
  ],
}

describe('BookingCard', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({ user: { id: 'user-1' } })
    ;(useCreateBooking as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  it('renders and auto-selects the first available tier', () => {
    render(<BookingCard event={mockEvent} />, { wrapper: createWrapper() })

    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText('1 x General')).toBeInTheDocument()
  })

  it('updates total price when quantity changes', () => {
    render(<BookingCard event={mockEvent} />, { wrapper: createWrapper() })

    // Find the button within the quantity selector area
    const buttons = screen.getAllByRole('button')
    // The plus button is the one after the quantity display '1'
    const plusButton = buttons.find((b) => b.querySelector('.lucide-plus'))
    fireEvent.click(plusButton!)

    expect(screen.getByText('$20.00')).toBeInTheDocument()
    expect(screen.getByText('2 x General')).toBeInTheDocument()
  })

  it('restricts quantity to available allocation', () => {
    const limitedEvent = {
      ...mockEvent,
      ticketTiers: [
        { id: 101, name: 'Rare', price: 10, availableAllocation: 2 },
      ],
    }
    render(<BookingCard event={limitedEvent} />, { wrapper: createWrapper() })

    const buttons = screen.getAllByRole('button')
    const plusButton = buttons.find((b) => b.querySelector('.lucide-plus'))
    fireEvent.click(plusButton!) // 2
    fireEvent.click(plusButton!) // Should stay at 2

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('switches tiers and resets quantity', () => {
    render(<BookingCard event={mockEvent} />, { wrapper: createWrapper() })

    // Select VIP
    fireEvent.click(screen.getByText('VIP'))

    expect(screen.getByText('$50.00')).toBeInTheDocument()
    expect(screen.getByText('1 x VIP')).toBeInTheDocument()
  })

  it('calls mutate on book button click', () => {
    render(<BookingCard event={mockEvent} />, { wrapper: createWrapper() })

    fireEvent.click(screen.getByRole('button', { name: /Book Ticket/i }))

    expect(mockMutate).toHaveBeenCalledWith({
      eventId: 1,
      ticketTierId: 101,
      ticketsCount: 1,
    })
  })

  it('renders "Manage Event" for the organizer', () => {
    ;(useAuthStore as any).mockReturnValue({ user: { id: 'org-1' } })
    render(<BookingCard event={mockEvent} />, { wrapper: createWrapper() })

    expect(screen.getByText('Manage Event')).toBeInTheDocument()
  })

  it('shows "Sold Out" state if all tiers are empty', () => {
    const soldOutEvent = {
      ...mockEvent,
      ticketTiers: [
        { id: 101, name: 'None', price: 10, availableAllocation: 0 },
      ],
    }
    render(<BookingCard event={soldOutEvent} />, { wrapper: createWrapper() })

    expect(screen.getByText('Event sold out.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sold Out/i })).toBeDisabled()
  })

  it('shows "Event Ended" for past events', () => {
    const pastEvent = {
      ...mockEvent,
      startDate: new Date(Date.now() - 172800000).toISOString(),
      endDate: new Date(Date.now() - 86400000).toISOString(),
    }
    render(<BookingCard event={pastEvent} />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: /Event Ended/i })).toBeDisabled()
  })
})
