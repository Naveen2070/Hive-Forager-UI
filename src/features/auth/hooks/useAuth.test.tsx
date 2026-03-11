import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from './useAuth'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { parseJwt } from '@/lib/jwt'

// 1. Mock external dependencies
vi.mock('@/api/auth.ts', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

vi.mock('@/lib/jwt.ts', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@/lib/jwt.ts')>()
  return {
    ...actual,
    parseJwt: vi.fn(),
  }
})

const mockNavigate = vi.fn()
const mockUseSearch = vi.fn(() => ({ redirect: undefined }))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSearch.mockReturnValue({ redirect: undefined })
    useAuthStore.getState().clearAuth()
  })

  describe('login', () => {
    it('should call login API and update store on success', async () => {
      const mockToken = 'mock-token'
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        permissions: { events: ['ROLE_USER'] },
      }

        ; (authApi.login as any).mockResolvedValueOnce({ token: mockToken })
        ; (parseJwt as any).mockReturnValueOnce(mockUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalled()
        expect(useAuthStore.getState().isAuthenticated).toBe(true)
        expect(useAuthStore.getState().token).toBe(mockToken)
        expect(toast.success).toHaveBeenCalledWith('Welcome back, test!')
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/events' })
      })
    })

    it('should redirect to dashboard for ORGANIZER role', async () => {
      ; (authApi.login as any).mockResolvedValueOnce({ token: 'token' })
        ; (parseJwt as any).mockReturnValueOnce({
          id: '1',
          email: 'admin@example.com',
          permissions: { events: ['ROLE_ORGANIZER'] },
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({
          email: 'admin@example.com',
          password: 'password',
        })
      })

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' }),
      )
    })

    it('should show error toast on failure', async () => {
      const errorMsg = 'Invalid credentials'
        ; (authApi.login as any).mockRejectedValueOnce({
          response: { data: { message: errorMsg } },
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({ email: 'test@example.com', password: 'wrong' })
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMsg)
        expect(useAuthStore.getState().isAuthenticated).toBe(false)
      })
    })

    it('should use default fallback error message if API provides no message', async () => {
      ; (authApi.login as any).mockRejectedValueOnce({
        response: { data: {} },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({ email: 'test@example.com', password: 'wrong' })
      })

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          'Login failed. Please check your credentials.',
        ),
      )
    })

    it('should redirect to a custom URL if provided in search params', async () => {
      mockUseSearch.mockReturnValue({ redirect: '/checkout' } as any)

      const mockToken = 'mock-token'
        ; (authApi.login as any).mockResolvedValueOnce({ token: mockToken })
        ; (parseJwt as any).mockReturnValueOnce({
          id: '1',
          email: 'test@example.com',
          permissions: { events: ['ROLE_USER'] },
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({
          email: 'test@example.com',
          password: 'password',
        })
      })

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/checkout' }),
      )
    })

    it('should handle JWT parsing failure gracefully', async () => {
      ; (authApi.login as any).mockResolvedValueOnce({ token: 'invalid-token' })
        ; (parseJwt as any).mockReturnValueOnce(null)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.login({
          email: 'test@example.com',
          password: 'password',
        })
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid response from server')
        expect(useAuthStore.getState().isAuthenticated).toBe(false)
      })
    })
  })

  describe('register', () => {
    it('should call register API and navigate to login on success', async () => {
      ; (authApi.register as any).mockResolvedValueOnce({ id: '1' })

      const { result } = renderHook(() => useAuth(), { wrapper })

      const mockData = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        domainRoles: { events: 'USER' },
      }

      await act(async () => {
        result.current.register(mockData as any)
      })

      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalledWith(mockData)
        expect(toast.success).toHaveBeenCalledWith(
          'Registration successful! Please login.',
        )
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
      })
    })

    it('should show error toast on registration failure', async () => {
      const errorMsg = 'Email already taken'
        ; (authApi.register as any).mockRejectedValueOnce({
          response: { data: { message: errorMsg } },
        })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        result.current.register({} as any)
      })

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMsg))
    })
  })
})
