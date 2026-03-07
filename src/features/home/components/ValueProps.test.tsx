import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ValueProps } from './ValueProps'

describe('ValueProps Component', () => {
  it('renders all value proposition boxes', () => {
    render(<ValueProps />)

    expect(
      screen.getByText(/Your ultimate entertainment hub/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Events & Movies in One Wallet'),
    ).toBeInTheDocument()
    expect(screen.getByText('Real-Time Seatmaps')).toBeInTheDocument()
    expect(screen.getByText('Bank-Grade Security')).toBeInTheDocument()
    expect(screen.getByText('Instant Offline Access')).toBeInTheDocument()
  })
})
