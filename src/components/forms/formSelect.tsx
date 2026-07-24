import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { fieldClassName } from './formField'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  containerClassName?: string
  error?: string
  hint?: string
  isLabelHidden?: boolean
}

export function FormSelect({ children, className, containerClassName, error, hint, isLabelHidden = false, label, ...selectProps }: FormSelectProps) {

  const selectId = selectProps.id ?? selectProps.name
  const descriptionId = selectId
    ? error
      ? `${selectId}-error`
      : hint
        ? `${selectId}-hint`
        : undefined
    : undefined

  return (
    <label className={`grid content-start gap-1.5 ${containerClassName ?? ''}`}>
      <span className={isLabelHidden ? 'sr-only' : 'text-sm font-medium text-primary'}>
        {label}
        {selectProps.required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
      </span>
      <span className="relative block">
        <select
          {...selectProps}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`${fieldClassName} appearance-none pr-10 ${error ? 'border-error' : ''} ${className ?? ''}`}
        >
          {children}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary" />
      </span>
      {error && <span id={selectId ? `${selectId}-error` : undefined} className="text-xs text-error">{error}</span>}
      {!error && hint && <span id={selectId ? `${selectId}-hint` : undefined} className="text-xs text-secondary">{hint}</span>}
    </label>
  )

}
