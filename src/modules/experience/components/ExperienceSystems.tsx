import { Button, UiIcon } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

import styles from '../ExperienceScreen.module.css';

const copy = strings.ui.experienceScreen;
const previews = [
  { id: 'surfaces', title: copy.dashboardFirstSurfaces, description: copy.cardsListsFormsAndSideNavigationAllUseTheHint, icon: 'layers' },
  { id: 'accent', title: copy.accentColorAsSupport, description: copy.selectedThemeColorsHighlightActiveStatesPillsAndKeyHint, icon: 'sparkles' },
  { id: 'mode', title: copy.darkModeThatStaysReadable, description: copy.theDarkThemeUsesLayeredSlatePanelsAndRestrainedHint, icon: 'sun' },
  { id: 'layers', title: copy.overlayControlsPreserved, description: copy.toastsAlertsAndSheetsStillRunThroughOnePresentationHint, icon: 'bell' },
] as const;

export function ExperienceSystems() {

  const presentation = usePresentationService();

  async function openPreview(id: (typeof previews)[number]['id']) {

    switch (id) {

      case 'surfaces':
        await presentation.showAlert({
          title: copy.dashboardSurfacePreset,
          description: copy.primaryCardsMutedPanelsAndFlatterDataRowsStayHint,
          tone: 'info',
          confirmLabel: copy.looksGood,
          cancelLabel: copy.close,
        });
        return;
      case 'accent':
        await presentation.showSheet({
          title: copy.accentUsageGuardrails,
          description: copy.useTheSelectedAccentForActiveStatesChipsAndHint,
          tone: 'success',
          side: 'right',
          details: (
            <ul className="m-0 grid gap-1.5 ps-5 text-sm text-secondary">
              <li>{copy.keepLargeBackgroundsMostlyNeutralHint}</li>
              <li>{copy.letBrandColorShowUpInNavigationStateTagsHint}</li>
            </ul>
          ),
        });
        return;
      case 'mode':
        await presentation.showSheet({
          title: copy.darkModeNotes,
          description: copy.layeredSlateSurfacesReplaceThePreviousGlossyLookHint,
          tone: 'warning',
          side: 'bottom',
          size: 'lg',
          details: (
            <ul className="m-0 grid gap-1.5 ps-5 text-sm text-secondary">
              <li>{copy.cardsStayLiftedThroughBordersAndPanelContrastNotHint}</li>
              <li>{copy.textHierarchyStaysConsistentBetweenLightAndDarkThemesHint}</li>
            </ul>
          ),
        });
        return;
      case 'layers':
        await presentation.showAlert({
          title: copy.presentationStylingUpdated,
          description: copy.toastsAlertsAndSheetsNowInheritTheSameFlatterHint,
          tone: 'success',
          alignment: 'top',
          confirmLabel: copy.great,
          cancelLabel: copy.close,
        });
        return;

    }

  }

  function renderPreview({ id, title, description, icon }: (typeof previews)[number]) {

    const titleId = `experience-system-${id}`;
    return (
      <li key={id} className={styles.systemItem}>
        <UiIcon name={icon} className="mt-0.5 size-5 text-brand-secondary" />
        <div className="grid min-w-0 gap-1">
          <h3 id={titleId} className="m-0 text-base font-semibold text-primary">{title}</h3>
          <p className="m-0 max-w-[55ch] text-sm text-secondary">{description}</p>
        </div>
        <Button
          variant="secondary"
          aria-describedby={titleId}
          className={styles.systemAction}
          onClick={() => void openPreview(id)}
        >
          {copy.openPreview}
          <UiIcon name="arrowRight" className="size-4" />
        </Button>
      </li>
    );

  }

  const items = previews.map(renderPreview);

  return (
    <section id="solutions" aria-labelledby="solutions-title" tabIndex={-1} className={styles.splitSection}>
      <header className={styles.sectionHeader}>
        <h2 id="solutions-title">{copy.aFlatDashboardLanguageLayeredOnTopOfArchitecture}</h2>
        <p>{copy.theRestyleKeepsYourAppStructureDataContractsAndHint}</p>
      </header>
      <ul className="m-0 min-w-0 list-none p-0">{items}</ul>
    </section>
  );

}
