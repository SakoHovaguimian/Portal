'use client';

import { useId } from 'react';
import { I18nProvider } from 'react-aria';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  Text,
  FieldError,
} from 'react-aria-components';
import { portalUiStrings } from '@/strings';
import type { DateRangePickerProps } from '../models/dateRangePickerProps';
import { calendarDate } from '../lib/calendarDate';
import { cn } from '../lib/cn';
import { UiIcon } from './UiIcon';
import styles from './DatePicker.module.css';

export function DateRangePicker({
  label,
  value,
  onValueChange,
  startName,
  endName,
  min,
  max,
  locale = 'en-US',
  calendarLabels,
  disabled,
  readOnly,
  required,
  error,
  description,
  className,
}: DateRangePickerProps) {
  const id = useId();
  const start = calendarDate(value?.start);
  const end = calendarDate(value?.end);
  const copy =
    calendarLabels ??
    (locale.toLowerCase().startsWith('en')
      ? portalUiStrings.datePicker
      : undefined);
  return (
    <I18nProvider locale={locale}>
      <AriaDateRangePicker
        value={start && end && start.compare(end) <= 0 ? { start, end } : null}
        onChange={(range) =>
          onValueChange(
            range
              ? { start: range.start.toString(), end: range.end.toString() }
              : null,
          )
        }
        startName={startName}
        endName={endName}
        minValue={calendarDate(min) ?? undefined}
        maxValue={calendarDate(max) ?? undefined}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isRequired={required}
        isInvalid={Boolean(error)}
        validationBehavior="aria"
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn('grid min-w-0 gap-1.5', className)}
      >
        {({ state }) => (
          <>
            <Label className="text-sm font-medium text-secondary">
              {label}
            </Label>
            <Group
              data-invalid={Boolean(error) || undefined}
              data-disabled={disabled || undefined}
              className={cn(
                'ui-input shadow-(--shadow-control) flex min-h-(--control-height-lg) min-w-0 flex-wrap items-center gap-x-2 rounded-control border-control border-control-border bg-primary px-3 text-sm text-primary focus-within:ring-4 focus-within:ring-brand/12',
                styles.field,
              )}
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2">
                <DateInput slot="start" className="flex items-center py-2.5">
                  {(segment) => (
                    <DateSegment segment={segment} className={styles.segment} />
                  )}
                </DateInput>
                <span aria-hidden="true" className="text-tertiary">
                  <UiIcon name="arrowRight" className="size-4" />
                </span>
                <DateInput slot="end" className="flex items-center py-2.5">
                  {(segment) => (
                    <DateSegment segment={segment} className={styles.segment} />
                  )}
                </DateInput>
              </div>
              <Button
                aria-label={copy?.openCalendar(label)}
                className={styles.trigger}
              >
                <UiIcon name="calendar" />
              </Button>
            </Group>
            {description && (
              <Text slot="description" className="text-xs text-tertiary">
                {description}
              </Text>
            )}
            <FieldError
              id={`${id}-error`}
              className="text-xs text-error-primary"
            >
              {error}
            </FieldError>
            <Popover
              offset={6}
              className={cn(
                'ui-popover z-100 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-overlay border-control border-brand bg-primary p-3 shadow-(--shadow-overlay)',
                styles.popover,
              )}
            >
              <Dialog className="outline-none">
                <RangeCalendar
                  aria-label={label}
                  className={cn(styles.calendar, styles.range)}
                >
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
                </RangeCalendar>
                {copy && !readOnly && (
                  <div className="mt-3 flex justify-end border-t-control border-secondary pt-2">
                    <Button
                      className={styles.clear}
                      onPress={() => {
                        onValueChange(null);
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
      </AriaDateRangePicker>
    </I18nProvider>
  );
}
