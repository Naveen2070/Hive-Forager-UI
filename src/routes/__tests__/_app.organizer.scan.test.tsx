import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ScannerPage } from '../_app.organizer.scan'
import { useCheckIn } from '@/features/organizer/hooks/useCheckIn'
import { useCheckInTicket } from '@/features/tickets/hooks/useTickets'
import { createWrapper } from '@/test/utils'

// Mock the QR Scanner component
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: () => <div data-testid="mock-scanner" />,
}))

vi.mock('@/features/organizer/hooks/useCheckIn', () => ({
  useCheckIn: vi.fn(),
}))

vi.mock('@/features/tickets/hooks/useTickets', () => ({
  useCheckInTicket: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('ScannerPage Route', () => {
  const mockCheckInEvent = vi.fn()
  const mockCheckInMovie = vi.fn()
  const mockResetEvent = vi.fn()
  const mockResetMovie = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useCheckIn as any).mockReturnValue({
      mutate: mockCheckInEvent,
      reset: mockResetEvent,
    })
    ;(useCheckInTicket as any).mockReturnValue({
      mutate: mockCheckInMovie,
      reset: mockResetMovie,
    })
  })

  it('renders initial state in EVENTS mode', async () => {
    await act(async () => {
      render(<ScannerPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Ticket Scanner/i)).toBeInTheDocument()
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument()
    // Events button is active (check via text since it's a styled component)
    expect(screen.getByText('Events')).toBeInTheDocument()
  })

  it('switches between Events and Movies modes', async () => {
    await act(async () => {
      render(<ScannerPage />, { wrapper: createWrapper() })
    })

    const movieButton = screen.getByText('Movies')
    await act(async () => {
      fireEvent.click(movieButton)
    })

    expect(mockResetEvent).toHaveBeenCalled()
    expect(mockResetMovie).toHaveBeenCalled()
  })

  it('resets scanner state when Reset button is clicked', async () => {
    await act(async () => {
      render(<ScannerPage />, { wrapper: createWrapper() })
    })

    const resetButton = screen.getByText(/Reset/i)
    await act(async () => {
      fireEvent.click(resetButton)
    })

    expect(mockResetEvent).toHaveBeenCalled()
    expect(mockResetMovie).toHaveBeenCalled()
  })
})
