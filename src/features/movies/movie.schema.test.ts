import { describe, it, expect } from 'vitest'
import { movieSchema } from './movie.schema'

describe('movieSchema', () => {
  it('should validate a correct movie object', () => {
    const validMovie = {
      title: 'The Hive',
      description: 'A thrilling documentary about a high-tech company.',
      durationMinutes: 120,
      releaseDate: '2023-10-27',
      posterUrl: 'https://example.com/poster.jpg',
    }
    const result = movieSchema.safeParse(validMovie)
    expect(result.success).toBe(true)
  })

  it('should invalidate when title is empty', () => {
    const invalidMovie = {
      title: '',
      description: 'A thrilling documentary about a high-tech company.',
      durationMinutes: 120,
      releaseDate: '2023-10-27',
    }
    const result = movieSchema.safeParse(invalidMovie)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('should invalidate when description is too short', () => {
    const invalidMovie = {
      title: 'The Hive',
      description: 'Short',
      durationMinutes: 120,
      releaseDate: '2023-10-27',
    }
    const result = movieSchema.safeParse(invalidMovie)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Description must be at least 10 characters')
    }
  })

  it('should invalidate when durationMinutes is less than 1', () => {
    const invalidMovie = {
      title: 'The Hive',
      description: 'A thrilling documentary about a high-tech company.',
      durationMinutes: 0,
      releaseDate: '2023-10-27',
    }
    const result = movieSchema.safeParse(invalidMovie)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Duration must be greater than 0')
    }
  })

  it('should validate when posterUrl is an empty string', () => {
    const movieWithEmptyPoster = {
      title: 'The Hive',
      description: 'A thrilling documentary about a high-tech company.',
      durationMinutes: 120,
      releaseDate: '2023-10-27',
      posterUrl: '',
    }
    const result = movieSchema.safeParse(movieWithEmptyPoster)
    expect(result.success).toBe(true)
  })

  it('should invalidate when posterUrl is an invalid URL', () => {
    const movieWithInvalidPoster = {
      title: 'The Hive',
      description: 'A thrilling documentary about a high-tech company.',
      durationMinutes: 120,
      releaseDate: '2023-10-27',
      posterUrl: 'not-a-url',
    }
    const result = movieSchema.safeParse(movieWithInvalidPoster)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Must be a valid URL')
    }
  })
})
