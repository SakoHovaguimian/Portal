'use client'

import { ErrorState } from '@/components/feedback/errorState'

export default function PortalError({ error, reset }: { error: Error, reset: () => void }) {
  return <ErrorState message={error.message} onRetry={reset} />
}
