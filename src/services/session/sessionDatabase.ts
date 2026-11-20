import 'server-only';
import { closeSync, mkdirSync, openSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { registerDemoReset } from '@/services/demo/demoResetRegistry';

const sessionDatabases = globalThis as typeof globalThis & {
  portalDemoSessionDatabase?: DatabaseSync;
  portalLiveSessionDatabase?: DatabaseSync;
};

// **************************************
// MARK: - OPEN SESSION DATABASE
// **************************************

function openSessionDatabase(path: string) {

  if (path !== ':memory:') {

    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    closeSync(openSync(path, 'a', 0o600));

  }
  const database = new DatabaseSync(path);
  try {

    database.exec(`
      PRAGMA busy_timeout = 2000;
      CREATE TABLE IF NOT EXISTS portal_sessions (
        session_key TEXT PRIMARY KEY,
        expires_at INTEGER NOT NULL,
        payload TEXT NOT NULL,
        refresh_until INTEGER NOT NULL DEFAULT 0
      ) STRICT;
      CREATE INDEX IF NOT EXISTS portal_sessions_expiry ON portal_sessions (expires_at);
    `);

  } catch (error) {

    database.close();
    throw error;

  }
  return database;

}

// **************************************
// MARK: - GET SESSION DATABASE
// **************************************

export function getSessionDatabase(demoMode: boolean) {

  if (demoMode) {

    sessionDatabases.portalDemoSessionDatabase ??= openSessionDatabase(':memory:');
    return sessionDatabases.portalDemoSessionDatabase;

  }
  sessionDatabases.portalLiveSessionDatabase ??= openSessionDatabase(
    // Session data belongs on runtime storage and must stay out of deployment artifacts.
    resolve(/* turbopackIgnore: true */ process.env.PORTAL_SESSION_DB_PATH?.trim() || '.portal-data/sessions.sqlite'),
  );
  return sessionDatabases.portalLiveSessionDatabase;

}

registerDemoReset('sessions', () => { sessionDatabases.portalDemoSessionDatabase?.exec('DELETE FROM portal_sessions;'); });
