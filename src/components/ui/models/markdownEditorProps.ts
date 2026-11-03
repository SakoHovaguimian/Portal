export interface MarkdownEditorProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  'aria-labelledby'?: string;
}
