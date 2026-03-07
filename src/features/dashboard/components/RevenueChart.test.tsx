import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RevenueChart } from './RevenueChart'

// Mock Recharts to avoid issues in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}))

const mockData: any[] = [
  { date: '2025-01-01', revenue: 100 },
  { date: '2025-01-02', revenue: 200 },
]

describe('RevenueChart', () => {
  it('renders correctly with data', () => {
    render(<RevenueChart data={mockData} />)

    expect(screen.getByText('Revenue Overview')).toBeInTheDocument()
  })
})
