import { LoginScreen } from '@/features/auth/LoginScreen';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="auth-scene min-h-screen bg-secondary px-6 py-12 sm:px-8">
      <div className="auth-grid-glow" />
      <div className="auth-orb left-[-6rem] top-[8rem] h-56 w-56 bg-brand-secondary/35" />
      <div className="auth-orb auth-orb-delay right-[-4rem] top-[16rem] h-72 w-72 bg-warning-secondary/40" />
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="auth-reveal relative z-10">
          <p className="auth-reveal text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
            Semantic Web Template
          </p>
          <h2 className="auth-reveal auth-reveal-delay-1 mt-4 font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            Return to a frontend system that mirrors backend semantics instead of drifting away from them.
          </h2>
          <p className="auth-reveal auth-reveal-delay-2 mt-5 max-w-2xl text-base leading-7 text-tertiary">
            Pages stay thin, repositories stay transport-only, and services own orchestration. Sign in to
            continue through the same architecture we expect contributors to scale.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="auth-panel-hover auth-reveal auth-reveal-delay-2 rounded-3xl border border-secondary bg-primary/80 p-5 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-primary">Canonical models</h3>
              <p className="mt-2 text-sm leading-6 text-tertiary">
                Query flows, controllers, and feature screens all consume the same domain-safe shapes.
              </p>
            </div>
            <div className="auth-panel-hover auth-reveal auth-reveal-delay-3 rounded-3xl border border-secondary bg-primary/80 p-5 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-primary">Intentional UI state</h3>
              <p className="mt-2 text-sm leading-6 text-tertiary">
                TanStack Query, Zustand, URL state, and local preferences each own a clear slice of truth.
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <LoginScreen
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
