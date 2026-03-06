import { describe, it, expect } from 'vitest'
import { mapToPageResponse } from './pagination-mapper'

describe('pagination-mapper', () => {
  it('should map DotNetPagedResponse to PageResponse correctly for first page', () => {
    const dotNetResponse = {
      content: ['item1', 'item2'],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 20,
      totalPages: 2,
      isLast: false,
    }

    const expectedResponse = {
      content: ['item1', 'item2'],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
      },
      totalElements: 20,
      totalPages: 2,
      first: true,
      last: false,
    }

    expect(mapToPageResponse(dotNetResponse)).toEqual(expectedResponse)
  })

  it('should map DotNetPagedResponse to PageResponse correctly for last page', () => {
    const dotNetResponse = {
      content: ['item1'],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 11,
      totalPages: 2,
      isLast: true,
    }

    const expectedResponse = {
      content: ['item1'],
      pageable: {
        pageNumber: 1,
        pageSize: 10,
      },
      totalElements: 11,
      totalPages: 2,
      first: false,
      last: true,
    }

    expect(mapToPageResponse(dotNetResponse)).toEqual(expectedResponse)
  })

  it('should handle empty responses', () => {
    const dotNetResponse = {
      content: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      isLast: true,
    }

    const result = mapToPageResponse(dotNetResponse)
    expect(result.first).toBe(true)
    expect(result.last).toBe(true)
    expect(result.content).toEqual([])
  })
})
