import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SeatGrid } from './SeatGrid'
import { SeatStatus } from '@/types/enum'

const mockSeatMap = [
  { row: 0, col: 0, status: SeatStatus.AVAILABLE },
  { row: 0, col: 1, status: SeatStatus.RESERVED },
]

describe('SeatGrid', () => {
  it('renders available and taken seats correctly', () => {
    render(
      <SeatGrid
        maxRows={1}
        maxColumns={2}
        seatMap={mockSeatMap}
        selectedSeats={[]}
        onToggleSeat={vi.fn()}
      />,
    )

    const availableSeat = screen.getByText('1')
    expect(availableSeat).not.toBeDisabled()

    const takenSeat = screen.getByText('X').closest('button')
    expect(takenSeat).toBeDisabled()
  })

  it('calls onToggleSeat when an available seat is clicked', () => {
    const onToggle = vi.fn()
    render(
      <SeatGrid
        maxRows={1}
        maxColumns={2}
        seatMap={mockSeatMap}
        selectedSeats={[]}
        onToggleSeat={onToggle}
      />,
    )

    fireEvent.click(screen.getByText('1'))
    expect(onToggle).toHaveBeenCalledWith(0, 0)
  })

  it('renders selected seats with distinct styling', () => {
    render(
      <SeatGrid
        maxRows={1}
        maxColumns={2}
        seatMap={mockSeatMap}
        selectedSeats={[{ row: 0, col: 0 }]}
        onToggleSeat={vi.fn()}
      />,
    )

    const selectedSeat = screen.getByText('1')
    expect(selectedSeat).toHaveClass('bg-yellow-500')
  })

  it('renders VIP seats with correct surcharges in titles', () => {
    const tiers = [
      { tierName: 'VIP', priceSurcharge: 5, seats: [{ row: 0, col: 0 }] },
    ]
    render(
      <SeatGrid
        maxRows={1}
        maxColumns={1}
        seatMap={[{ row: 0, col: 0, status: SeatStatus.AVAILABLE }]}
        selectedSeats={[]}
        tiers={tiers as any}
        onToggleSeat={vi.fn()}
      />,
    )

    const seat = screen.getByTitle(/VIP \+\$5/)
    expect(seat).toHaveClass('bg-fuchsia-900')
  })
})
