import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cinemasApi } from '@/api/cinemas'
import { cinemaKeys } from '../cinemas.keys'
import type {
  CreateCinemaRequest,
  UpdateCinemaRequest,
} from '@/types/cinema.type'

export const useCinemas = () => {
  return useQuery({
    queryKey: cinemaKeys.lists(),
    queryFn: cinemasApi.getAllCinemas,
  })
}

export const useMyCinemas = (enabled: boolean) => {
  return useQuery({
    queryKey: cinemaKeys.mine(),
    queryFn: cinemasApi.getMyCinemas,
    enabled,
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

export const useUpdateCinema = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCinemaRequest }) =>
      cinemasApi.updateCinema(id, data),
    onSuccess: async (_, variables) => {
      toast.success('Cinema updated successfully!')
      await queryClient.invalidateQueries({ queryKey: cinemaKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: cinemaKeys.detail(variables.id),
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update cinema.')
    },
  })
}

export const useDeleteCinema = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cinemasApi.deleteCinema(id),
    onSuccess: async () => {
      toast.success('Cinema removed.')
      await queryClient.invalidateQueries({ queryKey: cinemaKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete cinema.')
    },
  })
}