export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}
