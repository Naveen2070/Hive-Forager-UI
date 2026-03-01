import type {
  CreateMovieRequest,
  MovieResponse,
  UpdateMovieRequest,
} from '@/types/movie.type'
import { api } from '@/api/axios.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const moviesApi = {
  getAllMovies: async (): Promise<MovieResponse[]> => {
    if (isMock) {
      const { MOVIES_MOCK } = await import('@/api/mocks/movies.mock')
      return MOVIES_MOCK
    }
    const { data } = await api.get<MovieResponse[]>('/movies')
    return data
  },
  getMovieById: async (id: string): Promise<MovieResponse> => {
    if (isMock) {
      const { MOVIES_MOCK } = await import('@/api/mocks/movies.mock')
      return MOVIES_MOCK.find((m) => m.id === id) || MOVIES_MOCK[0]
    }
    const { data } = await api.get<MovieResponse>(`/movies/${id}`)
    return data
  },
  createMovie: async (payload: CreateMovieRequest): Promise<MovieResponse> => {
    const { data } = await api.post<MovieResponse>('/movies', payload)
    return data
  },
  updateMovie: async (
    id: string,
    payload: UpdateMovieRequest,
  ): Promise<void> => {
    await api.put(`/movies/${id}`, payload)
  },
  deleteMovie: async (id: string): Promise<void> => {
    await api.delete(`/movies/${id}`)
  },
}
