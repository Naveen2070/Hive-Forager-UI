import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventsPage } from '../_app.events.index'
import { useEventQueries } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/events/hooks/useEvents', () => ({
  useEventQueries: vi.fn(),
}))

vi.mock('@/features/events/components/EventHeader', () => ({
  EventHeader: () => <div data-testid="event-header" />,
}))

vi.mock('@/features/events/components/EventFiltersBar', () => ({
  EventFiltersBar: () => <div data-testid="filters-bar" />,
}))

vi.mock('@/features/events/components/EventGrid', () => ({
  EventGrid: ({ data, emptyMessage }: any) => (
    <div data-testid="event-grid">
      {!data || data.length === 0 ? emptyMessage : `Count: ${data.length}`}
    </div>
  ),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, onValueChange }: any) => (
    <div
      onClick={(e: any) => {
        if (e.target.dataset.value) onValueChange(e.target.dataset.value)
      }}
    >
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}))

describe('EventsPage Route', () => {
  const mockPublicEvents = {
    data: { content: [], totalPages: 0 },
    isLoading: false,
    isError: false,
  }
  const mockMyEvents = {
    data: { content: [], totalPages: 0 },
    isLoading: false,
    isError: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useEventQueries as any).mockReturnValue({
      isOrganizer: true,
      filters: {},
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      publicEvents: mockPublicEvents,
      myEvents: mockMyEvents,
      page: 0,
      setPage: vi.fn(),
    })
  })

  it('renders "My Events" by default for organizer', async () => {
    await act(async () => {
      render(<EventsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText('My Events')).toBeInTheDocument()
    expect(
      screen.getByText(/You haven't hosted any events yet/i),
    ).toBeInTheDocument()
  })

  it('switches to Browse All tab', async () => {
    await act(async () => {
      render(<EventsPage />, { wrapper: createWrapper() })
    })

    const browseTab = screen.getByText('Browse All')
    await act(async () => {
      fireEvent.click(browseTab)
    })

    expect(
      screen.getByText(/No events found matching your search criteria/i),
    ).toBeInTheDocument()
  })
})
