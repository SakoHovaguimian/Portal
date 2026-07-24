'use server'

import { strings } from '@/content/strings'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { ServerEnvironment } from '@/config/environment'
import { container } from '@/container'
import { FirebaseAuthServiceError } from '@/services/auth/firebaseAuthService'
import type { AuthActionState } from '../models/authActionState'

const LoginSchema = z.object({
  email: z.string().trim().email(strings.shared.enterAValidEmailAddress),
  password: z.string().min(1, strings.shared.enterYourPassword),
})

const SignupSchema = z.object({
  first_name: z.string().trim().min(1, strings.auth.actions.firstName),
  last_name: z.string().trim().min(1, strings.auth.actions.lastName),
  email: z.string().trim().email(strings.shared.enterAValidEmailAddress),
  password: z.string().min(8, strings.auth.actions.passwordLength),
  confirm_password: z.string(),
  terms: z.literal('on', { error: strings.auth.actions.acceptTerms }),
})
.refine((input) => input.password === input.confirm_password, {
  message: strings.auth.actions.passwordsMatch,
  path: ['confirm_password'],
})

const PasswordResetSchema = z.object({
  email: z.string().trim().email(strings.shared.enterAValidEmailAddress),
})

export async function loginAction(_priorState: AuthActionState, formData: FormData): Promise<AuthActionState> {

  const result = LoginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {

    return {
      status: 'error',
      message: strings.shared.checkTheHighlightedFieldsAndTryAgain,
      fieldErrors: result.error.flatten().fieldErrors,
    }

  }

  try {

    if (ServerEnvironment.authMode === 'none') {
      return { status: 'success', message: strings.auth.actions.welcomeBack }
    }

    if (ServerEnvironment.authMode === 'custom') {
      return { status: 'error', message: strings.auth.actions.customRequired }
    }

    const session = await container.firebaseAuthService.signIn(result.data.email, result.data.password)
    await container.sessionService.createSession(session)

    return {
      status: 'success',
      message: strings.auth.actions.welcomeBack,
    }

  } catch (error) {

    return getAuthErrorState(error)

  }

}

export async function signupAction(_priorState: AuthActionState, formData: FormData): Promise<AuthActionState> {

  const result = SignupSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {

    return {
      status: 'error',
      message: strings.shared.checkTheHighlightedFieldsAndTryAgain,
      fieldErrors: result.error.flatten().fieldErrors,
    }

  }

  try {

    if (ServerEnvironment.authMode === 'none') {
      return { status: 'success', message: strings.auth.actions.workspaceReady }
    }

    if (ServerEnvironment.authMode === 'custom') {
      return { status: 'error', message: strings.auth.actions.customRequired }
    }

    const firebaseSession = await container.firebaseAuthService.signUp({
      email: result.data.email,
      password: result.data.password,
    })
    await container.sessionService.createSession(firebaseSession)

    return {
      status: 'success',
      message: strings.auth.actions.workspaceReady,
    }

  } catch (error) {

    return getAuthErrorState(error)

  }

}

export async function passwordResetAction(_priorState: AuthActionState, formData: FormData): Promise<AuthActionState> {

  const result = PasswordResetSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {

    return {
      status: 'error',
      fieldErrors: result.error.flatten().fieldErrors,
    }

  }

  if (ServerEnvironment.authMode === 'firebase') {
    await container.firebaseAuthService.sendPasswordResetEmail(result.data.email).catch(() => undefined)
  }

  return {
    status: 'success',
    message: strings.auth.actions.resetSent,
  }

}

export async function logoutAction(): Promise<never> {

  await container.sessionService.deleteSession()
  redirect('/')

}

function getAuthErrorState(error: unknown): AuthActionState {

  if (error instanceof FirebaseAuthServiceError) {

    return {
      status: 'error',
      message: error.message,
    }

  }

  return {
    status: 'error',
    message: strings.auth.actions.genericError,
  }

}
