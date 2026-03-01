import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { moviesApi } from '@/api/movies'
import { movieKeys } from '../movies.keys'
import type { CreateMovieRequest } from '@/types/movie.type'

export const fetchMovies = async () => {
  return moviesApi.getAllMovies()
}

export const fetchMovieDetail = async (id: string) => {
  return moviesApi.getMovieById(id)
}

export const useMovies = () => {
  return useQuery({
    queryKey: movieKeys.lists(),
    queryFn: fetchMovies,
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
