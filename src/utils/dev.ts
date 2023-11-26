import { executeWithSpin } from './exec.js';

export function executeDev() {
  const cmd = 'docker compose up -d --force-recreate --build dev';
  executeWithSpin(cmd, {
    startText: 'Starting dev service:',
    succeedText: 'Start dev successfully',
  });
}
