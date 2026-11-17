import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { validateInput } from '@/utils/validateInput';

import { BackgroundJobCreateInputSchema, BackgroundJobSchema, type BackgroundJobCreateInput } from '../models/backgroundJob';
import { BackgroundJobPageSchema } from '../models/backgroundJobPage';
import { BackgroundJobQuerySchema, type BackgroundJobQuery } from '../models/backgroundJobQuery';
import { BackgroundJobRetryInputSchema, type BackgroundJobRetryInput } from '../models/backgroundJobRetryInput';

export class BackgroundJobService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - LIST BACKGROUND JOBS
  // **************************************

  async listJobs(query: BackgroundJobQuery, signal?: AbortSignal) {

    const parsed = validateInput(BackgroundJobQuerySchema, query);
    const params = new URLSearchParams({ query: parsed.query, limit: String(parsed.limit), offset: String(parsed.offset) });
    if (parsed.status) { params.set('status', parsed.status); }
    return BackgroundJobPageSchema.parse(await this.api.request(`/portal/jobs?${params}`, { signal }));

  }

  // **************************************
  // MARK: - GET BACKGROUND JOB
  // **************************************

  async getJob(id: string, signal?: AbortSignal) {
    return BackgroundJobSchema.parse(await this.api.request(`/portal/jobs/${encodeURIComponent(id)}`, { signal }));
  }

  // **************************************
  // MARK: - CREATE BACKGROUND JOB
  // **************************************

  async createJob(input: BackgroundJobCreateInput) {

    const body = validateInput(BackgroundJobCreateInputSchema, input);
    return BackgroundJobSchema.parse(await this.api.request('/portal/jobs', { method: 'POST', body }));

  }

  // **************************************
  // MARK: - CANCEL BACKGROUND JOB
  // **************************************

  async cancelJob(id: string) {
    return BackgroundJobSchema.parse(await this.api.request(`/portal/jobs/${encodeURIComponent(id)}/cancel`, { method: 'POST' }));
  }

  // **************************************
  // MARK: - RETRY BACKGROUND JOB
  // **************************************

  async retryJob(id: string, input: BackgroundJobRetryInput) {

    const body = validateInput(BackgroundJobRetryInputSchema, input);
    return BackgroundJobSchema.parse(await this.api.request(`/portal/jobs/${encodeURIComponent(id)}/retry`, { method: 'POST', body }));

  }

}
