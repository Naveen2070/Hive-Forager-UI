import { describe, expect, it } from 'vitest'
import { mapToPageResponse } from './pagination-mapper'
import type { DotNetPagedResponse } from './pagination-mapper'
import type { PageResponse } from '@/types/common.type'

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

    const expectedResponse: PageResponse<string> = {
      content: ['item1', 'item2'],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 20,
      totalPages: 2,
      isLast: false,
    }

    expect(mapToPageResponse(dotNetResponse)).toEqual(expectedResponse)
  })

  it('should map DotNetPagedResponse to PageResponse correctly for last page', () => {
    const dotNetResponse: DotNetPagedResponse<string> = {
      content: ['item1'],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 11,
      totalPages: 2,
      isLast: true,
    }

    const expectedResponse: PageResponse<string> = {
      content: ['item1'],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 11,
      totalPages: 2,
      isLast: true,
    }

    expect(mapToPageResponse(dotNetResponse)).toEqual(expectedResponse)
  })

  it('should handle empty responses', () => {
    const dotNetResponse: DotNetPagedResponse<string> = {
      content: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      isLast: true,
    }

    const result = mapToPageResponse(dotNetResponse)
    expect(result.isLast).toBe(true)
    expect(result.content).toEqual([])
  })
})
