import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';

import { readExport, formatInitializerCopy as formatShareCopy } from './initializer/catalog.mjs';
import { createCloudflareEnvironment, requireCloudflaredExecutable, startTunnel } from './share/cloudflare.mjs';
import { parseShareOptions, resolveLocalPort } from './share/options.mjs';
import { ShareProcesses } from './share/processes.mjs';
import { assertPortAvailable, startDevelopmentServer, waitForDevelopmentServer } from './share/server.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shareCommandCopy = readExport(await readFile(resolve(projectRoot, 'src/strings.ts'), 'utf8'), 'shareCommandCopy');
const shareProcesses = new ShareProcesses();
process.chdir(projectRoot);

// **************************************
// MARK: - RUN SHARE COMMAND
// **************************************

async function runShareCommand() {

  const shareOptions = parseShareOptions();

  if (shareOptions.help) {

    console.log(shareCommandCopy.helpBody);
    return;

  }

  // Let Next load its own env files so development env-file reloads still work.
  const inheritedEnvironment = { ...process.env };
  nextEnv.loadEnvConfig(projectRoot, true);
  const localPort = resolveLocalPort(shareOptions);

  await startSharingSession(localPort, inheritedEnvironment);

}

// **************************************
// MARK: - START SHARING SESSION
// **************************************

async function startSharingSession(localPort, inheritedEnvironment) {

  const cloudflareEnvironment = createCloudflareEnvironment();
  const cloudflaredExecutable = requireCloudflaredExecutable(cloudflareEnvironment);

  await assertPortAvailable(localPort);
  console.log(shareCommandCopy.startingBody);

  const publicTunnelUrl = await startTunnel(
    shareProcesses,
    cloudflaredExecutable,
    cloudflareEnvironment,
    localPort,
  );

  startDevelopmentServer(shareProcesses, localPort, publicTunnelUrl, inheritedEnvironment);
  await waitForDevelopmentServer(shareProcesses, localPort);

  printSharingDetails(publicTunnelUrl, localPort, cloudflareEnvironment);
  await shareProcesses.waitForShutdown();

}

// **************************************
// MARK: - PRINT SHARING DETAILS
// **************************************

function printSharingDetails(publicTunnelUrl, localPort, cloudflareEnvironment) {

  const readyMessage = formatShareCopy(shareCommandCopy, 'readyBody', { url: publicTunnelUrl, port: localPort });
  const accessMessage = cloudflareEnvironment.SHARE_ALLOWED_EMAILS?.trim()
    ? shareCommandCopy.protectedBody
    : shareCommandCopy.publicBody;

  console.log(readyMessage);
  console.log(accessMessage);

}

// **************************************
// MARK: - REPORT SHARING FAILURE
// **************************************

function reportSharingFailure(operationError) {

  const sharingFailure = shareProcesses.shutdownSignal.aborted
    ? shareProcesses.shutdownSignal.reason
    : operationError;

  if (sharingFailure.message === 'interrupted') {
    return;
  }

  const messageKey = Object.hasOwn(shareCommandCopy, sharingFailure.message)
    ? sharingFailure.message
    : 'unexpectedHint';
  const failureMessage = formatShareCopy(shareCommandCopy, messageKey, sharingFailure.cause);

  console.error(failureMessage);
  process.exitCode = 1;

}

try {
  await runShareCommand();
} catch (operationError) {
  reportSharingFailure(operationError);
} finally {

  if (shareProcesses.childProcesses.length) {
    console.log(shareCommandCopy.stoppingBody);
  }

  await shareProcesses.stopProcesses();

}
