import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { auditoriumsApi } from '@/api/auditoriums.ts'
import { auditoriumKeys } from '@/features/auditoriums/auditoriums.keys.ts'
import type {
  CreateAuditoriumRequest,
  UpdateAuditoriumRequest,
} from '@/types/auditorium.type.ts'

export const useAuditoriums = () => {
  return useQuery({
    queryKey: auditoriumKeys.lists(),
    queryFn: auditoriumsApi.getAllAuditoriums,
  })
}

export const useAuditoriumsByCinema = (cinemaId: string) => {
  return useQuery({
    queryKey: auditoriumKeys.listByCinema(cinemaId),
    queryFn: () => auditoriumsApi.getAuditoriumsByCinemaId(cinemaId),
    enabled: !!cinemaId,
  })
}

export const useAuditoriumDetail = (id: string) => {
  return useQuery({
    queryKey: auditoriumKeys.detail(id),
    queryFn: () => auditoriumsApi.getAuditoriumById(id),
    enabled: !!id,
  })
}

export const useCreateAuditorium = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAuditoriumRequest) =>
      auditoriumsApi.createAuditorium(data),
    onSuccess: async (_, variables) => {
      toast.success('Auditorium created successfully!')
      await queryClient.invalidateQueries({ queryKey: auditoriumKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: auditoriumKeys.listByCinema(variables.cinemaId),
      })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create auditorium.',
      )
    },
  })
}

export const useUpdateAuditorium = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuditoriumRequest }) =>
      auditoriumsApi.updateAuditorium(id, data),
    onSuccess: async (_, variables) => {
      toast.success('Auditorium updated successfully!')
      await queryClient.invalidateQueries({ queryKey: auditoriumKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: auditoriumKeys.detail(variables.id),
      })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update auditorium.',
      )
    },
  })
}

export const useDeleteAuditorium = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => auditoriumsApi.deleteAuditorium(id),
    onSuccess: async () => {
      toast.success('Auditorium deleted.')
      await queryClient.invalidateQueries({ queryKey: auditoriumKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete auditorium.',
      )
    },
  })
}