export const buttonPreviewStates = ['default', 'hover', 'focused', 'disabled', 'loading'] as const;

export type ButtonPreviewState = (typeof buttonPreviewStates)[number];
