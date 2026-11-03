import type { TimezoneNameProps } from '../models/timezoneNameProps';
import { Fragment } from 'react';

// Prefer IANA path boundaries to breaking timezone names in the middle of a word.
export function TimezoneName({ value }: TimezoneNameProps) {

  if (!value) { return null; }
  const parts = value.split(/(?<=\/)/);

  function renderTimezonePart(part: string, index: number) {

    return (
      <Fragment key={index}>
        {part}
        {index < parts.length - 1 && <wbr />}
      </Fragment>
    );

  }

  const timezoneParts = parts.map(renderTimezonePart);

  return (
    <span>
      {timezoneParts}
    </span>
  );

}
