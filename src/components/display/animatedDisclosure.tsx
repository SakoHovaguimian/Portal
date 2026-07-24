'use client'

import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export function AnimatedDisclosure({ children, defaultIsOpen = false, trigger }: { children: ReactNode, defaultIsOpen?: boolean, trigger: ReactNode }) {

  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const triggerId = useId()
  const contentId = useId()

  return (
    <div>
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
        className="focus-ring flex w-full items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold"
      >
        <span>{trigger}</span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-secondary transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )

}
