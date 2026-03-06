import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { MovieCatalog } from './MovieCatalog'
import { useMovies } from '@/features/movies/hooks/useMovies'

// Mock dependencies
vi.mock('@/features/movies/hooks/useMovies', () => ({
  useMovies: vi.fn(),
}))

vi.mock('./MovieGrid', () => ({
  MovieGrid: ({ movies }: any) => (
    <div data-testid="movie-grid">
      {movies.map((m: any) => (
        <div key={m.id}>{m.title}</div>
      ))}
    </div>
  ),
}))

describe('MovieCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders loading skeletons when isLoading is true', () => {
    ;(useMovies as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    const { container } = render(<MovieCatalog />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(25) // Approx count of skeletons
  })

  it('renders error state when isError is true', () => {
    const refetch = vi.fn()
    ;(useMovies as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch,
    })

    render(<MovieCatalog />)
    expect(screen.getByText('Unable to load catalog')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/try again/i))
    expect(refetch).toHaveBeenCalled()
  })

  it('renders movie grid when data is available', () => {
    ;(useMovies as any).mockReturnValue({
      data: {
        content: [{ id: '1', title: 'Movie 1' }],
        totalPages: 1,
        pageable: { pageNumber: 0 },
        first: true,
        last: true,
      },
      isLoading: false,
      isError: false,
    })

    render(<MovieCatalog />)
    expect(screen.getByTestId('movie-grid')).toBeInTheDocument()
    expect(screen.getByText('Movie 1')).toBeInTheDocument()
  })

  it('handles search input with debounce', async () => {
    ;(useMovies as any).mockReturnValue({
      data: { content: [], totalPages: 0, pageable: { pageNumber: 0 } },
      isLoading: false,
      isError: false,
    })

    render(<MovieCatalog />)
    const input = screen.getByPlaceholderText(/search movies/i)
    
    fireEvent.change(input, { target: { value: 'Inception' } })
    
    // Should not have called useMovies with 'Inception' yet because of debounce
    expect(useMovies).not.toHaveBeenLastCalledWith(expect.anything(), expect.anything(), 'Inception')
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(useMovies).toHaveBeenCalledWith(0, 12, 'Inception')
  })

  it('handles pagination', () => {
    const mockData = {
      content: [{ id: '1', title: 'Movie 1' }],
      totalPages: 3,
      pageable: { pageNumber: 1 },
      first: false,
      last: false,
    }
    ;(useMovies as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    render(<MovieCatalog />)
    
    const prevButton = screen.getByText(/previous/i)
    const nextButton = screen.getByText(/next/i)
    
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
    
    fireEvent.click(nextButton)
    // React Query hook will be called with page 2 on re-render
    
    fireEvent.click(prevButton)
    // React Query hook will be called with page 0 on re-render
  })

  it('shows empty state when no search results found', () => {
    ;(useMovies as any).mockReturnValue({
      data: { content: [], totalPages: 0, pageable: { pageNumber: 0 } },
      isLoading: false,
      isError: false,
    })

    render(<MovieCatalog />)
    expect(screen.getByText(/No movies found matching/)).toBeInTheDocument()
    
    const clearButton = screen.getByText(/Clear search/i)
    fireEvent.click(clearButton)
    const input = screen.getByPlaceholderText(/search movies/i)
    expect((input as HTMLInputElement).value).toBe('')
  })
})
