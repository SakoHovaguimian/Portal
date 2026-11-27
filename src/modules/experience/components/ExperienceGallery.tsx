import { Badge, Meter, UiIcon } from '@/components/ui';
import { strings } from '@/strings';

import styles from '../ExperienceScreen.module.css';

const copy = strings.ui.experienceScreen;
const channels = [
  { label: copy.product, value: 42 },
  { label: copy.support, value: 33 },
  { label: copy.growth, value: 25 },
];
const activity = [
  { icon: 'layers', description: copy.sidebarChromeUpdatedToFlatterCardTreatmentHint },
  { icon: 'table', description: copy.tablesNowUseSofterRowHoverAndCleanerSeparatorsHint },
  { icon: 'sun', description: copy.themeAccentsDriveSelectedStateWithoutFloodingSurfacesHint },
] as const;

export function ExperienceGallery() {

  function renderChannel({ label, value }: (typeof channels)[number]) {
    return <Meter key={label} label={label} value={value} size="sm" />;
  }

  function renderActivity({ icon, description }: (typeof activity)[number]) {

    return (
      <li key={icon} className="flex items-center gap-3 border-b-control border-secondary py-3.5 last:border-0">
        <UiIcon name={icon} className="size-4 shrink-0 text-tertiary" />
        <span className="text-sm text-secondary">{description}</span>
      </li>
    );

  }

  const channelRows = channels.map(renderChannel);
  const activityRows = activity.map(renderActivity);

  return (
    <section id="gallery" tabIndex={-1} aria-labelledby="gallery-title" className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 id="gallery-title">{copy.theSameDesignLanguageScalesFromHeroSectionsTo}</h2>
      </header>
      <div className={styles.gallery}>
        <div className={styles.galleryGroup}>
          <header className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 text-lg font-semibold tracking-tight text-primary">{copy.revenueMix}</h3>
            <Badge>{copy.previewSurface}</Badge>
          </header>
          <div className="grid gap-4">{channelRows}</div>
        </div>
        <div className={styles.galleryGroup}>
          <h3 className="m-0 text-lg font-semibold tracking-tight text-primary">{copy.recentActivity}</h3>
          <ol className="m-0 list-none p-0">{activityRows}</ol>
        </div>
      </div>
    </section>
  );

}
