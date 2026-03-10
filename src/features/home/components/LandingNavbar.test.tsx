import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LandingNavbar } from './LandingNavbar'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('LandingNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login/register links when not authenticated', () => {
    ;(useAuthStore as any).mockReturnValue({ isAuthenticated: false })
    render(<LandingNavbar />)

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('renders "Go to Dashboard" when authenticated as organizer', () => {
    ;(useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { role: UserRole.ORGANIZER },
    })
    render(<LandingNavbar />)

    const dashboardLink = screen.getByRole('link', { name: /Go to Dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  it('renders "Go to Dashboard" (bookings) when authenticated as user', () => {
    ;(useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { role: UserRole.USER },
    })
    render(<LandingNavbar />)

    const dashboardLink = screen.getByRole('link', { name: /Go to Dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/bookings')
  })
})
