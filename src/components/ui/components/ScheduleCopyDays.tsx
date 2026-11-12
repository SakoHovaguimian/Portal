'use client';

import { useId, useRef, useState } from 'react';

import type { ScheduleCopyDaysProps } from '../models/scheduleCopyDaysProps';
import { strings } from '@/strings';

import { Button } from './Button';
import { Checkbox } from './Checkbox';

export function ScheduleCopyDays({
  source,
  days,
  disabled,
  canApply,
  onApply,
}: ScheduleCopyDaysProps) {

  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [targets, setTargets] = useState<number[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const copy = strings.schedule;
  const allowed = canApply(targets);

  function renderCopyFields() {

    if (!expanded) {
      return null;
    }

    function renderTargetDay(day: string, weekday: number) {

      return (weekday === source ? null : (
        <Checkbox
          key={weekday}
          label={day}
          checked={targets.includes(weekday)}
          onChange={(event) => {

            setTargets(
              event.target.checked
                ? [...targets, weekday].sort((a, b) => a - b)
                : targets.filter((value) => value !== weekday),
            );

          }}
        />
      ));

    }

    const targetDays = days.map(renderTargetDay);

    return (
      <fieldset
        id={id}
        disabled={disabled}
        className="grid min-w-0 gap-3 border-t-control border-secondary pt-3"
      >
        <legend className="text-sm font-semibold text-primary">
          {copy.copyFromDay(days[source])}
        </legend>
        <p className="m-0 text-xs text-secondary">{copy.copyHoursHint}</p>
        <div className="grid gap-x-6 sm:grid-cols-2">
          {targetDays}
        </div>
        {!allowed && (
          <p className="m-0 text-sm text-error-primary">{copy.hoursLimit}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={!targets.length || !allowed}
            onClick={() => {

              onApply(targets);
              setAnnouncement(
                copy.hoursCopied(
                  days[source],
                  targets.map((day) => days[day]),
                ),
              );
              setTargets([]);
              setExpanded(false);
              trigger.current?.focus();

            }}
          >
            {copy.applyHours(targets.length)}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {

              setExpanded(false);
              trigger.current?.focus();

            }}
          >
            {strings.ui.alertModal.cancel}
          </Button>
        </div>
      </fieldset>
    );

  }

  return (
    <div className="grid min-w-0 gap-3">
      <div>
        <Button
          ref={trigger}
          variant="ghost"
          disabled={disabled}
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
          className="px-0 hover:bg-transparent"
        >
          {copy.copyHours}
        </Button>
      </div>
      {renderCopyFields()}
      <p role="status" className="m-0 text-xs text-secondary">
        {announcement}
      </p>
    </div>
  );

}
