import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LandingFooter } from './LandingFooter'

describe('LandingFooter Component', () => {
  it('renders logo and copyright with current year', () => {
    render(<LandingFooter />)

    expect(screen.getByAltText(/Hive Forager Logo/i)).toBeInTheDocument()
    expect(screen.getByText('Hive Forager')).toBeInTheDocument()

    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })
})
