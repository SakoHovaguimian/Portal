import Link from 'next/link';

import { Button } from '@/components/ui';
import { portalPublishingStrings } from '@/strings';

import styles from '@/modules/blog/Blog.module.css';

const copy = portalPublishingStrings.article;
export default function ArticleNotFound() {

  return (
    <main id="main-content" tabIndex={-1} className={styles.routeState}>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundDescription}</p>
      <Button asChild>
        <Link href="/blog">{copy.backToJournal}</Link>
      </Button>
    </main>
  );

}
