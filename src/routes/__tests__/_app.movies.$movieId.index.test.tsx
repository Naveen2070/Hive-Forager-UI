import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MovieDetailsPage } from '../_app.movies.$movieId.index'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { useMovieDetail } from '@/features/movies/hooks/useMovies'
import {
  useCreateShowtime,
  useDeleteShowtime,
  useUpdateShowtime,
} from '@/features/showtimes/hooks/useShowTimes'
import { createWrapper } from '@/test/utils'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/movies/hooks/useMovies', () => ({
  useMovieDetail: vi.fn(),
}))

vi.mock('@/features/showtimes/hooks/useShowTimes', () => ({
  useCreateShowtime: vi.fn(),
  useUpdateShowtime: vi.fn(),
  useDeleteShowtime: vi.fn(),
}))

vi.mock('@/features/movies/components/detail/MovieHero', () => ({
  MovieHero: ({ movie }: any) => (
    <div data-testid="movie-hero">{movie.title}</div>
  ),
}))

vi.mock('@/features/movies/components/detail/ShowtimeSelector', () => ({
  ShowtimeSelector: () => <div data-testid="showtime-selector" />,
}))

vi.mock('@/features/showtimes/components/ShowtimeModal', () => ({
  ShowtimeModal: () => <div data-testid="showtime-modal" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  useParams: () => ({ movieId: 'movie-1' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('MovieDetailsPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { role: UserRole.ORGANIZER },
    })
    ;(useCreateShowtime as any).mockReturnValue({ isPending: false })
    ;(useUpdateShowtime as any).mockReturnValue({ isPending: false })
    ;(useDeleteShowtime as any).mockReturnValue({ mutate: vi.fn() })
  })

  it('renders movie hero and showtime selector', async () => {
    const mockMovie = { id: 'movie-1', title: 'Interstellar' }
    ;(useMovieDetail as any).mockReturnValue({
      data: mockMovie,
      isLoading: false,
      isError: false,
    })

    await act(async () => {
      render(<MovieDetailsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('movie-hero')).toHaveTextContent('Interstellar')
    expect(screen.getByTestId('showtime-selector')).toBeInTheDocument()
  })

  it('shows schedule button for organizer', async () => {
    ;(useMovieDetail as any).mockReturnValue({
      data: { title: 'X' },
      isLoading: false,
      isError: false,
    })

    await act(async () => {
      render(<MovieDetailsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Schedule Showtime/i)).toBeInTheDocument()
  })
})
