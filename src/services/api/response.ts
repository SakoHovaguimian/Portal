import { ApiError } from '@/errors/domainErrors';
import { strings } from '@/strings';
export async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload =
    response.status === 204
      ? undefined
      : await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      response.status < 500 && typeof payload?.message === 'string'
        ? payload.message
        : strings.errors.requestFailed;
    throw new ApiError(message, response.status);
  }
  return payload as T;
}
