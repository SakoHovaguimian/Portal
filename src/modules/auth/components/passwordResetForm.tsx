'use client'

import { strings } from '@/content/strings'
import Link from 'next/link'
import { useActionState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { MailCheck } from 'lucide-react'
import { InlineNotice } from '@/components/feedback/inlineNotice'
import { FormField } from '@/components/forms/formField'
import { passwordResetAction } from '../actions/authActions'
import { InitialAuthActionState } from '../models/authActionState'

export function PasswordResetForm() {

  const [state, action, isPending] = useActionState(passwordResetAction, InitialAuthActionState)

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-accent">{strings.auth.reset.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-primary">{strings.auth.reset.title}</h1>
        <p className="mt-3 text-secondary">{strings.auth.reset.description}</p>
      </div>
      <form action={action} className="grid gap-5">
        <FormField label={strings.shared.emailAddress} name="email" type="email" autoComplete="email" placeholder={strings.shared.youCompanyCom} required error={state.fieldErrors?.email?.[0]} />
        {state.message && (
          <InlineNotice tone={state.status === 'success' ? 'success' : 'error'} role="status">
            {state.message}
          </InlineNotice>
        )}
        <Button
          type="submit"
          label={strings.auth.reset.send}
          variant="primary"
          size="lg"
          isLoading={isPending}
          isDisabled={isPending}
          icon={<MailCheck size={17} aria-hidden="true" />}
          className="w-full"
        />
      </form>
      <p className="mt-7 text-center text-sm text-secondary">
        {strings.auth.reset.remembered} <Link href="/login" className="font-semibold text-accent hover:underline">{strings.auth.reset.back}</Link>
      </p>
    </>
  )

}
