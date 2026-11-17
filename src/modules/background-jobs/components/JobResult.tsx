import { Card, DescriptionList, UiIcon } from '@/components/ui';
import { portalJobStrings as copy } from '@/strings';

import type { BackgroundJobProps } from '../models/backgroundJobProps';

export function JobResult({ job }: BackgroundJobProps) {

  if (!job.result) { return null; }
  const items = Object.entries(job.result.values).map(([label, value]) => ({
    label,
    value: typeof value === 'string' || typeof value === 'number' ? value : <pre className="m-0 max-w-full overflow-x-auto whitespace-pre-wrap font-mono text-xs wrap-anywhere">{JSON.stringify(value, null, 2)}</pre>,
  }));
  return (
    <Card className="grid gap-5">
      <h2 className="m-0 flex items-center gap-2 text-lg font-semibold text-primary"><UiIcon name="check" className="text-success-primary" />{copy.resultTitle}</h2>
      <p className="m-0 text-sm text-secondary">{job.result.summary}</p>
      <DescriptionList items={items} />
    </Card>
  );

}
