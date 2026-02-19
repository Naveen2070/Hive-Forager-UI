import { useMutation } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import type {
  LoginRequest,
  RegisterUserRequest,
  UserDTO,
} from '@/types/auth.type.ts'
import { UserRole } from '@/types/enum.ts'
import { useAuthStore } from '@/store/auth.store.ts'
import { authApi } from '@/api/auth.ts'
import { parseJwt } from '@/lib/jwt.ts'

export const useAuth = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const search = useSearch({ strict: false })
  // 1. Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: async (data) => {
      const decoded = parseJwt(data.token)

      if (!decoded) {
        toast.error('Invalid response from server')
        return
      }

      // 1. Parse Roles
      const rawRoles = decoded.roles
      const primaryRole =
        rawRoles.length > 0 ? rawRoles[0].replace('ROLE_', '') : 'USER'

      // 2. Construct User
      const user = {
        id: decoded.id,
        fullName: decoded.email.split('@')[0],
        email: decoded.email,
        role: primaryRole as UserRole,
        createdAt:"",
        isActive:true,
      } as UserDTO

      setAuth(user, data.token)
      toast.success(`Welcome back, ${user.fullName}!`)
      const redirectUrl = search.redirect

      if (redirectUrl) {
        await navigate({ to: redirectUrl })
        return
      }

      // 2. Role-Based Default Destinations
      if (user.role === UserRole.ORGANIZER) {
        await navigate({ to: '/dashboard' })
      } else {
        await navigate({ to: '/events' })
      }
    },
    onError: (error: any) => {
      clearAuth()
      const msg =
        error.response?.data?.message ||
        'Login failed. Please check your credentials.'
      toast.error(msg)
    },
  })

  // 2. Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterUserRequest) => authApi.register(data),
    onSuccess: async () => {
      toast.success('Registration successful! Please login.')
      await navigate({ to: '/login' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    },
  })

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  }
}
