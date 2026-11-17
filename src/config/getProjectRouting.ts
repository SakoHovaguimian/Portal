import 'server-only';

import { strings } from '@/strings';

import type { PortalModule } from './models/portalModule';
import type { ProjectConfiguration } from './models/projectConfiguration';
import type { ProjectRouting } from './models/projectRouting';
import { portalModuleRegistry } from './portalModuleRegistry';
import { portalModules } from './portalModules';
import { projectConfiguration } from './projectConfiguration';

const coreNavigation: NonNullable<PortalModule['navigation']> = {
  profile: { href: '/profile', label: strings.ui.appShell.profile, icon: 'user' },
  appearance: { href: '/settings/appearance', label: strings.ui.appShell.appearance, icon: 'settings' },
};

function createProjectRouting(): ProjectRouting {

  const destinations: NonNullable<PortalModule['navigation']> = { ...coreNavigation };
  const redirectPrefixes = ['/settings', '/profile', '/experience', '/dev-settings', '/admin', '/superadmin'];
  const disabledPrefixes: string[] = [];
  const disabledPaths: string[] = [];
  const workspacePaths: string[] = [];

  for (const feature of portalModuleRegistry) {

    const enabled = portalModules[feature.id];
    for (const key of Object.keys(feature.navigation ?? {})) {

      const id = key as ProjectConfiguration['navigation'][number];
      const item = feature.navigation?.[id];
      if (!item) { continue; }
      const prefixes = enabled ? redirectPrefixes : disabledPrefixes;
      prefixes.push(item.href);
      if (item.staffHref) { prefixes.push(item.staffHref); }
      if (enabled) { destinations[id] = item; }

    }
    if (feature.pagePaths) {

      const paths = enabled ? redirectPrefixes : disabledPaths;
      paths.push(...feature.pagePaths);

    }
    if (enabled && feature.workspacePath) { workspacePaths.push(feature.workspacePath); }

  }

  const navigation = projectConfiguration.navigation.flatMap((id) => {

    const item = destinations[id];
    return item ? [item] : [];

  });

  return { navigation, redirectPrefixes, disabledPrefixes, disabledPaths, workspacePaths };

}

const projectRouting = createProjectRouting();

export function getProjectRouting() {
  return projectRouting;
}
