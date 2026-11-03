'use client';

import type { TableSelectionCheckboxProps } from '../models/tableSelectionCheckboxProps';
import { Checkbox } from './Checkbox';

export function TableSelectionCheckbox({
  label,
  checked,
  indeterminate = false,
  disabled,
  onChange,
}: TableSelectionCheckboxProps) {

  return (
    <Checkbox
      label={<span className="sr-only">{label}</span>}
      checked={checked}
      disabled={disabled}
      ref={(node) => {

        if (node) { node.indeterminate = indeterminate; }

      }}
      onChange={(event) => onChange(event.target.checked)}
    />
  );

}
