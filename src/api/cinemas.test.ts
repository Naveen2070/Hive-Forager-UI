import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cinemasApi } from './cinemas'
import { api } from './axios'
import { CinemaApprovalStatus } from '@/types/enum'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Cinemas API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  it('getAllCinemas', async () => {
    const mockRes = { content: [], pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, isLast: true }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    await cinemasApi.getAllCinemas(0, 10, 'search')
    expect(api.get).toHaveBeenCalledWith('/cinemas?page=0&size=10&search=search')
  })

  it('getMyCinemas', async () => {
    const mockRes = { content: [], pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, isLast: true }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    await cinemasApi.getMyCinemas()
    expect(api.get).toHaveBeenCalledWith('/cinemas/my?page=0&size=10')
  })

  it('getCinemaById', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: { id: '1' } })
    await cinemasApi.getCinemaById('1')
    expect(api.get).toHaveBeenCalledWith('/cinemas/1')
  })

  it('createCinema', async () => {
    const payload = { name: 'Test' }
    ;(api.post as any).mockResolvedValueOnce({ data: payload })
    await cinemasApi.createCinema(payload as any)
    expect(api.post).toHaveBeenCalledWith('/cinemas', payload)
  })

  it('updateCinema', async () => {
    ;(api.put as any).mockResolvedValueOnce({})
    await cinemasApi.updateCinema('1', { name: 'Test' } as any)
    expect(api.put).toHaveBeenCalledWith('/cinemas/1', { name: 'Test' })
  })

  it('updateCinemaStatus', async () => {
    ;(api.patch as any).mockResolvedValueOnce({})
    await cinemasApi.updateCinemaStatus('1', CinemaApprovalStatus.APPROVED)
    expect(api.patch).toHaveBeenCalledWith(`/cinemas/1/status?status=${CinemaApprovalStatus.APPROVED}`)
  })

  it('deleteCinema', async () => {
    ;(api.delete as any).mockResolvedValueOnce({})
    await cinemasApi.deleteCinema('1')
    expect(api.delete).toHaveBeenCalledWith('/cinemas/1')
  })
})
