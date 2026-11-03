import 'server-only';
import { portalPublishingStrings } from '@/strings';
import { BlogArticleSchema, type BlogArticle } from '../models/blogArticle';
const copy = portalPublishingStrings.article;
const empty = '';
const demoGlobal = globalThis as typeof globalThis & {
  portalDemoBlogArticles?: BlogArticle[];
};
export function createDemoBlogArticles(): BlogArticle[] {
  return [copy.demo.title, copy.demo.secondTitle, copy.demo.draftTitle].map(
    (title, index) => {
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
          copy.demo.description,
          copy.demo.secondDescription,
          copy.demo.draftDescription,
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
            metaData: { text: copy.demo.heading },
          },
          {
            id: id(3),
            contentType: 'section',
            metaData: { title: empty, body: copy.demo.body, format: 'plain' },
          },
          {
            id: id(4),
            contentType: 'quote',
            metaData: {
              text: copy.demo.quote,
              attribution: copy.defaultAuthor,
            },
          },
          {
            id: id(5),
            contentType: 'bullet',
            metaData: { items: [...copy.demo.items] },
          },
          {
            id: id(6),
            contentType: 'callout',
            metaData: {
              title: copy.demo.calloutTitle,
              text: copy.demo.callout,
            },
          },
          { id: id(7), contentType: 'divider', metaData: {} },
          {
            id: id(8),
            contentType: 'footer',
            metaData: { text: copy.demo.footer },
          },
        ],
      });
    },
  );
}
export function getDemoBlogState() {
  return (demoGlobal.portalDemoBlogArticles ??= createDemoBlogArticles());
}
export function resetDemoBlogState() {
  demoGlobal.portalDemoBlogArticles = createDemoBlogArticles();
}
