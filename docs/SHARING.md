# Remote Sharing

Install Cloudflare's `cloudflared` helper once (`brew install cloudflared` on macOS), then run:

```sh
npm run share
```

This creates a free temporary HTTPS Quick Tunnel, starts Portal's development server on port 3001, and prints the public link once the server responds. Keep the computer awake and the terminal running. Press **Control + C** to stop the tunnel, Next.js, and their child processes. If either child exits unexpectedly or startup times out, the command stops the remaining children and fails. It never stops independently started backends or Docker containers. Existing servers are not reused: an occupied port produces an error before creating a tunnel.

Stop any existing Portal development server in this checkout first, even when choosing another port: Next.js uses one development-output lock per checkout.

The command uses Next.js's normal development `.env*` loading order, with shell variables taking precedence. It preserves your configured demo/live mode. For a demo-only preview:

```sh
DEMO_MODE=true npm run share
```

The temporary URL is passed to the child as `PORTAL_APP_ORIGIN` for mutation-origin validation and `PORTAL_SHARE_ORIGIN` for Next.js's exact development-origin allowlist. Your environment files stay unchanged. Use the printed HTTPS URL while sharing; the configured canonical origin is that URL for this process. Ordinary `npm run dev` is unchanged.

## Options

```sh
npm run share -- --help
npm run share -- --port 4001
SHARE_ALLOWED_EMAILS=friend@example.com npm run share
```

- Local port priority: `--port`, nonempty `SHARE_PORT`, then `3001`. This affects sharing only.
- `SHARE_ALLOWED_EMAILS`: optional comma-separated allowed emails. Cloudflare asks visitors for an email code. Requires a recent `cloudflared` supporting `--allowed-mail`.
- `CLOUDFLARED_PATH`: optional path to an installed executable; otherwise `cloudflared` must be on `PATH`.

Without email protection, anyone with the link can reach Portal, including its development/demo controls. Use synthetic data and ordinary application authentication. Quick Tunnels require no Cloudflare account or domain, have changing URLs and no uptime guarantee, support at most 200 in-flight requests, and do not support SSE. See [Cloudflare's Quick Tunnel documentation](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

On macOS/Linux, shutdown sends SIGTERM to the command's own child process groups, allows up to 15 seconds for cleanup, then kills any remaining children. On Windows, the command uses `taskkill /T /F` to stop those process trees. No database migrations, seeding, or infrastructure shutdown run.

## Connect Portal To Obelisk On Another Port

For Obelisk listening on local port 4000, set these in Portal's `.env.local`, then restart Portal:

```dotenv
DEMO_MODE=false
PORTAL_API_URL=http://localhost:4000/api
```

Live mode also requires the Firebase web API key and session secret described in the [authentication guide](AUTH.md). The `/api` suffix matters. Alternatively, override only this invocation:

```sh
PORTAL_API_URL=http://localhost:4000/api npm run share
```

That override preserves the configured demo/live mode; demo mode does not call Obelisk. The URL is server-only: remote browsers call Portal's authenticated proxy, so Obelisk can remain private on the same computer. A Docker API published at `127.0.0.1:4000` works the same way. Sharing Portal does not start Obelisk.

If Obelisk runs on another computer, run its share command there and use its printed `https://…trycloudflare.com/api` as `PORTAL_API_URL`. Leave Obelisk's browser email gate off for these server-to-server API requests; existing API authentication still applies. A temporary public tunnel uses HTTPS on the normal public port, regardless of the local Obelisk port.

## Live Socket.IO

`PORTAL_API_URL` controls server-side HTTP calls. Live Socket.IO connects directly from the browser, so remote testers also need a publicly reachable `PORTAL_SOCKET_URL`. When sharing both projects, use Obelisk's printed HTTPS origin here (without `/api`) and set Obelisk's `WEB_APP_ORIGIN` to Portal's printed HTTPS origin. Restart the affected server after environment changes. Because Quick Tunnel URLs change, restart Portal's share command first, then start Obelisk with the new Portal origin; update Portal's socket setting through its development-server environment reload, or use stable named tunnels for repeated live-realtime testing. Browser email gates are unsuitable for this Socket.IO/client workflow. Demo chat uses polling and needs neither a backend tunnel nor a socket URL.
