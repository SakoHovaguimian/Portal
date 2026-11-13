'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

const sections = [
  { id: 'hero', label: strings.ui.experienceScreen.overview },
  { id: 'solutions', label: strings.ui.experienceScreen.system },
  { id: 'workflow', label: strings.ui.experienceScreen.workflow },
  { id: 'gallery', label: strings.ui.experienceScreen.showcase },
  { id: 'motion', label: strings.ui.experienceScreen.motion },
  { id: 'contact', label: strings.ui.experienceScreen.contact },
  { id: 'faq', label: strings.ui.experienceScreen.faq },
] as const;

const solutions = [
  {
    title: strings.ui.experienceScreen.dashboardFirstSurfaces,
    description:
      strings.ui.experienceScreen.cardsListsFormsAndSideNavigationAllUseTheHint,
  },
  {
    title: strings.ui.experienceScreen.accentColorAsSupport,
    description:
      strings.ui.experienceScreen
        .selectedThemeColorsHighlightActiveStatesPillsAndKeyHint,
  },
  {
    title: strings.ui.experienceScreen.darkModeThatStaysReadable,
    description:
      strings.ui.experienceScreen
        .theDarkThemeUsesLayeredSlatePanelsAndRestrainedHint,
  },
  {
    title: strings.ui.experienceScreen.overlayControlsPreserved,
    description:
      strings.ui.experienceScreen
        .toastsAlertsAndSheetsStillRunThroughOnePresentationHint,
  },
] as const;

const showcaseStats = [
  {
    label: strings.ui.experienceScreen.selectedTheme,
    value: strings.ui.experienceScreen.accentAware,
  },
  {
    label: strings.ui.experienceScreen.surfaceLanguage,
    value: strings.ui.experienceScreen.flatPanels,
  },
  {
    label: strings.ui.experienceScreen.navigationStyle,
    value: strings.ui.experienceScreen.dashboardShell,
  },
] as const;

const faqItems = [
  {
    question: strings.ui.experienceScreen.canWeStillLaunchHeroOnly,
    answer:
      strings.ui.experienceScreen.yesThisShowcaseRouteIsOptionalAndCanStayHint,
  },
  {
    question: strings.ui.experienceScreen.canWeKeepAuthOptional,
    answer:
      strings.ui.experienceScreen.yesTheVisualRestyleDoesNotChangeTheScaffoldHint,
  },
  {
    question: strings.ui.experienceScreen.canTheSelectedAccentStaySubtle,
    answer:
      strings.ui.experienceScreen
        .yesTheNewSystemDeliberatelyLimitsAccentUsageToHint,
  },
  {
    question: strings.ui.experienceScreen.areTheChartsRealYet,
    answer:
      strings.ui.experienceScreen
        .theAnalyticsWidgetsInTheRedesignedDashboardUseMockHint,
  },
  {
    question: strings.ui.experienceScreen.doesDarkModeKeepTheSameStructure,
    answer:
      strings.ui.experienceScreen.yesTheSameCardAndShellHierarchyCarriesThroughHint,
  },
  {
    question: strings.ui.experienceScreen.canWeSwapTheThemePerUser,
    answer:
      strings.ui.experienceScreen
        .yesThemeChoiceLivesInAppearancePreferencesHint,
  },
  {
    question: strings.ui.experienceScreen.willFormControlsMatchTheDashboard,
    answer:
      strings.ui.experienceScreen.yesInputsButtonsTabsAndOverlaysNowInheritTheHint,
  },
  {
    question: strings.ui.experienceScreen.areTheSideNavigationItemsReusable,
    answer: strings.ui.experienceScreen.yesTheSidebarIsStillDrivenFromOneSharedHint,
  },
  {
    question: strings.ui.experienceScreen.canWeAddMoreDashboardWidgetsLater,
    answer:
      strings.ui.experienceScreen
        .yesTheCurrentMockedCardsAreIntentionallyBuiltFromHint,
  },
  {
    question:
      strings.ui.experienceScreen.willRecordsAndRegistryStayInTheDashboard,
    answer:
      strings.ui.experienceScreen
        .yesThoseExistingOperationalPanelsRemainInPlaceAndHint,
  },
  {
    question: strings.ui.experienceScreen.doOverlayAnimationsStillWork,
    answer:
      strings.ui.experienceScreen
        .yesAlertToastAndSheetTimingControlsAreUntouchedHint,
  },
  {
    question: strings.ui.experienceScreen.canTheFooterBeBrandSpecific,
    answer: strings.ui.experienceScreen.yesTheFullWidthFooterIsJustContentAndHint,
  },
  {
    question: strings.ui.experienceScreen.willTheAuthPagesKeepThisStyle,
    answer: strings.ui.experienceScreen.yesLoginAndSignupNowUseTheSameFlatterHint,
  },
  {
    question: strings.ui.experienceScreen.canWeTurnSomeSectionsOff,
    answer:
      strings.ui.experienceScreen.yesTheShowcaseRouteIsModularAndSectionsCanHint,
  },
  {
    question: strings.ui.experienceScreen.isThisMeantToReplaceTheOldGlossyLook,
    answer: strings.ui.experienceScreen.yesTheGoalOfThisPassIsToMoveHint,
  },
] as const;

export function ExperienceScreen() {

  const presentation = usePresentationService();
  const motionPreviewDisposer = useRef<(() => void) | null>(null);
  useEffect(() => {

    const cleanup = () => {

      motionPreviewDisposer.current?.();
      motionPreviewDisposer.current = null;

    };

    return cleanup;

  }, []);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]['id']>('hero');
  const [revealedSections, setRevealedSections] = useState<
    Record<string, boolean>
  >({ hero: true });
  const [expandedFaq, setExpandedFaq] = useState<(typeof faqItems)[number]['question'] | null>(faqItems[0].question);

  useEffect(() => {

    let frame = 0;

    const onScroll = () => {

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {

        setScrollY(window.scrollY);
        frame = 0;

      });

    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const cleanup = () => {

      window.removeEventListener('scroll', onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

    };

    return cleanup;

  }, []);

  useEffect(() => {

    const nodes = sections
      .map((section) => ({
        id: section.id,
        node: document.getElementById(section.id),
      }))
      .filter(
        (
          entry,
        ): entry is {
          id: (typeof sections)[number]['id'];
          node: HTMLElement;
        } => entry.node instanceof HTMLElement,
      );

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id as (typeof sections)[number]['id'];
          setRevealedSections((current) =>
            current[id] ? current : { ...current, [id]: true },
          );

        });

      },
      { threshold: [0.05, 0.2, 0.45], rootMargin: '-8% 0px -22% 0px' },
    );

    nodes.forEach((entry) => observer.observe(entry.node));
    const cleanup = () => observer.disconnect();
    return cleanup;

  }, []);

  const heroParallax = useMemo(() => Math.min(scrollY * 0.1, 30), [scrollY]);
  const visibleState = (id: (typeof sections)[number]['id']) =>
    (revealedSections[id] ? 'true' : 'false') as 'true' | 'false';

  useEffect(() => {

    const header = document.querySelector('[data-showcase-header="true"]');
    const headerHeight =
      header instanceof HTMLElement ? header.offsetHeight : 72;
    const activationOffset = headerHeight + 24;

    let nextActiveSection: (typeof sections)[number]['id'] = sections[0].id;

    for (const section of sections) {

      const node = document.getElementById(section.id);
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      if (node.getBoundingClientRect().top <= activationOffset) {
        nextActiveSection = section.id;
      }

    }

    const frame = requestAnimationFrame(() => {

      setActiveSection((current) =>
        current === nextActiveSection ? current : nextActiveSection,
      );

    });
    const cleanup = () => cancelAnimationFrame(frame);
    return cleanup;

  }, [scrollY]);

  async function handleSolutionPresentation(index: number) {

    if (index === 0) {

      await presentation.showAlert({
        title: strings.ui.experienceScreen.dashboardSurfacePreset,
        description:
          strings.ui.experienceScreen
            .primaryCardsMutedPanelsAndFlatterDataRowsStayHint,
        tone: 'info',
        confirmLabel: strings.ui.experienceScreen.looksGood,
        cancelLabel: strings.ui.experienceScreen.close,
      });
      return;

    }

    if (index === 1) {

      await presentation.showSheet({
        title: strings.ui.experienceScreen.accentUsageGuardrails,
        description:
          strings.ui.experienceScreen
            .useTheSelectedAccentForActiveStatesChipsAndHint,
        tone: 'success',
        side: 'right',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">
              {strings.ui.experienceScreen.keepLargeBackgroundsMostlyNeutralHint}
            </p>
            <p className="m-0 text-sm text-secondary">
              {
                strings.ui.experienceScreen
                  .letBrandColorShowUpInNavigationStateTagsHint
              }
            </p>
          </div>
        ),
      });
      return;

    }

    if (index === 2) {

      await presentation.showSheet({
        title: strings.ui.experienceScreen.darkModeNotes,
        description:
          strings.ui.experienceScreen
            .layeredSlateSurfacesReplaceThePreviousGlossyLookHint,
        tone: 'warning',
        side: 'bottom',
        size: 'lg',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">
              {
                strings.ui.experienceScreen
                  .cardsStayLiftedThroughBordersAndPanelContrastNotHint
              }
            </p>
            <p className="m-0 text-sm text-secondary">
              {
                strings.ui.experienceScreen
                  .textHierarchyStaysConsistentBetweenLightAndDarkThemesHint
              }
            </p>
          </div>
        ),
      });
      return;

    }

    await presentation.showAlert({
      title: strings.ui.experienceScreen.presentationStylingUpdated,
      description:
        strings.ui.experienceScreen
          .toastsAlertsAndSheetsNowInheritTheSameFlatterHint,
      tone: 'success',
      alignment: 'top',
      confirmLabel: strings.ui.experienceScreen.great,
      cancelLabel: strings.ui.experienceScreen.close,
    });

  }

  function scrollToSection(id: (typeof sections)[number]['id']) {

    const node = document.getElementById(id);
    if (!node) {
      return;
    }

    setActiveSection(id);
    const header = document.querySelector('[data-showcase-header="true"]');
    const headerHeight =
      header instanceof HTMLElement ? header.offsetHeight : 72;
    const top =
      window.scrollY + node.getBoundingClientRect().top - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });

  }

  function renderHeader() {

    function renderSectionLink(section: (typeof sections)[number]) {

      return (
        <Button
          variant="ghost"
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className={`bouncy-button rounded-lg border-control px-4 py-2 text-sm font-medium transition ${
            activeSection === section.id
              ? 'border-brand/60 bg-brand-primary text-primary shadow-(--dashboard-shell-shadow)'
              : 'border-secondary bg-primary text-secondary hover:border-primary hover:text-primary'
          }`}
        >
          {section.label}
        </Button>
      );

    }

    const sectionLinks = sections.map(renderSectionLink);

    return (
      <div
        data-showcase-header="true"
        className="sticky top-0 z-40 border-b border-secondary bg-(--dashboard-shell-topbar) backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
              {strings.ui.experienceScreen.showcase}
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-primary">
              {strings.ui.experienceScreen.dashboardStylingPreview}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sectionLinks}
            <Link
              href={'/dashboard' as never}
              className="bouncy-button rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-text-primary_on-brand shadow-(--dashboard-shell-shadow) transition hover:bg-brand-solid_hover"
            >
              {strings.ui.experienceScreen.backToDashboard}
            </Link>
          </div>
        </div>
      </div>
    );

  }

  function renderSections() {

    function renderHero() {

      function renderHeroChip(chip: string) {

        return (
          <span
            key={chip}
            className="inline-flex rounded-full border-control border-secondary bg-secondary_subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary"
          >
            {chip}
          </span>
        );

      }

      const heroChips = [
        strings.ui.experienceScreen.flatCardLanguage,
        strings.ui.experienceScreen.accentAwareStates,
        strings.ui.experienceScreen.layeredDarkMode,
        strings.ui.experienceScreen.sharedSystemTokens,
      ].map(renderHeroChip);

      function renderHeroMetric(label: string, index: number) {

        return (
          <div
            key={label}
            className="rounded-xl border-control border-secondary bg-primary p-4"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
              {label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-primary">
              {['24.8%', '134', '92%'][index]}
            </p>
          </div>
        );

      }

      const heroMetrics = [
        strings.ui.experienceScreen.conversion,
        strings.ui.experienceScreen.tickets,
        strings.ui.experienceScreen.retention,
      ].map(renderHeroMetric);

      function renderTrafficBar(height: number, index: number) {

        return (
          <span
            key={index}
            className={`w-full rounded-t-md ${index > 6 ? 'bg-brand-solid/80' : 'bg-secondary'}`}
            style={{ height: `${height}%` }}
          />
        );

      }

      const trafficBars = [38, 52, 44, 70, 58, 66, 82, 74, 88, 80].map(
        renderTrafficBar,
      );

      function renderShowcaseStat(item: (typeof showcaseStats)[number]) {

        return (
          <article
            key={item.label}
            className="rounded-2xl border-control border-secondary bg-primary p-4 shadow-(--dashboard-shell-shadow)"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {item.value}
            </p>
          </article>
        );

      }

      const statCards = showcaseStats.map(renderShowcaseStat);

      return (
        <section
          id="hero"
          className="experience-reveal grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
          data-visible={visibleState('hero')}
        >
          <article className="rounded-3xl border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow-lg) sm:p-8 lg:p-10">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {strings.ui.experienceScreen.restyledSystem}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-primary">
              {
                strings.ui.experienceScreen
                  .fromGlossyPrototypeToACalmerDashboardProductSurface
              }
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-secondary sm:text-lg">
              {
                strings.ui.experienceScreen
                  .thisRouteShowsTheNewDirectionAcrossHeroContentHint
              }
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {heroChips}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={'/dashboard' as never}
                className="bouncy-button rounded-lg bg-brand-solid px-5 py-3 text-sm font-semibold text-text-primary_on-brand shadow-(--dashboard-shell-shadow) transition hover:bg-brand-solid_hover"
              >
                {strings.ui.experienceScreen.enterPortal}
              </Link>
              <Button
                variant="ghost"
                type="button"
                onClick={() => scrollToSection('solutions')}
                className="bouncy-button rounded-lg border-control border-secondary bg-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary_subtle"
              >
                {strings.ui.experienceScreen.exploreTheSystem}
              </Button>
            </div>
          </article>

          <div
            className="grid gap-4"
            style={{ transform: `translate3d(0, ${-heroParallax}px, 0)` }}
          >
            <article className="rounded-3xl border-control border-secondary bg-primary p-5 shadow-(--dashboard-shell-shadow)">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
                    {strings.ui.experienceScreen.previewSurface}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-primary">
                    {strings.ui.experienceScreen.liveDashboardMock}
                  </h3>
                </div>
                <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                  {strings.ui.experienceScreen.active}
                </span>
              </div>
              <div className="mt-5 grid gap-4 rounded-2xl border-control border-secondary bg-secondary_subtle p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {heroMetrics}
                </div>
                <div className="rounded-xl border-control border-secondary bg-primary p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="m-0 text-sm font-semibold text-primary">
                      {strings.ui.experienceScreen.trafficOverview}
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-tertiary">
                      {strings.ui.experienceScreen.last7Days}
                    </span>
                  </div>
                  <div className="mt-4 flex h-32 items-end gap-2">
                    {trafficBars}
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-3">
              {statCards}
            </div>
          </div>
        </section>
      );

    }

    function renderSolutions() {

      function renderSolutionCard(solution: (typeof solutions)[number], index: number) {

        return (
          <Button
            variant="ghost"
            key={solution.title}
            type="button"
            onClick={() => void handleSolutionPresentation(index)}
            className="bouncy-button group grid min-h-60 gap-4 rounded-card border-control border-secondary bg-primary p-6 text-left shadow-(--dashboard-shell-shadow) transition duration-200 hover:border-primary"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">
              {strings.ui.experienceScreen.value0}
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-primary">
                {solution.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-secondary">
                {solution.description}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                {strings.ui.experienceScreen.openPreview}
              </p>
            </div>
          </Button>
        );

      }

      const solutionCards = solutions.map(renderSolutionCard);

      return (
        <section
          id="solutions"
          className="experience-reveal grid gap-8"
          data-visible={visibleState('solutions')}
        >
          <div className="grid gap-3 lg:max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
              {strings.ui.experienceScreen.systemDirection}
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              {
                strings.ui.experienceScreen
                  .aFlatDashboardLanguageLayeredOnTopOfArchitecture
              }
            </h2>
            <p className="text-base leading-7 text-secondary">
              {
                strings.ui.experienceScreen
                  .theRestyleKeepsYourAppStructureDataContractsAndHint
              }
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {solutionCards}
          </div>
        </section>
      );

    }

    function renderWorkflow() {

      function renderWorkflowStep(item: string, index: number) {

        return (
          <div
            key={item}
            className="flex gap-4 rounded-2xl border-control border-secondary bg-secondary_subtle p-4"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-brand-secondary">
              {index + 1}
            </span>
            <p className="m-0 text-sm leading-7 text-secondary">{item}</p>
          </div>
        );

      }

      const workflowSteps = [
        strings.ui.experienceScreen
          .promptFirstSetupStillDrivesShellAndRouteDecisionsHint,
        strings.ui.experienceScreen
          .themeChoicePropagatesThroughOneSemanticTokenLayerHint,
        strings.ui.experienceScreen
          .sharedUiPrimitivesKeepDetailPagesAlignedAutomaticallyHint,
      ].map(renderWorkflowStep);

      function renderChangeNote([title, description]: string[]) {

        return (
          <div
            key={title}
            className="rounded-2xl border-control border-secondary bg-secondary_subtle p-4"
          >
            <h3 className="m-0 text-base font-semibold text-primary">
              {title}
            </h3>
            <p className="mt-2 m-0 text-sm leading-6 text-secondary">
              {description}
            </p>
          </div>
        );

      }

      const changeNotes = [
        [
          strings.ui.experienceScreen.surfaces,
          strings.ui.experienceScreen
            .reducedBlurRemovedGlossyCardsAndStandardizedWhiteOrHint,
        ],
        [
          strings.ui.experienceScreen.navigation,
          strings.ui.experienceScreen
            .sidebarAndTopChromeNowMatchTheFlatterDashboardHint,
        ],
        [
          strings.ui.experienceScreen.darkMode,
          strings.ui.experienceScreen
            .panelsStayDistinctThroughLayeringBordersAndShadowRestraintHint,
        ],
      ].map(renderChangeNote);

      return (
        <section
          id="workflow"
          className="experience-reveal grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
          data-visible={visibleState('workflow')}
        >
          <article className="grid gap-5 rounded-3xl border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow) sm:p-8">
            <div className="grid gap-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                {strings.ui.experienceScreen.workflow}
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                {
                  strings.ui.experienceScreen
                    .theVisualUpdateStillRespectsTheSystemUnderneath
                }
              </h2>
              <p className="text-base leading-7 text-secondary">
                {
                  strings.ui.experienceScreen
                    .routesStayThinServicesKeepOrchestrationAndPresentationFlowsHint
                }
              </p>
            </div>
            <div className="grid gap-4">
              {workflowSteps}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="rounded-3xl border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                {strings.ui.experienceScreen.whatChanged}
              </p>
              <div className="mt-4 space-y-4">
                {changeNotes}
              </div>
            </article>
          </div>
        </section>
      );

    }

    function renderGallery() {

      function renderChannel(item: string, index: number) {

        return (
          <div key={item}>
            <div className="flex items-center justify-between gap-3 text-sm text-secondary">
              <span>{item}</span>
              <span>
                {[42, 33, 25][index]}
                {strings.ui.experienceScreen.text}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-brand-solid"
                style={{ width: `${[42, 33, 25][index]}%` }}
              />
            </div>
          </div>
        );

      }

      const channelRows = [
        strings.ui.experienceScreen.product,
        strings.ui.experienceScreen.support,
        strings.ui.experienceScreen.growth,
      ].map(renderChannel);

      function renderRecentActivity(item: string) {

        return (
          <div
            key={item}
            className="flex items-start gap-3 text-sm text-secondary"
          >
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-solid" />
            <span>{item}</span>
          </div>
        );

      }

      const activityRows = [
        strings.ui.experienceScreen
          .sidebarChromeUpdatedToFlatterCardTreatmentHint,
        strings.ui.experienceScreen
          .tablesNowUseSofterRowHoverAndCleanerSeparatorsHint,
        strings.ui.experienceScreen
          .themeAccentsDriveSelectedStateWithoutFloodingSurfacesHint,
      ].map(renderRecentActivity);

      function renderGalleryNote(item: string, index: number) {

        return (
          <article
            key={item}
            className="rounded-2xl border-control border-secondary bg-secondary_subtle p-4"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
              {strings.ui.experienceScreen.value0}
              {index + 1}
            </p>
            <p className="mt-2 m-0 text-sm leading-6 text-secondary">
              {item}
            </p>
          </article>
        );

      }

      const galleryNotes = [
        strings.ui.experienceScreen
          .activeStateNowLivesInNavigationPillsAndPrimaryHint,
        strings.ui.experienceScreen
          .cardsRelyOnBorderContrastAndSpacingMoreThanHint,
        strings.ui.experienceScreen
          .theDarkPaletteUsesSlateLayersInsteadOfGlossyHint,
        strings.ui.experienceScreen
          .featurePagesInheritTheNewSystemThroughSharedPrimitivesHint,
      ].map(renderGalleryNote);

      return (
        <section
          id="gallery"
          className="experience-reveal grid gap-6 rounded-3xl border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)"
          data-visible={visibleState('gallery')}
        >
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {strings.ui.experienceScreen.showcase}
            </p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {
                strings.ui.experienceScreen
                  .theSameDesignLanguageScalesFromHeroSectionsTo
              }
            </h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-card border-control border-secondary bg-secondary_subtle p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
                    {strings.ui.experienceScreen.dashboardPreview}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-primary">
                    {strings.ui.experienceScreen.neutralCanvasSelectiveAccent}
                  </h3>
                </div>
                <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                  {strings.ui.experienceScreen.preview}
                </span>
              </div>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border-control border-secondary bg-primary p-4">
                    <p className="m-0 text-sm font-semibold text-primary">
                      {strings.ui.experienceScreen.revenueMix}
                    </p>
                    <div
                      className="mt-4 h-36 rounded-lg"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-500) 14%, transparent), transparent), linear-gradient(180deg, var(--color-bg-secondary_subtle), var(--color-bg-primary))',
                      }}
                    />
                  </div>
                  <div className="rounded-xl border-control border-secondary bg-primary p-4">
                    <p className="m-0 text-sm font-semibold text-primary">
                      {strings.ui.experienceScreen.topChannels}
                    </p>
                    <div className="mt-4 space-y-3">
                      {channelRows}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border-control border-secondary bg-primary p-4">
                  <p className="m-0 text-sm font-semibold text-primary">
                    {strings.ui.experienceScreen.recentActivity}
                  </p>
                  <div className="mt-4 space-y-3">
                    {activityRows}
                  </div>
                </div>
              </div>
            </article>
            <div className="grid gap-4">
              {galleryNotes}
            </div>
          </div>
        </section>
      );

    }

    function renderMotion() {

      return (
        <section
          id="motion"
          className="experience-reveal grid gap-6 rounded-3xl border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)"
          data-visible={visibleState('motion')}
        >
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {strings.ui.experienceScreen.presentationMotion}
            </p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {
                strings.ui.experienceScreen
                  .motionIsStillConfigurableButTheChromeAroundIt
              }
            </h2>
            <p className="m-0 max-w-3xl text-sm leading-7 text-secondary">
              {
                strings.ui.experienceScreen
                  .useTheSameControlsAsBeforeToChangeToastHint
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={async () => {

                motionPreviewDisposer.current?.();
                motionPreviewDisposer.current = presentation.configureMotion({
                  enabled: true,
                  toastDurationMs: 170,
                  alertDurationMs: 180,
                  sheetDurationMs: 190,
                });
                await presentation.showToast({
                  title: strings.ui.experienceScreen.fastMotionPreset,
                  description:
                    strings.ui.experienceScreen
                      .presentationOverlaysNowAnimateAtASnappierPaceHint,
                  intent: 'success',
                });

              }}
            >
              {strings.ui.experienceScreen.fast}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {

                motionPreviewDisposer.current?.();
                motionPreviewDisposer.current = presentation.configureMotion({
                  enabled: true,
                  toastDurationMs: 280,
                  alertDurationMs: 300,
                  sheetDurationMs: 320,
                });
                await presentation.showToast({
                  title: strings.ui.experienceScreen.relaxedMotionPreset,
                  description:
                    strings.ui.experienceScreen
                      .transitionsNowRunWithSlowerTimingForACalmerHint,
                  intent: 'info',
                });

              }}
            >
              {strings.ui.experienceScreen.relaxed}
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {

                motionPreviewDisposer.current?.();
                motionPreviewDisposer.current = presentation.configureMotion({ enabled: false });
                await presentation.showToast({
                  title: strings.ui.experienceScreen.motionDisabled,
                  description:
                    strings.ui.experienceScreen
                      .allPresentationAnimationsAreNowTurnedOffHint,
                  intent: 'warning',
                  motion: { enabled: false },
                });

              }}
            >
              {strings.ui.experienceScreen.disableMotion}
            </Button>
            <Button
              onClick={async () => {

                motionPreviewDisposer.current?.();
                motionPreviewDisposer.current = null;
                await presentation.showAlert({
                  title: strings.ui.experienceScreen.defaultMotionRestored,
                  description:
                    strings.ui.experienceScreen
                      .toastAlertAndSheetTimingsAreBackToDefaultHint,
                  tone: 'info',
                  confirmLabel: strings.ui.experienceScreen.done,
                  cancelLabel: strings.ui.experienceScreen.dismiss,
                });

              }}
            >
              {strings.ui.experienceScreen.resetDefaults}
            </Button>
          </div>
        </section>
      );

    }

    function renderContact() {

      return (
        <section
          id="contact"
          className="experience-reveal grid gap-8"
          data-visible={visibleState('contact')}
        >
          <div className="grid gap-3 lg:max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
              {strings.ui.experienceScreen.contact}
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              {
                strings.ui.experienceScreen
                  .mockHandoffDetailsInTheSameDashboardVisualSystem
              }
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-card border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)">
              <h3 className="text-xl font-semibold text-primary">
                {strings.ui.experienceScreen.contactDetails}
              </h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">{strings.ui.experienceScreen.ariBennett}</p>
                <p className="m-0">
                  {strings.ui.experienceScreen.founderSemanticStudio}
                </p>
                <p className="m-0">
                  {strings.ui.experienceScreen.supportSemanticstudioDevData}
                </p>
                <p className="m-0">
                  {strings.ui.experienceScreen.value14155550199}
                </p>
              </div>
            </article>
            <article className="rounded-card border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)">
              <h3 className="text-xl font-semibold text-primary">
                {strings.ui.experienceScreen.officeHours}
              </h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">
                  {strings.ui.experienceScreen.monThu900Am600PmPt}
                </p>
                <p className="m-0">
                  {strings.ui.experienceScreen.fri900Am300PmPt}
                </p>
                <p className="m-0">
                  {strings.ui.experienceScreen.responseSlaUnder1BusinessDay}
                </p>
              </div>
            </article>
            <article className="rounded-card border-control border-secondary bg-primary p-6 shadow-(--dashboard-shell-shadow)">
              <h3 className="text-xl font-semibold text-primary">
                {strings.ui.experienceScreen.mockAddress}
              </h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">
                  {strings.ui.experienceScreen.value410MarketStreet}
                </p>
                <p className="m-0">
                  {strings.ui.experienceScreen.sanFranciscoCa}
                </p>
                <p className="m-0">
                  {
                    strings.ui.experienceScreen
                      .builtForFrontendBackendSemanticParityHint
                  }
                </p>
              </div>
            </article>
          </div>
        </section>
      );

    }

    function renderFaq() {

      function renderFaqItem(faq: (typeof faqItems)[number]) {

        const isOpen = expandedFaq === faq.question;

        return (
          <article
            key={faq.question}
            className="rounded-2xl border-control border-secondary bg-primary shadow-(--dashboard-shell-shadow)"
          >
            <Button
              variant="ghost"
              type="button"
              onClick={() => {

                setExpandedFaq((current) =>
                  current === faq.question ? null : faq.question,
                );

              }
              }
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <h3 className="m-0 text-base font-semibold text-primary">
                {faq.question}
              </h3>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary_subtle text-primary transition-transform duration-300 ease-out">
                {isOpen ? '−' : '+'}
              </span>
            </Button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-secondary px-4 py-4">
                  <p className="m-0 text-sm leading-6 text-secondary">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );

      }

      const faqRows = faqItems.map(renderFaqItem);

      return (
        <section
          id="faq"
          className="experience-reveal grid gap-4"
          data-visible={visibleState('faq')}
        >
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
            {strings.ui.experienceScreen.faq}
          </p>
          <div className="grid gap-3">
            {faqRows}
          </div>
        </section>
      );

    }

    return (
      <div className="mx-auto grid w-full max-w-7xl gap-20 px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        {renderHero()}

        {renderSolutions()}

        {renderWorkflow()}

        {renderGallery()}

        {renderMotion()}

        {renderContact()}

        {renderFaq()}
      </div>
    );

  }

  function renderFooter() {

    return (
      <footer
        className="experience-reveal relative left-1/2 w-screen -translate-x-1/2 border-t border-secondary bg-primary"
        data-visible={visibleState('faq')}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 text-center sm:px-8 lg:px-10">
          <div className="grid justify-items-center gap-3">
            <strong className="text-lg text-primary">
              {strings.ui.experienceScreen.portalTemplate}
            </strong>
            <p className="max-w-2xl text-sm leading-7 text-secondary">
              {
                strings.ui.experienceScreen
                  .operationalSoftwareImmersiveRoutesAndFrontendArchitectureThatStayHint
              }
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                {strings.ui.experienceScreen.product}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.overview}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.pricing}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.roadmap}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.changelog}
              </p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                {strings.ui.experienceScreen.solutions}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.clinicSites}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.providerPortals}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.operationsHub}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.educationPages}
              </p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                {strings.ui.experienceScreen.resources}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.guides}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.apiDocs}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.playbooks}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.support}
              </p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                {strings.ui.experienceScreen.company}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.about}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.careers}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.terms}
              </p>
              <p className="m-0 text-sm text-secondary">
                {strings.ui.experienceScreen.privacy}
              </p>
            </div>
          </div>
        </div>
      </footer>
    );

  }

  return (
    <div
      className="min-h-screen text-primary"
      style={{
        backgroundImage:
          'linear-gradient(180deg, var(--dashboard-shell-bg), var(--dashboard-shell-bg-emphasis))',
      }}
    >
      {renderHeader()}

      {renderSections()}

      {renderFooter()}
    </div>
  );

}
