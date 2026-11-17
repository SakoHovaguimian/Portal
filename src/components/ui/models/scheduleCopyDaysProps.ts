export interface ScheduleCopyDaysProps {
  source: number;
  days: readonly string[];
  disabled: boolean;
  canApply: (targets: number[]) => boolean;
  onApply: (targets: number[]) => void;
}
