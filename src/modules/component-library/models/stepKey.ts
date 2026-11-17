export const stepKeys = ['details', 'settings', 'review'] as const;

export type StepKey = (typeof stepKeys)[number];
