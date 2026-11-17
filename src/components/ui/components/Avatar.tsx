'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '../lib/cn';
import type { AvatarProps } from '../models/avatarProps';
import { componentExpansionStrings as copy } from '@/strings';

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
};
const statuses = {
  online: 'bg-success-solid',
  offline: 'bg-quaternary',
  busy: 'bg-error-solid',
};

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  className,
}: AvatarProps) {

  const [failed, setFailed] = useState<string>();
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  const initials = [parts[0], ...(parts.length > 1 ? [parts.at(-1)] : [])]
    .map((part) => Array.from(part ?? '')[0] ?? '')
    .join('')
    .toLocaleUpperCase('en-US');
  return (
    <span
      role="img"
      aria-label={
        status
          ? copy.avatar.withStatus(name, copy.avatar.statuses[status])
          : name || copy.avatar.unknown
      }
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-avatar bg-brand-secondary font-semibold text-brand-secondary',
        sizes[size],
        className,
      )}
    >
      <span aria-hidden="true">
        {initials || (
          <span className="text-tertiary">{copy.avatar.fallback}</span>
        )}
      </span>
      {src && src !== failed && (
        <Image
          unoptimized
          fill
          sizes="64px"
          src={src}
          alt={copy.avatar.decorativeAlt}
          className="rounded-[inherit] object-cover"
          onError={() => setFailed(src)}
        />
      )}
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute -inset-e-0.5 -bottom-0.5 size-3 rounded-full border-2 border-primary',
            statuses[status],
          )}
        />
      )}
    </span>
  );

}
