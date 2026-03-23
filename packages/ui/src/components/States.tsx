import { Card } from './Card';
import { Button } from './Button';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-brand-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
      {children}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="grid gap-3">
      <Badge>Empty</Badge>
      <h3 className="m-0 text-lg font-semibold text-primary">{title}</h3>
      <p className="m-0 text-sm text-secondary">{description}</p>
    </Card>
  );
}

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return (
    <Card className="grid gap-3">
      <Badge>Error</Badge>
      <h3 className="m-0 text-lg font-semibold text-primary">{title}</h3>
      <p className="m-0 text-sm text-secondary">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
    </Card>
  );
}
