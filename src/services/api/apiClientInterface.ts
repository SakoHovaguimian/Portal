export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}
export interface ApiClientInterface {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;
}
