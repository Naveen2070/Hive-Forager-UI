import type { DashboardStatsDTO } from '@/types/dashboard.type'

export const getMockDashboardStats = (
  mode: 'combined' | 'events' | 'movies',
): DashboardStatsDTO => {
  const today = new Date()

  // Generate consistent 30-day trend with controlled growth
  const generateTrend = (
    base: number,
    volatility: number,
    growthRate = 0.01, // 1% daily growth
  ) => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (29 - i))

      const growth = base * growthRate * i
      const randomOffset = (Math.random() - 0.5) * volatility

      return {
        date: date.toISOString(),
        revenue: Math.max(0, Number((base + growth + randomOffset).toFixed(2))),
      }
    })
  }

  const eventsTrend = generateTrend(1000, 300, 0.015)
  const moviesTrend = generateTrend(800, 250, -0.005)

  const eventsData: DashboardStatsDTO = {
    totalRevenue: 45231.5,
    revenueGrowthLastMonthPercent: 12.5,
    revenueGrowthLastWeekPercent: 5.8,
    totalTicketsSold: 1204,
    ticketsSoldLastWeek: 145,
    pendingPaymentTickets: 12,
    activeEvents: 8,
    totalEvents: 24,
    revenueTrend: eventsTrend,
    recentSales: [
      {
        id: '1',
        customerName: 'Alice Smith',
        eventName: 'React Native Meetup',
        tierName: 'VIP',
        amount: 150,
        tickets: 2,
        date: new Date().toISOString(),
      },
      {
        id: '2',
        customerName: 'John Doe',
        eventName: 'Symphony in Park',
        tierName: 'General',
        amount: 45,
        tickets: 1,
        date: new Date().toISOString(),
      },
    ],
  }

  const moviesData: DashboardStatsDTO = {
    totalRevenue: 28450.0,
    revenueGrowthLastMonthPercent: -2.4,
    revenueGrowthLastWeekPercent: -0.5,
    totalTicketsSold: 2150,
    ticketsSoldLastWeek: 320,
    pendingPaymentTickets: 45,
    activeEvents: 12,
    totalEvents: 150,
    revenueTrend: moviesTrend,
    recentSales: [
      {
        id: '3',
        customerName: 'Emma Watson',
        eventName: 'Spider-Man: Beyond',
        tierName: 'IMAX',
        amount: 45,
        tickets: 2,
        date: new Date().toISOString(),
      },
      {
        id: '4',
        customerName: 'Bruce Wayne',
        eventName: 'Inception Re-release',
        tierName: 'Standard',
        amount: 15,
        tickets: 1,
        date: new Date().toISOString(),
      },
    ],
  }

  if (mode === 'events') return eventsData
  if (mode === 'movies') return moviesData

  // Combined (properly merged trend)
  const combinedTrend = eventsTrend.map((point, index) => ({
    date: point.date,
    revenue: Number((point.revenue + moviesTrend[index].revenue).toFixed(2)),
  }))

  return {
    totalRevenue: Number(
      (eventsData.totalRevenue + moviesData.totalRevenue).toFixed(2),
    ),
    revenueGrowthLastMonthPercent: 8.2,
    revenueGrowthLastWeekPercent: 2.6,
    totalTicketsSold: eventsData.totalTicketsSold + moviesData.totalTicketsSold,
    ticketsSoldLastWeek:
      eventsData.ticketsSoldLastWeek + moviesData.ticketsSoldLastWeek,
    pendingPaymentTickets:
      eventsData.pendingPaymentTickets + moviesData.pendingPaymentTickets,
    activeEvents: eventsData.activeEvents + moviesData.activeEvents,
    totalEvents: eventsData.totalEvents + moviesData.totalEvents,
    revenueTrend: combinedTrend,
    recentSales: [...eventsData.recentSales, ...moviesData.recentSales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  }
}
