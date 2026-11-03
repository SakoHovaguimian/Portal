import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Match the named geometry registered by theme.css. Without these groups,
// tailwind-merge mistakes border-control for a color and drops the stroke.
const mergeClasses = extendTailwindMerge({
  extend: {
    theme: { radius: ['control', 'card', 'overlay', 'chip'] },
    classGroups: {
      'border-w': [{ border: ['control'] }],
      'border-w-x': [{ 'border-x': ['control'] }],
      'border-w-y': [{ 'border-y': ['control'] }],
      'border-w-s': [{ 'border-s': ['control'] }],
      'border-w-e': [{ 'border-e': ['control'] }],
      'border-w-bs': [{ 'border-bs': ['control'] }],
      'border-w-be': [{ 'border-be': ['control'] }],
      'border-w-t': [{ 'border-t': ['control'] }],
      'border-w-r': [{ 'border-r': ['control'] }],
      'border-w-b': [{ 'border-b': ['control'] }],
      'border-w-l': [{ 'border-l': ['control'] }],
      'divide-x': [{ 'divide-x': ['control'] }],
      'divide-y': [{ 'divide-y': ['control'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}
