import { useId } from 'react';
import { I18nProvider } from 'react-aria';
import { Label, Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack, type SliderProps as AriaSliderProps } from 'react-aria-components';

import { cn } from '../lib/cn';
import type { SliderControlProps } from '../models/sliderControlProps';
import { strings } from '@/strings';
import './ValueControls.css';

/** Shared interaction/paint owner for single-value and ordered two-thumb sliders. */
export function SliderControl({
  id,
  label,
  description,
  errorMessage,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  orientation = 'horizontal',
  size = 'md',
  tone = 'brand',
  leadingIcon,
  trailingIcon,
  showValue = true,
  formatOptions,
  locale = 'en-US',
  marks = [],
  className,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  names,
  thumbLabels,
  range,
  fillFrom = 'start',
}: SliderControlProps) {

  const helpId = useId();
  const vertical = orientation === 'vertical';
  const interactionProps: AriaSliderProps<number | number[]> = {
    value,
    defaultValue: defaultValue ?? (range ? [min, max] : min),
    onChange: onValueChange,
    onChangeEnd: onValueCommit,
  };
  return (
    <I18nProvider locale={locale}>
      <AriaSlider
        {...interactionProps}
        id={id}
        minValue={min}
        maxValue={max}
        step={step}
        isDisabled={disabled}
        orientation={orientation}
        formatOptions={formatOptions}
        aria-describedby={description || errorMessage ? helpId : undefined}
        data-size={size}
        data-tone={tone}
        data-invalid={!!errorMessage || undefined}
        className={cn('ui-value-control ui-slider', className)}
      >
        <div className="ui-value-heading">
          <Label className="ui-value-label">{label}</Label>
          {showValue && <SliderOutput className="ui-value-output" />}
        </div>
        <div className="ui-slider-body">
          {leadingIcon && (
            <span aria-hidden="true" className="ui-slider-icon">
              {leadingIcon}
            </span>
          )}
          <SliderTrack className="ui-slider-track">
            {({ state }) => {

              const first = state.getThumbPercent(0) * 100;
              const last = state.getThumbPercent(state.values.length - 1) * 100;
              const start = range ? first : fillFrom === 'end' ? first : 0;
              const end = range ? last : fillFrom === 'end' ? 100 : first;

              function renderMark(mark: number, index: number) {

                return (
                  <span
                    key={`${mark}-${index}`}
                    aria-hidden="true"
                    className="ui-slider-mark"
                    style={
                      vertical
                        ? {
                          bottom: `${((mark - min) / (max - min)) * 100}%`,
                        }
                        : {
                          insetInlineStart: `${((mark - min) / (max - min)) * 100}%`,
                        }}
                  />
                );

              }

              const markElements = marks
                .filter(
                  (mark) =>
                    Number.isFinite(mark) &&
                    mark >= min &&
                    mark <= max &&
                    max > min,
                )
                .map(renderMark);

              function renderThumb(_: number, index: number) {

                return (
                  <SliderThumb
                    key={index}
                    index={index}
                    name={names?.[index]}
                    aria-label={
                      range
                        ? (thumbLabels?.[index] ??
                            (index === 0
                              ? strings.valueControls.minimum
                              : strings.valueControls.maximum))
                        : undefined
                    }
                    isInvalid={!!errorMessage}
                    className="ui-slider-thumb"
                  >
                    <span aria-hidden="true" className="ui-slider-knob" />
                  </SliderThumb>
                );

              }

              const thumbElements = state.values.map(renderThumb);

              return (
                <>
                  <div aria-hidden="true" className="ui-slider-rail">
                    <div
                      className="ui-slider-fill"
                      style={
                        vertical
                          ? { bottom: `${start}%`, height: `${end - start}%` }
                          : {
                            insetInlineStart: `${start}%`,
                            width: `${end - start}%`,
                          }}
                    />
                  </div>
                  {markElements}
                  {thumbElements}
                </>
              );

            }}
          </SliderTrack>
          {trailingIcon && (
            <span aria-hidden="true" className="ui-slider-icon">
              {trailingIcon}
            </span>
          )}
        </div>
        {(description || errorMessage) && (
          <p
            id={helpId}
            className="ui-value-help"
            role={errorMessage ? 'alert' : undefined}
          >
            {errorMessage ?? description}
          </p>
        )}
      </AriaSlider>
    </I18nProvider>
  );

}
