import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TicketTiersField } from './TicketTiersField'
import { FormProvider, useForm } from 'react-hook-form'

const Wrapper = ({ children }: any) => {
  const methods = useForm({
    defaultValues: {
      ticketTiers: [
        {
          name: 'Standard',
          price: 0,
          totalAllocation: 100,
          enableCustomDates: false,
        },
      ],
    },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('TicketTiersField', () => {
  it('renders initial ticket tier', () => {
    render(<TicketTiersField />, { wrapper: Wrapper })

    expect(screen.getByDisplayValue('Standard')).toBeInTheDocument()
  })

  it('adds a new ticket tier when button is clicked', () => {
    render(<TicketTiersField />, { wrapper: Wrapper })

    fireEvent.click(screen.getByText('Add Ticket Type'))

    const inputs = screen.getAllByPlaceholderText('e.g. Early Bird')
    expect(inputs.length).toBe(2)
  })

  it('removes a ticket tier when delete button is clicked', () => {
    render(<TicketTiersField />, { wrapper: Wrapper })

    fireEvent.click(screen.getByText('Add Ticket Type'))
    let deleteButtons = screen
      .getAllByRole('button', { name: '' })
      .filter((b) => b.querySelector('.lucide-trash2'))

    fireEvent.click(deleteButtons[0])

    const inputs = screen.getAllByPlaceholderText('e.g. Early Bird')
    expect(inputs.length).toBe(1)
  })

  it('shows custom date fields when checkbox is checked', () => {
    render(<TicketTiersField />, { wrapper: Wrapper })

    const checkbox = screen.getByLabelText(/Set custom validity dates/i)
    fireEvent.click(checkbox)

    expect(screen.getByText('Valid From')).toBeInTheDocument()
    expect(screen.getByText('Valid Until')).toBeInTheDocument()
  })
})
