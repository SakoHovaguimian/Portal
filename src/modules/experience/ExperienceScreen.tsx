'use client';

import Link from 'next/link';

import { ProjectBrand } from '@/components/ProjectBrand';
import { Button, UiIcon } from '@/components/ui';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { useSessionState } from '@/providers/AppProviders';
import { useProjectRouting } from '@/providers/RuntimeProvider';
import { strings } from '@/strings';

import { ExperienceFaq } from './components/ExperienceFaq';
import { ExperienceGallery } from './components/ExperienceGallery';
import { ExperienceMotion } from './components/ExperienceMotion';
import { ExperiencePreview } from './components/ExperiencePreview';
import { ExperienceSystems } from './components/ExperienceSystems';
import styles from './ExperienceScreen.module.css';
import { experienceSections, type ExperienceSection } from './models/experienceSection';
import { useExperienceNavigation } from './useExperienceNavigation';

const copy = strings.ui.experienceScreen;
const steps = [
  copy.promptFirstSetupStillDrivesShellAndRouteDecisionsHint,
  copy.themeChoicePropagatesThroughOneSemanticTokenLayerHint,
  copy.sharedUiPrimitivesKeepDetailPagesAlignedAutomaticallyHint,
];
const foundations = [
  { title: copy.surfaces, description: copy.reducedBlurRemovedGlossyCardsAndStandardizedWhiteOrHint },
  { title: copy.navigation, description: copy.sidebarAndTopChromeNowMatchTheFlatterDashboardHint },
  { title: copy.darkMode, description: copy.panelsStayDistinctThroughLayeringBordersAndShadowRestraintHint },
];

export function ExperienceScreen() {

  const { session } = useSessionState();
  const routing = useProjectRouting();
  const workspaceHref = getDefaultProjectRoute(routing, session?.user.role);
  const { pageRef, headerRef, previewRef, activeSection } = useExperienceNavigation();

  function renderSectionLink({ id, label }: ExperienceSection) {

    return (
      <a key={id} href={`#${id}`} aria-current={id === activeSection ? 'location' : undefined} className={styles.sectionLink}>
        {label}
      </a>
    );

  }

  function renderHeader() {

    const links = experienceSections.map(renderSectionLink);

    return (
      <header ref={headerRef} className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <a href="#hero" className={styles.brand}>
            <ProjectBrand showMark />
          </a>
          <nav aria-label={strings.ui.appShell.navigation} className={styles.navigation}>
            {links}
          </nav>
          <Button asChild variant="secondary" className={styles.exit}>
            <Link href={workspaceHref}>
              <UiIcon name="chevronLeft" className="size-4 shrink-0" />
              {workspaceHref === '/dashboard' ? copy.backToDashboard : strings.app.openWorkspace}
            </Link>
          </Button>
        </div>
      </header>
    );

  }

  function renderHero() {

    return (
      <section id="hero" tabIndex={-1} aria-labelledby="experience-title" className={styles.hero}>
        <div className={styles.intro}>
          <h1 id="experience-title">{copy.dashboardStylingPreview}</h1>
          <p>{copy.thisRouteShowsTheNewDirectionAcrossHeroContentHint}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={workspaceHref}>
                {copy.enterPortal}
                <UiIcon name="arrowRight" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <a href="#solutions">{copy.exploreTheSystem}</a>
            </Button>
          </div>
        </div>
        <div className={styles.stage}>
          <div ref={previewRef} className={styles.previewMotion}>
            <ExperiencePreview />
          </div>
        </div>
      </section>
    );

  }

  function renderStep(step: string) {
    return <li key={step} className={styles.step}>{step}</li>;
  }

  function renderFoundation({ title, description }: (typeof foundations)[number]) {

    return (
      <div key={title} className="grid gap-1 border-b-control border-secondary py-3 last:border-0">
        <dt className="font-medium text-primary">{title}</dt>
        <dd className="m-0 text-sm leading-relaxed text-secondary">{description}</dd>
      </div>
    );

  }

  function renderWorkflow() {

    const stepRows = steps.map(renderStep);
    const foundationRows = foundations.map(renderFoundation);

    return (
      <section id="workflow" tabIndex={-1} aria-labelledby="workflow-title" className={styles.splitSection}>
        <div className="grid min-w-0 gap-5">
          <header className={styles.sectionHeader}>
            <h2 id="workflow-title">{copy.theVisualUpdateStillRespectsTheSystemUnderneath}</h2>
            <p>{copy.routesStayThinServicesKeepOrchestrationAndPresentationFlowsHint}</p>
          </header>
          <ol className={styles.steps}>{stepRows}</ol>
        </div>
        <div className={styles.foundationNotes}>
          <h3 className="m-0 text-lg font-semibold tracking-tight text-primary">{copy.whatChanged}</h3>
          <dl className="m-0">{foundationRows}</dl>
        </div>
      </section>
    );

  }

  function renderContact() {

    const details = [
      [copy.contactDetails, copy.ariBennett, copy.founderSemanticStudio, copy.supportSemanticstudioDevData, copy.value14155550199],
      [copy.officeHours, copy.monThu900Am600PmPt, copy.fri900Am300PmPt, copy.responseSlaUnder1BusinessDay],
      [copy.mockAddress, copy.value410MarketStreet, copy.sanFranciscoCa],
    ];

    function renderContactDetail([title, ...lines]: string[]) {

      const lineItems = lines.map((line) => <li key={line}>{line}</li>);
      return (
        <div key={title} className={styles.contactGroup}>
          <h3 className="m-0 text-base font-semibold text-primary">{title}</h3>
          <ul className="m-0 grid list-none gap-1 p-0 text-sm leading-relaxed text-secondary wrap-anywhere">{lineItems}</ul>
        </div>
      );

    }

    const contactDetails = details.map(renderContactDetail);

    return (
      <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 id="contact-title">{copy.mockHandoffDetailsInTheSameDashboardVisualSystem}</h2>
        </header>
        <div className={styles.contact}>{contactDetails}</div>
      </section>
    );

  }

  function renderFooter() {

    return (
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <ProjectBrand className="text-sm font-semibold text-primary" />
          <nav className="flex flex-wrap gap-x-5" aria-label={strings.componentLibrary.onThisPage}>
            <a href="#hero" className={styles.sectionLink}>{copy.overview}</a>
            <a href="#contact" className={styles.sectionLink}>{copy.contact}</a>
            <Link href="/privacy" className={styles.sectionLink}>{strings.privacy.noticeTitle}</Link>
          </nav>
        </div>
      </footer>
    );

  }

  return (
    <div ref={pageRef} className={styles.page}>
      <a href="#experience-content" className={styles.skipLink}>{strings.componentLibrary.skipToContent}</a>
      {renderHeader()}
      <main id="experience-content" tabIndex={-1} className={styles.content}>
        {renderHero()}
        <ExperienceSystems />
        {renderWorkflow()}
        <ExperienceGallery />
        <ExperienceMotion />
        {renderContact()}
        <ExperienceFaq />
      </main>
      {renderFooter()}
    </div>
  );

}
