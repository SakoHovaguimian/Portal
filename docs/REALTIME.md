# Realtime chat, alerts, and browser notifications

Live chat messages are ordinary authenticated API reads/writes. Socket.IO invalidates the chat query when messages change. Demo chat uses the same HTTP routes with in-memory state and polling. Chat also polls when the live socket is unavailable.

## Socket.IO

Set `PORTAL_SOCKET_URL` to the browser-reachable Socket.IO origin. Each connection/reconnection obtains a fresh single-use ticket through authenticated `POST /api/backend/realtime/tickets`. The handshake sends `auth: { ticket }`; Firebase bearer tokens never enter browser JavaScript. The backend consumes tickets, verifies membership, and delivers only authorized workspace/user events.

The client listens to `portal.event`. Events must pass `RealtimeEventSchema` before use:

```json
{
  "event_id": "UUID",
  "occurred_at": "ISO 8601 timestamp",
  "event_type": "chat.message_created",
  "data": { "message_id": "UUID" }
}
```

Supported chat types: `chat.message_created`, `chat.message_updated`, `chat.message_deleted`. Alert type: `notification`, with `data: { title, body }`. Alerts use the shared toast provider. A bounded event-ID set deduplicates foreground Socket.IO/FCM delivery. Unmount/logout disconnects sockets and foreground listeners. Transport reconnects retry with delay; server handshake rejection also obtains a fresh ticket.

This generic Portal contract is intentionally smaller than JobLens project chat. Implement its backend publication/authorization or adapt the event schema and handler to your domain together.

## Firebase Messaging

Set all Firebase web configuration values and the public VAPID key from `.env.example`. These are public application identifiers, not Admin credentials. HTTPS is required outside localhost. Notifications are requested only by the user's Enable notifications action in Appearance settings. No mount or login flow opens a permission prompt.

The service worker at `/firebase-messaging-sw.js` receives public config from the server. The browser obtains an FCM token and registers it with `/devices/`; restoration happens only for a saved per-user opt-in. Disabling unregisters the token and calls Firebase `deleteToken`. Logout attempts cleanup before deleting the session so registration removal remains authenticated, and still signs out if a notification service fails. The backend should prune stale device registrations after invalid-token delivery responses.

For unified deduplication, send data-only FCM messages with `data.portal_event` containing a JSON-encoded `notification` event from above. Foreground messages share the Socket.IO validation/dedup path. Background delivery displays the title/body with `event_id` as the notification tag; clicks open the same-origin `/chat` screen. Do not send tokens, private credentials, HTML, or arbitrary external destinations in notification payloads.

Firebase SDK initialization and all socket/push calls are disabled in demo mode, regardless of configured live values. External ticket issuance, multi-browser broadcasts, device delivery, and background push require a configured backend and Firebase project for end-to-end verification.
