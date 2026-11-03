'use client';

import type { DropZoneProps } from '../models/dropZoneProps';
import { useState } from 'react';
import { cn } from '../lib/cn';

export function DropZone({ children, disabled, onFiles }: DropZoneProps) {

  const [dragging, setDragging] = useState(false);
  return (
    <div
      data-dragging={dragging || undefined}
      onDragOver={(event) => {

        event.preventDefault();
        if (!disabled) { setDragging(true); }

      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {

        event.preventDefault();
        setDragging(false);
        if (!disabled) { onFiles(event.dataTransfer.files); }

      }}
      className={cn(
        'ui-drop-zone flex min-h-32 flex-wrap items-center gap-4 rounded-card border-control border-dashed p-4 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand',
        dragging
          ? 'border-brand bg-brand-primary'
          : 'border-secondary bg-secondary_subtle',
      )}
    >
      {children}
    </div>
  );

}
