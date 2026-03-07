import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroSection } from './HeroSection'
import { createWrapper } from '@/test/utils'
import { eventsApi } from '@/api/events'
import { moviesApi } from '@/api/movies'

vi.mock('@/api/events', () => ({
  eventsApi: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/api/movies', () => ({
  moviesApi: {
    getAllMovies: vi.fn(),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders text and CTA buttons', () => {
    vi.mocked(eventsApi.getAll).mockResolvedValue({ content: [] } as any)
    vi.mocked(moviesApi.getAllMovies).mockResolvedValue({ content: [] } as any)

    render(<HeroSection />, { wrapper: createWrapper() })

    expect(screen.getByText(/Unforgettable/i)).toBeInTheDocument()
    expect(screen.getByText('Browse Events')).toBeInTheDocument()
    expect(screen.getByText('View Movies')).toBeInTheDocument()
  })

  it('renders featured event and movie cards when data is available', async () => {
    const mockEvent = {
      id: 1,
      title: 'Big Concert',
      startDate: new Date().toISOString(),
      location: 'Venue',
    }
    const mockMovie = { id: 1, title: 'Epic Film', durationMinutes: 120 }

    vi.mocked(eventsApi.getAll).mockResolvedValue({
      content: [mockEvent],
    } as any)
    vi.mocked(moviesApi.getAllMovies).mockResolvedValue({
      content: [mockMovie],
    } as any)

    render(<HeroSection />, { wrapper: createWrapper() })

    expect(await screen.findByText('Big Concert')).toBeInTheDocument()
    expect(await screen.findByText('Epic Film')).toBeInTheDocument()
  })
})
