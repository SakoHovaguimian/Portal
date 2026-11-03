import { notFound } from 'next/navigation';
import { portalModules } from '@/config/portalModules';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { portalPublishingStrings, strings } from '@/strings';
import styles from '@/modules/blog/Blog.module.css';
const copy = portalPublishingStrings.article;
export default function BlogLayout({ children }: { children: ReactNode }) {
  if (!portalModules.publishing) notFound();
  return (
    <div className={styles.publicContainer}>
      <nav
        className={styles.publicNavigation}
        aria-label={copy.publicMetadataTitle}
      >
        <Link
          className="font-semibold text-primary hover:text-brand-secondary"
          href="/"
        >
          {strings.app.name}
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog">{copy.allArticles}</Link>
          <Link href="/login">{copy.signIn}</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
