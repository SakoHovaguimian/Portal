'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Button as AriaButton, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';

import { buttonClassName } from '../lib/buttonStyles';
import { cn } from '../lib/cn';
import type { AssigneePickerOption } from '../models/assigneePickerOption';
import type { AssigneePickerProps } from '../models/assigneePickerProps';
import { componentExpansionStrings, interactiveComponentStrings as strings } from '@/strings';

import { Avatar } from './Avatar';
import { UiIcon } from './UiIcon';
import styles from './AssigneePicker.module.css';

const copy = strings.assignees;

export function AssigneePicker<Value extends string>({
  options,
  label,
  placeholder = copy.placeholder,
  value,
  defaultValue = [],
  onValueChange,
  defaultOpen = false,
  stack = 'row',
  overlap = 10,
  maxVisible = 4,
  maxSelections,
  disabled,
  className,
  popoverClassName,
}: AssigneePickerProps<Value>) {

  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;
  const selectedPeople = options.filter((option) => selected.includes(option.id));
  const selectedIds = selectedPeople.map((option) => option.id);
  const atLimit = maxSelections !== undefined && Number.isFinite(maxSelections) && selectedIds.length >= Math.max(0, Math.floor(maxSelections));
  const disabledKeys = options
    .filter((option) => option.disabled || (atLimit && !selectedIds.includes(option.id)))
    .map((option) => option.id);
  const cap = Number.isFinite(maxVisible) ? Math.max(1, Math.floor(maxVisible)) : 4;
  const visible = selectedPeople.slice(0, stack === 'grid' ? Math.min(cap, 4) : cap);
  const remaining = selectedPeople.length - visible.length;

  function renderStack() {

    if (!visible.length) { return placeholder; }
    const faces = visible.map((person, index) => (
      <span key={person.id} className={styles.face} style={{ zIndex: visible.length - index }}>
        <Avatar name={person.name} src={person.src} size="sm" />
      </span>
    ));
    const names = selectedPeople.map((person) => person.name);
    const overlapAmount = Number.isFinite(overlap) ? Math.min(22, Math.max(0, overlap)) : 10;

    return (
      <>
        <span className="sr-only">{copy.selection(names)}</span>
        <span
          aria-hidden="true"
          className={styles.stack}
          data-layout={stack}
          data-count={visible.length}
          style={{ '--assignee-overlap': `${overlapAmount}px` } as CSSProperties}
        >
          {faces}
        </span>
        {remaining > 0 && (
          <span aria-hidden="true" className="shrink-0 text-xs font-semibold text-tertiary">
            {componentExpansionStrings.avatar.overflow(remaining)}
          </span>
        )}
      </>
    );

  }

  function renderOption(person: AssigneePickerOption<Value>) {

    return (
      <ListBoxItem
        id={person.id}
        textValue={person.name}
        className="ui-select-option flex min-h-(--control-height-md) cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-secondary outline-none data-focused:bg-secondary_subtle selected:bg-brand-primary selected:text-brand-secondary data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand data-disabled:cursor-not-allowed data-disabled:text-disabled"
      >
        {({ isSelected }) => (
          <>
            <span aria-hidden="true"><Avatar {...person} size="sm" /></span>
            <span className="grid min-w-0 flex-1 wrap-anywhere">
              <span className="font-medium">{person.name}</span>
              {person.description && <span className="text-xs text-tertiary">{person.description}</span>}
            </span>
            {isSelected && <UiIcon name="check" className="size-4" />}
          </>
        )}
      </ListBoxItem>
    );

  }

  return (
    <Select
      aria-label={label}
      selectionMode="multiple"
      value={selectedIds}
      disabledKeys={disabledKeys}
      isDisabled={disabled || !options.length}
      defaultOpen={defaultOpen && !disabled && options.length > 0}
      className={cn('ui-select min-w-0 max-w-full', className)}
      onChange={(keys) => {

        const next = options.filter((option) => keys.includes(option.id)).map((option) => option.id);
        if (atLimit && next.length > selectedIds.length) { return; }
        if (value === undefined) { setInternal(next); }
        onValueChange?.(next);

      }}
    >
      <AriaButton className={buttonClassName('secondary', cn('ui-select-trigger max-w-full', styles.trigger))}>
        <SelectValue className="flex min-w-0 flex-wrap items-center gap-2">{renderStack}</SelectValue>
        <UiIcon name="chevronDown" className="ui-select-chevron size-4 text-tertiary" />
      </AriaButton>
      <Popover
        placement="bottom start"
        offset={6}
        className={cn('ui-popover ui-select-popover z-100 w-68 min-w-(--trigger-width) max-w-[calc(100vw-1.5rem)] rounded-overlay border-control border-secondary bg-primary p-1 shadow-(--shadow-overlay)', popoverClassName)}
      >
        <ListBox items={options} className="ui-select-list max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain outline-none">
          {renderOption}
        </ListBox>
      </Popover>
    </Select>
  );

}
