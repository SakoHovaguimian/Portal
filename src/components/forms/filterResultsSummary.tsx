import { formatStrings, strings } from '@/content/strings'
import { Button } from '@astryxdesign/core/Button'
import { SlidersHorizontal } from 'lucide-react'

export function FilterResultsSummary({ count, singularLabel, onClear }: { count: number, singularLabel: string, onClear?: () => void }) {

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-secondary">
      <span className="flex items-center gap-1.5">
        <SlidersHorizontal size={14} aria-hidden="true" />
        {formatStrings.common.resultCount(count, singularLabel)}
      </span>
      {onClear && <Button label={strings.common.filterResults.clear} variant="ghost" size="sm" onClick={onClear} />}
    </div>
  )

}
