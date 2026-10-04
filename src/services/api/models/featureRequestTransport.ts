import type { UserTransport } from './userTransport';
export type FeatureRequestTransport = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  user?: UserTransport | null;
};
