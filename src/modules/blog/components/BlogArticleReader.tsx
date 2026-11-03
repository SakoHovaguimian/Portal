import { portalPublishingStrings } from '@/strings';
const copy = portalPublishingStrings.article;
import { blogCategoryLabel } from '../models/blogCategory';
import Image from 'next/image';
import { MarkdownContent } from '@/components/ui';
import type { BlogArticle } from '../models/blogArticle';
import { isBlogImageUrl } from '../models/blogContentUrl';
import { blogCoverSource } from '../models/blogCover';
import styles from '../Blog.module.css';
import { BlogDate } from './BlogDate';
import { BlogContentReader } from './BlogContentReader';
import { blogContentText } from '../content/blogContentText';
import type { ReactNode } from 'react';

export function BlogArticleReader({
  article,
  preview = false,
  accountActions,
}: {
  article: BlogArticle;
  preview?: boolean;
  accountActions?: ReactNode;
}) {
  const date = article.publishedAt || article.updatedAt;
  return (
    <article className={styles.reader}>
      <header className={styles.readerHeader}>
        <p className={styles.topic}>
          {preview
            ? copy.draftPreviewLabel
            : blogCategoryLabel(article.category)}
        </p>
        <h1>{article.title || copy.unsavedPreviewTitle}</h1>
        <p className={styles.readerDescription}>{article.description}</p>
        <div className={styles.readerByline}>
          <span>{copy.authorByline(article.author || copy.defaultAuthor)}</span>
          <BlogDate value={date} long />
          <span>
            {copy.readingTime(
              Math.max(
                1,
                Math.ceil(
                  `${blogContentText(article.content)} ${article.body ?? ''}`.split(
                    /\s+/,
                  ).length / 200,
                ),
              ),
            )}
          </span>
        </div>
      </header>
      {!preview && accountActions}
      {isBlogImageUrl(article.cover) && (
        <div className={styles.readerCover} data-cover={article.cover}>
          <Image
            priority
            src={blogCoverSource(article.cover)}
            unoptimized
            width={1000}
            height={600}
            alt={copy.coverAlt(article.title)}
            sizes="(max-width: 900px) 94vw, 900px"
          />
        </div>
      )}
      <div className={styles.readerBody}>
        {article.content.length ? (
          <BlogContentReader content={article.content} />
        ) : !article.body?.trim() ? (
          <p>{copy.previewEmpty}</p>
        ) : null}
        {article.body?.trim() && (
          <MarkdownContent value={article.body} headingContext="article" />
        )}
      </div>
    </article>
  );
}
