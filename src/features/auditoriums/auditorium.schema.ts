import { z } from 'zod'

const seatCoordinateSchema = z.object({
  row: z.number(),
  col: z.number(),
})

const seatTierSchema = z.object({
  tierName: z.string(),
  priceSurcharge: z.number(),
  seats: z.array(seatCoordinateSchema),
})

export const auditoriumLayoutSchema = z.object({
  disabledSeats: z.array(seatCoordinateSchema),
  wheelchairSpots: z.array(seatCoordinateSchema),
  tiers: z.array(seatTierSchema),
})

export const auditoriumFormSchema = z.object({
  name: z.string().min(1, 'Screen name is required'),
  maxRows: z.coerce.number().min(1).max(50, 'Max 50 rows allowed'),
  maxColumns: z.coerce.number().min(1).max(50, 'Max 50 columns allowed'),
  layout: auditoriumLayoutSchema,
})

export type AuditoriumFormValues = z.infer<typeof auditoriumFormSchema>
