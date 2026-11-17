import { redirect } from 'next/navigation';

import { getProjectRouting } from '@/config/getProjectRouting';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { getServerSession } from '../lib/server/getServerSession';

export default async function HomePage() {

  const session = await getServerSession();
  redirect(session ? getDefaultProjectRoute(getProjectRouting(), session.user.role) : '/login');

}
