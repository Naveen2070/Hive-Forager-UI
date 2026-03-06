import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieHero } from './MovieHero'

describe('MovieHero', () => {
  const mockMovie = {
    id: '1',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space.',
    durationMinutes: 169,
    releaseDate: '2014-11-07T00:00:00Z',
    posterUrl: 'https://example.com/poster.jpg',
  }

  it('renders movie title, duration and release date', () => {
    render(<MovieHero movie={mockMovie as any} />)
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText('169 min')).toBeInTheDocument()
    expect(screen.getByText('November 7, 2014')).toBeInTheDocument()
  })

  it('renders synopsis title and description', () => {
    render(<MovieHero movie={mockMovie as any} />)
    expect(screen.getByText('Synopsis')).toBeInTheDocument()
    expect(screen.getByText(mockMovie.description)).toBeInTheDocument()
  })

  it('renders poster image when posterUrl is provided', () => {
    render(<MovieHero movie={mockMovie as any} />)
    const img = screen.getByAltText('Interstellar Poster')
    expect(img).toHaveAttribute('src', mockMovie.posterUrl)
  })

  it('renders "No Poster Available" when posterUrl is missing', () => {
    const movieNoPoster = { ...mockMovie, posterUrl: '' }
    render(<MovieHero movie={movieNoPoster as any} />)
    expect(screen.getByText('No Poster Available')).toBeInTheDocument()
  })
})
