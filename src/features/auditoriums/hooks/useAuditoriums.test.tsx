import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useAuditoriumDetail,
  useAuditoriums,
  useAuditoriumsByCinema,
  useCreateAuditorium,
  useDeleteAuditorium,
  useUpdateAuditorium,
} from './useAuditoriums'
import { auditoriumsApi } from '@/api/auditoriums'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

vi.mock('@/api/auditoriums', () => ({
  auditoriumsApi: {
    getAllAuditoriums: vi.fn(),
    getAuditoriumsByCinemaId: vi.fn(),
    getAuditoriumById: vi.fn(),
    createAuditorium: vi.fn(),
    updateAuditorium: vi.fn(),
    deleteAuditorium: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Auditoriums Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useAuditoriums fetches all auditoriums', async () => {
    const mockData = [{ id: '1', name: 'Auditorium 1' }]
    vi.mocked(auditoriumsApi.getAllAuditoriums).mockResolvedValue(
      mockData as any,
    )

    const { result } = renderHook(() => useAuditoriums(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useAuditoriumsByCinema fetches auditoriums for a specific cinema', async () => {
    const mockData = [{ id: '1', name: 'Auditorium 1' }]
    vi.mocked(auditoriumsApi.getAuditoriumsByCinemaId).mockResolvedValue(
      mockData as any,
    )

    const { result } = renderHook(() => useAuditoriumsByCinema('cinema-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(auditoriumsApi.getAuditoriumsByCinemaId).toHaveBeenCalledWith(
      'cinema-1',
    )
  })

  it('useAuditoriumDetail fetches auditorium details by id', async () => {
    const mockData = { id: '1', name: 'Auditorium 1' }
    vi.mocked(auditoriumsApi.getAuditoriumById).mockResolvedValue(
      mockData as any,
    )

    const { result } = renderHook(() => useAuditoriumDetail('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })

  it('useCreateAuditorium successfully creates an auditorium', async () => {
    vi.mocked(auditoriumsApi.createAuditorium).mockResolvedValue({} as any)

    const { result } = renderHook(() => useCreateAuditorium(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ name: 'New', cinemaId: 'cinema-1' } as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Auditorium created successfully!',
    )
  })

  it('useUpdateAuditorium successfully updates an auditorium', async () => {
    vi.mocked(auditoriumsApi.updateAuditorium).mockResolvedValue({} as any)

    const { result } = renderHook(() => useUpdateAuditorium(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: '1', data: { name: 'Updated' } } as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Auditorium updated successfully!',
    )
  })

  it('useDeleteAuditorium successfully deletes an auditorium', async () => {
    vi.mocked(auditoriumsApi.deleteAuditorium).mockResolvedValue({} as any)

    const { result } = renderHook(() => useDeleteAuditorium(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Auditorium deleted.')
  })
})
