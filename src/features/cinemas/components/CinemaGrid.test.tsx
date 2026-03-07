import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CinemaGrid } from './CinemaGrid'
import { createWrapper } from '@/test/utils'

vi.mock('./CinemaCard', () => ({
  CinemaCard: ({ cinema }: any) => (
    <div data-testid="cinema-card">{cinema.name}</div>
  ),
}))

const mockCinemas: any[] = [
  { id: '1', name: 'Cinema 1' },
  { id: '2', name: 'Cinema 2' },
]

describe('CinemaGrid', () => {
  it('renders loading skeletons when isLoading is true', () => {
    const { container } = render(
      <CinemaGrid
        cinemas={[]}
        isLoading={true}
        isOwner={false}
        emptyMessage="No cinemas found"
      />,
    )

    // Skeleton components should be rendered (3 based on code)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders empty message when cinemas array is empty', () => {
    render(
      <CinemaGrid
        cinemas={[]}
        isLoading={false}
        isOwner={false}
        emptyMessage="Custom empty message"
      />,
    )

    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  it('renders grid of CinemaCards when data is present', () => {
    render(
      <CinemaGrid
        cinemas={mockCinemas}
        isLoading={false}
        isOwner={false}
        emptyMessage="No cinemas"
      />,
      { wrapper: createWrapper() },
    )

    const cards = screen.getAllByTestId('cinema-card')
    expect(cards.length).toBe(2)
    expect(screen.getByText('Cinema 1')).toBeInTheDocument()
    expect(screen.getByText('Cinema 2')).toBeInTheDocument()
  })
})
