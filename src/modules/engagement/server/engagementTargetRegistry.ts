import 'server-only';
import type { EngagementTargetResolver } from '../models/engagementTargetResolver';
import { EngagementTargetSchema } from '../models/engagementTarget';
import { getDemoBlogState } from '@/modules/blog/server/demoBlogState';
import { portalModules } from '@/config/portalModules';
const resolvers = new Map<string, EngagementTargetResolver>();
export function registerEngagementTarget(
  type: string,
  resolver: EngagementTargetResolver,
) {
  resolvers.set(type, resolver);
}
export async function resolveEngagementTarget(type: string, id: string) {
  const resolved = await resolvers.get(type)?.(id);
  return resolved ? EngagementTargetSchema.parse(resolved) : null;
}
// Demo resolvers project only public information. Live authorization belongs to the backend.
registerEngagementTarget('blog', (id) => {
  if (!portalModules.publishing) return null;
  const article = getDemoBlogState().find(
    (item) => item.id === id && item.status === 'published',
  );
  return article
    ? {
        type: 'blog',
        id: article.id,
        title: article.title,
        description: article.description,
        href: `/blog/${article.slug}`,
      }
    : null;
});
