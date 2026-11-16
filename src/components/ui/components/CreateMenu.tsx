'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import { buttonClassName } from '../lib/buttonStyles';
import { cn } from '../lib/cn';
import type { CreateMenuItem } from '../models/createMenuItem';
import type { CreateMenuProps } from '../models/createMenuProps';
import { interactiveComponentStrings as strings } from '@/strings';

import { UiIcon } from './UiIcon';
import styles from './CreateMenu.module.css';

const copy = strings.create;

export function CreateMenu<Value extends string>({
  items,
  onAction,
  label = copy.label,
  open,
  defaultOpen = false,
  onOpenChange,
  variant = 'secondary',
  disabled,
  className,
  menuClassName,
}: CreateMenuProps<Value>) {

  const trigger = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const active = open ?? internal;
  const unavailable = disabled || !items.length;

  useEffect(() => {

    const element = trigger.current;
    if (!element) { return; }
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    const disconnect = () => observer.disconnect();
    return disconnect;

  }, []);

  function renderItem(item: CreateMenuItem<Value>, index: number) {

    return (
      <MenuItem
        key={item.id}
        id={item.id}
        isDisabled={item.disabled}
        onAction={() => onAction(item.id)}
        textValue={item.label}
        className={cn(styles.row, 'flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-primary outline-none data-focused:bg-secondary_hover data-focus-visible:ring-2 data-focus-visible:ring-inset data-focus-visible:ring-brand data-disabled:cursor-not-allowed data-disabled:text-disabled')}
        style={{ '--create-index': Math.min(index, 5) } as CSSProperties}
      >
        {item.icon && <UiIcon name={item.icon} className="size-4 text-tertiary" />}
        <span className="min-w-0 wrap-anywhere">{item.label}</span>
      </MenuItem>
    );

  }

  const rows = items.map(renderItem);

  return (
    <MenuTrigger
      isOpen={!unavailable && active}
      onOpenChange={(next) => {

        if (next) { setHeight(trigger.current?.offsetHeight ?? 0); }
        if (open === undefined) { setInternal(next); }
        onOpenChange?.(next);

      }}
    >
      <span
        className="contents"
        onPointerDownCapture={(event) => {

          // The menu covers the pill as it opens. Finish this press on the
          // trigger so its release cannot activate the first menu item.
          if (!unavailable && event.isPrimary && event.pointerType !== 'touch' && event.button === 0) {
            trigger.current?.setPointerCapture(event.pointerId);
          }

        }}
      >
        <Button
          ref={trigger}
          isDisabled={unavailable}
          className={buttonClassName(variant, cn(styles.trigger, className))}
          data-morphed={!unavailable && active || undefined}
        >
          <UiIcon name="plus" />
          <span>{label}</span>
        </Button>
      </span>
      <Popover
        placement="bottom start"
        offset={-height}
        style={height ? { '--create-height': `${height}px` } as CSSProperties : undefined}
        className={cn(styles.popover, 'z-100 rounded-overlay border-control border-secondary bg-primary p-1.5 shadow-(--shadow-overlay)', menuClassName)}
      >
        <Menu aria-label={label} className="max-h-[inherit] overflow-y-auto overscroll-contain rounded-control outline-none">
          {rows}
        </Menu>
      </Popover>
    </MenuTrigger>
  );

}
