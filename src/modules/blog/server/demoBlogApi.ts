import 'server-only';

import {
  DomainError,
  NotFoundError,
  OwnershipError,
  ValidationError,
} from '@/errors/domainErrors';
import { uploadDemoPublicImage } from '@/services/media/server/demoPublicImages';
import { portalPublishingStrings } from '@/strings';

import { blogContentText } from '@/modules/blog/content/blogContentText';
import {
  BlogMutationInputSchema,
  type BlogArticle,
} from '@/modules/blog/models/blogArticle';
import { blogCategoryLabel } from '@/modules/blog/models/blogCategory';
import type { BlogCoverChoice } from '@/modules/blog/models/blogCoverChoice';
import { BlogQuerySchema } from '@/modules/blog/models/blogQuery';
import { BlogRevisionInputSchema } from '@/modules/blog/models/blogRevisionInput';
import type { DemoBlogActor } from '../models/demoBlogActor';
import { getDemoBlogState } from './demoBlogState';

const copy = portalPublishingStrings.article;

// **************************************
// MARK: - CREATE DEMO BLOG RESPONSE
// **************************************

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

// **************************************
// MARK: - HANDLE DEMO BLOG REQUEST
// **************************************

export async function handleDemoBlogRequest(
  request: Request,
  path: string,
  actor: DemoBlogActor | null,
  options: { empty?: boolean } = {},
): Promise<Response | null> {

  const url = new URL(path, 'http://portal.internal');
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const isPublic = parts[0] === 'public';
  const [resource, id, action, ...rest] = isPublic ? parts.slice(1) : parts;
  if (resource !== 'blog') { return null; }
  if (rest.length) { throw new NotFoundError(copy.missingArticleHint); }
  if (isPublic && request.method !== 'GET') { throw new OwnershipError(copy.permissionErrorHint); }
  if (!isPublic && actor?.role !== 'admin' && actor?.role !== 'superadmin') { throw new OwnershipError(copy.permissionErrorHint); }
  if (
    !isPublic &&
    id === 'media' &&
    action === 'upload' &&
    request.method === 'POST'
  ) { return uploadDemoPublicImage(request); }
  const articles = getDemoBlogState();
  if (id === '_options' && !action && request.method === 'GET') {

    const visible = (options.empty ? [] : articles).filter(
      (article) => !isPublic || article.status === 'published',
    );
    const categoryValues = visible.map((article) => {

      const category = article.category;
      return category;

    });
    const categories = [...new Set(categoryValues)].sort();
    const coverEntries: [string, BlogCoverChoice][] = visible.map((article) => {

      const coverEntry: [string, BlogCoverChoice] = [
        article.cover,
        { value: article.cover, title: article.title },
      ];
      return coverEntry;

    });
    const covers = [...new Map(coverEntries).values()];
    const optionsResponse = json({ categories, covers });
    return optionsResponse;

  }

  // **************************************
  // MARK: - READ DEMO BLOG REQUEST BODY
  // **************************************

  const input = () => {

    const inputPromise = request.json().catch(() => {
      throw new ValidationError(copy.invalidInputHint);
    });

    return inputPromise;

  };

  // **************************************
  // MARK: - CHECK DEMO BLOG REVISION
  // **************************************

  const checkRevision = (
    article: BlogArticle,
    revision: number | undefined,
  ) => {

    if (article.revision !== revision) { throw new DomainError(copy.conflictErrorHint, 'BLOG_CONFLICT', 409); }

  };
  if (!id && request.method === 'GET') {

    const query = BlogQuerySchema.parse(Object.fromEntries(url.searchParams));
    const search = query.query.toLocaleLowerCase('en-US');
    const rows = (options.empty ? [] : articles)
      .filter((article) => {

        const isPublicArticle = !isPublic || article.status === 'published';
        if (!isPublicArticle) { return false; }
        const matchesCategory = !query.category || article.category === query.category;
        if (!matchesCategory) { return false; }
        const matchesStatus = isPublic || !query.status || article.status === query.status;
        if (!matchesStatus) { return false; }
        const searchableValues = [
          article.title,
          article.description,
          article.author,
          blogContentText(article.content),
          article.body ?? '',
          blogCategoryLabel(article.category),
        ];
        const matchesSearch = searchableValues.some((value) => {

          const containsSearch = value.toLocaleLowerCase('en-US').includes(search);
          return containsSearch;

        });

        return matchesSearch;

      })
      .sort((firstArticle, secondArticle) => {

        const publishDateOrder =
          Date.parse(isPublic ? secondArticle.publishedAt || secondArticle.updatedAt : secondArticle.updatedAt) -
          Date.parse(isPublic ? firstArticle.publishedAt || firstArticle.updatedAt : firstArticle.updatedAt);
        const articleOrder = publishDateOrder || secondArticle.id.localeCompare(firstArticle.id);
        return articleOrder;

      });
    const offset = rows.length
      ? Math.min(
        query.offset,
        Math.floor((rows.length - 1) / query.limit) * query.limit,
      )
      : 0;
    return json({
      data: rows.slice(offset, offset + query.limit),
      total: rows.length,
      offset,
      limit: query.limit,
    });

  }
  if (!isPublic && !id && request.method === 'POST') {

    const body = BlogMutationInputSchema.parse(await input());
    if (articles.some((article) => article.slug === body.slug)) { throw new ValidationError(copy.duplicateSlugHint); }
    const now = new Date().toISOString();
    const article: BlogArticle = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      status: 'draft',
      revision: 1,
    };
    articles.unshift(article);
    return json(article, 201);

  }
  const publicIdentifier = isPublic && id === 'id' ? action : id;
  const article = articles.find((item) =>
    isPublic
      ? (item.slug === publicIdentifier || item.id === publicIdentifier) &&
        item.status === 'published'
      : item.id === id,
  );
  if (!article) { throw new NotFoundError(copy.missingArticleHint); }
  if (request.method === 'GET' && (!action || (isPublic && id === 'id'))) { return json(article); }
  if (!isPublic && request.method === 'PATCH' && !action) {

    const body = BlogMutationInputSchema.parse(await input());
    checkRevision(article, body.revision);
    if (
      articles.some((item) => item.id !== article.id && item.slug === body.slug)
    ) { throw new ValidationError(copy.duplicateSlugHint); }
    Object.assign(article, body, {
      updatedAt: new Date().toISOString(),
      revision: article.revision + 1,
    });
    return json(article);

  }
  if (
    !isPublic &&
    request.method === 'POST' &&
    (action === 'publish' || action === 'unpublish')
  ) {

    checkRevision(
      article,
      BlogRevisionInputSchema.parse(await input()).revision,
    );
    if (action === 'publish') {

      BlogMutationInputSchema.parse({
        slug: article.slug,
        title: article.title,
        description: article.description,
        author: article.author,
        category: article.category,
        cover: article.cover,
        content: article.content,
        revision: article.revision,
      });

    }
    const now = new Date().toISOString();
    Object.assign(article, {
      status: action === 'publish' ? 'published' : 'draft',
      publishedAt: action === 'publish' ? now : null,
      updatedAt: now,
      revision: article.revision + 1,
    });
    return json(article);

  }
  if (!isPublic && request.method === 'DELETE' && !action) {

    checkRevision(
      article,
      BlogRevisionInputSchema.parse(await input()).revision,
    );
    articles.splice(articles.indexOf(article), 1);
    return new Response(null, {
      status: 204,
      headers: { 'cache-control': 'no-store' },
    });

  }
  throw new NotFoundError(copy.missingArticleHint);

}
