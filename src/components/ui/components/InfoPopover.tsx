'use client';

import { Button as AriaButton, Dialog, DialogTrigger, Popover } from 'react-aria-components';

import { buttonClassName } from '../lib/buttonStyles';
import type { InfoPopoverProps } from '../models/infoPopoverProps';

export function InfoPopover({
  label,
  children,
}: InfoPopoverProps) {

  return (
    <DialogTrigger>
      <AriaButton className={buttonClassName('secondary')}>{label}</AriaButton>
      <Popover
        offset={8}
        className="ui-popover z-100 max-w-[min(90vw,22rem)] rounded-overlay border-control border-secondary bg-primary p-4 shadow-(--shadow-overlay)"
      >
        <Dialog
          aria-label={label}
          className="text-sm text-secondary outline-none"
        >
          {children}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );

}
