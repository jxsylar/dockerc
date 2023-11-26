import chalk from 'chalk';
import ora from 'ora';
import sh from 'shelljs';

const { cyan, gray, red } = chalk;

const cwd = process.cwd();

const spinner = ora({ spinner: 'earth' });

/**
 * execute sh command
 */
export function executeCmd(cmd: string) {
  return sh.exec(cmd, { cwd, silent: true });
}

/**
 * execute sh command with spinner
 *
 * @example executeWithSpin(`date +"%Y-%m-%d %H:%M:%S"`)
 */
export function executeWithSpin(
  cmd: string,
  {
    startText = 'Execute command:',
    succeedSuffixText = null,
    succeedText = 'Succeeded:',
  }: {
    startText: string;
    succeedSuffixText?: null | string;
    succeedText: string;
  } = {} as never,
) {
  spinner.suffixText = gray(cmd);
  spinner.start(cyan(startText));

  const output = executeCmd(cmd);
  if (output.code !== 0) {
    spinner.suffixText = '';
    spinner.fail(red(output.stderr.trim()));
    process.exit(1);
  }

  const res = output.stdout.trim();
  spinner.succeed();
  spinner.suffixText = gray(succeedSuffixText ?? res);
  spinner.succeed(cyan(succeedText));
  spinner.suffixText = '';
}
