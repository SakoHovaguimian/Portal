import { Accordion } from '@/components/ui';
import { strings } from '@/strings';

import styles from '../ExperienceScreen.module.css';

const copy = strings.ui.experienceScreen;

const faqItems = [
  {
    question: copy.canWeStillLaunchHeroOnly,
    answer:
      copy.yesThisShowcaseRouteIsOptionalAndCanStayHint,
  },
  {
    question: copy.canWeKeepAuthOptional,
    answer:
      copy.yesTheVisualRestyleDoesNotChangeTheScaffoldHint,
  },
  {
    question: copy.canTheSelectedAccentStaySubtle,
    answer:
      copy.yesTheNewSystemDeliberatelyLimitsAccentUsageToHint,
  },
  {
    question: copy.areTheChartsRealYet,
    answer: copy.sampleAnalyticsHint,
  },
  {
    question: copy.doesDarkModeKeepTheSameStructure,
    answer:
      copy.yesTheSameCardAndShellHierarchyCarriesThroughHint,
  },
  {
    question: copy.canWeSwapTheThemePerUser,
    answer:
      copy.yesThemeChoiceLivesInAppearancePreferencesHint,
  },
  {
    question: copy.willFormControlsMatchTheDashboard,
    answer:
      copy.yesInputsButtonsTabsAndOverlaysNowInheritTheHint,
  },
  {
    question: copy.areTheSideNavigationItemsReusable,
    answer: copy.yesTheSidebarIsStillDrivenFromOneSharedHint,
  },
  {
    question: copy.canWeAddMoreDashboardWidgetsLater,
    answer: copy.dashboardComponentsHint,
  },
  {
    question:
      copy.willRecordsAndRegistryStayInTheDashboard,
    answer: copy.dashboardRecordsHint,
  },
  {
    question: copy.doOverlayAnimationsStillWork,
    answer:
      copy.yesAlertToastAndSheetTimingControlsAreUntouchedHint,
  },
  {
    question: copy.canTheFooterBeBrandSpecific,
    answer: copy.yesTheFullWidthFooterIsJustContentAndHint,
  },
  {
    question: copy.willTheAuthPagesKeepThisStyle,
    answer: copy.yesLoginAndSignupNowUseTheSameFlatterHint,
  },
  {
    question: copy.canWeTurnSomeSectionsOff,
    answer:
      copy.yesTheShowcaseRouteIsModularAndSectionsCanHint,
  },
  {
    question: copy.isThisMeantToReplaceTheOldGlossyLook,
    answer: copy.yesTheGoalOfThisPassIsToMoveHint,
  },
];

const items = faqItems.map(({ question, answer }, index) => ({
  id: `experience-faq-${index + 1}`,
  title: question,
  content: <p className="m-0 max-w-[65ch] leading-relaxed">{answer}</p>,
}));

export function ExperienceFaq() {

  return (
    <section id="faq" tabIndex={-1} aria-labelledby="faq-title" className={styles.splitSection}>
      <header className={styles.sectionHeader}>
        <h2 id="faq-title">{copy.faq}</h2>
      </header>
      <Accordion
        items={items}
        allowsMultipleExpanded={false}
        defaultExpandedKeys={[items[0].id]}
        className={styles.faq}
        itemClassName="rounded-none border-x-0 border-b-0 bg-transparent"
      />
    </section>
  );

}
