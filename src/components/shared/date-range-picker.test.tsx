import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePickerWithRange } from './date-range-picker'
import { format } from 'date-fns'

describe('DatePickerWithRange', () => {
  it('renders "Pick a date range" when no date is selected', () => {
    const setDate = vi.fn()
    render(<DatePickerWithRange setDate={setDate} />)
    
    expect(screen.getByText('Pick a date range')).toBeInTheDocument()
  })

  it('renders formatted start date when only from is selected', () => {
    const setDate = vi.fn()
    const fromDate = new Date(2023, 0, 1) // Jan 1, 2023
    render(<DatePickerWithRange date={{ from: fromDate }} setDate={setDate} />)
    
    expect(screen.getByText(format(fromDate, 'LLL dd, y'))).toBeInTheDocument()
  })

  it('renders formatted date range when both from and to are selected', () => {
    const setDate = vi.fn()
    const fromDate = new Date(2023, 0, 1) // Jan 1, 2023
    const toDate = new Date(2023, 0, 10) // Jan 10, 2023
    
    render(<DatePickerWithRange date={{ from: fromDate, to: toDate }} setDate={setDate} />)
    
    const expectedText = `${format(fromDate, 'LLL dd, y')} - ${format(toDate, 'LLL dd, y')}`
    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })

  it('opens calendar popover on click', () => {
    const setDate = vi.fn()
    render(<DatePickerWithRange setDate={setDate} />)
    
    const button = screen.getByRole('button', { name: /pick a date range/i })
    fireEvent.click(button)
    
    // Check if the calendar element (specifically the role dialog or table) is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
