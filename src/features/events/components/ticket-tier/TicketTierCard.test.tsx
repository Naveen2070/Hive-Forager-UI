import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TicketTierCard } from './TicketTierCard'

const mockTier: any = {
  id: 1,
  name: 'VIP',
  price: 100,
  totalAllocation: 50,
  availableAllocation: 40,
  validUntil: new Date('2025-01-01T10:00:00Z').toISOString(),
}

describe('TicketTierCard', () => {
  it('renders ticket tier details correctly', () => {
    render(
      <TicketTierCard tier={mockTier} onEdit={vi.fn()} onDelete={vi.fn()} />,
    )

    expect(screen.getByText('VIP')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('Sold: 10')).toBeInTheDocument()
    expect(screen.getByText('Total: 50')).toBeInTheDocument()
    expect(screen.getByText('Valid until Jan 1, 2025')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(
      <TicketTierCard tier={mockTier} onEdit={onEdit} onDelete={vi.fn()} />,
    )

    // Find the edit button (first button in actions)
    const editButton = screen.getAllByRole('button')[0]
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledWith(mockTier)
  })

  it('opens delete confirmation and calls onDelete', () => {
    const onDelete = vi.fn()
    render(
      <TicketTierCard tier={mockTier} onEdit={vi.fn()} onDelete={onDelete} />,
    )

    // Find trash icon button (second button in actions)
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(screen.getByText('Delete Ticket Tier?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('renders "Free" for 0 price', () => {
    const freeTier = { ...mockTier, price: 0 }
    render(
      <TicketTierCard tier={freeTier} onEdit={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByText('Free')).toBeInTheDocument()
  })
})
