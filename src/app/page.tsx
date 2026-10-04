import { redirect } from 'next/navigation';
import { getServerSession } from '../lib/server/getServerSession';

export default async function HomePage() {
  const session = await getServerSession();
  redirect(session ? '/dashboard' : '/login');
}
