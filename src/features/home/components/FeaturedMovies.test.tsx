import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeaturedMovies } from './FeaturedMovies'
import { createWrapper } from '@/test/utils'
import { useQuery } from '@tanstack/react-query'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return { ...actual, useQuery: vi.fn() }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('FeaturedMovies Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeletons initially', () => {
    ;(useQuery as any).mockReturnValue({ data: null, isLoading: true })
    const { container } = render(<FeaturedMovies />, {
      wrapper: createWrapper(),
    })

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders a list of movies when data is loaded', async () => {
    const mockMovies = [
      {
        id: '1',
        title: 'Interstellar',
        releaseDate: '2025-01-01T20:00:00Z',
        durationMinutes: 169,
      },
    ]
    ;(useQuery as any).mockReturnValue({ data: mockMovies, isLoading: false })

    render(<FeaturedMovies />, { wrapper: createWrapper() })

    expect(screen.getByText('Now Showing')).toBeInTheDocument()
    expect(screen.getAllByText('Interstellar').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/169 mins/i).length).toBeGreaterThan(0)
    // Check for badge for long movies
    expect(screen.getAllByText(/Epic Length/i).length).toBeGreaterThan(0)
  })
})
