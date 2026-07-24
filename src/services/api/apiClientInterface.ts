export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  accessToken?: string
}

export interface ApiClientInterface {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  proxy(request: Request, path: string, accessToken: string): Promise<Response>
}
