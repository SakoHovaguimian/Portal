import { notFound } from 'next/navigation';
import Link from 'next/link';

import { ProjectBrand } from '@/components/ProjectBrand';
import { getProjectRouting } from '@/config/getProjectRouting';
import { portalModules } from '@/config/portalModules';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { getServerSession } from '@/lib/server/getServerSession';
import type { ChildrenProps } from '@/models/childrenProps';
import { PrivacyNoticeLink } from '@/services/privacy/components/PrivacyNoticeLink';
import { portalPublishingStrings, strings } from '@/strings';

import styles from '@/modules/blog/Blog.module.css';

const copy = portalPublishingStrings.article;
export default async function BlogLayout({ children }: ChildrenProps) {

  if (!portalModules.publishing) { notFound(); }
  const session = await getServerSession();
  const workspaceHref = session
    ? getDefaultProjectRoute(getProjectRouting(), session.user.role)
    : undefined;
  return (
    <div className={styles.publicContainer}>
      <a href="#main-content" className={styles.skipLink}>
        {strings.componentLibrary.skipToContent}
      </a>
      <nav
        className={styles.publicNavigation}
        aria-label={copy.publicMetadataTitle}
      >
        <Link
          className={styles.publicBrand}
          href="/"
        >
          <ProjectBrand showMark />
        </Link>
        <div className={styles.publicLinks}>
          <Link href="/blog">{copy.allArticles}</Link>
          {workspaceHref ? (
            <Link href={workspaceHref}>{strings.app.openWorkspace}</Link>
          ) : (
            <Link href="/login">{copy.signIn}</Link>
          )}
        </div>
      </nav>
      {children}
      <footer className={styles.publicFooter}>
        <PrivacyNoticeLink />
      </footer>
    </div>
  );

}
