import 'server-only'
import { formatStrings } from '@/content/strings'
import { ServerEnvironment } from '@/config/environment'
import { ApiError, type ApiErrorResponse } from '@/models/apiError'
import type { ApiClientInterface, ApiRequestOptions } from './apiClientInterface'

export class ApiClient implements ApiClientInterface {

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {

    const headers = new Headers(options.headers)
    const isFormData = options.body instanceof FormData

    headers.set('accept', 'application/json')
    headers.set('app-version', ServerEnvironment.appVersion)

    if (options.accessToken) {
      headers.set('authorization', `Bearer ${options.accessToken}`)
    }

    if (options.body !== undefined && !isFormData) {
      headers.set('content-type', 'application/json')
    }

    let requestBody: BodyInit | undefined

    if (options.body !== undefined) {
      requestBody = isFormData ? options.body as FormData : JSON.stringify(options.body)
    }

    const response = await fetch(this.getApiUrl(path), {
      ...options,
      headers,
      body: requestBody,
      cache: 'no-store',
    })

    return this.parseResponse<T>(response)

  }

  async proxy(request: Request, path: string, accessToken: string): Promise<Response> {

    const requestHeaders = new Headers()
    const requestContentType = request.headers.get('content-type')
    const accept = request.headers.get('accept')

    requestHeaders.set('authorization', `Bearer ${accessToken}`)
    requestHeaders.set('app-version', ServerEnvironment.appVersion)
    requestHeaders.set('accept', accept || 'application/json')

    if (requestContentType) {
      requestHeaders.set('content-type', requestContentType)
    }

    const requestInit: RequestInit & { duplex?: 'half' } = {
      method: request.method,
      headers: requestHeaders,
      cache: 'no-store',
      redirect: 'manual',
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {

      requestInit.body = request.body
      requestInit.duplex = 'half'

    }

    const response = await fetch(this.getApiUrl(path), requestInit)
    const responseHeaders = new Headers()
    const responseContentType = response.headers.get('content-type')
    const contentDisposition = response.headers.get('content-disposition')

    if (responseContentType) {
      responseHeaders.set('content-type', responseContentType)
    }

    if (contentDisposition) {
      responseHeaders.set('content-disposition', contentDisposition)
    }

    responseHeaders.set('cache-control', 'no-store')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })

  }

  private getApiUrl(path: string): string {

    if (!path.startsWith('/api/')) {
      throw new Error('Portal API paths must begin with /api/')
    }

    return `${ServerEnvironment.apiBaseUrl}${path}`

  }

  private async parseResponse<T>(response: Response): Promise<T> {

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {

      const apiError = typeof payload === 'object' && payload !== null
        ? payload as ApiErrorResponse
        : null

      throw new ApiError(
        apiError?.message || formatStrings.services.apiReturnedStatus(response.status),
        response.status,
        apiError?.metadata,
      )

    }

    return payload as T

  }

}
