import type { MarkdownAction } from './markdownAction';

export interface MarkdownToolbarProps {
  disabled: boolean;
  apply: (action: MarkdownAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
