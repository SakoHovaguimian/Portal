'use client';

import { Button } from '@/components/ui';
import type { RetryErrorProps } from '@/models/retryErrorProps';
import { portalPublishingStrings } from '@/strings';

import styles from '@/modules/blog/Blog.module.css';

const copy = portalPublishingStrings.article;
export default function BlogError({ reset }: RetryErrorProps) {

  return (
    <main id="main-content" tabIndex={-1} className={styles.routeState}>
      <div role="alert" className="grid gap-3">
        <h1>{copy.articleUnavailableTitle}</h1>
        <p>{copy.articleUnavailableDescription}</p>
      </div>
      <Button onClick={reset}>{copy.retry}</Button>
    </main>
  );

}
