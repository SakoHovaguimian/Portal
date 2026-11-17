export interface DemoBlogActor {
  role: 'user' | 'admin' | 'superadmin';
  firstName?: string;
  lastName?: string;
}
