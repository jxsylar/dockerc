import { Command } from '@oclif/core';

import { executeDev } from '../utils/index.js';

export default class Dev extends Command {
  static description = 'Start `run` service in `docker-compose.yaml` file.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    executeDev();
  }
}
