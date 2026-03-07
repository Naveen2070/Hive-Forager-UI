import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScannerControls } from './ScannerControls'

describe('ScannerControls', () => {
  it('renders "Ready to scan" when isReady is true', () => {
    render(<ScannerControls isReady={true} onReset={vi.fn()} />)
    expect(screen.getByText('Ready to scan')).toBeInTheDocument()
  })

  it('renders "Processing..." when isReady is false', () => {
    render(<ScannerControls isReady={false} onReset={vi.fn()} />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn()
    render(<ScannerControls isReady={true} onReset={onReset} />)

    fireEvent.click(screen.getByText('Reset'))
    expect(onReset).toHaveBeenCalled()
  })
})
