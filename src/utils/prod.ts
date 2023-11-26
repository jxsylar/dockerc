import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import semver from 'semver';

import { executeCmd, executeWithSpin } from './exec.js';

const { red } = chalk;

export async function selectDockerImageByName(name: string) {
  const cmd = `docker image ls --format {{.Repository}}:{{.Tag}}  --filter reference=${name}*:*`;
  const { code, stderr, stdout } = executeCmd(cmd);
  if (code !== 0) {
    console.log(red(stderr.trim()));
    process.exit();
  }

  const options = stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((image) => {
      const [, version] = image.split(':');
      const coerce = semver.coerce(version)?.version;
      return {
        coerce,
        image,
        version,
      };
    });
  if (options.length <= 0) {
    console.log(red("Docker image doesn't exists, please build first."));
    process.exit();
  }

  // descending order, maybe version isn't semver version
  const canSemantic = [];
  const cantSemantic = [];
  for (const item of options) {
    if (item.coerce) {
      canSemantic.push(item);
    } else {
      cantSemantic.push(item);
    }
  }

  canSemantic.sort((a, b) => (semver.lt(a.version, b.version) ? 1 : -1));
  return select({
    choices: [...canSemantic, ...cantSemantic].map((item, index) => ({
      name: item.image + (index === 0 ? ' (latest)' : ''),
      value: item.image,
    })),
    message: 'Please select a image',
  });
}

export function startProd(image: string) {
  const [imageName, version] = image.split(':');
  process.env.IMAGE_NAME = imageName;
  process.env.VERSION = version;
  const cmd: string = 'docker compose up -d --force-recreate --build prod';
  executeWithSpin(cmd, {
    startText: 'Staring prod service:',
    succeedText: 'Start successfully',
  });
}
