import { AuthShell } from '@/modules/auth/components/authShell'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>
}
