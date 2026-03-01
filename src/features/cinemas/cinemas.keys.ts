export const cinemaKeys = {
  all: ['cinemas'] as const,
  lists: () => [...cinemaKeys.all, 'list'] as const,
  details: () => [...cinemaKeys.all, 'detail'] as const,
  detail: (id: string) => [...cinemaKeys.details(), id] as const,
}
