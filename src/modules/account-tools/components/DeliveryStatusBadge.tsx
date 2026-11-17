import { Badge } from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

import type { DeliveryStatusBadgeProps } from '../models/deliveryStatusBadgeProps';

export function DeliveryStatusBadge({
  status,
}: DeliveryStatusBadgeProps) {

  return (
    <Badge
      intent={
        status === 'ACCEPTED'
          ? 'success'
          : status === 'FAILED'
            ? 'danger'
            : status === 'UNKNOWN'
              ? 'warning'
              : status === 'PROCESSING'
                ? 'info'
                : 'neutral'
      }
    >
      {copy.deliveries.statuses[status]}
    </Badge>
  );

}
