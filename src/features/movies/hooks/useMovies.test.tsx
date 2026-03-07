import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreateMovie, useDeleteMovie, useMovies } from './useMovies'
import { moviesApi } from '@/api/movies'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

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

describe('Movies Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useMovies fetches movies list', async () => {
    const mockData = {
      content: [{ id: '1', title: 'Film 1' }],
      totalElements: 1,
    }
    vi.mocked(moviesApi.getAllMovies).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useMovies(0, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useCreateMovie handles success', async () => {
    vi.mocked(moviesApi.createMovie).mockResolvedValue({} as any)
    const { result } = renderHook(() => useCreateMovie(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ title: 'New Film' } as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Movie created successfully!')
  })

  it('useDeleteMovie handles success', async () => {
    vi.mocked(moviesApi.deleteMovie).mockResolvedValue({} as any)
    const { result } = renderHook(() => useDeleteMovie(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Movie deleted.')
  })
})
