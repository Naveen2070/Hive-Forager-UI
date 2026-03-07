import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditEventPage } from '../_app.events.$eventId.edit'
import { useQuery } from '@tanstack/react-query'
import { useUpdateEvent } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return { ...actual, useQuery: vi.fn() }
})

vi.mock('@/features/events/hooks/useEvents', () => ({
  useUpdateEvent: vi.fn(),
}))

vi.mock('@/features/events/components/EventStatusCard', () => ({
  EventStatusCard: () => <div data-testid="status-card" />,
}))

vi.mock('@/features/events/components/ticket-tier/TicketTierManager', () => ({
  TicketTierManager: () => <div data-testid="tier-manager" />,
}))

vi.mock('@/features/events/components/CreateEventForm', () => ({
  CreateEventForm: ({ onSubmit }: any) => (
    <div data-testid="mock-form">
      <button
        onClick={() =>
          onSubmit({
            title: 'Updated',
            description: 'New Description',
            location: 'New Venue',
            startDate: '2025-01-01T10:00',
            endDate: '2025-01-01T12:00',
            organizerEmail: 'test@org.com',
            createdBy: '1',
            ticketTiers: [],
          })
        }
      >
        Save
      </button>
    </div>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  useParams: () => ({ eventId: '1' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('EditEventPage Route', () => {
  const mockUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useUpdateEvent as any).mockReturnValue({
      mutate: mockUpdate,
      isPending: false,
    })
  })

  it('renders all sections when data is loaded', async () => {
    const mockEvent = {
      id: 1,
      title: 'Old',
      description: 'Old desc',
      location: 'Old venue',
      startDate: '2025-01-01T10:00:00',
      endDate: '2025-01-01T12:00:00',
      status: 'DRAFT',
      organizerId: 1,
      organizerName: 'Org',
    }
    ;(useQuery as any).mockReturnValue({
      data: mockEvent,
      isLoading: false,
      isError: false,
    })

    await act(async () => {
      render(<EditEventPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Edit Event/i)).toBeInTheDocument()
    expect(screen.getByTestId('status-card')).toBeInTheDocument()
    expect(screen.getByTestId('mock-form')).toBeInTheDocument()
    expect(screen.getByTestId('tier-manager')).toBeInTheDocument()
  })

  it('calls updateEvent on form submit', async () => {
    const mockEvent = {
      id: 1,
      title: 'Old',
      description: 'Old desc',
      location: 'Old venue',
      startDate: '2025-01-01T10:00:00',
      endDate: '2025-01-01T12:00:00',
      status: 'DRAFT',
      organizerId: 1,
      organizerName: 'Org',
      ticketTiers: [],
    }
    ;(useQuery as any).mockReturnValue({
      data: mockEvent,
      isLoading: false,
      isError: false,
    })

    await act(async () => {
      render(<EditEventPage />, { wrapper: createWrapper() })
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Updated',
      }),
    )
  })
})
