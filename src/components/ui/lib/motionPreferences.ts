export function prefersReducedMotion() {

  return (
    typeof window === 'undefined' ||
    document.documentElement.dataset.motion === 'reduced' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

}

export function motionDuration(
  token:
    | '--motion-duration-press'
    | '--motion-duration-fast'
    | '--motion-duration-base'
    | '--motion-duration-enter'
    | '--motion-duration-celebration'
    | '--ui-overlay-duration'
    | '--ui-overlay-default-duration',
  element?: HTMLElement,
) {

  if (prefersReducedMotion()) { return 0; }
  const value = getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(token)
    .trim();
  return Number.parseFloat(value) * (value.endsWith('ms') ? 1 : 1000) || 0;

}

// Animation is progressive enhancement: an unsupported engine or timing value
// must never prevent layout, dismissal, or focus from completing.
export function animateMotion(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation | null {

  if (prefersReducedMotion() || typeof element.animate !== 'function') { return null; }
  try {
    return element.animate(keyframes, options);
  } catch {
    return null;
  }

}

export function readMotionTransform(transform: string): DOMMatrixReadOnly | null {

  if (transform === 'none' || typeof DOMMatrixReadOnly !== 'function') { return null; }
  try {
    return new DOMMatrixReadOnly(transform);
  } catch {
    return null;
  }

}
