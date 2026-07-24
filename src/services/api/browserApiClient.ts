import { formatStrings } from '@/content/strings'
import { ApiError, type ApiErrorResponse } from '@/models/apiError'

export interface BrowserApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export class BrowserApiClient {

  async request<T>(path: string, options: BrowserApiRequestOptions = {}): Promise<T> {

    if (!path.startsWith('/')) {
      throw new Error('Browser API paths must begin with /.')
    }

    const isFormData = options.body instanceof FormData
    const headers = new Headers(options.headers)

    headers.set('accept', 'application/json')

    if (options.body !== undefined && !isFormData) {
      headers.set('content-type', 'application/json')
    }

    let requestBody: BodyInit | undefined

    if (options.body !== undefined) {
      requestBody = isFormData ? options.body as FormData : JSON.stringify(options.body)
    }

    const response = await fetch(`/api/backend${path}`, {
      ...options,
      headers,
      body: requestBody,
      cache: 'no-store',
    })
    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {

      const apiError = typeof payload === 'object' && payload !== null
        ? payload as ApiErrorResponse
        : null

      throw new ApiError(
        apiError?.message || formatStrings.services.browserRequestReturnedStatus(response.status),
        response.status,
        apiError?.metadata,
      )

    }

    return payload as T

  }

}
