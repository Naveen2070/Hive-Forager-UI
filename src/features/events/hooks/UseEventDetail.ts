import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'

export const useEventDetail = (eventId: number) => {
  const query = useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventsApi.getById(eventId),
  })

  return {
    event: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
