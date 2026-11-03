# Project Initializer

Run the initializer from the project root after installing the existing dependencies with Node 22. It uses the installed TypeScript parser and adds no dependencies.

```sh
npm run initialize
```

The guided setup asks for a profile, product identity, appearance, enabled capabilities, ordered navigation, demo starter data, environment, and optional local brand files. A preview appears before files are written. Supplying options runs without prompts; `--yes` selects defaults explicitly.

```sh
npm run initialize -- --help
npm run initialize -- --profile minimal --name "Acme" --dry-run
npm run initialize -- --profile internal-tool --name "Acme Operations" --slug acme-operations --theme blueprint --mode dark --starter-data empty --yes
```

`--dry-run` and its alias `--preview` validate inputs and show the exact managed file paths without writing, generating a session secret, or reading existing environment values. Existing settings are reported as an overwrite conflict. Review the preview before choosing `--force` when replacing them.

## Profiles

Profiles select defaults, and explicit options override them. They configure existing capabilities; they do not delete source files or install packages.

| Profile                         | Enabled Capabilities                                                                    | Starter Data |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------ |
| Minimal (`minimal`)             | Dashboard                                                                               | Empty        |
| Internal Tool (`internal-tool`) | Dashboard, users, feature requests, chat, background jobs, notifications, account tools | Populated    |
| SaaS (`saas`)                   | Internal Tool capabilities and onboarding                                               | Populated    |
| Content (`content`)             | Dashboard, users, publishing, media, account tools, engagement                          | Populated    |

The committed template configuration enables every capability to preserve the full demonstration. Running the initializer applies the selected profile rather than retaining that demonstration configuration.

```sh
npm run initialize -- --profile content --name "Acme Journal" --modules dashboard,publishing,media,engagement --navigation publishing,saved,dashboard,profile,appearance --yes
```

Supported capability IDs are `dashboard`, `users`, `featureRequests`, `chat`, `backgroundJobs`, `publishing`, `media`, `notifications`, `accountTools`, `onboarding`, and `engagement`. `--modules` is the full enabled set, not a list to add to the profile. Use `--modules none` to disable every optional capability.

Supported navigation IDs are `dashboard`, `users`, `featureRequests`, `chat`, `backgroundJobs`, `publishing`, `notifications`, `saved`, `profile`, `appearance`, `account`, and `help`. `--navigation` specifies the full visible order; omitted items are hidden. Capability-backed items require their corresponding enabled module; `saved` requires `engagement`, and `account`/`help` require `accountTools`. Use `--navigation none` to hide all configured destinations. Hiding navigation does not revoke route access; disabling its capability does. Role-aware publishing destinations and developer utilities remain composed by the shared shell.

`--starter-data empty` selects the runtime's empty demo policy. Authentication accounts remain available so that the project can be opened and configured. It does not wipe backend data. Demo mutations and account ownership continue to use the existing demo services.

## Identity And Appearance

`--name`, `--slug`, and `--description` set product identity. The name supports up to 80 printable characters; descriptions support up to 300. The slug uses lowercase letters/numbers separated by single hyphens and is limited to 64 characters. If omitted, it is derived from the product name. Supply an explicit slug when a name cannot produce an ASCII identifier.

All product display values remain in the single [strings catalog](../src/strings.ts). The initializer replaces only its bounded `PROJECT_IDENTITY` export, preserving the rest of the catalog. Its own prompts, errors, help, and output templates come from the bounded `PROJECT_INITIALIZER_COPY` export in that same file. The CLI reads literal syntax with the installed TypeScript AST parser; it never evaluates or imports application TypeScript.

`--theme` accepts `portal`, `studio`, `atelier`, `blueprint`, `arcade`, `dusk`, or `cupertino`; `--mode` accepts `light` or `dark`. They set the runtime's default appearance. Existing browser preferences continue to take precedence; clear the site's stored appearance preference to inspect new defaults in a previously used browser.

Optional `--logo` and `--icon` arguments copy existing local assets to `public/brand/project-logo.<extension>` and `public/brand/project-icon.<extension>`. Logo formats are SVG, PNG, JPEG, GIF, and WebP. Icons support PNG, JPEG, GIF, WebP, and ICO. Files must be regular non-symlink files up to 5 MiB, with a matching image signature. SVG logos must use passive shapes and presentation attributes: scripts, CSS styles, animation, external references, embedded media, and entity declarations are rejected. Icons intentionally do not accept SVG. No URLs are fetched. Previous assets with another extension are retained; review unused assets manually.

## Environment

The default is `--environment demo`. The generated `.env.local` enables `DEMO_MODE=true` and leaves optional integrations empty. This requires no backend, Firebase, sockets, Messaging, or analytics.

Live initialization requires a backend API URL and Firebase web API key. Supply the key in the process environment to keep it out of shell history; the CLI does not print it. In guided live setup, configure this variable before starting the command.

```sh
read -r -s PORTAL_INITIALIZER_FIREBASE_API_KEY
export PORTAL_INITIALIZER_FIREBASE_API_KEY
npm run initialize -- --profile saas --name "Acme" --environment live --api-url https://api.example.com/api --app-origin https://app.example.com --yes --dry-run
# After reviewing the preview, repeat without --dry-run.
unset PORTAL_INITIALIZER_FIREBASE_API_KEY
```

`--firebase-api-key` is also supported for environments that already manage argument secrecy. `--api-url` must be an absolute HTTP(S) URL without credentials, a query, or a fragment; it includes the backend API prefix. `--app-origin` is optional and accepts an HTTP(S) origin without a path. Live mode generates a new 48-byte cryptographically random server-only session secret when applying the plan and writes `.env.local` with owner-only permissions. Secrets are omitted from previews and the initialization record.

Optional onboarding, sockets, Firebase Messaging, and Amplitude settings remain disabled until explicitly configured afterward. The initializer does not provision infrastructure or verify live integrations. Follow the [backend contract](BACKEND_CONTRACT.md) and [authentication guide](AUTH.md) before deployment.

## Managed Files And Reruns

The generated [typed configuration](../src/config/projectConfiguration.ts) owns the profile, slug, asset paths, default appearance, capability flags, navigation order, and starter data policy. Runtime adapters consume it for shared navigation, route/API availability, appearance, branding, and demo behavior. Its independent type lives in [the configuration model](../src/config/models/projectConfiguration.ts).

The initializer writes that configuration, the bounded identity block in `src/strings.ts`, `.env.local`, optional copied assets, and `.portal-initialized.json`. It also updates only the npm package name fields in `package.json` and an existing `package-lock.json` to the slug, preserving versions, scripts, dependencies, and lockfile resolutions. No package installation runs. The state file records schema/template versions, timestamp, nonsecret selections, managed paths, and hashes for configuration and identity. Keep it with the project's source so later runs recognize initialization.

An existing `.env.local`, initialization record, custom configuration/identity, custom npm name, or conflicting brand destination blocks an applying run unless `--force` explicitly authorizes replacement. The CLI checks environment file metadata and makes an opaque backup during a forced transaction; it never parses, prints, or merges previous environment values. `--force` replaces the whole generated `.env.local`, so retain any custom integrations securely before using it. The initializer does not migrate old configuration schemas or prune modules/assets.

Writes use a project-local lock, validate destination paths against symlinks/traversal, stage files before applying, and atomically rename individual files. If an operation fails, previously applied files are rolled back from private transaction backups. The lock prevents simultaneous initializer runs; file metadata checks reject source changes made during planning. A process or machine interruption can leave `.portal-initializer.lock` and a private `.portal-initializer-<id>` recovery directory. Its nonsecret `manifest.json` maps numbered backups/staged files to project paths and records whether each target existed. Inspect and recover the managed files before removing the stale lock; a reported rollback failure names the directory. Do not commit recovery directories because an opaque environment backup may contain secrets.

After initialization, run `npm run check`, `DEMO_MODE=true npm run build`, and the affected demo browser flows. See the [new project checklist](NEW_PROJECT_CHECKLIST.md) for backend adaptation and integration verification.
