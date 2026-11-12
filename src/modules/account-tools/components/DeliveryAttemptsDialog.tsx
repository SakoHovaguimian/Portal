import {
  Button,
  Card,
  DescriptionList,
  EmptyState,
  Modal,
  QueryBoundary,
} from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

import { AccountToolsLoading } from './AccountToolsLoading';
import { AccountToolsPagination } from './AccountToolsPagination';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';
import { formatAccountToolsDate } from '../formatAccountToolsDate';
import { useDeliveryAttempts } from '../hooks';
import type { DeliveryAttemptsDialogProps } from '../models/deliveryAttemptsDialogProps';
import type { NotificationDeliveryAttempt } from '../models/notificationDeliveryAttempt';

export function DeliveryAttemptsDialog({
  delivery,
  offset,
  onNavigate,
  onClose,
}: DeliveryAttemptsDialogProps) {

  const query = useDeliveryAttempts(delivery.id, { limit: 10, offset });

  function renderDeliverySummary() {

    return (
      <>
        <DeliveryStatusBadge status={delivery.status} />
        <DescriptionList
          items={[
            {
              label: copy.deliveries.notificationColumn,
              value: delivery.notificationId,
              fullWidth: true,
            },
            {
              label: copy.deliveries.acceptedLabel,
              value: formatAccountToolsDate(delivery.acceptedAt),
            },
            {
              label: copy.deliveries.nextAttemptLabel,
              value: formatAccountToolsDate(delivery.nextAttemptAt),
            },
            ...(delivery.error
              ? [
                {
                  label: copy.deliveries.errorLabel,
                  value: delivery.error,
                  fullWidth: true,
                },
              ]
              : []),
            ...(delivery.skipReason
              ? [
                {
                  label: copy.deliveries.skipReasonLabel,
                  value: delivery.skipReason,
                  fullWidth: true,
                },
              ]
              : []),
          ]}
        />
      </>
    );

  }

  function renderAttempt(attempt: NotificationDeliveryAttempt) {

    return (
      <Card key={attempt.id} className="grid gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="m-0 text-base font-semibold">
            {copy.deliveries.attemptLabel(attempt.attemptNumber)}
          </h3>
          <DeliveryStatusBadge status={attempt.outcome} />
        </div>
        <DescriptionList
          items={[
            {
              label: copy.deliveries.startedLabel,
              value: formatAccountToolsDate(attempt.startedAt),
            },
            {
              label: copy.deliveries.finishedLabel,
              value: formatAccountToolsDate(attempt.finishedAt),
            },
            {
              label: copy.deliveries.retryableLabel,
              value:
                attempt.retryable === null
                  ? copy.common.notRecorded
                  : attempt.retryable
                    ? copy.deliveries.yesStatus
                    : copy.deliveries.noStatus,
            },
            ...(attempt.error
              ? [
                {
                  label: copy.deliveries.errorLabel,
                  value: attempt.error,
                  fullWidth: true,
                },
              ]
              : []),
          ]}
        />
      </Card>
    );

  }

  function renderAttemptRows(result: NonNullable<typeof query.data>) {

    const attempts = result.data.map(renderAttempt);
    return <div className="grid gap-3">{attempts}</div>;

  }

  function renderNoAttempts() {

    return (
      <EmptyState
        title={copy.deliveries.noAttemptsTitle}
        description={copy.deliveries.noAttemptsHint}
      />
    );

  }

  function renderAttemptResults(result: NonNullable<typeof query.data>) {

    return (
      <>
        {result.data.length ? renderAttemptRows(result) : renderNoAttempts()}
        <AccountToolsPagination
          page={result.page}
          count={result.data.length}
          busy={query.isFetching}
          onNavigate={onNavigate}
        />
      </>
    );

  }

  function renderQueryResults() {

    return (
      <QueryBoundary query={query} loadingFallback={<AccountToolsLoading />}>
        {(result) => renderAttemptResults(result)}
      </QueryBoundary>
    );

  }

  function renderFooter() {

    return (
      <div className="flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          {copy.common.closeAction}
        </Button>
      </div>
    );

  }

  return (
    <Modal
      open
      title={copy.deliveries.attemptsTitle}
      description={copy.deliveries.attemptsDescription}
      onDismiss={onClose}
      footer={renderFooter()}
    >
      <div className="grid gap-5">
        {renderDeliverySummary()}
        {renderQueryResults()}
      </div>
    </Modal>
  );

}
