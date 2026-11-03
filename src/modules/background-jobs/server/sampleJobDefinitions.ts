import 'server-only';
import { SampleJobInputSchema, type SampleJobInput } from '../models/sampleJobInput';
import type { BackgroundJobExecutionContext } from '../models/backgroundJobExecutionContext';
import type { BackgroundJobResult } from '../models/backgroundJobResult';
import { getBackgroundJobDefinition, registerBackgroundJobDefinition } from './jobDefinitionRegistry';
import { JobExecutionError } from './jobExecutionError';
import { portalJobStrings as copy } from '@/strings';

// **************************************
// MARK: - RUN SAMPLE BACKGROUND JOB
// **************************************

async function runSample(type: string, input: SampleJobInput, context: BackgroundJobExecutionContext): Promise<BackgroundJobResult> {

  context.reportProgress({ stage: 'preparing', completed: 0, total: 20 });
  await context.wait(1200);
  let checksum = 0;
  const records: { recordId: number; value: number }[] = [];
  for (let index = 1; index <= 20; index += 1) {

    await context.wait(450);
    checksum += index * 17;
    records.push({ recordId: index, value: index * 17 });
    context.reportProgress({ stage: index === 20 ? 'finalizing' : 'processing', completed: index, total: 20 });
    if (input.failFirstAttempt && context.attempt === 1 && index === 10) {
      throw new JobExecutionError(copy.errors.sampleFailure, 'SAMPLE_CHECKPOINT', true);
    }

  }
  await context.wait(900);
  const csvRows = records.map((record) => `${record.recordId},${record.value}`);
  const csv = ['record_id,value', ...csvRows].join('\n');
  return {
    summary: type === 'sample-report' ? copy.resultReportSummary : copy.resultExportSummary,
    values: type === 'sample-report'
      ? { [copy.resultRecordsLabel]: records.length, [copy.resultChecksumLabel]: checksum, [copy.resultSampleLabel]: true }
      : { [copy.resultRecordsLabel]: records.length, [copy.resultFormatLabel]: 'CSV', [copy.resultFileLabel]: 'sample-export.csv', [copy.resultChecksumLabel]: checksum, [copy.resultSampleLabel]: csv },
  };

}

// **************************************
// MARK: - REGISTER SAMPLE JOB DEFINITIONS
// **************************************

export function registerSampleJobDefinitions() {

  for (const type of ['sample-report', 'sample-export']) {

    if (getBackgroundJobDefinition(type)) { continue; }
    registerBackgroundJobDefinition({
      type,
      inputSchema: SampleJobInputSchema,
      retrySafe: true,
      maxAttempts: 3,
      run: (input, context) => runSample(type, input, context),
    });

  }

}
