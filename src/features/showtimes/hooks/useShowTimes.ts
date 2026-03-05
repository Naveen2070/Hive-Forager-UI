import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showtimesApi } from '@/api/showtimes'
import { showtimeKeys } from '../showtimes.keys'
import type {
  CreateShowtimeRequest,
  UpdateShowtimeRequest,
} from '@/types/showtime.type'

export const useShowtimesByMovie = (
  movieId: string,
  page: number = 0,
  size: number = 50,
  fromDate?: string,
  toDate?: string,
) => {
  return useQuery({
    // Include all filters in the query key!
    queryKey: [
      ...showtimeKeys.listByMovie(movieId),
      { page, size, fromDate, toDate },
    ],
    queryFn: () =>
      showtimesApi.getShowtimesByMovieId(movieId, page, size, fromDate, toDate),
    enabled: !!movieId,
  })
}

export const useSeatMap = (showtimeId: string) => {
  return useQuery({
    queryKey: showtimeKeys.seatMap(showtimeId),
    queryFn: () => showtimesApi.getSeatMap(showtimeId),
    enabled: !!showtimeId,
    refetchInterval: 1000 * 30,
  })
}

export const useCreateShowtime = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateShowtimeRequest) =>
      showtimesApi.createShowtime(data),
    onSuccess: async (data) => {
      toast.success('Showtime scheduled successfully!')
      await queryClient.invalidateQueries({
        queryKey: showtimeKeys.seatMap(data.id),
      })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to schedule showtime.',
      )
    },
  })
}

export const useUpdateShowtime = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShowtimeRequest }) =>
      showtimesApi.updateShowtime(id, data),
    onSuccess: async (_, variables) => {
      toast.success('Showtime updated successfully!')
      await queryClient.invalidateQueries({ queryKey: showtimeKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: showtimeKeys.seatMap(variables.id),
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update showtime.')
    },
  })
}

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => showtimesApi.deleteShowtime(id),
    onSuccess: async () => {
      toast.success('Showtime removed.')
      await queryClient.invalidateQueries({ queryKey: showtimeKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove showtime.')
    },
  })
}
