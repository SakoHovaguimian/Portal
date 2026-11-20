import 'server-only';

import { SessionRecordSchema, type SessionRecord } from './models/sessionRecord';
import { getSessionDatabase } from './sessionDatabase';

export class SessionStore {

  constructor(private readonly demoMode: boolean) {}

  // **************************************
  // MARK: - FIND UNEXPIRED SESSION RECORD
  // **************************************

  read(key: string): SessionRecord | null {

    const row = getSessionDatabase(this.demoMode).prepare(`
      SELECT expires_at AS expiresAt, payload
      FROM portal_sessions
      WHERE session_key = ? AND expires_at > ?
    `).get(key, Date.now());
    return row ? SessionRecordSchema.parse(row) : null;

  }

  // **************************************
  // MARK: - INSERT SESSION AND REVOKE PREVIOUS SESSION
  // **************************************

  create(key: string, record: SessionRecord, previousKey: string | null) {

    const database = getSessionDatabase(this.demoMode);
    database.exec('BEGIN IMMEDIATE;');
    try {

      database.prepare('DELETE FROM portal_sessions WHERE expires_at <= ?').run(Date.now());
      database.prepare('INSERT INTO portal_sessions (session_key, expires_at, payload) VALUES (?, ?, ?);')
        .run(key, record.expiresAt, record.payload);
      if (previousKey) { this.delete(previousKey); }
      database.exec('COMMIT');

    } catch (error) {

      database.exec('ROLLBACK');
      throw error;

    }

  }

  // **************************************
  // MARK: - UPDATE EXISTING SESSION PAYLOAD
  // **************************************

  update(key: string, previousPayload: string, payload: string, lease?: number) {

    const result = getSessionDatabase(this.demoMode).prepare(`
      UPDATE portal_sessions SET payload = ?
      WHERE session_key = ? AND payload = ? AND expires_at > ?
        AND (? IS NULL OR refresh_until = ?)
    `).run(payload, key, previousPayload, Date.now(), lease ?? null, lease ?? null);
    return result.changes === 1;

  }

  // **************************************
  // MARK: - REVOKE SESSION RECORD
  // **************************************

  delete(key: string, lease?: number) {

    const result = getSessionDatabase(this.demoMode).prepare(`
      DELETE FROM portal_sessions WHERE session_key = ?
        AND (? IS NULL OR refresh_until = ?)
    `).run(key, lease ?? null, lease ?? null);
    return result.changes === 1;

  }

  // **************************************
  // MARK: - CLAIM SESSION REFRESH LEASE
  // **************************************

  claimRefresh(key: string, payload: string, now: number, lease: number) {

    const result = getSessionDatabase(this.demoMode).prepare(`
      UPDATE portal_sessions SET refresh_until = ?
      WHERE session_key = ? AND payload = ? AND expires_at > ? AND refresh_until <= ?
    `).run(lease, key, payload, now, now);
    return result.changes === 1;

  }

  // **************************************
  // MARK: - RELEASE SESSION REFRESH LEASE
  // **************************************

  releaseRefresh(key: string, lease: number) {

    getSessionDatabase(this.demoMode).prepare(`
      UPDATE portal_sessions SET refresh_until = 0 WHERE session_key = ? AND refresh_until = ?
    `).run(key, lease);

  }

}
