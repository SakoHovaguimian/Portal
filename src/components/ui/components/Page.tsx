import type { PageProps } from '../models/pageProps';
import { cn } from '../lib/cn';

// Owns the page rhythm through the active theme section spacing.
export function Page({
  children,
  className,
  'aria-busy': busy,
}: PageProps) {

  return (
    <div
      aria-busy={busy}
      className={cn(
        'ui-page grid w-full min-w-0 content-start gap-(--space-section)',
        className,
      )}
    >
      {children}
    </div>
  );

}
