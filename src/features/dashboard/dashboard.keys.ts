export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (mode: string) => [...dashboardKeys.all, 'stats', mode] as const,
}
