import { lstat, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

import { initializerError } from './options.mjs';

function validImage(content, extension) {

  if (extension === '.png') { return content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); }
  if (extension === '.jpg' || extension === '.jpeg') { return content[0] === 255 && content[1] === 216 && content[2] === 255; }
  if (extension === '.gif') { return /^GIF8[79]a/.test(content.subarray(0, 6).toString('ascii')); }
  if (extension === '.webp') { return content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP'; }
  if (extension === '.ico') { return content.length > 6 && content.readUInt32LE(0) === 65536 && content.readUInt16LE(4) > 0; }
  if (extension === '.svg') {

    const source = content.toString('utf8');
    const unsafe = /<!DOCTYPE|<!ENTITY|<[\w.-]+:|<(?:script|style|foreignObject|iframe|object|embed|animate\w*|set|audio|video)\b|\bon\w+\s*=|\bstyle\s*=|@import|(?:href|src)\s*=|url\s*\(\s*['"]?(?!#)|<\?(?!xml\s)|\\/i;
    return /<svg\b[^>]*>[\s\S]*<\/svg\s*>\s*$/i.test(source) && !unsafe.test(source);

  }
  return false;

}

export async function loadAsset(root, value, kind) {

  if (!value) { return null; }
  try {

    if (/^[a-z][a-z\d+.-]*:\/\//i.test(value) || /[\x00-\x1f\x7f]/.test(value)) { throw initializerError('assetHint'); }
    const path = resolve(root, value);
    const metadata = await lstat(path);
    const extension = extname(path).toLowerCase();
    if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size < 4 || metadata.size > 5 * 1024 * 1024 || (kind === 'icon' && extension === '.svg')) { throw initializerError('assetHint'); }
    const content = await readFile(path);
    if (!validImage(content, extension)) { throw initializerError('assetHint'); }
    return { path: `public/brand/project-${kind}${extension}`, publicPath: `/brand/project-${kind}${extension}`, content };

  } catch {
    throw initializerError('assetHint');
  }

}
