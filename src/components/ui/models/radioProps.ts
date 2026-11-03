import type { ComponentPropsWithRef, ReactNode } from 'react';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & { label: ReactNode };
