import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventFiltersBar } from './EventFiltersBar'
import { createWrapper } from '@/test/utils'

// Mock DatePickerWithRange
vi.mock('@/components/shared/date-range-picker', () => ({
  DatePickerWithRange: () => <div data-testid="date-picker" />,
}))

const mockUpdate = vi.fn()
const mockClear = vi.fn()

describe('EventFiltersBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with initial filters', () => {
    render(
      <EventFiltersBar
        filters={{ status: 'PUBLISHED' }}
        onUpdate={mockUpdate}
        onClear={mockClear}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Location...')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /X/i })).not.toBeInTheDocument()
  })

  it('calls onUpdate when title search changes', () => {
    render(
      <EventFiltersBar
        filters={{}}
        onUpdate={mockUpdate}
        onClear={mockClear}
      />,
      { wrapper: createWrapper() },
    )

    const input = screen.getByPlaceholderText('Search events...')
    fireEvent.change(input, { target: { value: 'concert' } })

    expect(mockUpdate).toHaveBeenCalledWith('title', 'concert')
  })

  it('calls onUpdate when location changes', () => {
    render(
      <EventFiltersBar
        filters={{}}
        onUpdate={mockUpdate}
        onClear={mockClear}
      />,
      { wrapper: createWrapper() },
    )

    const input = screen.getByPlaceholderText('Location...')
    fireEvent.change(input, { target: { value: 'New York' } })

    expect(mockUpdate).toHaveBeenCalledWith('location', 'New York')
  })

  it('shows clear button and calls onClear when filters are active', () => {
    render(
      <EventFiltersBar
        filters={{ title: 'concert' }}
        onUpdate={mockUpdate}
        onClear={mockClear}
      />,
      { wrapper: createWrapper() },
    )

    // Find button with X icon
    const clearButton = screen
      .getByRole('button', { name: '' })
      .parentElement?.querySelector('.lucide-x')?.parentElement
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton!)
    expect(mockClear).toHaveBeenCalled()
  })

  it('opens advanced filters popover', () => {
    render(
      <EventFiltersBar
        filters={{}}
        onUpdate={mockUpdate}
        onClear={mockClear}
      />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByText('Filters'))
    expect(screen.getByText('Price Range')).toBeInTheDocument()
    expect(screen.getByLabelText('Min Price')).toBeInTheDocument()
  })
})
