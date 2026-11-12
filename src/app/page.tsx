import { redirect } from 'next/navigation';

import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { getServerSession } from '../lib/server/getServerSession';

export default async function HomePage() {

  const session = await getServerSession();
  redirect(session ? getDefaultProjectRoute(session.user.role) : '/login');

}
