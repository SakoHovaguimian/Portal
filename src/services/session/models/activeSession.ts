import type { ServerSession } from './serverSession';
import type { SessionRecord } from './sessionRecord';

export type ActiveSession = ServerSession & {
  key: string;
  record: SessionRecord;
};
