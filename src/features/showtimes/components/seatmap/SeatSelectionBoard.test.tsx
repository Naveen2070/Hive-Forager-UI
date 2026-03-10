import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SeatSelectionBoard } from './SeatSelectionBoard'

vi.mock('./SeatGrid', () => ({
  SeatGrid: () => <div data-testid="mock-seat-grid" />,
}))

describe('SeatSelectionBoard', () => {
  it('renders screen indicator and legend', () => {
    render(
      <SeatSelectionBoard
        maxRows={5}
        maxColumns={5}
        seatMap={[]}
        selectedSeats={[]}
        onToggleSeat={vi.fn()}
      />,
    )

    expect(screen.getByText(/Screen/i)).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText('Selected')).toBeInTheDocument()
    expect(screen.getByText('Taken')).toBeInTheDocument()
    expect(screen.getByTestId('mock-seat-grid')).toBeInTheDocument()
  })
})
