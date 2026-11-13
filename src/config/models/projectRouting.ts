import type { ProjectNavigationItem } from './projectNavigationItem';

export interface ProjectRouting {
  navigation: ProjectNavigationItem[];
  redirectPrefixes: string[];
  disabledPrefixes: string[];
  disabledPaths: string[];
  workspacePaths: string[];
}
