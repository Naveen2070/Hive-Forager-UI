import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MovieModal } from './MovieModal'

describe('MovieModal', () => {
  const onSubmit = vi.fn()
  const onClose = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose,
    onSubmit,
    isPending: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Add New Movie" title when no initialData is provided', () => {
    render(<MovieModal {...defaultProps} />)
    expect(screen.getByText('Add New Movie')).toBeInTheDocument()
  })

  it('renders "Edit Movie" title when initialData is provided', () => {
    const initialData = {
      id: '1',
      title: 'Interstellar',
      description: 'A great space movie.',
      durationMinutes: 169,
      releaseDate: '2014-11-07T00:00:00Z',
    }
    render(<MovieModal {...defaultProps} initialData={initialData as any} />)
    expect(screen.getByText('Edit Movie')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Interstellar')).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<MovieModal {...defaultProps} />)
    fireEvent.click(screen.getByText(/cancel/i))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows validation errors for empty fields on submit', async () => {
    render(<MovieModal {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add Movie'))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    render(<MovieModal {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText(/e.g. Dune/i), { target: { value: 'Inception' } })
    fireEvent.change(screen.getByLabelText(/Release Date/i), { target: { value: '2010-07-16' } })
    fireEvent.change(screen.getByLabelText(/Runtime/i), { target: { value: '148' } })
    fireEvent.change(screen.getByLabelText(/Synopsis/i), { target: { value: 'A thief who steals corporate secrets through the use of dream-sharing technology.' } })

    fireEvent.click(screen.getByText('Add Movie'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Inception',
        durationMinutes: 148,
        releaseDate: '2010-07-16',
      }), expect.anything())
    })
  })

  it('disables buttons when isPending is true', () => {
    render(<MovieModal {...defaultProps} isPending={true} />)
    expect(screen.getByText('Saving...')).toBeDisabled()
    expect(screen.getByText(/cancel/i)).toBeDisabled()
  })
})
