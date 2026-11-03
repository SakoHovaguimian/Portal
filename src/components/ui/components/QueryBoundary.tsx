'use client';

import type { LoadingMessageProps } from '../models/loadingMessageProps';
import type { QueryErrorStateProps } from '../models/queryErrorStateProps';
import type { QueryBoundaryProps } from '../models/queryBoundaryProps';
import { portalUiStrings, strings } from '@/strings';
import { DomainError } from '@/errors/domainErrors';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { Message } from './Message';

/**
 * Loading skeleton that matches the Card layout
 */
function LoadingState({
  message = strings.common.loading,
}: LoadingMessageProps) {

  return (
    <Card className="animate-pulse">
      <div className="grid gap-3">
        <div className="h-4 w-20 rounded bg-tertiary" />
        <div className="h-6 w-48 rounded bg-tertiary" />
        <div className="h-4 w-full rounded bg-tertiary" />
      </div>
      <span className="sr-only">{message}</span>
    </Card>
  );

}

/**
 * Error display with optional retry
 */
function QueryErrorState({
  error,
  onRetry,
  busy,
}: QueryErrorStateProps) {

  const message = getErrorMessage(error);

  return (
    <Card
      role="alert"
      className="grid gap-3 border-error_subtle bg-error-primary"
    >
      <span className="inline-flex w-fit items-center rounded-chip bg-error px-2.5 py-1 text-xs font-semibold tracking-[0.14em] text-on-error">
        {strings.ui.queryBoundary.error}
      </span>
      <h3 className="m-0 text-lg font-semibold text-primary">
        {strings.ui.queryBoundary.somethingWentWrong}
      </h3>
      <p className="m-0 text-sm text-secondary">{message}</p>
      {onRetry ? (
        <Button variant="secondary" loading={busy} onClick={onRetry}>
          {strings.ui.queryBoundary.tryAgain}
        </Button>
      ) : null}
    </Card>
  );

}

/**
 * Extract a user-friendly message from various error types
 */
function getErrorMessage(error: unknown): string {

  if (error instanceof Error) {

    // Check for domain error codes
    const anyError = error as { code?: string; status?: number };
    if (anyError.code === 'AUTH_ERROR' || anyError.status === 401) {
      return strings.ui.queryBoundary.youNeedToBeLoggedInToViewThis;
    }
    if (anyError.code === 'OWNERSHIP_ERROR' || anyError.status === 403) {

      return strings.ui.queryBoundary
        .youDoNotHavePermissionToAccessThisResource;

    }
    if (anyError.code === 'NOT_FOUND_ERROR' || anyError.status === 404) {
      return strings.ui.queryBoundary.theRequestedResourceCouldNotBeFound;
    }
    if (error instanceof DomainError && error.status < 500) { return error.message; }
    return strings.errors.requestFailed;

  }
  return strings.ui.queryBoundary.anUnexpectedErrorOccurred;

}

/**
 * QueryBoundary provides consistent loading, error, and success states
 * for React Query results.
 *
 * @example
 * ```tsx
 * const usersQuery = useUsers();
 *
 * <QueryBoundary query={usersQuery}>
 *   {(data) => <UsersList users={data.data} />}
 * </QueryBoundary>
 * ```
 *
 * @example With custom loading
 * ```tsx
 * <QueryBoundary
 *   query={dashboardQuery}
 *   loadingFallback={<DashboardSkeleton />}
 * >
 *   {(data) => <DashboardContent data={data} />}
 * </QueryBoundary>
 * ```
 */
export function QueryBoundary<T>({
  query,
  children,
  loadingFallback,
  loadingMessage,
  showError = true,
  inset = false,
  retainDataOnError = false,
}: QueryBoundaryProps<T>): ReactNode {

  if (query.isLoading) {
    return loadingFallback ?? <LoadingState message={loadingMessage} />;
  }

  const status =
    query.error instanceof DomainError
      ? query.error.status
      : (query.error as { status?: number } | null)?.status;
  const forbidden =
    [401, 403, 404].includes(status ?? 0) ||
    ['AUTH_ERROR', 'OWNERSHIP_ERROR', 'NOT_FOUND', 'NOT_FOUND_ERROR'].includes(
      (query.error as { code?: string } | null)?.code ?? '',
    );
  const retained = retainDataOnError && query.data !== undefined && !forbidden;
  if (query.isError && (showError || forbidden) && !retained) {

    const error = (
      <QueryErrorState
        error={query.error}
        busy={query.isFetching}
        onRetry={() => {

          if (!query.isFetching) { void query.refetch(); }

        }}
      />
    );
    return inset ? <div className="p-4 sm:p-6">{error}</div> : error;

  }

  if (query.data === undefined) {
    return null;
  }

  if (retainDataOnError) {

    // The same children slot remains mounted while the refresh notice changes.
    return (
      <>
        {retained && query.isError && showError ? (
          <div className={inset ? 'p-4 sm:p-6' : undefined}>
            <Message
              intent="warning"
              title={portalUiStrings.queryBoundary.refreshFailed}
              description={portalUiStrings.queryBoundary.refreshHint}
              action={
                <Button
                  variant="secondary"
                  loading={query.isFetching}
                  onClick={() => {

                    if (!query.isFetching) { void query.refetch(); }

                  }}
                >
                  {strings.ui.queryBoundary.tryAgain}
                </Button>
              }
            />
          </div>
        ) : null}
        {children(query.data)}
      </>
    );

  }
  return children(query.data);

}

/**
 * Inline loading indicator for use within existing layouts
 */
export function InlineLoading({
  message = strings.common.loading,
}: LoadingMessageProps) {

  return (
    <div className="flex items-center gap-2 text-secondary">
      <Spinner className="size-4" />
      <span className="text-sm">{message}</span>
    </div>
  );

}
