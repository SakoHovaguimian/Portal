# Portal

<img width="1024" height="1024" alt="Portal" src="https://github.com/user-attachments/assets/c88cee85-ad1c-4319-94ce-20dc8f98aee6" />

A reusable, production-minded Next.js portal template. Portal starts as a self-contained demo and exposes clear integration boundaries for authentication, APIs, realtime events, notifications, persistence, uploads, analytics, email, and deployment.

## What ships

- Responsive marketing, authentication, legal, and authenticated portal shells
- Example Overview, Activity, Team, Resources, and Settings routes
- No-auth demo mode plus an optional Firebase REST/session adapter
- Encrypted, HTTP-only sessions with `jose`
- Same-origin backend proxy and separate server/browser API clients
- Optional Socket.IO provider with Zod-validated event envelopes
- TanStack Query, Astryx components, semantic theme tokens, light/dark mode
- Central string catalog with a local ESLint rule for uncataloged interface copy
- AI-guided project interview, feature matrix, integration guides, and launch checklist

## Start here

1. Run the guided workflow in [`docs/skills/create-new-project/SKILL.md`](docs/skills/create-new-project/SKILL.md).
2. Record answers in [`docs/PROJECT_DECISIONS.md`](docs/PROJECT_DECISIONS.md).
3. Copy `.env.example` to `.env.local`.
4. Install and run:

```bash
npm ci
npm run dev
```

Open `http://localhost:3001`. Demo mode requires no credentials or backend.

## Commands

```bash
npm run dev
npm run lint
npm run check
npm run build
npm run start
npm run theme:build
```

## Documentation

The documentation index is in [`docs/README.md`](docs/README.md). The template intentionally keeps product decisions explicit: choose capabilities before connecting domain code, then remove every unused dependency and example.
