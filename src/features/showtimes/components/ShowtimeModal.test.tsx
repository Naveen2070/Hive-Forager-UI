import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ShowtimeModal } from './ShowtimeModal'
import { useMyCinemas } from '@/features/cinemas/hooks/useCinemas'
import { useAuditoriumsByCinema } from '@/features/auditoriums/hooks/useAuditoriums'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/cinemas/hooks/useCinemas', () => ({
  useMyCinemas: vi.fn(),
}))

vi.mock('@/features/auditoriums/hooks/useAuditoriums', () => ({
  useAuditoriumsByCinema: vi.fn(),
}))

// Mock Select
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="mock-select" onClick={() => onValueChange('id-1')}>
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

const mockSubmit = vi.fn()
const mockClose = vi.fn()

describe('ShowtimeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMyCinemas as any).mockReturnValue({
      data: { content: [{ id: 'id-1', name: 'Cinema 1' }] },
      isLoading: false,
    })
    ;(useAuditoriumsByCinema as any).mockReturnValue({
      data: [{ id: 'aud-1', name: 'Hall 1' }],
      isLoading: false,
    })
  })

  it('renders schedule title for new showtime', () => {
    render(
      <ShowtimeModal
        isOpen={true}
        movieTitle="Movie X"
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={null}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Schedule Showtime')).toBeInTheDocument()
    expect(screen.getByText(/Booking a slot for Movie X/i)).toBeInTheDocument()
  })

  it('renders edit title when initialData is provided', () => {
    const initialData: any = {
      cinemaId: 'id-1',
      auditoriumId: 'aud-1',
      startTimeUtc: '2025-01-01T10:00:00Z',
      basePrice: 20,
    }
    render(
      <ShowtimeModal
        isOpen={true}
        movieTitle="Movie X"
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={initialData}
      />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText('Edit Showtime')).toBeInTheDocument()
    expect(screen.getByDisplayValue('20')).toBeInTheDocument()
  })

  it('calls onSubmit with form data when valid', async () => {
    render(
      <ShowtimeModal
        isOpen={true}
        movieTitle="Movie X"
        onClose={mockClose}
        onSubmit={mockSubmit}
        initialData={null}
      />,
      { wrapper: createWrapper() },
    )

    // Select cinema (triggers mock select change to 'id-1')
    fireEvent.click(screen.getAllByTestId('mock-select')[0])
    // Select auditorium
    fireEvent.click(screen.getAllByTestId('mock-select')[1])

    fireEvent.change(screen.getByLabelText(/Start Time/i), {
      target: { value: '2025-01-01T10:00' },
    })
    fireEvent.change(screen.getByLabelText(/Base Ticket Price/i), {
      target: { value: '15' },
    })

    fireEvent.click(screen.getByText('Publish Showtime'))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })
})
