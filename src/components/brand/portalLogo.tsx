import { strings } from '@/content/strings'
import Link from 'next/link'
import { PanelsTopLeft } from 'lucide-react'

interface PortalLogoProps {
  href?: string
  inverted?: boolean
}

export function PortalLogo({ href = '/', inverted = false }: PortalLogoProps) {

  const content = (
    <>
      <span className={`grid size-9 place-items-center rounded-xl ${inverted ? 'bg-white text-[#352A7A]' : 'bg-accent text-on-accent'}`}>
        <PanelsTopLeft size={19} aria-hidden="true" />
      </span>
      <span className={`text-lg font-semibold tracking-[-0.04em] ${inverted ? 'text-white' : 'text-primary'}`}>
        {strings.shared.portal}
      </span>
    </>
  )

  return (
    <Link
      href={href}
      aria-label={strings.common.logo.home}
      className="focus-ring inline-flex items-center gap-2.5 rounded-xl"
    >
      {content}
    </Link>
  )

}
