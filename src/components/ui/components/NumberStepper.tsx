'use client';

import { I18nProvider } from 'react-aria';
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
  Text,
  FieldError,
} from 'react-aria-components';
import { strings } from '@/strings';
import { cn } from '../lib/cn';
import type { NumberStepperProps } from '../models/numberStepperProps';
import { UiIcon } from './UiIcon';
import './ValueControls.css';

export function NumberStepper({
  label,
  description,
  errorMessage,
  onValueChange,
  disabled,
  readOnly,
  decrementLabel = strings.valueControls.decrease,
  incrementLabel = strings.valueControls.increase,
  locale = 'en-US',
  size = 'md',
  className,
  ...props
}: NumberStepperProps) {

  return (
    <I18nProvider locale={locale}>
      <NumberField
        {...props}
        onChange={onValueChange}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isInvalid={!!errorMessage}
        validationBehavior="aria"
        data-size={size}
        className={cn('ui-value-control ui-number-stepper', className)}
      >
        <Label className="ui-value-label">{label}</Label>
        <Group className="ui-number-stepper-group">
          <Button
            slot="decrement"
            aria-label={decrementLabel}
            className="ui-number-stepper-button"
          >
            <UiIcon name="minus" />
          </Button>
          <Input className="ui-number-stepper-input" />
          <Button
            slot="increment"
            aria-label={incrementLabel}
            className="ui-number-stepper-button"
          >
            <UiIcon name="plus" />
          </Button>
        </Group>
        {description && (
          <Text slot="description" className="ui-value-help">
            {description}
          </Text>
        )}
        {errorMessage && (
          <FieldError className="ui-value-help">
            {errorMessage}
          </FieldError>
        )}
      </NumberField>
    </I18nProvider>
  );

}
