'use client';

import Link from 'next/link';

import {
  Button,
  Page,
  PageHeader,
  PageSection,
  SectionStack,
  SplitSection,
  UiIcon,
} from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { NotificationControls } from '@/services/notifications/components/NotificationControls';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';
import { strings, portalOverlayMotionStrings } from '@/strings';

import { OverlayMotionControls } from './components/OverlayMotionControls';
import { ThemeControls } from './components/ThemeControls';
import styles from './components/ThemeStudio.module.css';

export function AppearanceScreen() {

  const { devSettingsEnabled } = useRuntimeConfig();

  return (
    <Page>
      <PageHeader
        title={strings.ui.appearanceScreen.appearance}
        description={strings.designSystem.themeStudio.description}
        action={devSettingsEnabled && (
          <Button asChild variant="secondary">
            <Link href="/dev-settings#component-library">
              <UiIcon name="code" />
              {strings.designSystem.openLibrary}
            </Link>
          </Button>
        )}
      />
      <SectionStack>
        <PageSection
          id="theme"
          title={strings.designSystem.themeStudio.title}
          description={strings.designSystem.themeHint}
        >
          <ThemeControls />
        </PageSection>
        <SplitSection
          bare
          id="overlay-motion"
          title={portalOverlayMotionStrings.title}
          description={portalOverlayMotionStrings.description}
        >
          <OverlayMotionControls />
        </SplitSection>
        <div className={styles.devicePreferences}>
          <div id="notifications" className={styles.browserNotifications}>
            <NotificationControls />
          </div>
          <section id="privacy" aria-labelledby="appearance-privacy-title" className={styles.analyticsPreferences}>
            <h2 id="appearance-privacy-title" className="m-0 text-base font-semibold">
              {strings.privacy.title}
            </h2>
            <CookieConsentControls settings />
          </section>
        </div>
      </SectionStack>
    </Page>
  );

}
