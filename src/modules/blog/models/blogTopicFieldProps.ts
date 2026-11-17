export interface BlogTopicFieldProps {
  value: string;
  categories: string[];
  disabled: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
}
