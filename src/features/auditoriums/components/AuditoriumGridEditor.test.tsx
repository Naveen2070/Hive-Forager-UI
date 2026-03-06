import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuditoriumGridEditor } from './AuditoriumGridEditor'

describe('AuditoriumGridEditor', () => {
  const mockLayout = {
    disabledSeats: [],
    wheelchairSpots: [],
    tiers: [],
  }
  const onChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the grid with correct number of rows and columns', () => {
    const { container } = render(
      <AuditoriumGridEditor
        maxRows={5}
        maxColumns={5}
        layout={mockLayout}
        onChange={onChange}
      />
    )
    // 5 rows * 5 columns = 25 seats
    const buttons = container.querySelectorAll('button')
    // 4 tool buttons + 25 seat buttons = 29 buttons total
    expect(buttons.length).toBe(29)
    
    // Check row labels A to E
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
  })

  it('allows selecting different tools', () => {
    render(
      <AuditoriumGridEditor
        maxRows={5}
        maxColumns={5}
        layout={mockLayout}
        onChange={onChange}
      />
    )

    const vipTool = screen.getByText('VIP Seat')
    
    fireEvent.click(vipTool)
    // Active tool state is internal, but we can verify it by clicking a seat next
  })

  it('updates layout when a seat is clicked with the default tool (AVAILABLE)', () => {
    render(
      <AuditoriumGridEditor
        maxRows={5}
        maxColumns={5}
        layout={mockLayout}
        onChange={onChange}
      />
    )

    // Click first seat (A1)
    const seats = screen.getAllByText('1')
    fireEvent.click(seats[0])

    // Should call onChange with a "cleaned" layout (removing it from everything else)
    // Since it was already available, it just stays available (removed then not added to others)
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      disabledSeats: [],
      wheelchairSpots: [],
    }))
  })

  it('updates layout when a seat is clicked with the DISABLED tool', () => {
    render(
      <AuditoriumGridEditor
        maxRows={5}
        maxColumns={5}
        layout={mockLayout}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByText('Remove (Aisle)'))
    
    const seats = screen.getAllByText('1')
    fireEvent.click(seats[0])

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      disabledSeats: [{ row: 0, col: 0 }],
    }))
  })

  it('updates layout when a seat is clicked with the VIP tool', () => {
    render(
      <AuditoriumGridEditor
        maxRows={5}
        maxColumns={5}
        layout={mockLayout}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByText('VIP Seat'))
    
    const seats = screen.getAllByText('1')
    fireEvent.click(seats[0])

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      tiers: [expect.objectContaining({
        tierName: 'VIP Recliners',
        seats: [{ row: 0, col: 0 }],
      })],
    }))
  })
})
