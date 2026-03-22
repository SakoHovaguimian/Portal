import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const cwd = process.cwd();
const specPath = join(cwd, 'openapi/mock-openapi.json');
const currentOutput = join(cwd, 'generated/schema.d.ts');
const tempOutput = join(cwd, 'generated/schema.check.d.ts');

execFileSync('openapi-typescript', [specPath, '-o', tempOutput], { stdio: 'inherit' });

const current = readFileSync(currentOutput, 'utf8');
const next = readFileSync(tempOutput, 'utf8');
unlinkSync(tempOutput);

if (current !== next) {
  writeFileSync(currentOutput, next);
  console.error('Generated API types were out of date. `generated/schema.d.ts` has been refreshed.');
  process.exit(1);
}
