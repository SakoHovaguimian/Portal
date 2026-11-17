'use client';

import { timezoneChoices } from '../lib/timezoneChoices';
import type { SelectProps } from '../models/selectProps';
import { strings } from '@/strings';

import { Select } from './Select';

export function TimezoneSelect({
  value,
  ...props
}: Omit<SelectProps, 'children'>) {

  const emptyCode = '';
  const selected = String(value ?? emptyCode);

  function renderTimezoneOption(item: (typeof timezoneChoices)[number]) {

    return (
      <option key={item.code} value={item.code}>
        {item.label}
      </option>
    );

  }

  const timezoneOptions = timezoneChoices.map(renderTimezoneOption);

  return (
    <Select {...props} value={selected}>
      <option value={emptyCode}>{strings.address.chooseTimezone}</option>
      {selected && !timezoneChoices.some((item) => item.code === selected) && (
        <option value={selected} disabled>
          {strings.address.savedTimezone(selected)}
        </option>
      )}
      {timezoneOptions}
    </Select>
  );

}
