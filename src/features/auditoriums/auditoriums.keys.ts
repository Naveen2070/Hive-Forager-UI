export const auditoriumKeys = {
  all: ['auditoriums'] as const,
  lists: () => [...auditoriumKeys.all, 'list'] as const,
  listByCinema: (cinemaId: string) =>
    [...auditoriumKeys.lists(), { cinemaId }] as const,
  details: () => [...auditoriumKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditoriumKeys.details(), id] as const,
}
