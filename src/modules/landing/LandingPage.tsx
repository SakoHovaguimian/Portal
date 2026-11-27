import Link from 'next/link';

import { ProjectBrand } from '@/components/ProjectBrand';
import { Button, UiIcon } from '@/components/ui';
import { portalModules } from '@/config/portalModules';
import { portalPublishingStrings, strings } from '@/strings';

import { LandingPreview } from './LandingPreview';
import styles from './LandingPage.module.css';
import type { LandingPageProps } from './models/landingPageProps';

const copy = strings.landing;
const shell = strings.ui.appShell;
const capabilities = [
  { title: shell.dashboard, description: copy.capabilities.dashboardDescription, icon: 'grid', enabled: portalModules.dashboard },
  { title: shell.featureRequests, description: copy.capabilities.requestsDescription, icon: 'file', enabled: portalModules.featureRequests },
  { title: shell.chat, description: copy.capabilities.chatDescription, icon: 'mail', enabled: portalModules.chat },
  { title: shell.appearance, description: copy.capabilities.themesDescription, icon: 'sun', enabled: true },
] as const;

export function LandingPage({ workspaceHref, demoMode }: LandingPageProps) {

  const entryHref = workspaceHref ?? (demoMode ? '/login#demo-accounts' : '/login');
  const entryLabel = workspaceHref ? strings.app.openWorkspace : (demoMode ? copy.openDemo : strings.ui.loginScreen.signIn);

  function renderEntryAction() {

    return (
      <Button asChild>
        <Link href={entryHref}>
          {entryLabel}
          <UiIcon name="arrowRight" className="size-4" />
        </Link>
      </Button>
    );

  }

  function renderCapability(item: (typeof capabilities)[number]) {

    return (
      <li key={item.icon} className={styles.capability}>
        <UiIcon name={item.icon} className="mt-1 size-5 text-brand-secondary" />
        <div className="min-w-0">
          <h3 className="m-0 text-base font-semibold text-primary">{item.title}</h3>
          <p className="m-0 mt-1 text-sm text-secondary">{item.description}</p>
        </div>
      </li>
    );

  }

  const capabilityRows = capabilities.filter((item) => item.enabled).map(renderCapability);
  return (
    <div className={styles.layout}>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <ProjectBrand showMark className="font-display text-xl font-semibold tracking-tight text-primary" />
          <nav aria-label={shell.navigation} className={styles.nav}>
            {portalModules.publishing && <Link className={styles.navLink} href="/blog">{portalPublishingStrings.article.publicEyebrow}</Link>}
            <Button asChild variant="secondary">
              <Link href={workspaceHref ?? '/login'}>{workspaceHref ? strings.app.openWorkspace : strings.ui.loginScreen.signIn}</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="landing-title">
          <div className={styles.intro}>
            <h1 id="landing-title">{copy.title}</h1>
            <p>{strings.app.description}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {renderEntryAction()}
              <Link className={styles.navLink} href="#capabilities">{copy.exploreWorkspace}</Link>
            </div>
          </div>
          <div className={styles.previewStage}>
            <LandingPreview />
          </div>
        </section>
        <section className={styles.capabilities} id="capabilities" aria-labelledby="capabilities-title">
          <h2 id="capabilities-title" className="m-0 max-w-[18ch] font-display text-3xl font-semibold tracking-tight text-balance">{copy.capabilitiesTitle}</h2>
          <ul className="m-0 grid list-none p-0">{capabilityRows}</ul>
        </section>
        {demoMode && !workspaceHref && (
          <section className={styles.closing} aria-labelledby="landing-demo-title">
            <div className="grid gap-2">
              <h2 id="landing-demo-title" className="m-0 font-display text-2xl font-semibold tracking-tight">{copy.closingTitle}</h2>
              <p className="m-0 max-w-[60ch] text-sm text-secondary">{copy.closingDescription}</p>
            </div>
            {renderEntryAction()}
          </section>
        )}
      </main>
      <footer className={styles.footer}>
        <ProjectBrand className="text-sm font-semibold text-primary" />
        <Link href="/privacy" className={styles.navLink}>{strings.privacy.noticeTitle}</Link>
      </footer>
    </div>
  );

}
