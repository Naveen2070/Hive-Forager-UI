export interface RevenueChartPoint {
  date: string
  revenue: number
}

export interface RevenueTrendItem {
  date: string
  revenue: number
}

export interface RecentSale {
  id: number
  eventName: string
  customerName: string
  tierName:string
  tickets: number
  amount: number
  date: string
}

export interface DashboardStatsDTO {
  // Revenue
  totalRevenue: number
  revenueGrowthLastWeekPercent: number
  revenueGrowthLastMonthPercent: number

  // Tickets
  totalTicketsSold: number
  pendingPaymentTickets: number
  ticketsSoldLastWeek: number

  // Events
  activeEvents: number
  totalEvents: number

  // Lists
  revenueTrend: Array<RevenueTrendItem>
  recentSales: Array<RecentSale>
}
