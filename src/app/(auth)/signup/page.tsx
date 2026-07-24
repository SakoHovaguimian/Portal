import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { SignupForm } from '@/modules/auth/components/signupForm'

export const metadata: Metadata = {
  title: strings.shared.createAccount,
  description: strings.metadata.signupPage.description,
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return <SignupForm />
}
