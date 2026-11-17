# Dependency Maintenance

Portal keeps npm's lockfile committed and uses Node 22. Run `npm ci` for reproducible installs, `npm run check:dependencies` to audit all installed dependency classes, and `npm audit --omit=dev` to inspect the production tree separately. The shared command fails on high or critical findings; moderate findings remain visible for review.

## Recurring Review

`.github/workflows/dependency-audit.yml` audits pull requests that change npm manifests, manifest changes on main/master, every Monday, and manual dispatches. It uses read-only repository permissions and installs with lifecycle scripts disabled because this job only audits metadata. GitHub's configured workflow-failure notifications provide the failure signal. The schedule becomes active after the workflow is pushed to the default branch with Actions enabled; local file creation does not activate a hosted schedule.

`.github/dependabot.yml` checks npm and GitHub Actions weekly. Next.js and its ESLint configuration are grouped, as are React/React DOM and their types. Review updates, preserve paired versions, run `npm run check`, build in demo mode, and exercise affected workflows before merging.

## November 3, 2026 Update

- Updated Next.js and `eslint-config-next` together from 16.2.10 to 16.4.5. See the [maintainer's release](https://github.com/vercel/next.js/releases/tag/v16.4.5).
- Updated the Zod requirement and resolved dependency to 4.6.7, Firebase's supported 12.x requirement to 12.19.0, and query devtools to 5.105.3. Updated compatible transitive dependencies through npm, including RE2JS and the Solid/Seroval devtools path.
- Added a documented `@grpc/grpc-js` override to the patched 1.14.7 line. Firebase's Firestore dependency still requests an older vulnerable gRPC line even though Portal imports only Firebase App and Messaging. The override fixes the installed tree without downgrading Firebase or adding browser authentication. Remove it when Firebase's declared transitive range accepts a patched version, then repeat both audits.
- The production audit reports zero vulnerabilities after these updates. The full audit reports 16 moderate findings inherited from minimatch through development-only ESLint packages. They involve tooling glob processing; no high or critical findings remain. A forced downgrade of ESLint/Next configuration or a breaking minimatch override is not a compatible fix. Track upstream remediation and review the moderate findings on each update.

An audit result is a snapshot of the advisory database and lockfile, not proof that every affected path is reachable. Do not use `npm audit fix --force` without reviewing the proposed package changes and their contracts.
