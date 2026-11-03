import type { Ref } from 'react';

export interface LocationDateTimeFieldProps {
  label: string;
  value: string;
  timezone: string;
  preferredInstant?: string;
  disabled: boolean;
  error?: string;
  describedBy?: string;
  inputRef: Ref<HTMLInputElement>;
  onChange: (value: string, instant?: string) => void;
}
