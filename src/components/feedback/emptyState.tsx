import Image from 'next/image'
import { Button } from '@astryxdesign/core/Button'
import { EmptyStateIllustrationPaths, type EmptyStateIllustration } from './models/emptyStateIllustration'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  illustration?: EmptyStateIllustration
}

export function EmptyState({ title, description, actionLabel, actionHref, illustration = 'activity' }: EmptyStateProps) {

  return (
    <div className="grid min-h-[360px] place-items-center overflow-hidden rounded-[24px] border border-border bg-card px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10">
      <div className="w-full max-w-lg">
        <div className="relative mx-auto h-40 w-full max-w-[320px] sm:h-44">
          <Image src={EmptyStateIllustrationPaths[illustration]} alt="" fill sizes="(min-width: 640px) 320px, 80vw" className="object-contain" />
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-primary">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary">{description}</p>
        {actionLabel && actionHref && <Button href={actionHref} label={actionLabel} variant="secondary" className="mt-6 border-accent/50 text-accent" />}
      </div>
    </div>
  )

}
