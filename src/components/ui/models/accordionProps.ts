import type { AccordionItem } from './accordionItem';

export interface AccordionProps {
  items: readonly AccordionItem[];
  className?: string;
  itemClassName?: string;
  headingLevel?: 'h2' | 'h3' | 'h4';
  allowsMultipleExpanded?: boolean;
  expandedKeys?: Iterable<string>;
  defaultExpandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  disabled?: boolean;
}
