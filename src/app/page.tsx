import { redirect } from 'next/navigation';
import { getServerSession } from '../lib/server/getServerSession';
import { getDefaultProjectRoute } from '@/config/projectRoutes';

export default async function HomePage() {

  const session = await getServerSession();
  redirect(session ? getDefaultProjectRoute(session.user.role) : '/login');

}
