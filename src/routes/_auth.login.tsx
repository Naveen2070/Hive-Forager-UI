import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/features/auth/components/LoginForm.tsx'
import { useAuthStore } from '@/store/auth.store.ts'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_auth/login')({
  component: LoginForm,
  validateSearch: loginSearchSchema,
  beforeLoad: ({ search }) => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: search.redirect || '/' })
    }
  },
})
