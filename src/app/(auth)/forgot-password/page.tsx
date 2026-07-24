import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { PasswordResetForm } from '@/modules/auth/components/passwordResetForm'

export const metadata: Metadata = {
  title: strings.metadata.forgotPasswordPage.resetPassword,
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return <PasswordResetForm />
}
