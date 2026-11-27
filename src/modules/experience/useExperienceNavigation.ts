import { useEffect, useRef, useState } from 'react';

import { prefersReducedMotion } from '@/components/ui/lib/motionPreferences';

import { experienceSections, type ExperienceSection } from './models/experienceSection';

export function useExperienceNavigation() {

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<ExperienceSection['id']>('hero');

  useEffect(() => {

    const page = pageRef.current;
    const header = headerRef.current;
    const preview = previewRef.current;
    if (!page || !header || !preview) { return; }
    const targets = experienceSections.map(({ id }) => ({ id, element: document.getElementById(id) }));
    let frame = 0;
    let offset = 0;
    let previousShift = 0;

    function onScroll() {

      if (frame) { return; }
      frame = window.requestAnimationFrame(() => {

        frame = 0;
        let current: ExperienceSection['id'] = 'hero';
        for (const { id, element } of targets) {

          if (element && element.getBoundingClientRect().top <= offset + 2) {
            current = id;
          }

        }
        setActiveSection(current);
        const shift = prefersReducedMotion() ? 0 : -Math.min(window.scrollY * 0.07, 24);
        if (shift !== previousShift) {

          preview?.style.setProperty('--experience-preview-shift', `${shift}px`);
          previousShift = shift;

        }

      });

    }

    function updateHeaderOffset() {

      offset = (header?.offsetHeight ?? 0) + 16;
      page?.style.setProperty('--experience-anchor-offset', `${offset}px`);
      onScroll();

    }

    const sizeObserver = new ResizeObserver(updateHeaderOffset);
    sizeObserver.observe(header);
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeaderOffset();

    const initialTarget = targets.find(({ id }) => window.location.hash === `#${id}`);
    const initialFrame = initialTarget?.element
      ? window.requestAnimationFrame(() => initialTarget.element?.scrollIntoView({ block: 'start', behavior: 'instant' }))
      : undefined;

    const cleanup = () => {

      sizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
      if (initialFrame !== undefined) { window.cancelAnimationFrame(initialFrame); }

    };

    return cleanup;

  }, []);

  return { pageRef, headerRef, previewRef, activeSection };

}
