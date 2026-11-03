import Image from 'next/image';
import { projectConfiguration } from '@/config/projectConfiguration';
import { strings } from '@/strings';
import { cn } from '@/components/ui/lib/cn';
import type { ProjectBrandProps } from './models/projectBrandProps';

export function ProjectBrand({ className }: ProjectBrandProps) {

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
  return <span className={className}>{strings.app.name}</span>;

}
