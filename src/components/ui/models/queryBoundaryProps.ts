import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export interface QueryBoundaryProps<T> {
  /** The React Query result object */
  query: UseQueryResult<T, Error>;
  /** Render function called with the data when query succeeds */
  children: (data: T) => ReactNode;
  /** Optional custom loading component */
  loadingFallback?: ReactNode;
  /** Optional loading message for accessibility */
  loadingMessage?: string;
  /** Whether to show error state (defaults to true) */
  showError?: boolean;
  /** Pads the error state when rendered inside a DataPanel or other surface */
  inset?: boolean;
  /** Retain mounted content after a non-authoritative background refresh failure. */
  retainDataOnError?: boolean;
}
