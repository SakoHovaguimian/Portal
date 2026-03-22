'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@semantic-web/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';

const heroImage = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80';
const workflowImage = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=80';
const detailsImage = 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=80';
const galleryImage = 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1800&q=80';

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'gallery', label: 'Visuals' },
  { id: 'motion', label: 'Motion' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' },
] as const;

const solutions = [
  {
    title: 'Brand-forward launch surface',
    description:
      'A full-bleed hero route with clean typography, ambient gradients, and calm motion tuned for conversion-first storytelling.',
  },
  {
    title: 'Portal-ready application shell',
    description:
      'Side-panel navigation, route protection, and semantic component primitives that scale from MVP to operations.',
  },
  {
    title: 'Presentation service for overlays',
    description:
      'Toasts, alerts, and sheets run through one queue and now expose motion controls for easy speed tuning.',
  },
  {
    title: 'Glow-inspired token system',
    description:
      'Accent palettes and charcoal dark mode now live in semantic tokens so feature code avoids hardcoded visual drift.',
  },
] as const;

export function ExperienceScreen() {
  const presentation = usePresentationService();
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]['id']>('hero');
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({ hero: true });

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        frame = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    const nodes = sections
      .map((section) => ({ id: section.id, node: document.getElementById(section.id) }))
      .filter(
        (entry): entry is { id: (typeof sections)[number]['id']; node: HTMLElement } =>
          entry.node instanceof HTMLElement,
      );

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let nextActiveId: (typeof sections)[number]['id'] | null = null;
        let highestRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id as (typeof sections)[number]['id'];
          setRevealedSections((current) => (current[id] ? current : { ...current, [id]: true }));

          if (entry.intersectionRatio >= highestRatio) {
            highestRatio = entry.intersectionRatio;
            nextActiveId = id;
          }
        });

        if (nextActiveId) {
          setActiveSection(nextActiveId);
        }
      },
      { threshold: [0.05, 0.2, 0.45], rootMargin: '-8% 0px -22% 0px' },
    );

    nodes.forEach((entry) => observer.observe(entry.node));
    return () => observer.disconnect();
  }, []);

  const headerParallax = useMemo(() => Math.min(scrollY * 0.08, 16), [scrollY]);
  const heroParallax = useMemo(() => Math.min(scrollY * 0.14, 90), [scrollY]);
  const visibleState = (id: (typeof sections)[number]['id']) =>
    (revealedSections[id] ? 'true' : 'false') as 'true' | 'false';

  async function handleSolutionPresentation(index: number) {
    if (index === 0) {
      await presentation.showAlert({
        title: 'Hero Funnel Configuration',
        description: 'Tune CTA placement, trust chips, and section pacing without breaking semantic route architecture.',
        tone: 'info',
        confirmLabel: 'Apply preset',
        cancelLabel: 'Keep current',
      });
      return;
    }

    if (index === 1) {
      await presentation.showSheet({
        title: 'Portal Navigation Starter',
        description: 'Default side-panel menu map for operational builds.',
        tone: 'success',
        side: 'right',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">Includes dashboard, profile, users, and settings routing stubs.</p>
            <p className="m-0 text-sm text-secondary">Auth actions are hidden automatically when auth is not required.</p>
          </div>
        ),
      });
      return;
    }

    if (index === 2) {
      await presentation.showSheet({
        title: 'Presentation Service Matrix',
        description: 'Overlay contracts for toast, alert, and sheet flows.',
        tone: 'warning',
        side: 'bottom',
        size: 'lg',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">Motion can be configured globally or overridden per invocation.</p>
            <p className="m-0 text-sm text-secondary">Queue order is preserved across overlays to avoid race conditions.</p>
          </div>
        ),
      });
      return;
    }

    await presentation.showAlert({
      title: 'Token Theme Guardrail',
      description: 'Accent updates now propagate through semantic surfaces, borders, cards, and atmospheric backgrounds.',
      tone: 'success',
      alignment: 'top',
      confirmLabel: 'Great',
      cancelLabel: 'Close',
    });
  }

  function scrollToSection(id: (typeof sections)[number]['id']) {
    const node = document.getElementById(id);
    if (!node) {
      return;
    }

    setActiveSection(id);
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-primary"
      style={{
        backgroundImage:
          'radial-gradient(circle at 16% 12%, color-mix(in srgb, var(--color-brand-500) 8%, transparent), transparent 44%), radial-gradient(circle at 84% 10%, color-mix(in srgb, var(--color-brand-300) 6%, transparent), transparent 42%), linear-gradient(180deg, var(--glow-surface-canvas), var(--color-bg-secondary_subtle))',
      }}
    >
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-brand-primary/25 blur-3xl" />
      <div className="absolute bottom-10 right-[-6rem] h-64 w-64 rounded-full bg-brand-secondary/20 blur-3xl" />

      <div className="sticky top-0 z-40 border-b border-secondary/80 bg-primary/75 backdrop-blur-xl">
        <div
          className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10"
          style={{ transform: `translate3d(0, ${headerParallax}px, 0)` }}
        >
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Glow Layout</p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-primary">Hero Experience</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeSection === section.id
                    ? 'border-brand bg-brand-primary/25 text-primary shadow-xs'
                    : 'border-secondary bg-primary/90 text-secondary hover:border-primary hover:text-primary'
                } bouncy-button`}
              >
                {section.label}
              </button>
            ))}
            <Link
              href={'/dashboard' as never}
              className="bouncy-button rounded-full bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-solid_hover"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <section
        id="hero"
        className="experience-reveal relative isolate flex min-h-[calc(100vh-81px)] items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10"
        data-visible={visibleState('hero')}
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/12 via-black/22 to-black/74" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[var(--glow-surface-canvas)] to-transparent" />
        <div
          className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-10"
          style={{ transform: `translate3d(0, ${-heroParallax}px, 0)` }}
        >
          <div className="hero-panel rounded-[2.15rem] border border-white/30 bg-white/15 p-6 shadow-[0_18px_64px_rgba(9,22,23,0.22)] backdrop-blur-md sm:p-8 lg:p-10" data-visible={visibleState('hero')}>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.24em] text-white/78">Hero Surface Template</p>
            <h2 className="mt-4 font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-none tracking-[-0.04em] text-white">
              Build conversion-ready hero pages and operational portals from one starter.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
              This redesign leans into a Glow-like aesthetic: clean surfaces, accent-aware atmospherics, and premium spacing while preserving strict semantic architecture.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Hero-first marketing flow',
                'Portal shell fallback',
                'Semantic token design',
                'Motion-configurable overlays',
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex rounded-full border border-white/28 bg-white/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={'/dashboard' as never}
                className="bouncy-button rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/92"
              >
                Enter portal
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection('solutions')}
                className="bouncy-button rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore hero sections
              </button>
            </div>
          </div>

          <div className="hero-panel hero-panel-delay grid gap-3" data-visible={visibleState('hero')}>
            {[
              { title: 'Do You Need Auth?', value: 'Starter asks first and adapts menu actions automatically.' },
              { title: 'Hero Page or Portal?', value: 'Full-page storytelling route or side-panel operational shell.' },
              { title: 'Header/Footer Setup', value: 'Define default menu, sections, and visual hierarchy before scaffolding.' },
            ].map((item) => (
              <article key={item.title} className="rounded-[1.6rem] border border-white/30 bg-black/24 p-4 text-white backdrop-blur-md">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-white/72">{item.title}</p>
                <p className="mt-2 m-0 text-sm leading-6 text-white/90">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-24 px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <section id="solutions" className="experience-reveal grid gap-8" data-visible={visibleState('solutions')}>
          <div className="grid gap-3 lg:max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">Core Experience</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              Glow-inspired styling on top of architecture-safe defaults.
            </h2>
            <p className="text-base leading-7 text-secondary">
              This route demonstrates how the template can look premium from day one while still keeping routes, services, and state ownership clean.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {solutions.map((solution, index) => (
              <button
                key={solution.title}
                type="button"
                onClick={() => void handleSolutionPresentation(index)}
                className="bouncy-button group grid min-h-[16rem] gap-4 rounded-[2rem] border border-secondary bg-primary/94 p-6 text-left shadow-[0_14px_36px_rgba(17,35,34,0.1)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(10,25,24,0.15)]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/25 text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-primary">{solution.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-secondary">{solution.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Tap for preview modal</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          id="workflow"
          className="experience-reveal grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]"
          data-visible={visibleState('workflow')}
        >
          <article
            className="relative isolate flex min-h-[72vh] items-end overflow-hidden rounded-[2rem] border border-secondary"
            style={{ backgroundImage: `url(${workflowImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/78" />
            <div className="relative grid max-w-2xl gap-4 p-6 text-white sm:p-8">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Structured workflow</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Prompt-first project setup now drives route and shell decisions.
              </h2>
              <p className="text-base leading-7 text-white/82">
                Auth requirement, hero-vs-portal mode, and menu/header/footer requirements are captured before any scaffolding starts.
              </p>
            </div>
          </article>
          <div className="grid gap-4">
            <article
              className="relative isolate flex min-h-[34vh] items-end overflow-hidden rounded-[2rem] border border-secondary"
              style={{ backgroundImage: `url(${detailsImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/78" />
              <div className="relative grid gap-3 p-6 text-white">
                <h3 className="text-2xl font-semibold tracking-tight">Operational visuals, not generic boilerplate.</h3>
                <p className="text-sm leading-7 text-white/82">
                  Keep one coherent aesthetic across immersive pages and internal portal surfaces.
                </p>
              </div>
            </article>
            <article className="grid gap-5 rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Why it matters</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-primary">Immersive does not mean off-system.</h3>
              </div>
              <div className="grid gap-3 text-sm leading-7 text-secondary">
                <p className="m-0">Semantic token overrides now live in a dedicated style-guide file for easier brand governance.</p>
                <p className="m-0">Dark mode now sits on a softer charcoal scale instead of deep black to keep a premium contrast profile.</p>
                <p className="m-0">Presentation overlays keep their own queue while still giving developers full motion control.</p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="gallery"
          className="experience-reveal grid gap-6 rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs"
          data-visible={visibleState('gallery')}
        >
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Visual Language</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Accent-aware sections with purposeful texture and pacing.
            </h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article
              className="relative min-h-[28rem] overflow-hidden rounded-[1.6rem] border border-secondary"
              style={{ backgroundImage: `url(${galleryImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-black/70" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-white/72">Gallery Feature</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Visual blocks now flow with the active accent.</h3>
              </div>
            </article>
            <div className="grid gap-4">
              {[
                'Accent tint is now token-driven and global.',
                'Section transitions fade/slide on entry.',
                'Header controls animate with active section state.',
                'Card actions can launch modal previews.',
              ].map((item, index) => (
                <article key={item} className="rounded-[1.3rem] border border-secondary bg-secondary_subtle/70 p-4">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">0{index + 1}</p>
                  <p className="mt-2 m-0 text-sm leading-6 text-secondary">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="motion"
          className="experience-reveal grid gap-6 rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs"
          data-visible={visibleState('motion')}
        >
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Presentation Motion</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Configure overlay speed, timing, or disable animation entirely.
            </h2>
            <p className="m-0 max-w-3xl text-sm leading-7 text-secondary">
              Developers can now tune toast, alert, and sheet motion globally via the presentation service.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                presentation.setMotionConfig({ enabled: true, toastDurationMs: 170, alertDurationMs: 180, sheetDurationMs: 190 });
                await presentation.showToast({
                  title: 'Fast motion preset',
                  description: 'Presentation overlays now animate at a snappier pace.',
                  intent: 'success',
                });
              }}
            >
              Fast
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                presentation.setMotionConfig({ enabled: true, toastDurationMs: 280, alertDurationMs: 300, sheetDurationMs: 320 });
                await presentation.showToast({
                  title: 'Relaxed motion preset',
                  description: 'Transitions now run with slower timing for a cinematic feel.',
                  intent: 'info',
                });
              }}
            >
              Relaxed
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                presentation.setMotionConfig({ enabled: false });
                await presentation.showToast({
                  title: 'Motion disabled',
                  description: 'All presentation animations are now turned off.',
                  intent: 'warning',
                  motion: { enabled: false },
                });
              }}
            >
              Disable motion
            </Button>
            <Button
              onClick={async () => {
                presentation.setMotionConfig({ enabled: true, toastDurationMs: 220, alertDurationMs: 240, sheetDurationMs: 260 });
                await presentation.showAlert({
                  title: 'Default motion restored',
                  description: 'Toast, alert, and sheet timings are back to default.',
                  tone: 'info',
                  confirmLabel: 'Done',
                  cancelLabel: 'Dismiss',
                });
              }}
            >
              Reset defaults
            </Button>
          </div>
        </section>

        <section id="contact" className="experience-reveal grid gap-8" data-visible={visibleState('contact')}>
          <div className="grid gap-3 lg:max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">Contact</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              Mock contact surface for handoff or discovery.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs">
              <h3 className="text-xl font-semibold text-primary">Contact details</h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">Ari Bennett</p>
                <p className="m-0">Founder, Semantic Studio</p>
                <p className="m-0">support@semanticstudio.dev</p>
                <p className="m-0">+1 (415) 555-0199</p>
              </div>
            </article>
            <article className="rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs">
              <h3 className="text-xl font-semibold text-primary">Office hours</h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">Mon-Thu: 9:00 AM - 6:00 PM PT</p>
                <p className="m-0">Fri: 9:00 AM - 3:00 PM PT</p>
                <p className="m-0">Response SLA: under 1 business day</p>
              </div>
            </article>
            <article className="rounded-[2rem] border border-secondary bg-primary/92 p-6 shadow-xs">
              <h3 className="text-xl font-semibold text-primary">Mock address</h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">410 Market Street</p>
                <p className="m-0">San Francisco, CA</p>
                <p className="m-0">Built for frontend/backend semantic parity.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="faq" className="experience-reveal grid gap-4" data-visible={visibleState('faq')}>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">FAQ</p>
          <div className="grid gap-3">
            {[
              {
                question: 'Can we launch hero-only?',
                answer: 'Yes. Set the project as hero-only during the new template prompt and start with a full-page narrative surface.',
              },
              {
                question: 'Can we hide auth actions?',
                answer: 'Yes. If auth is disabled, login/signup menu actions can be removed at scaffold time.',
              },
              {
                question: 'Can devs tune modal animation speed?',
                answer: 'Yes. Presentation service supports global motion config plus per-request override.',
              },
            ].map((faq) => (
              <article key={faq.question} className="rounded-[1.3rem] border border-secondary bg-primary/92 p-4">
                <h3 className="m-0 text-base font-semibold text-primary">{faq.question}</h3>
                <p className="mt-2 m-0 text-sm leading-6 text-secondary">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="experience-reveal grid gap-8 rounded-[2rem] border border-secondary bg-primary/95 p-6 shadow-xs" data-visible={visibleState('faq')}>
          <div>
            <strong className="text-lg text-primary">Semantic Web Template</strong>
            <p className="mt-2 max-w-xl text-sm leading-7 text-secondary">
              Operational software, immersive hero routes, and frontend architecture that stays aligned with backend semantics.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Product</p>
              <p className="m-0 mt-2 text-sm text-secondary">Overview</p>
              <p className="m-0 text-sm text-secondary">Pricing</p>
              <p className="m-0 text-sm text-secondary">Roadmap</p>
              <p className="m-0 text-sm text-secondary">Changelog</p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Solutions</p>
              <p className="m-0 mt-2 text-sm text-secondary">Clinic Sites</p>
              <p className="m-0 text-sm text-secondary">Provider Portals</p>
              <p className="m-0 text-sm text-secondary">Operations Hub</p>
              <p className="m-0 text-sm text-secondary">Education Pages</p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Resources</p>
              <p className="m-0 mt-2 text-sm text-secondary">Guides</p>
              <p className="m-0 text-sm text-secondary">API Docs</p>
              <p className="m-0 text-sm text-secondary">Playbooks</p>
              <p className="m-0 text-sm text-secondary">Support</p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Company</p>
              <p className="m-0 mt-2 text-sm text-secondary">About</p>
              <p className="m-0 text-sm text-secondary">Careers</p>
              <p className="m-0 text-sm text-secondary">Terms</p>
              <p className="m-0 text-sm text-secondary">Privacy</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
