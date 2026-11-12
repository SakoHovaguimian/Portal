import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import nextEnv from '@next/env';
import { readExport, formatInitializerCopy as formatShareCopy } from './initializer/catalog.mjs';
import { cloudflareEnvironment, requireCloudflared, startTunnel } from './share/cloudflare.mjs';
import { ShareProcesses, assertPortAvailable, waitForServer } from './share/processes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const copy = readExport(await readFile(resolve(root, 'src/strings.ts'), 'utf8'), 'shareCommandCopy');
const processes = new ShareProcesses();
process.chdir(root);

try {

  let values;
  try {
    ({ values } = parseArgs({ options: { help: { type: 'boolean' }, port: { type: 'string' } } }));
  } catch { throw new Error('optionsHint'); }
  if (values.help) {
    console.log(copy.helpBody);
  } else {

    // Let Next load its own env files so development env-file reloads still work.
    const inheritedEnv = { ...process.env };
    nextEnv.loadEnvConfig(root, true);
    const portValue = values.port ?? (process.env.SHARE_PORT?.trim() || '3001');
    if (!/^[1-9]\d*$/.test(portValue) || Number(portValue) > 65535) { throw new Error('invalidPortHint'); }
    const port = Number(portValue);
    const env = cloudflareEnvironment();
    const command = requireCloudflared(env);
    await assertPortAvailable(port);
    console.log(copy.startingBody);
    const publicUrl = await startTunnel(processes, command, env, port);
    // Set the origin before Next starts; never rewrite the developer's env files.
    const appEnv = { ...inheritedEnv, NODE_ENV: 'development', PORTAL_APP_ORIGIN: publicUrl, PORTAL_SHARE_ORIGIN: publicUrl };
    processes.start('Portal', process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', String(port)], appEnv);
    await waitForServer(processes, `http://127.0.0.1:${port}`);
    console.log(formatShareCopy(copy, 'readyBody', { url: publicUrl, port }));
    console.log(env.SHARE_ALLOWED_EMAILS?.trim() ? copy.protectedBody : copy.publicBody);
    await processes.waitForStop();

  }

} catch (error) {

  const failure = processes.signal.aborted ? processes.signal.reason : error;
  if (failure.message !== 'interrupted') {

    const key = Object.hasOwn(copy, failure.message) ? failure.message : 'unexpectedHint';
    console.error(formatShareCopy(copy, key, failure.cause));
    process.exitCode = 1;

  }

} finally {

  if (processes.children.length) { console.log(copy.stoppingBody); }
  await processes.stop();

}
