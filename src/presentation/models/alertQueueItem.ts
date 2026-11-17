import type { AlertPresentation } from './alertPresentation';

export type AlertQueueItem = Omit<AlertPresentation, 'kind'> & {
  kind: 'alert';
  id: string;
  resolve: (value: boolean) => void;
};
