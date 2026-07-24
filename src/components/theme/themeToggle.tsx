'use client'

import { strings } from '@/content/strings'
import { IconButton } from '@astryxdesign/core/IconButton'
import { Moon, Sun } from 'lucide-react'
import { useThemeMode } from '@/app/providers'

export function ThemeToggle() {

  const { mode, setMode } = useThemeMode()
  const isDark = mode === 'dark'

  return <IconButton label={isDark ? strings.common.theme.light : strings.common.theme.dark} variant="secondary" icon={isDark ? <Sun size={17} /> : <Moon size={17} />} onClick={() => setMode(isDark ? 'light' : 'dark')} />

}
