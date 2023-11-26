import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();

const { gray, red } = chalk;

export interface PackageJson {
  name: string;
  version: string;
}

function getPackageFilePath() {
  return path.join(cwd, 'package.json');
}

/**
 * Read `package.json` file content
 */
function readPackageFile(): PackageJson {
  const file = getPackageFilePath();
  if (!fs.existsSync(file)) {
    console.log(
      red(
        '`package.json` file does not exists, make sure the `package.json` file exists in the directory',
      ),
    );
    process.exit();
  }

  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function maybeGetValueFromPackageFile(
  key: keyof PackageJson,
  value?: string,
) {
  if (value) {
    console.log(gray(`Use custom ${key}: ${value}`));
    return value;
  }

  const v = readPackageFile()[key];
  console.log(gray(`Use \`package.json\` ${key}: ${v}`));
  return v;
}
