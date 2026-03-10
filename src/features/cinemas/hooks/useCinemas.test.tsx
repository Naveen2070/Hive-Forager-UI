import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useCinemaDetail,
  useCinemas,
  useCreateCinema,
  useDeleteCinema,
  useMyCinemas,
  useUpdateCinema,
} from './useCinemas'
import { cinemasApi } from '@/api/cinemas'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

vi.mock('@/api/cinemas', () => ({
  cinemasApi: {
    getAllCinemas: vi.fn(),
    getMyCinemas: vi.fn(),
    getCinemaById: vi.fn(),
    createCinema: vi.fn(),
    updateCinema: vi.fn(),
    deleteCinema: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Cinemas Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useCinemas fetches all cinemas', async () => {
    const mockData = {
      content: [{ id: '1', name: 'Cinema 1' }],
      totalElements: 1,
    }
    vi.mocked(cinemasApi.getAllCinemas).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useCinemas(0, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useMyCinemas fetches my cinemas', async () => {
    const mockData = {
      content: [{ id: '2', name: 'My Cinema' }],
      totalElements: 1,
    }
    vi.mocked(cinemasApi.getMyCinemas).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useMyCinemas(true, 0, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useCinemaDetail fetches cinema by id', async () => {
    const mockData = { id: '1', name: 'Cinema 1' }
    vi.mocked(cinemasApi.getCinemaById).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useCinemaDetail('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useCreateCinema successfully creates a cinema', async () => {
    vi.mocked(cinemasApi.createCinema).mockResolvedValue({} as any)

    const { result } = renderHook(() => useCreateCinema(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ name: 'New' } as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Cinema registered successfully!',
    )
  })

  it('useUpdateCinema successfully updates a cinema', async () => {
    vi.mocked(cinemasApi.updateCinema).mockResolvedValue({} as any)

    const { result } = renderHook(() => useUpdateCinema(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: '1', data: { name: 'Updated' } } as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Cinema updated successfully!')
  })

  it('useDeleteCinema successfully deletes a cinema', async () => {
    vi.mocked(cinemasApi.deleteCinema).mockResolvedValue({} as any)

    const { result } = renderHook(() => useDeleteCinema(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Cinema removed.')
  })
})
