import 'server-only';
import { cache } from 'react';

import { getContainer } from '@/container';

// **************************************
// MARK: - GET SERVER SESSION
// **************************************

export const getServerSession = cache(async () =>
  (await getContainer()).sessionService.publicSession(),
);
