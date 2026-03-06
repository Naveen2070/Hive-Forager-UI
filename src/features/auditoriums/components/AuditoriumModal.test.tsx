import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuditoriumModal } from './AuditoriumModal'

describe('AuditoriumModal', () => {
  const onSubmit = vi.fn()
  const onClose = vi.fn()

  const defaultProps = {
    isOpen: true,
    cinemaId: 'c1',
    onClose,
    onSubmit,
    isPending: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Create New Auditorium" title when no initialData is provided', () => {
    render(<AuditoriumModal {...defaultProps} />)
    expect(screen.getByText('Create New Auditorium')).toBeInTheDocument()
  })

  it('renders "Edit Auditorium" title when initialData is provided', () => {
    const initialData = {
      id: 'a1',
      name: 'IMAX 1',
      maxRows: 10,
      maxColumns: 15,
      cinemaId: 'c1',
      layout: { disabledSeats: [], wheelchairSpots: [], tiers: [] },
    }
    render(<AuditoriumModal {...defaultProps} initialData={initialData as any} />)
    expect(screen.getByText('Edit Auditorium')).toBeInTheDocument()
    expect(screen.getByDisplayValue('IMAX 1')).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<AuditoriumModal {...defaultProps} />)
    fireEvent.click(screen.getByText(/cancel/i))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows validation errors for empty screen name', async () => {
    render(<AuditoriumModal {...defaultProps} />)
    
    // Clear the default value if any and try to submit
    fireEvent.change(screen.getByLabelText(/Screen Name/i), { target: { value: '' } })
    fireEvent.click(screen.getByText('Create Auditorium'))

    await waitFor(() => {
      expect(screen.getByText('Screen name is required')).toBeInTheDocument()
    })
  })

  it('handles dimension changes correctly', () => {
    render(<AuditoriumModal {...defaultProps} />)
    
    const rowsInput = screen.getByLabelText(/Total Rows/i)
    fireEvent.change(rowsInput, { target: { value: '20' } })
    expect(rowsInput).toHaveValue(20)

    // Capped at 50
    fireEvent.change(rowsInput, { target: { value: '60' } })
    expect(rowsInput).toHaveValue(50)
    
    // Min 1
    fireEvent.change(rowsInput, { target: { value: '0' } })
    expect(rowsInput).toHaveValue(1)
  })

  it('calls onSubmit with form data and cinemaId', async () => {
    render(<AuditoriumModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/Screen Name/i), { target: { value: 'New Screen' } })
    fireEvent.click(screen.getByText('Create Auditorium'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        cinemaId: 'c1',
        name: 'New Screen',
        maxRows: 10,
        maxColumns: 15,
      }))
    })
  })
})
