export interface TableSelection<T> {
  selectedKeys: readonly string[];
  onSelectionChange: (keys: string[]) => void;
  getRowLabel: (row: T) => string;
  isRowDisabled?: (row: T) => boolean;
  disabled?: boolean;
}
