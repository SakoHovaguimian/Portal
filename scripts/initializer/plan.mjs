import { createHash, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultConfiguration } from './configuration.mjs';
import { markedBlock, readExport, sourceLiteral } from './catalog.mjs';
import { safeTarget } from './filesystem.mjs';
import { initializerError } from './options.mjs';
import { loadAsset } from './assets.mjs';

const configurationPath = 'src/config/projectConfiguration.ts';
const stringsPath = 'src/strings.ts';
const statePath = '.portal-initialized.json';
const originalIdentityHash = '8bcd852825f2ab612b0cb4bd3b6ca10587cdf592df233197c91900e9086ebb1d';

function digest(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

export async function createPlan(root, settings, force) {

  const snapshots = new Map();
  for (const path of ['package.json', '.env.example', configurationPath, stringsPath]) {

    const metadata = await safeTarget(root, path);
    if (!metadata) { throw initializerError('rootHint'); }
    snapshots.set(path, metadata);

  }
  const packageSource = await readFile(join(root, 'package.json'), 'utf8');
  const packageData = JSON.parse(packageSource);
  const configurationSource = await readFile(join(root, configurationPath), 'utf8');
  const stringsSource = await readFile(join(root, stringsPath), 'utf8');
  const identityBlock = markedBlock(stringsSource, 'PROJECT_IDENTITY');
  const identity = readExport(identityBlock.source, 'portalProjectStrings');
  let existingConfiguration;
  try { existingConfiguration = readExport(configurationSource, 'projectConfiguration'); } catch { existingConfiguration = null; }
  const logo = await loadAsset(root, settings.logo, 'logo');
  const icon = await loadAsset(root, settings.icon, 'icon');
  const configuration = settings.configuration;
  configuration.branding.logoPath = logo?.publicPath || null;
  configuration.branding.iconPath = icon?.publicPath || null;
  const configurationContent = `import type { ProjectConfiguration } from './models/projectConfiguration';\n\n/** Project-owned defaults. Configure with npm run initialize -- --help. */\nexport const projectConfiguration: ProjectConfiguration = ${sourceLiteral(configuration)};\n`;
  const identityContent = `\n// @preserve-case: Product identity is project-provided content.\nexport const portalProjectStrings = ${sourceLiteral(settings.identity)};\n`;
  const catalogContent = `${stringsSource.slice(0, identityBlock.start)}${identityContent}${stringsSource.slice(identityBlock.end)}`;
  const files = [
    { path: configurationPath, content: configurationContent },
    { path: stringsPath, content: catalogContent },
    { path: '.env.local', content: null, mode: 0o600 },
  ];
  const packageConflict = !['portal-web', configuration.slug].includes(packageData.name);
  if (packageData.name !== configuration.slug) {

    packageData.name = configuration.slug;
    files.push({ path: 'package.json', content: `${JSON.stringify(packageData, null, 2)}\n` });
    const lockMetadata = await safeTarget(root, 'package-lock.json');
    if (lockMetadata) {

      snapshots.set('package-lock.json', lockMetadata);
      const lockData = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
      lockData.name = configuration.slug;
      if (lockData.packages?.['']) { lockData.packages[''].name = configuration.slug; }
      files.push({ path: 'package-lock.json', content: `${JSON.stringify(lockData, null, 2)}\n` });

    }

  }
  if (logo) { files.push({ path: logo.path, content: logo.content }); }
  if (icon) { files.push({ path: icon.path, content: icon.content }); }
  const state = {
    schemaVersion: 1,
    templateVersion: packageData.version,
    initializedAt: new Date().toISOString(),
    profile: configuration.profile,
    slug: configuration.slug,
    managedFiles: [...files.map((file) => file.path), statePath],
    configurationHash: digest(configurationContent),
    identityHash: digest(settings.identity),
  };
  files.push({ path: statePath, content: `${JSON.stringify(state, null, 2)}\n` });
  let conflict = packageConflict || digest(existingConfiguration) !== digest(defaultConfiguration()) || digest(identity) !== originalIdentityHash;
  for (const file of files) {

    const metadata = await safeTarget(root, file.path);
    if (!snapshots.has(file.path)) { snapshots.set(file.path, metadata); }
    if (metadata && ![configurationPath, stringsPath, 'package.json', 'package-lock.json'].includes(file.path)) { conflict = true; }

  }
  return { files, snapshots, conflict, force, configuration };

}

export function environmentContent(settings, version) {

  const variables = {
    DEMO_MODE: settings.environment === 'demo' ? 'true' : 'false',
    PORTAL_API_URL: settings.apiUrl || 'http://localhost:3000/api',
    APP_VERSION: /^[A-Za-z0-9.+-]+$/.test(version) ? version : '1.0.0',
    PORTAL_APP_ORIGIN: settings.appOrigin,
    SESSION_SECRET: settings.environment === 'live' ? randomBytes(48).toString('base64') : '',
    FIREBASE_WEB_API_KEY: settings.environment === 'live' ? settings.firebaseApiKey : '',
    PORTAL_ONBOARDING_ENABLED: 'false',
    PORTAL_SOCKET_URL: '',
    FIREBASE_AUTH_DOMAIN: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_MESSAGING_SENDER_ID: '',
    FIREBASE_APP_ID: '',
    FIREBASE_VAPID_PUBLIC_KEY: '',
    AMPLITUDE_API_KEY: '',
  };
  const lines = Object.entries(variables).map(([key, value]) => `${key}=${value.replace(/\$/g, '\\$')}`);
  return `${lines.join('\n')}\n`;

}
