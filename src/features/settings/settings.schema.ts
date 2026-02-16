import { z } from 'zod'

export const settingsSchema = z.object({
  fullName: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email'),
})

export type ProfileFormValues = z.infer<typeof settingsSchema>

export const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type PasswordFormValues = z.infer<typeof passwordSchema>