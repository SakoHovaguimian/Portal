import { chmod, copyFile, lstat, mkdir, open, rename, rm, rmdir } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';

import { initializerError } from './options.mjs';

export async function safeTarget(root, path) {

  const absolute = resolve(root, path);
  const local = relative(root, absolute);
  if (!local || local.startsWith(`..${sep}`) || local === '..' || local.includes('\0')) { throw initializerError('pathHint'); }
  const segments = local.split(sep);
  let current = root;
  let metadata = null;
  for (let index = 0; index < segments.length; index++) {

    current = join(current, segments[index]);
    try { metadata = await lstat(current); } catch (error) {

      if (error.code === 'ENOENT') { return null; }
      throw initializerError('pathHint');

    }
    if (metadata.isSymbolicLink() || (index < segments.length - 1 ? !metadata.isDirectory() : !metadata.isFile())) { throw initializerError('pathHint'); }

  }
  return metadata;

}

function unchanged(before, after) {
  return before === null ? after === null : after !== null && before.ino === after.ino && before.dev === after.dev && before.size === after.size && before.mtimeMs === after.mtimeMs;
}

export async function applyFiles(root, files, snapshots) {

  const lock = join(root, '.portal-initializer.lock');
  let lockHandle;
  try { lockHandle = await open(lock, 'wx', 0o600); } catch { throw initializerError('concurrentHint'); }
  const transaction = join(root, `.portal-initializer-${randomUUID()}`);
  const applied = [];
  const createdDirectories = [];
  let keepRecovery = false;
  try {

    await mkdir(transaction, { mode: 0o700 });
    const recoveryFiles = files.map((file, index) => ({ index, path: file.path, existed: snapshots.get(file.path) !== null }));
    const manifest = await open(join(transaction, 'manifest.json'), 'wx', 0o600);
    try {

      await manifest.writeFile(`${JSON.stringify({ files: recoveryFiles }, null, 2)}\n`);
      await manifest.sync();

    } finally { await manifest.close(); }
    for (let index = 0; index < files.length; index++) {

      const file = files[index];
      const target = join(root, file.path);
      const current = await safeTarget(root, file.path);
      if (!unchanged(snapshots.get(file.path), current)) { throw initializerError('concurrentHint'); }
      if (current) {

        await copyFile(target, join(transaction, `${index}.backup`));
        await chmod(join(transaction, `${index}.backup`), file.path === '.env.local' ? 0o600 : current.mode & 0o777);

      }
      const handle = await open(join(transaction, `${index}.staged`), 'wx', file.mode || 0o644);
      try {

        await handle.writeFile(file.content);
        await handle.sync();

      } finally { await handle.close(); }

    }
    for (let index = 0; index < files.length; index++) {

      const file = files[index];
      const target = join(root, file.path);
      const current = await safeTarget(root, file.path);
      if (!unchanged(snapshots.get(file.path), current)) { throw initializerError('concurrentHint'); }
      const parent = dirname(target);
      let parentExists = true;
      try { await lstat(parent); } catch { parentExists = false; }
      if (!parentExists) {

        const missing = [];
        let cursor = parent;
        while (cursor !== root) {

          try {

            await lstat(cursor); break;

          } catch {

            missing.push(cursor); cursor = dirname(cursor);

          }

        }
        for (const directory of missing.reverse()) {

          await mkdir(directory);
          createdDirectories.push(directory);

        }

      }
      await safeTarget(root, file.path);
      await rename(join(transaction, `${index}.staged`), target);
      applied.push({ index, target, existed: current !== null });

    }

  } catch (error) {

    try {

      for (const file of applied.reverse()) {

        if (file.existed) { await rename(join(transaction, `${file.index}.backup`), file.target); } else { await rm(file.target); }

      }
      for (const directory of createdDirectories.reverse()) { await rmdir(directory); }

    } catch {

      keepRecovery = true;
      throw initializerError('rollbackHint', { directory: transaction });

    }
    if (error.message === 'concurrentHint' || error.message === 'pathHint') { throw error; }
    throw initializerError('writeHint');

  } finally {

    if (!keepRecovery) { await rm(transaction, { recursive: true, force: true }); }
    await lockHandle.close();
    await rm(lock, { force: true });

  }

}
