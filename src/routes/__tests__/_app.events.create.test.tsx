import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateEventPage } from '../_app.events.create'
import { useAuthStore } from '@/store/auth.store'
import { useCreateEvent } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/events/hooks/useEvents', () => ({
  useCreateEvent: vi.fn(),
}))

vi.mock('@/features/events/components/CreateEventForm', () => ({
  CreateEventForm: ({ onSubmit }: any) => (
    <div data-testid="mock-form">
      <button
        onClick={() =>
          onSubmit({
            title: 'New Event',
            description: 'A very long description that passes validation',
            location: 'Venue',
            startDate: '2025-01-01T10:00',
            endDate: '2025-01-01T12:00',
            organizerEmail: 'test@org.com',
            createdBy: '1',
            ticketTiers: [],
          })
        }
      >
        Submit
      </button>
    </div>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('CreateEventPage Route', () => {
  const mockCreateEvent = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { id: 1, email: 'test@org.com' },
    })
    ;(useCreateEvent as any).mockReturnValue({
      mutate: mockCreateEvent,
      isPending: false,
    })
  })

  it('renders header and form', async () => {
    await act(async () => {
      render(<CreateEventPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Create New Event/i)).toBeInTheDocument()
    expect(screen.getByTestId('mock-form')).toBeInTheDocument()
  })

  it('formats dates and calls createEvent on submit', async () => {
    await act(async () => {
      render(<CreateEventPage />, { wrapper: createWrapper() })
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2025-01-01T10:00:00',
        endDate: '2025-01-01T12:00:00',
      }),
    )
  })
})
