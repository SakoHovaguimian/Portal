# Realtime and WebSockets

`PORTAL_REALTIME_MODE` supports `none` and `socketio`. The default is `none`.

## Ask “do we need this?”

Enable realtime only when stale data materially harms the workflow. Polling, refresh-on-focus, or server rendering is often simpler.

## Included seam

`src/services/realtime/realtimeProvider.tsx` provides:

- a Socket.IO client boundary;
- WebSocket-only transport;
- optional same-origin ticket acquisition;
- Zod validation for event envelopes;
- connection status;
- a subscription API that keeps domain handling outside transport code.

## Required event contract

Before enabling, document:

- stable event ID and schema version;
- event type and resource ID;
- occurred-at timestamp and ordering guarantees;
- authorization and short-lived ticket behavior;
- replay, deduplication, reconnect, and missed-event recovery;
- degraded/offline experience;
- observability and backpressure;
- which query keys or local records each event invalidates.

Never pass a long-lived bearer token to browser Socket.IO configuration when a short-lived, single-use ticket can be used.
