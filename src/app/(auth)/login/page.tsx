import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { LoginForm } from '@/modules/auth/components/loginForm'

export const metadata: Metadata = {
  title: strings.shared.signIn,
  description: strings.metadata.loginPage.description,
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginForm />
}
