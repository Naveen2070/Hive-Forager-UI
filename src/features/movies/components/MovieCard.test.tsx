import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MovieCard } from './MovieCard'

// Mocking Tanstack Router Link
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className} data-testid="router-link">
      {children}
    </a>
  ),
}))

describe('MovieCard', () => {
  const mockMovie = {
    id: '1',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space.',
    durationMinutes: 169,
    releaseDate: '2014-11-07T00:00:00Z',
    posterUrl: 'https://example.com/interstellar.jpg',
  }

  it('renders movie details correctly', () => {
    render(<MovieCard movie={mockMovie as any} />)

    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText(/A team of explorers/)).toBeInTheDocument()
    expect(screen.getByText('169 min')).toBeInTheDocument()
    expect(screen.getByAltText('Interstellar Poster')).toHaveAttribute(
      'src',
      mockMovie.posterUrl,
    )
    expect(screen.getByText(/Nov 7, 2014/)).toBeInTheDocument()
  })

  it('renders fallback when no poster is provided', () => {
    const movieNoPoster = { ...mockMovie, posterUrl: '' }
    render(<MovieCard movie={movieNoPoster as any} />)

    expect(screen.getByText('No Poster')).toBeInTheDocument()
  })

  it('shows organizer actions when isOrganizer is true', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    const { container } = render(
      <MovieCard
        movie={mockMovie as any}
        isOrganizer={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    // Note: Lucide icons are usually SVG elements, so we look for buttons.
    // Lucide components are often replaced with simpler SVG tags in testing.
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(2)

    fireEvent.click(buttons[0]) // edit button
    expect(onEdit).toHaveBeenCalledWith(mockMovie)

    fireEvent.click(buttons[1]) // delete button
    expect(onDelete).toHaveBeenCalledWith(mockMovie.id, mockMovie.title)
  })

  it('hides organizer actions when isOrganizer is false', () => {
    const { container } = render(
      <MovieCard movie={mockMovie as any} isOrganizer={false} />,
    )
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(0)
  })
})
