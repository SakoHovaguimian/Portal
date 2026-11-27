import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';

import { ProjectBrand } from '@/components/ProjectBrand';
import { Button, Page, PageHeader, SectionStack, SplitSection, UiIcon } from '@/components/ui';
import { environment } from '@/config/environment';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';
import { strings } from '@/strings';

export const metadata: Metadata = { title: strings.privacy.noticeTitle };

export default async function PrivacyPage() {

  await connection();
  const noticeUrl = environment.privacyNoticeUrl;
  return (
    <>
      <header className="border-b-control border-secondary bg-secondary_subtle">
        <div className="mx-auto flex min-h-18 w-full max-w-6xl items-center px-(--space-page)">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-control font-display text-xl font-semibold tracking-tight text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <ProjectBrand showMark />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-(--space-page) py-10 sm:py-16">
        <Page>
          <PageHeader
            title={strings.privacy.noticeTitle}
            description={noticeUrl ? undefined : strings.privacy.noticeMissingHint}
            action={noticeUrl && (
              <Button asChild variant="secondary">
                <a href={noticeUrl} rel="noreferrer">
                  {strings.privacy.noticeAction}
                  <UiIcon name="arrowRight" className="size-4" />
                </a>
              </Button>
            )}
          />
          <SectionStack className="border-t-control border-secondary pt-(--space-section)">
            <SplitSection id="browser-storage" title={strings.privacy.storageTitle} bare>
              <p className="m-0 max-w-[68ch] text-sm text-secondary">{strings.privacy.storageDescription}</p>
            </SplitSection>
            <SplitSection id="analytics-preferences" title={strings.privacy.title} bare>
              <CookieConsentControls noticePage />
            </SplitSection>
          </SectionStack>
        </Page>
      </main>
    </>
  );

}
