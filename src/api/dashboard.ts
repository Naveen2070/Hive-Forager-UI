import { api } from './axios'
import type { DashboardStatsDTO } from '@/types/dashboard.type'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const dashboardApi = {
  getStats: async (
    mode: 'combined' | 'events' | 'movies' = 'combined',
  ): Promise<DashboardStatsDTO> => {
    if (isMock) {
      const { getMockDashboardStats } =
        await import('@/api/mocks/dashboard.mock')
      return getMockDashboardStats(mode)
    }

    // EVENTS ONLY
    if (mode === 'events') {
      const response = await api.get<DashboardStatsDTO>('/dashboard')
      return response.data
    }

    // MOVIES ONLY
    if (mode === 'movies') {
      const response = await api.get<DashboardStatsDTO>('/movies/dashboard')
      return response.data
    }

    // COMBINED (call both in parallel)
    const [eventsRes, moviesRes] = await Promise.all([
      api.get<DashboardStatsDTO>('/dashboard'),
      api.get<DashboardStatsDTO>('/movies/dashboard'),
    ])

    const events = eventsRes.data
    const movies = moviesRes.data

    const combinedTrend = events.revenueTrend.map((point, index) => ({
      date: point.date,
      revenue: point.revenue + (movies.revenueTrend[index]?.revenue ?? 0),
    }))

    return {
      totalRevenue: events.totalRevenue + movies.totalRevenue,
      revenueGrowthLastMonthPercent:
        (events.revenueGrowthLastMonthPercent +
          movies.revenueGrowthLastMonthPercent) /
        2,
      revenueGrowthLastWeekPercent:
        (events.revenueGrowthLastWeekPercent +
          movies.revenueGrowthLastWeekPercent) /
        2,
      totalTicketsSold: events.totalTicketsSold + movies.totalTicketsSold,
      ticketsSoldLastWeek:
        events.ticketsSoldLastWeek + movies.ticketsSoldLastWeek,
      pendingPaymentTickets:
        events.pendingPaymentTickets + movies.pendingPaymentTickets,
      activeEvents: events.activeEvents + movies.activeEvents,
      totalEvents: events.totalEvents + movies.totalEvents,
      revenueTrend: combinedTrend,
      recentSales: [...events.recentSales, ...movies.recentSales]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    }
  },
}
