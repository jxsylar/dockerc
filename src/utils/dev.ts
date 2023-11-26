import { executeWithSpin } from './exec.js';

export function startDev() {
  const cmd: string = 'docker compose up -d --force-recreate --build dev';
  executeWithSpin(cmd, {
    startText: 'Starting dev service:',
    succeedText: 'Start successfully',
  });
}
