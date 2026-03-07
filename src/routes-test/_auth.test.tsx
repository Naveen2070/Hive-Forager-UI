import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthLayout } from '../routes/_auth'
import { createWrapper } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
  useLocation: () => ({ pathname: '/login' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('AuthLayout Route', () => {
  it('renders branding and outlet', async () => {
    await act(async () => {
      render(<AuthLayout />, { wrapper: createWrapper() })
    })

    expect(screen.getByAltText(/Hive Forager Logo/i)).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByText(/Elena Rodriguez/i)).toBeInTheDocument()
  })
})
