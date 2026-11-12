import { ApiError, NotFoundError } from '@/errors/domainErrors';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { uploadPublicImage } from '@/services/media/uploadPublicImage';
import { portalPublishingStrings } from '@/strings';
import { validateInput } from '@/utils/validateInput';

import {
  BlogArticleSchema,
  BlogMutationInputSchema,
  type BlogMutationInput,
} from '../models/blogArticle';
import { BlogOptionsSchema } from '../models/blogOptions';
import { BlogPageSchema } from '../models/blogPage';
import {
  BlogQuerySchema,
  blogQueryParams,
  type BlogQuery,
} from '../models/blogQuery';
import { BlogRevisionInputSchema } from '../models/blogRevisionInput';

const copy = portalPublishingStrings.article;

export class BlogService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - GET BLOG OPTIONS
  // **************************************

  async options(publishedOnly = false, signal?: AbortSignal) {

    return BlogOptionsSchema.parse(
      await this.api.request<unknown>(
        publishedOnly ? '/public/blog/_options' : '/blog/_options',
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - LIST BLOG ARTICLES
  // **************************************

  async list(query: BlogQuery, signal?: AbortSignal) {

    const params = blogQueryParams(validateInput(BlogQuerySchema, query));
    return BlogPageSchema.parse(
      await this.api.request<unknown>(`/blog?${params}`, { signal }),
    );

  }

  // **************************************
  // MARK: - GET BLOG ARTICLE
  // **************************************

  async get(id: string, signal?: AbortSignal) {

    return BlogArticleSchema.parse(
      await this.api.request<unknown>(`/blog/${encodeURIComponent(id)}`, {
        signal,
      }),
    );

  }

  // **************************************
  // MARK: - CREATE BLOG ARTICLE
  // **************************************

  async create(input: BlogMutationInput) {

    return BlogArticleSchema.parse(
      await this.api.request<unknown>('/blog', {
        method: 'POST',
        body: validateInput(BlogMutationInputSchema, input),
      }),
    );

  }

  // **************************************
  // MARK: - UPDATE BLOG ARTICLE
  // **************************************

  async update(id: string, input: BlogMutationInput) {

    return BlogArticleSchema.parse(
      await this.api.request<unknown>(`/blog/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: validateInput(BlogMutationInputSchema, input),
      }),
    );

  }

  // **************************************
  // MARK: - SET BLOG PUBLICATION
  // **************************************

  async setPublication(id: string, revision: number, published: boolean) {

    return BlogArticleSchema.parse(
      await this.api.request<unknown>(
        `/blog/${encodeURIComponent(id)}/${published ? 'publish' : 'unpublish'}`,
        {
          method: 'POST',
          body: validateInput(BlogRevisionInputSchema, { revision }),
        },
      ),
    );

  }

  // **************************************
  // MARK: - UPLOAD BLOG IMAGE
  // **************************************

  async uploadImage(file: File, signal?: AbortSignal) {
    return uploadPublicImage(this.api, file, '/blog/media/upload', signal);
  }

  // **************************************
  // MARK: - DELETE BLOG ARTICLE
  // **************************************

  async delete(id: string, revision: number) {

    await this.api.request<void>(`/blog/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      body: validateInput(BlogRevisionInputSchema, { revision }),
    });

  }

  // **************************************
  // MARK: - LIST PUBLIC BLOG ARTICLES
  // **************************************

  async listPublic(query: BlogQuery, signal?: AbortSignal) {

    const validated = validateInput(BlogQuerySchema, query);
    const page = BlogPageSchema.parse(
      await this.api.request<unknown>(
        `/public/blog?${blogQueryParams({ ...validated, status: undefined })}`,
        { signal },
      ),
    );
    if (page.data.some((article) => article.status !== 'published')) { throw new ApiError(copy.articleUnavailableDescription, 503); }
    return page;

  }

  // **************************************
  // MARK: - GET PUBLIC BLOG ARTICLE
  // **************************************

  async getPublic(slug: string, signal?: AbortSignal) {

    const article = BlogArticleSchema.parse(
      await this.api.request<unknown>(
        `/public/blog/${encodeURIComponent(slug)}`,
        { signal },
      ),
    );
    if (article.status !== 'published') { throw new NotFoundError(copy.missingArticle); }
    return article;

  }

}
