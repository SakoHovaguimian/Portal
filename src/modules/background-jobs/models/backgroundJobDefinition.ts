import type { z } from 'zod';
import type { BackgroundJobExecutionContext } from './backgroundJobExecutionContext';
import type { BackgroundJobResult } from './backgroundJobResult';

export interface BackgroundJobDefinition<Input = unknown> {

  type: string;
  inputSchema: z.ZodType<Input>;
  retrySafe: boolean;
  maxAttempts: number;

  run(input: Input, context: BackgroundJobExecutionContext): Promise<BackgroundJobResult>;

}
