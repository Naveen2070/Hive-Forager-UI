import { beforeEach, describe, expect, it, vi } from 'vitest'
import { auditoriumsApi } from './auditoriums'
import { api } from './axios'

// Mock the core Axios instance
vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Auditoriums API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  describe('getAllAuditoriums', () => {
    it('successfully fetches all auditoriums', async () => {
      const mockAuds = [{ id: '1', name: 'Aud 1' }]
      ;(api.get as any).mockResolvedValueOnce({ data: mockAuds })

      const result = await auditoriumsApi.getAllAuditoriums()

      expect(api.get).toHaveBeenCalledWith('/auditoriums')
      expect(result).toEqual(mockAuds)
    })
  })

  describe('getAuditoriumsByCinemaId', () => {
    it('successfully fetches auditoriums by cinema id', async () => {
      const mockAuds = [{ id: '1', name: 'Aud 1', cinemaId: 'c1' }]
      ;(api.get as any).mockResolvedValueOnce({ data: mockAuds })

      const result = await auditoriumsApi.getAuditoriumsByCinemaId('c1')

      expect(api.get).toHaveBeenCalledWith('/auditoriums/cinema/c1')
      expect(result).toEqual(mockAuds)
    })
  })

  describe('getAuditoriumById', () => {
    it('successfully fetches an auditorium by id', async () => {
      const mockAud = { id: '1', name: 'Aud 1' }
      ;(api.get as any).mockResolvedValueOnce({ data: mockAud })

      const result = await auditoriumsApi.getAuditoriumById('1')

      expect(api.get).toHaveBeenCalledWith('/auditoriums/1')
      expect(result).toEqual(mockAud)
    })
  })

  describe('createAuditorium', () => {
    it('successfully creates an auditorium', async () => {
      const payload = { name: 'New Aud', cinemaId: 'c1' }
      const mockResponse = { id: '2', ...payload }
      ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })

      const result = await auditoriumsApi.createAuditorium(payload as any)

      expect(api.post).toHaveBeenCalledWith('/auditoriums', payload)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateAuditorium', () => {
    it('successfully updates an auditorium', async () => {
      const payload = { name: 'Updated Aud' }
      ;(api.put as any).mockResolvedValueOnce({ data: null })

      await auditoriumsApi.updateAuditorium('1', payload as any)

      expect(api.put).toHaveBeenCalledWith('/auditoriums/1', payload)
    })
  })

  describe('deleteAuditorium', () => {
    it('successfully deletes an auditorium', async () => {
      ;(api.delete as any).mockResolvedValueOnce({ data: null })

      await auditoriumsApi.deleteAuditorium('1')

      expect(api.delete).toHaveBeenCalledWith('/auditoriums/1')
    })
  })
})
