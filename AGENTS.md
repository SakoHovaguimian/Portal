<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portal project rules

- Start new product conversions with `docs/skills/create-new-project/SKILL.md`.
- Do not implement product code until the decisions in `docs/PROJECT_DECISIONS.md` are resolved.
- Keep application-owned, user-facing copy in `src/content/strings.ts`.
- Run `npm run check` after source edits and `npm run build` before launch.
- Run `npm run theme:build` after editing `src/theme/portalDesignSystem.ts`.
- Keep models in focused files rather than collecting unrelated models together.
- Do not write tests unless the project owner explicitly changes this rule.
