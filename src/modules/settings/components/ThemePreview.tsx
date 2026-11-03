import { getThemePreviewStyle } from '@/themes';
import { strings } from '@/strings';
import styles from './ThemeStudio.module.css';
import type { ThemePreviewProps } from '../models/themePreviewProps';

const copy = strings.designSystem.themeStudio;

// A noninteractive specimen keeps the entire choice a single radio target.
export function ThemePreview({
  themeId,
  mode,
}: ThemePreviewProps) {

  return (
    <span
      aria-hidden="true"
      className={styles.preview}
      style={getThemePreviewStyle(themeId, mode)}
    >
      <span className={styles.previewRail}>
        <span className={styles.previewMark} />
        <span className={styles.previewRailItem} />
        <span className={styles.previewRailItem} />
        <span className={styles.previewRailItem} />
      </span>
      <span className={styles.previewMain}>
        <span className={styles.previewHeading}>{copy.previewHeading}</span>
        <span className={styles.previewSurface}>
          <span className={styles.previewMetric}>{copy.previewMetric}</span>
          <span className={styles.previewMetricLabel}>
            {copy.previewMetricLabel}
          </span>
        </span>
        <span className={styles.previewRow}>
          <span className={styles.previewProject}>{copy.previewProject}</span>
          <span className={styles.previewAction}>{copy.previewAction}</span>
        </span>
      </span>
    </span>
  );

}
