import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from '../routes/_app.dashboard.index'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/dashboard/hooks/useDashboardStats', () => ({
  useDashboardStats: vi.fn(),
}))

vi.mock('@/features/dashboard/components/DashboardStatsGrid', () => ({
  DashboardStatsGrid: ({ mode }: any) => (
    <div data-testid="stats-grid">Mode: {mode}</div>
  ),
}))

vi.mock('@/features/dashboard/components/RevenueChart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart" />,
}))

vi.mock('@/features/dashboard/components/RecentSales', () => ({
  RecentSales: () => <div data-testid="recent-sales" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('Dashboard Page Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard components with combined mode initially', async () => {
    ;(useDashboardStats as any).mockReturnValue({
      data: { revenueTrend: [], recentSales: [] },
      isLoading: false,
    })

    const DashboardPage = (Route as any).options.component
    await act(async () => {
      render(<DashboardPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByTestId('stats-grid')).toHaveTextContent('Mode: combined')
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument()
  })

  it('updates view mode when toggled', async () => {
    ;(useDashboardStats as any).mockReturnValue({
      data: { revenueTrend: [], recentSales: [] },
      isLoading: false,
    })

    const DashboardPage = (Route as any).options.component
    await act(async () => {
      render(<DashboardPage />, { wrapper: createWrapper() })
    })

    await act(async () => {
      fireEvent.click(screen.getByText(/Events/i))
    })
    expect(screen.getByTestId('stats-grid')).toHaveTextContent('Mode: events')

    await act(async () => {
      fireEvent.click(screen.getByText(/Movies/i))
    })
    expect(screen.getByTestId('stats-grid')).toHaveTextContent('Mode: movies')
  })

  it('displays DataFallback on error', async () => {
    ;(useDashboardStats as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Network Error'),
    })

    const DashboardPage = (Route as any).options.component
    await act(async () => {
      render(<DashboardPage />, { wrapper: createWrapper() })
    })

    expect(
      screen.getByText(/Analytics Server Unreachable/i),
    ).toBeInTheDocument()
  })
})
