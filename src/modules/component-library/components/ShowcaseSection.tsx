import { UiIcon } from '@/components/ui';

import type { ShowcaseSectionProps } from '../models/showcaseSectionProps';

export function ShowcaseSection({
  id,
  title,
  description,
  icon,
  children,
}: ShowcaseSectionProps) {

  return (
    <section
      id={id}
      role="group"
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      className="grid min-w-0 gap-4 rounded-control"
    >
      <header className="flex min-w-0 items-start gap-2.5">
        <UiIcon name={icon} className="mt-0.5 size-5 shrink-0 text-tertiary" />
        <div className="grid min-w-0 gap-1">
          <h4 id={`${id}-title`} className="m-0 text-lg font-semibold tracking-tight text-primary wrap-anywhere">
            {title}
          </h4>
          {description && (
            <p className="m-0 max-w-[68ch] text-sm text-secondary">
              {description}
            </p>
          )}
        </div>
      </header>
      <div className="grid min-w-0 gap-8 rounded-card border-control border-secondary bg-primary p-(--space-panel)">
        {children}
      </div>
    </section>
  );

}
