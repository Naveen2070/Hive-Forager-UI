import { beforeEach, describe, expect, it, vi } from 'vitest'
import { showtimesApi } from './showtimes'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Showtimes API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  it('getSeatMap', async () => {
    const mockRes = { availableSeats: [] }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    await showtimesApi.getSeatMap('1')
    expect(api.get).toHaveBeenCalledWith('/showtimes/1/seatmap')
  })

  it('getShowtimesByMovieId', async () => {
    const mockRes = { content: [], pageNumber: 0, pageSize: 50, totalElements: 0, totalPages: 0, isLast: true }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    await showtimesApi.getShowtimesByMovieId('movie1', 0, 50, '2023-10-01', '2023-10-31')
    expect(api.get).toHaveBeenCalledWith('/showtimes/movie/movie1?page=0&size=50&fromDate=2023-10-01&toDate=2023-10-31')
  })

  it('createShowtime', async () => {
    const payload = { movieId: '1' }
    ;(api.post as any).mockResolvedValueOnce({ data: payload })
    await showtimesApi.createShowtime(payload as any)
    expect(api.post).toHaveBeenCalledWith('/showtimes', payload)
  })

  it('updateShowtime', async () => {
    ;(api.put as any).mockResolvedValueOnce({})
    await showtimesApi.updateShowtime('1', { movieId: '2' } as any)
    expect(api.put).toHaveBeenCalledWith('/showtimes/1', { movieId: '2' })
  })

  it('deleteShowtime', async () => {
    ;(api.delete as any).mockResolvedValueOnce({})
    await showtimesApi.deleteShowtime('1')
    expect(api.delete).toHaveBeenCalledWith('/showtimes/1')
  })
})
