import { Badge, UiIcon } from '@/components/ui';
import { strings } from '@/strings';

import styles from './LandingPage.module.css';

const copy = strings.landing;

export function LandingPreview() {

  const requestNames = [copy.selectedRequest, ...copy.otherRequests];

  function renderRequest(name: string) {

    return (
      <li key={name} className={styles.requestRow} data-selected={name === copy.selectedRequest || undefined}>
        <UiIcon name="file" className="size-4 shrink-0" />
        <span>{name}</span>
      </li>
    );

  }

  const requestRows = requestNames.map(renderRequest);
  return (
    <figure className={styles.preview} aria-labelledby="landing-preview-label">
      <figcaption id="landing-preview-label" className={styles.previewCaption}>
        <UiIcon name="layers" className="size-4" />
        {copy.previewLabel}
      </figcaption>
      <div className={styles.previewBody}>
        <div className={styles.previewOverview}>
          <h2 className="m-0 text-xl font-semibold tracking-tight text-primary">{copy.previewTitle}</h2>
          <p className="m-0 mt-1 text-xs text-secondary">{copy.previewDescription}</p>
          <h3 className="m-0 mt-5 border-b-control border-secondary pb-2 text-xs font-semibold text-secondary">{copy.previewQueue}</h3>
          <ul className="m-0 list-none p-0">{requestRows}</ul>
        </div>
        <div className={styles.previewDetail}>
          <Badge intent="brand">{copy.previewStatus}</Badge>
          <h3 className="m-0 text-base font-semibold text-primary">{copy.selectedRequest}</h3>
          <p className="m-0 text-xs leading-relaxed text-secondary">{copy.previewDetailDescription}</p>
        </div>
      </div>
    </figure>
  );

}
