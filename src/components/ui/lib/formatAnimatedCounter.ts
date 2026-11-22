import type { AnimatedCounterProps } from '../models/animatedCounterProps';

const groupLocales = { western: 'en-US', indian: 'en-IN' };

type CounterSlot = {
  key: string;
  text: string;
  digit?: number;
};

export function formatAnimatedCounter(
  amount: number,
  decimals: number,
  padStart: number,
  grouping: NonNullable<AnimatedCounterProps['grouping']>,
  separator: string,
  decimalSeparator: string,
) {

  const fractionDigits = Number.isFinite(decimals) ? Math.min(15, Math.max(0, Math.trunc(decimals))) : 0;
  const integerDigits = Number.isFinite(padStart) ? Math.min(21, Math.max(1, Math.trunc(padStart))) : 1;
  const format = new Intl.NumberFormat(groupLocales[grouping], {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    minimumIntegerDigits: integerDigits,
    useGrouping: Boolean(separator),
    signDisplay: 'negative',
  });
  const parts = format.formatToParts(amount);
  const integerWidth = parts.reduce((width, part) => width + (part.type === 'integer' ? part.value.length : 0), 0);

  // The units digit stays at place zero when grouping, padding, or precision changes.
  let place = integerWidth - 1;
  const slots = parts.flatMap<CounterSlot>(({ type, value }) => {

    if (type === 'integer' || type === 'fraction') {

      const digits = Array.from(value, (digit) => ({ key: String(place--), text: digit, digit: Number(digit) }));
      return digits;

    }
    const text = type === 'group' ? separator : type === 'decimal' ? decimalSeparator : value;
    return text ? [{ key: `${type}-${place}`, text }] : [];

  });
  const text = slots.map((slot) => slot.text).join('');
  return { slots, text };

}
