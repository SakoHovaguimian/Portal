'use client';

import { useState } from 'react';

import type { MoneyInputProps } from '../models/moneyInputProps';

import { Input } from './Input';

export function MoneyInput({
  value,
  onValueChange,
  currencyCode,
  ...props
}: MoneyInputProps) {

  const [focused, setFocused] = useState(false);
  const amount = value.trim() ? Number(value) : NaN;
  const formatted =
    Number.isFinite(amount) &&
    amount >= 0 &&
    Number(amount.toFixed(2)) === amount
      ? new Intl.NumberFormat('en-US', {
        ...(currencyCode
          ? { style: 'currency', currency: currencyCode }
          : {}),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
      : value;
  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={focused ? value : formatted}
      onFocus={(event) => {

        setFocused(true);
        props.onFocus?.(event);

      }}
      onBlur={(event) => {

        setFocused(false);
        props.onBlur?.(event);

      }}
      onChange={(event) => onValueChange(event.target.value)}
    />
  );

}
