# New service

Read [architecture](../ARCHITECTURE.md) and inspect the closest service before creating another abstraction.

Domain services belong to their module. Infrastructure integrations belong in `src/services/<capability>`. Inject dependencies through the matching client/server container. Use a service interface when multiple implementations exist, as for live and demo authentication.

Server services import `server-only`. Never import environment, private session models, credentials, or the server container into client components. Public config is explicitly projected by `getRuntimeConfig`.

Document initialization, cancellation, retries, failure handling, ownership, cleanup, and demo behavior. Every external side effect must be disabled or simulated under DEMO_MODE. Put independent models in separate files and messages in strings catalogs. Verify the actual container wiring, then update focused docs and the agent index.
