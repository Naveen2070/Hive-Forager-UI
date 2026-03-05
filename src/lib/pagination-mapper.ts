import type { PageResponse } from '@/types/common.type'

export interface DotNetPagedResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export const mapToPageResponse = <T>(
  data: DotNetPagedResponse<T>,
): PageResponse<T> => {
  return {
    content: data.content,
    pageable: {
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
    },
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    first: data.pageNumber === 0,
    last: data.isLast,
  }
}
