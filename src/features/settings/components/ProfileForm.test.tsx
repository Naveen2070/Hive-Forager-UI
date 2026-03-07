import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfileForm } from './ProfileForm'
import { createWrapper } from '@/test/utils'

const mockSubmit = vi.fn()

describe('ProfileForm', () => {
  it('renders correctly with default values', () => {
    render(
      <ProfileForm
        defaultValues={{ fullName: 'John Doe', email: 'john@test.com' }}
        onSubmit={mockSubmit}
        isPending={false}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@test.com')).toBeDisabled()
  })

  it('calls onSubmit with new fullName when form is valid', async () => {
    render(
      <ProfileForm
        defaultValues={{ fullName: 'John Doe', email: 'john@test.com' }}
        onSubmit={mockSubmit}
        isPending={false}
      />,
      { wrapper: createWrapper() },
    )

    const input = screen.getByLabelText('Display Name')
    fireEvent.change(input, { target: { value: 'Jane Doe' } })

    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          fullName: 'Jane Doe',
          email: 'john@test.com',
        },
        expect.anything(),
      )
    })
  })

  it('shows error if fullName is too short', async () => {
    render(
      <ProfileForm
        defaultValues={{ fullName: 'John Doe', email: 'john@test.com' }}
        onSubmit={mockSubmit}
        isPending={false}
      />,
      { wrapper: createWrapper() },
    )

    const input = screen.getByLabelText('Display Name')
    fireEvent.change(input, { target: { value: 'Jo' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(
        screen.getByText('Username must be at least 3 characters'),
      ).toBeInTheDocument()
    })
  })
})
