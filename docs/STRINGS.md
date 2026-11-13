# Strings and content

**Every authored user-visible string belongs in the single [src/strings.ts](../src/strings.ts) file.** This includes JSX text, labels, placeholders, page metadata, buttons, table headers, validation/error messages, empty/loading states, toasts, dialog copy, accessible names, static demo content, and visible enum labels. English is the current language; browser locale is used only for the platform-owned date picker.

Import `strings` and, when needed, `labels` from `@/strings`. Both exports are defined directly in `src/strings.ts`. Organize copy with nested domain/screen keys inside that file. Do not create additional catalog files, a strings directory, or re-export shims. Shared accent, tone, and panel labels belong in the same file.

```tsx
import { strings } from '@/strings';
<Button>{strings.chat.send}</Button>;
```

Use a named formatter for variable copy, with typed parameters when adding new messages. Keep complete sentences together. Do not build sentences from translated fragments or use raw domain enum values as labels.

Technical identifiers are not display strings: routes, API keys/field names, protocol verbs and headers, schema enums, storage keys, analytics event names, CSS classes/tokens, SVG paths, and external user/backend content retain their original values. Sample credentials and authored fixture names are display/demo content, never production secrets. Real credentials must never enter the catalog.

## Contextual Buckets

The file starts with project identity and shared application/UI copy, followed by labeled sections for Account Tools, Background Jobs, Chat, Engagement, Notifications, Onboarding, Publishing/Media, Component Library/Motion, Demo Accounts, and CLI tools. Within `strings.ui`, screen copy is grouped by Authentication, Dashboard, Feature Requests, User Directory, and Appearance. Shared controls and error/demo copy have their own labeled groups.

Keep a feature's copy in its existing named export or nested screen bucket. Use actions, validation, and demo subgroups as a feature grows. Put cross-feature copy in the shared section. Use semantic key names so the casing validator can identify each role. Update callers when clarifying an ambiguous key. The [module guide](MODULES.md) maps each feature to its declaration and copy bucket.

Country and region names are imported reference data in [addressCountries](../src/components/ui/data/addressCountries.ts), with independent country/region types beside the shared UI models. Address field labels, placeholders, and formatters stay in `strings.address`.

## Copy casing

Use **Title Case** for actions and CTAs, page/section/card/dialog titles, text-field labels, navigation and tabs, table headers, filter/selection options, badges, short statuses, and toast titles. Apply the same case to accessible action names. This project's UI style capitalizes **every word**, including short words: `Save Changes`, `Date Of Birth`, `Back To Workspace`, and `Choose A Country`. Capitalize hyphenated words (`Dashboard-First Surfaces`), keep contractions together (`Doesn't`), and preserve acronyms and canonical brand spelling (`API`, `AI`, `iOS`, `macOS`).

Use sentence case for supporting descriptions, help/hints, complete validation/error messages, notification bodies, descriptive alt text, and instructional placeholders. Preserve the original case of user/backend content, geographic names, credentials, email addresses, URLs, version identifiers, units, and example Markdown/code. Do not transform copy at render time or use CSS capitalization; author the right case in the catalog.

The rule at the top of `src/strings.ts` applies to every UI export in the file. ESLint `copy/title-case` and `npm run check:strings` run the same validator. It checks authored strings, arrays, formatter template segments, and conditional output. Project identity, initializer CLI copy, and sharing CLI copy keep their supplied spelling.

New UI entries default to Title Case. Keys ending in `Title`, `Label`, `Heading`, `Header`, `Caption`, `Action`, `CTA`, `Button`, `Column`, `Option`, `Tab`, `Badge`, `Status`, or `Question` declare title roles. Use those suffixes for ambiguous UI names.

Keys ending in `Description`, `Hint`, `Body`, `Guidance`, `Placeholder`, `Alt`, `Paragraph`, `Explanation`, `Message`, `Summary`, `Byline`, `Answer`, `Reason`, or `Rejection` declare prose. The `errors`, `validation`, and `environment` groups also contain prose. Prose groups carry their role to ordinary children, so `typeDescriptions.header` is a description. An explicit suffixed title key such as `emptyTitle` always receives title validation.

Sample/example/syntax groups and keys ending in `Data`, `Value`, `Version`, `Keywords`, `Emoji`, or `Providers` preserve data spelling. Keep actions and headings in UI buckets. Imported country/region records live in their dedicated data file. Dynamic formatter arguments retain the caller's spelling.

Express the role in the key or bucket. Casing comments have no effect on the validator.

```ts
saveAction: 'Save Changes',
emptyTitle: 'No Requests Yet',
emptyHint: 'Create your first request to get started.',
validation: {
  invalidEmail: 'Enter a valid email address.',
},
seedPasswordData: 'password123',
```

Preserve mixed-case brand terms in the validator's canonical-word set before using them in title copy. The checker reviews authored literal output. Review arbitrary computed copy and external content manually.

`npm run check:strings` statically finds JSX text, display attributes, and common string-literal patterns outside `src/strings.ts`. Only that exact file is exempt from the inline-copy check; the catalog itself is checked for casing. It is a guardrail, not a complete localization parser. Review interpolated copy, computed labels, metadata, validation, and externally supplied strings manually. Do not weaken its rules to permit new inline copy; identify technical identifiers explicitly when necessary.

Zod/service validation shown in product UI must use catalog messages or a catalog-backed error translation. Backend-provided messages are external content; never put them into the catalog dynamically. Avoid exposing unknown server exception text.
