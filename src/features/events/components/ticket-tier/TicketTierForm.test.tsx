import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TicketTierForm } from './TicketTierForm'
import { createWrapper } from '@/test/utils'

const mockSubmit = vi.fn()
const mockCancel = vi.fn()

const defaultValues = {
  name: '',
  price: 0,
  totalAllocation: 100,
  validFrom: '',
  validUntil: '',
}

describe('TicketTierForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with default values', () => {
    render(
      <TicketTierForm
        defaultValues={defaultValues}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isPending={false}
        submitLabel="Add Tier"
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByPlaceholderText('VIP Pass')).toHaveValue('')
    // Use getByRole or search by type if label is broken
    const priceInput = screen.getByDisplayValue('0')
    const quantityInput = screen.getByDisplayValue('100')
    expect(priceInput).toBeInTheDocument()
    expect(quantityInput).toBeInTheDocument()
  })

  it('calls onSubmit with form data when valid', async () => {
    render(
      <TicketTierForm
        defaultValues={defaultValues}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isPending={false}
        submitLabel="Add Tier"
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.change(screen.getByPlaceholderText('VIP Pass'), {
      target: { value: 'Early Bird' },
    })
    fireEvent.change(screen.getByDisplayValue('0'), { target: { value: '50' } })
    fireEvent.change(screen.getByDisplayValue('100'), {
      target: { value: '200' },
    })

    fireEvent.click(screen.getByText('Add Tier'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          name: 'Early Bird',
          price: 50,
          totalAllocation: 200,
          validFrom: '',
          validUntil: '',
        },
        expect.anything(),
      )
    })
  })

  it('shows validation error for empty name', async () => {
    render(
      <TicketTierForm
        defaultValues={defaultValues}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isPending={false}
        submitLabel="Add Tier"
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByText('Add Tier'))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <TicketTierForm
        defaultValues={defaultValues}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isPending={false}
        submitLabel="Add Tier"
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(mockCancel).toHaveBeenCalled()
  })
})
