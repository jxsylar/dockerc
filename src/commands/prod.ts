import { Command, Flags } from '@oclif/core';

import {
  maybeGetValueFromPackageFile,
  selectDockerImageByName,
  startProd,
} from '../utils/index.js';

export default class Prod extends Command {
  static description = [
    'Start `prod` service in `docker-compose.yaml` file.',
    'The docker image will be selected from the existing image list',
    'It will inject `IMAGE_NAME` and `VERSION` environment variables.',
  ].join('\n');

  static examples = [
    '<%= config.bin %> <%= command.id %>    # Use the `name` field of the `package.json` file in CWD.',
    '<%= config.bin %> <%= command.id %> --image example    # Specify image name',
  ];

  static flags = {
    image: Flags.string({
      description:
        'Docker image name. Use the `name` field of the `package.json` file in CWD.',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Prod);
    const name = maybeGetValueFromPackageFile('name', flags.image);
    const image = await selectDockerImageByName(name);
    startProd(image);
  }
}
