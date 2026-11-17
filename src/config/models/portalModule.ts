import type { FeatureBackendHandler } from '@/services/api/models/featureBackendHandler';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';

import type { ProjectConfiguration } from './projectConfiguration';
import type { ProjectNavigationItem } from './projectNavigationItem';
import type { ProjectRouting } from './projectRouting';

export interface PortalModule {
  id: keyof ProjectConfiguration['modules'];
  navigation?: Partial<Record<ProjectConfiguration['navigation'][number], ProjectNavigationItem>>;
  pagePaths?: readonly string[];
  workspacePath?: string;
  ownsApiPath?: (pathname: string, currentUserId?: string) => boolean;
  demo?: {
    handle: DemoRequestHandler;
    reset?: () => void;
    resetAccount?: (userId: string, routing: ProjectRouting) => void;
  };
  live?: FeatureBackendHandler;
}
