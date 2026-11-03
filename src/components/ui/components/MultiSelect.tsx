'use client';

import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from 'react-aria-components';
import type { MultiSelectProps } from '../models/multiSelectProps';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { UiIcon } from './UiIcon';

export function MultiSelect<Value extends string>({
  value,
  options,
  onValueChange,
  label,
  placeholder,
  selectionLabel,
  clearLabel,
  className,
  disabled,
  selectAllLabel,
  maxSelections,
  id,
  ref,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
}: MultiSelectProps<Value>) {
  const limit =
    maxSelections === undefined || !Number.isFinite(maxSelections)
      ? undefined
      : Math.max(0, Math.floor(maxSelections));
  return (
    <AriaSelect
      selectionMode="multiple"
      disabledKeys={
        limit !== undefined && value.length >= limit
          ? options
              .filter((option) => !value.includes(option.value))
              .map((option) => option.value)
          : []
      }
      value={value}
      onChange={(keys) => {
        const next = options
          .filter((option) => keys.includes(option.value))
          .map((option) => option.value);
        // Keep existing over-limit data removable while refusing new additions.
        if (
          limit !== undefined &&
          next.length > limit &&
          next.length >= value.length
        )
          return;
        onValueChange(next);
      }}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      isInvalid={invalid === true || invalid === 'true'}
      validationBehavior="aria"
      isDisabled={disabled}
      className={cn('ui-select min-w-0 w-full', className)}
    >
      <AriaButton
        id={id}
        ref={ref}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className="ui-select-trigger ui-input shadow-(--shadow-control) flex min-h-(--control-height-lg) w-full min-w-0 cursor-pointer items-center gap-3 rounded-control border-control border-control-border bg-primary px-4 py-2.5 text-left text-sm text-primary outline-none focus-visible:ring-4 focus-visible:ring-brand/12 disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled"
      >
        <SelectValue className="min-w-0 flex-1 wrap-anywhere">
          {() =>
            value.length === 0
              ? placeholder
              : value.length === 1
                ? options.find((option) => option.value === value[0])?.label
                : selectionLabel(
                    value.length,
                    value.map(
                      (selected) =>
                        options.find((option) => option.value === selected)
                          ?.label ?? selected,
                    ),
                  )
          }
        </SelectValue>
        <UiIcon
          name="chevronDown"
          className="ui-select-chevron size-4 text-tertiary"
        />
      </AriaButton>
      <Popover
        offset={6}
        className="ui-popover ui-select-popover z-100 flex w-(--trigger-width) max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-overlay border-control border-brand bg-primary p-1 shadow-(--shadow-overlay)"
      >
        <ListBox
          items={options}
          className="ui-select-list min-h-0 max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain outline-none"
        >
          {(option) => (
            <ListBoxItem
              id={option.value}
              textValue={option.label}
              className="ui-select-option flex min-h-(--control-height-md) cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-secondary outline-none data-focused:bg-secondary_subtle selected:bg-brand-primary selected:text-brand-secondary data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand data-disabled:cursor-not-allowed data-disabled:text-disabled"
            >
              {({ isSelected }) => (
                <>
                  <span className="min-w-0 flex-1 wrap-anywhere">
                    {option.label}
                  </span>
                  <UiIcon
                    name="check"
                    className={cn(
                      'ui-option-check size-4',
                      !isSelected && 'opacity-0',
                    )}
                  />
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
        <div className="mt-1 grid gap-1 border-t-control border-secondary p-1">
          {selectAllLabel && (
            <Button
              variant="ghost"
              className="w-full"
              disabled={
                !options.length ||
                value.length === options.length ||
                (limit !== undefined && options.length > limit)
              }
              onClick={() =>
                onValueChange(options.map((option) => option.value))
              }
            >
              {selectAllLabel}
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full"
            disabled={!value.length}
            onClick={() => onValueChange([])}
          >
            {clearLabel}
          </Button>
        </div>
      </Popover>
    </AriaSelect>
  );
}
