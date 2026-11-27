import type { Route } from 'next';

export interface LandingPageProps {
  workspaceHref?: Route;
  demoMode: boolean;
}
