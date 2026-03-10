import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventCard } from './EventCard'
import { EventStatus, UserRole } from '@/types/enum'
import { useAuthStore } from '@/store/auth.store'
import { useDeleteEvent } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/events/hooks/useEvents', () => ({
  useDeleteEvent: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

const mockEvent: any = {
  id: 1,
  title: 'Music Festival',
  location: 'Grand Arena',
  status: EventStatus.PUBLISHED,
  startDate: new Date(Date.now() + 86400000).toISOString(),
  priceRange: '$10 - $50',
  organizerName: 'Organizer X',
  ticketTiers: [{ totalAllocation: 100, availableAllocation: 50 }],
}

describe('EventCard', () => {
  const mockDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({ user: { role: UserRole.USER } })
    ;(useDeleteEvent as any).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    })
  })

  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} />, { wrapper: createWrapper() })

    expect(screen.getByText('Music Festival')).toBeInTheDocument()
    expect(screen.getByText('Grand Arena')).toBeInTheDocument()
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument()
    expect(screen.getByText('$10 - $50')).toBeInTheDocument()
    expect(screen.getByText('50% left')).toBeInTheDocument()
  })

  it('shows "Sold Out" when no tickets are available', () => {
    const soldOutEvent = {
      ...mockEvent,
      ticketTiers: [{ totalAllocation: 100, availableAllocation: 0 }],
    }
    render(<EventCard event={soldOutEvent} />, { wrapper: createWrapper() })

    expect(screen.getAllByText('Sold Out').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Sold Out/i })).toBeDisabled()
  })

  it('renders "Manage" button for owner', () => {
    render(<EventCard event={mockEvent} isOwner={true} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Manage')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Book Ticket/i }),
    ).not.toBeInTheDocument()
  })

  it('opens delete dialog and calls deleteEvent on confirmation', () => {
    render(<EventCard event={mockEvent} isOwner={true} />, {
      wrapper: createWrapper(),
    })

    // Find trash icon button
    const deleteButton = screen
      .getByRole('button', { name: '' })
      .parentElement?.querySelector('.lucide-trash2')?.parentElement
    fireEvent.click(deleteButton!)

    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Delete Event'))
    expect(mockDelete).toHaveBeenCalledWith(1)
  })

  it('highlights availability in red when < 20%', () => {
    const lowStockEvent = {
      ...mockEvent,
      ticketTiers: [{ totalAllocation: 100, availableAllocation: 10 }],
    }
    render(<EventCard event={lowStockEvent} />, { wrapper: createWrapper() })

    const statusText = screen.getByText('10% left')
    expect(statusText).toHaveClass('text-red-400')
  })
})
