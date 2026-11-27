'use client';

import { Card, EmptyState, ErrorState, Skeleton } from '@/components/ui';
import type { User } from '@/models';
import { strings } from '@/strings';

import { useUser } from './hooks';
import type { UserDetailScreenProps } from './models/userDetailScreenProps';

export function UserDetailScreen({ userId }: UserDetailScreenProps) {

  const { data, isPending, isError, refetch } = useUser(userId);

  function renderUserHeader(user?: User) {

    return (
      <div className="grid gap-2">
        <p
          role={isPending ? 'status' : undefined}
          className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary"
        >
          {isPending ? strings.ui.userDetailScreen.loadingUserProfile : strings.ui.userDetailScreen.userDetail}
        </p>
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-primary">
          {user ? (
            <>{user.firstName} {user.lastName}</>
          ) : (
            <span className="flex h-lh items-center">
              <span className="sr-only">{strings.ui.userDetailScreen.userDetail}</span>
              <Skeleton width="min(100%, 12rem)" height="0.8em" />
            </span>
          )}
        </h1>
      </div>
    );

  }

  function renderFieldValue(value?: string) {

    if (!isPending) { return value; }

    return (
      <span className="inline-block w-1/2 max-w-52 align-middle">
        <Skeleton />
      </span>
    );

  }

  function renderUserFields(user?: User) {

    return (
      <div
        aria-busy={isPending}
        aria-hidden={isPending || undefined}
        className="grid gap-3 rounded-xl border-control border-secondary bg-secondary_subtle p-4 text-sm text-secondary"
      >
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.email}
          </span>{' '}
          {renderFieldValue(user?.email)}
        </p>
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.externalId}
          </span>{' '}
          {renderFieldValue(user?.externalId)}
        </p>
        <p className="m-0">
          <span className="font-semibold text-primary">
            {strings.ui.userDetailScreen.created}
          </span>{' '}
          {renderFieldValue(user && new Date(user.createdAt).toLocaleString())}
        </p>
      </div>
    );

  }

  function renderUserDetails(user?: User) {

    return (
      <Card className="grid gap-4">
        {renderUserHeader(user)}
        {renderUserFields(user)}
      </Card>
    );

  }

  function renderContent() {

    if (isPending) {
      return renderUserDetails();
    }
    if (isError) {

      return (
        <ErrorState
          title={strings.ui.userDetailScreen.userUnavailable}
          description={strings.ui.userDetailScreen.weCouldNotLoadThisUserProfileHint}
          onRetry={() => void refetch()}
        />
      );

    }
    if (!data) {

      return (
        <EmptyState
          title={strings.ui.userDetailScreen.missingUser}
          description={strings.ui.userDetailScreen.thisUserRecordCouldNotBeFoundHint}
        />
      );

    }

    return renderUserDetails(data);

  }

  return renderContent();

}
