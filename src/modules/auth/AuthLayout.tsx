import Image from 'next/image';

import { ProjectBrand } from '@/components/ProjectBrand';
import { UiIcon } from '@/components/ui';
import { projectConfiguration } from '@/config/projectConfiguration';
import type { ChildrenProps } from '@/models/childrenProps';
import { strings } from '@/strings';

import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: ChildrenProps) {

  function renderBrandPanel() {

    return (
      <div className={styles.brandPanel}>
        <div className="flex min-w-0 items-center gap-3">
          {!projectConfiguration.branding.logoPath && (
            <span className="grid size-10 shrink-0 place-items-center rounded-control bg-brand-solid text-text-primary_on-brand">
              <UiIcon name="layers" className="size-5" />
            </span>
          )}
          <ProjectBrand className="font-display text-2xl font-semibold tracking-tight wrap-anywhere text-primary" />
        </div>
        <div className={styles.story}>
          <div className={styles.artwork}>
            <Image
              src="/component-library/alpine.webp"
              alt={strings.auth.decorativeAlt}
              fill
              sizes="(min-width: 98rem) 35rem, (min-width: 56rem) 36vw, 1px"
              className="object-cover"
            />
          </div>
          <p className="m-0 max-w-[24ch] font-display text-display-sm font-medium text-balance wrap-anywhere text-primary">
            {strings.app.description}
          </p>
        </div>
      </div>
    );

  }

  return (
    <main className={styles.layout}>
      {renderBrandPanel()}
      <div className={styles.formPanel}>{children}</div>
    </main>
  );

}
