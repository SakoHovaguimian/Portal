import type { QuickActionsProps } from '../models/quickActionsProps';

import { Button } from './Button';
import { UiIcon } from './UiIcon';

export function QuickActions({
  label,
  items,
}: QuickActionsProps) {

  function renderQuickAction(item: (typeof items)[number]) {

    return (
      <Button
        key={item.id}
        variant="secondary"
        onClick={item.onClick}
        className="h-full min-h-28 min-w-0 flex-col gap-3 rounded-card px-4 py-6 shadow-(--shadow-card)"
      >
        <UiIcon name={item.icon} className="size-6 text-brand-secondary" />
        <span className="min-w-0 text-sm wrap-anywhere">{item.label}</span>
      </Button>
    );

  }

  const quickActions = items.map(renderQuickAction);

  return (
    <nav
      aria-label={label}
      className="grid min-w-0 grid-cols-1 items-stretch gap-4 xs:grid-cols-3 sm:gap-6"
    >
      {quickActions}
    </nav>
  );

}
