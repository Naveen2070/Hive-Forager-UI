import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardStatsGrid } from './DashboardStatsGrid'

const mockStats: any = {
  totalRevenue: 5000.5,
  revenueGrowthLastMonthPercent: 12.5,
  totalTicketsSold: 120,
  ticketsSoldLastWeek: 15,
  pendingPaymentTickets: 5,
  activeEvents: 3,
  totalEvents: 10,
}

describe('DashboardStatsGrid', () => {
  it('renders all stats correctly in combined mode', () => {
    render(<DashboardStatsGrid stats={mockStats} mode="combined" />)

    expect(screen.getByText('$5,000.50')).toBeInTheDocument()
    expect(screen.getByText('12.5% from last month')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Active Programs')).toBeInTheDocument()
    expect(screen.getByText('out of 10 total created')).toBeInTheDocument()
  })

  it('renders correct label for events mode', () => {
    render(<DashboardStatsGrid stats={mockStats} mode="events" />)
    expect(screen.getByText('Active Events')).toBeInTheDocument()
  })

  it('renders correct label for movies mode', () => {
    render(<DashboardStatsGrid stats={mockStats} mode="movies" />)
    expect(screen.getByText('Active Movies')).toBeInTheDocument()
  })

  it('renders negative growth correctly', () => {
    const negativeStats = { ...mockStats, revenueGrowthLastMonthPercent: -5.2 }
    render(<DashboardStatsGrid stats={negativeStats} mode="combined" />)

    const growth = screen.getByText('5.2% from last month')
    expect(growth.parentElement).toHaveClass('text-red-500')
  })
})
