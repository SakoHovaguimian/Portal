import type { AssigneePickerOption } from './assigneePickerOption';

export interface AssigneePickerProps<Value extends string> {
  options: readonly AssigneePickerOption<Value>[];
  label: string;
  placeholder?: string;
  value?: readonly Value[];
  defaultValue?: readonly Value[];
  onValueChange?: (value: Value[]) => void;
  defaultOpen?: boolean;
  stack?: 'row' | 'grid';
  overlap?: number;
  maxVisible?: number;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
}
