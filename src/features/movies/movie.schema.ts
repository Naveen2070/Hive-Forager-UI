import { z } from 'zod'

export const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  durationMinutes: z.coerce.number().min(1, 'Duration must be greater than 0'),
  releaseDate: z.string().min(1, 'Release date is required'),
  posterUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
})

export type MovieFormValues = z.infer<typeof movieSchema>
