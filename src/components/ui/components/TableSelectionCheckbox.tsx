'use client';

import { Checkbox } from './Checkbox';

interface TableSelectionCheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

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
        if (node) node.indeterminate = indeterminate;
      }}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}
