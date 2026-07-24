'use client'

import { strings } from '@/content/strings'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@astryxdesign/core/Button'
import { LockKeyhole } from 'lucide-react'
import { InlineNotice } from '@/components/feedback/inlineNotice'
import { FormField } from '@/components/forms/formField'
import { loginAction } from '../actions/authActions'
import { InitialAuthActionState } from '../models/authActionState'

export function LoginForm() {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [state, action, isPending] = useActionState(loginAction, InitialAuthActionState)

  useEffect(() => {

    if (state.status === 'success') {

      router.replace('/portal')
      router.refresh()

    }

  }, [router, state.status])

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-accent">{strings.auth.login.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-primary">{strings.auth.login.title}</h1>
        <p className="mt-3 text-secondary">{strings.auth.login.description}</p>
      </div>
      <form action={action} className="grid gap-5">
        <FormField
          label={strings.shared.emailAddress}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={strings.shared.youCompanyCom}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          error={state.fieldErrors?.email?.[0]}
        />
        <div>
          <FormField
            label={strings.shared.password}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder={strings.shared.enterYourPassword}
            required
            error={state.fieldErrors?.password?.[0]}
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="focus-ring rounded-sm text-sm font-medium text-accent hover:underline">{strings.auth.login.forgot}</Link>
          </div>
        </div>
        {state.status === 'error' && state.message && (
          <InlineNotice tone="error">
            {state.message}
          </InlineNotice>
        )}
        <Button
          type="submit"
          label={strings.shared.signIn}
          variant="primary"
          size="lg"
          isLoading={isPending}
          isDisabled={isPending}
          icon={<LockKeyhole size={17} aria-hidden="true" />}
          className="w-full"
        />
      </form>
      <p className="mt-7 text-center text-sm text-secondary">
        {strings.auth.login.new}{' '}
        <Link href="/signup" className="focus-ring rounded-sm font-semibold text-accent hover:underline">{strings.auth.login.create}</Link>
      </p>
    </>
  )

}
