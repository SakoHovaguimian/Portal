import type { AvatarProps } from './avatarProps';

export interface AssigneePickerOption<Value extends string> extends Pick<AvatarProps, 'name' | 'src' | 'status'> {
  id: Value;
  description?: string;
  disabled?: boolean;
}
