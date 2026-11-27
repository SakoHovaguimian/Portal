import { strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';
import { ThemeControls } from '@/modules/settings/components/ThemeControls';

export function ThemeShowcase() {

  return (
    <ShowcaseSection
      id="theme"
      title={strings.designSystem.theme}
      icon="sun"
    >
      <ThemeControls />
    </ShowcaseSection>
  );

}
