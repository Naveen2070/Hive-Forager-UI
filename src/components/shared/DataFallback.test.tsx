import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataFallback } from './DataFallback'

describe('DataFallback Component', () => {
  it('renders with default title and message', () => {
    render(<DataFallback />)
    expect(screen.getByText('We hit a snag.')).toBeInTheDocument()
    expect(
      screen.getByText(/Our worker bees couldn't fetch the data./),
    ).toBeInTheDocument()
  })

  it('renders with custom title and message', () => {
    const customTitle = 'Custom Title'
    const customMessage = 'Custom Message'
    render(<DataFallback title={customTitle} message={customMessage} />)
    expect(screen.getByText(customTitle)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(customMessage))).toBeInTheDocument()
  })

  it('renders the retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<DataFallback onRetry={onRetry} />)
    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn()
    render(<DataFallback onRetry={onRetry} />)
    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not render the retry button when onRetry is not provided', () => {
    render(<DataFallback />)
    const retryButton = screen.queryByRole('button', { name: /try again/i })
    expect(retryButton).not.toBeInTheDocument()
  })
})
