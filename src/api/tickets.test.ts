import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ticketsApi } from './tickets'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('Tickets API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  it('reserveTickets', async () => {
    const payload = { showtimeId: '1', seats: [] }
    ;(api.post as any).mockResolvedValueOnce({ data: { clientSecret: 'secret' } })
    await ticketsApi.reserveTickets(payload as any)
    expect(api.post).toHaveBeenCalledWith('/tickets/reserve', payload)
  })

  it('checkIn', async () => {
    ;(api.post as any).mockResolvedValueOnce({ data: { status: 'CHECKED_IN' } })
    await ticketsApi.checkIn('HIVE-123')
    expect(api.post).toHaveBeenCalledWith('/tickets/check-in', { bookingReference: 'HIVE-123' })
  })

  it('getMyTickets', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: [] })
    await ticketsApi.getMyTickets()
    expect(api.get).toHaveBeenCalledWith('/tickets/my-bookings')
  })

  it('confirmPaymentWebhook', async () => {
    const payload = { event: 'payment.success' }
    ;(api.post as any).mockResolvedValueOnce({})
    await ticketsApi.confirmPaymentWebhook(payload as any)
    expect(api.post).toHaveBeenCalledWith('/tickets/payment/success', payload)
  })
})
