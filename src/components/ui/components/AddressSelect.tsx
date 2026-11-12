'use client';

import { addressRegions } from '../lib/addressChoices';
import type { AddressSelectProps } from '../models/addressSelectProps';
import { addressCountries, strings } from '@/strings';

import { Select } from './Select';

export function AddressSelect({
  kind,
  country = '',
  value,
  ...props
}: AddressSelectProps) {

  const copy = strings.address;
  const emptyCode = '';
  const choices =
    kind === 'country' ? addressCountries : addressRegions(country);
  // Existing names/codes remain selectable without rewriting saved addresses.
  const saved = String(value ?? '');
  const matched = choices.find(
    (item) => item.code === saved || item.name === saved,
  );

  function renderAddressOption(item: (typeof choices)[number]) {

    return (
      <option key={item.code} value={matched === item ? saved : item.code}>
        {kind === 'country'
          ? copy.countryOption(item.name, item.code)
          : item.name}
      </option>
    );

  }

  const addressOptions = choices.map(renderAddressOption);

  return (
    <Select
      {...props}
      value={saved}
      autoComplete={kind === 'country' ? 'country' : 'address-level1'}
    >
      <option value={emptyCode}>
        {kind === 'country'
          ? copy.chooseCountry
          : country && !choices.length
            ? copy.noRegions
            : copy.chooseRegion}
      </option>
      {saved && !matched && <option value={saved}>{saved}</option>}
      {addressOptions}
    </Select>
  );

}
