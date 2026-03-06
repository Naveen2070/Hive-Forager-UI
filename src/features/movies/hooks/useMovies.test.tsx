import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useMovies,
  useMovieDetail,
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
} from './useMovies'
import { moviesApi } from '@/api/movies'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('@/api/movies', () => ({
  moviesApi: {
    getAllMovies: vi.fn(),
    getMovieById: vi.fn(),
    createMovie: vi.fn(),
    updateMovie: vi.fn(),
    deleteMovie: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('Movies Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useMovies', () => {
    it('should fetch movies', async () => {
      const mockData = { content: [{ id: '1', title: 'Movie 1' }], totalElements: 1 }
      ;(moviesApi.getAllMovies as any).mockResolvedValueOnce(mockData)

      const { result } = renderHook(() => useMovies(0, 10, 'test'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockData)
      expect(moviesApi.getAllMovies).toHaveBeenCalledWith(0, 10, 'test')
    })
  })

  describe('useMovieDetail', () => {
    it('should fetch movie detail when id is provided', async () => {
      const mockMovie = { id: '1', title: 'Movie 1' }
      ;(moviesApi.getMovieById as any).mockResolvedValueOnce(mockMovie)

      const { result } = renderHook(() => useMovieDetail('1'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockMovie)
      expect(moviesApi.getMovieById).toHaveBeenCalledWith('1')
    })

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useMovieDetail(''), { wrapper })
      expect(result.current.isLoading).toBe(false)
      expect(moviesApi.getMovieById).not.toHaveBeenCalled()
    })
  })

  describe('useCreateMovie', () => {
    it('should create a movie and show success toast', async () => {
      const payload = { title: 'New Movie' }
      ;(moviesApi.createMovie as any).mockResolvedValueOnce({ id: '2', ...payload })

      const { result } = renderHook(() => useCreateMovie(), { wrapper })

      result.current.mutate(payload as any)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Movie created successfully!')
      expect(moviesApi.createMovie).toHaveBeenCalledWith(payload)
    })

    it('should show error toast on failure', async () => {
      const errorMsg = 'Failed to create'
      ;(moviesApi.createMovie as any).mockRejectedValueOnce({
        response: { data: { message: errorMsg } },
      })

      const { result } = renderHook(() => useCreateMovie(), { wrapper })

      result.current.mutate({ title: 'New Movie' } as any)

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(toast.error).toHaveBeenCalledWith(errorMsg)
    })
  })

  describe('useUpdateMovie', () => {
    it('should update a movie and show success toast', async () => {
      const payload = { title: 'Updated Movie' }
      ;(moviesApi.updateMovie as any).mockResolvedValueOnce({})

      const { result } = renderHook(() => useUpdateMovie(), { wrapper })

      result.current.mutate({ id: '1', data: payload as any })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Movie updated successfully!')
      expect(moviesApi.updateMovie).toHaveBeenCalledWith('1', payload)
    })
  })

  describe('useDeleteMovie', () => {
    it('should delete a movie and show success toast', async () => {
      ;(moviesApi.deleteMovie as any).mockResolvedValueOnce({})

      const { result } = renderHook(() => useDeleteMovie(), { wrapper })

      result.current.mutate('1')

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Movie deleted.')
      expect(moviesApi.deleteMovie).toHaveBeenCalledWith('1')
    })
  })
})
