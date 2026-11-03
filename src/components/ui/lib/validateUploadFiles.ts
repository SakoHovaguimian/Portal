import type { FileRejection } from '../models/fileRejection';

export function validateUploadFiles(
  files: readonly File[],
  accept: string | undefined,
  maxSize: number | undefined,
  available: number,
) {

  const rules = (accept ?? '')
    .toLowerCase()
    .split(',')
    .map((rule) => rule.trim())
    .filter(Boolean);
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {

    const type = file.type.toLowerCase();
    const allowed =
      !rules.length ||
      rules.some((rule) =>
        rule.startsWith('.')
          ? file.name.toLowerCase().endsWith(rule)
          : rule.endsWith('/*')
            ? type.startsWith(rule.slice(0, -1))
            : type === rule,
      );
    const reason = !allowed
      ? 'type'
      : maxSize !== undefined && file.size > maxSize
        ? 'size'
        : accepted.length >= available
          ? 'count'
          : undefined;
    if (reason) { rejected.push({ file, reason }); } else { accepted.push(file); }

  }
  return { accepted, rejected };

}
