import type { AddressRegion } from './addressRegion';

export interface AddressCountry {
  code: string;
  name: string;
  regions: AddressRegion[];
}
