'use client';

import { useContext, useId, useState } from 'react';
import { ColorPickerStateContext, parseColor } from 'react-aria-components';

import type { ColorPickerValueFieldProps } from '../models/colorPickerValueFieldProps';
import { portalUiStrings } from '@/strings';

import { Button } from './Button';
import { Input } from './Input';

// Keep incomplete hex entry local. Only a complete color reaches the picker/form.
export function ColorPickerValueField({
  value,
  onDone,
}: ColorPickerValueFieldProps) {

  const picker = useContext(ColorPickerStateContext);
  const id = useId();
  const [previous, setPrevious] = useState(value);
  const [draft, setDraft] = useState(value);
  const [blurred, setBlurred] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');
  const [copyFailed, setCopyFailed] = useState(false);
  if (previous !== value) {

    setPrevious(value);
    setDraft(value);
    setBlurred(false);
    setCopyFailed(false);

  }
  const valid = /^#?[0-9a-fA-F]{6}$/.test(draft.trim());
  const hex = '#' + draft.trim().replace(/^#/, '').toUpperCase();
  const invalid = blurred && !valid;
  const copy = portalUiStrings.colorInput;

  async function copyHex() {

    if (!valid) { return; }
    try {

      await navigator.clipboard.writeText(hex);
      setCopiedValue(hex);
      setCopyFailed(false);

    } catch {
      setCopyFailed(true);
    }

  }

  return (
    <div className="grid min-w-0 gap-3">
      <label htmlFor={id} className="text-sm font-medium text-secondary">
        {copy.hex}
      </label>
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1">
          <Input
            id={id}
            value={draft}
            className="font-mono"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid}
            aria-describedby={`${id}-help`}
            onBlur={() => setBlurred(true)}
            onChange={(event) => {

              const next = event.target.value;
              setDraft(next);
              setCopyFailed(false);
              if (/^#?[0-9a-fA-F]{6}$/.test(next.trim())) {

                picker?.setColor(
                  parseColor('#' + next.trim().replace(/^#/, '')),
                );

              }

            }}
            onKeyDown={(event) => {

              if (event.key !== 'Enter') { return; }
              if (event.nativeEvent.isComposing) { return; }
              event.preventDefault();
              setBlurred(true);
              if (valid) { onDone(); }

            }}
          />
        </div>
        <Button
          variant="secondary"
          disabled={!valid}
          onClick={() => void copyHex()}
        >
          {copy.copy}
        </Button>
      </div>
      <p
        id={`${id}-help`}
        className={
          invalid
            ? 'm-0 text-xs text-error-primary'
            : 'm-0 text-xs text-tertiary'
        }
      >
        {invalid ? copy.invalidHex : copy.hexHint}
      </p>
      <div role="status" className="text-xs text-secondary empty:hidden">
        {copyFailed
          ? copy.copyFailed
          : copiedValue === hex && valid
            ? copy.copied
            : null}
      </div>
      <Button variant="secondary" disabled={!valid} onClick={onDone}>
        {copy.done}
      </Button>
    </div>
  );

}
