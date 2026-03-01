import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showtimesApi } from '@/api/showtimes'
import { showtimeKeys } from '../showtimes.keys'
import type { CreateShowtimeRequest } from '@/types/showtime.type'

export const useShowtimesByMovie = (movieId: string) => {
  return useQuery({
    queryKey: showtimeKeys.listByMovie(movieId),
    queryFn: () => showtimesApi.getShowtimesByMovieId(movieId),
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
