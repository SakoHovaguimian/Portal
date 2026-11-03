import { Badge, Button, EmptyState, IconTile, UiIcon } from '@/components/ui';
import { componentBrowserStrings as copy } from '@/strings';
import type { ComponentSpecimen } from '../models/componentSpecimen';

interface ComponentCatalogProps {
  items: readonly ComponentSpecimen[];
  onOpen: (id: string) => void;
  onReset: () => void;
}
export function ComponentCatalog({
  items,
  onOpen,
  onReset,
}: ComponentCatalogProps) {
  if (!items.length)
    return (
      <EmptyState
        title={copy.emptyTitle}
        description={copy.emptyDescription}
        action={
          <Button variant="secondary" onClick={onReset}>
            {copy.reset}
          </Button>
        }
      />
    );
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          aria-label={copy.open(item.title)}
          onClick={() => onOpen(item.id)}
          className="group grid min-h-52 min-w-0 content-start justify-stretch justify-items-stretch gap-5 rounded-card border-control border-secondary bg-primary p-5 text-left whitespace-normal shadow-(--shadow-card) hover:border-brand hover:bg-secondary_subtle"
        >
          <span className="flex w-full items-center justify-between gap-3">
            <IconTile>
              <UiIcon name={item.icon} />
            </IconTile>
            {item.isNew ? (
              <Badge intent="brand">{copy.newLabel}</Badge>
            ) : (
              <UiIcon name="arrowRight" className="size-4 text-tertiary" />
            )}
          </span>
          <span className="grid w-full min-w-0 gap-2">
            <span className="text-sm font-semibold wrap-anywhere text-primary">
              {item.title}
            </span>
            <span className="text-xs font-normal leading-relaxed wrap-anywhere text-tertiary">
              {item.description}
            </span>
          </span>
        </Button>
      ))}
    </div>
  );
}
