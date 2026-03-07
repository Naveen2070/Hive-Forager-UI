import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RecentSales } from './RecentSales'

const mockSales: any[] = [
  {
    id: '1',
    customerName: 'Alice',
    eventName: 'Concert',
    tierName: 'VIP',
    amount: 200,
    tickets: 2,
  },
  {
    id: '2',
    customerName: 'Bob',
    eventName: 'Cinema',
    tierName: 'Standard',
    amount: 15,
    tickets: 1,
  },
]

describe('RecentSales', () => {
  it('renders correctly with sales data', () => {
    render(<RecentSales sales={mockSales} />)

    expect(screen.getByText('Recent Sales')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Concert')).toBeInTheDocument()
    expect(screen.getByText('VIP')).toBeInTheDocument()
    expect(screen.getByText('+$200.00')).toBeInTheDocument()
    expect(screen.getByText('2 tix')).toBeInTheDocument()

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('+$15.00')).toBeInTheDocument()
  })

  it('renders default tier name if not provided', () => {
    const salesNoTier = [{ ...mockSales[0], tierName: undefined }]
    render(<RecentSales sales={salesNoTier as any} />)
    expect(screen.getByText('Standard')).toBeInTheDocument()
  })
})
