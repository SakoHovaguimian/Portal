import { notFound } from 'next/navigation';
import Link from 'next/link';

import { ProjectBrand } from '@/components/ProjectBrand';
import { portalModules } from '@/config/portalModules';
import type { ChildrenProps } from '@/models/childrenProps';
import { portalPublishingStrings } from '@/strings';

import styles from '@/modules/blog/Blog.module.css';

const copy = portalPublishingStrings.article;
export default function BlogLayout({ children }: ChildrenProps) {

  if (!portalModules.publishing) { notFound(); }
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
          <ProjectBrand />
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
