import { beforeEach, describe, expect, it, vi } from 'vitest'
import { moviesApi } from './movies'
import { api } from './axios'

// Mock the core Axios instance
vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Movies API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_MOCK_AUTH', 'false')
  })

  describe('getAllMovies', () => {
    it('successfully fetches movies and maps the response', async () => {
      const mockPagedResponse = {
        content: [
          { id: '1', title: 'Movie 1' },
          { id: '2', title: 'Movie 2' },
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
        isLast: true,
      }
      ;(api.get as any).mockResolvedValueOnce({ data: mockPagedResponse })

      const result = await moviesApi.getAllMovies(0, 10, 'test')

      expect(api.get).toHaveBeenCalledWith('/movies?page=0&size=10&search=test')
      expect(result).toEqual({
        content: mockPagedResponse.content,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
        },
        totalElements: 2,
        totalPages: 1,
        first: true,
        last: true,
      })
    })

    it('handles default parameters', async () => {
      ;(api.get as any).mockResolvedValueOnce({
        data: {
          content: [],
          pageNumber: 0,
          pageSize: 10,
          totalElements: 0,
          totalPages: 0,
          isLast: true,
        },
      })

      await moviesApi.getAllMovies()

      expect(api.get).toHaveBeenCalledWith('/movies?page=0&size=10')
    })
  })

  describe('getMovieById', () => {
    it('successfully fetches a movie by id', async () => {
      const mockMovie = { id: '1', title: 'Movie 1' }
      ;(api.get as any).mockResolvedValueOnce({ data: mockMovie })

      const result = await moviesApi.getMovieById('1')

      expect(api.get).toHaveBeenCalledWith('/movies/1')
      expect(result).toEqual(mockMovie)
    })
  })

  describe('createMovie', () => {
    it('successfully creates a movie', async () => {
      const payload = {
        title: 'New Movie',
        description: 'A great movie',
        durationMinutes: 120,
        releaseDate: '2023-01-01',
      }
      const mockResponse = { id: '3', ...payload }
      ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })

      const result = await moviesApi.createMovie(payload as any)

      expect(api.post).toHaveBeenCalledWith('/movies', payload)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateMovie', () => {
    it('successfully updates a movie', async () => {
      const payload = { title: 'Updated Movie' }
      ;(api.put as any).mockResolvedValueOnce({ data: null })

      await moviesApi.updateMovie('1', payload as any)

      expect(api.put).toHaveBeenCalledWith('/movies/1', payload)
    })
  })

  describe('deleteMovie', () => {
    it('successfully deletes a movie', async () => {
      ;(api.delete as any).mockResolvedValueOnce({ data: null })

      await moviesApi.deleteMovie('1')

      expect(api.delete).toHaveBeenCalledWith('/movies/1')
    })
  })
})
