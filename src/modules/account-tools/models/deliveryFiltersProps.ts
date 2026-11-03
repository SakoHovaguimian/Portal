import type { DeliveryFilterValues } from './deliveryFilterValues';

export type { DeliveryFilterValues } from './deliveryFilterValues';

export interface DeliveryFiltersProps {
  values: DeliveryFilterValues;
  onChange: (values: Record<string, string | undefined>) => void;
}
