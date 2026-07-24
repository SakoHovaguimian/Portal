import { strings } from '@/content/strings'
import { Button } from '@astryxdesign/core/Button'
import { CircleAlert, RotateCcw } from 'lucide-react'

export function ErrorState({ title = strings.common.errorState.title, message, onRetry }: { title?: string, message?: string, onRetry?: () => void }) {

  return (
    <div role="alert" className="grid min-h-64 place-items-center rounded-md border border-error/25 bg-error-muted/40 p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-10 place-items-center rounded-full bg-error-muted text-error"><CircleAlert size={20} /></span>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-secondary">{message ?? strings.common.errorState.description}</p>
        {onRetry && <Button label={strings.shared.tryAgain} icon={<RotateCcw size={15} />} onClick={onRetry} className="mt-5" />}
      </div>
    </div>
  )

}
