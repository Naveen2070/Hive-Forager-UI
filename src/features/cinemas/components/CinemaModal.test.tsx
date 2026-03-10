import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CinemaModal } from './CinemaModal'
import { createWrapper } from '@/test/utils'

const mockSubmit = vi.fn()
const mockClose = vi.fn()

describe('CinemaModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Register New Cinema" when initialData is null', () => {
    render(
      <CinemaModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={null}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Register New Cinema')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('e.g. Hive Multiplex Downtown'),
    ).toHaveValue('')
  })

  it('renders "Edit Cinema" and populates data when initialData is provided', () => {
    const initialData: any = {
      name: 'Existing Cinema',
      location: '123 Street',
      contactEmail: 'test@cinema.com',
    }
    render(
      <CinemaModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={initialData}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Edit Cinema')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Cinema')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123 Street')).toBeInTheDocument()
    // Email should be disabled in edit mode
    expect(screen.getByDisplayValue('test@cinema.com')).toBeDisabled()
  })

  it('calls onSubmit with form data when valid', async () => {
    render(
      <CinemaModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={null}
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.change(
      screen.getByPlaceholderText('e.g. Hive Multiplex Downtown'),
      { target: { value: 'New Cinema' } },
    )
    fireEvent.change(
      screen.getByPlaceholderText('123 Main St, City, ST 12345'),
      { target: { value: '456 Avenue' } },
    )
    fireEvent.change(screen.getByPlaceholderText('manager@hivecinema.com'), {
      target: { value: 'manager@test.com' },
    })

    fireEvent.click(screen.getByText('Register Cinema'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          name: 'New Cinema',
          location: '456 Avenue',
          contactEmail: 'manager@test.com',
        },
        expect.anything(),
      )
    })
  })

  it('shows validation errors for invalid input', async () => {
    render(
      <CinemaModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={null}
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByText('Register Cinema'))

    await waitFor(() => {
      expect(
        screen.getByText('Name must be at least 3 characters'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Location must be at least 5 characters'),
      ).toBeInTheDocument()
    })
  })
})
