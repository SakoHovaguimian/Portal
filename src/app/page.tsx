import { getProjectRouting } from '@/config/getProjectRouting';
import { getDefaultProjectRoute } from '@/config/projectRoutes';
import { getServerSession } from '@/lib/server/getServerSession';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';

import { LandingPage } from '@/modules/landing/LandingPage';

export default async function HomePage() {

  const [session, runtime] = await Promise.all([getServerSession(), getEffectiveRuntime()]);
  const workspaceHref = session ? getDefaultProjectRoute(getProjectRouting(), session.user.role) : undefined;
  return <LandingPage workspaceHref={workspaceHref} demoMode={runtime.demoMode} />;

}
