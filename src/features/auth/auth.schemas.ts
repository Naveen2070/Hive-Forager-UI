import * as z from 'zod'
import { UserRole } from '@/types/enum'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Username must be at least 3 chars'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 chars'),
    domainAccess: z.array(z.string("events")),
    role: z.enum(UserRole),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
