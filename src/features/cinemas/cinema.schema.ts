import { z } from 'zod'

export const createCinemaSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  contactEmail: z.email('Invalid email address'),
})

export type createCinemaValues = z.infer<typeof createCinemaSchema>
