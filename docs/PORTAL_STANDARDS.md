# Portal Code Standards

This is Portal's permanent formatting and React composition contract. Obelisk's existing `docs/prompts/LINTING_FORMATTING_SEMANTICS.md` is the reference for the adopted code-style rules; Obelisk itself is read-only and must not be changed to match Portal. Read it before changing maintained code. It carries the explicitly authorized Obelisk formatting and Grimoire composition standards; [architecture](ARCHITECTURE.md), [strings](STRINGS.md), [UI system](UI_SYSTEM.md), [DESIGN.md](../DESIGN.md), and [UX-CONTRACT.md](../UX-CONTRACT.md) continue to own runtime behavior and visual intent. Preserve existing behavior, appearance, contracts, and state ownership. Make the smallest complete change.

## One Formatting Authority

- ESLint owns JavaScript/TypeScript layout. Use `npm run format:code -- <paths>` for a focused safe whitespace/punctuation fix, or `npm run format:code` for all maintained code. It deliberately does not restructure returns, move models, invent MARK labels, or split JSX.
- Prettier owns only Markdown, JSON, CSS, and YAML. `npm run format:docs` formats those compatible files. `.prettierignore` excludes code and generated output; embedded Markdown code formatting is disabled so examples retain this contract.
- `npm run format` runs both paths. Do not run raw Prettier on code, enable competing code formatters, or use broad lint suppressions. Editors should use ESLint fix-on-save for code and two-space indentation from `.editorconfig`.
- `npm run check` is authoritative and never edits files. Run the fix path twice; the second pass must leave the source unchanged. Run `DEMO_MODE=true npm run build` for application changes and `git diff --check` for all changes. No tests, Xcode builds, or worktrees unless explicitly requested.
- Ignore dependencies, generated files, assets, and build artifacts. Keep existing checks active; no permanent module exclusions.

## Behavior And Ownership

- Keep the service locator and constructor injection wiring, domain service → API client → authenticated proxy flow, permission/ownership checks, and demo/live behavior intact.
- Preserve HTTP methods, paths, request/response shapes, validation, defaults, error mapping, query keys, invalidation, cancellation, retry behavior, concurrency, awaiting, and cleanup timing.
- Preserve rendered elements, layout, semantic theme tokens, spacing values, motion, responsive behavior, accessibility relationships, focus, scroll behavior, form drafts, and loading/error/empty/success states. This is a composition and code-style migration, not a redesign.
- Keep hooks in their existing component/custom-hook owner and stable order. Preserve effects, dependency arrays, state lifetimes, client/server boundaries, and server-only credentials. Do not add `useMemo`, `useCallback`, state, effects, or abstractions solely to satisfy style.
- All authored display copy remains in `src/strings.ts`, following existing Title Case and formatter rules. Do not rename catalog keys or change copy incidentally.
- Do not change external field names, enum values, model meaning, or exported APIs just to satisfy naming rules. Make necessary local renames deliberately and update all references.
- Do not introduce repositories, controller layers, base classes, interfaces, wrappers, configuration objects, or dependencies without an existing concrete need. Interface formatting rules do not require adding interfaces to every service.

## Exact Code Standards

Apply these rules to **every maintained source file**, including models, hooks, services, screens, components, demo adapters, and module-local server helpers. Do not stop after formatting only a few edited methods.

### Blocks And Spacing

- Use braces for `if`, `else`, loops, and similar control flow. Keep `else`, `catch`, and `finally` beside the preceding closing brace.
- A compact executable body contains exactly one short, single-line statement. Do not pad it internally.
- An expanded body has multiple statements, a nested control-flow block, or a multiline statement. Put exactly one blank line after its opening brace and before its closing brace. Apply this consistently to functions, methods, constructors, callbacks, branches, loops, and error-handling blocks. An empty body stays empty.
- Pad class bodies containing multiple members. Separate initialization, methods, and helpers consistently.
- Data objects, arrays, schema objects, and data-only interfaces are not executable blocks; do not give them boundary padding.
- Follow Obelisk's file-local convention rule: preserve the target file's established indentation, quotes, semicolons, trailing commas, and readable wrapping. Portal's maintained source uses two spaces, single quotes, and semicolons; keep that existing family, with the constructor exception below. Keep readable wrapping; do not introduce a new arbitrary line-length regime.
- Use one space after control-flow keywords, commas, and type/property colons, and around binary/assignment operators. Do not put spaces before call parentheses.
- Keep one blank line between logical phases and declarations. Never add multiple consecutive blank lines. Use the import grouping below, preserving directives such as `'use client'` and side-effect imports.

Compact example:

```ts
if (!userId) {
  return null;
}
```

Expanded example:

```ts
if (input.query.trim()) {

  parameters.set(
    'query',
    input.query.trim(),
  );

}
```

Data example:

```ts
const options = {
  limit: 25,
  offset: 0,
};
```

### Import Grouping

Follow Obelisk's compact groups in order: packages (Node built-ins and third-party dependencies), shared application dependencies, then feature/local dependencies. Omit empty groups. Keep imports consecutive within a group and exactly one blank line between groups and before the first declaration or its documentation.

Resolve responsibility rather than counting relative path segments. Imports from any feature module belong to the feature group; a foundational service's own contracts/models/helpers are local, while other foundational services are shared. Shared UI, presentation, configuration, utilities, models, and application wiring belong to the shared group.

Keep package imports in their established order. Within shared/feature groups, order by resolved repository path; imports from one path remain adjacent without changing bindings, type modifiers, or wrapping. Side-effect imports are ordering barriers: keep them in place and group only the surrounding imports. Preserve required initialization order; document a necessary exception rather than sorting blindly. Do not reorder dynamic imports, re-exports, registrations, or construction.

Use short contextual headings in large mixed import sections. Containers group application/foundational dependencies first, then one bucket per module; keep each module's dependencies together in their role order. Other large sections use buckets matching actual dependencies, such as shared models, shared services, related features, local models, and local services. Ordinary files keep the compact groups without unnecessary headings. Resolve paths alphabetically inside each bucket unless a documented contextual role order applies.

### Constructors And MARK Blocks

For two or more constructor parameters, place each on its own line, with the closing parenthesis aligned with `constructor` and **no trailing comma on the final parameter**. Keep zero/one-parameter constructors compact when appropriate. Preserve all parameter properties, defaults, and dependency contracts.

```ts
constructor(
  private readonly auth: FirebaseAuthServiceInterface,
  private readonly demoMode = environment.demoMode
) {}
```

Use Obelisk's exact three-line `MARK` block above concrete/abstract service methods, accessors, service helper functions, and API handler declarations. Include module-local live/demo service helpers. Use exactly 38 asterisks per separator, an operation-specific uppercase label, matching indentation, and one blank line before the declaration. Keep relevant JSDoc attached to its declaration after that blank line.

```ts
// **************************************
// MARK: - GET USER BY ID
// **************************************

async getUserById(userId: string) {
  return this.api.request<User>(`/users/${encodeURIComponent(userId)}`);
}
```

The example demonstrates layout only; retain the actual method's validation and transport-to-domain mapping. Constructors and interface signatures are exempt from MARK blocks. Do not add MARK blocks to React components, render helpers, event callbacks, or every small function regardless of responsibility.

### Interfaces

Method-bearing interfaces have exactly one blank line at each body boundary. Group reads, creates, replacements, partial updates, removals, then lifecycle operations, following the actual HTTP contract where one exists. Keep consecutive signatures within a group and one blank line between groups. Preserve overload order, documentation, types, and runtime implementation order.

The following is a layout illustration, not a request to add this contract or these endpoints:

```ts
export interface UserServiceInterface {

  listUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User>;

  createUser(input: UserCreateInput): Promise<User>;

  replaceUser(userId: string, input: UserReplacement): Promise<User>;

  updateUser(userId: string, input: UserUpdateInput): Promise<User>;

  deleteUser(userId: string): Promise<void>;

}
```

Data-only interfaces stay compact, without blank lines between each property:

```ts
export interface UserQuery {
  query: string;
  limit: number;
  offset: number;
}
```

### Named Results Before Returns

Assign callback-based collection computations, calls containing inline callbacks, promise constructors/chains containing closures, and returned functions to descriptive local variables before returning them. Inspect callbacks nested inside returned objects/arrays as well. Apply the rule inside callbacks too.

Keep a single-line assignment directly adjacent to its variable return. Separate a multiline assignment from its return with one blank line. The resulting multi-statement body still receives expanded-block boundary padding.

Before:

```ts
function getUserIds(users: User[]): string[] {
  return users.map((user) => user.id);
}
```

After:

```ts
function getUserIds(users: User[]): string[] {

  const userIds = users.map((user) => user.id);
  return userIds;

}
```

Multiline result:

```ts
function getActiveUsers(users: User[]): User[] {

  const activeUsers = users.filter((user) => {

    const isActive = !user.disabled && !user.deleted;
    return isActive;

  });

  return activeUsers;

}
```

Promise transformations must preserve the existing `await` exactly:

```ts
// Before: awaited inside the existing try/catch.
return await loadUser(userId, () => api.request<User>(path));

// After: stays awaited in that same try/catch.
const user = await loadUser(userId, () => api.request<User>(path));
return user;
```

```ts
// Before: returned without awaiting.
return loadUser(userId, () => api.request<User>(path));

// After: still returned without awaiting.
const userPromise = loadUser(userId, () => api.request<User>(path));
return userPromise;
```

These promise examples are statement excerpts; retain the enclosing block's required padding. Preserve contextual/generic typing, rejection handling, `try`/`catch`/`finally` scope, concurrent work, and cleanup timing. Do not add `await` to a previously unawaited return or remove one.

Ordinary JSX returns are an explicit exception: inline event/render callbacks inside JSX do not require assigning the entire JSX tree to a variable. Collection computations inside render helpers still use named results. Do not extract callbacks across hook boundaries or change their closure semantics. Simple literal, variable, data-only object, and direct delegation returns without callbacks may remain direct.

### Models And Naming

- Keep independent models, enums, query inputs, and unrelated payloads in separate files near their owner. Keep a schema, its inferred type, and directly derived input schemas together. Do not split these related declarations into three files.
- Reuse existing canonical models; update imports and narrow barrels when moving declarations. Preserve field names, enum values, defaults, optionality, nullability, refinements, validation messages, and inferred types.
- Expand every Zod enum array to one case per line. This does not authorize introducing or changing enum values.
- Use camelCase values/functions and service/model filenames, PascalCase components/classes/types, `useX` hooks, and existing `Schema`, `Service`, and `Interface` suffixes. Preserve Next.js reserved filenames/exports, route segments, external payload keys, and existing public contracts. Do not apply Grimoire's Swift filenames or screen-renaming conventions mechanically.

Standalone enum layout, using illustrative values only:

```ts
export const VisibilitySchema = z.enum([
  'public',
  'private',
]);

export type Visibility = z.infer<typeof VisibilitySchema>;
```

Canonical model and derived schema layout:

```ts
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  visibility: VisibilitySchema,
});

export type Article = z.infer<typeof ArticleSchema>;

export const ArticleUpdateSchema = ArticleSchema.pick({
  title: true,
  visibility: true,
});

export type ArticleUpdate = z.infer<typeof ArticleUpdateSchema>;
```

The enum and article belong in separate model files, with the existing project's import/export conventions. These are structural examples; do not add article features or replace actual schemas with them.

### File Hygiene

Use LF endings, exactly one final newline, no trailing whitespace, and no whitespace-only blank lines. Preserve directive/import ordering and comments that explain behavior. Ignore generated output, dependencies, assets, and build artifacts rather than rewriting them.

## Grimoire's Lego Block Philosophy In React

Adopt the **composition principle**, not Swift syntax or an extra architecture layer:

- The page/screen should read as a short composition of named visible sections: header, filters, results, row/card, and actions where applicable.
- Move a section's detail into a small local `renderX()` helper; collection helpers call a focused row/card helper. Keep necessary state branches beside their content. Do not split every element merely to produce more helpers.
- Helpers only construct JSX; they do not execute fetching, mutation, subscription, or navigation side effects during render, call hooks, or become new state owners. Passing existing event callbacks to JSX remains appropriate; those callbacks execute on interaction. Keep hooks and side effects at their existing top-level owner. Pass only needed values or close over current screen state when simpler.
- Call local JSX helpers as functions: `{renderResults()}`. Never define `Results` inside the screen and render `<Results />`; that changes component identity on each parent render and can reset state, focus, effects, and transitions.
- Preserve already-existing stateful child components as stable module-scope components. Do not move hooks, effects, or state into a new child solely to split JSX; keep a hook-free render helper when that preserves the existing owner. Extract a module-scope component only for an independently owned responsibility or real reuse, and verify state lifetime, mounting, and focus parity. Never directly call a hook-using component as a helper. Do not create a component/file solely to forward props or rename a modifier/class chain.
- Reuse Portal's shared controls, containers, presentation services, and semantic spacing/theme tokens. Preserve existing DOM elements, wrapper structure, keys, class names, accessibility attributes, and state branches. Do not convert an existing table into a list because the example below uses a list.
- Preserve React keys on the same collection boundary. Keep controlled inputs controlled, preserve event propagation and submit behavior, and retain responsive alternatives. Do not widen `'use client'` boundaries for convenience.
- Existing Next.js page/layout files stay route composition; do not move client data loading or private server work between layers to make JSX shorter.

This example demonstrates the composition shape for an already-loaded list. Apply this shape within the existing screen; retain that screen's full loading/error/empty/pagination/form behavior and original markup. It is not a replacement implementation of Portal's users page.

```tsx
function UserListContent({ users }: UserListContentProps) {

  function renderHeader() {

    return (
      <PageHeader title={strings.ui.appShell.users} />
    );

  }

  function renderUserRow(user: User) {
    return <li key={user.id}>{user.email}</li>;
  }

  function renderUsers() {

    const userRows = users.map(renderUserRow);

    return (
      <ul className="m-0 grid list-none gap-4 p-0">
        {userRows}
      </ul>
    );

  }

  function renderContent() {

    return (
      <Page>
        {renderHeader()}
        {renderUsers()}
      </Page>
    );

  }

  return renderContent();

}
```

Reuse the existing props type, or keep a genuinely independent props model in its own module-owned model file. This illustration does not require introducing a new content component into an existing screen.

No new view model, render registry, universal section schema, factory, wrapper system, or automatic memoization is needed for this pattern.

## Standards To Enforcement

| Requirement                                                                                            | Enforcement / Review                                                                          |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Braces, same-line else/catch/finally, keyword/call/operator/comma/property spacing, quotes, semicolons | Existing ESLint layout rules                                                                  |
| Expanded/compact executable (including switch) and multi-member class boundaries                       | `portal/block-layout`                                                                         |
| Constructor wrapping and final-parameter comma exception                                               | `portal/constructor-layout`; manual review of comments and defaults                           |
| Exact service/helper/handler MARKs                                                                     | `portal/service-mark`; manual operation label/responsibility review                           |
| Method-bearing interface boundaries                                                                    | `portal/interface-layout`; manual HTTP group/overload ordering                                |
| Named callback computations/functions before return                                                    | `portal/named-return`; manual descriptive names, contextual typing, await and lifetime review |
| One Zod enum case per line                                                                             | `portal/zod-enum-layout`; manual values/schema parity                                         |
| Two-space indentation and import/declaration separation                                                | ESLint `indent` and `padding-line-between-statements`                                         |
| Readable wrapping, logical phase separation and trailing commas                                        | Manual diff review; existing wrapping retained                                                |
| Independent models and naming                                                                          | Manual review of every declaration and affected caller; TypeScript                            |
| Lego section/row composition, DOM and state owner parity                                               | Manual review of every changed screen/component and browser workflows                         |
| Centralized copy, theme roles, shared UI                                                               | Existing copy/title-case, strings, colors, UI and Tailwind checks                             |
| LF, final newline, trailing whitespace, consecutive blank lines                                        | ESLint hygiene rules and `git diff --check`; EditorConfig/non-code Prettier                   |
| Behavior, API, query, permission, concurrency, cleanup parity                                          | Full diff/caller review plus local demo browser/HTTP checks; never inferred from lint         |

## Completion Gate

Inventory all files and direct callers before changing a module or shared slice. Record routes, contracts, state owners, and relevant demo workflows. Apply every standard to every maintained file in that scope, documenting genuinely inapplicable rules. Review every changed line and recheck all affected imports and callers; preserve hook order, dependency arrays, awaits, cleanup timing, markup, keys, and class names.

Before accepting a scope: finish shared dependencies; run focused ESLint with zero warnings and whitespace checks; manually review requirements in the checklist; run serialized project type generation/checks as appropriate; exercise affected local demo flows, desktop/narrow layout, keyboard/focus and retained drafts. Loading/error/empty/success and mutations remain part of acceptance. Keep pending or failed verification explicit. Use only demo data, with no live backend writes, analytics, push permission prompts, or external uploads as routine verification.

Keep module work sequential per owner when delegating. Give each worker exclusive directories; the coordinator owns shared files, integrations, project-wide checks, production builds and shared browser verification. Accept the current module before releasing its owner to the next one. Do not add an orchestration layer to do this.

Final integration requires the idempotent canonical formatting path, `npm run check`, a demo production build, `git diff --check`, reviewed model/JSX/manual gates, and a verification record containing actual evidence and remaining external-integration limits. Update [AGENTS.md](../AGENTS.md) and affected authoring guides when durable standards change.
