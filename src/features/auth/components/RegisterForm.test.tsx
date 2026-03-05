import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterForm } from './RegisterForm'
import { authApi } from '@/api/auth.ts'
import { toast } from 'sonner'
import { UserRole } from '@/types/enum.ts'

// Mock external dependencies
vi.mock('@/api/auth.ts', () => ({
  authApi: {
    register: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: vi.fn(() => ({ redirect: undefined })),
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

// Mock standard Radix UI Select
vi.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, children }: any) => (
    <div
      data-testid="mock-select"
      onClick={() => onValueChange(UserRole.ORGANIZER)}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-value={value}>{children}</div>
  ),
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

describe('RegisterForm - Edge to Edge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('renders correctly with all required fields', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument()

    expect(screen.getByTestId('link-/login')).toBeInTheDocument()
  })

  it('shows validation errors for empty submissions', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Username must be at least 3 chars'),
      ).toBeInTheDocument()
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      expect(
        screen.getByText('Password must be at least 6 chars'),
      ).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    renderWithProviders(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm/i), {
      target: { value: 'password456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('successfully registers user and navigates to login', async () => {
    ;(authApi.register as any).mockResolvedValueOnce({ id: '1' })

    renderWithProviders(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith(
        'Registration successful! Please login.',
      )
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
    })
  })

  it('disables button and shows loading state during registration', async () => {
    let resolveRegister: any
    const promise = new Promise((resolve) => {
      resolveRegister = resolve
    })
    ;(authApi.register as any).mockReturnValueOnce(promise)

    renderWithProviders(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    // Button should disable immediately after validation pass
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /creating account/i }),
      ).toBeDisabled()
    })

    act(() => {
      resolveRegister({ id: '1' })
    })
  })

  it('handles server-side registration errors gracefully', async () => {
    ;(authApi.register as any).mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    })

    renderWithProviders(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists')
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
