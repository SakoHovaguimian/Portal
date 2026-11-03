import type { IconButtonProps } from '../models/iconButtonProps';
import { Button } from './Button';
import { cn } from '../lib/cn';

export function IconButton({
  label,
  className,
  ...props
}: IconButtonProps) {

  return (
    <Button
      variant="secondary"
      aria-label={label}
      title={label}
      className={cn('size-(--control-height-md) shrink-0 p-0', className)}
      {...props}
    />
  );

}
