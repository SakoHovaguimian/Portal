import 'server-only';
import { cache } from 'react';
import { container } from '@/container';
export const getServerSession = cache(() =>
  container.sessionService.publicSession(),
);
