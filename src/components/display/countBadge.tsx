import type { HTMLAttributes } from 'react'

interface CountBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number
  maximum?: number
  variant?: 'muted' | 'solid'
}

export function CountBadge({ count, className, maximum = 99, variant = 'muted', ...spanProps }: CountBadgeProps) {

  const label = count > maximum ? `${maximum}+` : String(count)
  const variantClassName = variant === 'solid'
    ? 'grid min-w-4 place-items-center bg-accent px-1 text-[10px] leading-4 text-on-accent'
    : 'inline-flex min-w-5 justify-center bg-accent-muted px-2 py-0.5 text-xs text-accent'

  return <span {...spanProps} className={`rounded-full font-semibold ${variantClassName} ${className ?? ''}`}>{label}</span>

}
