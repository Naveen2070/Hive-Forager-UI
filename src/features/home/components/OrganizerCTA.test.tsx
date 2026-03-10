import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrganizerCTA } from './OrganizerCTA'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('OrganizerCTA', () => {
  it('renders correctly', () => {
    render(<OrganizerCTA />)

    expect(screen.getByText(/Become a Partner/i)).toBeInTheDocument()
    expect(screen.getByText(/Fill your venues/i)).toBeInTheDocument()

    const registerLink = screen.getByRole('link', { name: /Become a Partner/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})
