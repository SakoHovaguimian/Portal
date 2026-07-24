'use client'

import { strings } from '@/content/strings'
import { useState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { logoutAction } from '../actions/authActions'

export function LogoutButton() {

  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {

    setIsPending(true)
    await logoutAction()

  }

  return <Button label={strings.auth.logout.signOut} variant="ghost" size="sm" isLoading={isPending} isDisabled={isPending} onClick={handleLogout} className="w-full justify-start" />

}
