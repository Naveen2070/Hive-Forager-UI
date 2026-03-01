import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cinemasApi } from '@/api/cinemas'
import { cinemaKeys } from '../cinemas.keys'
import type { CreateCinemaRequest } from '@/types/cinema.type'

export const useCinemas = () => {
  return useQuery({
    queryKey: cinemaKeys.lists(),
    queryFn: cinemasApi.getAllCinemas,
  })
}

export const useCinemaDetail = (id: string) => {
  return useQuery({
    queryKey: cinemaKeys.detail(id),
    queryFn: () => cinemasApi.getCinemaById(id),
    enabled: !!id,
  })
}

export const useCreateCinema = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCinemaRequest) => cinemasApi.createCinema(data),
    onSuccess: async () => {
      toast.success('Cinema registered successfully!')
      await queryClient.invalidateQueries({ queryKey: cinemaKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register cinema.')
    },
  })
}
