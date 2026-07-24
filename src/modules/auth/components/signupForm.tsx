'use client'

import { strings } from '@/content/strings'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@astryxdesign/core/Button'
import { ArrowRight } from 'lucide-react'
import { InlineNotice } from '@/components/feedback/inlineNotice'
import { FormField } from '@/components/forms/formField'
import { signupAction } from '../actions/authActions'
import { InitialAuthActionState } from '../models/authActionState'

export function SignupForm() {

  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [state, action, isPending] = useActionState(signupAction, InitialAuthActionState)

  useEffect(() => {

    if (state.status === 'success') {

      router.replace('/portal')
      router.refresh()

    }

  }, [router, state.status])

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-accent">{strings.auth.signup.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-primary">{strings.auth.signup.title}</h1>
        <p className="mt-3 text-secondary">{strings.auth.signup.description}</p>
      </div>
      <form action={action} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={strings.shared.firstName} name="first_name" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required error={state.fieldErrors?.first_name?.[0]} />
          <FormField label={strings.shared.lastName} name="last_name" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required error={state.fieldErrors?.last_name?.[0]} />
        </div>
        <FormField label={strings.auth.signup.workEmail} name="email" type="email" autoComplete="email" placeholder={strings.shared.youCompanyCom} value={email} onChange={(event) => setEmail(event.target.value)} required error={state.fieldErrors?.email?.[0]} />
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <FormField label={strings.shared.password} name="password" type="password" autoComplete="new-password" required hint={strings.auth.signup.passwordHint} error={state.fieldErrors?.password?.[0]} />
          <FormField label={strings.auth.signup.confirmPassword} name="confirm_password" type="password" autoComplete="new-password" required error={state.fieldErrors?.confirm_password?.[0]} />
        </div>
        <label className="flex items-start gap-3 text-sm leading-6 text-secondary">
          <input name="terms" type="checkbox" checked={hasAcceptedTerms} onChange={(event) => setHasAcceptedTerms(event.target.checked)} required className="focus-ring mt-1 size-4 rounded border-border accent-[var(--color-accent)]" />
          <span>
            {strings.auth.signup.agree} <Link href="/terms" className="font-medium text-primary underline underline-offset-2">{strings.shared.terms}</Link> {strings.auth.signup.and} <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">{strings.shared.privacyPolicy}</Link>.
            {state.fieldErrors?.terms?.[0] && <span className="mt-1 block text-xs text-error">{state.fieldErrors.terms[0]}</span>}
          </span>
        </label>
        {state.status === 'error' && state.message && (
          <InlineNotice tone="error">
            {state.message}
          </InlineNotice>
        )}
        <Button
          type="submit"
          label={strings.shared.createAccount}
          variant="primary"
          size="lg"
          isLoading={isPending}
          isDisabled={isPending}
          endContent={<ArrowRight size={17} aria-hidden="true" />}
          className="w-full"
        />
      </form>
      <p className="mt-7 text-center text-sm text-secondary">
        {strings.auth.signup.existing}{' '}
        <Link href="/login" className="focus-ring rounded-sm font-semibold text-accent hover:underline">{strings.shared.signIn}</Link>
      </p>
    </>
  )

}
