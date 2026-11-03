import { readFile, realpath } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markedBlock, readExport, formatInitializerCopy } from './initializer/catalog.mjs';
import { buildSettings, initializerError, parseOptions } from './initializer/options.mjs';
import { promptOptions } from './initializer/interactive.mjs';
import { createPlan, environmentContent } from './initializer/plan.mjs';
import { applyFiles } from './initializer/filesystem.mjs';

let copy;

async function main() {

  const installedRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const source = await readFile(join(installedRoot, 'src/strings.ts'), 'utf8');
  copy = readExport(markedBlock(source, 'PROJECT_INITIALIZER_COPY').source, 'projectInitializerCopy');
  const identity = readExport(markedBlock(source, 'PROJECT_IDENTITY').source, 'portalProjectStrings');
  let options = parseOptions(process.argv.slice(2));
  if (options.help) {

    console.log(copy.helpBody);
    return;

  }
  if (!Object.keys(options).length) { options = await promptOptions(copy, identity); }
  const root = await realpath(process.cwd());
  const settings = buildSettings(options, copy, identity);
  const plan = await createPlan(root, settings, Boolean(options.force));
  const data = {
    profile: settings.configuration.profile,
    name: settings.identity.name,
    slug: settings.configuration.slug,
    description: settings.identity.description,
    theme: settings.configuration.appearance.themeId,
    mode: settings.configuration.appearance.mode,
    modules: Object.keys(settings.configuration.modules).filter((key) => settings.configuration.modules[key]),
    navigation: settings.configuration.navigation,
    starterData: settings.configuration.starterData,
    environment: settings.environment,
    files: plan.files.map((file) => file.path),
    credential: Boolean(settings.firebaseApiKey),
    force: Boolean(options.force),
  };
  const preview = Object.fromEntries(Object.entries(data).map(([key, value]) => [copy.planLabels[key], value]));
  console.log(copy.previewTitle);
  console.log(formatInitializerCopy(copy, 'previewBody', { plan: JSON.stringify(preview, null, 2) }));
  if (options['dry-run'] || options.preview) {

    if (plan.conflict) { console.log(copy.existingHint); }
    console.log(copy.dryRunBody);
    return;

  }
  if (plan.conflict && !options.force) { throw initializerError('existingHint'); }
  if (plan.conflict) { console.log(copy.overwriteBody); }
  const packageData = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  plan.files.find((file) => file.path === '.env.local').content = environmentContent(settings, packageData.version);
  await applyFiles(root, plan.files, plan.snapshots);
  console.log(copy.completeBody);
  if (settings.environment === 'live') { console.log(copy.liveBody); }

}

try { await main(); } catch (error) {

  if (copy) {

    const key = Object.hasOwn(copy, error.message) ? error.message : 'rootHint';
    console.error(formatInitializerCopy(copy, 'errorBody', { detail: formatInitializerCopy(copy, key, error.values) }));

  } else { console.error(error.code || error.name); }
  process.exitCode = 1;

}
