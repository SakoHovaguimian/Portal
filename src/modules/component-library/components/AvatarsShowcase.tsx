'use client';

import { Avatar, AvatarGroup } from '@/components/ui';
import { componentExpansionStrings as copy } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';

const people = copy.examples.people.map((name, index) => ({
  id: String(index),
  name,
}));
export function AvatarsShowcase() {
  return (
    <ShowcaseSection
      id="avatars"
      title={copy.examples.avatarsTitle}
      description={copy.examples.avatarsDescription}
      icon="user"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarSizes}
          </h3>
          <div className="flex items-center gap-5">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Avatar key={size} name={people[0].name} size={size} />
            ))}
          </div>
        </div>
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarFallback}
          </h3>
          <div className="flex items-center gap-5">
            <Avatar name={people[1].name} src="/portal-preview.svg" size="lg" />
            <Avatar
              name={people[2].name}
              src="/avatar-preview-unavailable.png"
              size="lg"
            />
            <Avatar name="" size="lg" />
          </div>
        </div>
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarPresence}
          </h3>
          <div className="flex flex-wrap gap-5">
            {(['online', 'busy', 'offline'] as const).map((status, index) => (
              <div key={status} className="grid justify-items-center gap-2">
                <Avatar name={people[index].name} status={status} />
                <span className="text-xs text-tertiary">
                  {copy.avatar.statuses[status]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarGroup}
          </h3>
          <AvatarGroup
            label={copy.examples.avatarGroup}
            items={people}
            max={3}
          />
        </div>
      </div>
    </ShowcaseSection>
  );
}
