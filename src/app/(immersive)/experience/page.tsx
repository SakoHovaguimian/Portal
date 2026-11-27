import type { Metadata } from 'next';

import { strings } from '@/strings';

import { ExperienceScreen } from '@/modules/experience/ExperienceScreen';

export const metadata: Metadata = { title: strings.ui.experienceScreen.dashboardStylingPreview };

export default function ExperiencePage() {
  return <ExperienceScreen />;
}
