import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';

const ASSET_DIR = 'dist/assets';

function findAsset(prefix, suffix) {
  const file = readdirSync(ASSET_DIR).find(name => name.startsWith(prefix) && name.endsWith(suffix));
  if (!file) throw new Error(`missing asset with pattern ${prefix}*${suffix}`);
  return join(ASSET_DIR, file);
}

const limits = [
  { label: 'main js', path: findAsset('main-', '.js'), maxGzipBytes: 7000 },
  { label: 'main css', path: findAsset('main-', '.css'), maxGzipBytes: 15000 },
  { label: 'wizard island js', path: findAsset('wizard-island-', '.js'), maxGzipBytes: 140000 }
];

let failed = false;

for (const limit of limits) {
  try {
    const rawBytes = statSync(limit.path).size;
    const gzBytes = gzipSync(readFileSync(limit.path)).length;
    const ok = gzBytes <= limit.maxGzipBytes;
    const status = ok ? 'OK' : 'FAIL';

    console.log(
      `${status}: ${limit.label} (${limit.path}) raw=${rawBytes}B gzip=${gzBytes}B limit=${limit.maxGzipBytes}B`
    );

    if (!ok) failed = true;
  } catch (err) {
    failed = true;
    console.error(`FAIL: unable to evaluate ${limit.path}: ${err.message}`);
  }
}

if (failed) {
  process.exitCode = 1;
  console.error('Bundle size budget check failed.');
} else {
  console.log('Bundle size budget check passed.');
}
