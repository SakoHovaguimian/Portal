'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@semantic-web/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'solutions', label: 'System' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'gallery', label: 'Showcase' },
  { id: 'motion', label: 'Motion' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' },
] as const;

const solutions = [
  {
    title: 'Dashboard-first surfaces',
    description:
      'Cards, lists, forms, and side navigation all use the same flatter treatment so the app feels cohesive instead of mixing visual languages.',
  },
  {
    title: 'Accent color as support',
    description:
      'Selected theme colors highlight active states, pills, and key actions while neutral grays and whites carry most of the layout.',
  },
  {
    title: 'Dark mode that stays readable',
    description:
      'The dark theme uses layered slate panels and restrained contrast instead of glossy black surfaces and heavy blur.',
  },
  {
    title: 'Overlay controls preserved',
    description:
      'Toasts, alerts, and sheets still run through one presentation service, but now inherit the same flat dashboard styling.',
  },
] as const;

const showcaseStats = [
  { label: 'Selected theme', value: 'Accent aware' },
  { label: 'Surface language', value: 'Flat panels' },
  { label: 'Navigation style', value: 'Dashboard shell' },
] as const;

const faqItems = [
  {
    question: 'Can we still launch hero-only?',
    answer: 'Yes. This showcase route is optional and can stay separate from the protected shell.',
  },
  {
    question: 'Can we keep auth optional?',
    answer: 'Yes. The visual restyle does not change the scaffold-time auth decisions.',
  },
  {
    question: 'Can the selected accent stay subtle?',
    answer: 'Yes. The new system deliberately limits accent usage to active states and emphasis points.',
  },
  {
    question: 'Are the charts real yet?',
    answer: 'The analytics widgets in the redesigned dashboard use mock data for now while the existing records and registry panels still use live app data.',
  },
  {
    question: 'Does dark mode keep the same structure?',
    answer: 'Yes. The same card and shell hierarchy carries through; only the tonal palette changes.',
  },
  {
    question: 'Can we swap the accent theme per user?',
    answer: 'Yes. Accent choice still lives in appearance preferences and propagates through the semantic token layer.',
  },
  {
    question: 'Will form controls match the dashboard?',
    answer: 'Yes. Inputs, buttons, tabs, and overlays now inherit the same flatter styling rules.',
  },
  {
    question: 'Are the side navigation items reusable?',
    answer: 'Yes. The sidebar is still driven from one shared shell component and can be extended centrally.',
  },
  {
    question: 'Can we add more dashboard widgets later?',
    answer: 'Yes. The current mocked cards are intentionally built from simple primitives so we can swap in real charts incrementally.',
  },
  {
    question: 'Will records and registry stay in the dashboard?',
    answer: 'Yes. Those existing operational panels remain in place and now sit beneath the mocked analytics surface.',
  },
  {
    question: 'Do overlay animations still work?',
    answer: 'Yes. Alert, toast, and sheet timing controls are untouched and still configurable through the presentation service.',
  },
  {
    question: 'Can the footer be brand-specific?',
    answer: 'Yes. The full-width footer is just content and layout, so we can tailor links and messaging easily.',
  },
  {
    question: 'Will the auth pages keep this style?',
    answer: 'Yes. Login and signup now use the same flatter card and accent treatment as the protected app.',
  },
  {
    question: 'Can we turn some sections off?',
    answer: 'Yes. The showcase route is modular and sections can be removed without affecting the rest of the application shell.',
  },
  {
    question: 'Is this meant to replace the old glossy look entirely?',
    answer: 'Yes. The goal of this pass is to move the whole project to a more credible flat dashboard aesthetic.',
  },
] as const;

export function ExperienceScreen() {
  const presentation = usePresentationService();
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]['id']>('hero');
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({ hero: true });
  const [expandedFaq, setExpandedFaq] = useState<(typeof faqItems)[number]['question'] | null>(faqItems[0].question);

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
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id as (typeof sections)[number]['id'];
          setRevealedSections((current) => (current[id] ? current : { ...current, [id]: true }));
        });
      },
      { threshold: [0.05, 0.2, 0.45], rootMargin: '-8% 0px -22% 0px' },
    );

    nodes.forEach((entry) => observer.observe(entry.node));
    return () => observer.disconnect();
  }, []);

  const heroParallax = useMemo(() => Math.min(scrollY * 0.1, 30), [scrollY]);
  const visibleState = (id: (typeof sections)[number]['id']) =>
    (revealedSections[id] ? 'true' : 'false') as 'true' | 'false';

  useEffect(() => {
    const header = document.querySelector('[data-showcase-header="true"]');
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 72;
    const activationOffset = headerHeight + 24;

    let nextActiveSection: (typeof sections)[number]['id'] = sections[0].id;

    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      if (node.getBoundingClientRect().top <= activationOffset) {
        nextActiveSection = section.id;
      }
    }

    setActiveSection((current) => (current === nextActiveSection ? current : nextActiveSection));
  }, [scrollY]);

  async function handleSolutionPresentation(index: number) {
    if (index === 0) {
      await presentation.showAlert({
        title: 'Dashboard surface preset',
        description: 'Primary cards, muted panels, and flatter data rows stay aligned from shell to detail pages.',
        tone: 'info',
        confirmLabel: 'Looks good',
        cancelLabel: 'Close',
      });
      return;
    }

    if (index === 1) {
      await presentation.showSheet({
        title: 'Accent usage guardrails',
        description: 'Use the selected accent for active states, chips, and primary actions.',
        tone: 'success',
        side: 'right',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">Keep large backgrounds mostly neutral.</p>
            <p className="m-0 text-sm text-secondary">Let brand color show up in navigation state, tags, and emphasis.</p>
          </div>
        ),
      });
      return;
    }

    if (index === 2) {
      await presentation.showSheet({
        title: 'Dark mode notes',
        description: 'Layered slate surfaces replace the previous glossy look.',
        tone: 'warning',
        side: 'bottom',
        size: 'lg',
        details: (
          <div className="grid gap-1.5">
            <p className="m-0 text-sm text-secondary">Cards stay lifted through borders and panel contrast, not blur.</p>
            <p className="m-0 text-sm text-secondary">Text hierarchy stays consistent between light and dark themes.</p>
          </div>
        ),
      });
      return;
    }

    await presentation.showAlert({
      title: 'Presentation styling updated',
      description: 'Toasts, alerts, and sheets now inherit the same flatter chrome as the rest of the app.',
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
    const header = document.querySelector('[data-showcase-header="true"]');
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 72;
    const top = window.scrollY + node.getBoundingClientRect().top - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  return (
    <div
      className="min-h-screen text-primary"
      style={{ backgroundImage: 'linear-gradient(180deg, var(--dashboard-shell-bg), var(--dashboard-shell-bg-emphasis))' }}
    >
      <div data-showcase-header="true" className="sticky top-0 z-40 border-b border-secondary bg-[var(--dashboard-shell-topbar)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">Showcase</p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-primary">Dashboard Styling Preview</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`bouncy-button rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  activeSection === section.id
                    ? 'border-brand/60 bg-brand-primary text-primary shadow-[var(--dashboard-shell-shadow)]'
                    : 'border-secondary bg-primary text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {section.label}
              </button>
            ))}
            <Link
              href={'/dashboard' as never}
              className="bouncy-button rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-[var(--dashboard-shell-shadow)] transition hover:bg-brand-solid_hover"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-20 px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <section id="hero" className="experience-reveal grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]" data-visible={visibleState('hero')}>
          <article className="rounded-[28px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow-lg)] sm:p-8 lg:p-10">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-secondary">Restyled system</p>
            <h2 className="mt-4 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-primary">
              From glossy prototype to a calmer dashboard product surface.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-secondary sm:text-lg">
              This route shows the new direction across hero content, operational panels, accent behavior, and overlay styling without drifting away from the existing application architecture.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Flat card language',
                'Accent-aware states',
                'Layered dark mode',
                'Shared system tokens',
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex rounded-full border border-secondary bg-secondary_subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={'/dashboard' as never}
                className="bouncy-button rounded-lg bg-brand-solid px-5 py-3 text-sm font-semibold text-white shadow-[var(--dashboard-shell-shadow)] transition hover:bg-brand-solid_hover"
              >
                Enter portal
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection('solutions')}
                className="bouncy-button rounded-lg border border-secondary bg-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary_subtle"
              >
                Explore the system
              </button>
            </div>
          </article>

          <div className="grid gap-4" style={{ transform: `translate3d(0, ${-heroParallax}px, 0)` }}>
            <article className="rounded-[28px] border border-secondary bg-primary p-5 shadow-[var(--dashboard-shell-shadow)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Preview surface</p>
                  <h3 className="mt-2 text-xl font-semibold text-primary">Live dashboard mock</h3>
                </div>
                <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                  Active
                </span>
              </div>
              <div className="mt-5 grid gap-4 rounded-2xl border border-secondary bg-secondary_subtle p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {['Conversion', 'Tickets', 'Retention'].map((label, index) => (
                    <div key={label} className="rounded-xl border border-secondary bg-primary p-4">
                      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">{label}</p>
                      <p className="mt-3 text-2xl font-semibold text-primary">{['24.8%', '134', '92%'][index]}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-secondary bg-primary p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="m-0 text-sm font-semibold text-primary">Traffic overview</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-tertiary">Last 7 days</span>
                  </div>
                  <div className="mt-4 flex h-32 items-end gap-2">
                    {[38, 52, 44, 70, 58, 66, 82, 74, 88, 80].map((height, index) => (
                      <span
                        key={index}
                        className={`w-full rounded-t-md ${index > 6 ? 'bg-brand-solid/80' : 'bg-secondary'}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-3">
              {showcaseStats.map((item) => (
                <article key={item.label} className="rounded-2xl border border-secondary bg-primary p-4 shadow-[var(--dashboard-shell-shadow)]">
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-primary">{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="experience-reveal grid gap-8" data-visible={visibleState('solutions')}>
          <div className="grid gap-3 lg:max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">System direction</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              A flat dashboard language layered on top of architecture-safe defaults.
            </h2>
            <p className="text-base leading-7 text-secondary">
              The restyle keeps your app structure, data contracts, and interaction model intact while giving the whole product a more credible admin UI feel.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {solutions.map((solution, index) => (
              <button
                key={solution.title}
                type="button"
                onClick={() => void handleSolutionPresentation(index)}
                className="bouncy-button group grid min-h-[15rem] gap-4 rounded-[24px] border border-secondary bg-primary p-6 text-left shadow-[var(--dashboard-shell-shadow)] transition duration-200 hover:border-primary"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-primary">{solution.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-secondary">{solution.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Open preview</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="workflow" className="experience-reveal grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" data-visible={visibleState('workflow')}>
          <article className="grid gap-5 rounded-[28px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)] sm:p-8">
            <div className="grid gap-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Workflow</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                The visual update still respects the system underneath.
              </h2>
              <p className="text-base leading-7 text-secondary">
                Routes stay thin, services keep orchestration, and presentation flows remain centralized. The redesign focuses on the product layer, not the ownership model.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                'Prompt-first setup still drives shell and route decisions.',
                'Theme choice propagates through one semantic token layer.',
                'Shared UI primitives keep detail pages aligned automatically.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-secondary bg-secondary_subtle p-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-brand-secondary">
                    {index + 1}
                  </span>
                  <p className="m-0 text-sm leading-7 text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="rounded-[28px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">What changed</p>
              <div className="mt-4 space-y-4">
                {[
                  ['Surfaces', 'Reduced blur, removed glossy cards, and standardized white or slate panels.'],
                  ['Navigation', 'Sidebar and top chrome now match the flatter dashboard reference instead of a floating glass shell.'],
                  ['Dark mode', 'Panels stay distinct through layering, borders, and shadow restraint.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-secondary bg-secondary_subtle p-4">
                    <h3 className="m-0 text-base font-semibold text-primary">{title}</h3>
                    <p className="mt-2 m-0 text-sm leading-6 text-secondary">{description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="gallery" className="experience-reveal grid gap-6 rounded-[28px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]" data-visible={visibleState('gallery')}>
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Showcase</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              The same design language scales from hero sections to operational widgets.
            </h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[24px] border border-secondary bg-secondary_subtle p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">Dashboard preview</p>
                  <h3 className="mt-2 text-2xl font-semibold text-primary">Neutral canvas, selective accent</h3>
                </div>
                <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                  Preview
                </span>
              </div>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-secondary bg-primary p-4">
                    <p className="m-0 text-sm font-semibold text-primary">Revenue mix</p>
                    <div
                      className="mt-4 h-36 rounded-lg"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-500) 14%, transparent), transparent), linear-gradient(180deg, var(--color-bg-secondary_subtle), var(--color-bg-primary))',
                      }}
                    />
                  </div>
                  <div className="rounded-xl border border-secondary bg-primary p-4">
                    <p className="m-0 text-sm font-semibold text-primary">Top channels</p>
                    <div className="mt-4 space-y-3">
                      {['Product', 'Support', 'Growth'].map((item, index) => (
                        <div key={item}>
                          <div className="flex items-center justify-between gap-3 text-sm text-secondary">
                            <span>{item}</span>
                            <span>{[42, 33, 25][index]}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-secondary">
                            <div className="h-2 rounded-full bg-brand-solid" style={{ width: `${[42, 33, 25][index]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-secondary bg-primary p-4">
                  <p className="m-0 text-sm font-semibold text-primary">Recent activity</p>
                  <div className="mt-4 space-y-3">
                    {[
                      'Sidebar chrome updated to flatter card treatment.',
                      'Tables now use softer row hover and cleaner separators.',
                      'Theme accents drive selected state without flooding surfaces.',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-secondary">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-solid" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            <div className="grid gap-4">
              {[
                'Active state now lives in navigation, pills, and primary controls.',
                'Cards rely on border contrast and spacing more than drop shadows.',
                'The dark palette uses slate layers instead of glossy charcoal glow.',
                'Feature pages inherit the new system through shared primitives.',
              ].map((item, index) => (
                <article key={item} className="rounded-2xl border border-secondary bg-secondary_subtle p-4">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">0{index + 1}</p>
                  <p className="mt-2 m-0 text-sm leading-6 text-secondary">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="motion" className="experience-reveal grid gap-6 rounded-[28px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]" data-visible={visibleState('motion')}>
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">Presentation motion</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Motion is still configurable, but the chrome around it is cleaner.
            </h2>
            <p className="m-0 max-w-3xl text-sm leading-7 text-secondary">
              Use the same controls as before to change toast, alert, and sheet timing while previewing the updated flat styling.
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
                  description: 'Transitions now run with slower timing for a calmer feel.',
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
              Mock handoff details in the same dashboard visual system.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[24px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]">
              <h3 className="text-xl font-semibold text-primary">Contact details</h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">Ari Bennett</p>
                <p className="m-0">Founder, Semantic Studio</p>
                <p className="m-0">support@semanticstudio.dev</p>
                <p className="m-0">+1 (415) 555-0199</p>
              </div>
            </article>
            <article className="rounded-[24px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]">
              <h3 className="text-xl font-semibold text-primary">Office hours</h3>
              <div className="mt-4 grid gap-1 text-sm leading-7 text-secondary">
                <p className="m-0">Mon-Thu: 9:00 AM - 6:00 PM PT</p>
                <p className="m-0">Fri: 9:00 AM - 3:00 PM PT</p>
                <p className="m-0">Response SLA: under 1 business day</p>
              </div>
            </article>
            <article className="rounded-[24px] border border-secondary bg-primary p-6 shadow-[var(--dashboard-shell-shadow)]">
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
            {faqItems.map((faq) => {
              const isOpen = expandedFaq === faq.question;

              return (
                <article key={faq.question} className="rounded-2xl border border-secondary bg-primary shadow-[var(--dashboard-shell-shadow)]">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq((current) => (current === faq.question ? null : faq.question))}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <h3 className="m-0 text-base font-semibold text-primary">{faq.question}</h3>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary_subtle text-primary transition-transform duration-300 ease-out">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-secondary px-4 py-4">
                        <p className="m-0 text-sm leading-6 text-secondary">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <footer
        className="experience-reveal relative left-1/2 w-screen -translate-x-1/2 border-t border-secondary bg-primary"
        data-visible={visibleState('faq')}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 text-center sm:px-8 lg:px-10">
          <div className="grid justify-items-center gap-3">
            <strong className="text-lg text-primary">Semantic Web Template</strong>
            <p className="max-w-2xl text-sm leading-7 text-secondary">
              Operational software, immersive routes, and frontend architecture that stay aligned while the product surface looks more like a polished dashboard.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Product</p>
              <p className="m-0 text-sm text-secondary">Overview</p>
              <p className="m-0 text-sm text-secondary">Pricing</p>
              <p className="m-0 text-sm text-secondary">Roadmap</p>
              <p className="m-0 text-sm text-secondary">Changelog</p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Solutions</p>
              <p className="m-0 text-sm text-secondary">Clinic Sites</p>
              <p className="m-0 text-sm text-secondary">Provider Portals</p>
              <p className="m-0 text-sm text-secondary">Operations Hub</p>
              <p className="m-0 text-sm text-secondary">Education Pages</p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Resources</p>
              <p className="m-0 text-sm text-secondary">Guides</p>
              <p className="m-0 text-sm text-secondary">API Docs</p>
              <p className="m-0 text-sm text-secondary">Playbooks</p>
              <p className="m-0 text-sm text-secondary">Support</p>
            </div>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">Company</p>
              <p className="m-0 text-sm text-secondary">About</p>
              <p className="m-0 text-sm text-secondary">Careers</p>
              <p className="m-0 text-sm text-secondary">Terms</p>
              <p className="m-0 text-sm text-secondary">Privacy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
