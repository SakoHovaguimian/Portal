---
version: alpha
name: Portal
description: A calm operational workspace with a consistent sidebar, white and slate surfaces, and configurable accent colors.
colors:
  surface: "#ffffff"
  background: "#f3f6fb"
  text: "#0f172a"
  muted: "#475569"
  border: "#e2e8f0"
typography:
  sans:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
rounded:
  DEFAULT: "0.75rem"
  card: "1rem"
spacing:
  panel: "1.5rem"
  field-gap: "1rem"
components:
  button: {}
  card: {}
  input: {}
  dialog: {}
---

# Portal design context

## Overview

Portal serves operators managing people, requests, and conversations. Its reference is a quiet administrative workbench: persistent navigation, precise type, clear records, and restrained accents. Product register governs authenticated routes. The experience route is a component showcase, not a promise of live business features.

English is the authored locale. No jurisdiction-specific market is assumed. Desktop and narrow browsers are supported. The existing visual identity is retained by this migration; avoid a rebrand, nested decorative cards, or gradients on ordinary form/data surfaces. The configurable accent and light/dark pairing carry expression.

Runtime CSS is canonical (ownership model B). `src/app/theme.css` defines palette/semantic utilities, `semantic-tokens.css` maps operational surfaces, and `globals.css` provides shared behavior. This file mirrors accepted values and explains intent; it does not generate a second palette.

## Colors

Light surfaces use `colors.surface`, `colors.background`, `colors.text`, `colors.muted`, and `colors.border` through the CSS semantic roles. Dark mode maps those same roles to slate surfaces and lighter text. Brand action and focus colors derive from the selected accent; success, warning, and danger retain their meaning. Never indicate state by color alone.

## Typography

IBM Plex Sans owns body and headings through Next font variables in `src/app/layout.tsx`; IBM Plex Mono owns technical values. Use restrained semibold headings and readable body text. User-visible text comes from `src/strings.ts`. Do not expose architectural jargon in routine tasks.

## Layout

The shared AppShell owns navigation and header geometry. Content uses semantic cards, 1rem field gaps, and approximately 1.5rem panel padding. Tables scroll horizontally at narrow widths. Forms remain in natural document flow; chat owns its bounded message scroller. New banners must not shift primary controls. Global scrollbars remain visible and reserve stable width.

## Elevation & Depth

Borders and surface contrast carry hierarchy. Shared shell shadows are intentionally subtle; overlays use the existing stronger shadow and backdrop. Do not add arbitrary shadow systems to modules.

## Shapes

Inputs/buttons use the established rounded control family. Cards use larger corners. Preserve the existing Radix modal/sheet geometry; long overlay content must remain reachable within the viewport.

## Components

`src/components/ui` owns Button, Field/Input, Card, DataTable, QueryBoundary, AlertModal, SheetPanel, ToastStack, and AppShell. `PresentationProvider` owns imperative alerts/toasts/sheets. The settings page owns theme selection; theme storage survives navigation. Reuse those components in chat, privacy, and notification flows.

| Role | Runtime mapping | Consumers |
| --- | --- | --- |
| Light surface/background | semantic-tokens.css → --color-bg-primary / --color-bg-secondary | cards, forms, shell |
| Text hierarchy | --color-text-primary / --color-text-secondary | labels, headings, supporting text |
| Borders | --color-border-secondary | shared inputs and panels |
| Body/display/mono | layout.tsx → --font-body / --font-display / --font-mono | global CSS and utilities |
| Theme/accent | root data-theme/data-accent + dark-mode | semantic CSS and shared controls |
| Scrollbars | globals.css → semantic border/background colors | all scroll containers |

Busy actions stay disabled until complete. Errors use text and role=alert; toasts use the shared live region. See [UX-CONTRACT.md](UX-CONTRACT.md) for operation outcomes and canonical behavior.

## Do's and Don'ts

Reuse semantic tokens and shared primitives. Preserve focus visibility, native form semantics, dark mode, and reduced motion. Keep chart examples labeled and demo-only. Do not add a new design library or duplicate hard-coded colors for this architecture migration.
