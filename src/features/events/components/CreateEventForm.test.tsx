import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateEventForm } from './CreateEventForm'
import { createWrapper } from '@/test/utils'

// Mock TicketTiersField to simplify
vi.mock('./TicketTiersField', () => ({
  TicketTiersField: () => <div data-testid="ticket-tiers-field" />,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

const mockSubmit = vi.fn()

describe('CreateEventForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly for creation', () => {
    render(
      <CreateEventForm
        onSubmit={mockSubmit}
        isPending={false}
        organizerEmail="test@org.com"
        createdBy="user-1"
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByPlaceholderText(/Tech Conference/i)).toBeInTheDocument()
    expect(screen.getByTestId('ticket-tiers-field')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Create Event/i }),
    ).toBeInTheDocument()
  })

  it('renders correctly for editing (hides ticket tiers field)', () => {
    const initialData: any = {
      title: 'Existing Event',
      description:
        'Some long description that meets the 20 character minimum requirement.',
      location: 'Venue',
      startDate: '2025-01-01T10:00',
      endDate: '2025-01-01T12:00',
      organizerEmail: 'test@org.com',
      createdBy: 'user-1',
    }
    render(
      <CreateEventForm
        onSubmit={mockSubmit}
        isPending={false}
        organizerEmail="test@org.com"
        createdBy="user-1"
        initialData={initialData}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByDisplayValue('Existing Event')).toBeInTheDocument()
    expect(screen.queryByTestId('ticket-tiers-field')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Update Event/i }),
    ).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <CreateEventForm
        onSubmit={mockSubmit}
        isPending={false}
        organizerEmail="test@org.com"
        createdBy="user-1"
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }))

    expect(
      await screen.findByText(/Title must be at least 5 characters/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/Description must be at least 20 characters/i),
    ).toBeInTheDocument()
  })
})
