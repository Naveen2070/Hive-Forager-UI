import { beforeEach, describe, expect, it, vi } from 'vitest'
import { dashboardApi } from './dashboard'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('Dashboard API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  it('getStats for events only', async () => {
    const mockRes = { totalRevenue: 100 }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    const res = await dashboardApi.getStats('events')
    expect(api.get).toHaveBeenCalledWith('/dashboard')
    expect(res).toEqual(mockRes)
  })

  it('getStats for movies only', async () => {
    const mockRes = { totalRevenue: 200 }
    ;(api.get as any).mockResolvedValueOnce({ data: mockRes })

    const res = await dashboardApi.getStats('movies')
    expect(api.get).toHaveBeenCalledWith('/movies/dashboard')
    expect(res).toEqual(mockRes)
  })

  it('getStats for combined', async () => {
    const mockEventsRes = { 
      totalRevenue: 100,
      revenueGrowthLastMonthPercent: 10,
      revenueGrowthLastWeekPercent: 5,
      totalTicketsSold: 50,
      ticketsSoldLastWeek: 10,
      pendingPaymentTickets: 2,
      activeEvents: 5,
      totalEvents: 10,
      revenueTrend: [{ date: '2023-01-01', revenue: 50 }],
      recentSales: [{ date: '2023-01-01T10:00:00', amount: 50 }]
    }
    const mockMoviesRes = {
      totalRevenue: 200,
      revenueGrowthLastMonthPercent: 20,
      revenueGrowthLastWeekPercent: 15,
      totalTicketsSold: 100,
      ticketsSoldLastWeek: 20,
      pendingPaymentTickets: 4,
      activeEvents: 10,
      totalEvents: 20,
      revenueTrend: [{ date: '2023-01-01', revenue: 100 }],
      recentSales: [{ date: '2023-01-02T10:00:00', amount: 100 }]
    }
    
    ;(api.get as any)
      .mockResolvedValueOnce({ data: mockEventsRes }) // first call for events
      .mockResolvedValueOnce({ data: mockMoviesRes }) // second call for movies

    const res = await dashboardApi.getStats('combined')
    
    expect(api.get).toHaveBeenCalledTimes(2)
    expect(res.totalRevenue).toBe(300)
    expect(res.revenueTrend[0].revenue).toBe(150)
  })
})
