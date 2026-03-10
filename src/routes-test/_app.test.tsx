import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppLayout, Route } from '../routes/_app'
import { useAuthStore } from '@/store/auth.store'
import { createWrapper } from '@/test/utils'

// Mock Sidebar to avoid testing it again
vi.mock('@/components/layouts/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}))

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
  useLocation: () => ({ pathname: '/test' }),
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  redirect: vi.fn((obj) => {
    const err = new Error('Redirect')
    ;(err as any).redirect = obj
    throw err
  }),
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}))

describe('AppLayout Route Guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Sidebar and Outlet', async () => {
    await act(async () => {
      render(<AppLayout />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('redirects to login with current location as search param if not authenticated', () => {
    ;(useAuthStore.getState as any).mockReturnValue({ isAuthenticated: false })
    const beforeLoad = (Route as any).options.beforeLoad

    const location = { href: '/dashboard' }

    try {
      beforeLoad({ location })
    } catch (e: any) {
      expect(e.redirect).toEqual({
        to: '/login',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  })

  it('allows access if authenticated', () => {
    ;(useAuthStore.getState as any).mockReturnValue({ isAuthenticated: true })
    const beforeLoad = (Route as any).options.beforeLoad

    const location = { href: '/dashboard' }

    expect(() => beforeLoad({ location })).not.toThrow()
  })
})
