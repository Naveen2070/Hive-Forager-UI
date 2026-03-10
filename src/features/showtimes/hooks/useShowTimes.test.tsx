import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useCreateShowtime,
  useSeatMap,
  useShowtimesByMovie,
} from './useShowTimes'
import { showtimesApi } from '@/api/showtimes'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

vi.mock('@/api/showtimes', () => ({
  showtimesApi: {
    getShowtimesByMovieId: vi.fn(),
    getSeatMap: vi.fn(),
    createShowtime: vi.fn(),
    updateShowtime: vi.fn(),
    deleteShowtime: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Showtimes Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useShowtimesByMovie fetches list', async () => {
    const mockData = { content: [{ id: '1' }] }
    vi.mocked(showtimesApi.getShowtimesByMovieId).mockResolvedValue(
      mockData as any,
    )

    const { result } = renderHook(() => useShowtimesByMovie('movie-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useSeatMap fetches map', async () => {
    const mockData = { rows: [] }
    vi.mocked(showtimesApi.getSeatMap).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useSeatMap('show-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useCreateShowtime handles success', async () => {
    vi.mocked(showtimesApi.createShowtime).mockResolvedValue({
      id: 'new-id',
    } as any)
    const { result } = renderHook(() => useCreateShowtime(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Showtime scheduled successfully!',
    )
  })
})
