'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { componentCategories, componentSpecimens } from '../componentSpecimens';
import {
  componentCategoryAnchor,
  componentLibraryAnchor,
  componentSpecimenAnchor,
} from './showcaseAnchors';

export function useComponentLibraryEntry(settingsReady: boolean) {

  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {

    // Resolve the initial position after the settings above the showcase settle.
    if (!settingsReady) { return; }
    // Old URLs selected a family or category through query parameters.
    // New links use fragments, which also support the browser's own history.
    const fragment = window.location.hash.slice(1);
    const specimen = componentSpecimens.find((item) => item.id === params.get('component'));
    const category = componentCategories.find((item) => item === params.get('category'));
    const target = fragment === 'empty'
      ? 'empty-states'
      : fragment || (
        specimen
          ? componentSpecimenAnchor(specimen)
          : category
            ? componentCategoryAnchor(category)
            : pathname === '/dev-settings/components'
              ? componentLibraryAnchor
              : null
      );
    if (!target) { return; }
    const frame = window.requestAnimationFrame(() => {

      const section = document.getElementById(target);
      section?.scrollIntoView({ block: 'start', behavior: 'instant' });
      section?.focus({ preventScroll: true });

    });
    const cleanup = () => window.cancelAnimationFrame(frame);
    return cleanup;

  }, [params, pathname, settingsReady]);

}
