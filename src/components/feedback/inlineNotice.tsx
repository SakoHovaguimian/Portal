import type { ComponentPropsWithoutRef } from 'react'

const ToneClassNames = {
  error: 'border-error/25 bg-error-muted text-error',
  success: 'border-success/25 bg-success-muted text-success',
} as const

type InlineNoticeTone = keyof typeof ToneClassNames

interface InlineNoticeProps extends ComponentPropsWithoutRef<'div'> {
  tone: InlineNoticeTone
}

export function InlineNotice({ className, role, tone, ...props }: InlineNoticeProps) {

  return (
    <div
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm ${ToneClassNames[tone]} ${className ?? ''}`}
      {...props}
    />
  )

}
