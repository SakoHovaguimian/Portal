import { z } from 'zod';
import { ValidationError } from '@/errors/domainErrors';
import { strings } from '@/strings';
export function validateInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new ValidationError(strings.errors.invalidInput);
  return result.data;
}
