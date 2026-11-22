import 'server-only';

import { projectConfiguration } from '@/config/projectConfiguration';
import { NotFoundError } from '@/errors/domainErrors';
import { demoPresetIds } from '@/services/demo/demoPresets';
import type { DemoRequestHandler } from '@/services/demo/models/demoRequestHandler';
import { portal__Name__Strings } from '@/strings';

import { __Name__InputSchema, type __Name__Record } from '../models/__key__Record';
import { __key__ApiPath } from '../__key__ApiPath';

const runtime = globalThis as typeof globalThis & {
  portalGenerated__Name__Records?: Map<string, __Name__Record[]>;
};
const byOwner = runtime.portalGenerated__Name__Records ??= new Map<string, __Name__Record[]>();

// **************************************
// MARK: - GET ACCOUNT RECORDS
// **************************************

function getRecords(owner: string) {

  let rows = byOwner.get(owner);
  if (!rows) {

    rows = [];
    if (projectConfiguration.starterData === 'populated' && owner === demoPresetIds.populated) {

      const now = new Date().toISOString();
      rows.push({ id: crypto.randomUUID(), name: portal__Name__Strings.sampleNameData, createdAt: now, updatedAt: now });

    }
    byOwner.set(owner, rows);

  }
  return rows;

}

// **************************************
// MARK: - RESET DEMO RECORDS
// **************************************

export function reset__Name__(owner?: string) {

  if (owner === undefined) { byOwner.clear(); } else { byOwner.delete(owner); }

}

// **************************************
// MARK: - HANDLE DEMO __MARK__
// **************************************

export const handleDemo__Name__: DemoRequestHandler = async ({ request, url, parts, current, input, json, page }) => {

  if (url.pathname !== __key__ApiPath && !url.pathname.startsWith(`${__key__ApiPath}/`)) { return null; }
  if (parts.length > 4) { throw new NotFoundError(); }
  const id = parts[3];
  const rows = getRecords(current.id);
  if (!id && request.method === 'GET') {

    const search = (url.searchParams.get('query') ?? '').trim().toLowerCase();
    const matches = rows.filter((row) => row.name.toLowerCase().includes(search));
    return json(page(matches));

  }
  if (!id && request.method === 'POST') {

    const { name } = __Name__InputSchema.parse(await input());
    const now = new Date().toISOString();
    const record = { id: crypto.randomUUID(), name, createdAt: now, updatedAt: now };
    rows.unshift(record);
    return json(record, 201);

  }
  const record = rows.find((row) => row.id === id);
  if (!record) { throw new NotFoundError(); }
  if (request.method === 'GET') { return json(record); }
  if (request.method === 'PATCH') {

    const { name } = __Name__InputSchema.parse(await input());
    record.name = name;
    record.updatedAt = new Date().toISOString();
    return json(record);

  }
  throw new NotFoundError();

};
