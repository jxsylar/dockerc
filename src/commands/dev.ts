import { Command } from '@oclif/core';

import { startDev } from '../utils/index.js';

export default class Dev extends Command {
  static description = 'Start `dev` service in `docker-compose.yaml` file.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    startDev();
  }
}
