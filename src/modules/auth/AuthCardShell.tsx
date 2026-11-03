import Link from 'next/link';
import { buttonClassName, Card } from '@/components/ui';
import type { AuthCardShellProps } from './models/authCardShellProps';

export function AuthCardShell({
  badge,
  title,
  description,
  footerPrompt,
  footerHref,
  footerAction,
  children,
  mockHint,
}: AuthCardShellProps) {

  function renderHeader() {

    return (
      <div className="border-b border-secondary bg-secondary_subtle px-6 py-6 sm:px-8">
        <div className="auth-reveal mb-4 inline-flex rounded-full border-control border-brand/40 bg-brand-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          {badge}
        </div>
        <h1 className="auth-reveal auth-reveal-delay-1 font-display text-3xl font-semibold tracking-tight text-primary">
          {title}
        </h1>
        <p className="auth-reveal auth-reveal-delay-2 mt-2 max-w-md text-sm leading-6 text-tertiary">
          {description}
        </p>
        {mockHint ? (
          <div className="auth-reveal auth-reveal-delay-3 mt-4 rounded-2xl border-control border-secondary bg-primary/90 px-4 py-3 text-sm text-secondary">
            {mockHint}
          </div>
        ) : null}
      </div>
    );

  }

  function renderFooter() {

    return (
      <div className="auth-reveal auth-reveal-delay-3 flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-5 text-sm text-tertiary">
        <span>{footerPrompt}</span>
        <Link
          className={buttonClassName('secondary', 'min-w-36')}
          href={footerHref as never}
        >
          {footerAction}
        </Link>
      </div>
    );

  }

  return (
    <Card className="auth-card-enter overflow-hidden p-0 shadow-(--dashboard-shell-shadow-lg)">
      {renderHeader()}
      <div className="grid gap-6 px-6 py-6 sm:px-8">
        {children}
        {renderFooter()}
      </div>
    </Card>
  );

}
