import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  isLabelHidden?: boolean
}

const fieldClassName = 'focus-ring h-11 w-full rounded-[var(--radius-element)] border border-border bg-surface px-3.5 text-[0.9375rem] text-primary shadow-sm outline-none transition placeholder:text-placeholder hover:border-strong disabled:cursor-not-allowed disabled:bg-muted disabled:text-disabled'

export function FormField({ label, error, hint, id, className, ...inputProps }: FormFieldProps) {

  const inputId = id ?? inputProps.name
  const descriptionId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-primary">
        {label}
        {inputProps.required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`${fieldClassName} ${error ? 'border-error' : ''} ${className ?? ''}`}
      />
      {error && <p id={`${inputId}-error`} className="text-xs text-error">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-secondary">{hint}</p>}
    </div>
  )

}

export function FormTextArea({ label, error, hint, id, isLabelHidden = false, className, ...textAreaProps }: FormTextAreaProps) {

  const inputId = id ?? textAreaProps.name
  const descriptionId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={inputId} className={isLabelHidden ? 'sr-only' : 'text-sm font-medium text-primary'}>
        {label}
        {textAreaProps.required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
      </label>
      <textarea
        {...textAreaProps}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`focus-ring min-h-28 w-full resize-y rounded-[var(--radius-element)] border border-border bg-surface px-3.5 py-3 text-[0.9375rem] text-primary shadow-sm outline-none transition placeholder:text-placeholder hover:border-strong ${error ? 'border-error' : ''} ${className ?? ''}`}
      />
      {error && <p id={`${inputId}-error`} className="text-xs text-error">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-secondary">{hint}</p>}
    </div>
  )

}

export { fieldClassName }
