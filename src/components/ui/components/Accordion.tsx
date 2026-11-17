'use client';

import { Button as AriaButton, Disclosure, DisclosureGroup, DisclosurePanel } from 'react-aria-components';

import { cn } from '../lib/cn';
import type { AccordionProps } from '../models/accordionProps';

import styles from './Accordion.module.css';
import { UiIcon } from './UiIcon';

/** React Aria owns keyboard interaction, expanded state, labels, and panel lifecycle. */
export function Accordion({
  items,
  className,
  itemClassName,
  headingLevel = 'h3',
  allowsMultipleExpanded = true,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  disabled = false,
}: AccordionProps) {

  const Heading = headingLevel;

  function renderAccordionItem(item: (typeof items)[number]) {

    return (
      <Disclosure
        key={item.id}
        id={item.id}
        isDisabled={item.disabled}
        className={cn(
          'ui-accordion-item min-w-0 rounded-card border-control border-secondary bg-primary',
          styles.item,
          itemClassName,
        )}
      >
        <Heading className="m-0">
          <AriaButton
            slot="trigger"
            className={cn(
              'ui-accordion-trigger flex min-h-16 w-full min-w-0 cursor-pointer items-center justify-between gap-5 rounded-card border-0 bg-transparent px-5 py-4 text-left font-body text-base font-medium text-primary hover:text-brand-secondary',
              styles.trigger,
            )}
          >
            <span className="min-w-0 wrap-anywhere">{item.title}</span>
            <UiIcon
              name="plus"
              className={cn('size-5 shrink-0', styles.icon)}
            />
          </AriaButton>
        </Heading>
        <DisclosurePanel
          className={cn('ui-accordion-panel min-w-0', styles.panel)}
        >
          <div className="ui-accordion-panel-content px-5 pb-5 text-sm text-secondary">
            {item.content}
          </div>
        </DisclosurePanel>
      </Disclosure>
    );

  }

  const accordionItems = items.map(renderAccordionItem);

  return (
    <DisclosureGroup
      allowsMultipleExpanded={allowsMultipleExpanded}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandedChange={(keys) =>
        onExpandedChange?.(new Set(Array.from(keys, String)))
      }
      isDisabled={disabled}
      className={cn('ui-accordion grid min-w-0 gap-3', className)}
    >
      {accordionItems}
    </DisclosureGroup>
  );

}
