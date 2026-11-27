# Analytics and consent

Portal sends a single type of event, `screen_view`, directly to Amplitude after a visitor opts in. Set `AMPLITUDE_API_KEY` to the public ingestion key of the intended project and set `AMPLITUDE_SERVER_ZONE` to its data region. The default is `US`. Use `EU` for European projects. An unknown zone, an empty key, or an active demo runtime disables collection. The server passes the public key and the regional endpoint to the browser. Management credentials belong on the server. [Amplitude HTTP V2 ingestion contract](https://amplitude.com/docs/apis/analytics/http-v2)

## Consent and withdrawal

The visitor can accept analytics or choose Essential Only from the banner. Both actions are available again at `/privacy` and in Appearance settings. Consent applies to this browser origin, independently of the signed-in account and browser notification permission.

The `portal-analytics-consent` local storage entry holds a versioned record such as `{"version":1,"choice":"accepted"}`. A missing, malformed, obsolete or legacy record requires a fresh choice. Storage failure keeps analytics off. Consent changes propagate in the current tab and through browser storage events to other tabs. When changing collection purposes or recipients, update the notice and increment `cookieConsentVersion` to request a fresh choice. [Consent record](../src/services/privacy/models/cookieConsentRecord.ts)

Withdrawal clears the temporary device ID, stops new sends, and aborts outstanding fetches where the browser can still cancel them. It cannot recall a request already received by Amplitude. There is no analytics queue, offline storage or automatic retry. Each tab clears its temporary ID when it observes a consent change, even if a later choice has already reached storage. Reloading the document or opting in again starts with a new random device ID. This supports screen counts and within-document navigation. Unique IDs do not measure returning people, and offline visits can be undercounted.

## Event contract

- The only event property is `screen`. [The screen allowlist](../src/services/analytics/analyticsScreen.ts) matches static page paths and maps a detail page to a fixed name such as `/blog/:slug` or `/users/:id`. The privacy page and unknown paths are skipped. Query strings, fragments, slugs, record IDs, form values and message contents are excluded.
- Each request carries the public project key, the event type, the screen name, a random document-scoped device ID and a random event ID for deduplication. Amplitude supplies the ingestion time. Portal does not send an account or session ID, an IP field, browser language, user agent or platform in the event. Browser requests still expose transport information such as the network IP and browser-managed headers to the recipient. Requests omit credentials and referrers.
- Portal uses the Amplitude HTTP endpoint without loading vendor scripts, remote configuration, diagnostic reporting, autocapture or attribution. When a project key is configured, Portal removes the previous Browser SDK's project-specific identity, unsent events and cached configuration from local storage, and requests removal of its diagnostics database. Other tabs using the older SDK may need to close before IndexedDB completes deletion.

Review new screen names before adding them to the allowlist. Do not attach arbitrary request bodies, error objects, search queries, or complete URLs. Backend error monitoring belongs to the backend.
