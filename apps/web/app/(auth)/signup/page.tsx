import { SignupScreen } from '@/features/auth/SignupScreen';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="auth-scene min-h-screen bg-secondary px-6 py-12 sm:px-8">
      <div className="auth-grid-glow" />
      <div className="auth-orb left-[-5rem] top-[6rem] h-64 w-64 bg-success-secondary/35" />
      <div className="auth-orb auth-orb-delay bottom-[5rem] right-[-3rem] h-72 w-72 bg-brand-secondary/35" />
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="auth-reveal auth-reveal-delay-1 order-2 relative z-10 lg:order-1">
          <p className="auth-reveal text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
            Semantic Web Admin
          </p>
          <h2 className="auth-reveal auth-reveal-delay-1 mt-4 font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            Create an operator account and step straight into the dashboard shell.
          </h2>
          <p className="auth-reveal auth-reveal-delay-2 mt-5 max-w-2xl text-base leading-7 text-tertiary">
            The updated auth surface uses the same flatter card language as the protected app, so the entry
            point already feels like part of the product instead of a separate theme.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="auth-panel-hover auth-reveal auth-reveal-delay-2 rounded-2xl border border-secondary bg-primary p-5 shadow-[var(--dashboard-shell-shadow)]">
              <h3 className="text-sm font-semibold text-primary">Clear light and dark themes</h3>
              <p className="mt-2 text-sm leading-6 text-tertiary">
                Each selected accent stays proportional, while neutral grays and whites do most of the work.
              </p>
            </div>
            <div className="auth-panel-hover auth-reveal auth-reveal-delay-3 rounded-2xl border border-secondary bg-primary p-5 shadow-[var(--dashboard-shell-shadow)]">
              <h3 className="text-sm font-semibold text-primary">System-wide tokens</h3>
              <p className="mt-2 text-sm leading-6 text-tertiary">
                The same semantic token layer drives shell chrome, forms, overlays, and dashboard cards.
              </p>
            </div>
          </div>
        </div>
        <div className="order-1 relative z-10 lg:order-2">
          <SignupScreen
            redirectTo={
              typeof resolvedSearchParams.redirectTo === 'string'
                ? resolvedSearchParams.redirectTo
                : undefined
            }
          />
        </div>
      </div>
    </main>
  );
}
