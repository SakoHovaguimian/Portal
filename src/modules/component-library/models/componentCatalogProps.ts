import type { ComponentSpecimen } from './componentSpecimen';

export interface ComponentCatalogProps {
  items: readonly ComponentSpecimen[];
  onOpen: (id: string) => void;
  onReset: () => void;
}
