'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useFilter } from 'react-aria';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from 'react-aria-components';
import { componentExpansionStrings as copy } from '@/strings';
import type { ComboboxOption } from '../models/comboboxOption';
import type { ComboboxProps } from '../models/comboboxProps';
import { cn } from '../lib/cn';
import { UiIcon } from './UiIcon';
import { Spinner } from './Spinner';
import { Button } from './Button';

export function Combobox({
  label,
  options,
  value,
  onValueChange,
  name,
  placeholder,
  description,
  error,
  disabled,
  readOnly,
  required,
  loading,
  onSearchChange,
  debounceMs = 300,
  onRetry,
  className,
}: ComboboxProps) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const composing = useRef(false);
  const [text, setText] = useState(
    options.find((option) => option.id === value)?.label ?? '',
  );
  const [previous, setPrevious] = useState(value);
  const id = useId();
  if (previous !== value) {
    setPrevious(value);
    setText(options.find((option) => option.id === value)?.label ?? '');
  }
  useEffect(() => () => clearTimeout(timer.current), []);
  const search = (query: string, immediate = false) => {
    clearTimeout(timer.current);
    if (!onSearchChange || composing.current) return;
    if (immediate || !query) onSearchChange(query);
    else
      timer.current = setTimeout(
        () => onSearchChange(query),
        Math.max(0, debounceMs),
      );
  };
  const items = onSearchChange
    ? options
    : options.filter(
        (option) =>
          contains(option.label, text) ||
          (value === option.id && text === option.label),
      );
  return (
    <AriaComboBox
      name={name}
      selectedKey={value}
      inputValue={text}
      items={items}
      onSelectionChange={(key) => {
        clearTimeout(timer.current);
        onValueChange(key === null ? null : String(key));
      }}
      onInputChange={(next) => {
        setText(next);
        search(next);
      }}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isRequired={required}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      disabledKeys={options
        .filter((option) => option.disabled)
        .map((option) => option.id)}
      allowsEmptyCollection
      className={cn('grid min-w-0 gap-1.5', className)}
    >
      <Label className="text-sm font-medium text-secondary">{label}</Label>
      <div className="ui-input shadow-(--shadow-control) flex min-h-(--control-height-lg) min-w-0 items-center gap-1 rounded-control border-control border-control-border bg-primary px-3 focus-within:ring-4 focus-within:ring-brand/12 has-[:disabled]:bg-disabled_subtle has-aria-invalid:border-error">
        <Input
          ref={input}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-primary outline-none disabled:text-disabled"
          onCompositionStart={() => {
            composing.current = true;
            clearTimeout(timer.current);
          }}
          onCompositionEnd={(event) => {
            composing.current = false;
            search(event.currentTarget.value);
          }}
        />
        {loading && <Spinner />}
        {text && !readOnly && (
          <AriaButton
            slot={null}
            isDisabled={disabled}
            aria-label={copy.combobox.clear(label)}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control text-tertiary outline-none hover:bg-secondary_subtle focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed"
            onPress={() => {
              clearTimeout(timer.current);
              setText('');
              onValueChange(null);
              search('', true);
              input.current?.focus();
            }}
          >
            <UiIcon name="close" className="size-4" />
          </AriaButton>
        )}
        <AriaButton
          isDisabled={disabled || readOnly}
          aria-label={copy.combobox.open(label)}
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control text-tertiary outline-none hover:bg-secondary_subtle focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed"
        >
          <UiIcon name="chevronDown" className="size-4" />
        </AriaButton>
      </div>
      {description && (
        <Text slot="description" className="text-xs text-tertiary">
          {description}
        </Text>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="m-0 text-xs text-error-primary"
        >
          {error}
        </p>
      )}
      <Popover
        offset={6}
        className="ui-popover z-100 w-(--trigger-width) max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-overlay border-control border-control-border bg-primary p-1 shadow-(--shadow-overlay)"
      >
        <ListBox<ComboboxOption>
          className="max-h-[min(22rem,60dvh)] overflow-y-auto outline-none"
          renderEmptyState={() => (
            <p className="m-0 px-3 py-4 text-sm text-tertiary">
              {loading
                ? copy.combobox.loading
                : error
                  ? copy.combobox.unavailable
                  : copy.combobox.empty}
            </p>
          )}
        >
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-secondary outline-none data-focused:bg-secondary_subtle selected:bg-brand-primary selected:text-brand-secondary data-disabled:cursor-not-allowed data-disabled:text-disabled data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand"
            >
              {({ isSelected }) => (
                <>
                  <div className="min-w-0 flex-1">
                    <Text slot="label" className="block wrap-anywhere">
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text
                        slot="description"
                        className="mt-0.5 block text-xs wrap-anywhere text-tertiary"
                      >
                        {option.description}
                      </Text>
                    )}
                  </div>
                  {isSelected && <UiIcon name="check" className="size-4" />}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
        {error && onRetry && (
          <Button variant="ghost" className="mt-1 w-full" onClick={onRetry}>
            {copy.combobox.retry}
          </Button>
        )}
      </Popover>
    </AriaComboBox>
  );
}
