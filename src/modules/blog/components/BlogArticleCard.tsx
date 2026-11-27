import Image from 'next/image';
import Link from 'next/link';

import { UiIcon } from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import styles from '../Blog.module.css';
import { BlogDate } from './BlogDate';
import type { BlogArticleCardProps } from '../models/blogArticleCardProps';
import { blogCategoryLabel } from '../models/blogCategory';
import { blogCoverSource } from '../models/blogCover';
import { isBlogImageUrl } from '../models/blogImageUrl';

const copy = portalPublishingStrings.article;

export function BlogArticleCard({
  article,
  headingLevel = 'h2',
  variant = 'journal',
}: BlogArticleCardProps) {

  const Heading = headingLevel;
  return (
    <article
      className={styles.articleCard}
      data-variant={variant}
    >
      {isBlogImageUrl(article.cover) && (
        <div className={styles.cardImage}>
          <Image
            src={blogCoverSource(article.cover)}
            unoptimized
            alt={copy.decorativeAlt}
            width={960}
            height={480}
            sizes={
              variant === 'lead'
                ? '(max-width: 767px) 100vw, 66vw'
                : '(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw'
            }
          />
        </div>
      )}
      <div className={styles.cardCopy}>
        <Heading>
          <Link className={styles.cardOpen} href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </Heading>
        <p className={styles.description}>{article.description}</p>
        <div className={styles.byline}>
          <span className={styles.topic}>{blogCategoryLabel(article.category)}</span>
          <span>{copy.authorByline(article.author)}</span>
          <BlogDate value={article.publishedAt || article.updatedAt} />
        </div>
      </div>
      <span className={styles.readLink} aria-hidden="true">
        {copy.readArticle}
        <UiIcon name="arrowRight" />
      </span>
    </article>
  );

}
