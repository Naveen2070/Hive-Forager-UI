export interface PageResponse<T> {
  content: Array<T>
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
