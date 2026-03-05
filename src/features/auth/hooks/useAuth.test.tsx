import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import { parseJwt } from '@/lib/jwt'
import { UserRole } from '@/types/enum'

// 1. Mock external dependencies
vi.mock('@/api/auth.ts', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

vi.mock('@/lib/jwt.ts', () => ({
  parseJwt: vi.fn(),
}))

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
        roles: ['ROLE_USER'],
      }

      ;(authApi.login as any).mockResolvedValueOnce({ token: mockToken })
      ;(parseJwt as any).mockReturnValueOnce(mockUser)

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
      ;(authApi.login as any).mockResolvedValueOnce({ token: 'token' })
      ;(parseJwt as any).mockReturnValueOnce({
        id: '1',
        email: 'admin@example.com',
        roles: ['ROLE_ORGANIZER'],
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
      ;(authApi.login as any).mockRejectedValueOnce({
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
      ;(authApi.login as any).mockRejectedValueOnce({
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
      ;(authApi.login as any).mockResolvedValueOnce({ token: mockToken })
      ;(parseJwt as any).mockReturnValueOnce({
        id: '1',
        email: 'test@example.com',
        roles: ['ROLE_USER'],
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
      ;(authApi.login as any).mockResolvedValueOnce({ token: 'invalid-token' })
      ;(parseJwt as any).mockReturnValueOnce(null)

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
      ;(authApi.register as any).mockResolvedValueOnce({ id: '1' })

      const { result } = renderHook(() => useAuth(), { wrapper })

      const registerData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        domainAccess: ['events'],
        role: UserRole.USER,
      }

      await act(async () => {
        result.current.register(registerData)
      })

      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalledWith(registerData)
        expect(toast.success).toHaveBeenCalledWith(
          'Registration successful! Please login.',
        )
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
      })
    })

    it('should show error toast on registration failure', async () => {
      const errorMsg = 'Email already taken'
      ;(authApi.register as any).mockRejectedValueOnce({
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
