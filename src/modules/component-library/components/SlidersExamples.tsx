'use client';

import { useState } from 'react';
import {
  Button,
  NumberStepper,
  RangeSlider,
  Slider,
  UiIcon,
} from '@/components/ui';
import { strings } from '@/strings';

const copy = strings.valueControls;

export function SlidersExamples() {

  const [brightness, setBrightness] = useState(0.64);
  const [exposure, setExposure] = useState(1);
  const [range, setRange] = useState<[number, number]>([200, 800]);
  const [quantity, setQuantity] = useState(3);
  const [selection, setSelection] = useState(15);
  return (
    <div className="grid min-w-0 gap-6">
      <h3 className="m-0 text-base font-semibold text-primary">
        {copy.slidersTitle}
      </h3>
      <div className="grid min-w-0 items-start gap-x-10 gap-y-8 lg:grid-cols-2">
        <Slider
          label={copy.brightness}
          value={brightness}
          onValueChange={setBrightness}
          max={1}
          step={0.01}
          formatOptions={{ style: 'percent' }}
          description={copy.brightnessHint}
          leadingIcon={<UiIcon name="sun" className="size-4" />}
          trailingIcon={<UiIcon name="sun" className="size-6" />}
        />
        <Slider
          label={copy.exposure}
          value={exposure}
          onValueChange={setExposure}
          min={-5}
          max={5}
          step={0.5}
          fillFrom="end"
          description={copy.exposureHint}
          marks={[-5, 0, 5]}
        />
        <RangeSlider
          label={copy.priceRange}
          value={range}
          onValueChange={setRange}
          max={1000}
          step={25}
          formatOptions={{
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }}
          description={copy.priceRangeHint}
        />
        <Slider
          label={copy.stepped}
          defaultValue={16}
          min={12}
          max={24}
          step={2}
          marks={[12, 14, 16, 18, 20, 22, 24]}
          size="sm"
        />
        <NumberStepper
          label={copy.quantity}
          value={quantity}
          onValueChange={setQuantity}
          minValue={1}
          maxValue={12}
          description={copy.quantityHint}
        />
        <NumberStepper label={copy.readOnly} value={4} readOnly size="sm" />
        <Slider
          label={copy.invalid}
          value={selection}
          onValueChange={setSelection}
          errorMessage={selection < 25 ? copy.invalidMessage : undefined}
        />
        <Slider label={copy.disabled} value={40} disabled size="lg" />
        <div className="grid min-w-0 grid-cols-2 gap-6">
          <Slider
            label={copy.vertical}
            defaultValue={60}
            orientation="vertical"
            showValue
            leadingIcon={<UiIcon name="moon" />}
            trailingIcon={<UiIcon name="sun" />}
          />
          <RangeSlider
            label={copy.priceRange}
            defaultValue={[25, 75]}
            orientation="vertical"
          />
        </div>
      </div>
      <div>
        <Button
          variant="secondary"
          onClick={() => {

            setBrightness(0.64);
            setExposure(1);
            setRange([200, 800]);
            setQuantity(3);
            setSelection(15);

          }}
        >
          {copy.reset}
        </Button>
      </div>
    </div>
  );

}
