import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MoviesPage } from '../_app.movies.index'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { createWrapper } from '@/test/utils'
import {
  useCreateMovie,
  useDeleteMovie,
  useUpdateMovie,
} from '@/features/movies/hooks/useMovies'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/movies/hooks/useMovies', () => ({
  useCreateMovie: vi.fn(),
  useUpdateMovie: vi.fn(),
  useDeleteMovie: vi.fn(),
}))

vi.mock('@/features/movies/components/MovieCatalog', () => ({
  MovieCatalog: ({ isOrganizer }: any) => (
    <div data-testid="movie-catalog">
      {isOrganizer ? 'Organizer View' : 'Customer View'}
    </div>
  ),
}))

vi.mock('@/features/movies/components/MovieModal', () => ({
  MovieModal: () => <div data-testid="movie-modal" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('MoviesPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { role: UserRole.ORGANIZER },
    })
    ;(useCreateMovie as any).mockReturnValue({ isPending: false })
    ;(useUpdateMovie as any).mockReturnValue({ isPending: false })
    ;(useDeleteMovie as any).mockReturnValue({ mutate: vi.fn() })
  })

  it('renders "Now Showing" and catalog', async () => {
    await act(async () => {
      render(<MoviesPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Now Showing/i)).toBeInTheDocument()
    expect(screen.getByTestId('movie-catalog')).toBeInTheDocument()
  })

  it('shows "Add Movie" button for organizer', async () => {
    await act(async () => {
      render(<MoviesPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Add Movie/i)).toBeInTheDocument()
  })

  it('opens movie modal when Add Movie is clicked', async () => {
    await act(async () => {
      render(<MoviesPage />, { wrapper: createWrapper() })
    })

    fireEvent.click(screen.getByText(/Add Movie/i))
    expect(screen.getByTestId('movie-modal')).toBeInTheDocument()
  })
})
