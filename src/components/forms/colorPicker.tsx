import type { CSSProperties } from 'react'
import styles from './colorPicker.module.css'

export function ColorPicker({ label, value, size = 'md', onChange }: { label: string, value: string, size?: 'sm' | 'md', onChange: (value: string) => void }) {
  return (
    <span data-size={size} className={styles.colorPicker} style={{ '--color-picker-value': value } as CSSProperties}>
      <span className={styles.swatch} aria-hidden="true" />
      <input type="color" aria-label={label} value={value} className={styles.input} onChange={(event) => onChange(event.target.value)} />
    </span>
  )
}
