import { Search } from 'lucide-react'
import { fieldClassName } from './formField'

interface SearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLabelHidden?: boolean
  className?: string
}

export function SearchField({ label, value, onChange, placeholder, isLabelHidden = false, className }: SearchFieldProps) {

  return (
    <label className={`grid min-w-0 gap-1.5 ${className ?? ''}`}>
      <span className={isLabelHidden ? 'sr-only' : 'text-sm font-medium text-primary'}>{label}</span>
      <span className="relative block min-w-0">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${fieldClassName} pl-10`}
        />
      </span>
    </label>
  )

}
