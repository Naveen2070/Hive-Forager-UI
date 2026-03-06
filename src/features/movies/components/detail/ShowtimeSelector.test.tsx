import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ShowtimeSelector } from './ShowtimeSelector'
import { useShowtimesByMovie } from '@/features/showtimes/hooks/useShowTimes'
import { useAuditoriums } from '@/features/auditoriums/hooks/useAuditoriums'
import { useCinemas } from '@/features/cinemas/hooks/useCinemas'

// Mock dependencies
vi.mock('@/features/showtimes/hooks/useShowTimes', () => ({
  useShowtimesByMovie: vi.fn(),
}))
vi.mock('@/features/auditoriums/hooks/useAuditoriums', () => ({
  useAuditoriums: vi.fn(),
}))
vi.mock('@/features/cinemas/hooks/useCinemas', () => ({
  useCinemas: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
}))

describe('ShowtimeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeletons when data is loading', () => {
    ;(useShowtimesByMovie as any).mockReturnValue({ isLoading: true })
    ;(useAuditoriums as any).mockReturnValue({ isLoading: false })
    ;(useCinemas as any).mockReturnValue({ isLoading: false })

    const { container } = render(<ShowtimeSelector movieId="1" />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(2)
  })

  it('renders error state when showtimes fetch fails', () => {
    ;(useShowtimesByMovie as any).mockReturnValue({ isError: true, isLoading: false })
    ;(useAuditoriums as any).mockReturnValue({ data: [], isLoading: false })
    ;(useCinemas as any).mockReturnValue({ data: [], isLoading: false })

    render(<ShowtimeSelector movieId="1" />)
    expect(screen.getByText('Ticketing Unavailable')).toBeInTheDocument()
  })

  it('renders empty state when no showtimes are found', () => {
    ;(useShowtimesByMovie as any).mockReturnValue({ data: { content: [] }, isLoading: false })
    ;(useAuditoriums as any).mockReturnValue({ data: [], isLoading: false })
    ;(useCinemas as any).mockReturnValue({ data: [], isLoading: false })

    render(<ShowtimeSelector movieId="1" />)
    expect(screen.getByText('No Showtimes Available')).toBeInTheDocument()
  })

  it('groups and renders showtimes by cinema and auditorium', () => {
    const mockShowtimes = [
      { id: 's1', auditoriumId: 'a1', startTimeUtc: '2023-10-27T14:00:00Z', basePrice: 10 },
      { id: 's2', auditoriumId: 'a1', startTimeUtc: '2023-10-27T17:00:00Z', basePrice: 12 },
    ]
    const mockAuditoriums = [
      { id: 'a1', name: 'Screen 1', cinemaId: 'c1' },
    ]
    const mockCinemas = {
      content: [
        { id: 'c1', name: 'Grand Cinema', location: 'Downtown' },
      ],
    }

    ;(useShowtimesByMovie as any).mockReturnValue({ data: { content: mockShowtimes }, isLoading: false })
    ;(useAuditoriums as any).mockReturnValue({ data: mockAuditoriums, isLoading: false })
    ;(useCinemas as any).mockReturnValue({ data: mockCinemas, isLoading: false })

    render(<ShowtimeSelector movieId="1" />)

    expect(screen.getByText('Grand Cinema')).toBeInTheDocument()
    expect(screen.getByText('Downtown')).toBeInTheDocument()
    expect(screen.getByText('Screen 1')).toBeInTheDocument()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText('$12.00')).toBeInTheDocument()
  })

  it('shows organizer actions when isOrganizer is true', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const mockShowtimes = [
      { id: 's1', auditoriumId: 'a1', startTimeUtc: '2023-10-27T14:00:00Z', basePrice: 10 },
    ]
    const mockAuditoriums = [{ id: 'a1', name: 'Screen 1', cinemaId: 'c1' }]
    const mockCinemas = [{ id: 'c1', name: 'Grand Cinema', location: 'Downtown' }]

    ;(useShowtimesByMovie as any).mockReturnValue({ data: { content: mockShowtimes }, isLoading: false })
    ;(useAuditoriums as any).mockReturnValue({ data: mockAuditoriums, isLoading: false })
    ;(useCinemas as any).mockReturnValue({ data: mockCinemas, isLoading: false })

    const { container } = render(
      <ShowtimeSelector 
        movieId="1" 
        isOrganizer={true} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )

    const buttons = container.querySelectorAll('button')
    // 2 buttons per showtime + maybe pagination buttons if they existed
    expect(buttons.length).toBe(2)
    
    fireEvent.click(buttons[0]) // edit
    expect(onEdit).toHaveBeenCalled()
    
    fireEvent.click(buttons[1]) // delete
    expect(onDelete).toHaveBeenCalledWith('s1')
  })
})
