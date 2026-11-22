import { lstat, readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { formatInitializerCopy, readExport } from './initializer/catalog.mjs';
import { applyFiles, safeTarget } from './initializer/filesystem.mjs';
import { initializerError } from './initializer/options.mjs';
import { editRegistration, moduleRegistrations } from './module-generator/registrations.mjs';
import { titleCase } from './title-case.mjs';

const root = process.cwd();
const templateRoot = fileURLToPath(new URL('./module-generator/templates/', import.meta.url));
const stringsPath = 'src/strings.ts';
let copy;

function collectionNames(slug) {

  if (!/^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/.test(slug) || slug.length > 64) { throw initializerError('nameHint'); }
  const label = titleCase(slug.replaceAll('-', ' '));
  const name = slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join('');
  const key = name[0].toLowerCase() + name.slice(1);
  if (Object.hasOwn(Object.prototype, key) || ['none', 'prototype'].includes(key)) { throw initializerError('nameHint'); }
  return { slug, label, name, key };

}

async function rejectExisting(path) {

  try { await lstat(join(root, path)); } catch (error) {

    if (error.code === 'ENOENT') { return; }
    throw error;

  }
  throw initializerError('conflictHint', { path });

}

// Route groups share the same URL namespace, even when nested.
async function checkRouteGroups(directory, slug) {

  await rejectExisting(join(directory, slug));
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {

    if (entry.isDirectory() && /^\(.+\)$/.test(entry.name)) { await checkRouteGroups(join(directory, entry.name), slug); }

  }

}

async function templateFiles({ slug, name, key, label }) {

  const tokens = { __slug__: slug, __Name__: name, __key__: key, __MARK__: label.toUpperCase() };

  function render(value) {

    const rendered = value.replace(/__slug__|__Name__|__key__|__MARK__/g, (token) => tokens[token]);
    return rendered;

  }

  const files = [];
  const entries = await readdir(templateRoot, { recursive: true, withFileTypes: true });
  for (const entry of entries) {

    if (!entry.isFile() || !entry.name.endsWith('.tpl')) { continue; }
    const template = join(entry.parentPath, entry.name);
    const [group, ...parts] = relative(templateRoot, template).split(sep);
    const directory = group === 'routes' ? 'src/app/(protected)' : 'src/modules';
    const path = join(directory, slug, render(parts.join('/').slice(0, -4)));
    files.push({ path, content: render(await readFile(template, 'utf8')) });

  }
  if (!files.length) { throw initializerError('rootHint'); }
  files.sort((left, right) => left.path.localeCompare(right.path, 'en'));
  return files;

}

async function generate() {

  const stringsStat = await safeTarget(root, stringsPath);
  if (!stringsStat) { throw initializerError('rootHint'); }
  const strings = await readFile(join(root, stringsPath), 'utf8');
  copy = { ...readExport(strings, 'projectInitializerCopy'), ...readExport(strings, 'moduleGeneratorCopy') };
  let args;
  try {
    args = parseArgs({ allowPositionals: true, options: { 'dry-run': { type: 'boolean' }, help: { type: 'boolean' } } });
  } catch { throw initializerError('usageHint'); }
  if (args.values.help) {

    console.log(copy.helpBody);
    return;

  }
  if (args.positionals.length !== 1) { throw initializerError('usageHint'); }
  const names = collectionNames(args.positionals[0]);
  const { slug } = names;
  await checkRouteGroups('src/app', slug);
  await rejectExisting(join('src/modules', slug));
  await rejectExisting(join('public', slug));
  const files = await templateFiles(names);
  const snapshots = new Map();
  for (const { path } of files) {

    if (await safeTarget(root, path)) { throw initializerError('conflictHint', { path }); }
    snapshots.set(path, null);

  }
  for (const [path, register] of Object.entries(moduleRegistrations(names, copy.recordCopy))) {

    const metadata = path === stringsPath ? stringsStat : await safeTarget(root, path);
    if (!metadata) { throw initializerError('wiringHint', { path }); }
    snapshots.set(path, metadata);
    const source = path === stringsPath ? strings : await readFile(join(root, path), 'utf8');
    files.push({ path, content: editRegistration(path, source, register), mode: metadata.mode & 0o777 });

  }
  console.log(formatInitializerCopy(copy, 'previewBody', names));
  for (const file of files) { console.log(file.path); }
  if (args.values['dry-run']) {

    console.log(copy.dryRunBody);
    return;

  }
  await applyFiles(root, files, snapshots);
  console.log(formatInitializerCopy(copy, 'completeBody', names));

}

try { await generate(); } catch (error) {

  if (copy) {

    const key = Object.hasOwn(copy, error.message) ? error.message : 'rootHint';
    console.error(formatInitializerCopy(copy, key, error.values));

  } else { console.error(error.code || error.message); }
  process.exitCode = 1;

}
