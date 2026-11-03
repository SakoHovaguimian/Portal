# Structured Publishing And Public Images

This optional module is an application foundation, with no product branding, milestone links, or bundled editorial illustrations. `/blog` and `/blog/[slug]` render only published content on the server without an authenticated provider. Staff write drafts at `/admin/blog`, `/admin/blog/new`, and `/admin/blog/[id]`. Route and API checks independently require an administrator or superadministrator. The backend remains authoritative in live mode.

## Ownership And Integration

`src/modules/blog` owns article models, queries, services, block editing, safe readers, and demo publishing state. `BlogService` and `PublicImageService` are constructed in the browser container. Authenticated operations use the existing service → API client → Next.js proxy path. Public SSR uses `publicBlogService`, which never reads or refreshes an authentication session; it parses upstream articles and rejects drafts. The public article route deliberately has no inherited loading boundary so missing/unpublished reads can return HTTP 404 before response headers are committed. An unavailable live service never uses fixtures.

The proxy composes `handlePublishingRequest` and `handlePublicImageRequest` with trusted server actors and a server-owned forwarder. Media routing runs first. The demo client composes module handlers through its handler registry. The reset registry clears `resetDemoBlogState`, `resetDemoPublicImages`, and `resetDemoEngagementState` with the rest of the process-local demo.

## Content And Drafts

`content` is an ordered array of stable UUID blocks. Each block has `{id, contentType, metaData}`. Array position is reading order; edits and reordering preserve IDs. Supported types are `header`, `section`, `footer`, `quote`, `bullet`, `divider`, `image`, `gallery2`, `gallery3`, `gallery4`, `embed`, `callout`, and `link`. Independent schemas under `models` define each shape. Sections support plain text and safe Markdown.

New writes require at least one complete block, at most 100 unique blocks, and at most 250,000 UTF-8 bytes of structured content. New article titles are 3–140 characters and introductions are 20–350. Images require descriptive alternative text; galleries require every image. No HTML or executable iframe markup is accepted.

Reads use a separate bounded, nontransforming stored parser. Stored block types and extra metadata survive unchanged, including historical text beyond current write limits. Metadata permits five nested levels, 100 object entries, 25,000 array entries, 100-character keys, 50,000-character strings, and 250,000 bytes per block. Known shapes render safely. Unsupported shapes, unsafe URLs, and unknown fields remain visible as complete escaped saved data. The editor preserves this evidence and blocks invalid new writes; replacement requires an explicit confirmed removal. Earlier `body` Markdown remains readable until an explicit lossless conversion appends it as a section. It is never silently truncated.

The builder supplies miniature previews, pointer handles, keyboard Arrow Up/Down, explicit move actions, and removal confirmation. The preview uses the current unsaved form and never mounts account controls. Dirty/busy guards protect in-app navigation and page unload. Save failures and HTTP 409 conflicts retain the draft. Each save, publish, unpublish, and deletion sends the observed revision; success increments it. Duplicate slugs are rejected. Saving a published article changes its public content immediately. Publish, unpublish, and delete use shared confirmation dialogs.

Topics accept 2–80 characters and are reusable from saved articles. Cover choices are optional (`none`) or public image references; saved articles supply reusable custom covers. Public choices come from published articles only. Removing the last article using a custom topic/cover removes that reusable choice. Configure starting topics in `blogCategoryPresets` and their labels in the single strings catalog.

## Safe Media

Structured media and link URLs require permanent public HTTPS addresses without credentials or private-network hosts. Image URLs exclude query/hash tokens; same-origin demo media references use `/api/public/media/:id`. Readers validate media references before loading them. Text remains escaped and Markdown uses the shared renderer.

Embed URLs resolve only exact YouTube, Vimeo, and Spotify hosts with validated provider IDs. The reader constructs canonical player URLs. No third-party frame loads until **Load Embedded Media** is chosen; **Close Embedded Media** removes it. Original external links remain available, including unsupported providers. Provider playback and telemetry are external behavior and are not established by local demo verification.

`src/services/media` is independent of publishing. Reuse `PublicImageField`, `PublicImagePreview`, `usePublicImageUpload`, `PublicImageService`, and `PublicImageReferenceSchema` for another staff-authored public image field. The field supports a permanent URL or multipart upload, preview, replace/remove, cancellation, inline failures, and an explicit public-visibility notice. Do not use it for private documents.

Uploads accept PNG, JPEG, WebP, and GIF with matching MIME signatures and a 5 MiB limit. The complete multipart body is bounded even without Content-Length. The web proxy forces `IMAGE` and `public` before forwarding to `/media/upload-media`; the live backend owns decoding, storage, retention, and public URLs. Deleting an article or block does not promise storage deletion.

Demo uploads never make remote writes. They use a process-owned byte store capped at 20 images and 25 MiB total, served with typed content, `nosniff`, and a restrictive CSP. Reset/restart clears it; separate server processes do not share it.

## Optional Account Engagement

`src/modules/engagement` owns likes, saved items, and optional integer ratings from 1–5. `BlogEngagementControls` has its own small query provider and public client with unauthorized redirects disabled. Anonymous reading continues while account actions offer a sign-in link. Unsaved previews do not include these controls. `/saved` is the protected, paged, searchable account directory.

Engagement keys are `{type,id}`. The extensible server target registry resolves public metadata for each type; the demo blog resolver returns published articles only. Saved unavailable items expose `target: null` and remain removable without revealing draft titles or private metadata. All mutations derive the user from the verified session. Global demo reset clears engagement, and account deletion calls the per-user reset. Live applications implement equivalent backend authorization and target resolution.

## Optional Live API Contract

These endpoints are explicit integration requirements. The template does not infer support from similarly named routes, apply database migrations, or provide live fixture fallback. A backend should implement identical permissions, validation, revision, visibility, and ownership rules before enabling these modules live.

| Endpoint                                   | Contract                                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `GET /blog`, `POST /blog`                  | Staff list or create draft                                                                                                   |
| `GET/PATCH/DELETE /blog/:id`               | Staff read/save/delete; writes require observed revision                                                                     |
| `POST /blog/:id/publish`, `/unpublish`     | Staff revision-checked publication                                                                                           |
| `GET /blog/_options`                       | Staff-visible topic and cover choices                                                                                        |
| `GET /public/blog`, `/public/blog/:slug`   | Published-only list/detail, anonymous                                                                                        |
| `GET /public/blog/id/:id`                  | Published ID lookup                                                                                                          |
| `GET /public/blog/_options`                | Published-only choices                                                                                                       |
| `POST /media/images`, `/blog/media/upload` | Authenticated staff web facade; forward validated public image to `POST /media/upload-media`                                 |
| `GET/PUT /engagement/:type/:id`            | Current user's state with visible target metadata and total like count; PUT `{liked?,saved?,rating?}`; rating is 1–5 or null |
| `GET /engagement/saved`                    | Current user's saved items; nullable unavailable target                                                                      |
| `DELETE /engagement/saved`                 | Remove current user's saved flag using `{type,id}`                                                                           |

Lists accept `query`, `limit`, and `offset`; publishing also accepts `category` and staff `status`. Pages use `{data,total,limit,offset}`. Article details contain `id`, `slug`, `title`, `description`, `author`, `category`, `cover`, `content`, `status`, timestamps, and integer `revision`. Errors use `{message}`; stale article revisions return 409, duplicate slugs return 400, unpublished/missing public articles return 404. Saved items return their key, `liked`, `saved`, `rating`, `updatedAt`, and nullable `target`; individual engagement adds `likeCount`.

See [architecture](ARCHITECTURE.md), [demo behavior](DEMO_MODE.md), [UI system](UI_SYSTEM.md), and [verification](VERIFICATION.md) for the shared infrastructure and actual validation evidence.
