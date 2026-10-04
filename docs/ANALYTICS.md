# Analytics and consent

Portal uses Amplitude Browser SDK behind explicit opt-in. Set `AMPLITUDE_API_KEY` for a live project. This is a public browser project key; keep management secrets on the backend. `DEMO_MODE=true` disables initialization regardless of the key or stored consent.

`CookieConsentControls` offers equally accessible Essential only and Accept analytics actions. The decision persists in `portal-analytics-consent`; same-tab events and cross-tab storage events synchronize it. Preferences can be changed in Appearance settings.

Before acceptance, the application does not dynamically import, initialize, or send events through Amplitude. Autocapture/default tracking are disabled. Accepted tracking currently records only `screen_view` with a normalized route: query strings and fragments are excluded, UUID path segments are replaced with `:id`, and no user identity, email, message, input, Firebase token, or raw API error is attached.

Declining or revoking immediately gates new tracking, opts the SDK out, resets its identity, and removes Amplitude storage. Already transmitted events cannot be recalled by a local consent switch. Consent is not implied by login or by granting browser notifications; those are independent preferences.

Add future events as explicit, reviewed metadata contracts. Never attach arbitrary error objects, request bodies, search queries, URLs with IDs, or form values. Backend error monitoring belongs to the backend; Sentry and its configuration were removed from Portal.
