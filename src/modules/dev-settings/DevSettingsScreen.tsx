'use client';

import { InlineLoading, NavigationLink, Page, PageHeader, QueryBoundary, UiIcon } from '@/components/ui';
import type { DemoSettings } from '@/models/demoSettings';
import { componentBrowserStrings, portalDemoStrings as copy, strings } from '@/strings';

import { ComponentLibraryScreen } from '@/modules/component-library/ComponentLibraryScreen';
import { componentLibraryAnchor } from '@/modules/component-library/lib/showcaseAnchors';
import { useComponentLibraryEntry } from '@/modules/component-library/lib/useComponentLibraryEntry';
import { DevSettingsForm } from './components/DevSettingsForm';
import styles from './DevSettingsScreen.module.css';
import { useDevSettings } from './hooks';

const runtimeAnchor = 'runtime-settings';
const jumpLinkClassName = 'inline-flex min-h-11 items-center gap-2 rounded-control px-2.5 font-medium text-secondary hover:bg-secondary_hover hover:text-primary focus-visible:outline-2 focus-visible:outline-brand';

export function DevSettingsScreen() {

  const query = useDevSettings();
  useComponentLibraryEntry(!query.isLoading);

  function renderSettingsForm(settings: DemoSettings) {

    return (
      <DevSettingsForm
        key={`${settings.demoMode}-${settings.scenario}-${settings.latencyMs}`}
        settings={settings}
      />
    );

  }

  function renderHeader() {

    return (
      <div className="grid min-w-0 gap-4">
        <PageHeader title={copy.title} description={copy.description} />
        <nav
          aria-label={strings.componentLibrary.onThisPage}
          className="flex flex-wrap gap-x-3 border-b-control border-secondary pb-1 text-sm"
        >
          <a className={jumpLinkClassName} href={`#${runtimeAnchor}`}>
            {copy.runtimeTitle}
          </a>
          <a className={jumpLinkClassName} href={`#${componentLibraryAnchor}`}>
            {componentBrowserStrings.title}
            <UiIcon name="chevronDown" className="size-4" />
          </a>
          <NavigationLink href="/experience" className={jumpLinkClassName}>
            {strings.ui.experienceScreen.dashboardStylingPreview}
            <UiIcon name="arrowRight" className="size-4" />
          </NavigationLink>
        </nav>
      </div>
    );

  }

  return (
    <Page className={`${styles.page} mx-auto max-w-[87.5rem]`}>
      {renderHeader()}
      <div
        id={runtimeAnchor}
        tabIndex={-1}
        className="min-w-0 rounded-control"
      >
        <QueryBoundary query={query} loadingFallback={<InlineLoading />}>
          {renderSettingsForm}
        </QueryBoundary>
      </div>
      <ComponentLibraryScreen />
    </Page>
  );

}
