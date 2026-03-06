import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bookingsApi } from './booking'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('Bookings API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  it('create', async () => {
    const payload = { eventId: '1', ticketsCount: 2 }
    const mockRes = { id: '1', ...payload }
    ;(api.post as any).mockResolvedValueOnce({ data: mockRes })

    const result = await bookingsApi.create(payload as any)
    expect(api.post).toHaveBeenCalledWith('/bookings', payload)
    expect(result).toEqual(mockRes)
  })

  it('getMyBookings', async () => {
    const mockRes = { content: [], totalElements: 0 }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    const result = await bookingsApi.getMyBookings()
    expect(api.get).toHaveBeenCalledWith('/bookings')
    expect(result).toEqual(mockRes)
  })

  it('checkIn', async () => {
    const ref = 'HIVE-123'
    const mockRes = { success: true }
    ;(api.post as any).mockResolvedValueOnce({ data: mockRes })

    const result = await bookingsApi.checkIn(ref)
    expect(api.post).toHaveBeenCalledWith('/bookings/check-in', { bookingReference: ref })
    expect(result).toEqual(mockRes)
  })
})
