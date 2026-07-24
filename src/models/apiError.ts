export interface ApiErrorResponse {
  statusCode?: number
  name?: string
  message?: string
  metadata?: unknown
}

export class ApiError extends Error {

  readonly statusCode: number
  readonly metadata?: unknown

  constructor(
    message: string,
    statusCode: number,
    metadata?: unknown
  ) {

    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.metadata = metadata

  }

}
