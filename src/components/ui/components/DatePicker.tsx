'use client';

import { useEffect, useRef } from 'react';
import { I18nProvider } from 'react-aria';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from 'react-aria-components';

import { calendarDate } from '../lib/calendarDate';
import { cn } from '../lib/cn';
import { motionDuration } from '../lib/motionPreferences';
import type { DatePickerProps } from '../models/datePickerProps';
import { portalUiStrings } from '@/strings';

import styles from './DatePicker.module.css';
import { UiIcon } from './UiIcon';

/** A date-only field with an app-owned, accent-colored calendar. */
export function DatePicker({
  label,
  value,
  onValueChange,
  name,
  id,
  min,
  max,
  locale = 'en-US',
  calendarLabels,
  required,
  readOnly,
  disabled,
  invalid,
  describedBy,
  className,
}: DatePickerProps) {

  const calendarTrigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => {

      const cleanup = () => {

        if (restoreFocus.current) { clearTimeout(restoreFocus.current); }

      };

      return cleanup;

    },
    [],
  );
  const copy =
    calendarLabels ??
    (locale.toLowerCase().startsWith('en')
      ? portalUiStrings.datePicker
      : undefined);
  return (
    <I18nProvider locale={locale}>
      <AriaDatePicker
        id={id}
        name={name}
        data-field-name={name}
        value={calendarDate(value)}
        minValue={calendarDate(min) ?? undefined}
        isRequired={required}
        isReadOnly={readOnly}
        maxValue={calendarDate(max) ?? undefined}
        onChange={(date) => onValueChange(date?.toString() ?? '')}
        onOpenChange={(open) => {

          if (restoreFocus.current) { clearTimeout(restoreFocus.current); }
          if (!open) {

            restoreFocus.current = setTimeout(() => {

              requestAnimationFrame(() => {

                const focused = document.activeElement;
                if (
                  focused === document.body ||
                  (focused && popup.current?.contains(focused))
                ) { calendarTrigger.current?.focus(); }

              });

            }, motionDuration('--motion-duration-fast'));

          }

        }}
        isDisabled={disabled}
        isInvalid={invalid}
        validationBehavior="aria"
        aria-describedby={describedBy}
        className={cn('grid min-w-0 gap-1.5', className)}
      >
        {({ state }) => (
          <>
            <Label className="text-sm font-medium text-secondary">
              {label}
            </Label>
            <Group
              data-invalid={invalid || undefined}
              data-disabled={disabled || undefined}
              className={cn(
                'ui-input shadow-(--shadow-control) flex min-h-(--control-height-lg) min-w-0 items-center gap-2 rounded-control border-control border-control-border bg-primary px-3 text-sm text-primary focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/12',
                styles.field,
              )}
            >
              <DateInput className="flex min-w-0 flex-1 items-center py-2.5">
                {(segment) => (
                  <DateSegment segment={segment} className={styles.segment} />
                )}
              </DateInput>
              <Button
                ref={calendarTrigger}
                aria-label={copy?.openCalendar(label)}
                className={styles.trigger}
              >
                <UiIcon name="calendar" />
              </Button>
            </Group>
            <Popover
              ref={popup}
              offset={6}
              className={cn(
                'ui-popover z-100 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-overlay border-control border-brand bg-primary p-3 shadow-(--shadow-overlay)',
                styles.popover,
              )}
            >
              <Dialog className="outline-none">
                <Calendar aria-label={label} className={styles.calendar}>
                  <header className="mb-3 flex items-center justify-between gap-2">
                    <Button
                      slot="previous"
                      aria-label={copy?.previousMonth}
                      className={styles.trigger}
                    >
                      <UiIcon name="chevronLeft" />
                    </Button>
                    <Heading className="m-0 text-sm font-semibold text-primary" />
                    <Button
                      slot="next"
                      aria-label={copy?.nextMonth}
                      className={styles.trigger}
                    >
                      <UiIcon name="chevronRight" />
                    </Button>
                  </header>
                  <CalendarGrid className={styles.grid}>
                    <CalendarGridHeader>
                      {(day) => (
                        <CalendarHeaderCell className="pb-2 text-xs font-medium text-tertiary">
                          {day}
                        </CalendarHeaderCell>
                      )}
                    </CalendarGridHeader>
                    <CalendarGridBody>
                      {(date) => (
                        <CalendarCell date={date} className={styles.day} />
                      )}
                    </CalendarGridBody>
                  </CalendarGrid>
                </Calendar>
                {copy && (
                  <div className="mt-3 flex justify-end border-t-control border-secondary pt-2">
                    <Button
                      className={styles.clear}
                      onPress={() => {

                        onValueChange('');
                        state.setOpen(false);

                      }}
                    >
                      {copy.clearDate}
                    </Button>
                  </div>
                )}
              </Dialog>
            </Popover>
          </>
        )}
      </AriaDatePicker>
    </I18nProvider>
  );

}
