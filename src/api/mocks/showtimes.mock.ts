import { SeatStatus } from '@/types/enum'
import type { ShowtimeResponse } from '@/types/showtime.type'
import type { ShowtimeSeatMapResponse } from '@/types/seating.types'

export const MOCK_SHOWTIMES: ShowtimeResponse[] = [
  // -------------------------------------------------------
  // cinema-111 · Hive Multiplex Downtown
  //   aud-111 → IMAX Screen 1
  //   aud-112 → Dolby Atmos Screen 2
  //   aud-113 → Standard Screen 3
  // -------------------------------------------------------

  // Inception: Remastered — aud-111 (IMAX)
  {
    id: 'show-001-1',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-10-31T14:00:00Z',
    basePrice: 20.5,
  },
  {
    id: 'show-001-2',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-10-31T19:30:00Z',
    basePrice: 20.5,
  },
  {
    id: 'show-001-3',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-10-31T22:30:00Z',
    basePrice: 20.5,
  },

  // Avatar: The Seed Bearer — aud-111 (IMAX)
  {
    id: 'show-006-1',
    movieId: '123e4567-e89b-12d3-a456-426614174006',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-12-18T19:00:00Z',
    basePrice: 22.0,
  },
  {
    id: 'show-006-2',
    movieId: '123e4567-e89b-12d3-a456-426614174006',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-12-19T14:00:00Z',
    basePrice: 22.0,
  },

  // Spider-Man: Beyond — aud-112 (Dolby)
  {
    id: 'show-003-1',
    movieId: '123e4567-e89b-12d3-a456-426614174003',
    auditoriumId: 'aud-112',
    startTimeUtc: '2026-12-15T17:00:00Z',
    basePrice: 17.5,
  },
  {
    id: 'show-003-2',
    movieId: '123e4567-e89b-12d3-a456-426614174003',
    auditoriumId: 'aud-112',
    startTimeUtc: '2026-12-15T20:00:00Z',
    basePrice: 17.5,
  },

  // Everything Everywhere All at Once: Again — aud-113 (Standard)
  {
    id: 'show-013-1',
    movieId: '123e4567-e89b-12d3-a456-426614174013',
    auditoriumId: 'aud-113',
    startTimeUtc: '2026-11-25T16:30:00Z',
    basePrice: 13.0,
  },
  {
    id: 'show-013-2',
    movieId: '123e4567-e89b-12d3-a456-426614174013',
    auditoriumId: 'aud-113',
    startTimeUtc: '2026-11-25T19:30:00Z',
    basePrice: 13.0,
  },

  // -------------------------------------------------------
  // cinema-222 · Alamo Drafthouse Austin
  //   aud-221 → Main Hall
  //   aud-222 → Drafthouse Screen 2
  // -------------------------------------------------------

  // The Dark Knight Returns — aud-221
  {
    id: 'show-004-1',
    movieId: '123e4567-e89b-12d3-a456-426614174004',
    auditoriumId: 'aud-221',
    startTimeUtc: '2026-11-05T19:00:00Z',
    basePrice: 16.0,
  },
  {
    id: 'show-004-2',
    movieId: '123e4567-e89b-12d3-a456-426614174004',
    auditoriumId: 'aud-221',
    startTimeUtc: '2026-11-05T22:15:00Z',
    basePrice: 16.0,
  },

  // Oppenheimer: Aftermath — aud-221
  {
    id: 'show-014-1',
    movieId: '123e4567-e89b-12d3-a456-426614174014',
    auditoriumId: 'aud-221',
    startTimeUtc: '2026-11-15T17:30:00Z',
    basePrice: 16.0,
  },
  {
    id: 'show-014-2',
    movieId: '123e4567-e89b-12d3-a456-426614174014',
    auditoriumId: 'aud-221',
    startTimeUtc: '2026-11-15T21:00:00Z',
    basePrice: 16.0,
  },

  // Knives Out: The Estate — aud-222
  {
    id: 'show-027-1',
    movieId: '123e4567-e89b-12d3-a456-426614174027',
    auditoriumId: 'aud-222',
    startTimeUtc: '2026-11-28T18:00:00Z',
    basePrice: 12.5,
  },
  {
    id: 'show-027-2',
    movieId: '123e4567-e89b-12d3-a456-426614174027',
    auditoriumId: 'aud-222',
    startTimeUtc: '2026-11-29T20:30:00Z',
    basePrice: 12.5,
  },

  // Whiplash: Encore — aud-222
  {
    id: 'show-022-1',
    movieId: '123e4567-e89b-12d3-a456-426614174022',
    auditoriumId: 'aud-222',
    startTimeUtc: '2026-11-20T19:00:00Z',
    basePrice: 11.0,
  },

  // -------------------------------------------------------
  // cinema-333 · Starlight Cinemas Westside
  //   aud-331 → Starlight IMAX
  //   aud-333 → Westside Screen 2
  // -------------------------------------------------------

  // Dune: Part Three — aud-331 (IMAX)
  {
    id: 'show-002-1',
    movieId: '123e4567-e89b-12d3-a456-426614174002',
    auditoriumId: 'aud-331',
    startTimeUtc: '2026-11-01T18:00:00Z',
    basePrice: 21.0,
  },
  {
    id: 'show-002-2',
    movieId: '123e4567-e89b-12d3-a456-426614174002',
    auditoriumId: 'aud-331',
    startTimeUtc: '2026-11-01T21:30:00Z',
    basePrice: 21.0,
  },
  {
    id: 'show-002-3',
    movieId: '123e4567-e89b-12d3-a456-426614174002',
    auditoriumId: 'aud-331',
    startTimeUtc: '2026-11-02T15:00:00Z',
    basePrice: 21.0,
  },

  // Joker: White — aud-333
  {
    id: 'show-025-1',
    movieId: '123e4567-e89b-12d3-a456-426614174025',
    auditoriumId: 'aud-333',
    startTimeUtc: '2026-11-20T20:30:00Z',
    basePrice: 13.5,
  },
  {
    id: 'show-025-2',
    movieId: '123e4567-e89b-12d3-a456-426614174025',
    auditoriumId: 'aud-333',
    startTimeUtc: '2026-11-21T18:00:00Z',
    basePrice: 13.5,
  },

  // Moonlight: Dawn — aud-333
  {
    id: 'show-035-1',
    movieId: '123e4567-e89b-12d3-a456-426614174035',
    auditoriumId: 'aud-333',
    startTimeUtc: '2026-12-01T17:00:00Z',
    basePrice: 11.0,
  },

  // -------------------------------------------------------
  // cinema-444 · Grand Rex Theatres
  //   aud-441 → Grand Hall
  //   aud-444 → Rex Screen 2
  // -------------------------------------------------------

  // Interstellar: Origins — aud-441
  {
    id: 'show-005-1',
    movieId: '123e4567-e89b-12d3-a456-426614174005',
    auditoriumId: 'aud-441',
    startTimeUtc: '2026-11-07T18:30:00Z',
    basePrice: 19.0,
  },
  {
    id: 'show-005-2',
    movieId: '123e4567-e89b-12d3-a456-426614174005',
    auditoriumId: 'aud-441',
    startTimeUtc: '2026-11-07T22:00:00Z',
    basePrice: 19.0,
  },

  // Hereditary: The Lineage — aud-441
  {
    id: 'show-021-1',
    movieId: '123e4567-e89b-12d3-a456-426614174021',
    auditoriumId: 'aud-441',
    startTimeUtc: '2026-10-30T22:00:00Z',
    basePrice: 13.5,
  },
  {
    id: 'show-021-2',
    movieId: '123e4567-e89b-12d3-a456-426614174021',
    auditoriumId: 'aud-441',
    startTimeUtc: '2026-10-31T23:00:00Z',
    basePrice: 13.5,
  },

  // The Matrix: Source — aud-444
  {
    id: 'show-015-1',
    movieId: '123e4567-e89b-12d3-a456-426614174015',
    auditoriumId: 'aud-444',
    startTimeUtc: '2026-11-19T20:00:00Z',
    basePrice: 14.5,
  },
  {
    id: 'show-015-2',
    movieId: '123e4567-e89b-12d3-a456-426614174015',
    auditoriumId: 'aud-444',
    startTimeUtc: '2026-11-20T17:00:00Z',
    basePrice: 14.5,
  },

  // -------------------------------------------------------
  // cinema-555 · Cineworld Lakefront
  //   aud-551 → Lakefront Screen 1
  //   aud-555 → Lakefront Screen 2
  // -------------------------------------------------------

  // Blade Runner: Meridian — aud-551
  {
    id: 'show-007-1',
    movieId: '123e4567-e89b-12d3-a456-426614174007',
    auditoriumId: 'aud-551',
    startTimeUtc: '2026-11-10T20:00:00Z',
    basePrice: 14.0,
  },
  {
    id: 'show-007-2',
    movieId: '123e4567-e89b-12d3-a456-426614174007',
    auditoriumId: 'aud-551',
    startTimeUtc: '2026-11-11T22:30:00Z',
    basePrice: 14.0,
  },

  // Midsommar: The Festival Ends — aud-555
  {
    id: 'show-029-1',
    movieId: '123e4567-e89b-12d3-a456-426614174029',
    auditoriumId: 'aud-555',
    startTimeUtc: '2026-11-22T21:00:00Z',
    basePrice: 12.0,
  },
  {
    id: 'show-029-2',
    movieId: '123e4567-e89b-12d3-a456-426614174029',
    auditoriumId: 'aud-555',
    startTimeUtc: '2026-11-23T21:00:00Z',
    basePrice: 12.0,
  },

  // -------------------------------------------------------
  // cinema-666 · Beacon IMAX Experience
  //   aud-661 → Beacon IMAX
  // -------------------------------------------------------

  // Gladiator: Blood and Sand — aud-661
  {
    id: 'show-018-1',
    movieId: '123e4567-e89b-12d3-a456-426614174018',
    auditoriumId: 'aud-661',
    startTimeUtc: '2026-11-08T19:00:00Z',
    basePrice: 21.0,
  },
  {
    id: 'show-018-2',
    movieId: '123e4567-e89b-12d3-a456-426614174018',
    auditoriumId: 'aud-661',
    startTimeUtc: '2026-11-09T15:30:00Z',
    basePrice: 21.0,
  },

  // Arrival: Signal — aud-661
  {
    id: 'show-019-1',
    movieId: '123e4567-e89b-12d3-a456-426614174019',
    auditoriumId: 'aud-661',
    startTimeUtc: '2026-11-14T18:00:00Z',
    basePrice: 20.0,
  },
]

// ---------------------------------------------------------------------------
// Seat map config per auditorium — drives the dynamic generator below
// ---------------------------------------------------------------------------

interface AuditoriumSeatConfig {
  cinemaName: string
  auditoriumName: string
  maxRows: number
  maxColumns: number
  /** Columns to remove entirely as aisles */
  aisleColumns: number[]
  /** Seats removed for taper / shape at the front */
  frontTaper: { row: number; minCol: number; maxCol: number }[]
  /** Seats removed for structural pillars / wheelchair bays */
  removedSeats: { row: number; col: number }[]
  tiers: {
    tierName: string
    priceSurcharge: number
    seats: { row: number; col: number }[]
  }[]
}

const AUDITORIUM_SEAT_CONFIGS: Record<string, AuditoriumSeatConfig> = {
  'aud-111': {
    cinemaName: 'Hive Multiplex Downtown',
    auditoriumName: 'IMAX Screen 1',
    maxRows: 10,
    maxColumns: 15,
    aisleColumns: [7],
    frontTaper: [
      { row: 0, minCol: 2, maxCol: 12 },
      { row: 1, minCol: 1, maxCol: 13 },
    ],
    removedSeats: [
      { row: 5, col: 2 },
      { row: 5, col: 12 },
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

  'aud-112': {
    cinemaName: 'Hive Multiplex Downtown',
    auditoriumName: 'Dolby Atmos Screen 2',
    maxRows: 8,
    maxColumns: 12,
    aisleColumns: [6],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 10 }],
    removedSeats: [],
    tiers: [
      {
        tierName: 'Premium Center',
        priceSurcharge: 3.0,
        seats: [
          { row: 4, col: 4 },
          { row: 4, col: 5 },
          { row: 4, col: 7 },
          { row: 4, col: 8 },
        ],
      },
    ],
  },

  'aud-113': {
    cinemaName: 'Hive Multiplex Downtown',
    auditoriumName: 'Standard Screen 3',
    maxRows: 7,
    maxColumns: 10,
    aisleColumns: [5],
    frontTaper: [],
    removedSeats: [],
    tiers: [],
  },

  'aud-221': {
    cinemaName: 'Alamo Drafthouse Austin',
    auditoriumName: 'Main Hall',
    maxRows: 9,
    maxColumns: 14,
    aisleColumns: [7],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 12 }],
    removedSeats: [
      { row: 4, col: 1 },
      { row: 4, col: 12 },
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

  'aud-222': {
    cinemaName: 'Alamo Drafthouse Austin',
    auditoriumName: 'Drafthouse Screen 2',
    maxRows: 8,
    maxColumns: 12,
    aisleColumns: [6],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 10 }],
    removedSeats: [],
    tiers: [],
  },

  'aud-331': {
    cinemaName: 'Starlight Cinemas Westside',
    auditoriumName: 'Starlight IMAX',
    maxRows: 11,
    maxColumns: 16,
    aisleColumns: [8],
    frontTaper: [
      { row: 0, minCol: 2, maxCol: 13 },
      { row: 1, minCol: 1, maxCol: 14 },
    ],
    removedSeats: [
      { row: 6, col: 2 },
      { row: 6, col: 13 },
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

  'aud-333': {
    cinemaName: 'Starlight Cinemas Westside',
    auditoriumName: 'Westside Screen 2',
    maxRows: 8,
    maxColumns: 13,
    aisleColumns: [6],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 11 }],
    removedSeats: [],
    tiers: [],
  },

  'aud-441': {
    cinemaName: 'Grand Rex Theatres',
    auditoriumName: 'Grand Hall',
    maxRows: 12,
    maxColumns: 18,
    aisleColumns: [9],
    frontTaper: [
      { row: 0, minCol: 2, maxCol: 15 },
      { row: 1, minCol: 1, maxCol: 16 },
    ],
    removedSeats: [
      { row: 6, col: 2 },
      { row: 6, col: 15 },
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

  'aud-444': {
    cinemaName: 'Grand Rex Theatres',
    auditoriumName: 'Rex Screen 2',
    maxRows: 9,
    maxColumns: 14,
    aisleColumns: [7],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 12 }],
    removedSeats: [],
    tiers: [
      {
        tierName: 'Premium',
        priceSurcharge: 3.0,
        seats: [
          { row: 5, col: 5 },
          { row: 5, col: 6 },
          { row: 5, col: 8 },
          { row: 5, col: 9 },
        ],
      },
    ],
  },

  'aud-551': {
    cinemaName: 'Cineworld Lakefront',
    auditoriumName: 'Lakefront Screen 1',
    maxRows: 8,
    maxColumns: 12,
    aisleColumns: [6],
    frontTaper: [{ row: 0, minCol: 1, maxCol: 10 }],
    removedSeats: [],
    tiers: [],
  },

  'aud-555': {
    cinemaName: 'Cineworld Lakefront',
    auditoriumName: 'Lakefront Screen 2',
    maxRows: 7,
    maxColumns: 11,
    aisleColumns: [5],
    frontTaper: [],
    removedSeats: [],
    tiers: [],
  },

  'aud-661': {
    cinemaName: 'Beacon IMAX Experience',
    auditoriumName: 'Beacon IMAX',
    maxRows: 10,
    maxColumns: 16,
    aisleColumns: [8],
    frontTaper: [
      { row: 0, minCol: 2, maxCol: 13 },
      { row: 1, minCol: 1, maxCol: 14 },
    ],
    removedSeats: [
      { row: 5, col: 2 },
      { row: 5, col: 13 },
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
}

// ---------------------------------------------------------------------------
// Dynamic seat map generator — resolves showtime → auditorium → seat layout
// ---------------------------------------------------------------------------

function generateSeatMap(
  showtimeId: string,
  basePrice: number,
): ShowtimeSeatMapResponse {
  const showtime = MOCK_SHOWTIMES.find((s) => s.id === showtimeId)
  if (!showtime) throw new Error(`No showtime found for id: ${showtimeId}`)

  const config = AUDITORIUM_SEAT_CONFIGS[showtime.auditoriumId]
  if (!config)
    throw new Error(
      `No seat config found for auditorium: ${showtime.auditoriumId}`,
    )

  const { maxRows, maxColumns, aisleColumns, frontTaper, removedSeats, tiers } =
    config

  // Build fast-lookup sets
  const aisleSet = new Set(aisleColumns)
  const removedSet = new Set(
    removedSeats.map(({ row, col }) => `${row}:${col}`),
  )
  const taperMap = new Map(
    frontTaper.map(({ row, minCol, maxCol }) => [row, { minCol, maxCol }]),
  )

  const seats = []
  for (let r = 0; r < maxRows; r++) {
    for (let c = 0; c < maxColumns; c++) {
      // Apply front taper
      const taper = taperMap.get(r)
      if (taper && (c < taper.minCol || c > taper.maxCol)) continue

      // Apply aisles
      if (aisleSet.has(c)) continue

      // Apply removed seats
      if (removedSet.has(`${r}:${c}`)) continue

      seats.push({
        row: r,
        col: c,
        status: Math.random() > 0.8 ? SeatStatus.SOLD : SeatStatus.AVAILABLE,
      })
    }
  }

  return {
    movieTitle: '', // caller can hydrate from MOVIES_MOCK if needed
    cinemaName: config.cinemaName,
    auditoriumName: config.auditoriumName,
    maxRows,
    maxColumns,
    basePrice,
    tiers,
    seatMap: seats,
  }
}

export { generateSeatMap }

// Kept for backward-compat / default preview (show-001-1 → aud-111)
export const MOCK_SEAT_MAP: ShowtimeSeatMapResponse = generateSeatMap(
  'show-001-1',
  20.5,
)
