import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { UserDTO } from '@/types/auth.type.ts'
import { getContext } from '@/integrations/tanstack-query/root-provider.tsx'
import { authApi } from '@/api/auth.ts'

interface AuthState {
  user: UserDTO | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: UserDTO, token: string) => void
  clearAuth: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),

      logout: async () => {
        if (import.meta.env.VITE_ENABLE_MOCK_AUTH !== 'true') {
          try {
            await authApi.logout()
          } catch (error) {
            console.error('Logout API call failed', error)
          }
        }

        set({ user: null, token: null, isAuthenticated: false })
        const queryContext = getContext()
        queryContext.queryClient.clear()
      },
    }),
    {
      name: 'hive-forager-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
  import('@/api/mocks/auth.mock.ts')
    .then(({ MOCK_USER, MOCK_TOKEN }) => {
      useAuthStore.setState({
        user: MOCK_USER,
        token: MOCK_TOKEN,
        isAuthenticated: true,
      })
    })
    .catch(console.error)
}
