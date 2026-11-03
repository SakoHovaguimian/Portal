export interface QueryErrorStateProps {
  error: Error;
  onRetry?: () => void;
  busy?: boolean;
}
