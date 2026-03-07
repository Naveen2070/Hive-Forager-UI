import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeaturedEvents } from './FeaturedEvents'
import { createWrapper } from '@/test/utils'
import { useQuery } from '@tanstack/react-query'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return { ...actual, useQuery: vi.fn() }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('FeaturedEvents Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeletons initially', () => {
    ;(useQuery as any).mockReturnValue({ data: null, isLoading: true })
    const { container } = render(<FeaturedEvents />, {
      wrapper: createWrapper(),
    })

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders a list of events when data is loaded', async () => {
    const mockEvents = {
      content: [
        {
          id: 1,
          title: 'Rock Concert',
          startDate: '2025-01-01T20:00:00Z',
          location: 'Arena',
          priceRange: '$20-$50',
        },
      ],
    }
    ;(useQuery as any).mockReturnValue({ data: mockEvents, isLoading: false })

    render(<FeaturedEvents />, { wrapper: createWrapper() })

    expect(screen.getByText('Trending Events')).toBeInTheDocument()
    // displayData duplicates items for infinite scroll, so we check for at least one
    expect(screen.getAllByText('Rock Concert').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Arena/i).length).toBeGreaterThan(0)
  })
})
