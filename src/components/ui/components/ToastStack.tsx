'use client';

import type { ToastPosition } from '../models/toastPosition';
import type { ToastStackProps } from '../models/toastStackProps';

import { ToastGroup } from './ToastGroup';

export type { ToastItem } from '../models/toastItem';

export type { ToastIntent } from '../models/toastIntent';

export type { ToastPosition } from '../models/toastPosition';

const positions: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

export function ToastStack(props: ToastStackProps) {

  const groups = positions.map((position) => <ToastGroup key={position} position={position} {...props} />);
  return <div className="pointer-events-none fixed inset-0 z-120 overflow-hidden">{groups}</div>;

}
