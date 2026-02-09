import * as z from 'zod'

// 1. Single Tier Validation
export const ticketTierSchema = z.object({
  name: z.string().min(1, 'Tier Name is required'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  totalAllocation: z.coerce.number().min(1, 'Must have at least 1 seat'),

  enableCustomDates: z.boolean().default(false).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
})

export const createEventSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters'),
    location: z.string().min(3, 'Location is required'),

    startDate: z.string().refine((val) => new Date(val) > new Date(), {
      message: 'Start date must be in the future',
    }),
    endDate: z.string(),

    organizerEmail: z.email(),
    createdBy: z.string(),

    ticketTiers: z
      .array(ticketTierSchema)
      .min(1, 'You must create at least one ticket type'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })

export type CreateEventValues = z.infer<typeof createEventSchema>
