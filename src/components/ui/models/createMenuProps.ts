import type { ButtonVariant } from './buttonVariant';
import type { CreateMenuItem } from './createMenuItem';

export interface CreateMenuProps<Value extends string> {
  items: readonly CreateMenuItem<Value>[];
  onAction: (id: Value) => void;
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
}
