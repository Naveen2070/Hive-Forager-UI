import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAuditoriums,
  useAuditoriumsByCinema,
  useAuditoriumDetail,
  useCreateAuditorium,
  useUpdateAuditorium,
  useDeleteAuditorium,
} from './useAuditoriums'
import { auditoriumsApi } from '@/api/auditoriums'
import { toast } from 'sonner'

// Mock dependencies
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

describe('Auditoriums Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAuditoriums', () => {
    it('should fetch all auditoriums', async () => {
      const mockData = [{ id: '1', name: 'Aud 1' }]
      ;(auditoriumsApi.getAllAuditoriums as any).mockResolvedValueOnce(mockData)

      const { result } = renderHook(() => useAuditoriums(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockData)
      expect(auditoriumsApi.getAllAuditoriums).toHaveBeenCalled()
    })
  })

  describe('useAuditoriumsByCinema', () => {
    it('should fetch auditoriums by cinema id', async () => {
      const mockData = [{ id: '1', name: 'Aud 1', cinemaId: 'c1' }]
      ;(auditoriumsApi.getAuditoriumsByCinemaId as any).mockResolvedValueOnce(mockData)

      const { result } = renderHook(() => useAuditoriumsByCinema('c1'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockData)
      expect(auditoriumsApi.getAuditoriumsByCinemaId).toHaveBeenCalledWith('c1')
    })
  })

  describe('useAuditoriumDetail', () => {
    it('should fetch auditorium detail', async () => {
      const mockData = { id: '1', name: 'Aud 1' }
      ;(auditoriumsApi.getAuditoriumById as any).mockResolvedValueOnce(mockData)

      const { result } = renderHook(() => useAuditoriumDetail('1'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockData)
      expect(auditoriumsApi.getAuditoriumById).toHaveBeenCalledWith('1')
    })
  })

  describe('useCreateAuditorium', () => {
    it('should create an auditorium and show success toast', async () => {
      const payload = { name: 'New Aud', cinemaId: 'c1' }
      ;(auditoriumsApi.createAuditorium as any).mockResolvedValueOnce({ id: '2', ...payload })

      const { result } = renderHook(() => useCreateAuditorium(), { wrapper })

      result.current.mutate(payload as any)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Auditorium created successfully!')
      expect(auditoriumsApi.createAuditorium).toHaveBeenCalledWith(payload)
    })
  })

  describe('useUpdateAuditorium', () => {
    it('should update an auditorium and show success toast', async () => {
      const payload = { name: 'Updated Aud' }
      ;(auditoriumsApi.updateAuditorium as any).mockResolvedValueOnce({})

      const { result } = renderHook(() => useUpdateAuditorium(), { wrapper })

      result.current.mutate({ id: '1', data: payload as any })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Auditorium updated successfully!')
      expect(auditoriumsApi.updateAuditorium).toHaveBeenCalledWith('1', payload)
    })
  })

  describe('useDeleteAuditorium', () => {
    it('should delete an auditorium and show success toast', async () => {
      ;(auditoriumsApi.deleteAuditorium as any).mockResolvedValueOnce({})

      const { result } = renderHook(() => useDeleteAuditorium(), { wrapper })

      result.current.mutate('1')

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(toast.success).toHaveBeenCalledWith('Auditorium deleted.')
      expect(auditoriumsApi.deleteAuditorium).toHaveBeenCalledWith('1')
    })
  })
})
