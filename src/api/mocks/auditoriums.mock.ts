import type { AuditoriumResponse } from '@/types/auditorium.type'

export const MOCK_AUDITORIUMS: AuditoriumResponse[] = [
  {
    id: 'aud-111',
    cinemaId: 'cinema-111',
    name: 'IMAX Screen 1',
    maxRows: 10,
    maxColumns: 15,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 14 },
      ],
      wheelchairSpots: [
        { row: 9, col: 7 },
        { row: 9, col: 8 },
      ],
      tiers: [
        {
          tierName: 'VIP Recliners',
          priceSurcharge: 5.0,
          seats: [
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
            { row: 5, col: 8 },
            { row: 5, col: 9 },
          ],
        },
      ],
    },
  },
]
