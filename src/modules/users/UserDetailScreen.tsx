'use client';

import {
  Avatar,
  Button,
  Card,
  DescriptionList,
  EmptyState,
  ErrorState,
  Page,
  PageHeader,
  Skeleton,
  UiIcon,
} from '@/components/ui';
import type { User } from '@/models';
import { useGuardedBack } from '@/providers/useGuardedBack';
import { strings } from '@/strings';

import { useUser } from './hooks';
import type { UserDetailScreenProps } from './models/userDetailScreenProps';

const copy = strings.ui.userDetailScreen;

export function UserDetailScreen({ userId }: UserDetailScreenProps) {

  const { data, isPending, isError, refetch } = useUser(userId);
  const back = useGuardedBack('/users');
  const user = isError ? undefined : data;
  const name = user ? `${user.firstName} ${user.lastName}` : copy.userDetail;

  function renderHeader() {

    return (
      <PageHeader
        title={name}
        icon={user && (
          <div aria-hidden="true">
            <Avatar name={name} size="lg" />
          </div>
        )}
      />
    );

  }

  function renderLoadingValue() {

    return (
      <span className="inline-block w-32 align-middle">
        <Skeleton />
      </span>
    );

  }

  function renderUserDetails(record?: User) {

    return (
      <Card className="grid max-w-3xl gap-5 shadow-none">
        <h2 className="m-0 text-lg font-semibold text-primary">{copy.userDetail}</h2>
        {isPending && <span role="status" className="sr-only">{copy.loadingUserProfile}</span>}
        <div aria-hidden={isPending || undefined} className="border-t-control border-secondary pt-4">
          <DescriptionList
            layout="rows"
            items={[
              { label: copy.email, value: record?.email ?? renderLoadingValue() },
              {
                label: copy.externalId,
                value: record ? <code className="font-mono text-xs">{record.externalId}</code> : renderLoadingValue(),
              },
              {
                label: copy.created,
                value: record ? <time dateTime={record.createdAt} className="tabular-nums">{new Date(record.createdAt).toLocaleString()}</time> : renderLoadingValue(),
              },
            ]}
          />
        </div>
      </Card>
    );

  }

  function renderContent() {

    if (isPending) { return renderUserDetails(); }
    if (isError) {

      return (
        <ErrorState
          title={copy.userUnavailable}
          description={copy.weCouldNotLoadThisUserProfileHint}
          onRetry={() => void refetch()}
        />
      );

    }
    if (!user) {

      return (
        <EmptyState
          title={copy.missingUser}
          description={copy.thisUserRecordCouldNotBeFoundHint}
        />
      );

    }
    return renderUserDetails(user);

  }

  return (
    <Page>
      <div>
        <Button variant="ghost" onClick={() => void back()}>
          <UiIcon name="chevronLeft" />
          {copy.backToUsers}
        </Button>
      </div>
      {renderHeader()}
      {renderContent()}
    </Page>
  );

}
