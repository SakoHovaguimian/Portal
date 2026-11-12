import { portalPublishingStrings } from '@/strings';

import 'server-only';

import { portalModules } from '@/config/portalModules';
import { NotFoundError } from '@/errors/domainErrors';
import { ApiClient } from '@/services/api/apiClient';
import type {
  ApiClientInterface,
  ApiRequestOptions,
} from '@/services/api/apiClientInterface';
import { parseApiResponse } from '@/services/api/response';
import {
  getDemoContext,
  getEffectiveRuntime,
} from '@/services/demo/demoRuntime';
import { simulateDemoRequest } from '@/services/demo/demoSimulation';

import { BlogQuerySchema } from '../models/blogQuery';
import { handleDemoBlogRequest } from '../server/demoBlogApi';
import { BlogService } from './blogService';

const copy = portalPublishingStrings.article;

class PublicBlogApiClient implements ApiClientInterface {

  private readonly api = new ApiClient();

  // **************************************
  // MARK: - REQUEST PUBLIC BLOG DATA
  // **************************************

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {

    if (!portalModules.publishing) { throw new NotFoundError(copy.missingArticle); }
    // Public reads deliberately never read or refresh a visitor session.
    if ((await getEffectiveRuntime()).demoMode) {

      const context = await getDemoContext();
      await simulateDemoRequest(context, options.signal ?? undefined);
      if (context.scenario === 'empty') {

        const url = new URL(path, 'http://portal.internal');
        if (url.pathname === '/public/blog/_options') { return { categories: [], covers: [] } as T; }
        if (url.pathname === '/public/blog') {

          const query = BlogQuerySchema.parse(
            Object.fromEntries(url.searchParams),
          );
          return { data: [], total: 0, limit: query.limit, offset: 0 } as T;

        }

      }
      const response = await handleDemoBlogRequest(
        new Request(`http://portal.internal${path}`),
        path,
        null,
      );
      if (!response) { throw new NotFoundError(copy.missingArticle); }
      return parseApiResponse<T>(response);

    }
    return this.api.request<T>(path, '', options);

  }

}

export const publicBlogService = new BlogService(new PublicBlogApiClient());
