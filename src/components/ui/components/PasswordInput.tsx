'use client';
import { useState, type ComponentProps } from 'react';
import { Input } from './Input';
import { strings } from '@/strings';
export function PasswordInput(
  props: Omit<ComponentProps<typeof Input>, 'type'>,
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`pr-20 ${props.className || ''}`}
      />
      <button
        type="button"
        disabled={props.disabled}
        aria-pressed={visible}
        aria-label={
          visible ? strings.auth.hidePassword : strings.auth.showPassword
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary focus-visible:outline-2 focus-visible:outline-brand"
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? strings.auth.hidePassword : strings.auth.showPassword}
      </button>
    </div>
  );
}
