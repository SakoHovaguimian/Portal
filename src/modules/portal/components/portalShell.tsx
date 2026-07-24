'use client'

import { strings } from '@/content/strings'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { IconButton } from '@astryxdesign/core/IconButton'
import {
  Activity,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Settings,
  UsersRound,
  X,
} from 'lucide-react'
import { PortalLogo } from '@/components/brand/portalLogo'
import { ThemeToggle } from '@/components/theme/themeToggle'
import { LogoutButton } from '@/modules/auth/components/logoutButton'

const navigationItems = [
  { href: '/portal', label: strings.shared.overview, icon: LayoutDashboard },
  { href: '/portal/activity', label: strings.shared.activity, icon: Activity },
  { href: '/portal/team', label: strings.shared.team, icon: UsersRound },
  { href: '/portal/resources', label: strings.shared.resources, icon: BookOpen },
  { href: '/portal/settings', label: strings.shared.settings, icon: Settings },
] as const

export function PortalShell({ children, authMode }: { children: React.ReactNode, authMode: string }) {

  const pathname = usePathname()
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)

  return (
    <div className="portal-shell-background min-h-screen w-full min-w-0 text-primary lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {isMobileNavigationOpen && (
        <button
          type="button"
          aria-label={strings.shared.closeNavigation}
          onClick={() => setIsMobileNavigationOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden rounded-r-[28px] border-r border-border bg-body/95 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-auto ${isMobileNavigationOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-18 items-center justify-between border-b border-border px-5">
          <PortalLogo href="/portal" />
          <IconButton
            label={strings.shared.closeNavigation}
            variant="ghost"
            icon={<X size={19} />}
            onClick={() => setIsMobileNavigationOpen(false)}
            className="lg:hidden"
          />
        </div>
        <div className="px-4 pt-4">
          <div className="rounded-xl border border-accent/20 bg-accent-muted px-3 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">
              {strings.portal.shell.templateMode}
            </p>
            <p className="mt-1 text-sm font-semibold">{authMode}</p>
          </div>
        </div>
        <nav aria-label={strings.portal.shell.navigation} className="flex-1 px-3 pt-5">
          <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-secondary">
            {strings.portal.shell.workspace}
          </p>
          <ul className="space-y-1">
            {navigationItems.map((item) => {

              const isActive = item.href === '/portal'
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileNavigationOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`focus-ring flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${isActive ? 'bg-accent-muted text-accent' : 'text-secondary hover:bg-muted hover:text-primary'}`}
                  >
                    <item.icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )

            })}
          </ul>
        </nav>
        <div className="border-t border-border p-3">
          <div className={`flex items-center gap-2 rounded-md p-1.5 transition hover:bg-muted ${pathname === '/portal/settings' ? 'bg-muted' : ''}`}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-on-accent">
              {strings.portal.shell.demoInitials}
            </span>
            <Link href="/portal/settings" className="focus-ring flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{strings.portal.shell.demoUser}</span>
                <span className="block truncate text-xs text-secondary">{strings.portal.shell.demoEmail}</span>
              </span>
              <ChevronDown size={15} className="text-secondary" />
            </Link>
          </div>
          <div className="mt-1">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <div className="w-full min-w-0 max-w-full">
        <header className="portal-header-canvas sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-border px-4 sm:px-7">
          <IconButton
            label={strings.shared.openNavigation}
            variant="secondary"
            icon={<Menu size={19} />}
            onClick={() => setIsMobileNavigationOpen(true)}
            className="lg:hidden"
          />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button href="/portal/resources" label={strings.portal.dashboard.addResource} variant="primary" className="hidden sm:inline-flex" />
          </div>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-[1480px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          {children}
        </div>
      </div>
    </div>
  )

}
