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
        await authApi.logout()
        set({ user: null, token: null, isAuthenticated: false })
        const queryContext = getContext()
        queryContext.queryClient.clear()
      },
    }),
    {
      name: 'event-hive-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
