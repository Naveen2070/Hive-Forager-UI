import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LoginForm } from './LoginForm'
import { useAuthStore } from '@/store/auth.store'
// Import mocked modules
import { authApi } from '@/api/auth.ts'
import { parseJwt } from '@/lib/jwt.ts'

// 1. Mock external dependencies
vi.mock('@/api/auth.ts', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

vi.mock('@/lib/jwt.ts', () => ({
  parseJwt: vi.fn(),
  getPrimaryRole: vi.fn((payload, domain = 'events') => {
    if (!payload || !payload.permissions || !payload.permissions[domain]) {
      return 'USER'
    }
    const roles = payload.permissions[domain]
    if (roles.length === 0) return 'USER'
    return roles[0].replace('ROLE_', '')
  }),
}))

const mockNavigate = vi.fn()
let mockSearch = { redirect: undefined as string | undefined }

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearch,
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Test setup
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}

describe('LoginForm - Edge to Edge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().clearAuth()
    mockSearch = { redirect: undefined }
  })

  it('renders correctly with fields and links', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('user@hiveforager.com'),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByTestId('link-/forgot-password')).toBeInTheDocument()
    expect(screen.getByTestId('link-/register')).toBeInTheDocument()
  })

  it('shows validation errors for empty submission', async () => {
    renderWithProviders(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Email or Username is required'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Password must be at least 6 characters'),
      ).toBeInTheDocument()
    })
  })

  it('successfully logs in and updates state', async () => {
    ; (authApi.login as any).mockResolvedValueOnce({ token: 'mock-token' })
      ; (parseJwt as any).mockReturnValueOnce({
        id: '123',
        email: 'john@example.com',
        permissions: { events: ['ROLE_USER'] },
      })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Welcome back, john!')
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/events' })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  it('handles ORGANIZER login correctly', async () => {
    ; (authApi.login as any).mockResolvedValueOnce({ token: 'token' })
      ; (parseJwt as any).mockReturnValueOnce({
        id: '999',
        email: 'admin@example.com',
        permissions: { events: ['ROLE_ORGANIZER'] },
      })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' })
      expect(useAuthStore.getState().user?.role).toBe('ORGANIZER')
    })
  })

  it('disables button during login', async () => {
    const promise = new Promise((resolve) =>
      setTimeout(() => resolve({ token: 't' }), 100),
    )
      ; (authApi.login as any).mockReturnValueOnce(promise)
      ; (parseJwt as any).mockReturnValue({ permissions: {} })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /logging in.../i }),
      ).toBeDisabled()
    })
  })

  it('handles API errors with raw Error object', async () => {
    ; (authApi.login as any).mockRejectedValueOnce(new Error('Network Error'))

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'e@e.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed. Please check your credentials.')
    })
  })

  it('redirects to the specified redirect search param after login', async () => {
    mockSearch = { redirect: '/dashboard/settings' }

      ; (authApi.login as any).mockResolvedValueOnce({ token: 'mock-token' })
      ; (parseJwt as any).mockReturnValueOnce({
        id: '123',
        email: 'john@example.com',
        permissions: { events: ['ROLE_USER'] },
      })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard/settings',
      })
    })
  })

  it('submits the form successfully', async () => {
    ; (authApi.login as any).mockResolvedValueOnce({ token: 'token' })
      ; (parseJwt as any).mockReturnValueOnce({ permissions: {} })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('user@hiveforager.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    })

    // Find the form and submit it
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')
    fireEvent.submit(form!)

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled()
    })
  })
})
