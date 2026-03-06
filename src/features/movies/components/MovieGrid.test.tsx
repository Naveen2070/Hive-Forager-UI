import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MovieGrid } from './MovieGrid'

// Mock MovieCard to avoid testing it again and simplify
vi.mock('./MovieCard', () => ({
  MovieCard: ({ movie }: any) => <div data-testid="movie-card">{movie.title}</div>,
}))

describe('MovieGrid', () => {
  const mockMovies = [
    { id: '1', title: 'Movie 1', description: 'Desc 1', durationMinutes: 100, releaseDate: '2023-01-01' },
    { id: '2', title: 'Movie 2', description: 'Desc 2', durationMinutes: 120, releaseDate: '2023-02-01' },
  ]

  it('renders a grid of movie cards', () => {
    render(<MovieGrid movies={mockMovies as any} />)
    const cards = screen.getAllByTestId('movie-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Movie 2')).toBeInTheDocument()
  })

  it('renders empty state when no movies are provided', () => {
    render(<MovieGrid movies={[]} />)
    expect(screen.getByText('No movies found')).toBeInTheDocument()
    expect(screen.getByText('Check back later!')).toBeInTheDocument()
  })

  it('renders empty state when movies is null', () => {
    render(<MovieGrid movies={null as any} />)
    expect(screen.getByText('No movies found')).toBeInTheDocument()
  })
})
