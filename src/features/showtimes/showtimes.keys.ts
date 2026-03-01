export const showtimeKeys = {
  all: ['showtimes'] as const,
  lists: () => [...showtimeKeys.all, 'list'] as const,
  listByMovie: (movieId: string) =>
    [...showtimeKeys.lists(), { movieId }] as const,
  seatMaps: () => [...showtimeKeys.all, 'seatMap'] as const,
  seatMap: (showtimeId: string) =>
    [...showtimeKeys.seatMaps(), showtimeId] as const,
}
