import type { AppSession } from '@/models/appSession';

export interface SessionContextValue {
  session: AppSession | null;
  setSession: (session: AppSession | null) => void;
}
