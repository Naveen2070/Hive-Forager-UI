import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventStatusCard } from './EventStatusCard'
import { EventStatus } from '@/types/enum'
import { useUpdateEventStatus } from '@/features/events/hooks/useEvents'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/events/hooks/useEvents', () => ({
  useUpdateEventStatus: vi.fn(),
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div
      data-testid="mock-select"
      onClick={() => onValueChange(EventStatus.PUBLISHED)}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-value={value}>{children}</div>
  ),
}))

describe('EventStatusCard', () => {
  const mockUpdateStatus = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useUpdateEventStatus as any).mockReturnValue({
      mutate: mockUpdateStatus,
      isPending: false,
    })
  })

  it('renders current status correctly', () => {
    render(<EventStatusCard eventId={1} currentStatus={EventStatus.DRAFT} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Current: DRAFT')).toBeInTheDocument()
    expect(screen.queryByText('Save Status')).not.toBeInTheDocument()
  })

  it('shows "Save Status" button when status is changed', async () => {
    render(<EventStatusCard eventId={1} currentStatus={EventStatus.DRAFT} />, {
      wrapper: createWrapper(),
    })

    // Trigger mock select change
    fireEvent.click(screen.getByTestId('mock-select'))

    expect(screen.getByText('Save Status')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Save Status'))
    expect(mockUpdateStatus).toHaveBeenCalledWith(EventStatus.PUBLISHED)
  })

  it('hides "Save Status" after update', () => {
    // Actually it should hide when currentStatus prop changes to match selectedStatus
    const { rerender } = render(
      <EventStatusCard eventId={1} currentStatus={EventStatus.DRAFT} />,
      { wrapper: createWrapper() },
    )

    fireEvent.click(screen.getByTestId('mock-select'))
    expect(screen.getByText('Save Status')).toBeInTheDocument()

    rerender(
      <EventStatusCard eventId={1} currentStatus={EventStatus.PUBLISHED} />,
    )
    expect(screen.queryByText('Save Status')).not.toBeInTheDocument()
  })
})
