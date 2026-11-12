'use client';

import { useSearchParams } from 'next/navigation';

import { Page, PageHeader, SegmentedPanels } from '@/components/ui';
import { useDirectoryState } from '@/queries/useDirectoryState';
import { portalAccountToolsStrings as copy } from '@/strings';

import { FrequentlyAskedQuestionsPanel } from './components/FrequentlyAskedQuestionsPanel';
import { LegalInformationPanel } from './components/LegalInformationPanel';
import type { HelpSection } from './models/helpSection';

const helpSections = {
  faq: 'faq',
  terms: 'terms',
  privacy: 'privacy',
} as const;

export function HelpScreen() {

  const params = useSearchParams();
  const directory = useDirectoryState();
  const section = params.get('section');
  const value: HelpSection =
    section === 'terms' || section === 'privacy' ? section : 'faq';

  function renderHeader() {

    return (
      <PageHeader title={copy.help.title} description={copy.help.description} />
    );

  }

  function renderPanels() {

    return (
      <SegmentedPanels<HelpSection>
        label={copy.help.sectionLabel}
        value={value}
        onValueChange={(next) =>
          directory.update({ section: next === 'faq' ? undefined : next })
        }
        panels={[
          {
            value: helpSections.faq,
            label: copy.help.faqTab,
            content: <FrequentlyAskedQuestionsPanel />,
          },
          {
            value: helpSections.terms,
            label: copy.help.termsTab,
            content: <LegalInformationPanel context="terms_of_service" />,
          },
          {
            value: helpSections.privacy,
            label: copy.help.privacyTab,
            content: <LegalInformationPanel context="privacy_policy" />,
          },
        ]}
      />
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        {renderPanels()}
      </Page>
    );

  }

  return renderContent();

}
