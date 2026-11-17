import type { ComboboxOption } from './comboboxOption';

export interface ComboboxProps {
  label: string;
  options: readonly ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  name?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  loading?: boolean;
  /** Remote owners receive debounced, IME-safe queries. They own cancellation/stale results. */
  onSearchChange?: (query: string) => void;
  debounceMs?: number;
  onRetry?: () => void;
  className?: string;
}
