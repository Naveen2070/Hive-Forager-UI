export const ticketKeys = {
  all: ['tickets'] as const,
  mine: () => [...ticketKeys.all, 'mine'] as const,
}
