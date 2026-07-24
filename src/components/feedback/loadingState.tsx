import { strings } from '@/content/strings'
export function LoadingState({ label = strings.shared.loading }: { label?: string }) {

  return (
    <div role="status" className="grid min-h-64 place-items-center rounded-md border border-border bg-card p-8 text-center">
      <div>
        <span className="mx-auto block size-7 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm text-secondary">{label}…</p>
      </div>
    </div>
  )

}
