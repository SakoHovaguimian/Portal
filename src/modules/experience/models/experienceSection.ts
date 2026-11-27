import { strings } from '@/strings';

const copy = strings.ui.experienceScreen;

export const experienceSections = [
  { id: 'hero', label: copy.overview },
  { id: 'solutions', label: copy.system },
  { id: 'workflow', label: copy.workflow },
  { id: 'gallery', label: copy.showcase },
  { id: 'motion', label: copy.motion },
  { id: 'contact', label: copy.contact },
  { id: 'faq', label: copy.faq },
] as const;

export type ExperienceSection = (typeof experienceSections)[number];
