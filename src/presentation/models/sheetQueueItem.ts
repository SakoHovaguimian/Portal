import type { SheetPresentation } from './sheetPresentation';

export type SheetQueueItem = Omit<SheetPresentation, 'kind'> & {
  kind: 'sheet';
  id: string;
  resolve: (value: boolean) => void;
};
