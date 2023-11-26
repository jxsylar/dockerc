import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import { executeCmd, executeWithSpin } from './exec.js';
import { maybeGetValueFromPackageFile } from './package.js';

const { red } = chalk;
const cwd = process.cwd();

export function getImage(imageName?: string, version?: string) {
  const name = maybeGetValueFromPackageFile('name', imageName);
  const v = maybeGetValueFromPackageFile('version', version);

  return `${name}:${v}`;
}

export function ifImageExists(imageName: string) {
  const cmd = `docker images -q ${imageName}`;
  const { stdout } = executeCmd(cmd);
  return Boolean(stdout);
}

export function confirmImageNotExists(imageName: string) {
  if (ifImageExists(imageName)) {
    console.log(
      red(`Docker image exists: ${imageName}, please release first.`),
    );
    process.exit(0);
  }
}

export function buildImage(image: string) {
  const [imageName, version] = image.split(':');
  process.env.IMAGE_NAME = imageName;
  process.env.VERSION = version;
  const cmd = `docker compose build`;
  executeWithSpin(cmd, {
    startText: 'Building docker image:',
    succeedSuffixText: image,
    succeedText: 'Build successfully, image:',
  });
}

export async function exportImage(image: string) {
  const outputDir = path.join('docker-images');
  fs.mkdirSync(outputDir, { recursive: true });
  const file = path.join(outputDir, `${image.replace(':', '_')}.tar`);
  const cmd = `docker save -o ${file} ${image}`;
  const displayFile = path.relative(cwd, file).split(path.sep).join('/');
  executeWithSpin(cmd, {
    startText: 'Exporting docker image:',
    succeedSuffixText: displayFile,
    succeedText: 'Export successfully, filename:',
  });
}
