import type {
  CreateMovieRequest,
  MovieResponse,
  UpdateMovieRequest,
} from '@/types/movie.type'
import type { PageResponse } from '@/types/common.type.ts'
import type { DotNetPagedResponse } from '@/lib/pagination-mapper.ts'
import { api } from '@/api/axios.ts'
import { mapToPageResponse } from '@/lib/pagination-mapper.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const moviesApi = {
  getAllMovies: async (
    page: number = 0,
    size: number = 10,
    search?: string,
  ): Promise<PageResponse<MovieResponse>> => {
    if (isMock) {
      const { MOVIES_MOCK } = await import('@/api/mocks/movies.mock')

      // 1. Filter by search
      let filtered = MOVIES_MOCK
      if (search) {
        const lowerSearch = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.title.toLowerCase().includes(lowerSearch) ||
            m.description.toLowerCase().includes(lowerSearch),
        )
      }

      // 2. Paginate
      const totalElements = filtered.length
      const totalPages = Math.ceil(totalElements / size)
      const content = filtered.slice(page * size, (page + 1) * size)

      return {
        content,
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        isLast: page >= totalPages - 1 || totalPages === 0,
      }
    }

    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (search) params.append('search', search)

    const { data } = await api.get<DotNetPagedResponse<MovieResponse>>(
      `/movies?${params.toString()}`,
    )
    return mapToPageResponse(data)
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
