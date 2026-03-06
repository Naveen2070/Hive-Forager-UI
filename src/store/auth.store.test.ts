
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from './auth.store'
import { authApi } from '@/api/auth'
import { getContext } from '@/integrations/tanstack-query/root-provider'

// Mock dependencies
vi.mock('@/api/auth', () => ({
  authApi: {
    logout: vi.fn(),
  },
}))

vi.mock('@/integrations/tanstack-query/root-provider', () => ({
  getContext: vi.fn(),
}))

describe('Auth Store', () => {
  const mockQueryClient = { clear: vi.fn() }
  
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getContext as any).mockReturnValue({ queryClient: mockQueryClient })
    useAuthStore.getState().clearAuth() // reset state
    // Suppress console.error in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should update state on setAuth', () => {
    const mockUser = { id: '1', email: 'test@example.com' } as any
    const mockToken = 'mock-token'

    useAuthStore.getState().setAuth(mockUser, mockToken)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should clear state on clearAuth', () => {
    useAuthStore.getState().setAuth({ id: '1' } as any, 'token')
    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should call api logout and clear queryClient on logout', async () => {
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
    useAuthStore.getState().setAuth({ id: '1' } as any, 'token')
    
    ;(authApi.logout as any).mockResolvedValueOnce(undefined)

    await useAuthStore.getState().logout()

    expect(authApi.logout).toHaveBeenCalled()
    expect(mockQueryClient.clear).toHaveBeenCalled()
    
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should still clear state and queryClient if api logout fails', async () => {
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
    useAuthStore.getState().setAuth({ id: '1' } as any, 'token')
    
    ;(authApi.logout as any).mockRejectedValueOnce(new Error('Network error'))

    await useAuthStore.getState().logout()

    expect(authApi.logout).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Logout API call failed', expect.any(Error))
    expect(mockQueryClient.clear).toHaveBeenCalled()
    
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should skip api logout if mock auth is enabled', async () => {
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'true')
    useAuthStore.getState().setAuth({ id: '1' } as any, 'token')
    
    await useAuthStore.getState().logout()

    expect(authApi.logout).not.toHaveBeenCalled()
    expect(mockQueryClient.clear).toHaveBeenCalled()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
