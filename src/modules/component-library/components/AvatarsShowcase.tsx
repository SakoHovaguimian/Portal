'use client';

import { Avatar, AvatarGroup } from '@/components/ui';
import type { AvatarProps } from '@/components/ui/models/avatarProps';
import { componentExpansionStrings as copy } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const people = copy.examples.people.map((name, index) => ({
  id: String(index),
  name,
}));
export function AvatarsShowcase() {

  function renderAvatarSize(size: NonNullable<AvatarProps['size']>) {

    return (
      <Avatar key={size} name={people[0].name} size={size} />
    );

  }

  const avatarSizes = (['sm', 'md', 'lg'] as const).map(renderAvatarSize);

  function renderAvatarStatus(status: NonNullable<AvatarProps['status']>, index: number) {

    return (
      <div key={status} className="grid justify-items-center gap-2">
        <Avatar name={people[index].name} status={status} />
        <span className="text-xs text-tertiary">
          {copy.avatar.statuses[status]}
        </span>
      </div>
    );

  }

  const avatarStatuses = (['online', 'busy', 'offline'] as const).map(renderAvatarStatus);

  function renderAvatarExamples() {

    function renderSizes() {

      return (
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarSizes}
          </h3>
          <div className="flex items-center gap-5">
            {avatarSizes}
          </div>
        </div>
      );

    }

    function renderFallbacks() {

      return (
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
      );

    }

    function renderPresence() {

      return (
        <div className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium text-secondary">
            {copy.examples.avatarPresence}
          </h3>
          <div className="flex flex-wrap gap-5">
            {avatarStatuses}
          </div>
        </div>
      );

    }

    function renderAvatarGroup() {

      return (
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
      );

    }

    return (
      <div className="grid gap-8 sm:grid-cols-2">
        {renderSizes()}
        {renderFallbacks()}
        {renderPresence()}
        {renderAvatarGroup()}
      </div>
    );

  }

  return (
    <ShowcaseSection
      id="avatars"
      title={copy.examples.avatarsTitle}
      description={copy.examples.avatarsDescription}
      icon="user"
    >
      {renderAvatarExamples()}
    </ShowcaseSection>
  );

}
