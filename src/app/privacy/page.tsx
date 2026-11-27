import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';

import { ProjectBrand } from '@/components/ProjectBrand';
import { Page, PageHeader, PageSection } from '@/components/ui';
import { environment } from '@/config/environment';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';
import { strings } from '@/strings';

export const metadata: Metadata = { title: strings.privacy.noticeTitle };

export default async function PrivacyPage() {

  await connection();
  const noticeUrl = environment.privacyNoticeUrl;
  return (
    <main className="mx-auto grid w-full max-w-3xl gap-(--space-section) px-(--space-page) py-(--space-section)">
      <Link
        href="/"
        className="w-fit rounded-sm font-semibold text-brand-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <ProjectBrand />
      </Link>
      <Page>
        <PageHeader
          title={strings.privacy.noticeTitle}
          description={noticeUrl ? undefined : strings.privacy.noticeMissingHint}
        />
        {noticeUrl && (
          <a
            href={noticeUrl}
            rel="noreferrer"
            className="w-fit rounded-sm font-semibold text-brand-secondary underline underline-offset-4 hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {strings.privacy.noticeAction}
          </a>
        )}
        <PageSection id="browser-storage" title={strings.privacy.storageTitle}>
          <p className="text-sm text-secondary">{strings.privacy.storageDescription}</p>
        </PageSection>
        <PageSection id="analytics-preferences" title={strings.privacy.title}>
          <CookieConsentControls noticePage />
        </PageSection>
      </Page>
    </main>
  );

}
