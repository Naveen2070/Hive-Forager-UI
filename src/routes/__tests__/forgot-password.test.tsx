import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForgotPasswordPage, Route } from '../forgot-password'
import { authApi } from '@/api/auth'
import { createWrapper } from '@/test/utils'

vi.mock('@/api/auth', () => ({
  authApi: {
    forgotPassword: vi.fn(),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('ForgotPassword Page Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial email form', async () => {
    const ForgotPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ForgotPasswordPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument()
  })

  it('validates email format before submission', async () => {
    const ForgotPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ForgotPasswordPage />, { wrapper: createWrapper() })
    })

    const emailInput = screen.getByPlaceholderText('user@example.com')
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } })
      fireEvent.click(screen.getByText('Send Reset Link'))
    })

    expect(
      await screen.findByText(/Please enter a valid email address/i),
    ).toBeInTheDocument()
  })

  it('shows success UI and reset email when API call succeeds', async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({} as any)
    const ForgotPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ForgotPasswordPage />, { wrapper: createWrapper() })
    })

    const emailInput = screen.getByPlaceholderText('user@example.com')
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'success@test.com' } })
      fireEvent.click(screen.getByText('Send Reset Link'))
    })

    expect(await screen.findByText(/Check your inbox/i)).toBeInTheDocument()
    expect(screen.getByText('success@test.com')).toBeInTheDocument()
  })
})
