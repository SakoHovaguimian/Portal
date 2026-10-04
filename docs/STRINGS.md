# Strings and content

**Every authored user-visible string belongs in `src/strings`.** This includes JSX text, labels, placeholders, page metadata, buttons, table headers, validation/error messages, empty/loading states, toasts, dialog copy, accessible names, static demo content, and visible enum labels. English is the current language; browser locale is used only for the platform-owned date picker.

Import `strings` from `@/strings`. It combines platform copy with focused screen catalogs. Shared enum labels live in `@/strings/labels`. Keep a focused catalog per domain or screen instead of growing one enormous file. `index.ts` is the single public entry for the main catalog.

```tsx
import { strings } from '@/strings';
<Button>{strings.chat.send}</Button>
```

Use a named formatter for variable copy, with typed parameters when adding new messages. Keep complete sentences together. Do not build sentences from translated fragments or use raw domain enum values as labels.

Technical identifiers are not display strings: routes, API keys/field names, protocol verbs and headers, schema enums, storage keys, analytics event names, CSS classes/tokens, SVG paths, and external user/backend content retain their original values. Sample credentials and authored fixture names are display/demo content, never production secrets. Real credentials must never enter the catalog.

`npm run check:strings` statically finds JSX text, display attributes, and common string-literal patterns outside this folder. It is a guardrail, not a complete localization parser. Review interpolated copy, computed labels, metadata, validation, and externally supplied strings manually. Do not weaken its rules to permit new inline copy; identify technical identifiers explicitly when necessary.

Zod/service validation shown in product UI must use catalog messages or a catalog-backed error translation. Backend-provided messages are external content; never put them into the catalog dynamically. Avoid exposing unknown server exception text.
