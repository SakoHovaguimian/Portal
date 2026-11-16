import Link from 'next/link';

import type { AuthCardShellProps } from './models/authCardShellProps';

export function AuthCardShell({
  title,
  description,
  footerPrompt,
  footerHref,
  footerAction,
  children,
  supportingContent,
}: AuthCardShellProps) {

  function renderHeader() {

    return (
      <header className="grid gap-2">
        <h1
          id="auth-title"
          className="m-0 font-display text-display-md leading-tight font-semibold text-balance wrap-anywhere text-primary xl:text-display-lg"
        >
          {title}
        </h1>
        <p className="m-0 max-w-[46ch] text-sm leading-relaxed text-pretty text-secondary">
          {description}
        </p>
      </header>
    );

  }

  function renderFooter() {

    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-secondary">
        <span>{footerPrompt}</span>
        <Link
          className="rounded-sm font-semibold text-brand-secondary underline decoration-brand/40 underline-offset-4 hover:text-brand-secondary_hover hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          href={footerHref as never}
        >
          {footerAction}
        </Link>
      </div>
    );

  }

  return (
    <section className="grid w-full max-w-md gap-(--space-section)" aria-labelledby="auth-title">
      <div className="grid gap-(--space-panel)">
        {renderHeader()}
        {children}
        {renderFooter()}
      </div>
      {supportingContent}
    </section>
  );

}
