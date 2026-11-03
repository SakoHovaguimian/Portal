import { portalPublishingStrings } from '@/strings';
import { blogCategoryLabel } from '../models/blogCategory';
import Image from 'next/image';
import { MarkdownContent } from '@/components/ui';
import { isBlogImageUrl } from '../models/blogImageUrl';
import { blogCoverSource } from '../models/blogCover';
import styles from '../Blog.module.css';
import { BlogDate } from './BlogDate';
import { BlogContentReader } from './BlogContentReader';
import { blogContentText } from '../content/blogContentText';
import type { BlogArticleReaderProps } from '../models/blogArticleReaderProps';

const copy = portalPublishingStrings.article;

export function BlogArticleReader({
  article,
  preview = false,
  accountActions,
}: BlogArticleReaderProps) {

  const date = article.publishedAt || article.updatedAt;

  function renderArticleHeader() {

    return (
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
    );

  }

  function renderArticleCover() {

    if (!isBlogImageUrl(article.cover)) { return null; }
    return (
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
    );

  }

  function renderArticleBody() {

    return (
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
    );

  }

  return (
    <article className={styles.reader}>
      {renderArticleHeader()}
      {!preview && accountActions}
      {renderArticleCover()}
      {renderArticleBody()}
    </article>
  );

}
