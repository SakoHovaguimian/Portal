import 'server-only';

import { projectConfiguration } from '@/config/projectConfiguration';
import { portalPublishingStrings } from '@/strings';

import { BlogArticleSchema, type BlogArticle } from '../models/blogArticle';

const copy = portalPublishingStrings.article;

const empty = '';
const demoGlobal = globalThis as typeof globalThis & {
  portalDemoBlogArticles?: BlogArticle[];
};

// **************************************
// MARK: - CREATE DEMO BLOG ARTICLES
// **************************************

export function createDemoBlogArticles(): BlogArticle[] {

  if (projectConfiguration.starterData === 'empty') { return []; }
  const articles = [copy.demoData.title, copy.demoData.secondTitle, copy.demoData.draftTitle].map(
    (title, index) => {

      // **************************************
      // MARK: - CREATE DEMO BLOG ARTICLE ID
      // **************************************

      const id = (part: number) =>
        `b2000000-0000-4000-8000-${String(index * 20 + part).padStart(12, '0')}`;
      const date = new Date(
        Date.UTC(2026, 9, 22 - index * 3, 12),
      ).toISOString();
      return BlogArticleSchema.parse({
        id: id(1),
        title,
        slug: [
          'a-better-starting-point',
          'making-space-for-clear-ideas',
          'your-next-article',
        ][index],
        description: [
          copy.demoData.description,
          copy.demoData.secondDescription,
          copy.demoData.draftDescription,
        ][index],
        author: copy.defaultAuthor,
        category: ['ideas', 'guides', 'stories'][index],
        cover: 'none',
        status: index === 2 ? 'draft' : 'published',
        revision: 1,
        createdAt: date,
        updatedAt: date,
        publishedAt: index === 2 ? null : date,
        content: [
          {
            id: id(2),
            contentType: 'header',
            metaData: { text: copy.demoData.heading },
          },
          {
            id: id(3),
            contentType: 'section',
            metaData: { title: empty, body: copy.demoData.body, format: 'plain' },
          },
          {
            id: id(4),
            contentType: 'quote',
            metaData: {
              text: copy.demoData.quote,
              attribution: copy.defaultAuthor,
            },
          },
          {
            id: id(5),
            contentType: 'bullet',
            metaData: { items: [...copy.demoData.items] },
          },
          {
            id: id(6),
            contentType: 'callout',
            metaData: {
              title: copy.demoData.calloutTitle,
              text: copy.demoData.callout,
            },
          },
          { id: id(7), contentType: 'divider', metaData: {} },
          {
            id: id(8),
            contentType: 'footer',
            metaData: { text: copy.demoData.footer },
          },
        ],
      });

    },
  );

  return articles;

}

// **************************************
// MARK: - GET DEMO BLOG STATE
// **************************************

export function getDemoBlogState() {
  return (demoGlobal.portalDemoBlogArticles ??= createDemoBlogArticles());
}

// **************************************
// MARK: - RESET DEMO BLOG STATE
// **************************************

export function resetDemoBlogState() {
  demoGlobal.portalDemoBlogArticles = createDemoBlogArticles();
}
