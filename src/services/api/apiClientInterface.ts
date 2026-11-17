import type { ApiRequestOptions } from './models/apiRequestOptions';

export type { ApiRequestOptions } from './models/apiRequestOptions';

export interface ApiClientInterface {

  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;

}
