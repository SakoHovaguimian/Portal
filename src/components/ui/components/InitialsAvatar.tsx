import { Avatar } from './Avatar';

/** Compatibility wrapper for identity rows that already display the person's name. */
export function InitialsAvatar({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Avatar name={name} />
    </span>
  );
}
