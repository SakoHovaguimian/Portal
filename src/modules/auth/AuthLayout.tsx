import Image from 'next/image';
import Link from 'next/link';

import { ProjectBrand } from '@/components/ProjectBrand';
import type { ChildrenProps } from '@/models/childrenProps';
import { strings } from '@/strings';

import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: ChildrenProps) {

  function renderBrandPanel() {

    return (
      <header className={styles.brandPanel}>
        <Link href="/" className={styles.brandLink}>
          <ProjectBrand showMark className="font-display text-xl font-semibold tracking-tight text-primary" />
        </Link>
        <div className={styles.story}>
          <p className="m-0 max-w-[20ch] font-display text-display-md font-semibold tracking-tight text-balance wrap-anywhere text-primary xl:text-display-lg">
            {strings.app.description}
          </p>
          <div className={styles.artwork}>
            <Image
              src="/component-library/alpine.webp"
              alt={strings.auth.decorativeAlt}
              fill
              sizes="(min-width: 98rem) 40rem, (min-width: 56rem) 40vw, 1px"
              className="object-cover"
            />
          </div>
        </div>
      </header>
    );

  }

  return (
    <main className={styles.layout}>
      {renderBrandPanel()}
      <div className={styles.formPanel}>{children}</div>
    </main>
  );

}
