import { z } from 'zod'

export const showtimeFormSchema = z.object({
  cinemaId: z.string().min(1, 'Please select a cinema'),
  auditoriumId: z.string().min(1, 'Please select an auditorium'),
  startTimeUtc: z.string().min(1, 'Please select a date and time'),
  basePrice: z.coerce.number().min(1, 'Base price must be at least $1'),
})

export type ShowtimeFormValues = z.infer<typeof showtimeFormSchema>
