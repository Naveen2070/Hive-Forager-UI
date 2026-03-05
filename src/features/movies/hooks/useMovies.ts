import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { moviesApi } from '@/api/movies'
import { movieKeys } from '../movies.keys'
import type { CreateMovieRequest, UpdateMovieRequest } from '@/types/movie.type'

export const fetchMovies = async (
  page: number,
  size: number,
  search?: string,
) => {
  return moviesApi.getAllMovies(page, size, search)
}

export const fetchMovieDetail = async (id: string) => {
  return moviesApi.getMovieById(id)
}

export const useMovies = (
  page: number = 0,
  size: number = 10,
  search?: string,
) => {
  return useQuery({
    queryKey: [...movieKeys.lists(), { page, size, search }],
    queryFn: () => fetchMovies(page, size, search),
  })
}

export const useMovieDetail = (id: string) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => moviesApi.getMovieById(id),
    enabled: !!id,
  })
}

export const useCreateMovie = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMovieRequest) => moviesApi.createMovie(data),
    onSuccess: async () => {
      toast.success('Movie created successfully!')
      await queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create movie.')
    },
  })
}

export const useUpdateMovie = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMovieRequest }) =>
      moviesApi.updateMovie(id, data),
    onSuccess: async (_, variables) => {
      toast.success('Movie updated successfully!')
      await queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: movieKeys.detail(variables.id),
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update movie.')
    },
  })
}

export const useDeleteMovie = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => moviesApi.deleteMovie(id),
    onSuccess: async () => {
      toast.success('Movie deleted.')
      await queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete movie.')
    },
  })
}