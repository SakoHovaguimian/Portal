import { cn } from '../lib/cn';
import type { SelectionChipProps } from '../models/selectionChipProps';

import { Checkbox } from './Checkbox';
import { Chip } from './Chip';

export function SelectionChip({
  label,
  className,
  ...props
}: SelectionChipProps) {

  return (
    <Chip
      selected={props.checked === true}
      className={cn(
        'w-full p-0 has-[:disabled]:bg-disabled_subtle [&>.ui-token-value]:w-full',
        className,
      )}
    >
      <Checkbox {...props} label={label} className="w-full px-3 py-2" />
    </Chip>
  );

}
