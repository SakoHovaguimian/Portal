import type { ReactNode } from 'react'

export function FormActions({ children, className, stackOnMobile = false }: { children: ReactNode, className?: string, stackOnMobile?: boolean }) {

  return (
    <div className={`${stackOnMobile ? 'flex flex-col-reverse sm:flex-row' : 'flex'} justify-end gap-2 border-t border-border pt-5 ${className ?? ''}`}>
      {children}
    </div>
  )

}
