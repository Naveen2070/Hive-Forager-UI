import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SecurityForm } from './SecurityForm'
import { createWrapper } from '@/test/utils'

const mockSubmit = vi.fn()

describe('SecurityForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders password fields', () => {
    render(<SecurityForm onSubmit={mockSubmit} isPending={false} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    render(<SecurityForm onSubmit={mockSubmit} isPending={false} />, {
      wrapper: createWrapper(),
    })

    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different' },
    })

    fireEvent.click(screen.getByText('Update Password'))

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    })
  })

  it('calls onSubmit and resets form when valid', async () => {
    render(<SecurityForm onSubmit={mockSubmit} isPending={false} />, {
      wrapper: createWrapper(),
    })

    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'newpassword123' },
    })

    fireEvent.click(screen.getByText('Update Password'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      // Inputs should be cleared
      expect(screen.getByLabelText('Current Password')).toHaveValue('')
    })
  })
})
