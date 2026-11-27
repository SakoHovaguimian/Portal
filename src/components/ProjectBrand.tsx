import Image from 'next/image';

import { UiIcon } from '@/components/ui/components/UiIcon';
import { cn } from '@/components/ui/lib/cn';
import { projectConfiguration } from '@/config/projectConfiguration';
import { strings } from '@/strings';

import type { ProjectBrandProps } from './models/projectBrandProps';

export function ProjectBrand({ className, showMark = false }: ProjectBrandProps) {

  if (projectConfiguration.branding.logoPath) {

    return (
      <Image
        src={projectConfiguration.branding.logoPath}
        alt={strings.app.name}
        width={160}
        height={40}
        unoptimized
        className={cn('h-10 w-auto max-w-40 object-contain', className)}
      />
    );

  }
  if (showMark) {

    return (
      <span className={cn('inline-flex min-w-0 items-center gap-3', className)}>
        <span className="grid size-9 shrink-0 place-items-center rounded-control bg-brand-solid text-text-primary_on-brand">
          <UiIcon name="layers" className="size-5" />
        </span>
        <span className="min-w-0 wrap-anywhere">{strings.app.name}</span>
      </span>
    );

  }
  return <span className={className}>{strings.app.name}</span>;

}
