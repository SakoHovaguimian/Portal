import type { StepperOrientation } from './stepperOrientation';
import type { StepperStep } from './stepperStep';

export interface StepperProps<Key extends string> {
  steps: StepperStep<Key>[];
  label: string;
  orientation?: StepperOrientation;
  disabled?: boolean;
  onSelect: (key: Key) => void;
}
