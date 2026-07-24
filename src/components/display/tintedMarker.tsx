import type { ComponentPropsWithoutRef } from 'react'

const SizeClassNames = {
  7: 'size-7',
  8: 'size-8',
  9: 'size-9',
  10: 'size-10',
  11: 'size-11',
  12: 'size-12',
  14: 'size-14',
  16: 'size-16',
} as const

const ShapeClassNames = {
  rounded: 'rounded-md',
  circle: 'rounded-full',
} as const

const ToneClassNames = {
  accent: 'bg-accent-muted text-accent',
  error: 'bg-error-muted text-error',
  success: 'bg-success-muted text-success',
  teal: 'bg-teal-subtle text-teal-vivid',
  purple: 'bg-purple-subtle text-purple-vivid',
  neutral: 'bg-muted text-secondary',
} as const

type TintedMarkerSize = keyof typeof SizeClassNames
type TintedMarkerShape = keyof typeof ShapeClassNames
type TintedMarkerTone = keyof typeof ToneClassNames

interface TintedMarkerProps extends ComponentPropsWithoutRef<'span'> {
  size: TintedMarkerSize
  shape?: TintedMarkerShape
  tone?: TintedMarkerTone
}

export function TintedMarker({ children, className, shape = 'rounded', size, tone = 'accent', ...props }: TintedMarkerProps) {

  return (
    <span
      className={`grid shrink-0 place-items-center ${SizeClassNames[size]} ${ShapeClassNames[shape]} ${ToneClassNames[tone]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  )

}
