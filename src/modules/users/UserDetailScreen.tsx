'use client';

import type { User } from '@/models';
import { strings } from '@/strings';
import { Card, EmptyState, ErrorState } from '@/components/ui';
import { useUser } from './hooks';
import type { UserDetailScreenProps } from './models/userDetailScreenProps';

export function UserDetailScreen({ userId }: UserDetailScreenProps) {

  const { data, isPending, isError, refetch } = useUser(userId);

  function renderUserHeader(user: User) {

    return (
      <div className="grid gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          {strings.ui.userDetailScreen.userDetail}
        </p>
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-primary">
          {user.firstName} {user.lastName}
        </h1>
      </div>
    );

  }

  function renderUserFields(user: User) {

    return (
      <div className="grid gap-3 rounded-xl border-control border-secondary bg-secondary_subtle p-4 text-sm text-secondary">
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.email}
          </span>{' '}
          {user.email}
        </p>
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.externalId}
          </span>{' '}
          {user.externalId}
        </p>
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.created}
          </span>{' '}
          {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
    );

  }

  function renderUserDetails(user: User) {

    return (
      <Card className="grid gap-4">
        {renderUserHeader(user)}
        {renderUserFields(user)}
      </Card>
    );

  }

  function renderContent() {

    if (isPending) {
      return <Card>{strings.ui.userDetailScreen.loadingUserProfile}</Card>;
    }
    if (isError) {

      return (
        <ErrorState
          title={strings.ui.userDetailScreen.userUnavailable}
          description={strings.ui.userDetailScreen.weCouldNotLoadThisUserProfile}
          onRetry={() => void refetch()}
        />
      );

    }
    if (!data) {

      return (
        <EmptyState
          title={strings.ui.userDetailScreen.missingUser}
          description={strings.ui.userDetailScreen.thisUserRecordCouldNotBeFound}
        />
      );

    }

    return renderUserDetails(data);

  }

  return renderContent();

}
