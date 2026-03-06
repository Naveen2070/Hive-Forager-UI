import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/dashboard' }),
  useNavigate: () => mockNavigate,
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('Sidebar Component', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { fullName: 'Test User', role: UserRole.ORGANIZER },
      logout: mockLogout,
    })
  })

  it('renders correctly for organizer', () => {
    render(<Sidebar />)
    
    // Desktop sidebar has links
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cinemas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Create Event').length).toBeGreaterThan(0)
    // Should not see 'My Bookings' as organizer
    expect(screen.queryByText('My Bookings')).not.toBeInTheDocument()
    
    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0)
  })

  it('renders correctly for customer', () => {
    ;(useAuthStore as any).mockReturnValue({
      user: { fullName: 'Customer', role: UserRole.USER },
      logout: mockLogout,
    })

    render(<Sidebar />)
    
    // Customer should not see Dashboard/Cinemas/Create Event
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Cinemas')).not.toBeInTheDocument()
    
    // Customer should see My Bookings
    expect(screen.getAllByText('My Bookings').length).toBeGreaterThan(0)
  })

  it('calls logout and navigates to login', async () => {
    render(<Sidebar />)
    
    // There are desktop and mobile versions, grab the first logout button
    const logoutButtons = screen.getAllByRole('button', { name: /log out/i })
    fireEvent.click(logoutButtons[0])
    
    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
  })

  it('navigates to settings', () => {
    render(<Sidebar />)
    
    const settingsButtons = screen.getAllByRole('button', { name: /settings/i })
    fireEvent.click(settingsButtons[0])
    
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/settings' })
  })
})
