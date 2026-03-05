import type { AuditoriumResponse } from '@/types/auditorium.type'

export const MOCK_AUDITORIUMS: AuditoriumResponse[] = [
  // --- cinema-111: Hive Multiplex Downtown ---
  {
    id: 'aud-111',
    cinemaId: 'cinema-111',
    name: 'IMAX Screen 1',
    maxRows: 10,
    maxColumns: 15,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 13 },
        { row: 0, col: 14 },
        { row: 1, col: 0 },
        { row: 1, col: 14 },
      ],
      wheelchairSpots: [
        { row: 9, col: 6 },
        { row: 9, col: 8 },
      ],
      tiers: [
        {
          tierName: 'VIP Recliners',
          priceSurcharge: 5.0,
          seats: [
            { row: 5, col: 4 },
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 8 },
            { row: 5, col: 9 },
            { row: 5, col: 10 },
          ],
        },
      ],
    },
  },
  {
    id: 'aud-112',
    cinemaId: 'cinema-111',
    name: 'Dolby Atmos Screen 2',
    maxRows: 8,
    maxColumns: 12,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 11 },
      ],
      wheelchairSpots: [
        { row: 7, col: 5 },
        { row: 7, col: 6 },
      ],
      tiers: [
        {
          tierName: 'Premium Center',
          priceSurcharge: 3.0,
          seats: [
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 4, col: 6 },
            { row: 4, col: 7 },
          ],
        },
      ],
    },
  },
  {
    id: 'aud-113',
    cinemaId: 'cinema-111',
    name: 'Standard Screen 3',
    maxRows: 7,
    maxColumns: 10,
    layout: {
      disabledSeats: [],
      wheelchairSpots: [
        { row: 6, col: 4 },
        { row: 6, col: 5 },
      ],
      tiers: [],
    },
  },

  // --- cinema-222: Alamo Drafthouse Austin ---
  {
    id: 'aud-221',
    cinemaId: 'cinema-222',
    name: 'Main Hall',
    maxRows: 9,
    maxColumns: 14,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 13 },
      ],
      wheelchairSpots: [
        { row: 8, col: 6 },
        { row: 8, col: 7 },
      ],
      tiers: [
        {
          tierName: 'Recliner Row',
          priceSurcharge: 4.0,
          seats: [
            { row: 5, col: 3 },
            { row: 5, col: 4 },
            { row: 5, col: 5 },
            { row: 5, col: 8 },
            { row: 5, col: 9 },
            { row: 5, col: 10 },
          ],
        },
      ],
    },
  },
  {
    id: 'aud-222',
    cinemaId: 'cinema-222',
    name: 'Drafthouse Screen 2',
    maxRows: 8,
    maxColumns: 12,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 11 },
      ],
      wheelchairSpots: [{ row: 7, col: 5 }],
      tiers: [],
    },
  },

  // --- cinema-333: Starlight Cinemas Westside ---
  {
    id: 'aud-331',
    cinemaId: 'cinema-333',
    name: 'Starlight IMAX',
    maxRows: 11,
    maxColumns: 16,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 14 },
        { row: 0, col: 15 },
      ],
      wheelchairSpots: [
        { row: 10, col: 7 },
        { row: 10, col: 8 },
      ],
      tiers: [
        {
          tierName: 'Gold Class',
          priceSurcharge: 6.0,
          seats: [
            { row: 6, col: 5 },
            { row: 6, col: 6 },
            { row: 6, col: 7 },
            { row: 6, col: 9 },
            { row: 6, col: 10 },
            { row: 6, col: 11 },
          ],
        },
      ],
    },
  },
  {
    id: 'aud-333',
    cinemaId: 'cinema-333',
    name: 'Westside Screen 2',
    maxRows: 8,
    maxColumns: 13,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 12 },
      ],
      wheelchairSpots: [{ row: 7, col: 6 }],
      tiers: [],
    },
  },

  // --- cinema-444: Grand Rex Theatres ---
  {
    id: 'aud-441',
    cinemaId: 'cinema-444',
    name: 'Grand Hall',
    maxRows: 12,
    maxColumns: 18,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 16 },
        { row: 0, col: 17 },
      ],
      wheelchairSpots: [
        { row: 11, col: 8 },
        { row: 11, col: 9 },
        { row: 11, col: 10 },
      ],
      tiers: [
        {
          tierName: 'Royal Circle',
          priceSurcharge: 7.0,
          seats: [
            { row: 6, col: 6 },
            { row: 6, col: 7 },
            { row: 6, col: 8 },
            { row: 6, col: 10 },
            { row: 6, col: 11 },
            { row: 6, col: 12 },
          ],
        },
      ],
    },
  },
  {
    id: 'aud-444',
    cinemaId: 'cinema-444',
    name: 'Rex Screen 2',
    maxRows: 9,
    maxColumns: 14,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 13 },
      ],
      wheelchairSpots: [
        { row: 8, col: 6 },
        { row: 8, col: 7 },
      ],
      tiers: [
        {
          tierName: 'Premium',
          priceSurcharge: 3.0,
          seats: [
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
            { row: 5, col: 8 },
          ],
        },
      ],
    },
  },

  // --- cinema-555: Cineworld Lakefront (PENDING — limited auditoriums) ---
  {
    id: 'aud-551',
    cinemaId: 'cinema-555',
    name: 'Lakefront Screen 1',
    maxRows: 8,
    maxColumns: 12,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 11 },
      ],
      wheelchairSpots: [{ row: 7, col: 5 }],
      tiers: [],
    },
  },
  {
    id: 'aud-555',
    cinemaId: 'cinema-555',
    name: 'Lakefront Screen 2',
    maxRows: 7,
    maxColumns: 11,
    layout: {
      disabledSeats: [],
      wheelchairSpots: [{ row: 6, col: 5 }],
      tiers: [],
    },
  },

  // --- cinema-666: Beacon IMAX Experience ---
  {
    id: 'aud-661',
    cinemaId: 'cinema-666',
    name: 'Beacon IMAX',
    maxRows: 10,
    maxColumns: 16,
    layout: {
      disabledSeats: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 14 },
        { row: 0, col: 15 },
      ],
      wheelchairSpots: [
        { row: 9, col: 7 },
        { row: 9, col: 8 },
      ],
      tiers: [
        {
          tierName: 'IMAX Premium',
          priceSurcharge: 6.0,
          seats: [
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
            { row: 5, col: 9 },
            { row: 5, col: 10 },
            { row: 5, col: 11 },
          ],
        },
      ],
    },
  },
]
