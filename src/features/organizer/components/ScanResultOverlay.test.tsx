import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScanResultOverlay } from './ScanResultOverlay'
import { ScanStatus } from '@/types/enum'

const mockReset = vi.fn()

describe('ScanResultOverlay', () => {
  it('renders nothing when status is IDLE', () => {
    const { container } = render(
      <ScanResultOverlay status={ScanStatus.IDLE} onReset={mockReset} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders loading state when status is PENDING', () => {
    render(
      <ScanResultOverlay status={ScanStatus.PENDING} onReset={mockReset} />,
    )
    expect(screen.getByText('Verifying...')).toBeInTheDocument()
  })

  it('renders error state with message', () => {
    render(
      <ScanResultOverlay
        status={ScanStatus.ERROR}
        onReset={mockReset}
        data={{ message: 'Invalid reference', referenceId: 'REF-000' }}
      />,
    )
    expect(screen.getByText(/Denied/i)).toBeInTheDocument()
    expect(screen.getByText(/Invalid reference/i)).toBeInTheDocument()
    expect(screen.getByText(/REF-000/i)).toBeInTheDocument()
  })

  it('renders "Already Scanned" state', () => {
    render(
      <ScanResultOverlay
        status={ScanStatus.ALREADY_SCANNED}
        onReset={mockReset}
        data={{ attendeeName: 'John Doe' }}
      />,
    )
    expect(screen.getByText('Already Scanned')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders success state with attendee info', () => {
    render(
      <ScanResultOverlay
        status={ScanStatus.SUCCESS}
        onReset={mockReset}
        data={{ attendeeName: 'Alice', ticketTier: 'VIP' }}
      />,
    )
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('VIP')).toBeInTheDocument()
  })

  it('calls onReset when clicked (except for PENDING)', () => {
    const { rerender } = render(
      <ScanResultOverlay status={ScanStatus.SUCCESS} onReset={mockReset} />,
    )
    fireEvent.click(screen.getByText('Welcome').parentElement!.parentElement!)
    expect(mockReset).toHaveBeenCalledTimes(1)

    vi.clearAllMocks()
    rerender(
      <ScanResultOverlay status={ScanStatus.PENDING} onReset={mockReset} />,
    )
    fireEvent.click(
      screen.getByText('Verifying...').parentElement!.parentElement!,
    )
    expect(mockReset).not.toHaveBeenCalled()
  })
})
