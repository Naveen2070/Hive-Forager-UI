import type { MovieResponse } from '@/types/movie.type.ts'

export const MOVIES_MOCK: MovieResponse[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Inception: Remastered',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology.',
    durationMinutes: 148,
    releaseDate: '2026-07-16T00:00:00.000Z',
    posterUrl:
      'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    title: 'Dune: Part Three',
    description: "The epic conclusion of Paul Atreides' journey.",
    durationMinutes: 165,
    releaseDate: '2026-10-22T00:00:00.000Z',
    posterUrl:
      'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/08/dune-2021-poster.jpg',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Spider-Man: Beyond',
    description: 'Miles Morales faces his greatest multiversal challenge yet.',
    durationMinutes: 135,
    releaseDate: '2026-12-15T00:00:00.000Z',
    posterUrl:
      'https://wallpapers.com/images/hd/spider-man-into-the-spider-verse-cool-poster-wnb6jid6d3rhlanc.jpg',
  },
]
