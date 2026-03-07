import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EventGrid } from './EventGrid'
import { createWrapper } from '@/test/utils'

vi.mock('./EventCard', () => ({
  EventCard: ({ event }: any) => (
    <div data-testid="event-card">{event.title}</div>
  ),
}))

const mockEvents: any[] = [
  { id: 1, title: 'Event 1' },
  { id: 2, title: 'Event 2' },
]

describe('EventGrid', () => {
  it('renders loader when isLoading is true', () => {
    const { container } = render(
      <EventGrid isLoading={true} emptyMessage="No events" />,
    )
    const loader = container.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  it('renders empty message when data is empty', () => {
    render(
      <EventGrid
        isLoading={false}
        data={[]}
        emptyMessage="Custom empty message"
      />,
    )

    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  it('renders grid of EventCards when data is present', () => {
    render(
      <EventGrid
        isLoading={false}
        data={mockEvents}
        emptyMessage="No events"
      />,
      { wrapper: createWrapper() },
    )

    const cards = screen.getAllByTestId('event-card')
    expect(cards.length).toBe(2)
    expect(screen.getByText('Event 1')).toBeInTheDocument()
    expect(screen.getByText('Event 2')).toBeInTheDocument()
  })
})
