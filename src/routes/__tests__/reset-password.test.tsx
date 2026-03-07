import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from '../reset-password'
import { authApi } from '@/api/auth'
import { createWrapper } from '@/test/utils'

const mockNavigate = vi.fn()
const mockUseSearch = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
  createFileRoute: () => (options: any) => ({
    options,
    useSearch: () => mockUseSearch(),
  }),
  lazyRouteComponent: vi.fn(),
}))

vi.mock('@/api/auth', () => ({
  authApi: {
    resetPassword: vi.fn(),
  },
}))

describe('ResetPassword Page Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Invalid Link" error state when token is missing', async () => {
    mockUseSearch.mockReturnValue({ token: '' })
    const ResetPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Invalid Link/i)).toBeInTheDocument()
    expect(screen.getByText(/missing a token/i)).toBeInTheDocument()
  })

  it('renders password reset form when token is valid', async () => {
    mockUseSearch.mockReturnValue({ token: 'abc-123' })
    const ResetPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Set New Password/i)).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('••••••••').length).toBe(2)
  })

  it('validates that passwords match', async () => {
    mockUseSearch.mockReturnValue({ token: 'abc-123' })
    const ResetPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() })
    })

    await act(async () => {
      const inputs = screen.getAllByPlaceholderText('••••••••')
      fireEvent.change(inputs[0], { target: { value: 'password123' } })
      fireEvent.change(inputs[1], { target: { value: 'mismatch' } })
      fireEvent.click(screen.getByText('Reset Password'))
    })

    expect(
      await screen.findByText(/Passwords don't match/i),
    ).toBeInTheDocument()
  })

  it('calls resetPassword API and redirects to login on success', async () => {
    mockUseSearch.mockReturnValue({ token: 'valid-token' })
    vi.mocked(authApi.resetPassword).mockResolvedValue({} as any)

    const ResetPasswordPage = (Route as any).options.component
    await act(async () => {
      render(<ResetPasswordPage />, { wrapper: createWrapper() })
    })

    await act(async () => {
      const inputs = screen.getAllByPlaceholderText('••••••••')
      fireEvent.change(inputs[0], { target: { value: 'secure-pass-123' } })
      fireEvent.change(inputs[1], { target: { value: 'secure-pass-123' } })
      fireEvent.click(screen.getByText('Reset Password'))
    })

    await waitFor(() => {
      expect(authApi.resetPassword).toHaveBeenCalledWith({
        token: 'valid-token',
        newPassword: 'secure-pass-123',
      })
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
    })
  })
})
