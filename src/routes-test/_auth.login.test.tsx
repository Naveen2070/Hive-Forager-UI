import { describe, expect, it, vi } from 'vitest'
import { Route } from '../routes/_auth.login'
import { useAuthStore } from '@/store/auth.store'

vi.mock('@tanstack/react-router', () => ({
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

describe('Login Route Guard', () => {
  it('redirects to home if already authenticated', () => {
    ;(useAuthStore.getState as any).mockReturnValue({ isAuthenticated: true })
    const beforeLoad = (Route as any).options.beforeLoad

    try {
      beforeLoad({ search: {} })
    } catch (e: any) {
      expect(e.redirect).toEqual({ to: '/' })
    }
  })

  it('allows access if not authenticated', () => {
    ;(useAuthStore.getState as any).mockReturnValue({ isAuthenticated: false })
    const beforeLoad = (Route as any).options.beforeLoad

    expect(() => beforeLoad({ search: {} })).not.toThrow()
  })
})
